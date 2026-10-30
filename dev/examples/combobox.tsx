import { MultipleGroups } from './multiple-groups.js';
import multipleGroupsSource from './multiple-groups.tsx?raw';
import { consumerSource } from '../example-code.js';
import { useEffect, useState } from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxStatus,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from '../../src/components/combobox.js';
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '../../src/components/field.js';
import { Button } from '../../src/components/button.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../../src/components/dialog.js';
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
      <Field>
        <Combobox
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
          <FieldLabel>Group name</FieldLabel>
          <ComboboxInput
            placeholder="e.g. CS-101"
            aria-busy={loading || undefined}
            autoComplete="off"
            showClear
            clearLabel="Clear group search"
          />
          <ComboboxContent positionerProps={{ align: 'start' }}>
            <ComboboxStatus>
              {loading ? (
                <span className="inline-status">
                  <Spinner label={null} size="sm" />
                  Searching groups…
                </span>
              ) : (
                error ||
                (query.trim().length < 2 ? 'Enter at least 2 characters.' : '')
              )}
            </ComboboxStatus>
            <ComboboxEmpty>
              {!loading && !error && query.trim().length >= 2
                ? 'No groups found.'
                : undefined}
            </ComboboxEmpty>
            <ComboboxList>
              {(group: Group) => (
                <ComboboxItem key={group.id} value={group}>
                  <strong>{group.label}</strong>
                  <small className="option-description">
                    {group.description}
                  </small>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
          <FieldDescription>
            Search the example directory. Requests and debouncing belong to the
            app.
          </FieldDescription>
        </Combobox>
      </Field>
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
          <Dialog>
            <DialogTrigger render={<Button variant="secondary" />}>
              Find a group
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Find a group</DialogTitle>
              <DialogDescription>
                Search and select using the keyboard.
              </DialogDescription>
              <GroupSearch />
              <div className="example-actions">
                <DialogClose render={<Button variant="secondary" />}>
                  Close search
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
      <CodeBlock
        code={`import { Combobox, ComboboxInput, ComboboxContent, ComboboxStatus, ComboboxEmpty, ComboboxList, ComboboxItem } from 'unlikely-ui/combobox';\n\n<Combobox items={results} filter={null}\n  inputValue={query} onInputValueChange={setQuery}\n  value={selected} onValueChange={setSelected}\n  itemToStringLabel={item => item.label}>\n  <ComboboxInput aria-label="Group name" />\n  <ComboboxContent>\n    <ComboboxStatus>{loading ? 'Searching…' : error}</ComboboxStatus>\n    <ComboboxEmpty>{!loading && !error ? 'No groups found.' : null}</ComboboxEmpty>\n    <ComboboxList>{item => (\n      <ComboboxItem key={item.id} value={item}>{item.label}</ComboboxItem>\n    )}</ComboboxList>\n  </ComboboxContent>\n</Combobox>`}
      />
      <section className="specimen" aria-label="Multiple group selection">
        <div className="specimen-heading">
          <h2>Multiple selection</h2>
        </div>
        <div className="form-stage">
          <MultipleGroups />
        </div>
      </section>
      <CodeBlock code={consumerSource(multipleGroupsSource)} />
    </>
  );
}
