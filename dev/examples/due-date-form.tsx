import { useId, useRef, useState } from 'react';
import { Button } from '../../src/components/button.js';
import { DatePicker } from '../../src/components/date-picker.js';
import { Field } from '../../src/components/field.js';
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
          `Submitted ${data.get('projectName')}: due ${data.get('dueDate')}.`,
        );
      }}
    >
      <Field.Root name="projectName" invalid={missingName}>
        <Field.Label>Project name</Field.Label>
        <Input ref={nameRef} value={name} onValueChange={setName} required />
        <Field.Error match={missingName}>Enter a project name.</Field.Error>
      </Field.Root>
      <Field.Root invalid={missingDate}>
        <Field.Label htmlFor={`${id}-trigger`}>Due date</Field.Label>
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
        <Field.Description id={`${id}-help`}>
          Required. Submitted as a local YYYY-MM-DD date.
        </Field.Description>
        <Field.Error id={`${id}-error`} match={missingDate}>
          Choose a due date.
        </Field.Error>
      </Field.Root>
      <div className="example-actions">
        <Button type="button" variant="ghost" onClick={() => setDate(null)}>
          Clear due date
        </Button>
        <Button type="reset" variant="secondary">
          Reset form
        </Button>
        <Button type="submit">Submit project</Button>
      </div>
      <p role="status">{result}</p>
    </form>
  );
}
