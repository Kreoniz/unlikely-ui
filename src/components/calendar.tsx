'use client';

import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import type { PropsBase, PropsSingle, ClassNames } from 'react-day-picker';
export { ru, enUS } from 'react-day-picker/locale';

export type CalendarProps = Omit<
  PropsBase,
  'className' | 'classNames' | 'timeZone'
> &
  Omit<PropsSingle, 'mode'> & {
    className?: string;
    classNames?: Partial<ClassNames>;
    /** Highlight the selected date's week without enabling range selection. */
    highlightWeek?: boolean;
  };
const classes = Object.fromEntries(
  Object.keys(getDefaultClassNames()).map((key) => [key, `u-cal-${key}`]),
) as ClassNames;

export function Calendar({
  className,
  classNames,
  highlightWeek = false,
  selected,
  weekStartsOn = 1,
  modifiers,
  modifiersClassNames,
  fixedWeeks = true,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const isSelectedWeek = (date: Date) => {
    if (!selected || !highlightWeek) return false;
    const start = new Date(
      selected.getFullYear(),
      selected.getMonth(),
      selected.getDate(),
    );
    start.setDate(start.getDate() - ((start.getDay() - weekStartsOn + 7) % 7));
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return date >= start && date < end;
  };
  return (
    <DayPicker
      {...props}
      mode="single"
      selected={selected}
      weekStartsOn={weekStartsOn}
      fixedWeeks={fixedWeeks}
      showOutsideDays={showOutsideDays}
      className={['u-calendar', className].filter(Boolean).join(' ')}
      classNames={{ ...classes, ...classNames }}
      modifiers={{ selectedWeek: isSelectedWeek, ...modifiers }}
      modifiersClassNames={{
        selectedWeek: 'u-cal-selected-week',
        ...modifiersClassNames,
      }}
    />
  );
}
