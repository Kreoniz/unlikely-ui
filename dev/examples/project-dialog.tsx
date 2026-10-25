import { useRef, useState } from 'react';
import { Button } from '../../src/components/button.js';
import { Dialog } from '../../src/components/dialog.js';
import { Popover } from '../../src/components/popover.js';
import { Field } from '../../src/components/field.js';
import { Input } from '../../src/components/input.js';
import { Textarea } from '../../src/components/textarea.js';

export function ProjectForm({
  onSave,
  onCancel,
}: {
  onSave: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLElement>(null);
  const invalid = submitted && !name.trim();
  return (
    <form
      className="example-form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        if (!name.trim()) {
          nameRef.current?.focus();
          return;
        }
        onSave(name.trim());
      }}
    >
      <Field.Root name="projectName" invalid={invalid}>
        <Field.Label>Project name</Field.Label>
        <Input
          ref={nameRef}
          value={name}
          onValueChange={setName}
          required
          autoComplete="off"
          placeholder="e.g. Campus"
        />
        <Field.Description>
          Required. You can change this later.
        </Field.Description>
        <Field.Error match={invalid}>Enter a project name.</Field.Error>
      </Field.Root>
      <Field.Root name="notes">
        <Field.Label>
          Notes <span className="optional-label">(optional)</span>
        </Field.Label>
        <Textarea
          value={notes}
          onValueChange={setNotes}
          rows={3}
          placeholder="Describe the project…"
        />
      </Field.Root>
      <div className="example-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create project</Button>
      </div>
    </form>
  );
}

export function ProjectDialog() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState('');
  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger render={<Button />}>New project</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Create project</Dialog.Title>
          <Dialog.Description>
            Add a name and optional notes.
          </Dialog.Description>
          <ProjectForm
            onSave={(name) => {
              setSaved(`Created ${name}.`);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
          <div className="dialog-help">
            <Popover.Root>
              <Popover.Trigger render={<Button variant="ghost" size="sm" />}>
                Project visibility
              </Popover.Trigger>
              <Popover.Content>
                <Popover.Title>Private by default</Popover.Title>
                <Popover.Description>
                  Only invited members can access this example project.
                </Popover.Description>
                <Popover.Close
                  render={<Button variant="secondary" size="sm" />}
                >
                  Close details
                </Popover.Close>
              </Popover.Content>
            </Popover.Root>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      <p className="playground-feedback" role="status">
        {saved || 'Open the dialog to complete the form.'}
      </p>
    </>
  );
}
