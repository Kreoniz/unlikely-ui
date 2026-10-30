import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from '../../src/components/tabs.js';
import { Input } from '../../src/components/input.js';
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '../../src/components/field.js';
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
          <Tabs
            value={value}
            onValueChange={setValue}
            orientation={vertical ? 'vertical' : 'horizontal'}
          >
            <TabsList aria-label="Preferences" activateOnFocus={automatic}>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="access" disabled>
                Access
              </TabsTrigger>
              <TabsIndicator />
            </TabsList>
            <TabsContent value="account">
              <Field>
                <FieldLabel>Account name</FieldLabel>
                <Input defaultValue="Alex" />
                <FieldDescription>Shown on your profile.</FieldDescription>
              </Field>
            </TabsContent>
            <TabsContent value="notifications">
              <label className="setting-row">
                <Switch defaultChecked />
                <span>Email notifications</span>
              </label>
            </TabsContent>
            <TabsContent value="access">
              Access settings are managed by your team.
            </TabsContent>
          </Tabs>
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
        code={`import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from 'unlikely-ui/tabs';\n\n<Tabs defaultValue="account">\n  <TabsList aria-label="Preferences">\n    <TabsTrigger value="account">Account</TabsTrigger>\n    <TabsTrigger value="notifications">Notifications</TabsTrigger>\n    <TabsIndicator />\n  </TabsList>\n  <TabsContent value="account">Account settings</TabsContent>\n  <TabsContent value="notifications">Notification settings</TabsContent>\n</Tabs>`}
      />
    </>
  );
}
