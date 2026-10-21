import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from 'unlikely-ui/button';
import { PhysicalButton } from 'unlikely-ui/physical-button';
import { Theme } from 'unlikely-ui/theme';
import { Field } from 'unlikely-ui/field';
import { Input } from 'unlikely-ui/input';
import { Textarea } from 'unlikely-ui/textarea';
import { Dialog } from 'unlikely-ui/dialog';
import { Popover } from 'unlikely-ui/popover';
import { Tooltip } from 'unlikely-ui/tooltip';
import { Select } from 'unlikely-ui/select';
import { Checkbox } from 'unlikely-ui/checkbox';
import { RadioGroup } from 'unlikely-ui/radio-group';
import { Combobox } from 'unlikely-ui/combobox';
import { Calendar, ru } from 'unlikely-ui/calendar';
import { DatePicker } from 'unlikely-ui/date-picker';
import { Toast } from 'unlikely-ui/toast';
import { Spinner } from 'unlikely-ui/spinner';
import { Skeleton } from 'unlikely-ui/skeleton';
import { Badge } from 'unlikely-ui/badge';
import { Alert } from 'unlikely-ui/alert';
import { Card } from 'unlikely-ui/card';
import { ScrollArea } from 'unlikely-ui/scroll-area';

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
      <Combobox.Root items={['CS-101', 'CS-102']}>
        <Combobox.Input aria-label="Group search" />
        <Combobox.Content>
          <Combobox.Status />
          <Combobox.Empty>No groups</Combobox.Empty>
          <Combobox.List>
            {(item: string) => (
              <Combobox.Item key={item} value={item}>
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox.Root>
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
      <RadioGroup.Root
        aria-label="Schedule mode"
        variant="segmented"
        defaultValue="free"
      >
        <RadioGroup.Item value="campus">On campus</RadioGroup.Item>
        <RadioGroup.Item value="free">Free time</RadioGroup.Item>
      </RadioGroup.Root>
      <Toast.Provider>
        <Notifications />
      </Toast.Provider>
      <Card.Root>
        <Card.Header>
          <Card.Title>Packed card</Card.Title>
          <Card.Description>Presentation exports</Card.Description>
        </Card.Header>
        <Card.Content>
          <Badge category={2}>Group B</Badge>
          <Spinner label="Loading fixture" />
          <Skeleton style={{ height: 24 }} />
          <Alert.Root tone="info">
            <Alert.Title>Saved schedule</Alert.Title>
            <Alert.Description>Data is available.</Alert.Description>
          </Alert.Root>
        </Card.Content>
      </Card.Root>
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
          <Dialog.Root>
            <Dialog.Trigger render={<Button />}>
              Open project form
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Project form</Dialog.Title>
              <Dialog.Description>
                Complete the packed component example.
              </Dialog.Description>
              <Field.Root>
                <Field.Label>Priority</Field.Label>
                <Select.Root
                  defaultValue="normal"
                  items={{ normal: 'Normal', high: 'High' }}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="normal">Normal</Select.Item>
                    <Select.Item value="high">High</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Field.Root>
              <label>
                <Checkbox defaultChecked />
                Notify members
              </label>
              <RadioGroup.Root aria-label="Visibility" defaultValue="private">
                <label>
                  <RadioGroup.Item value="private" />
                  Private
                </label>
                <label>
                  <RadioGroup.Item value="shared" />
                  Shared
                </label>
              </RadioGroup.Root>
              <form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmitted(true);
                }}
              >
                <Field.Root
                  invalid={submitted && !project.trim()}
                  name="project"
                >
                  <Field.Label>Project name</Field.Label>
                  <Input required value={project} onValueChange={setProject} />
                  <Field.Description>
                    Shown in the project list.
                  </Field.Description>
                  <Field.Error match={submitted && !project.trim()}>
                    Enter a project name.
                  </Field.Error>
                </Field.Root>
                <Field.Root name="notes">
                  <Field.Label>Notes</Field.Label>
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
                </Field.Root>
                <output data-testid="native-notes">{nativeNotes}</output>
                <Button type="button" onClick={() => notesRef.current?.focus()}>
                  Focus notes
                </Button>
                <Button type="submit">Validate project</Button>
              </form>
              <Popover.Root>
                <Popover.Trigger render={<Button variant="secondary" />}>
                  Project details
                </Popover.Trigger>
                <Popover.Content>
                  <Popover.Title>Packed popover</Popover.Title>
                  <Popover.Description>
                    Rendered above the packed dialog.
                  </Popover.Description>
                  <Popover.Close render={<Button />}>
                    Close details
                  </Popover.Close>
                </Popover.Content>
              </Popover.Root>
              <Dialog.Close render={<Button variant="secondary" />}>
                Close form
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Root>
          <Tooltip.Provider delay={600} closeDelay={200}>
            <Tooltip.Root>
              <Tooltip.Trigger
                delay={100}
                closeDelay={0}
                render={<Button variant="secondary" />}
              >
                Keyboard hint
              </Tooltip.Trigger>
              <Tooltip.Content>Packed tooltip</Tooltip.Content>
            </Tooltip.Root>
            <Tooltip.Root>
              <Tooltip.Trigger render={<Button variant="secondary" />}>
                Timed hint
              </Tooltip.Trigger>
              <Tooltip.Content>Provider timing</Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
          <AdoptionComponents />
        </Theme>
      </Theme>
    </>
  );
}
