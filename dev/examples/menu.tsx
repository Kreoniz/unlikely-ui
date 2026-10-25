import { useRef, useState } from 'react';
import { Menu } from '../../src/components/menu.js';
import { Button } from '../../src/components/button.js';
import { Card } from '../../src/components/card.js';
import { Dialog } from '../../src/components/dialog.js';
import { Field } from '../../src/components/field.js';
import { Input } from '../../src/components/input.js';
import { Theme } from '../../src/theme.js';
import { CodeBlock } from '../code-block.js';

export function ProjectActions() {
  const [name, setName] = useState('Design notes');
  const [draft, setDraft] = useState(name);
  const [renaming, setRenaming] = useState(false);
  const [message, setMessage] = useState('');
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>{name}</Card.Title>
        <Card.Description>
          Contextual actions keep the main project action clear.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Menu.Root>
          <Menu.Trigger ref={trigger} render={<Button variant="secondary" />}>
            Project actions
          </Menu.Trigger>
          <Menu.Content finalFocus={() => (renaming ? false : trigger.current)}>
            <Menu.Group>
              <Menu.GroupLabel>Project actions</Menu.GroupLabel>
              <Menu.Item
                onClick={() => {
                  setDraft(name);
                  setRenaming(true);
                }}
              >
                Rename
              </Menu.Item>
              <Menu.Item onClick={() => setMessage(`Duplicated ${name}.`)}>
                Duplicate
              </Menu.Item>
              <Menu.Item disabled>Transfer ownership</Menu.Item>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Item
              tone="danger"
              onClick={() => setMessage(`Archive requested for ${name}.`)}
            >
              Archive
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </Card.Content>
      <Card.Footer>
        <p role="status">{message || 'Choose an action.'}</p>
      </Card.Footer>
      <Dialog.Root open={renaming} onOpenChange={setRenaming}>
        <Dialog.Content finalFocus={trigger}>
          <Dialog.Title>Rename project</Dialog.Title>
          <Dialog.Description>
            Choose a name you can recognize.
          </Dialog.Description>
          <form
            className="example-form"
            onSubmit={(event) => {
              event.preventDefault();
              setName(draft.trim());
              setMessage(`Renamed to ${draft.trim()}.`);
              setRenaming(false);
            }}
          >
            <Field.Root>
              <Field.Label>Project title</Field.Label>
              <Input
                value={draft}
                onValueChange={setDraft}
                required
                pattern={'.*\\S.*'}
              />
            </Field.Root>
            <div className="example-actions">
              <Dialog.Close render={<Button variant="secondary" />}>
                Cancel rename
              </Dialog.Close>
              <Button type="submit">Save name</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </Card.Root>
  );
}

export function MenuExamples() {
  return (
    <>
      <section className="specimen" aria-label="Project action menu">
        <div className="specimen-heading">
          <h2>Actions and dialog handoff</h2>
        </div>
        <div className="form-stage">
          <ProjectActions />
        </div>
        <p className="specimen-note">
          Arrow keys and typeahead navigate actions. Escape dismisses and
          returns focus. Rename opens a dialog; closing it returns to the
          original menu trigger.
        </p>
      </section>
      <CodeBlock
        code={`import { Menu } from 'unlikely-ui/menu';\nimport { Button } from 'unlikely-ui/button';\n\n<Menu.Root>\n  <Menu.Trigger render={<Button variant="secondary" />}>Actions</Menu.Trigger>\n  <Menu.Content>\n    <Menu.Group>\n      <Menu.GroupLabel>Project</Menu.GroupLabel>\n      <Menu.Item onClick={() => console.log('Duplicate')}>Duplicate</Menu.Item>\n      <Menu.Item disabled>Transfer ownership</Menu.Item>\n    </Menu.Group>\n    <Menu.Separator />\n    <Menu.Item tone="danger" onClick={() => console.log('Archive requested')}>Archive</Menu.Item>\n  </Menu.Content>\n</Menu.Root>`}
      />
      <section className="specimen" aria-label="Nested menu theme">
        <div className="specimen-heading">
          <h2>Theme and selection across a portal</h2>
        </div>
        <Theme
          appearance="dark"
          dir="rtl"
          tokens={{
            '--u-selection': 'var(--u-info-soft)',
            '--u-selection-ink': 'var(--u-info)',
            '--u-selection-border': 'var(--u-info-border)',
          }}
          className="form-stage nested-menu-theme"
        >
          <ProjectActions />
        </Theme>
      </section>
    </>
  );
}
