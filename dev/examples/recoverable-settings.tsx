import { useRef, useState } from 'react';
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from '../../src/components/alert.js';
import { Button } from '../../src/components/button.js';
import { Field, FieldError, FieldLabel } from '../../src/components/field.js';
import { Input } from '../../src/components/input.js';
import { Textarea } from '../../src/components/textarea.js';

export function RecoverableSettings() {
  const [name, setName] = useState('Component workspace');
  const [notes, setNotes] = useState('Keep the useful details.');
  const [saved, setSaved] = useState({ name, notes });
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [message, setMessage] = useState('');
  const attempted = useRef(false);
  const inFlight = useRef(false);
  const nameRef = useRef<HTMLElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  const dirty = name !== saved.name || notes !== saved.notes;
  async function save() {
    if (inFlight.current) return;
    if (!name.trim()) {
      setInvalid(true);
      nameRef.current?.focus();
      return;
    }
    const draft = { name: name.trim(), notes };
    inFlight.current = true;
    setPending(true);
    setFailed(false);
    setMessage('Saving your draft…');
    // Demo transport: the first attempt fails; retry succeeds. Replace with your request.
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (!attempted.current) {
      attempted.current = true;
      setFailed(true);
      setMessage('');
    } else {
      setSaved(draft);
      setName(draft.name);
      setMessage(`Saved ${draft.name}.`);
    }
    inFlight.current = false;
    setPending(false);
  }
  return (
    <form
      className="example-form"
      style={{ display: 'grid', gap: 'var(--u-space-5)' }}
      aria-label="Recoverable settings"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <Field invalid={invalid && !name.trim()}>
        <FieldLabel>Workspace name</FieldLabel>
        <Input
          ref={nameRef}
          value={name}
          onValueChange={(value) => {
            setName(value);
            setMessage('');
          }}
          readOnly={pending}
          required
        />
        <FieldError match={invalid && !name.trim()}>
          Enter a workspace name.
        </FieldError>
      </Field>
      <Field>
        <FieldLabel>Workspace notes</FieldLabel>
        <Textarea
          value={notes}
          onValueChange={(value) => {
            setNotes(value);
            setMessage('');
          }}
          readOnly={pending}
          rows={3}
        />
      </Field>
      {failed && (
        <Alert tone="danger" role="alert">
          <AlertTitle>Your changes haven’t been saved</AlertTitle>
          <AlertDescription>
            The example server didn’t respond. Your draft is still here.
          </AlertDescription>
          <AlertActions>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                // Retry disappears; establish its persistent fallback before starting.
                saveRef.current?.focus();
                void save();
              }}
            >
              Try again
            </Button>
          </AlertActions>
        </Alert>
      )}
      <div
        className="example-actions"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          gap: 'var(--u-space-2)',
        }}
      >
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={() => {
            setName(saved.name);
            setNotes(saved.notes);
            setFailed(false);
            setMessage('Restored saved values.');
          }}
        >
          Discard changes
        </Button>
        <Button ref={saveRef} type="submit" loading={pending}>
          Save changes
        </Button>
      </div>
      <p role="status" style={{ overflowWrap: 'anywhere' }}>
        {message || (dirty ? 'Unsaved changes.' : 'No unsaved changes.')}
      </p>
    </form>
  );
}
