import { useRef, useState } from 'react';
import { ProjectDialog } from './copied/project-dialog.js';
import { createPortal } from 'react-dom';
import { Button, buttonVariants } from 'unlikely-ui/button';
import { PhysicalButton } from 'unlikely-ui/physical-button';
import { Theme } from 'unlikely-ui/theme';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from 'unlikely-ui/field';
import { Input } from 'unlikely-ui/input';
import { Textarea } from 'unlikely-ui/textarea';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
} from 'unlikely-ui/dialog';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from 'unlikely-ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'unlikely-ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'unlikely-ui/select';
import { Checkbox } from 'unlikely-ui/checkbox';
import { RadioGroup, RadioGroupItem } from 'unlikely-ui/radio-group';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxStatus,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  useComboboxAnchor,
} from 'unlikely-ui/combobox';
import { Calendar, ru } from 'unlikely-ui/calendar';
import { DatePicker } from 'unlikely-ui/date-picker';
import { Toast } from 'unlikely-ui/toast';
import { Spinner } from 'unlikely-ui/spinner';
import { Skeleton } from 'unlikely-ui/skeleton';
import { Badge } from 'unlikely-ui/badge';
import { Alert, AlertDescription, AlertTitle } from 'unlikely-ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from 'unlikely-ui/card';
import { ScrollArea } from 'unlikely-ui/scroll-area';
import { Switch } from 'unlikely-ui/switch';
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from 'unlikely-ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'unlikely-ui/dropdown-menu';

function LiveControlChanges() {
  const [disabled, setDisabled] = useState(false);
  const [changes, setChanges] = useState(0);
  const [dir, setDir] = useState<'ltr' | 'rtl'>('rtl');
  return (
    <section aria-label="Live control changes">
      <Button onClick={() => setDisabled(!disabled)}>
        {disabled ? 'Enable picker' : 'Disable picker'}
      </Button>
      <DatePicker
        label="Mutable date"
        today={new Date(2026, 9, 30)}
        disabled={disabled}
        onValueChange={() => setChanges((value) => value + 1)}
      />
      <output aria-label="Date changes">{changes}</output>
      <Button onClick={() => setDir(dir === 'rtl' ? 'ltr' : 'rtl')}>
        {dir === 'rtl' ? 'Use LTR tabs' : 'Use RTL tabs'}
      </Button>
      <Theme dir={dir}>
        <Tabs defaultValue="overview">
          <TabsList variant="line" aria-label="Live panels">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsIndicator />
          </TabsList>
          <TabsContent value="overview">Overview content</TabsContent>
          <TabsContent value="details">Details content</TabsContent>
        </Tabs>
        <Tabs defaultValue="overview" orientation="vertical">
          <TabsList variant="line" aria-label="Vertical live panels">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">Vertical overview</TabsContent>
          <TabsContent value="details">Vertical details</TabsContent>
        </Tabs>
      </Theme>
    </section>
  );
}

function RetainedDialogConsumer() {
  const [clicks, setClicks] = useState(0);
  return (
    <section aria-label="Retained Dialog probe">
      <Button onClick={() => setClicks((value) => value + 1)}>
        Outside clicks: {clicks}
      </Button>
      <Dialog>
        <DialogTrigger render={<Button />}>Open retained dialog</DialogTrigger>
        <DialogContent
          portalProps={{ keepMounted: true }}
          closeLabel="Close retained dialog"
        >
          <DialogTitle>Retained dialog</DialogTitle>
          <DialogDescription>
            Closing keeps this draft mounted.
          </DialogDescription>
          <Field>
            <FieldLabel>Retained draft</FieldLabel>
            <Input defaultValue="Initial draft" />
          </Field>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function LanguageConsumer() {
  return (
    <Theme lang="ru" dir="ltr">
      <Dialog>
        <DialogTrigger render={<Button />}>Проверить язык</DialogTrigger>
        <DialogContent closeLabel="Закрыть проверку">
          <DialogTitle>Язык диалога</DialogTitle>
          <DialogDescription>Язык наследуется через портал.</DialogDescription>
          <Field>
            <FieldLabel>Проект</FieldLabel>
            <Select defaultValue="shared" items={{ shared: 'Общий' }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shared">Общий</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Theme lang="en">
            <Popover>
              <PopoverTrigger render={<Button />}>
                Open English panel
              </PopoverTrigger>
              <PopoverContent>
                <PopoverTitle>English panel</PopoverTitle>
                <PopoverDescription>
                  A nested language override.
                </PopoverDescription>
                <PopoverClose render={<Button />}>
                  Close English panel
                </PopoverClose>
              </PopoverContent>
            </Popover>
          </Theme>
        </DialogContent>
      </Dialog>
    </Theme>
  );
}

function ShadcnComponents() {
  const [groups, setGroups] = useState<string[]>(['Design', 'Engineering']);
  const anchor = useComboboxAnchor();
  return (
    <Theme appearance="light" tokens={{ '--u-accent': '#bfdcff' }}>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Shared app foundations</CardTitle>
          <CardAction>
            <a
              href="#migration"
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              Details
            </a>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div
            data-testid="semantic-utilities"
            className="bg-primary text-primary-foreground font-sans"
          >
            Shared semantic utilities
          </div>
          <Combobox
            multiple
            items={['Design', 'Engineering']}
            value={groups}
            onValueChange={setGroups}
          >
            <ComboboxChips ref={anchor}>
              {groups.map((group) => (
                <ComboboxChip key={group} removeLabel={`Remove ${group}`}>
                  {group}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput aria-label="Migration groups" />
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxList>
                {(group: string) => (
                  <ComboboxItem key={group} value={group}>
                    {group}
                  </ComboboxItem>
                )}
              </ComboboxList>
              <ComboboxEmpty>No matching groups</ComboboxEmpty>
            </ComboboxContent>
          </Combobox>
          <p role="status">Migration groups: {groups.join(', ') || 'none'}</p>
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Open shadcn theme probe
            </DialogTrigger>
            <DialogContent closeLabel="Dismiss theme probe">
              <DialogHeader>
                <DialogTitle>Shadcn theme probe</DialogTitle>
                <DialogDescription>
                  A nested theme follows its portaled components.
                </DialogDescription>
              </DialogHeader>
              <div
                data-testid="shadcn-portal-alias"
                className="bg-primary text-primary-foreground"
                style={{ border: '1px solid var(--primary)' }}
              >
                Portaled semantic tokens
              </div>
              <DialogFooter showCloseButton closeLabel="Done" />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </Theme>
  );
}

function LegacyConsumer() {
  return (
    <Theme appearance="light" tokens={{ '--u-radius': '12px' }}>
      <section aria-label="Legacy consumer">
        <Dialog.Root>
          <Dialog.Trigger render={<Button variant="primary" size="md" />}>
            Legacy project
          </Dialog.Trigger>
          <Dialog.Content showCloseButton={false}>
            <Dialog.Title>Legacy project form</Dialog.Title>
            <Dialog.Description>
              Explicit dismissal controls retained during migration.
            </Dialog.Description>
            <Field.Root>
              <Field.Label>Legacy project name</Field.Label>
              <Input />
            </Field.Root>
            <Combobox.Root items={['Old API', 'New API']}>
              <Combobox.Input aria-label="Legacy option" />
              <Combobox.Content>
                <Combobox.List>
                  {(item: string) => (
                    <Combobox.Item key={item} value={item}>
                      {item}
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </Combobox.Content>
            </Combobox.Root>
            <Dialog.Close render={<Button variant="secondary" />}>
              Cancel legacy project
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
      </section>
      <section aria-label="Copied project workflow">
        <ProjectDialog />
      </section>
    </Theme>
  );
}

function CommonControls() {
  const [result, setResult] = useState('');
  return (
    <Theme
      tokens={{
        '--u-selection': 'var(--u-category-2)',
        '--u-selection-ink': 'var(--u-category-ink)',
      }}
    >
      <section aria-label="Packed common controls">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setResult(
              `Preference: ${new FormData(event.currentTarget).get('autosave')}.`,
            );
          }}
        >
          <label>
            <Switch
              name="autosave"
              value="on"
              uncheckedValue="off"
              defaultChecked
            />{' '}
            Packed auto-save
          </label>
          <Button type="submit">Submit packed preference</Button>
          <Button variant="secondary" type="reset">
            Reset packed preference
          </Button>
        </form>
        <Tabs defaultValue="details">
          <TabsList aria-label="Packed panels">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsIndicator />
          </TabsList>
          <TabsContent value="details">Packed details panel</TabsContent>
          <TabsContent value="activity">Packed activity panel</TabsContent>
        </Tabs>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="secondary" />}>
            Packed actions
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Packed project</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setResult('Packed duplicate selected.')}
              >
                Duplicate packed project
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Unavailable packed action
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem tone="danger">
              Archive packed project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <p role="status">{result}</p>
      </section>
    </Theme>
  );
}

const referenceDate = new Date(2026, 9, 19);
function Notifications() {
  const manager = Toast.useToastManager();
  return (
    <>
      <Button
        onClick={() =>
          manager.add({
            title: 'Packed notification',
            type: 'success',
            timeout: 0,
          })
        }
      >
        Notify
      </Button>
      <Toast.Viewport />
    </>
  );
}

function AdoptionComponents() {
  const [date, setDate] = useState(referenceDate);
  const [pressed, setPressed] = useState(false);
  return (
    <section aria-label="Adoption components">
      <CommonControls />
      <ScrollArea.Root
        style={{ height: 120, width: 240, maxWidth: '100%' }}
        data-testid="packed-scroll-area"
      >
        <ScrollArea.Viewport role="region" aria-label="Packed resources">
          <ScrollArea.Content>
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i}>Resource {i + 1}</p>
            ))}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
      <PhysicalButton
        size="sm"
        pattern="plain"
        shape="square"
        indicator
        colors={{
          cap: 'var(--u-accent)',
          capText: 'var(--u-accent-ink)',
          indicator: 'var(--u-accent)',
        }}
        aria-pressed={pressed}
        onClick={() => setPressed(!pressed)}
      >
        Power
      </PhysicalButton>
      <Field>
        <FieldLabel>Group search</FieldLabel>
        <FieldDescription>Find a group by name.</FieldDescription>
        <Combobox items={['CS-101', 'CS-102']}>
          <ComboboxInput triggerLabel="Показать группы" />
          <ComboboxContent>
            <ComboboxStatus />
            <ComboboxEmpty>No groups</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <DatePicker
        label="Schedule date"
        today={referenceDate}
        locale={ru}
        todayLabel="Сегодня"
        value={date}
        onValueChange={setDate}
        highlightWeek
      />
      <Calendar
        today={referenceDate}
        defaultMonth={referenceDate}
        selected={date}
        onSelect={(value) => value && setDate(value)}
      />
      <RadioGroup
        aria-label="Schedule mode"
        variant="segmented"
        defaultValue="free"
      >
        <RadioGroupItem value="campus">On campus</RadioGroupItem>
        <RadioGroupItem value="free">Free time</RadioGroupItem>
      </RadioGroup>
      <Toast.Provider>
        <Notifications />
      </Toast.Provider>
      <Card>
        <CardHeader>
          <CardTitle>Packed card</CardTitle>
          <CardDescription>Presentation exports</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge category={2}>Group B</Badge>
          <Spinner label="Loading fixture" />
          <Skeleton style={{ height: 24 }} />
          <Alert tone="info">
            <AlertTitle>Saved schedule</AlertTitle>
            <AlertDescription>Data is available.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </section>
  );
}

export function ConsumerApp() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const [nativeNotes, setNativeNotes] = useState('');
  return (
    <>
      <button id="host-button" type="button">
        Host native button
      </button>
      <div id="utility-reference" className="bg-fuchsia-100">
        Consumer utility reference
      </div>
      <Theme appearance="dark">
        <ShadcnComponents />
        <LegacyConsumer />
        <Button
          data-testid="default-button"
          onClick={() => setCount((n) => n + 1)}
        >
          Count {count}
        </Button>
        <Button data-testid="override-button" className="bg-fuchsia-100">
          Consumer override
        </Button>
        <Theme appearance="light" dir="rtl" tokens={{ '--u-radius': '16px' }}>
          <Button onClick={() => setOpen((value) => !value)}>
            Toggle portal probe
          </Button>
          {open &&
            createPortal(
              <Theme data-testid="packed-portal">
                <Button>Portaled action</Button>
              </Theme>,
              document.body,
            )}
          <Dialog>
            <DialogTrigger render={<Button />}>Open project form</DialogTrigger>
            <DialogContent>
              <DialogTitle>Project form</DialogTitle>
              <DialogDescription>
                Complete the packed component example.
              </DialogDescription>
              <Field>
                <FieldLabel>Priority</FieldLabel>
                <Select
                  defaultValue="normal"
                  items={{ normal: 'Normal', high: 'High' }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <label>
                <Checkbox defaultChecked />
                Notify members
              </label>
              <RadioGroup aria-label="Visibility" defaultValue="private">
                <label>
                  <RadioGroupItem value="private" />
                  Private
                </label>
                <label>
                  <RadioGroupItem value="shared" />
                  Shared
                </label>
              </RadioGroup>
              <form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmitted(true);
                }}
              >
                <Field invalid={submitted && !project.trim()} name="project">
                  <FieldLabel>Project name</FieldLabel>
                  <Input required value={project} onValueChange={setProject} />
                  <FieldDescription>
                    Shown in the project list.
                  </FieldDescription>
                  <FieldError match={submitted && !project.trim()}>
                    Enter a project name.
                  </FieldError>
                </Field>
                <Field name="notes">
                  <FieldLabel>Notes</FieldLabel>
                  <Textarea
                    ref={notesRef}
                    value={notes}
                    onValueChange={setNotes}
                    onChange={(event) =>
                      setNativeNotes(event.currentTarget.value)
                    }
                    className={(state) =>
                      state.filled ? 'fixture-filled' : undefined
                    }
                    rows={3}
                  />
                </Field>
                <output data-testid="native-notes">{nativeNotes}</output>
                <Button type="button" onClick={() => notesRef.current?.focus()}>
                  Focus notes
                </Button>
                <Button type="submit">Validate project</Button>
              </form>
              <Popover>
                <PopoverTrigger render={<Button variant="secondary" />}>
                  Project details
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverTitle>Packed popover</PopoverTitle>
                  <PopoverDescription>
                    Rendered above the packed dialog.
                  </PopoverDescription>
                  <PopoverClose render={<Button />}>Close details</PopoverClose>
                </PopoverContent>
              </Popover>
              <DialogClose render={<Button variant="secondary" />}>
                Close form
              </DialogClose>
            </DialogContent>
          </Dialog>
          <TooltipProvider delay={600} closeDelay={200}>
            <Tooltip>
              <TooltipTrigger
                delay={100}
                closeDelay={0}
                render={<Button variant="secondary" />}
              >
                Keyboard hint
              </TooltipTrigger>
              <TooltipContent>Packed tooltip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger render={<Button variant="secondary" />}>
                Timed hint
              </TooltipTrigger>
              <TooltipContent>Provider timing</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AdoptionComponents />
          <LanguageConsumer />
          <RetainedDialogConsumer />
          <LiveControlChanges />
        </Theme>
      </Theme>
    </>
  );
}
