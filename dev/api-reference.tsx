import { useEffect, useState } from 'react';
import type { ApiDocument, ApiProperty } from './api-types.js';
import { Select } from '../src/components/select.js';
import { Input } from '../src/components/input.js';
import { CodeBlock } from './code-block.js';

const loaders = import.meta.glob<ApiDocument>('./generated/api/*.json', {
  import: 'default',
});

function PropertyTable({
  properties,
  label,
  linkBase,
}: {
  properties: ApiProperty[];
  label: string;
  linkBase?: string;
}) {
  if (!properties.length) return <p className="api-empty">No properties.</p>;
  return (
    <div
      className="api-table-scroll"
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      <table className="api-table" role="table">
        <caption className="sr-only">{label}</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th role="columnheader" scope="col">
              Property
            </th>
            <th role="columnheader" scope="col">
              Type / description
            </th>
            <th role="columnheader" scope="col">
              Default
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {properties.map((property) => (
            <tr
              role="row"
              key={property.name}
              id={linkBase ? `api-property-${property.name}` : undefined}
            >
              <th role="rowheader" scope="row">
                {linkBase ? (
                  <a
                    href={`${linkBase}&prop=${encodeURIComponent(property.name)}`}
                  >
                    <code>{property.name}</code>
                  </a>
                ) : (
                  <code>{property.name}</code>
                )}
                <small>
                  {property.required ? 'Required' : 'Optional'}
                  {property.deprecated ? ' · Deprecated' : ''}
                </small>
              </th>
              <td role="cell" data-label="Type / description">
                <code className="api-property-type">{property.type}</code>
                {property.expandedType && (
                  <details className="api-expanded-type">
                    <summary>Compiler expansion</summary>
                    <p>
                      Upstream internal names may appear here. Use the public
                      type above in application code.
                    </p>
                    <CodeBlock
                      language="typescript"
                      code={property.expandedType}
                    />
                  </details>
                )}
                {property.description && <p>{property.description}</p>}
                <small>{property.origin}</small>
              </td>
              <td role="cell" data-label="Default">
                <code>{property.defaultValue || '—'}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Reference({
  document,
  componentId,
  partName,
  propertyName,
}: {
  document: ApiDocument;
  componentId: string;
  partName: string | null;
  propertyName: string | null;
}) {
  const [query, setQuery] = useState(propertyName ?? '');
  const [nativeOpen, setNativeOpen] = useState(false);
  const part =
    document.parts.find((item) => item.name === partName) ?? document.parts[0]!;
  const partLink = (name: string) =>
    `#components/${componentId}/api?part=${encodeURIComponent(name)}`;
  useEffect(() => {
    setQuery(propertyName ?? '');
    setNativeOpen(
      Boolean(
        propertyName &&
        part.props.find((prop) => prop.name === propertyName)?.native,
      ),
    );
  }, [part.name, propertyName]);
  useEffect(() => {
    if (propertyName)
      requestAnimationFrame(() => {
        window.document
          .getElementById(`api-property-${propertyName}`)
          ?.scrollIntoView({ block: 'start' });
      });
  }, [propertyName, nativeOpen]);
  const filtered = part.props.filter((property) =>
    `${property.name} ${property.type} ${property.description}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const properties = filtered.filter((property) => !property.native);
  const native = filtered.filter((property) => property.native);
  const otherParts = query.trim()
    ? document.parts.filter(
        (item) =>
          item !== part &&
          item.props.some((prop) =>
            `${prop.name} ${prop.type} ${prop.description}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          ),
      )
    : [];
  return (
    <section
      className="api-reference"
      aria-label={`${document.name} API reference`}
    >
      <div className="api-intro">
        <h2>API reference</h2>
        <CodeBlock
          code={`import { ${document.name} } from '${document.importPath}';`}
        />
        <details className="reference-method">
          <summary>About this reference</summary>
          <p>
            Types come from the public TypeScript API. Defaults come from
            parameter initializers and JSDoc. Conditional requirements remain in
            the full type declarations. Complex inherited types use public
            indexed access; their compiler expansions are available separately.
            Imports and helper types are included in the full module
            declarations below.
          </p>
        </details>
      </div>
      {document.parts.length > 1 && (
        <div className="api-part-control">
          <label htmlFor="api-part">Component part or function</label>
          <Select.Root
            items={Object.fromEntries(
              document.parts.map((part) => [part.name, part.name]),
            )}
            value={part.name}
            onValueChange={(value) => {
              if (value) window.location.hash = partLink(value);
              setQuery('');
              setNativeOpen(false);
            }}
          >
            <Select.Trigger id="api-part">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {document.parts.map((part) => (
                <Select.Item key={part.name} value={part.name}>
                  {part.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      )}
      <section
        className="specimen api-part"
        aria-label={`${part.name} properties`}
      >
        <div className="specimen-heading">
          <h3>{part.name}</h3>
          <span className="quiet-label">
            {part.kind === 'function' ? 'FUNCTION' : part.propsType}
          </span>
        </div>
        {part.description && (
          <p className="api-description">{part.description}</p>
        )}
        <div className="api-source">
          <code>
            {part.source.startsWith('node_modules/')
              ? 'Inherited library declaration'
              : part.source}
          </code>
          {part.props.some(
            (prop) =>
              prop.origin === 'Base UI' || prop.origin === 'React DayPicker',
          ) && (
            <a href={document.upstream} target="_blank" rel="noreferrer">
              Upstream reference ↗
            </a>
          )}
        </div>
        {part.kind === 'function' && (
          <CodeBlock
            language="typescript"
            code={part.signatures.join('\n\n')}
          />
        )}
        {!!part.props.length && (
          <div className="api-search">
            <label htmlFor="api-property-filter" className="api-filter-label">
              Search {part.name} properties
            </label>
            <Input
              id="api-property-filter"
              aria-label="Filter API properties"
              placeholder="Find a property…"
              value={query}
              onValueChange={setQuery}
            />
            <span className="quiet-label">
              {filtered.length}{' '}
              {filtered.length === 1 ? 'PROPERTY' : 'PROPERTIES'}
            </span>
          </div>
        )}
        {!!properties.length && (
          <PropertyTable
            properties={properties}
            label={`${part.name} component properties`}
            linkBase={partLink(part.name)}
          />
        )}
        {!!native.length && (
          <details
            className="api-native"
            open={nativeOpen}
            onToggle={(event) => setNativeOpen(event.currentTarget.open)}
          >
            <summary>React and DOM properties ({native.length})</summary>
            {nativeOpen && (
              <PropertyTable
                properties={native}
                label={`${part.name} React and DOM properties`}
                linkBase={partLink(part.name)}
              />
            )}
          </details>
        )}
        {!!part.props.length && !filtered.length && (
          <p className="api-empty" role="status">
            No matching properties.
          </p>
        )}
        {otherParts.length > 0 && (
          <div className="api-other-matches">
            <p>Also found in:</p>
            {otherParts.map((item) => (
              <a
                key={item.name}
                href={`${partLink(item.name)}&prop=${encodeURIComponent(query)}`}
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
        {!part.props.length && part.kind === 'component' && (
          <p className="api-empty">This part takes no props.</p>
        )}
        {!!part.returns.length && (
          <>
            <h4 className="api-subheading">Return value</h4>
            <PropertyTable
              properties={part.returns}
              label={`${part.name} return value`}
            />
          </>
        )}
        {part.kind === 'component' && (
          <details className="api-declaration">
            <summary>Full component signature</summary>
            <CodeBlock
              language="typescript"
              code={part.signatures.join('\n\n')}
            />
          </details>
        )}
      </section>
      {!!document.types.length && (
        <section className="specimen api-types" aria-label="Exported types">
          <div className="specimen-heading">
            <h3>Exported types</h3>
          </div>
          {document.types.map((type) => (
            <details className="api-declaration" key={type.name}>
              <summary>{type.name}</summary>
              {type.description && (
                <p className="api-description">{type.description}</p>
              )}
              <CodeBlock language="typescript" code={type.declaration} />
              {!!type.props.length && (
                <PropertyTable
                  properties={type.props}
                  label={`${type.name} properties`}
                />
              )}
            </details>
          ))}
        </section>
      )}
      {!!document.values.length && (
        <section className="specimen">
          <div className="specimen-heading">
            <h3>Additional exports</h3>
          </div>
          <ul className="api-values">
            {document.values.map((value) => (
              <li key={value.name}>
                <code>
                  {value.name}: {value.type}
                </code>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section
        className="specimen api-module"
        aria-label="Module declarations"
        id="module-declarations"
      >
        <details className="api-declaration">
          <summary>Full module declarations</summary>
          <p className="api-description">
            Emitted by TypeScript, including required imports and helper
            declarations. Relative imports are resolved from this component's
            installed declaration file.
          </p>
          <CodeBlock language="typescript" code={document.declaration} />
        </details>
      </section>
    </section>
  );
}

export function ApiReference({
  componentId,
  partName,
  propertyName,
}: {
  componentId: string;
  partName: string | null;
  propertyName: string | null;
}) {
  const [document, setDocument] = useState<ApiDocument | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let current = true;
    const loader = loaders[`./generated/api/${componentId}.json`];
    if (loader)
      void loader()
        .then((value) => {
          if (current) setDocument(value);
        })
        .catch(() => {
          if (current) setFailed(true);
        });
    else setFailed(true);
    return () => {
      current = false;
    };
  }, [componentId]);
  if (failed)
    return (
      <p role="status">
        API reference could not be loaded. Reload the page to try again.
      </p>
    );
  if (!document) return <p role="status">Loading API reference…</p>;
  return (
    <Reference
      document={document}
      componentId={componentId}
      partName={partName}
      propertyName={propertyName}
    />
  );
}
