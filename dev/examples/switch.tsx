import { useState } from 'react';
import { Switch } from '../../src/components/switch.js';
import { Button } from '../../src/components/button.js';
import { Field } from '../../src/components/field.js';
import { CodeBlock } from '../code-block.js';

export function SwitchExamples() {
  const [checked, setChecked] = useState(true);
  const [submitted, setSubmitted] = useState('');
  return (
    <>
      <section className="specimen" aria-label="Switch settings">
        <div className="specimen-heading">
          <h2>Immediately applied settings</h2>
        </div>
        <div className="form-stage example-form">
          <label className="setting-row">
            <Switch.Root checked={checked} onCheckedChange={setChecked}>
              <Switch.Thumb />
            </Switch.Root>
            <span>Auto-save drafts</span>
            <small aria-hidden="true">{checked ? 'On' : 'Off'}</small>
          </label>
          <label className="setting-row">
            <Switch.Root disabled defaultChecked>
              <Switch.Thumb />
            </Switch.Root>
            <span>Managed by your team</span>
          </label>
          <label className="setting-row">
            <Switch.Root readOnly defaultChecked>
              <Switch.Thumb />
            </Switch.Root>
            <span>Read-only preference</span>
          </label>
          <p role="status">Auto-save is {checked ? 'on' : 'off'}.</p>
          <Field.Root invalid name="requiredSetting">
            <Field.Label>Required setting</Field.Label>
            <Switch.Root required>
              <Switch.Thumb />
            </Switch.Root>
            <Field.Error match={true}>
              Turn on this setting to continue.
            </Field.Error>
          </Field.Root>
        </div>
        <p className="specimen-note">
          Use a switch for an immediately applied setting. Use Checkbox for an
          independent choice submitted with a form.
        </p>
      </section>
      <CodeBlock
        code={`import { useState } from 'react';\nimport { Switch } from 'unlikely-ui/switch';\n\nexport function AutoSave() {\n  const [checked, setChecked] = useState(true);\n  return (\n    <label>\n      <Switch.Root checked={checked} onCheckedChange={setChecked}>\n        <Switch.Thumb />\n      </Switch.Root>\n      Auto-save drafts\n    </label>\n  );\n}`}
      />
      <section className="specimen" aria-label="Switch form participation">
        <div className="specimen-heading">
          <h2>Native form values and reset</h2>
        </div>
        <form
          className="form-stage example-form"
          onReset={() => setSubmitted('')}
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(
              `Digest: ${new FormData(event.currentTarget).get('digest')}.`,
            );
          }}
        >
          <label className="setting-row">
            <Switch.Root
              name="digest"
              value="enabled"
              uncheckedValue="disabled"
              defaultChecked
            >
              <Switch.Thumb />
            </Switch.Root>
            <span>Weekly digest</span>
          </label>
          <div className="example-actions">
            <Button type="reset" variant="secondary">
              Reset switches
            </Button>
            <Button type="submit">Submit preferences</Button>
          </div>
          <p role="status">{submitted}</p>
        </form>
      </section>
    </>
  );
}
