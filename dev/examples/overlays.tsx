import { useState } from 'react';
import { Button } from '../../src/components/button.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../../src/components/dialog.js';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from '../../src/components/popover.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../src/components/tooltip.js';
import { Theme } from '../../src/theme.js';
import { Field, FieldLabel } from '../../src/components/field.js';
import { Input } from '../../src/components/input.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../src/components/select.js';
import { ProjectDialog } from './project-dialog.js';
import projectDialogSource from './project-dialog.tsx?raw';
import { ExampleCode, consumerSource } from '../example-code.js';
import { CodeBlock } from '../code-block.js';
import { Glyph } from '../glyph.js';

function PreferencesPopover() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Alex');
  const [saved, setSaved] = useState('');
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button variant="secondary" />}>
          Edit display name
        </PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Display name</PopoverTitle>
          <PopoverDescription>Shown next to your activity.</PopoverDescription>
          <form
            className="example-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(`Display name saved: ${name}.`);
              setOpen(false);
            }}
          >
            <Field>
              <FieldLabel>Your name</FieldLabel>
              <Input
                required
                value={name}
                onValueChange={setName}
                autoComplete="nickname"
              />
            </Field>
            <div className="example-actions">
              <PopoverClose render={<Button variant="secondary" />}>
                Cancel
              </PopoverClose>
              <Button type="submit">Save name</Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
      <p className="playground-feedback" role="status">
        {saved || 'Edit a value without leaving the page.'}
      </p>
    </>
  );
}

function TooltipExample({ delay }: { delay?: number }) {
  const [count, setCount] = useState(0);
  return (
    <TooltipProvider delay={delay}>
      <div className="tooltip-examples">
        <Tooltip>
          <TooltipTrigger
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
          </TooltipTrigger>
          <TooltipContent>Create a new project</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size="icon"
                aria-label="Project settings"
                variant="secondary"
              />
            }
          >
            <Glyph name="sliders" />
          </TooltipTrigger>
          <TooltipContent>Manage project settings</TooltipContent>
        </Tooltip>
        <Tooltip disabled>
          <TooltipTrigger
            render={
              <Button size="icon" aria-label="Unavailable action" disabled />
            }
          >
            <Glyph name="sliders" />
          </TooltipTrigger>
          <TooltipContent>This action is unavailable</TooltipContent>
        </Tooltip>
      </div>
      <p className="playground-feedback" role="status">
        {count
          ? `Added ${count} ${count === 1 ? 'project' : 'projects'}.`
          : 'Hover or focus the add button. Press Escape to dismiss.'}
      </p>
    </TooltipProvider>
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
            <Field>
              <FieldLabel>Hover delay</FieldLabel>
              <Select
                value={tooltipDelay}
                onValueChange={(value) => value && setTooltipDelay(value)}
                items={{
                  default: 'Default (300 ms)',
                  '0': 'Instant',
                  '600': '600 ms',
                }}
              >
                <SelectTrigger size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default (300 ms)</SelectItem>
                  <SelectItem value="0">Instant</SelectItem>
                  <SelectItem value="600">600 ms</SelectItem>
                </SelectContent>
              </Select>
            </Field>
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
      <ExampleCode
        complete={
          kind === 'dialog' ? consumerSource(projectDialogSource) : undefined
        }
        code={
          kind === 'dialog'
            ? `import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from 'unlikely-ui/dialog';\nimport { Button } from 'unlikely-ui/button';\n\n<Dialog>\n  <DialogTrigger render={<Button />}>New project</DialogTrigger>\n  <DialogContent>\n    <DialogTitle>Create project</DialogTitle>\n    <DialogDescription>Add project details.</DialogDescription>\n    {/* Form content */}\n    <DialogClose render={<Button variant="secondary" />}>\n      Cancel\n    </DialogClose>\n  </DialogContent>\n</Dialog>`
            : kind === 'popover'
              ? `import { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from 'unlikely-ui/popover';\nimport { Button } from 'unlikely-ui/button';\n\n<Popover>\n  <PopoverTrigger render={<Button variant="secondary" />}>\n    Edit profile\n  </PopoverTrigger>\n  <PopoverContent positionerProps={{ align: 'start' }}>\n    <PopoverTitle>Profile</PopoverTitle>\n    <PopoverDescription>Edit your display name.</PopoverDescription>\n    {/* Profile fields */}\n  </PopoverContent>\n</Popover>`
              : `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'unlikely-ui/tooltip';\nimport { Button } from 'unlikely-ui/button';\n\n<TooltipProvider${tooltipDelay === 'default' ? '' : ` delay={${tooltipDelay}}`}>\n  <Tooltip>\n    <TooltipTrigger render={<Button size="icon" aria-label="Add project" />}>\n      <PlusIcon />\n    </TooltipTrigger>\n    <TooltipContent>Create a new project</TooltipContent>\n  </Tooltip>\n</TooltipProvider>`
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
