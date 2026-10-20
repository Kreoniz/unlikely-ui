import { CheckControl } from '../controls.js';
import { useRef, useState } from 'react';
import { Button } from '../../src/components/button.js';
import { Field } from '../../src/components/field.js';
import { Input } from '../../src/components/input.js';
import { Textarea } from '../../src/components/textarea.js';
import { CodeBlock } from '../code-block.js';

export function FieldExamples({
  kind,
}: {
  kind: 'field' | 'input' | 'textarea';
}) {
  const [value, setValue] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const multiline = kind === 'textarea';
  const Control = multiline ? Textarea : Input;
  return (
    <>
      <section className="specimen" aria-label="Field playground">
        <div className="specimen-heading">
          <h2>Playground</h2>
          <span className="quiet-label">CONTROLLED VALUE</span>
        </div>
        <div className="form-stage">
          <Field.Root disabled={disabled} invalid={invalid}>
            <Field.Label>
              {multiline ? 'Project notes' : 'Project name'}
            </Field.Label>
            <Control
              value={value}
              onValueChange={setValue}
              readOnly={readOnly}
              placeholder={multiline ? 'Describe the project…' : 'e.g. Campus'}
            />
            <Field.Description>
              {multiline
                ? 'Context for the people working on this project.'
                : 'Shown in your project list.'}
            </Field.Description>
            <Field.Error match={invalid}>
              {multiline
                ? 'Add more detail before saving.'
                : 'This project name is already in use.'}
            </Field.Error>
          </Field.Root>
          <p className="playground-feedback" role="status">
            {value.length} characters
          </p>
        </div>
        <div className="playground-controls">
          <CheckControl checked={disabled} onCheckedChange={setDisabled}>
            Disabled
          </CheckControl>
          <CheckControl checked={readOnly} onCheckedChange={setReadOnly}>
            Read-only
          </CheckControl>
          <CheckControl checked={invalid} onCheckedChange={setInvalid}>
            Invalid
          </CheckControl>
        </div>
      </section>
      <CodeBlock
        code={`import { Field } from 'unlikely-ui/field';\nimport { ${multiline ? 'Textarea' : 'Input'} } from 'unlikely-ui/${multiline ? 'textarea' : 'input'}';\n\n<Field.Root name="${multiline ? 'notes' : 'name'}">\n  <Field.Label>${multiline ? 'Project notes' : 'Project name'}</Field.Label>\n  <${multiline ? 'Textarea' : 'Input'} placeholder="${multiline ? 'Describe the project…' : 'e.g. Campus'}" />\n  <Field.Description>Visible to your team.</Field.Description>\n</Field.Root>`}
      />
      <section className="specimen" aria-label="Validation examples">
        <div className="specimen-heading">
          <h2>Validation on blur</h2>
        </div>
        <div className="form-stage field-grid">
          <Field.Root name="email" validationMode="onBlur">
            <Field.Label>Email address</Field.Label>
            <Input
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Field.Description>
              Required. Enter a valid email address.
            </Field.Description>
            <Field.Error match="valueMissing">
              Enter your email address.
            </Field.Error>
            <Field.Error match="typeMismatch">
              Enter a valid email address.
            </Field.Error>
          </Field.Root>
          <Field.Root name="summary" validationMode="onBlur">
            <Field.Label>Summary</Field.Label>
            <Textarea required placeholder="Add a summary…" rows={3} />
            <Field.Description>
              Required. Validation uses the native textarea.
            </Field.Description>
            <Field.Error match="valueMissing">Enter a summary.</Field.Error>
          </Field.Root>
        </div>
      </section>
      <section className="specimen">
        <div className="specimen-heading">
          <h2>Disabled and read-only</h2>
        </div>
        <div className="form-stage field-grid">
          <Field.Root disabled>
            <Field.Label>Unavailable project</Field.Label>
            <Control defaultValue="Archived project" />
            <Field.Description>
              Disabled controls cannot receive input or focus.
            </Field.Description>
          </Field.Root>
          <Field.Root>
            <Field.Label>Project identifier</Field.Label>
            <Control readOnly defaultValue="project-0042" />
            <Field.Description>
              Read-only values remain focusable and selectable.
            </Field.Description>
          </Field.Root>
        </div>
      </section>
    </>
  );
}

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
