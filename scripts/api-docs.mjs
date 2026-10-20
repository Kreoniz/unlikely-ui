import ts from 'typescript';
import {
  readFile,
  mkdir,
  readdir,
  rm,
  writeFile,
  rename,
} from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dev/generated/api');
const formatFlags = ts.TypeFormatFlags.NoTruncation;
const commonProps = new Set([
  'children',
  'className',
  'style',
  'ref',
  'aria-label',
  'aria-labelledby',
]);

/** Reflect the installed public types, including compound parts and aliases. */
export async function generateApi() {
  const manifest = JSON.parse(
    await readFile(resolve(root, 'package.json'), 'utf8'),
  );
  const modules = Object.entries(manifest.exports)
    .filter(([name, entry]) => name !== '.' && typeof entry === 'object')
    .map(([name, entry]) => ({
      id: name.slice(2),
      declarationPath: resolve(root, entry.types),
      path: resolve(
        root,
        entry.import.replace('./dist/', './src/').replace(/\.js$/, '.tsx'),
      ),
    }));
  const config = ts.readConfigFile(
    resolve(root, 'tsconfig.json'),
    ts.sys.readFile,
  );
  if (config.error)
    throw new Error(
      ts.flattenDiagnosticMessageText(config.error.messageText, '\n'),
    );
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  const program = ts.createProgram(
    modules.map((entry) => entry.path),
    {
      ...parsed.options,
      declaration: true,
      emitDeclarationOnly: true,
      noEmit: false,
      rootDir: resolve(root, 'src'),
      outDir: resolve(root, 'dist'),
    },
  );
  const checker = program.getTypeChecker();
  const declarations = new Map();
  const emitted = program.emit(undefined, (file, content) => {
    declarations.set(resolve(file), content);
  });
  const diagnostics = [
    ...program.getSyntacticDiagnostics(),
    ...program.getSemanticDiagnostics(),
    ...emitted.diagnostics,
  ];
  if (diagnostics.length) {
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCanonicalFileName: (file) => file,
        getCurrentDirectory: () => root,
        getNewLine: () => '\n',
      }),
    );
  }
  const text = (type, location) =>
    checker.typeToString(type, location, formatFlags);
  const documentation = (symbol) =>
    ts.displayPartsToString(symbol.getDocumentationComment(checker));
  const tags = (symbol) => symbol.getJsDocTags(checker);
  const tagText = (tag) => ts.displayPartsToString(tag?.text);
  const unalias = (symbol) =>
    symbol.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(symbol)
      : symbol;
  const source = (node) => {
    const file = node.getSourceFile();
    return `${relative(root, file.fileName)}:${file.getLineAndCharacterOfPosition(node.getStart()).line + 1}`;
  };
  const origin = (symbol) => {
    const file = symbol.declarations?.[0]?.getSourceFile().fileName ?? '';
    if (
      file.includes('/@types/react/') ||
      /\/typescript\/lib\/lib\./.test(file)
    )
      return 'React / DOM';
    if (file.includes('/@base-ui/')) return 'Base UI';
    if (file.includes('/react-day-picker/')) return 'React DayPicker';
    return 'unlikely ui';
  };
  const defaults = (signature) => {
    const result = new Map();
    const parameter = signature.getDeclaration()?.parameters[0];
    if (parameter && ts.isObjectBindingPattern(parameter.name)) {
      for (const binding of parameter.name.elements) {
        if (binding.initializer)
          result.set(
            (binding.propertyName ?? binding.name)
              .getText()
              .replace(/^['"]|['"]$/g, ''),
            binding.initializer.getText(),
          );
      }
    }
    return result;
  };
  function properties(type, location, initializers = new Map(), reference) {
    return checker
      .getPropertiesOfType(type)
      .map((symbol) => {
        const propertyType = checker.getTypeOfSymbolAtLocation(
          symbol,
          location,
        );
        const propertyTags = tags(symbol);
        const expandedType = text(propertyType, location);
        // Private paths are not consumer imports. Preserve the exact public
        // lookup instead of guessing aliases or simplifying ref constraints.
        const useReference =
          reference &&
          (/import\("[./]/.test(expandedType) ||
            expandedType.includes('DO_NOT_USE_OR_YOU_WILL_BE_FIRED') ||
            expandedType.length > 400);
        const inheritedDefault = tagText(
          propertyTags.find((tag) =>
            ['default', 'defaultValue'].includes(tag.name),
          ),
        );
        return {
          name: symbol.name,
          type: useReference
            ? `${reference}[${JSON.stringify(symbol.name)}]`
            : expandedType,
          ...(useReference ? { expandedType } : {}),
          required: !(symbol.flags & ts.SymbolFlags.Optional),
          description: documentation(symbol),
          defaultValue: initializers.get(symbol.name) ?? inheritedDefault ?? '',
          deprecated: propertyTags.some((tag) => tag.name === 'deprecated'),
          origin: origin(symbol),
          native:
            origin(symbol) === 'React / DOM' && !commonProps.has(symbol.name),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'en'));
  }
  function callable(name, type, symbol, file) {
    const signatures = type.getCallSignatures();
    if (!signatures.length)
      throw new Error(`No callable signature for ${name}`);
    const signature = signatures[0];
    const declaration = signature.getDeclaration() ?? file;
    const parameter = signature.getParameters()[0];
    const propsType =
      parameter && checker.getTypeOfSymbolAtLocation(parameter, declaration);
    const component = /^[A-Z]/.test(name.split('.').at(-1));
    const typeArguments = signature.typeParameters?.map((type) =>
      text(type, declaration),
    );
    const callableReference = `typeof ${name}${typeArguments?.length ? `<${typeArguments.join(', ')}>` : ''}`;
    const propsSymbol = propsType?.aliasSymbol ?? propsType?.symbol;
    const publicProps =
      propsSymbol &&
      checker
        .getExportsOfModule(checker.getSymbolAtLocation(file))
        .some((item) => unalias(item) === propsSymbol);
    const propsReference = publicProps
      ? text(propsType, file)
      : `NonNullable<Parameters<${callableReference}>[0]>`;
    return {
      name,
      kind: component ? 'component' : 'function',
      description: documentation(unalias(symbol)),
      source: source(declaration),
      signatures: signatures.map((item) =>
        checker.signatureToString(item, file, formatFlags),
      ),
      propsType: propsType ? text(propsType, file) : '',
      props: propsType
        ? properties(
            checker.getNonNullableType(propsType),
            file,
            component ? defaults(signature) : undefined,
            propsReference,
          )
        : [],
      returns: component
        ? []
        : properties(
            signature.getReturnType(),
            file,
            undefined,
            `ReturnType<${callableReference}>`,
          ),
    };
  }
  const documents = {};
  for (const entry of modules) {
    const file = program.getSourceFile(entry.path);
    if (!file) throw new Error(`Source missing for ${entry.id}`);
    const moduleDeclaration = declarations.get(entry.declarationPath);
    if (!moduleDeclaration)
      throw new Error(`Declaration missing for ${entry.id}`);
    const exports = checker.getExportsOfModule(
      checker.getSymbolAtLocation(file),
    );
    const name = entry.id
      .split('-')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join('');
    const primary = exports.find((symbol) => symbol.name === name);
    if (!primary) throw new Error(`Primary export ${name} is missing`);
    const mainType = checker.getTypeOfSymbolAtLocation(
      primary,
      primary.valueDeclaration ?? file,
    );
    const parts = mainType.getCallSignatures().length
      ? [callable(name, mainType, primary, file)]
      : mainType
          .getProperties()
          .map((symbol) =>
            callable(
              `${name}.${symbol.name}`,
              checker.getTypeOfSymbolAtLocation(
                symbol,
                symbol.valueDeclaration ?? file,
              ),
              symbol,
              file,
            ),
          );
    const types = [];
    const values = [];
    for (const exported of exports.filter((symbol) => symbol !== primary)) {
      const symbol = unalias(exported);
      const declaration = symbol.declarations?.[0];
      if (!declaration) continue;
      if (symbol.flags & ts.SymbolFlags.Type) {
        const type = checker.getDeclaredTypeOfSymbol(symbol);
        types.push({
          name: exported.name,
          declaration: declaration.getText(),
          description: documentation(symbol),
          props:
            !exported.name.endsWith('Props') &&
            type.flags & (ts.TypeFlags.Object | ts.TypeFlags.Intersection)
              ? properties(type, file, undefined, exported.name)
              : [],
        });
      } else {
        values.push({
          name: exported.name,
          type: text(
            checker.getTypeOfSymbolAtLocation(symbol, declaration),
            file,
          ),
        });
      }
    }
    documents[entry.id] = {
      name,
      importPath: `${manifest.name}/${entry.id}`,
      declaration: moduleDeclaration,
      upstream:
        entry.id === 'calendar'
          ? 'https://daypicker.dev/api'
          : `https://base-ui.com/react/components/${entry.id === 'physical-button' ? 'button' : entry.id}`,
      parts,
      types: types.sort((a, b) => a.name.localeCompare(b.name, 'en')),
      values,
    };
  }
  return documents;
}

export async function writeApi(documents) {
  await mkdir(output, { recursive: true });
  for (const old of await readdir(output)) {
    if (old.endsWith('.json') && !documents[old.slice(0, -5)])
      await rm(resolve(output, old));
  }
  for (const [id, document] of Object.entries(documents)) {
    const path = resolve(output, `${id}.json`);
    const content = JSON.stringify(document, null, 2) + '\n';
    if ((await readFile(path, 'utf8').catch(() => '')) === content) continue;
    const temporary = `${path}.${process.pid}.tmp`;
    await writeFile(temporary, content);
    await rename(temporary, path);
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const documents = await generateApi();
  await writeApi(documents);
  console.log(
    `Generated API references for ${Object.keys(documents).length} components and ${Object.values(documents).reduce((count, document) => count + document.parts.length, 0)} public parts/functions.`,
  );
}
