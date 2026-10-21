import type { ButtonProps } from 'unlikely-ui/button';
import type { PhysicalButtonProps } from 'unlikely-ui/physical-button';
import type { ThemeTokens } from 'unlikely-ui/theme';
import type { InputProps } from 'unlikely-ui/input';
import type { TextareaProps } from 'unlikely-ui/textarea';
import type { DialogContentProps } from 'unlikely-ui/dialog';
import type { PopoverContentProps } from 'unlikely-ui/popover';
import type {
  TooltipContentProps,
  TooltipProviderProps,
  TooltipTriggerProps,
} from 'unlikely-ui/tooltip';
import { createRef } from 'react';
import type { CheckboxProps } from 'unlikely-ui/checkbox';
import type { RadioGroupProps } from 'unlikely-ui/radio-group';
import type { SelectContentProps } from 'unlikely-ui/select';
import type { ComboboxInputProps } from 'unlikely-ui/combobox';
import type { CalendarProps } from 'unlikely-ui/calendar';
import type { DatePickerProps } from 'unlikely-ui/date-picker';
import type { ToastViewportProps } from 'unlikely-ui/toast';
import type { BadgeProps } from 'unlikely-ui/badge';
import type { AlertProps } from 'unlikely-ui/alert';
import type { SpinnerProps } from 'unlikely-ui/spinner';
import type { SkeletonProps } from 'unlikely-ui/skeleton';
import type {
  ScrollAreaViewportProps,
  ScrollAreaScrollbarProps,
} from 'unlikely-ui/scroll-area';

const scrollViewport: ScrollAreaViewportProps = {
  ref: createRef<HTMLDivElement>(),
  onScroll: (event) => event.currentTarget.scrollTop,
  className: (state) => (state.hasOverflowY ? 'overflowing' : undefined),
};
const scrollBar: ScrollAreaScrollbarProps = { orientation: 'horizontal' };
void [scrollViewport, scrollBar];

const allowed: ThemeTokens = {
  '--u-radius': '12px',
  '--u-physical-cap': '#ff4b40',
  '--u-physical-indicator': '#88f19e',
};
const physical: PhysicalButtonProps = {
  size: 'lg',
  shape: 'round',
  depth: 'high',
  indicator: true,
  colors: { cap: '#88f19e', indicator: 'var(--u-accent)' },
  ref: createRef<HTMLButtonElement>(),
  className: (state) => (state.disabled ? 'disabled-control' : undefined),
  style: (state) => ({ opacity: state.disabled ? 0.5 : 1 }),
};
void physical;
// @ts-expect-error Private palette references are not supported theme overrides.
const privateToken: ThemeTokens = { '--u-ref-mint-300': 'red' };
// @ts-expect-error Icon-only actions require an accessible name.
const unnamed: ButtonProps = { size: 'icon' };
void [allowed, privateToken, unnamed];
const input: InputProps = {
  onValueChange: (value) => value.toUpperCase(),
  size: 'lg',
};
const textarea: TextareaProps = {
  rows: 5,
  ref: createRef<HTMLTextAreaElement>(),
  onChange: (event) => event.currentTarget.rows,
};
const dialog: DialogContentProps = {
  initialFocus: createRef<HTMLElement>(),
  portalProps: { keepMounted: true },
};
const popover: PopoverContentProps = {
  positionerProps: { align: 'start', side: 'right' },
};
const tooltip: TooltipContentProps = { positionerProps: { side: 'bottom' } };
const tooltipTiming: TooltipProviderProps = { delay: 600, closeDelay: 100 };
// @ts-expect-error Tooltips have no instant-open group or warmup timeout.
const groupedTooltip: TooltipProviderProps = { timeout: 400 };
const tooltipRef: TooltipTriggerProps = {
  ref: (element) => {
    const button: HTMLButtonElement | null = element;
    void button?.disabled;
    // @ts-expect-error Default tooltip triggers are buttons, not links.
    void element?.href;
  },
};
const namedTooltipRef: TooltipTriggerProps = {
  ref: createRef<HTMLButtonElement>(),
};
const genericTooltipRef: TooltipTriggerProps = {
  ref: (element: HTMLElement | null) => element?.focus(),
};
const anchorTooltipRef: TooltipTriggerProps = {
  // @ts-expect-error A default button trigger does not accept an anchor ref.
  ref: createRef<HTMLAnchorElement>(),
};
void [input, textarea, dialog, popover, tooltip, tooltipTiming, groupedTooltip];
void [tooltipRef, namedTooltipRef, genericTooltipRef, anchorTooltipRef];
const checkbox: CheckboxProps = {
  checked: true,
  onCheckedChange: (checked) => !checked,
};
const radio: RadioGroupProps<'one' | 'two'> = {
  value: 'one',
  onValueChange: (value) => value.toUpperCase(),
};
const select: SelectContentProps = {
  positionerProps: { alignItemWithTrigger: false },
};
void [checkbox, radio, select];
const combobox: ComboboxInputProps = {
  size: 'sm',
  ref: createRef<HTMLInputElement>(),
};
const calendar: CalendarProps = {
  selected: new Date(),
  onSelect: (date) => date?.getDate(),
  highlightWeek: true,
};
const datePicker: DatePickerProps = {
  label: 'Schedule date',
  value: null,
  onValueChange: (date) => date.getDate(),
};
// @ts-expect-error Date picker triggers require a descriptive name.
const unnamedDatePicker: DatePickerProps = {};
const toast: ToastViewportProps = {
  closeLabel: 'Close',
  portalProps: { container: null },
};
const badge: BadgeProps = { category: 2 };
const alert: AlertProps = { tone: 'danger', role: 'alert' };
const spinner: SpinnerProps = { label: null };
const skeleton: SkeletonProps = { style: { height: 32 } };
void [
  combobox,
  calendar,
  datePicker,
  unnamedDatePicker,
  toast,
  badge,
  alert,
  spinner,
  skeleton,
];
