import { useRef, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../src/components/dropdown-menu.js';
import { Button } from '../../src/components/button.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../src/components/card.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../src/components/dialog.js';
import { Field, FieldLabel } from '../../src/components/field.js';
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
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          Contextual actions keep the main project action clear.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DropdownMenu>
          <DropdownMenuTrigger
            ref={trigger}
            render={<Button variant="secondary" />}
          >
            Project actions
          </DropdownMenuTrigger>
          <DropdownMenuContent
            finalFocus={() => (renaming ? false : trigger.current)}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Project actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setDraft(name);
                  setRenaming(true);
                }}
              >
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setMessage(`Duplicated ${name}.`)}
              >
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Transfer ownership</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              tone="danger"
              onClick={() => setMessage(`Archive requested for ${name}.`)}
            >
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardFooter>
        <p role="status">{message || 'Choose an action.'}</p>
      </CardFooter>
      <Dialog open={renaming} onOpenChange={setRenaming}>
        <DialogContent finalFocus={trigger}>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>
            Choose a name you can recognize.
          </DialogDescription>
          <form
            className="example-form"
            onSubmit={(event) => {
              event.preventDefault();
              setName(draft.trim());
              setMessage(`Renamed to ${draft.trim()}.`);
              setRenaming(false);
            }}
          >
            <Field>
              <FieldLabel>Project title</FieldLabel>
              <Input
                value={draft}
                onValueChange={setDraft}
                required
                pattern={'.*\\S.*'}
              />
            </Field>
            <div className="example-actions">
              <DialogClose render={<Button variant="secondary" />}>
                Cancel rename
              </DialogClose>
              <Button type="submit">Save name</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
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
        code={`import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from 'unlikely-ui/dropdown-menu';\nimport { Button } from 'unlikely-ui/button';\n\n<DropdownMenu>\n  <DropdownMenuTrigger render={<Button variant="secondary" />}>Actions</DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuGroup>\n      <DropdownMenuLabel>Project</DropdownMenuLabel>\n      <DropdownMenuItem onClick={() => console.log('Duplicate')}>Duplicate</DropdownMenuItem>\n      <DropdownMenuItem disabled>Transfer ownership</DropdownMenuItem>\n    </DropdownMenuGroup>\n    <DropdownMenuSeparator />\n    <DropdownMenuItem tone="danger" onClick={() => console.log('Archive requested')}>Archive</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`}
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
