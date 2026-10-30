import { Theme } from '../../../src/theme.js';
import type { Appearance } from '../../../src/theme.js';
import { Button } from '../../../src/components/button.js';
import { DeskStudy } from './desk.js';
import { SettingsStudy } from './settings.js';
import type { StudyProps } from './types.js';
import './app-studies.css';

export function AppStudies({
  screen,
  params,
  appearance,
  onAppearanceChange,
}: {
  screen: 'desk' | 'settings';
  params: URLSearchParams;
  appearance: Appearance;
  onAppearanceChange: (value: Appearance) => void;
}) {
  const locale = params.get('locale') === 'ru' ? 'ru' : 'en';
  const requestedPhase = params.get('state');
  const phase: StudyProps['phase'] =
    requestedPhase === 'loading' ||
    requestedPhase === 'empty' ||
    requestedPhase === 'error'
      ? requestedPhase
      : 'ready';
  const requestedAppearance = params.get('appearance');
  const resolvedAppearance =
    requestedAppearance === 'dark' || requestedAppearance === 'light'
      ? requestedAppearance
      : appearance;
  const ru = locale === 'ru';
  const appOnly = params.get('review') === 'off';
  function href(nextScreen: 'desk' | 'settings', key?: string, value?: string) {
    const next = new URLSearchParams(params);
    if (key && value) next.set(key, value);
    return `#apps/${nextScreen}${next.size ? `?${next}` : ''}`;
  }
  function update(key: string, value: string) {
    window.location.hash = href(screen, key, value);
  }
  const props: StudyProps = {
    locale,
    phase,
    onRetry: () => update('state', 'ready'),
  };
  return (
    <Theme
      appearance={resolvedAppearance}
      className="app-study"
      lang={locale}
      tokens={{
        '--u-font-display':
          "'Manrope', 'Inter', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <a
        className="skip-link"
        href="#study-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('study-content')?.focus();
        }}
      >
        {ru ? 'К содержимому' : 'Skip to app content'}
      </a>
      {!appOnly && (
        <>
          <div className="study-review-bar">
            <div className="study-review-title">
              <a href="#overview">← {ru ? 'Компоненты' : 'Components'}</a>
              <span>
                {ru
                  ? 'Приложения · локальный просмотр'
                  : 'App studies · local preview'}
              </span>
            </div>
            <nav
              className="study-review-links"
              aria-label={ru ? 'Примеры приложений' : 'App studies'}
            >
              <a
                href={href('desk')}
                aria-current={screen === 'desk' ? 'page' : undefined}
              >
                Margin / {ru ? 'Проекты' : 'Desk'}
              </a>
              <a
                href={href('settings')}
                aria-current={screen === 'settings' ? 'page' : undefined}
              >
                Dispatch / {ru ? 'Настройки' : 'Settings'}
              </a>
            </nav>
            <div className="study-review-options">
              <label>
                {ru ? 'Состояние' : 'Content'}
                <select
                  value={phase}
                  onChange={(event) => update('state', event.target.value)}
                >
                  <option value="ready">{ru ? 'Данные' : 'Populated'}</option>
                  <option value="loading">{ru ? 'Загрузка' : 'Loading'}</option>
                  <option value="empty">{ru ? 'Пусто' : 'Empty'}</option>
                  <option value="error">{ru ? 'Ошибка' : 'Error'}</option>
                </select>
              </label>
              <label>
                {ru ? 'Язык' : 'Language'}
                <select
                  value={locale}
                  onChange={(event) => update('locale', event.target.value)}
                >
                  <option value="en">English</option>
                  <option value="ru">Русский</option>
                </select>
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next =
                    resolvedAppearance === 'light' ? 'dark' : 'light';
                  onAppearanceChange(next);
                  update('appearance', next);
                }}
              >
                {resolvedAppearance === 'light'
                  ? ru
                    ? 'Тёмная тема'
                    : 'Dark appearance'
                  : ru
                    ? 'Светлая тема'
                    : 'Light appearance'}
              </Button>
              <a
                className="study-review-focus"
                href={href(screen, 'review', 'off')}
              >
                {ru ? 'Только приложение' : 'View app only'}
              </a>
            </div>
          </div>
          <p className="study-review-note">
            {ru
              ? 'Интерактивные примеры с вымышленными данными. Переход в другой пример или перезагрузка сбрасывает изменения.'
              : 'Interactive studies with sample data. Switching studies or reloading resets edits.'}
            {screen === 'settings' &&
              (ru
                ? ' При первом сохранении показано восстановление после ошибки: черновик остаётся на месте, повторная попытка проходит успешно.'
                : ' The first save demonstrates recovery: your draft stays in place and retry succeeds.')}
            {screen === 'desk' &&
              phase === 'empty' &&
              (ru
                ? ' Пустой экран — предварительный вид. Новая задача добавится к вашему существующему списку.'
                : ' Empty is a preview of a blank view. Creating a task adds it to your existing queue.')}
          </p>
        </>
      )}
      <div id="study-content" className="study-preview" tabIndex={-1}>
        {screen === 'desk' ? (
          <DeskStudy {...props} />
        ) : (
          <SettingsStudy {...props} />
        )}
      </div>
      {appOnly && (
        <p className="study-review-note">
          {screen === 'desk' && phase === 'empty' && (
            <>
              {ru
                ? 'Пустой экран — предварительный вид. Новая задача добавится к существующему списку. '
                : 'Empty is a blank-view preview. Creating a task adds it to the existing queue. '}
            </>
          )}
          <a href={href(screen, 'review', 'on')}>
            {ru ? 'Показать инструменты просмотра' : 'Show review controls'}
          </a>
        </p>
      )}
    </Theme>
  );
}
