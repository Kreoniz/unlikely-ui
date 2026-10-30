import { useId, useRef, useState } from 'react';
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from '../../../src/components/alert.js';
import { Badge } from '../../../src/components/badge.js';
import { Button } from '../../../src/components/button.js';
import { Card, CardContent, CardTitle } from '../../../src/components/card.js';
import { Checkbox } from '../../../src/components/checkbox.js';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../../../src/components/field.js';
import { Input } from '../../../src/components/input.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../src/components/select.js';
import { Skeleton } from '../../../src/components/skeleton.js';
import { Spinner } from '../../../src/components/spinner.js';
import { Textarea } from '../../../src/components/textarea.js';
import type { StudyProps } from './types.js';
import './settings.css';

const copy = {
  en: {
    area: 'Workspace preferences',
    private: 'Personal workspace',
    heading: 'Workspace settings',
    lead: 'A few details for your space. Updates on your terms.',
    general: 'The essentials',
    generalHelp: 'How your workspace appears in invitations and updates.',
    name: 'Workspace name',
    nameHelp: 'A short, familiar name. You can change it later.',
    nameError: 'Enter a workspace name.',
    description: 'A little context',
    descriptionHelp: 'Optional. A sentence about what this space is for.',
    delivery: 'Keep in the loop',
    deliveryHelp: 'One useful summary, without every small interruption.',
    email: 'Email address',
    emailHelp: 'Workspace updates go here. Never shared with other workspaces.',
    emailError: 'Enter an email address, such as you@example.com.',
    digest: 'Send a weekly digest',
    digestHelp: 'Open items and recent progress, collected into one email.',
    day: 'Delivery day',
    dayHelp: 'Delivered at 09:00 in your workspace time zone, Asia/Omsk.',
    monday: 'Monday',
    friday: 'Friday',
    review: 'Your changes',
    reviewHelp: 'Review the current draft before saving.',
    unchanged: 'Everything is up to date.',
    unchangedHelp: 'Your next edits will appear here.',
    before: 'Was',
    after: 'Now',
    none: 'No description',
    notEntered: 'Not entered',
    record: 'Workspace record',
    on: 'On',
    off: 'Off',
    save: 'Save changes',
    discard: 'Discard changes',
    pending: 'Saving settings…',
    dirty: 'You have unsaved changes.',
    saved: 'Workspace settings saved.',
    restored: 'Last saved settings restored.',
    clean: 'All changes saved.',
    edited: 'Unsaved',
    current: 'Up to date',
    failedTitle: 'Your changes haven’t been saved',
    failedHelp:
      'The connection was interrupted. Your draft is still here. Try again when you’re ready.',
    retry: 'Try again',
    summary: 'Delivery preview',
    preview:
      'A short weekly note with open items, completed work, and what’s next.',
    previewOff:
      'The weekly digest is paused. You can turn it on whenever it’s useful.',
    footer: 'Settings apply to this workspace only.',
    loading: 'Loading workspace settings…',
    loadError: 'We couldn’t load your settings',
    loadErrorHelp: 'Your saved workspace is safe. Try loading it again.',
    emptyTitle: 'Make this space your own',
    emptyHelp: 'Add the details and choose the updates that matter to you.',
    setup: 'Configure workspace',
  },
  ru: {
    area: 'Настройки рабочего пространства',
    private: 'Личное пространство',
    heading: 'Настройки пространства',
    lead: 'Основные сведения о вашем пространстве. Обновления на ваших условиях.',
    general: 'Основные сведения',
    generalHelp: 'Так пространство выглядит в приглашениях и обновлениях.',
    name: 'Название пространства',
    nameHelp: 'Короткое и знакомое название. Его можно изменить позже.',
    nameError: 'Введите название пространства.',
    description: 'Немного контекста',
    descriptionHelp:
      'Необязательно. Одно предложение о том, для чего это пространство.',
    delivery: 'Быть в курсе',
    deliveryHelp: 'Одна полезная сводка вместо уведомлений о каждой мелочи.',
    email: 'Электронная почта',
    emailHelp: 'Сюда приходят обновления. Адрес не виден другим пространствам.',
    emailError: 'Введите адрес электронной почты, например you@example.com.',
    digest: 'Получать еженедельную сводку',
    digestHelp: 'Открытые задачи и последние результаты в одном письме.',
    day: 'День отправки',
    dayHelp: 'В 09:00 по часовому поясу пространства — Asia/Omsk.',
    monday: 'Понедельник',
    friday: 'Пятница',
    review: 'Ваши изменения',
    reviewHelp: 'Проверьте текущий черновик перед сохранением.',
    unchanged: 'Всё актуально.',
    unchangedHelp: 'Следующие изменения появятся здесь.',
    before: 'Было',
    after: 'Стало',
    none: 'Без описания',
    notEntered: 'Не указано',
    record: 'Карточка пространства',
    on: 'Включена',
    off: 'Выключена',
    save: 'Сохранить изменения',
    discard: 'Отменить изменения',
    pending: 'Сохраняем настройки…',
    dirty: 'Есть несохранённые изменения.',
    saved: 'Настройки пространства сохранены.',
    restored: 'Восстановлены сохранённые настройки.',
    clean: 'Все изменения сохранены.',
    edited: 'Не сохранено',
    current: 'Актуально',
    failedTitle: 'Изменения не сохранены',
    failedHelp:
      'Соединение прервалось. Ваш черновик на месте. Попробуйте ещё раз, когда будете готовы.',
    retry: 'Попробовать ещё раз',
    summary: 'Как выглядит сводка',
    preview:
      'Короткое письмо раз в неделю: открытые задачи, завершённая работа и следующие шаги.',
    previewOff:
      'Еженедельная сводка приостановлена. Её можно включить, когда она понадобится.',
    footer: 'Настройки действуют только для этого пространства.',
    loading: 'Загружаем настройки пространства…',
    loadError: 'Не удалось загрузить настройки',
    loadErrorHelp:
      'Сохранённое пространство в безопасности. Попробуйте загрузить его ещё раз.',
    emptyTitle: 'Устройте пространство под себя',
    emptyHelp:
      'Добавьте основные сведения и выберите важные для вас обновления.',
    setup: 'Настроить пространство',
  },
} as const;

interface Draft {
  name: string;
  description: string;
  email: string;
  digest: boolean;
  day: 'monday' | 'friday';
}
const initial: Draft = {
  name: 'Dispatch Studio',
  description: 'A home for the things worth finishing.',
  email: 'you@example.com',
  digest: true,
  day: 'friday',
};
type SaveState = 'idle' | 'pending' | 'failed' | 'saved' | 'restored';

function normalize(values: Draft): Draft {
  return {
    ...values,
    name: values.name.trim(),
    description: values.description.trim(),
    email: values.email.trim(),
  };
}

/** App-owned settings composition. Demo changes remain in memory. */
export function SettingsStudy({ locale, phase, onRetry }: StudyProps) {
  const t = copy[locale];
  const [draft, setDraft] = useState<Draft>(() => ({
    ...initial,
    description:
      locale === 'ru'
        ? 'Место для вещей, которые стоит закончить.'
        : initial.description,
  }));
  const [saved, setSaved] = useState<Draft>(draft);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [validated, setValidated] = useState(false);
  const firstAttempt = useRef(true);
  const inFlight = useRef(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  function recover() {
    headingRef.current?.focus();
    onRetry();
  }
  const digestLabel = useId();
  const digestDescription = useId();
  const generalHeading = useId();
  const deliveryHeading = useId();
  const normalizedDraft = normalize(draft);
  const normalizedSaved = normalize(saved);
  const pending = saveState === 'pending';
  const nameInvalid = !normalizedDraft.name;
  const emailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    normalizedDraft.email,
  );
  const keys = ['name', 'description', 'email', 'digest', 'day'] as const;
  const changed = keys.filter(
    (key) => normalizedDraft[key] !== normalizedSaved[key],
  );
  const dirty = changed.length > 0;
  const labels = {
    name: t.name,
    description: t.description,
    email: t.email,
    digest: t.digest,
    day: t.day,
  };
  function display(key: keyof Draft, value: Draft[keyof Draft]): string {
    if (key === 'digest') return value ? t.on : t.off;
    if (key === 'day') return value === 'monday' ? t.monday : t.friday;
    return String(value) || (key === 'description' ? t.none : t.notEntered);
  }
  function edit<Key extends keyof Draft>(key: Key, value: Draft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaveState('idle');
  }
  async function save(fromRetry = false) {
    if (inFlight.current) return;
    setValidated(true);
    if (nameInvalid || emailInvalid) {
      (nameInvalid ? nameRef : emailRef).current?.focus();
      return;
    }
    if (!dirty) return;
    // Retry disappears during pending. Move its focus to the persistent action
    // before that happens, then leave any later user focus movement alone.
    if (fromRetry) saveRef.current?.focus();
    inFlight.current = true;
    setSaveState('pending');
    const submitted = normalizedDraft;
    // Demo transport: one failure exercises recovery. Replace with an app request.
    await new Promise((resolve) => setTimeout(resolve, 650));
    if (firstAttempt.current) {
      firstAttempt.current = false;
      setSaveState('failed');
    } else {
      setSaved(submitted);
      setDraft(submitted);
      setValidated(false);
      setSaveState('saved');
    }
    inFlight.current = false;
  }
  const status = pending
    ? t.pending
    : saveState === 'saved'
      ? t.saved
      : saveState === 'restored'
        ? t.restored
        : dirty
          ? t.dirty
          : t.clean;
  const feedback = pending
    ? 'pending'
    : saveState === 'saved'
      ? 'saved'
      : dirty
        ? 'dirty'
        : 'clean';

  return (
    <div className="dispatch-study">
      <header className="study-topbar">
        <span className="study-brand dispatch-brand">
          <span className="dispatch-brand-mark">
            <svg
              className="study-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden="true"
            >
              <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
            </svg>
          </span>
          dispatch
        </span>
        <span className="study-muted dispatch-top-label">{t.private}</span>
      </header>
      <main className="study-main dispatch-main" aria-label={t.area}>
        <div className="study-heading">
          <div>
            <p className="study-kicker">Dispatch Studio</p>
            <h1 className="study-title" tabIndex={-1} ref={headingRef}>
              {t.heading}
            </h1>
            <p className="study-lead">{t.lead}</p>
          </div>
          {phase === 'ready' && (
            <div
              className="dispatch-state-badge"
              data-state={feedback}
              key={feedback}
            >
              <Badge tone={dirty ? 'warning' : 'success'}>
                {dirty ? t.edited : t.current}
              </Badge>
            </div>
          )}
        </div>

        {phase === 'loading' ? (
          <div className="dispatch-loading">
            <p role="status" className="dispatch-loading-label">
              <Spinner label={null} />
              {t.loading}
            </p>
            <Card aria-busy="true">
              <CardContent className="dispatch-skeletons">
                <Skeleton style={{ width: '35%', height: 24 }} />
                <Skeleton style={{ height: 40 }} />
                <Skeleton style={{ width: '55%', height: 16 }} />
                <Skeleton style={{ height: 96 }} />
              </CardContent>
            </Card>
          </div>
        ) : phase === 'error' ? (
          <Alert tone="danger" role="alert">
            <AlertTitle>{t.loadError}</AlertTitle>
            <AlertDescription>{t.loadErrorHelp}</AlertDescription>
            <AlertActions>
              <Button variant="secondary" onClick={recover}>
                {t.retry}
              </Button>
            </AlertActions>
          </Alert>
        ) : phase === 'empty' ? (
          <Card className="study-empty dispatch-empty">
            <span className="dispatch-empty-mark" aria-hidden="true">
              ↗
            </span>
            <CardTitle>{t.emptyTitle}</CardTitle>
            <p className="study-muted">{t.emptyHelp}</p>
            <Button onClick={recover}>{t.setup}</Button>
          </Card>
        ) : (
          <form
            aria-label={t.area}
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void save();
            }}
          >
            <div className="dispatch-layout">
              <Card className="dispatch-document">
                <div className="dispatch-document-meta">
                  <span>{t.record}</span>
                  <span aria-hidden="true">DS / 001</span>
                </div>
                <section
                  className="dispatch-chapter"
                  aria-labelledby={generalHeading}
                >
                  <header className="dispatch-section-heading">
                    <span className="dispatch-section-index" aria-hidden="true">
                      01
                    </span>
                    <div>
                      <h2
                        id={generalHeading}
                        className="dispatch-section-title"
                      >
                        {t.general}
                      </h2>
                      <p className="dispatch-section-description">
                        {t.generalHelp}
                      </p>
                    </div>
                  </header>
                  <div className="dispatch-form-stack">
                    <Field invalid={validated && nameInvalid}>
                      <FieldLabel>{t.name}</FieldLabel>
                      <Input
                        ref={nameRef}
                        name="workspaceName"
                        value={draft.name}
                        onValueChange={(value) => edit('name', value)}
                        readOnly={pending}
                        required
                        maxLength={80}
                        autoComplete="organization"
                      />
                      <FieldDescription>{t.nameHelp}</FieldDescription>
                      <FieldError match={validated && nameInvalid}>
                        {t.nameError}
                      </FieldError>
                    </Field>
                    <Field>
                      <FieldLabel>{t.description}</FieldLabel>
                      <Textarea
                        name="description"
                        value={draft.description}
                        onValueChange={(value) => edit('description', value)}
                        readOnly={pending}
                        rows={3}
                        maxLength={240}
                      />
                      <FieldDescription>{t.descriptionHelp}</FieldDescription>
                    </Field>
                  </div>
                </section>
                <section
                  className="dispatch-chapter"
                  aria-labelledby={deliveryHeading}
                >
                  <header className="dispatch-section-heading">
                    <span className="dispatch-section-index" aria-hidden="true">
                      02
                    </span>
                    <div>
                      <h2
                        id={deliveryHeading}
                        className="dispatch-section-title"
                      >
                        {t.delivery}
                      </h2>
                      <p className="dispatch-section-description">
                        {t.deliveryHelp}
                      </p>
                    </div>
                  </header>
                  <div className="dispatch-form-stack">
                    <Field invalid={validated && emailInvalid}>
                      <FieldLabel>{t.email}</FieldLabel>
                      <Input
                        ref={emailRef}
                        name="email"
                        type="email"
                        value={draft.email}
                        onValueChange={(value) => edit('email', value)}
                        readOnly={pending}
                        required
                        autoComplete="email"
                      />
                      <FieldDescription>{t.emailHelp}</FieldDescription>
                      <FieldError match={validated && emailInvalid}>
                        {t.emailError}
                      </FieldError>
                    </Field>
                    <label className="dispatch-notification">
                      <Checkbox
                        checked={draft.digest}
                        onCheckedChange={(checked) => edit('digest', checked)}
                        disabled={pending}
                        aria-labelledby={digestLabel}
                        aria-describedby={digestDescription}
                        name="digest"
                      />
                      <span>
                        <strong id={digestLabel}>{t.digest}</strong>
                        <span id={digestDescription} className="study-muted">
                          {t.digestHelp}
                        </span>
                      </span>
                    </label>
                    <Field disabled={!draft.digest || pending}>
                      <FieldLabel>{t.day}</FieldLabel>
                      <Select
                        value={draft.day}
                        onValueChange={(value) => {
                          if (value === 'monday' || value === 'friday')
                            edit('day', value);
                        }}
                        items={{ monday: t.monday, friday: t.friday }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">{t.monday}</SelectItem>
                          <SelectItem value="friday">{t.friday}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldDescription>{t.dayHelp}</FieldDescription>
                    </Field>
                  </div>
                </section>
              </Card>
              <aside className="dispatch-review" aria-label={t.review}>
                <section
                  className="dispatch-review-sheet"
                  data-state={feedback}
                >
                  <header className="dispatch-review-heading">
                    <h2>{t.review}</h2>
                    <span className="dispatch-review-count" aria-hidden="true">
                      {String(changed.length).padStart(2, '0')}
                    </span>
                  </header>
                  <p className="dispatch-review-description">{t.reviewHelp}</p>
                  <div className="dispatch-review-content">
                    {dirty ? (
                      <ul className="dispatch-change-list">
                        {changed.map((key) => (
                          <li key={key}>
                            <strong>{labels[key]}</strong>
                            <span className="study-muted">
                              {t.before}: {display(key, normalizedSaved[key])}
                            </span>
                            <span>
                              {t.after}: {display(key, normalizedDraft[key])}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="dispatch-current">
                        <span className="dispatch-check" aria-hidden="true">
                          ✓
                        </span>
                        <strong>{t.unchanged}</strong>
                        <p className="study-muted">{t.unchangedHelp}</p>
                      </div>
                    )}
                  </div>
                </section>
                <div className="dispatch-delivery-preview">
                  <p className="study-kicker">{t.summary}</p>
                  <h2>{normalizedDraft.name || t.notEntered}</h2>
                  {draft.digest && (
                    <p className="dispatch-preview-day">
                      {t[draft.day]} · 09:00
                    </p>
                  )}
                  <p className="study-muted">
                    {draft.digest ? t.preview : t.previewOff}
                  </p>
                </div>
              </aside>
            </div>
            {saveState === 'failed' && (
              <Alert className="dispatch-save-error" tone="danger" role="alert">
                <AlertTitle>{t.failedTitle}</AlertTitle>
                <AlertDescription>{t.failedHelp}</AlertDescription>
                <AlertActions>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => void save(true)}
                  >
                    {t.retry}
                  </Button>
                </AlertActions>
              </Alert>
            )}
            <footer className="dispatch-savebar" data-state={feedback}>
              <div>
                <p className="study-status" role="status">
                  <span className="dispatch-status-text" key={status}>
                    {status}
                  </span>
                </p>
                <p className="study-muted dispatch-footer-note">{t.footer}</p>
              </div>
              <div className="study-actions">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={pending || !dirty}
                  onClick={() => {
                    setDraft(saved);
                    setValidated(false);
                    setSaveState('restored');
                  }}
                >
                  {t.discard}
                </Button>
                <Button
                  ref={saveRef}
                  type="submit"
                  loading={pending}
                  disabled={!dirty && !pending}
                  focusableWhenDisabled={pending || saveState === 'saved'}
                >
                  {t.save}
                </Button>
              </div>
            </footer>
          </form>
        )}
      </main>
    </div>
  );
}
