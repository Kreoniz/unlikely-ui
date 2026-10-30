import { useId, useRef, useState } from 'react';
import { Button } from '../../src/components/button.js';
import { DatePicker } from '../../src/components/date-picker.js';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../../src/components/field.js';
import { Input } from '../../src/components/input.js';

// A local calendar date is not a UTC timestamp. The app chooses its serialization.
function localDateValue(date: Date | null) {
  return date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    : '';
}

export function DueDateForm() {
  const id = useId();
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState('');
  const nameRef = useRef<HTMLElement>(null);
  const dateRef = useRef<HTMLButtonElement>(null);
  const missingName = submitted && !name.trim();
  const missingDate = submitted && !date;
  return (
    <form
      className="example-form"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: 'var(--u-space-5)',
      }}
      aria-label="Project due date"
      noValidate
      onReset={() => {
        setName('');
        setDate(null);
        setSubmitted(false);
        setResult('');
      }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        if (!name.trim()) {
          nameRef.current?.focus();
          return;
        }
        if (!date) {
          dateRef.current?.focus();
          return;
        }
        const data = new FormData(event.currentTarget);
        setResult(
          `Last submitted: ${data.get('projectName')}, due ${data.get('dueDate')}.`,
        );
      }}
    >
      <Field name="projectName" invalid={missingName}>
        <FieldLabel>Project name</FieldLabel>
        <Input ref={nameRef} value={name} onValueChange={setName} required />
        <FieldError match={missingName}>Enter a project name.</FieldError>
      </Field>
      <Field invalid={missingDate}>
        <FieldLabel htmlFor={`${id}-trigger`}>Due date</FieldLabel>
        <DatePicker
          label="Due date"
          value={date}
          onValueChange={setDate}
          today={new Date(2026, 9, 19)}
          triggerProps={{
            id: `${id}-trigger`,
            ref: dateRef,
            'aria-required': true,
            'aria-invalid': missingDate || undefined,
            'aria-describedby': `${id}-help${missingDate ? ` ${id}-error` : ''}`,
          }}
        />
        <input type="hidden" name="dueDate" value={localDateValue(date)} />
        <FieldDescription id={`${id}-help`}>
          Required. Submitted as a local YYYY-MM-DD date.
        </FieldDescription>
        <FieldError id={`${id}-error`} match={missingDate}>
          Choose a due date.
        </FieldError>
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
        <Button type="button" variant="ghost" onClick={() => setDate(null)}>
          Clear due date
        </Button>
        <Button type="reset" variant="secondary">
          Reset form
        </Button>
        <Button type="submit">Submit project</Button>
      </div>
      <p role="status" style={{ overflowWrap: 'anywhere' }}>
        {result}
      </p>
    </form>
  );
}
