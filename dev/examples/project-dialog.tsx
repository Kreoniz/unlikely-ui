import { useRef, useState } from 'react';
import { Button } from '../../src/components/button.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../../src/components/dialog.js';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from '../../src/components/popover.js';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../../src/components/field.js';
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
      style={{ display: 'grid', gap: 'var(--u-space-5)' }}
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
      <Field name="projectName" invalid={invalid}>
        <FieldLabel>Project name</FieldLabel>
        <Input
          ref={nameRef}
          value={name}
          onValueChange={setName}
          required
          autoComplete="off"
          placeholder="e.g. Campus"
        />
        <FieldDescription>
          Required. You can change this later.
        </FieldDescription>
        <FieldError match={invalid}>Enter a project name.</FieldError>
      </Field>
      <Field name="notes">
        <FieldLabel>
          Notes{' '}
          <span
            className="optional-label"
            style={{ color: 'var(--u-muted)', fontWeight: 400 }}
          >
            (optional)
          </span>
        </FieldLabel>
        <Textarea
          value={notes}
          onValueChange={setNotes}
          rows={3}
          placeholder="Describe the project…"
        />
      </Field>
      <div
        className="example-actions"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          gap: 'var(--u-space-2)',
        }}
      >
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button />}>New project</DialogTrigger>
        <DialogContent>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>Add a name and optional notes.</DialogDescription>
          <ProjectForm
            onSave={(name) => {
              setSaved(`Created ${name}.`);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
          <div
            className="dialog-help"
            style={{
              marginTop: 'var(--u-space-4)',
              borderTop: '1px solid var(--u-line-soft)',
              paddingTop: 'var(--u-space-3)',
            }}
          >
            <Popover>
              <PopoverTrigger render={<Button variant="ghost" size="sm" />}>
                Project visibility
              </PopoverTrigger>
              <PopoverContent>
                <PopoverTitle>Private by default</PopoverTitle>
                <PopoverDescription>
                  Only invited members can access this example project.
                </PopoverDescription>
                <PopoverClose render={<Button variant="secondary" size="sm" />}>
                  Close details
                </PopoverClose>
              </PopoverContent>
            </Popover>
          </div>
        </DialogContent>
      </Dialog>
      <p
        className="playground-feedback"
        style={{
          fontSize: 'var(--u-type-caption-size)',
          color: 'var(--u-muted)',
          textAlign: 'center',
          overflowWrap: 'anywhere',
        }}
        role="status"
      >
        {saved || 'Open the dialog to complete the form.'}
      </p>
    </>
  );
}
