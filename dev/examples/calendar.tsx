import { useState } from 'react';
import { Calendar, ru, enUS } from '../../src/components/calendar.js';
import { DatePicker } from '../../src/components/date-picker.js';
import { RadioGroup } from '../../src/components/radio-group.js';
import { Button } from '../../src/components/button.js';
import { CheckControl } from '../controls.js';
import { CodeBlock } from '../code-block.js';

export const calendarToday = new Date(2026, 9, 19);

export function CalendarExamples({ picker = false }: { picker?: boolean }) {
  const [selected, setSelected] = useState<Date | undefined>(calendarToday);
  const [month, setMonth] = useState(calendarToday);
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [highlight, setHighlight] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [disableToday, setDisableToday] = useState(false);
  const locale = language === 'ru' ? ru : enUS;
  return (
    <>
      <section
        className={picker ? 'specimen' : 'specimen calendar-specimen'}
        aria-label="Calendar playground"
      >
        <div className="specimen-heading">
          <h2>{picker ? 'Date picker' : 'Date calendar'}</h2>
          <span className="quiet-label">MONDAY-FIRST</span>
        </div>
        <div className="playground-stage calendar-stage">
          {picker ? (
            <>
              <DatePicker
                value={selected ?? null}
                onValueChange={setSelected}
                today={calendarToday}
                locale={locale}
                disabled={disabled}
                placeholder={
                  language === 'ru' ? 'Выберите дату' : 'Choose a date'
                }
                label={language === 'ru' ? 'Дата расписания' : 'Schedule date'}
                todayLabel={language === 'ru' ? 'Сегодня' : 'Today'}
                highlightWeek={highlight}
                calendarProps={{
                  disabled: [
                    { before: new Date(2026, 9, 5) },
                    ...(disableToday ? [calendarToday] : []),
                  ],
                }}
              />
              <Button
                variant="ghost"
                disabled={disabled}
                onClick={() => setSelected(undefined)}
              >
                Clear date
              </Button>
            </>
          ) : (
            <>
              <Calendar
                selected={selected}
                onSelect={setSelected}
                month={month}
                onMonthChange={setMonth}
                locale={locale}
                today={calendarToday}
                highlightWeek={highlight}
                disabled={{ before: new Date(2026, 9, 5) }}
              />
              <Button
                variant="ghost"
                onClick={() => {
                  setSelected(calendarToday);
                  setMonth(calendarToday);
                }}
              >
                {language === 'ru' ? 'Сегодня' : 'Today'}
              </Button>
            </>
          )}
          <p className="playground-feedback" role="status">
            {selected
              ? selected.toLocaleDateString('en-CA')
              : 'No date selected.'}
          </p>
        </div>
        <div className="playground-controls">
          <RadioGroup.Root
            variant="segmented"
            aria-label="Calendar language"
            value={language}
            onValueChange={setLanguage}
          >
            <RadioGroup.Item value="ru">Русский</RadioGroup.Item>
            <RadioGroup.Item value="en">English</RadioGroup.Item>
          </RadioGroup.Root>
          <CheckControl checked={highlight} onCheckedChange={setHighlight}>
            Highlight selected week
          </CheckControl>
          {picker && (
            <>
              <CheckControl checked={disabled} onCheckedChange={setDisabled}>
                Disabled
              </CheckControl>
              <CheckControl
                checked={disableToday}
                onCheckedChange={setDisableToday}
              >
                Disable today
              </CheckControl>
            </>
          )}
        </div>
        <p className="specimen-note">
          The fixed reference date is 19 October 2026. Earlier dates before 5
          October are disabled in this example. Apps own the meaning of today
          and date-to-URL conversion.
        </p>
      </section>
      <CodeBlock
        code={
          picker
            ? `import { DatePicker } from 'unlikely-ui/date-picker';\nimport { ru } from 'unlikely-ui/calendar';\n\n<DatePicker label="Дата расписания"\n  value={date} onValueChange={setDate}\n  locale={ru} todayLabel="Сегодня" highlightWeek />`
            : `import { Calendar, ru } from 'unlikely-ui/calendar';\n\n<Calendar selected={date} onSelect={setDate}\n  locale={ru} weekStartsOn={1} highlightWeek />`
        }
      />
    </>
  );
}
