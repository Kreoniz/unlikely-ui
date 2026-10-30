import { useState } from 'react';
import {
  Field,
  FieldLabel,
  FieldDescription,
} from '../../src/components/field.js';
import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  useComboboxAnchor,
} from '../../src/components/combobox.js';

/** App-owned composition; all required styles come from the shared controls. */
export function MultipleGroups() {
  const [selected, setSelected] = useState<string[]>(['CS-101']);
  const anchor = useComboboxAnchor();
  return (
    <Field>
      <FieldLabel>Groups to compare</FieldLabel>
      <Combobox
        multiple
        items={['CS-101', 'CS-102', 'CS-201', 'DESIGN-101']}
        value={selected}
        onValueChange={setSelected}
      >
        <ComboboxChips ref={anchor}>
          {selected.map((group) => (
            <ComboboxChip key={group} removeLabel={`Remove ${group}`}>
              {group}
            </ComboboxChip>
          ))}
          <ComboboxChipsInput />
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxList>
            {(group: string) => (
              <ComboboxItem key={group} value={group}>
                {group}
              </ComboboxItem>
            )}
          </ComboboxList>
          <ComboboxEmpty>No matching groups</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
      <FieldDescription>
        Select several groups; remove a chip to clear one selection.
      </FieldDescription>
    </Field>
  );
}
