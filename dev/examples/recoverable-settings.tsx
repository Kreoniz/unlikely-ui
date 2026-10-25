import { useRef, useState } from 'react';
import { Alert } from '../../src/components/alert.js';
import { Button } from '../../src/components/button.js';
import { Field } from '../../src/components/field.js';
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
    // Retry disappears during the request; keep keyboard focus on the busy action.
    saveRef.current?.focus();
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
    requestAnimationFrame(() => saveRef.current?.focus());
  }
  return (
    <form
      className="example-form"
      aria-label="Recoverable settings"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <Field.Root invalid={invalid && !name.trim()}>
        <Field.Label>Workspace name</Field.Label>
        <Input
          ref={nameRef}
          value={name}
          onValueChange={setName}
          readOnly={pending}
          required
        />
        <Field.Error match={invalid && !name.trim()}>
          Enter a workspace name.
        </Field.Error>
      </Field.Root>
      <Field.Root>
        <Field.Label>Workspace notes</Field.Label>
        <Textarea
          value={notes}
          onValueChange={setNotes}
          readOnly={pending}
          rows={3}
        />
      </Field.Root>
      {failed && (
        <Alert.Root tone="danger" role="alert">
          <Alert.Title>Your changes haven’t been saved</Alert.Title>
          <Alert.Description>
            The example server didn’t respond. Your draft is still here.
          </Alert.Description>
          <Alert.Actions>
            <Button
              type="button"
              variant="secondary"
              onClick={() => void save()}
            >
              Try again
            </Button>
          </Alert.Actions>
        </Alert.Root>
      )}
      <div className="example-actions">
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
      <p role="status">
        {message || (dirty ? 'Unsaved changes.' : 'No unsaved changes.')}
      </p>
    </form>
  );
}
