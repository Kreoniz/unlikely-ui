import { useId, useState } from 'react';
import { Button } from '../../src/components/button.js';
import { Checkbox } from '../../src/components/checkbox.js';
import {
  RadioGroup,
  RadioGroupItem,
} from '../../src/components/radio-group.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../src/components/select.js';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
} from '../../src/components/field.js';
import { CodeBlock } from '../code-block.js';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
  { value: 'fr', label: 'Français' },
];

export function SelectionExamples({
  kind,
}: {
  kind: 'select' | 'radio-group' | 'checkbox';
}) {
  const scheduleLabel = useId();
  const [language, setLanguage] = useState<string | null>(null);
  const [schedule, setSchedule] = useState('weekly');
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState('');
  return (
    <>
      <section className="specimen" aria-label="Selection playground">
        <div className="specimen-heading">
          <h2>Playground</h2>
          <span className="quiet-label">KEYBOARD & TOUCH</span>
        </div>
        <form
          className="form-stage example-form"
          onSubmit={(event) => {
            event.preventDefault();
            setResult(
              JSON.stringify(
                Object.fromEntries(new FormData(event.currentTarget)),
              ),
            );
          }}
        >
          {kind === 'select' && (
            <Field name="language">
              <FieldLabel>Language</FieldLabel>
              <Select
                name="language"
                value={language}
                onValueChange={setLanguage}
                items={languages}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      disabled={item.value === 'fr'}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                Français is unavailable in this example. Type to find an option.
              </FieldDescription>
            </Field>
          )}
          {kind === 'radio-group' && (
            <Field name="schedule">
              <div id={scheduleLabel} className="u-field-label">
                Delivery schedule
              </div>
              <RadioGroup
                aria-labelledby={scheduleLabel}
                name="schedule"
                value={schedule}
                onValueChange={setSchedule}
              >
                {['daily', 'weekly', 'monthly'].map((value) => (
                  <FieldItem
                    key={value}
                    render={<label className="choice-label" />}
                  >
                    <RadioGroupItem value={value} />
                    {value}
                  </FieldItem>
                ))}
                <FieldItem render={<label className="choice-label" />}>
                  <RadioGroupItem value="yearly" disabled />
                  yearly (unavailable)
                </FieldItem>
              </RadioGroup>
              <FieldDescription>
                Arrow keys change the selected option.
              </FieldDescription>
            </Field>
          )}
          {kind === 'checkbox' && (
            <Field name="updates">
              <label className="choice-label">
                <Checkbox
                  name="updates"
                  checked={checked}
                  onCheckedChange={setChecked}
                />
                Email updates
              </label>
              <FieldDescription>
                Optional. Submitted only when selected.
              </FieldDescription>
            </Field>
          )}
          <div className="example-actions">
            <Button type="submit" variant="secondary">
              Read form values
            </Button>
          </div>
          <p className="playground-feedback" role="status">
            {result || 'Submit to inspect the native form values.'}
          </p>
        </form>
      </section>
      <section className="specimen">
        <div className="specimen-heading">
          <h2>States</h2>
        </div>
        <div className="form-stage selection-states">
          {kind === 'checkbox' ? (
            <>
              <label className="choice-label">
                <Checkbox defaultChecked />
                Selected
              </label>
              <label className="choice-label">
                <Checkbox indeterminate />
                Mixed selection
              </label>
              <label className="choice-label">
                <Checkbox disabled defaultChecked />
                Disabled checkbox
              </label>
              <Field invalid>
                <label className="choice-label">
                  <Checkbox />
                  Required agreement
                </label>
                <FieldError match>Accept the agreement to continue.</FieldError>
              </Field>
            </>
          ) : kind === 'radio-group' ? (
            <>
              <RadioGroup
                aria-label="Disabled schedule"
                defaultValue="weekly"
                disabled
              >
                <label className="choice-label">
                  <RadioGroupItem value="weekly" />
                  Disabled radio
                </label>
              </RadioGroup>
              <Field invalid>
                <div className="u-field-label">Required schedule</div>
                <RadioGroup aria-label="Required schedule">
                  <FieldItem render={<label className="choice-label" />}>
                    <RadioGroupItem value="daily" />
                    daily
                  </FieldItem>
                  <FieldItem render={<label className="choice-label" />}>
                    <RadioGroupItem value="weekly" />
                    weekly
                  </FieldItem>
                </RadioGroup>
                <FieldError match>Choose a schedule.</FieldError>
              </Field>
            </>
          ) : (
            <>
              <Field disabled>
                <FieldLabel>Unavailable language</FieldLabel>
                <Select items={languages} defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((i) => (
                      <SelectItem key={i.value} value={i.value}>
                        {i.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field invalid>
                <FieldLabel>Required language</FieldLabel>
                <Select items={languages}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((i) => (
                      <SelectItem key={i.value} value={i.value}>
                        {i.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError match>Choose a language.</FieldError>
              </Field>
            </>
          )}
        </div>
      </section>
      {kind === 'radio-group' && (
        <section className="specimen" aria-label="Segmented controls">
          <div className="specimen-heading">
            <h2>Segmented selection</h2>
          </div>
          <div className="form-stage">
            <RadioGroup
              variant="segmented"
              aria-label="Schedule filter"
              defaultValue="free"
            >
              <RadioGroupItem value="campus">On campus</RadioGroupItem>
              <RadioGroupItem value="free">Free time</RadioGroupItem>
              <RadioGroupItem value="remote" disabled>
                Remote
              </RadioGroupItem>
            </RadioGroup>
            <p className="specimen-note">
              Uses radio semantics and arrow-key navigation for a choice that
              updates the same view.
            </p>
          </div>
        </section>
      )}
      <CodeBlock
        code={
          kind === 'select'
            ? `<Field name="language">\n  <FieldLabel>Language</FieldLabel>\n  <Select items={languages}>\n    <SelectTrigger><SelectValue placeholder="Choose a language" /></SelectTrigger>\n    <SelectContent>\n      {languages.map(item => (\n        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>\n      ))}\n    </SelectContent>\n  </Select>\n</Field>`
            : kind === 'radio-group'
              ? `<RadioGroup aria-label="Schedule" defaultValue="weekly">\n  <label><RadioGroupItem value="daily" />Daily</label>\n  <label><RadioGroupItem value="weekly" />Weekly</label>\n</RadioGroup>`
              : `<label>\n  <Checkbox checked={checked} onCheckedChange={setChecked} />\n  Email updates\n</label>`
        }
      />
    </>
  );
}
