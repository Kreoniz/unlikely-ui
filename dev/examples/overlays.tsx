import { useState } from 'react';
import { Button } from '../../src/components/button.js';
import { Dialog } from '../../src/components/dialog.js';
import { Popover } from '../../src/components/popover.js';
import { Tooltip } from '../../src/components/tooltip.js';
import { Theme } from '../../src/theme.js';
import { Field } from '../../src/components/field.js';
import { Input } from '../../src/components/input.js';
import { Select } from '../../src/components/select.js';
import { ProjectForm } from './fields.js';
import { CodeBlock } from '../code-block.js';
import { Glyph } from '../glyph.js';

export function ProjectDialog() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState('');
  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger render={<Button />}>New project</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Create project</Dialog.Title>
          <Dialog.Description>
            Add a name and optional notes.
          </Dialog.Description>
          <ProjectForm
            onSave={(name) => {
              setSaved(`Created ${name}.`);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
          <div className="dialog-help">
            <Popover.Root>
              <Popover.Trigger render={<Button variant="ghost" size="sm" />}>
                Project visibility
              </Popover.Trigger>
              <Popover.Content>
                <Popover.Title>Private by default</Popover.Title>
                <Popover.Description>
                  Only invited members can access this example project.
                </Popover.Description>
                <Popover.Close
                  render={<Button variant="secondary" size="sm" />}
                >
                  Close details
                </Popover.Close>
              </Popover.Content>
            </Popover.Root>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      <p className="playground-feedback" role="status">
        {saved || 'Open the dialog to complete the form.'}
      </p>
    </>
  );
}

function PreferencesPopover() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Alex');
  const [saved, setSaved] = useState('');
  return (
    <>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger render={<Button variant="secondary" />}>
          Edit display name
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Display name</Popover.Title>
          <Popover.Description>
            Shown next to your activity.
          </Popover.Description>
          <form
            className="example-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(`Display name saved: ${name}.`);
              setOpen(false);
            }}
          >
            <Field.Root>
              <Field.Label>Your name</Field.Label>
              <Input
                required
                value={name}
                onValueChange={setName}
                autoComplete="nickname"
              />
            </Field.Root>
            <div className="example-actions">
              <Popover.Close render={<Button variant="secondary" />}>
                Cancel
              </Popover.Close>
              <Button type="submit">Save name</Button>
            </div>
          </form>
        </Popover.Content>
      </Popover.Root>
      <p className="playground-feedback" role="status">
        {saved || 'Edit a value without leaving the page.'}
      </p>
    </>
  );
}

function TooltipExample({ delay }: { delay?: number }) {
  const [count, setCount] = useState(0);
  return (
    <Tooltip.Provider delay={delay}>
      <div className="tooltip-examples">
        <Tooltip.Root>
          <Tooltip.Trigger
            render={
              <Button
                size="icon"
                aria-label="Add project"
                variant="secondary"
                onClick={() => setCount((n) => n + 1)}
              />
            }
          >
            <Glyph name="plus" />
          </Tooltip.Trigger>
          <Tooltip.Content>Create a new project</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger
            render={
              <Button
                size="icon"
                aria-label="Project settings"
                variant="secondary"
              />
            }
          >
            <Glyph name="sliders" />
          </Tooltip.Trigger>
          <Tooltip.Content>Manage project settings</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root disabled>
          <Tooltip.Trigger
            render={
              <Button size="icon" aria-label="Unavailable action" disabled />
            }
          >
            <Glyph name="sliders" />
          </Tooltip.Trigger>
          <Tooltip.Content>This action is unavailable</Tooltip.Content>
        </Tooltip.Root>
      </div>
      <p className="playground-feedback" role="status">
        {count
          ? `Added ${count} ${count === 1 ? 'project' : 'projects'}.`
          : 'Hover or focus the add button. Press Escape to dismiss.'}
      </p>
    </Tooltip.Provider>
  );
}

export function OverlayExamples({
  kind,
}: {
  kind: 'dialog' | 'popover' | 'tooltip';
}) {
  const [tooltipDelay, setTooltipDelay] = useState('default');
  const Example =
    kind === 'dialog'
      ? ProjectDialog
      : kind === 'popover'
        ? PreferencesPopover
        : TooltipExample;
  return (
    <>
      <section className="specimen" aria-label="Overlay playground">
        <div className="specimen-heading">
          <h2>Playground</h2>
          <span className="quiet-label">
            {kind === 'tooltip' ? 'HOVER & FOCUS' : 'KEYBOARD & TOUCH'}
          </span>
        </div>
        <div className="playground-stage">
          {kind === 'tooltip' ? (
            <TooltipExample
              delay={
                tooltipDelay === 'default' ? undefined : Number(tooltipDelay)
              }
            />
          ) : (
            <Example />
          )}
        </div>
        {kind === 'tooltip' && (
          <div className="playground-controls">
            <Field.Root>
              <Field.Label>Hover delay</Field.Label>
              <Select.Root
                value={tooltipDelay}
                onValueChange={(value) => value && setTooltipDelay(value)}
                items={{
                  default: 'Default (300 ms)',
                  '0': 'Instant',
                  '600': '600 ms',
                }}
              >
                <Select.Trigger size="sm">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="default">Default (300 ms)</Select.Item>
                  <Select.Item value="0">Instant</Select.Item>
                  <Select.Item value="600">600 ms</Select.Item>
                </Select.Content>
              </Select.Root>
            </Field.Root>
          </div>
        )}
        <p className="specimen-note">
          {kind === 'dialog'
            ? 'Tab stays inside the dialog. Escape and Cancel close it and return focus to the trigger. Project visibility opens a popover above the dialog.'
            : kind === 'popover'
              ? 'Open with Enter or a tap. Escape or a press outside closes it. Focus returns to the trigger.'
              : 'Every hover uses the selected delay, including when moving between buttons. Keyboard focus opens immediately. Keep essential information available without hover.'}
        </p>
      </section>
      <CodeBlock
        code={
          kind === 'dialog'
            ? `import { Dialog } from 'unlikely-ui/dialog';\nimport { Button } from 'unlikely-ui/button';\n\n<Dialog.Root>\n  <Dialog.Trigger render={<Button />}>New project</Dialog.Trigger>\n  <Dialog.Content>\n    <Dialog.Title>Create project</Dialog.Title>\n    <Dialog.Description>Add project details.</Dialog.Description>\n    {/* Form content */}\n    <Dialog.Close render={<Button variant="secondary" />}>\n      Cancel\n    </Dialog.Close>\n  </Dialog.Content>\n</Dialog.Root>`
            : kind === 'popover'
              ? `import { Popover } from 'unlikely-ui/popover';\nimport { Button } from 'unlikely-ui/button';\n\n<Popover.Root>\n  <Popover.Trigger render={<Button variant="secondary" />}>\n    Edit profile\n  </Popover.Trigger>\n  <Popover.Content positionerProps={{ align: 'start' }}>\n    <Popover.Title>Profile</Popover.Title>\n    <Popover.Description>Edit your display name.</Popover.Description>\n    {/* Profile fields */}\n  </Popover.Content>\n</Popover.Root>`
              : `import { Tooltip } from 'unlikely-ui/tooltip';\nimport { Button } from 'unlikely-ui/button';\n\n<Tooltip.Provider${tooltipDelay === 'default' ? '' : ` delay={${tooltipDelay}}`}>\n  <Tooltip.Root>\n    <Tooltip.Trigger render={<Button size="icon" aria-label="Add project" />}>\n      <PlusIcon />\n    </Tooltip.Trigger>\n    <Tooltip.Content>Create a new project</Tooltip.Content>\n  </Tooltip.Root>\n</Tooltip.Provider>`
        }
      />
      {kind !== 'tooltip' && (
        <section className="specimen" aria-label="Nested overlay theme">
          <div className="specimen-heading">
            <h2>Nested themes</h2>
            <span className="quiet-label">INHERITED PORTAL SETTINGS</span>
          </div>
          <div className="nested-overlay-grid">
            {(['light', 'dark'] as const).map((appearance) => (
              <Theme
                key={appearance}
                appearance={appearance}

                dir={appearance === 'dark' ? 'rtl' : 'ltr'}
                tokens={{ '--u-radius': '16px' }}
                className="nested-overlay-sample"
                data-testid={`overlay-${appearance}`}
              >
                <p className="scope-caption">
                  {appearance.toUpperCase()} ·{' '}
                  {appearance === 'dark' ? 'RTL' : 'LTR'}
                </p>
                <Example />
              </Theme>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
