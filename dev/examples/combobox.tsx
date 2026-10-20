import { useEffect, useState } from 'react';
import { Combobox } from '../../src/components/combobox.js';
import { Field } from '../../src/components/field.js';
import { Button } from '../../src/components/button.js';
import { Dialog } from '../../src/components/dialog.js';
import { Spinner } from '../../src/components/spinner.js';
import { CheckControl } from '../controls.js';
import { CodeBlock } from '../code-block.js';

interface Group {
  id: string;
  label: string;
  description: string;
}
const groups: Group[] = [
  { id: 'cs-101', label: 'CS-101', description: 'Computer science · Year 1' },
  { id: 'cs-102', label: 'CS-102', description: 'Computer science · Year 1' },
  { id: 'cs-201', label: 'CS-201', description: 'Computer science · Year 2' },
  { id: 'design-101', label: 'DESIGN-101', description: 'Design · Year 1' },
];

export function GroupSearch() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Group[]>([]);
  const [selected, setSelected] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);
  const [fail, setFail] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    setError('');
    setItems([]);
    if (query.trim().length < 2) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      if (fail) setError('Group search is unavailable. Try again.');
      else
        setItems(
          groups.filter((group) =>
            group.label.toLowerCase().includes(query.trim().toLowerCase()),
          ),
        );
    }, 350);
    return () => clearTimeout(timer);
  }, [query, fail]);
  return (
    <div className="example-form">
      <Field.Root>
        <Combobox.Root
          items={items}
          filter={null}
          value={selected}
          onValueChange={setSelected}
          inputValue={query}
          onInputValueChange={setQuery}
          itemToStringLabel={(item) => item.label}
          itemToStringValue={(item) => item.id}
          isItemEqualToValue={(a, b) => a.id === b.id}
        >
          <Field.Label>Group name</Field.Label>
          <Combobox.InputGroup className="combobox-example-input">
            <Combobox.Input
              placeholder="e.g. CS-101"
              aria-busy={loading || undefined}
              autoComplete="off"
            />
            <Combobox.Clear
              render={
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Clear group search"
                />
              }
            >
              ×
            </Combobox.Clear>
          </Combobox.InputGroup>
          <Combobox.Content positionerProps={{ align: 'start' }}>
            <Combobox.Status>
              {loading ? (
                <span className="inline-status">
                  <Spinner label={null} size="sm" />
                  Searching groups…
                </span>
              ) : (
                error ||
                (query.trim().length < 2 ? 'Enter at least 2 characters.' : '')
              )}
            </Combobox.Status>
            <Combobox.Empty>
              {!loading && !error && query.trim().length >= 2
                ? 'No groups found.'
                : undefined}
            </Combobox.Empty>
            <Combobox.List>
              {(group: Group) => (
                <Combobox.Item key={group.id} value={group}>
                  <strong>{group.label}</strong>
                  <small className="option-description">
                    {group.description}
                  </small>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Content>
          <Field.Description>
            Search the example directory. Requests and debouncing belong to the
            app.
          </Field.Description>
        </Combobox.Root>
      </Field.Root>
      <CheckControl checked={fail} onCheckedChange={setFail}>
        Simulate search error
      </CheckControl>
      <p className="playground-feedback" role="status">
        {selected ? `Selected ${selected.label}.` : 'No group selected.'}
      </p>
    </div>
  );
}

export function ComboboxExamples() {
  return (
    <>
      <section className="specimen" aria-label="Async group search">
        <div className="specimen-heading">
          <h2>Async search</h2>
          <span className="quiet-label">APP-OWNED DATA</span>
        </div>
        <div className="form-stage">
          <GroupSearch />
        </div>
      </section>
      <section className="specimen">
        <div className="specimen-heading">
          <h2>Search in a dialog</h2>
        </div>
        <div className="playground-stage">
          <Dialog.Root>
            <Dialog.Trigger render={<Button variant="secondary" />}>
              Find a group
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Find a group</Dialog.Title>
              <Dialog.Description>
                Search and select using the keyboard.
              </Dialog.Description>
              <GroupSearch />
              <div className="example-actions">
                <Dialog.Close render={<Button variant="secondary" />}>
                  Close search
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </section>
      <CodeBlock
        code={`import { Combobox } from 'unlikely-ui/combobox';\n\n<Combobox.Root items={results} filter={null}\n  inputValue={query} onInputValueChange={setQuery}\n  value={selected} onValueChange={setSelected}\n  itemToStringLabel={item => item.label}>\n  <Combobox.Input aria-label="Group name" />\n  <Combobox.Content>\n    <Combobox.Status>{loading ? 'Searching…' : error}</Combobox.Status>\n    <Combobox.Empty>{!loading && !error ? 'No groups found.' : null}</Combobox.Empty>\n    <Combobox.List>{item => (\n      <Combobox.Item key={item.id} value={item}>{item.label}</Combobox.Item>\n    )}</Combobox.List>\n  </Combobox.Content>\n</Combobox.Root>`}
      />
    </>
  );
}
