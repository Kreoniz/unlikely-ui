import { CheckControl } from '../controls.js';
import { useState } from 'react';
import { Button } from '../../src/components/button.js';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../../src/components/field.js';
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
          <Field disabled={disabled} invalid={invalid}>
            <FieldLabel>
              {multiline ? 'Project notes' : 'Project name'}
            </FieldLabel>
            <Control
              value={value}
              onValueChange={setValue}
              readOnly={readOnly}
              placeholder={multiline ? 'Describe the project…' : 'e.g. Campus'}
            />
            <FieldDescription>
              {multiline
                ? 'Context for the people working on this project.'
                : 'Shown in your project list.'}
            </FieldDescription>
            <FieldError match={invalid}>
              {multiline
                ? 'Add more detail before saving.'
                : 'This project name is already in use.'}
            </FieldError>
          </Field>
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
        code={`import { Field, FieldDescription, FieldError, FieldLabel } from 'unlikely-ui/field';\nimport { ${multiline ? 'Textarea' : 'Input'} } from 'unlikely-ui/${multiline ? 'textarea' : 'input'}';\n\n<Field name="${multiline ? 'notes' : 'name'}">\n  <FieldLabel>${multiline ? 'Project notes' : 'Project name'}</FieldLabel>\n  <${multiline ? 'Textarea' : 'Input'} placeholder="${multiline ? 'Describe the project…' : 'e.g. Campus'}" />\n  <FieldDescription>Visible to your team.</FieldDescription>\n</Field>`}
      />
      <section className="specimen" aria-label="Validation examples">
        <div className="specimen-heading">
          <h2>Validation on blur</h2>
        </div>
        <div className="form-stage field-grid">
          <Field name="email" validationMode="onBlur">
            <FieldLabel>Email address</FieldLabel>
            <Input
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
            <FieldDescription>
              Required. Enter a valid email address.
            </FieldDescription>
            <FieldError match="valueMissing">
              Enter your email address.
            </FieldError>
            <FieldError match="typeMismatch">
              Enter a valid email address.
            </FieldError>
          </Field>
          <Field name="summary" validationMode="onBlur">
            <FieldLabel>Summary</FieldLabel>
            <Textarea required placeholder="Add a summary…" rows={3} />
            <FieldDescription>
              Required. Validation uses the native textarea.
            </FieldDescription>
            <FieldError match="valueMissing">Enter a summary.</FieldError>
          </Field>
        </div>
      </section>
      <section className="specimen">
        <div className="specimen-heading">
          <h2>Disabled and read-only</h2>
        </div>
        <div className="form-stage field-grid">
          <Field disabled>
            <FieldLabel>Unavailable project</FieldLabel>
            <Control defaultValue="Archived project" />
            <FieldDescription>
              Disabled controls cannot receive input or focus.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Project identifier</FieldLabel>
            <Control readOnly defaultValue="project-0042" />
            <FieldDescription>
              Read-only values remain focusable and selectable.
            </FieldDescription>
          </Field>
        </div>
      </section>
    </>
  );
}
