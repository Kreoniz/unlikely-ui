'use client';

import { useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { dateMatchModifiers } from 'react-day-picker';
import { Calendar } from './calendar.js';
import type { CalendarProps } from './calendar.js';
import { Popover } from './popover.js';
import { Button } from './button.js';

export interface DatePickerProps {
  /** Controlled selected local date. Null clears the selection. */
  value?: Date | null;
  /** Initial selected date for uncontrolled use. */
  defaultValue?: Date;
  /** Called with the chosen date before the popup closes. */
  onValueChange?: (date: Date) => void;
  /** Prevent opening or changing the date. */
  disabled?: boolean;
  /** Trigger text when no date is selected. */
  placeholder?: string;
  /** Required accessible name for the trigger and popup. */
  label: string;
  /** Label of the action that selects today. */
  todayLabel?: string;
  /** App-owned reference for today; defaults to the current local date. */
  today?: Date;
  /** DayPicker locale for calendar labels and date formatting. */
  locale?: CalendarProps['locale'];
  /** First weekday, from 0 (Sunday) to 6 (Saturday). */
  weekStartsOn?: CalendarProps['weekStartsOn'];
  /** Highlight the week containing the selected date. Selection remains one date. */
  highlightWeek?: boolean;
  /** Additional Calendar props, excluding selection, month, and locale managed here. */
  calendarProps?: Omit<
    CalendarProps,
    | 'selected'
    | 'onSelect'
    | 'locale'
    | 'today'
    | 'weekStartsOn'
    | 'highlightWeek'
    | 'month'
    | 'defaultMonth'
    | 'onMonthChange'
  >;
  /** Native trigger-button attributes and ref. */
  triggerProps?: Omit<
    ComponentPropsWithRef<'button'>,
    'children' | 'onClick' | 'disabled' | 'value' | 'defaultValue'
  >;
}

export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  disabled,
  placeholder = 'Choose a date',
  label,
  todayLabel = 'Today',
  today = new Date(),
  locale,
  weekStartsOn = 1,
  highlightWeek = false,
  calendarProps,
  triggerProps,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const selected = value === undefined ? internalValue : (value ?? undefined);
  const [month, setMonth] = useState(selected ?? today);
  const dateLabel = selected
    ? selected.toLocaleDateString(locale?.code ?? 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : placeholder;
  function select(date: Date | undefined) {
    if (!date) return;
    if (value === undefined) setInternalValue(date);
    onValueChange?.(date);
    setOpen(false);
  }
  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        if (next) setMonth(selected ?? today);
        setOpen(next);
      }}
    >
      <Popover.Trigger
        disabled={disabled}
        render={<Button variant="secondary" {...triggerProps} />}
        aria-label={`${label}: ${dateLabel}`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          <path d="M5 4h14v17H5zM8 2v5m8-5v5M5 10h14" />
        </svg>
        {dateLabel}
      </Popover.Trigger>
      <Popover.Content
        className="u-date-picker"
        initialFocus={true}
        aria-label={label}
        positionerProps={{ collisionPadding: 4 }}
      >
        <Calendar
          {...calendarProps}
          month={month}
          onMonthChange={setMonth}
          selected={selected}
          onSelect={(date) => select(date ?? selected)}
          autoFocus
          today={today}
          locale={locale}
          weekStartsOn={weekStartsOn}
          highlightWeek={highlightWeek}
        />
        <Button
          variant="ghost"
          className="u-date-picker-today"
          onClick={() => select(today)}
          disabled={
            dateMatchModifiers(today, calendarProps?.disabled ?? false) ||
            dateMatchModifiers(today, calendarProps?.hidden ?? false)
          }
        >
          {todayLabel}
        </Button>
      </Popover.Content>
    </Popover.Root>
  );
}
