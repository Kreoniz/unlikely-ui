import { useState } from 'react';
import { Tabs } from '../../src/components/tabs.js';
import { Input } from '../../src/components/input.js';
import { Field } from '../../src/components/field.js';
import { Switch } from '../../src/components/switch.js';
import { CheckControl } from '../controls.js';
import { CodeBlock } from '../code-block.js';

export function TabsExamples() {
  const [value, setValue] = useState('account');
  const [automatic, setAutomatic] = useState(false);
  const [vertical, setVertical] = useState(false);
  return (
    <>
      <section className="specimen" aria-label="Tabbed preferences">
        <div className="specimen-heading">
          <h2>Related content panels</h2>
        </div>
        <div className="form-stage">
          <Tabs.Root
            value={value}
            onValueChange={setValue}
            orientation={vertical ? 'vertical' : 'horizontal'}
          >
            <Tabs.List aria-label="Preferences" activateOnFocus={automatic}>
              <Tabs.Tab value="account">Account</Tabs.Tab>
              <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
              <Tabs.Tab value="access" disabled>
                Access
              </Tabs.Tab>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Panel value="account">
              <Field.Root>
                <Field.Label>Account name</Field.Label>
                <Input defaultValue="Alex" />
                <Field.Description>Shown on your profile.</Field.Description>
              </Field.Root>
            </Tabs.Panel>
            <Tabs.Panel value="notifications">
              <label className="setting-row">
                <Switch.Root defaultChecked>
                  <Switch.Thumb />
                </Switch.Root>
                <span>Email notifications</span>
              </label>
            </Tabs.Panel>
            <Tabs.Panel value="access">
              Access settings are managed by your team.
            </Tabs.Panel>
          </Tabs.Root>
        </div>
        <div className="playground-controls">
          <CheckControl checked={automatic} onCheckedChange={setAutomatic}>
            Activate on arrow-key focus
          </CheckControl>
          <CheckControl checked={vertical} onCheckedChange={setVertical}>
            Vertical tabs
          </CheckControl>
        </div>
        <p className="specimen-note">
          Arrow keys move between tabs. With manual activation, Enter or Space
          selects the focused tab. Use segmented radios to filter one view, and
          links to navigate to another page.
        </p>
      </section>
      <CodeBlock
        code={`import { Tabs } from 'unlikely-ui/tabs';\n\n<Tabs.Root defaultValue="account">\n  <Tabs.List aria-label="Preferences">\n    <Tabs.Tab value="account">Account</Tabs.Tab>\n    <Tabs.Tab value="notifications">Notifications</Tabs.Tab>\n    <Tabs.Indicator />\n  </Tabs.List>\n  <Tabs.Panel value="account">Account settings</Tabs.Panel>\n  <Tabs.Panel value="notifications">Notification settings</Tabs.Panel>\n</Tabs.Root>`}
      />
    </>
  );
}
