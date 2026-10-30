import { useRef, useState } from 'react';
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from '../../../src/components/alert.js';
import { Badge } from '../../../src/components/badge.js';
import { Button } from '../../../src/components/button.js';
import { Checkbox } from '../../../src/components/checkbox.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../src/components/dialog.js';
import {
  Field,
  FieldError,
  FieldLabel,
} from '../../../src/components/field.js';
import { Input } from '../../../src/components/input.js';
import {
  RadioGroup,
  RadioGroupItem,
} from '../../../src/components/radio-group.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../src/components/select.js';
import { Skeleton } from '../../../src/components/skeleton.js';
import { Spinner } from '../../../src/components/spinner.js';
import type { StudyProps } from './types.js';
import './desk.css';

type Project = 'notes' | 'website' | 'tools';
type View = 'all' | 'active' | 'done';
type Task = {
  id: number;
  title: { en: string; ru: string };
  project: Project;
  due: 'today' | 'next' | 'week';
  done: boolean;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: {
      en: 'Publish the reading list',
      ru: 'Опубликовать список для чтения',
    },
    project: 'notes',
    due: 'today',
    done: false,
  },
  {
    id: 2,
    title: { en: 'Tighten the project page', ru: 'Упростить страницу проекта' },
    project: 'website',
    due: 'today',
    done: false,
  },
  {
    id: 3,
    title: {
      en: 'Try the calendar on mobile',
      ru: 'Проверить календарь на телефоне',
    },
    project: 'tools',
    due: 'next',
    done: false,
  },
  {
    id: 4,
    title: {
      en: 'Write notes from the last review',
      ru: 'Записать выводы последнего обсуждения',
    },
    project: 'notes',
    due: 'week',
    done: false,
  },
  {
    id: 5,
    title: {
      en: 'Archive the early sketches',
      ru: 'Собрать ранние наброски в архив',
    },
    project: 'website',
    due: 'week',
    done: true,
  },
];
const copy = {
  en: {
    workspace: 'Personal workspace',
    desk: 'Desk',
    projects: 'Projects',
    note: 'Weekly note',
    title: 'Your project desk',
    lead: 'Three projects. One clear next step.',
    wholeDesk: 'Whole desk',
    shown: 'shown',
    activeCount: 'active',
    newTask: 'New task',
    queue: 'Work queue',
    all: 'All',
    active: 'Active',
    done: 'Done',
    find: 'Find a task',
    placeholder: 'Search your tasks…',
    allProjects: 'All projects',
    today: 'Today',
    next: 'Next up',
    week: 'This week',
    complete: 'Mark complete',
    reopen: 'Mark active',
    emptyTitle: 'A little breathing room.',
    emptyDescription: 'Start with one small task. The rest can wait.',
    first: 'Add a task',
    noResults: 'Nothing matches this view.',
    noResultsHelp: 'Try another search or clear the filters.',
    clear: 'Clear filters',
    loading: 'Loading your desk…',
    error: 'Your desk couldn’t be loaded',
    errorHelp: 'Your work is still safe. Try loading it again.',
    retry: 'Try again',
    noteBody:
      'Finish the useful things before starting the interesting ones. A simpler project page and a finished reading list are enough for this week.',
    noteFoot: 'A reminder to yourself',
    projectHelp: 'Active tasks across your whole desk.',
    dialogTitle: 'Add a task',
    dialogDescription: 'Give the next step a name and a place.',
    taskName: 'Task name',
    taskPlaceholder: 'What’s the next useful step?',
    project: 'Project',
    required: 'Enter a task name.',
    cancel: 'Cancel',
    add: 'Add task',
    close: 'Close new task',
    notes: 'Reading notes',
    website: 'Personal site',
    tools: 'Small tools',
    created: 'Task added',
    completed: 'Completed',
    reopened: 'Back in progress',
    completeCount: 'complete',
  },
  ru: {
    workspace: 'Личное пространство',
    desk: 'Рабочий стол',
    projects: 'Проекты',
    note: 'Заметка на неделю',
    title: 'Ваши проекты',
    lead: 'Три проекта. Один понятный следующий шаг.',
    wholeDesk: 'Весь стол',
    shown: 'показано',
    activeCount: 'в работе',
    newTask: 'Новая задача',
    queue: 'Список задач',
    all: 'Все',
    active: 'В работе',
    done: 'Готово',
    find: 'Найти задачу',
    placeholder: 'Поиск по вашим задачам…',
    allProjects: 'Все проекты',
    today: 'Сегодня',
    next: 'Далее',
    week: 'На этой неделе',
    complete: 'Отметить выполненной',
    reopen: 'Вернуть в работу',
    emptyTitle: 'Немного свободного места.',
    emptyDescription: 'Начните с одной небольшой задачи. Остальное подождёт.',
    first: 'Добавить задачу',
    noResults: 'Подходящих задач пока нет.',
    noResultsHelp: 'Попробуйте другой запрос или сбросьте фильтры.',
    clear: 'Сбросить фильтры',
    loading: 'Загружаем ваши задачи…',
    error: 'Не удалось загрузить рабочий стол',
    errorHelp: 'Ваши задачи сохранены. Попробуйте загрузить их ещё раз.',
    retry: 'Попробовать снова',
    noteBody:
      'Завершить полезное, прежде чем начинать интересное. Более понятной страницы проекта и готового списка для чтения на эту неделю достаточно.',
    noteFoot: 'Напоминание себе',
    projectHelp: 'Активные задачи во всех проектах.',
    dialogTitle: 'Добавить задачу',
    dialogDescription: 'Назовите следующий шаг и выберите для него проект.',
    taskName: 'Название задачи',
    taskPlaceholder: 'Какой следующий шаг будет полезен?',
    project: 'Проект',
    required: 'Введите название задачи.',
    cancel: 'Отмена',
    add: 'Добавить задачу',
    close: 'Закрыть новую задачу',
    notes: 'Заметки о чтении',
    website: 'Личный сайт',
    tools: 'Небольшие инструменты',
    created: 'Задача добавлена',
    completed: 'Выполнено',
    reopened: 'Снова в работе',
    completeCount: 'выполнено',
  },
};
const projectCategory = { notes: 2, website: 3, tools: 1 } as const;

function taskCount(count: number, locale: StudyProps['locale']) {
  if (locale === 'en') return `${count} ${count === 1 ? 'task' : 'tasks'}`;
  const plural = new Intl.PluralRules('ru').select(count);
  return `${count} ${plural === 'one' ? 'задача' : plural === 'few' ? 'задачи' : 'задач'}`;
}

function Plus() {
  return (
    <svg
      className="study-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function DeskStudy({ locale, phase, onRetry }: StudyProps) {
  const t = copy[locale];
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<View>('all');
  const [project, setProject] = useState<Project | 'all'>('all');
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [draftProject, setDraftProject] = useState<Project>('notes');
  const [invalid, setInvalid] = useState(false);
  const [message, setMessage] = useState<{
    kind: 'created' | 'completed' | 'reopened';
    title: Task['title'];
  } | null>(null);
  const nextId = useRef(6);
  const nameRef = useRef<HTMLElement>(null);
  const newTaskRef = useRef<HTMLButtonElement>(null);
  const returnToMasthead = useRef(false);
  const queueHeading = useRef<HTMLHeadingElement>(null);
  const availableTasks = phase === 'empty' ? [] : tasks;
  const visible = availableTasks.filter(
    (task) =>
      (project === 'all' || task.project === project) &&
      (view === 'all' || (view === 'done' ? task.done : !task.done)) &&
      task.title[locale]
        .toLocaleLowerCase(locale)
        .includes(query.trim().toLocaleLowerCase(locale)),
  );
  const completed = availableTasks.filter((task) => task.done).length;
  const unavailable = phase === 'loading' || phase === 'error';
  const clearFilters = () => {
    setView('all');
    setProject('all');
    setQuery('');
  };
  function addTask() {
    const title = draft.trim();
    if (!title) {
      setInvalid(true);
      nameRef.current?.focus();
      return;
    }
    const added: Task = {
      id: nextId.current++,
      title: { en: title, ru: title },
      project: draftProject,
      due: 'next',
      done: false,
    };
    setTasks((current) => [added, ...current]);
    clearFilters();
    returnToMasthead.current = phase === 'empty';
    setOpen(false);
    setDraft('');
    setInvalid(false);
    setMessage({ kind: 'created', title: added.title });
    if (phase === 'empty') onRetry();
  }
  function changeTask(task: Task, done: boolean) {
    setTasks((current) =>
      current.map((item) => (item.id === task.id ? { ...item, done } : item)),
    );
    setMessage({ kind: done ? 'completed' : 'reopened', title: task.title });
    if (view !== 'all')
      requestAnimationFrame(() => queueHeading.current?.focus());
  }
  function chooseProject(next: Project | 'all', keyboard = false) {
    setProject(next);
    if (window.matchMedia('(max-width: 760px)').matches) {
      requestAnimationFrame(() => {
        if (keyboard) queueHeading.current?.focus({ preventScroll: true });
        queueHeading.current?.scrollIntoView({
          block: 'start',
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
            .matches
            ? 'auto'
            : 'smooth',
        });
      });
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setInvalid(false);
          returnToMasthead.current = false;
        }
      }}
    >
      <div className="desk-study">
        <header className="study-topbar desk-topbar">
          <a
            className="study-brand"
            href="#apps/desk"
            onClick={(event) => {
              event.preventDefault();
              document.getElementById('desk-main')?.focus();
            }}
          >
            Margin
            <span className="desk-brand-dot" aria-hidden="true">
              .
            </span>
          </a>
          <nav
            className="study-nav"
            aria-label={
              locale === 'en' ? 'Margin navigation' : 'Навигация Margin'
            }
          >
            <a
              href="#apps/desk"
              aria-current="page"
              onClick={(event) => {
                event.preventDefault();
                document.getElementById('desk-main')?.focus();
              }}
            >
              {t.desk}
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                document.getElementById('desk-projects-title')?.focus()
              }
            >
              {t.projects}
            </Button>
            <Button
              className="desk-note-jump"
              variant="ghost"
              size="sm"
              onClick={() =>
                document.getElementById('desk-note-title')?.focus()
              }
            >
              {t.note}
            </Button>
          </nav>
          <span
            className="desk-account"
            aria-label={
              locale === 'en'
                ? 'Personal workspace, K'
                : 'Личное пространство, К'
            }
          >
            K
          </span>
        </header>
        <main
          className="study-main"
          id="desk-main"
          tabIndex={-1}
          aria-label={t.desk}
        >
          <div className="study-heading desk-masthead">
            <div>
              <p className="study-kicker">{t.workspace}</p>
              <h1 className="study-title">{t.title}</h1>
              <p className="study-lead">{t.lead}</p>
            </div>
            <DialogTrigger
              render={<Button ref={newTaskRef} disabled={unavailable} />}
            >
              <Plus />
              {t.newTask}
            </DialogTrigger>
          </div>
          <div className="desk-grid">
            <section
              className="desk-projects"
              id="desk-projects"
              aria-labelledby="desk-projects-title"
            >
              <h2 id="desk-projects-title" tabIndex={-1}>
                {t.projects}
              </h2>
              <p className="study-muted">{t.projectHelp}</p>
              <div className="desk-project-buttons">
                {(['notes', 'website', 'tools'] as const).map((value) => (
                  <Button
                    key={value}
                    variant={project === value ? 'secondary' : 'ghost'}
                    className="desk-project-button"
                    aria-pressed={project === value}
                    disabled={unavailable || availableTasks.length === 0}
                    onClick={(event) =>
                      chooseProject(
                        project === value ? 'all' : value,
                        event.detail === 0,
                      )
                    }
                  >
                    <span className="desk-project-button-content">
                      <span className="desk-project-label">
                        <span
                          className="desk-project-mark"
                          data-category={value}
                          aria-hidden="true"
                        />
                        {t[value]}
                      </span>
                      <span className="desk-project-count">
                        {
                          availableTasks.filter(
                            (task) => task.project === value && !task.done,
                          ).length
                        }{' '}
                        {t.activeCount}
                      </span>
                    </span>
                  </Button>
                ))}
              </div>
            </section>
            <section
              className="desk-queue"
              id="desk-work"
              aria-labelledby="desk-queue-title"
            >
              <div className="desk-queue-heading">
                <h2 id="desk-queue-title" ref={queueHeading} tabIndex={-1}>
                  {t.queue}
                </h2>
                {!unavailable && (
                  <span className="study-muted">
                    {t.wholeDesk}: {taskCount(availableTasks.length, locale)}{' '}
                    <span aria-hidden="true">/</span> {completed}{' '}
                    {t.completeCount}
                  </span>
                )}
              </div>
              {!unavailable && availableTasks.length > 0 && (
                <div className="desk-filters">
                  <RadioGroup<View>
                    className="desk-view-filter"
                    variant="segmented"
                    aria-label={
                      locale === 'en' ? 'Task status' : 'Статус задачи'
                    }
                    value={view}
                    onValueChange={setView}
                  >
                    <RadioGroupItem className="desk-view-option" value="all">
                      {t.all}
                    </RadioGroupItem>
                    <RadioGroupItem className="desk-view-option" value="active">
                      {t.active}
                    </RadioGroupItem>
                    <RadioGroupItem className="desk-view-option" value="done">
                      {t.done}
                    </RadioGroupItem>
                  </RadioGroup>
                  <Field className="desk-search">
                    <FieldLabel>{t.find}</FieldLabel>
                    <Input
                      value={query}
                      onValueChange={setQuery}
                      placeholder={t.placeholder}
                      type="search"
                    />
                  </Field>
                </div>
              )}
              {!unavailable && availableTasks.length > 0 && (
                <div className="desk-result-summary">
                  <p role="status" aria-atomic="true">
                    {project === 'all' ? t.allProjects : t[project]} · {t[view]}{' '}
                    · {visible.length} {t.shown}
                  </p>
                  {project !== 'all' && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => chooseProject('all')}
                    >
                      {t.allProjects}
                    </Button>
                  )}
                </div>
              )}
              {phase === 'loading' ? (
                <div className="desk-loading">
                  <p role="status" className="study-status">
                    <Spinner label={null} size="sm" />
                    {t.loading}
                  </p>
                  {Array.from({ length: 5 }, (_, i) => (
                    <div className="desk-skeleton-row" key={i}>
                      <Skeleton className="desk-skeleton-check" />
                      <div>
                        <Skeleton className="desk-skeleton-title" />
                        <Skeleton className="desk-skeleton-meta" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : phase === 'error' ? (
                <Alert tone="danger" role="alert" className="desk-load-error">
                  <AlertTitle>{t.error}</AlertTitle>
                  <AlertDescription>{t.errorHelp}</AlertDescription>
                  <AlertActions>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        queueHeading.current?.focus();
                        onRetry();
                      }}
                    >
                      {t.retry}
                    </Button>
                  </AlertActions>
                </Alert>
              ) : availableTasks.length === 0 ? (
                <div className="study-empty desk-empty">
                  <span className="desk-empty-symbol" aria-hidden="true">
                    ↗
                  </span>
                  <h3>{t.emptyTitle}</h3>
                  <p>{t.emptyDescription}</p>
                  <DialogTrigger render={<Button />}>
                    <Plus />
                    {t.first}
                  </DialogTrigger>
                </div>
              ) : visible.length === 0 ? (
                <div className="study-empty desk-empty">
                  <h3>{t.noResults}</h3>
                  <p>{t.noResultsHelp}</p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      clearFilters();
                      queueHeading.current?.focus();
                    }}
                  >
                    {t.clear}
                  </Button>
                </div>
              ) : (
                <ul className="desk-task-list">
                  {visible.map((task, index) => (
                    <li
                      className="desk-task"
                      key={task.id}
                      data-complete={task.done || undefined}
                    >
                      <span className="desk-row-number" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <Checkbox
                        className="desk-task-check"
                        checked={task.done}
                        aria-label={`${task.done ? t.reopen : t.complete}: ${task.title[locale]}`}
                        onCheckedChange={(done) => changeTask(task, done)}
                      />
                      <div className="desk-task-copy">
                        <p className="desk-task-title">{task.title[locale]}</p>
                        <span className="desk-task-project">
                          {t[task.project]} <span aria-hidden="true">·</span>{' '}
                          <span
                            className={
                              task.due === 'today' && !task.done
                                ? 'desk-due-today'
                                : undefined
                            }
                          >
                            {task.done ? t.done : t[task.due]}
                          </span>
                        </span>
                      </div>
                      <div className="desk-task-meta">
                        <Badge
                          className="desk-task-category"
                          category={projectCategory[task.project]}
                        >
                          {t[task.project]}
                        </Badge>
                        <span
                          className={
                            task.due === 'today' && !task.done
                              ? 'desk-due-today'
                              : 'study-muted'
                          }
                        >
                          {task.done ? t.done : t[task.due]}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <p role="status" className="study-status desk-announcement">
                {!unavailable &&
                  phase !== 'empty' &&
                  message &&
                  `${t[message.kind]}: ${message.title[locale]}.`}
              </p>
            </section>
            <aside
              className="desk-aside"
              aria-label={
                locale === 'en' ? 'Project context' : 'Контекст проектов'
              }
            >
              <section
                className="desk-note"
                id="desk-note"
                aria-labelledby="desk-note-title"
              >
                <p className="study-kicker">{t.note}</p>
                <h2
                  className="desk-note-title"
                  id="desk-note-title"
                  tabIndex={-1}
                >
                  {locale === 'en'
                    ? 'Finish, then begin.'
                    : 'Сначала закончить.'}
                </h2>
                <p className="desk-note-body">{t.noteBody}</p>
                <p className="desk-note-foot">{t.noteFoot}</p>
              </section>
            </aside>
          </div>
        </main>
      </div>
      <DialogContent
        className="desk-dialog"
        closeLabel={t.close}
        finalFocus={() =>
          returnToMasthead.current ? newTaskRef.current : true
        }
      >
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            addTask();
          }}
        >
          <DialogHeader>
            <DialogTitle>{t.dialogTitle}</DialogTitle>
            <DialogDescription>{t.dialogDescription}</DialogDescription>
          </DialogHeader>
          <div className="desk-dialog-fields">
            <Field invalid={invalid && !draft.trim()}>
              <FieldLabel>{t.taskName}</FieldLabel>
              <Input
                ref={nameRef}
                value={draft}
                onValueChange={setDraft}
                placeholder={t.taskPlaceholder}
                required
                maxLength={160}
              />
              <FieldError match={invalid && !draft.trim()}>
                {t.required}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel>{t.project}</FieldLabel>
              <Select<Project>
                value={draftProject}
                onValueChange={(value) => {
                  if (value) setDraftProject(value);
                }}
                items={(['notes', 'website', 'tools'] as const).map(
                  (value) => ({ value, label: t[value] }),
                )}
              >
                <SelectTrigger className="desk-project-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['notes', 'website', 'tools'] as const).map((value) => (
                    <SelectItem key={value} value={value}>
                      {t[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="secondary" />}>
              {t.cancel}
            </DialogClose>
            <Button type="submit">{t.add}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
