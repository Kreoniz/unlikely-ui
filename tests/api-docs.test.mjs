import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { fileURLToPath } from 'node:url';
import { generateApi } from '../scripts/api-docs.mjs';

const documents = await generateApi();
const part = (id, name) =>
  documents[id].parts.find((part) => part.name === name);
const prop = (id, name, property) =>
  part(id, name).props.find((prop) => prop.name === property);

test('every component subpath has a generated reference and no private exports leak in', async () => {
  const manifest = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  );
  const expected = Object.entries(manifest.exports)
    .filter(([name, value]) => name !== '.' && typeof value === 'object')
    .map(([name]) => name.slice(2));
  assert.deepEqual(Object.keys(documents), expected);
  for (const document of Object.values(documents)) {
    assert.ok(document.parts.length);
    assert.ok(!document.parts.some((part) => part.name.includes('Base')));
  }
  assert.ok(!JSON.stringify(documents).includes('/home/'));
});

test('compound components, inherited props, native attributes and generic callbacks are preserved', () => {
  assert.ok(
    prop('dialog', 'Dialog.Root', 'onOpenChange').type.includes('eventDetails'),
  );
  assert.equal(
    prop('dialog', 'Dialog.Content', 'portalProps').origin,
    'unlikely ui',
  );
  assert.equal(prop('dialog', 'Dialog.Content', 'onPaste').native, true);
  assert.ok(
    prop('select', 'Select.Root', 'onValueChange').type.includes('Value'),
  );
  assert.ok(
    prop('select', 'Select.Root', 'onValueChange').type.includes('Multiple'),
  );
  assert.ok(
    part('select', 'Select.Root').signatures[0].includes('<Value, Multiple'),
  );
});

test('wrapper defaults and documentation override upstream declarations', () => {
  assert.equal(
    prop('button', 'Button', 'focusableWhenDisabled').defaultValue,
    'loading',
  );
  assert.equal(
    prop('physical-button', 'PhysicalButton', 'shape').defaultValue,
    "'round'",
  );
  assert.equal(
    prop('tooltip', 'Tooltip.Provider', 'delay').defaultValue,
    '300',
  );
  assert.match(
    prop('tooltip', 'Tooltip.Trigger', 'delay').defaultValue,
    /Provider delay, or 300/,
  );
  assert.equal(
    prop('tooltip', 'Tooltip.Provider', 'closeDelay').defaultValue,
    '0',
  );
  assert.equal(prop('tooltip', 'Tooltip.Provider', 'timeout'), undefined);
  assert.equal(prop('date-picker', 'DatePicker', 'label').required, true);
  assert.match(
    prop('date-picker', 'DatePicker', 'label').description,
    /accessible name/,
  );
});

test('helper types, conditional accessibility constraints and manager return methods remain available', () => {
  assert.match(
    documents.button.types.find((type) => type.name === 'ButtonProps')
      .declaration,
    /aria-label/,
  );
  assert.equal(
    documents['physical-button'].types.find(
      (type) => type.name === 'PhysicalButtonColors',
    ).props.length,
    6,
  );
  assert.ok(
    part('toast', 'Toast.useToastManager').returns.some(
      (property) =>
        property.name === 'add' &&
        property.type.includes('ToastManagerAddOptions'),
    ),
  );
  assert.ok(
    part('combobox', 'Combobox.useFilter').returns.some(
      (property) => property.name === 'contains',
    ),
  );
  for (const name of ['locale', 'multiple', 'value', 'sensitivity']) {
    assert.ok(prop('combobox', 'Combobox.useFilter', name), name);
  }
  assert.match(
    part('combobox', 'Combobox.useFilter').signatures[0],
    /options\?/,
  );
  assert.deepEqual(
    documents.calendar.values.map((value) => value.name).sort(),
    ['enUS', 'ru'],
  );
  for (const value of documents.calendar.values) {
    assert.equal(value.type, 'import("react-day-picker").DayPickerLocale');
  }
});

test('declarations include imports and helpers while property summaries keep private compiler types separate', () => {
  assert.match(documents.button.declaration, /import.*BaseButton/);
  assert.match(documents.button.declaration, /interface ButtonBaseProps/);
  assert.match(documents.button.declaration, /declare function Button/);
  assert.doesNotMatch(
    documents.tooltip.declaration,
    /createContext|useState|setOpen/,
  );
  for (const document of Object.values(documents)) {
    assert.ok(document.declaration);
    for (const item of [
      ...document.parts.flatMap((part) => [...part.props, ...part.returns]),
      ...document.types.flatMap((type) => type.props),
    ]) {
      assert.doesNotMatch(
        item.type,
        /node_modules|DO_NOT_USE_OR_YOU_WILL_BE_FIRED/,
      );
    }
  }
  assert.match(
    prop('tooltip', 'Tooltip.Trigger', 'ref').type,
    /Ref<HTMLButtonElement>/,
  );
  assert.match(
    prop('dialog', 'Dialog.Trigger', 'ref').expandedType,
    /DO_NOT_USE_OR_YOU_WILL_BE_FIRED/,
  );
  assert.match(
    prop('tooltip', 'Tooltip.Root', 'children').expandedType,
    /PayloadChildRenderFunction/,
  );
});

test('generated public indexed-access types compile against the real public modules', () => {
  const path = fileURLToPath(
    new URL('../.local/api-reference-types.ts', import.meta.url),
  );
  const code = `
    import { Dialog } from '../src/components/dialog.js';
    import type { TooltipRootProps } from '../src/components/tooltip.js';
    type Child<Payload> = ${prop('tooltip', 'Tooltip.Root', 'children').type};
    type TriggerRef<Payload> = ${prop('dialog', 'Dialog.Trigger', 'ref').type};
    const child: Child<string> = ({ payload }) => payload?.toUpperCase();
    const ref: TriggerRef<unknown> = { current: document.createElement('button') };
    void [child, ref];
  `;
  const options = {
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
  };
  const host = ts.createCompilerHost(options);
  const read = host.readFile;
  const exists = host.fileExists;
  host.readFile = (file) => (file === path ? code : read(file));
  host.fileExists = (file) => file === path || exists(file);
  const program = ts.createProgram([path], options, host);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnostics(diagnostics, host));
});
