import { CheckoutNotice } from './checkout-notice.js';
import { StudyBoundary, StudyUnavailable } from './study-boundary.js';
import { lazy, Suspense, useEffect, useState } from 'react';
import packageMetadata from '../package.json' with { type: 'json' };
import { Theme } from '../src/theme.js';
import type { Appearance } from '../src/theme.js';
import { Button } from '../src/components/button.js';
import { ScrollArea } from '../src/components/scroll-area.js';
import { ScrollAreaExamples } from './examples/scroll-area.js';
import { ButtonExamples } from './examples/buttons.js';
import { PhysicalButtonExamples } from './examples/physical-button.js';
import { FieldExamples } from './examples/fields.js';
import { OverlayExamples } from './examples/overlays.js';
import { SelectionExamples } from './examples/selection.js';
import { ComboboxExamples } from './examples/combobox.js';
import { CalendarExamples } from './examples/calendar.js';
import {
  ToastExamples,
  BadgeExamples,
  AlertExamples,
  LoadingExamples,
  CardExamples,
  EmptyStateExample,
} from './examples/feedback.js';
import { ThemePortalExperiment } from './experiments/theme-portals.js';
import { CodeBlock } from './code-block.js';
import { ApiReference } from './api-reference.js';
import { Glyph } from './glyph.js';
import { catalog } from './catalog.js';
import { ExampleLinks } from './example-links.js';
import { Foundations } from './foundations.js';
import { QuickStart } from './quick-start.js';
import { Workflows } from './workflows.js';
import { SwitchExamples } from './examples/switch.js';
import { TabsExamples } from './examples/tabs.js';
import { MenuExamples } from './examples/menu.js';
import { ProjectDialog } from './examples/project-dialog.js';
const AppStudies = lazy(() =>
  import('./experiments/app-studies/index.js').then((module) => ({
    default: module.AppStudies,
  })),
);
const SignatureStudies = lazy(() =>
  import('./experiments/signature/index.js').then((module) => ({
    default: module.SignatureStudies,
  })),
);

function currentPage() {
  return window.location.hash.slice(1) || 'overview';
}
const appearanceKey = 'unlikely-ui:appearance';
function savedAppearance(): Appearance {
  try {
    return localStorage.getItem(appearanceKey) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}
export function Gallery() {
  const [route, setRoute] = useState(currentPage);
  const [page = 'overview', parameters] = route.split('?');
  const routeParams = new URLSearchParams(parameters);
  const [appearance, setAppearance] = useState<Appearance>(savedAppearance);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(appearanceKey, appearance);
    } catch {
      // The workspace remains usable when browser storage is unavailable.
    }
  }, [appearance]);
  useEffect(() => {
    const change = () => {
      const next = currentPage();
      setRoute(next);
      setQuery('');
      setNavOpen(false);
    };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);
  const entry = catalog.find(
    (item) =>
      page === `components/${item.id}` || page === `components/${item.id}/api`,
  );
  const apiView = page.endsWith('/api');
  const filtered = catalog.filter((item) =>
    `${item.name} ${item.category} ${item.description} ${item.aliases?.join(' ') ?? ''}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const title =
    entry?.name ??
    {
      overview: 'Overview',
      foundations: 'Foundations',
      devspace: 'Devspace',
      'quick-start': 'Quick start',
      recipes: 'Recipes',
      'apps/desk': 'Margin — App study',
      'apps/settings': 'Dispatch — App study',
    }[page] ??
    'Overview';
  useEffect(() => {
    document.title = `${title} — unlikely ui`;
    const target = new URLSearchParams(route.split('?')[1]).get('recipe');
    if (target)
      requestAnimationFrame(() =>
        document.getElementById(target)?.scrollIntoView({ block: 'start' }),
      );
  }, [route, title]);
  const valid =
    ['overview', 'foundations', 'devspace', 'quick-start', 'recipes'].includes(
      page,
    ) || Boolean(entry);
  if (page === 'apps/desk' || page === 'apps/settings') {
    return (
      <StudyBoundary
        fallback={
          <Theme appearance={appearance}>
            <main>
              <StudyUnavailable />
            </main>
          </Theme>
        }
      >
        <Suspense
          fallback={
            <Theme appearance={appearance}>
              <p role="status">Loading app studies…</p>
            </Theme>
          }
        >
          <AppStudies
            screen={page === 'apps/desk' ? 'desk' : 'settings'}
            params={routeParams}
            appearance={appearance}
            onAppearanceChange={setAppearance}
          />
        </Suspense>
      </StudyBoundary>
    );
  }
  return (
    <Theme appearance={appearance} className="workspace">
      <a
        className="skip-link"
        href="#workspace-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('workspace-content')?.focus();
        }}
      >
        Skip to content
      </a>
      <aside
        className={`sidebar ${query ? 'has-search' : ''} ${navOpen ? 'nav-open' : ''}`}
        onClick={(event) => {
          if ((event.target as Element).closest('a[href^="#"]')) {
            setNavOpen(false);
            setQuery('');
            requestAnimationFrame(() =>
              document
                .getElementById('workspace-content')
                ?.focus({ preventScroll: true }),
            );
          }
        }}
      >
        <ScrollArea.Root className="sidebar-scroll">
          <ScrollArea.Viewport
            className="sidebar-viewport"
            role="region"
            aria-label="Components sidebar"
          >
            <ScrollArea.Content className="sidebar-content">
              <div className="sidebar-heading">
                <a href="#overview" className="brand-lockup">
                  <img
                    src="/button-logo-small.png"
                    width={52}
                    height={52}
                    alt=""
                  />
                  <span>unlikely ui</span>
                </a>
              </div>
              <label className="search-field">
                <Glyph name="search" size={17} />
                <input
                  aria-label="Find components"
                  placeholder="Find a component…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <nav id="workspace-navigation" aria-label="Workspace navigation">
                <span className="nav-label">WORKSPACE</span>
                {(
                  [
                    { id: 'overview', label: 'Overview', icon: 'grid' },
                    { id: 'quick-start', label: 'Quick start', icon: 'arrow' },
                    { id: 'recipes', label: 'Recipes', icon: 'layers' },
                    { id: 'apps/desk', label: 'App studies', icon: 'grid' },
                    { id: 'foundations', label: 'Foundations', icon: 'layers' },
                    { id: 'devspace', label: 'Devspace', icon: 'flask' },
                  ] as const
                ).map((item) => (
                  <a
                    key={item.id}
                    className={`nav-link ${page === item.id ? 'active' : ''}`}
                    href={`#${item.id}`}
                    aria-current={page === item.id ? 'page' : undefined}
                  >
                    <Glyph name={item.icon} />
                    {item.label}
                    {item.id === 'devspace' && <span className="nav-dot" />}
                  </a>
                ))}
                <span className="nav-label component-label">
                  COMPONENTS <span>{catalog.length}</span>
                </span>
                {filtered.map((item) => (
                  <a
                    key={item.id}
                    href={`#components/${item.id}`}
                    className={`nav-link component-link ${entry?.id === item.id ? 'active' : ''}`}
                    aria-current={entry?.id === item.id ? 'page' : undefined}
                  >
                    <span>{item.name}</span>
                    {item.status === 'planned' ? (
                      <small>Planned</small>
                    ) : (
                      <span
                        className="preview-dot"
                        aria-label="Preview implementation"
                      />
                    )}
                  </a>
                ))}
                {!filtered.length && (
                  <p className="no-results">No matching components.</p>
                )}
              </nav>
              <div className="sidebar-footer">
                <a
                  href="#quick-start?recipe=compatibility"
                  className="version-pill"
                >
                  v{packageMetadata.version}
                </a>
              </div>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </aside>
      <div className="workspace-main">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span>
            <strong>{title}</strong>
          </div>
          <a href="#overview" className="mobile-brand brand-lockup">
            <img src="/button-logo-small.png" width={32} height={32} alt="" />
            <span>unlikely ui</span>
          </a>
          <div className="global-controls">
            <Button
              className="mobile-nav-toggle"
              variant="secondary"
              size="sm"
              aria-expanded={navOpen}
              aria-controls="workspace-navigation"
              onClick={() => setNavOpen((value) => !value)}
            >
              Components <Glyph name="layers" size={16} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label={
                appearance === 'light'
                  ? 'Switch to dark appearance'
                  : 'Switch to light appearance'
              }
              onClick={() =>
                setAppearance(appearance === 'light' ? 'dark' : 'light')
              }
            >
              <Glyph name={appearance === 'light' ? 'moon' : 'sun'} />
            </Button>
          </div>
        </header>
        <main
          id="workspace-content"
          className="workspace-content"
          tabIndex={-1}
        >
          {!valid && (
            <p role="status">
              That page doesn’t exist. Here’s the workspace overview.
            </p>
          )}
          {(page === 'overview' || !valid) && (
            <>
              <section className="overview-hero">
                <div>
                  <span className="eyebrow">UNLIKELY UI</span>
                  <h1>Component workspace</h1>
                  <p>
                    Browse components, inspect their states, and test themes.
                  </p>
                  <div className="hero-actions">
                    <Button
                      render={<a href="#components/button" />}
                      nativeButton={false}
                    >
                      Explore components
                      <Glyph name="arrow" />
                    </Button>
                    <Button
                      variant="ghost"
                      render={<a href="#quick-start" />}
                      nativeButton={false}
                    >
                      Start using unlikely ui
                    </Button>
                  </div>
                </div>
              </section>
              <div className="section-title">
                <div>
                  <span className="eyebrow">COMPONENTS</span>
                  <h2>Interactive previews</h2>
                </div>
                <span className="quiet-label">
                  {catalog.filter((item) => item.status === 'preview').length}{' '}
                  PREVIEW IMPLEMENTATIONS
                </span>
              </div>
              <div className="component-cards">
                <article className="component-card">
                  <div className="card-top">
                    <span className="status-tag preview">Preview</span>
                    <span className="quiet-label">ACTIONS</span>
                  </div>
                  <div className="card-stage">
                    <Button
                      onClick={() => setNotice('Action triggered.')}
                      size="sm"
                    >
                      Create project
                      <Glyph name="arrow" size={16} />
                    </Button>
                  </div>
                  <a href="#components/button" className="card-title">
                    Button
                    <Glyph name="arrow" size={16} />
                  </a>
                  <p>Primary, secondary, ghost, and danger actions.</p>
                </article>
                <article className="component-card">
                  <div className="card-top">
                    <span className="status-tag preview">Preview</span>
                    <span className="quiet-label">ACTIONS</span>
                  </div>
                  <div className="card-stage composition-stage">
                    <ProjectDialog />
                  </div>
                  <a href="#components/dialog" className="card-title">
                    Project form
                    <Glyph name="arrow" size={16} />
                  </a>
                  <p>
                    Fields, validation, a dialog, and a themed popover working
                    together.
                  </p>
                </article>
                <article className="component-card">
                  <div className="card-top">
                    <span className="status-tag preview">Preview</span>
                    <span className="quiet-label">FOUNDATIONS</span>
                  </div>
                  <div className="card-stage theme-stage">
                    <Theme appearance="light" className="mini-theme">
                      <i />
                      <i />
                      <i />
                    </Theme>
                    <Theme appearance="dark" className="mini-theme">
                      <i />
                      <i />
                      <i />
                    </Theme>
                  </div>
                  <a href="#components/theme" className="card-title">
                    Theme
                    <Glyph name="arrow" size={16} />
                  </a>
                  <p>Scoped appearance and token overrides.</p>
                </article>
              </div>
              <section className="catalog-section" aria-label="All components">
                <div className="section-title">
                  <h2>All components</h2>
                  <span className="quiet-label">{catalog.length} PREVIEWS</span>
                </div>
                <div className="catalog-grid">
                  {catalog.map((item) => (
                    <a
                      key={item.id}
                      className="catalog-item"
                      href={`#components/${item.id}`}
                    >
                      <span>
                        <strong>{item.name}</strong>
                        <small>{item.category}</small>
                      </span>
                      <Glyph name="arrow" size={16} />
                    </a>
                  ))}
                </div>
              </section>
              <div className="overview-bottom">
                <a className="devspace-link" href="#devspace">
                  <div className="devspace-symbol">
                    <Glyph name="flask" size={25} />
                  </div>
                  <div>
                    <span className="eyebrow">DEVELOPMENT</span>
                    <h3>Devspace</h3>
                    <p>
                      New ideas live here before becoming library components.
                    </p>
                  </div>
                  <Glyph name="arrow" />
                </a>
                <div className="next-up">
                  <span className="eyebrow">RECIPES</span>
                  <h3>Complete workflows</h3>
                  <p>
                    <a href="#recipes">
                      Date fields, save failures, and recovery →
                    </a>
                  </p>
                </div>
              </div>
              <div className="workspace-notice" role="status">
                {notice}
              </div>
            </>
          )}
          {(entry || page === 'recipes') && <CheckoutNotice />}
          {page === 'quick-start' && <QuickStart />}
          {page === 'recipes' && <Workflows />}
          {page === 'foundations' && <Foundations appearance={appearance} />}
          {page === 'devspace' && (
            <>
              <div className="page-intro">
                <span className="eyebrow">DEVSPACE</span>
                <h1>Experiments</h1>
                <p>
                  Experiments use the real foundations. Their APIs and behavior
                  can change before they join the library.
                </p>
              </div>
              <StudyBoundary fallback={<StudyUnavailable />}>
                <Suspense
                  fallback={
                    <p role="status" className="devspace-loading">
                      Loading experiments…
                    </p>
                  }
                >
                  <SignatureStudies studyId={routeParams.get('study')} />
                  <ThemePortalExperiment />
                  <section className="devspace-guidance">
                    <Glyph name="flask" />
                    <div>
                      <h3>From experiment to component</h3>
                      <p>
                        Explore a real question here. Validate states, naming,
                        keyboard use and theming. Then move the settled
                        implementation into the library.
                      </p>
                    </div>
                  </section>
                </Suspense>
              </StudyBoundary>
            </>
          )}
          {entry && (
            <>
              <div className="page-intro">
                <div className="intro-meta">
                  <span className="eyebrow">
                    {entry.category.toUpperCase()}
                  </span>
                  <span className={`status-tag ${entry.status}`}>
                    {entry.status === 'planned' ? 'Planned' : 'Preview'}
                  </span>
                </div>
                {entry.unreleased && (
                  <span className="quiet-label">
                    Unreleased · repository preview
                  </span>
                )}
                <h1>{entry.name}</h1>
                <p>{entry.description}</p>
              </div>
              <nav
                className="component-view-nav"
                aria-label={`${entry.name} documentation`}
              >
                <a
                  href={`#components/${entry.id}`}
                  aria-current={!apiView ? 'page' : undefined}
                >
                  Examples
                </a>
                <a
                  href={`#components/${entry.id}/api`}
                  aria-current={apiView ? 'page' : undefined}
                >
                  API reference
                </a>
              </nav>
              {apiView ? (
                <ApiReference
                  key={entry.id}
                  componentId={entry.id}
                  partName={routeParams.get('part')}
                  propertyName={routeParams.get('prop')}
                />
              ) : (
                <div className="component-examples" key={entry.id}>
                  <ExampleLinks componentId={entry.id} />
                  {entry.id === 'button' && <ButtonExamples />}
                  {entry.id === 'switch' && <SwitchExamples />}
                  {entry.id === 'tabs' && <TabsExamples />}
                  {entry.id === 'menu' && <MenuExamples />}
                  {entry.id === 'physical-button' && <PhysicalButtonExamples />}
                  {entry.id === 'combobox' && <ComboboxExamples />}
                  {entry.id === 'scroll-area' && <ScrollAreaExamples />}
                  {entry.id === 'calendar' && (
                    <CalendarExamples key="calendar" />
                  )}
                  {entry.id === 'date-picker' && (
                    <CalendarExamples key="date-picker" picker />
                  )}
                  {entry.id === 'toast' && <ToastExamples />}
                  {entry.id === 'badge' && <BadgeExamples />}
                  {entry.id === 'alert' && <AlertExamples />}
                  {entry.id === 'spinner' && (
                    <LoadingExamples key="spinner" spinner />
                  )}
                  {entry.id === 'skeleton' && (
                    <LoadingExamples key="skeleton" />
                  )}
                  {entry.id === 'card' && (
                    <>
                      <CardExamples />
                      <EmptyStateExample />
                    </>
                  )}
                  {(['select', 'radio-group', 'checkbox'] as const).map(
                    (kind) =>
                      entry.id === kind && (
                        <SelectionExamples key={kind} kind={kind} />
                      ),
                  )}

                  {(['field', 'input', 'textarea'] as const).map(
                    (kind) =>
                      entry.id === kind && (
                        <FieldExamples key={kind} kind={kind} />
                      ),
                  )}
                  {(['dialog', 'popover', 'tooltip'] as const).map(
                    (kind) =>
                      entry.id === kind && (
                        <OverlayExamples key={kind} kind={kind} />
                      ),
                  )}
                  {entry.id === 'theme' && (
                    <>
                      <ThemePortalExperiment />
                      <CodeBlock
                        code={`<Theme appearance="dark" >\n  <Theme appearance="light">\n    {/* Inner settings also reach themed portal content. */}\n  </Theme>\n</Theme>`}
                      />
                    </>
                  )}
                  {entry.status === 'planned' && (
                    <section className="planned-component">
                      <span className="planned-mark">
                        <Glyph name="layers" size={30} />
                      </span>
                      <h2>A place reserved for {entry.name}.</h2>
                      <p>
                        This component is on the implementation plan. It has no
                        package export yet.
                      </p>
                      <Button
                        variant="secondary"
                        render={<a href="#components/button" />}
                        nativeButton={false}
                      >
                        Try the first components
                        <Glyph name="arrow" />
                      </Button>
                    </section>
                  )}
                </div>
              )}
            </>
          )}
          <footer className="workspace-footer">
            <span>unlikely ui · v{packageMetadata.version}</span>
            <span>React · Base UI · Tailwind</span>
          </footer>
        </main>
      </div>
    </Theme>
  );
}
