# App studies — implementation brief

This is the initial study brief. The owner's later feedback rejected the quiet,
static outcome; current visual/motion choices and evidence are recorded in
`docs/app-studies-2026-10-30.md`. Keep this brief as context, not final visual approval.

These are app-owned reference compositions for a design-system adoption test,
not new library components or deployed products. Keep all demo state in memory.
Question: can ordinary unlikely ui controls and semantic foundations produce
coherent, recognizably personal, useful apps without gallery chrome?

Two fictional products, one visual language:

- Margin: a personal project/work queue dashboard. Useful rows, filters, a
  working create-item dialog and meaningful current/empty/loading/error states.
- Dispatch: a workspace settings editor. Visible labels, real dirty-state and
  validation, a failure/retry/save/discard flow and readable review of changes.

Both use these props, declared in `types.ts` by the parent:
`StudyProps { locale: 'en' | 'ru'; phase: 'ready' | 'loading' | 'empty' | 'error'; onRetry: () => void }`.
English and Russian must both work, including longer Russian labels. Parent
owns the review toolbar, theme and shared CSS; each screen owns its state,
layout, app navigation, content and screen-specific CSS file. Export `DeskStudy`
from `desk.tsx` and `SettingsStudy` from `settings.tsx`. Do not edit one another's
files, gallery routing, shared files, tests, package/version or runtime src.

Import actual named components by relative subpath from `../../../src/...`.
Use the published public surface only, no private imports or raw Base UI.
Choose appropriate existing controls, not a checklist of every component.
Base UI owns focus, keyboard behavior and popup interaction. DialogContent has
a built-in close; localize closeLabel. App-owned labels and statuses must be
localized. All icon-only actions have a meaningful accessible name.

Visual language: warm paper / olive dark / mint action, restrained geometry,
fine borders, readable text, generous breathing room with useful information
density. No mascot, illustration, gradients, hero marketing, arbitrary brand
colors or copied gallery chrome. Avoid a generic dashboard of redundant KPI
cards. Shared tokens own color, font, radius and spacing. 14px/20px ordinary UI,
16px/24px longer body, at least 12px supporting metadata. Small layouts reflow;
long strings wrap. All app CSS selectors are under `.app-study` or screen prefixes.
No global reset, library overrides, inline palette values, added dependency,
custom primitive, persistence, network requests or product widget in src.

The parent supplies these shared CSS hooks:
`.app-study` (font, canvas, text), `.study-topbar`, `.study-brand`, `.study-nav`,
`.study-main`, `.study-heading`, `.study-kicker`, `.study-title`, `.study-lead`,
`.study-muted`, `.study-actions`, `.study-stack`, `.study-empty`, `.study-status`.
Use ordinary semantic HTML plus library Card/Badge/etc where useful. A shared
`.study-icon` class styles any small inline SVG using currentColor.

Each screen must have an h1, useful landmark names, keyboard-completable core
flow and status/error feedback. Error and loading variants may be forced by
the parent's review toolbar; avoid mixing review controls into product content.
The parent's onRetry returns the page to ready. For settings, ready can include
a demo first-save failure: tell the user what happened and retain edits.

Deliver runnable files, concise manual-check notes and any exposed API friction.
Do not start server, install packages, spawn delegates, use other agent reports,
commit, push, publish, deploy or change other repositories. Parent integrates,
runs checks, and arranges exactly one subsequent council round.
