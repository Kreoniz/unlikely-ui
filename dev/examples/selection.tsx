import { useId, useState } from 'react';
import { Button } from '../../src/components/button.js';
import { Checkbox } from '../../src/components/checkbox.js';
import { RadioGroup } from '../../src/components/radio-group.js';
import { Select } from '../../src/components/select.js';
import { Field } from '../../src/components/field.js';
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
            <Field.Root name="language">
              <Field.Label>Language</Field.Label>
              <Select.Root
                name="language"
                value={language}
                onValueChange={setLanguage}
                items={languages}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Choose a language" />
                </Select.Trigger>
                <Select.Content>
                  {languages.map((item) => (
                    <Select.Item
                      key={item.value}
                      value={item.value}
                      disabled={item.value === 'fr'}
                    >
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              <Field.Description>
                Français is unavailable in this example. Type to find an option.
              </Field.Description>
            </Field.Root>
          )}
          {kind === 'radio-group' && (
            <Field.Root name="schedule">
              <div id={scheduleLabel} className="u-field-label">
                Delivery schedule
              </div>
              <RadioGroup.Root
                aria-labelledby={scheduleLabel}
                name="schedule"
                value={schedule}
                onValueChange={setSchedule}
              >
                {['daily', 'weekly', 'monthly'].map((value) => (
                  <Field.Item
                    key={value}
                    render={<label className="choice-label" />}
                  >
                    <RadioGroup.Item value={value} />
                    {value}
                  </Field.Item>
                ))}
                <Field.Item render={<label className="choice-label" />}>
                  <RadioGroup.Item value="yearly" disabled />
                  yearly (unavailable)
                </Field.Item>
              </RadioGroup.Root>
              <Field.Description>
                Arrow keys change the selected option.
              </Field.Description>
            </Field.Root>
          )}
          {kind === 'checkbox' && (
            <Field.Root name="updates">
              <label className="choice-label">
                <Checkbox
                  name="updates"
                  checked={checked}
                  onCheckedChange={setChecked}
                />
                Email updates
              </label>
              <Field.Description>
                Optional. Submitted only when selected.
              </Field.Description>
            </Field.Root>
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
              <Field.Root invalid>
                <label className="choice-label">
                  <Checkbox />
                  Required agreement
                </label>
                <Field.Error match>
                  Accept the agreement to continue.
                </Field.Error>
              </Field.Root>
            </>
          ) : kind === 'radio-group' ? (
            <>
              <RadioGroup.Root
                aria-label="Disabled schedule"
                defaultValue="weekly"
                disabled
              >
                <label className="choice-label">
                  <RadioGroup.Item value="weekly" />
                  Disabled radio
                </label>
              </RadioGroup.Root>
              <Field.Root invalid>
                <div className="u-field-label">Required schedule</div>
                <RadioGroup.Root aria-label="Required schedule">
                  <Field.Item render={<label className="choice-label" />}>
                    <RadioGroup.Item value="daily" />
                    daily
                  </Field.Item>
                  <Field.Item render={<label className="choice-label" />}>
                    <RadioGroup.Item value="weekly" />
                    weekly
                  </Field.Item>
                </RadioGroup.Root>
                <Field.Error match>Choose a schedule.</Field.Error>
              </Field.Root>
            </>
          ) : (
            <>
              <Field.Root disabled>
                <Field.Label>Unavailable language</Field.Label>
                <Select.Root items={languages} defaultValue="en">
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {languages.map((i) => (
                      <Select.Item key={i.value} value={i.value}>
                        {i.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Field.Root>
              <Field.Root invalid>
                <Field.Label>Required language</Field.Label>
                <Select.Root items={languages}>
                  <Select.Trigger>
                    <Select.Value placeholder="Choose a language" />
                  </Select.Trigger>
                  <Select.Content>
                    {languages.map((i) => (
                      <Select.Item key={i.value} value={i.value}>
                        {i.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Field.Error match>Choose a language.</Field.Error>
              </Field.Root>
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
            <RadioGroup.Root
              variant="segmented"
              aria-label="Schedule filter"
              defaultValue="free"
            >
              <RadioGroup.Item value="campus">On campus</RadioGroup.Item>
              <RadioGroup.Item value="free">Free time</RadioGroup.Item>
              <RadioGroup.Item value="remote" disabled>
                Remote
              </RadioGroup.Item>
            </RadioGroup.Root>
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
            ? `<Field.Root name="language">\n  <Field.Label>Language</Field.Label>\n  <Select.Root items={languages}>\n    <Select.Trigger><Select.Value placeholder="Choose a language" /></Select.Trigger>\n    <Select.Content>\n      {languages.map(item => (\n        <Select.Item key={item.value} value={item.value}>{item.label}</Select.Item>\n      ))}\n    </Select.Content>\n  </Select.Root>\n</Field.Root>`
            : kind === 'radio-group'
              ? `<RadioGroup.Root aria-label="Schedule" defaultValue="weekly">\n  <label><RadioGroup.Item value="daily" />Daily</label>\n  <label><RadioGroup.Item value="weekly" />Weekly</label>\n</RadioGroup.Root>`
              : `<label>\n  <Checkbox checked={checked} onCheckedChange={setChecked} />\n  Email updates\n</label>`
        }
      />
    </>
  );
}
