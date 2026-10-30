# Implementation status

Updated 2026-10-31. Keep implemented checkout behavior separate from published
releases and future delivery options.

- **Published baseline:** `unlikely-ui@0.1.0-alpha.3` contains twenty-five preview
  catalogue entries, including Switch, Tabs and Menu. The shadcn Base UI
  convention migration adds callable roots, named parts, standard Button variants,
  `buttonVariants`, composed controls and scoped semantic Tailwind aliases.
  Existing compound names remain available, with documented differences such
  as Dialog's new close-button default. See
  [consumer migration guidance](../USAGE.md#upgrades-and-validation).
  Published on 2026-10-30 UTC; the public tarball matches the checked artifact.
  See [the release record](./release-2026-10-30.md).
- **Previous release:** alpha.2 was published on 2026-10-22 with twenty-two
  preview entries, including ScrollArea. See [its release record](./release-2026-10-22.md).
- **App studies:** Margin and Dispatch are in-memory, app-owned experiments
  outside the npm runtime. The owner requested a stronger visual/motion direction
  after reviewing the first studies. That revision is implemented and checked
  in the checkout. The final council is complete; bounded findings were fixed
  afterward without rescoring. Owner feedback remains pending. See
  [the app-study evidence](./app-studies-2026-10-30.md).
- **Signature studies:** all six owner-selected experiments are reconstructed
  against the original imagegen references in Devspace, outside the npm package.
  The first implementations were rejected on 2026-10-30; the completed council
  sequence reviewed those substitutes and does not score this reconstruction.
  The revision restores the output-slot Receipt, mechanical Split-flap, hinged
  Guarded action, material Allocation bar with locks, signed shadow-offset XY
  pad and six-sector contextual Radial menu. Owner acceptance remains pending.
  See [contracts and limits](./signature-studies.md).
- **Delivery:** one npm package is the default. A source registry is an optional
  future delivery mode, not an implemented or scheduled second edition. Further
  publication, deployment and Campus migration are separate operations.

## Shared boundary

Base UI owns interaction, keyboard, focus, positioning and controlled-state
conventions. The library owns styled composition, semantic tokens, loading and
naming contracts, scoped theme restoration, declarations and consumer CSS
integration. Apps own layouts, requests, business state, copy and font loading.

The shadcn adaptation improves familiar composition; it does not promise every
upstream API or third-party block, automatic merging, or measured maintenance
savings. Pinned provenance is in `docs/shadcn-upstream.json`; follow the
[upstream review workflow](./packaging.md#shadcn-upstream-maintenance).

Use one implementation and release version for controls and tokens. Preserve
explicit subpaths, CSS imports, React peers, interactive client directives and
presentation-only module boundaries. Source delivery must reuse this source if
it is selected later. See [packaging](./packaging.md) for the public contract.

## Repository layout

```text
src/
  index.ts                 # public re-exports
  theme.tsx                # scoped appearance, direction and token overrides
  token-names.ts           # generated from canonical CSS
  components/              # flat component modules and compatibility subpaths
  lib/                     # small styling/control helpers
  styles/
    tokens.css             # only editable token values
    tailwind.css           # optional semantic utility adapter
    index.css              # library stylesheet entry

dev/                       # separate Vite gallery
  catalog.ts               # alphabetical discovery and maturity
  examples/                # component examples and app-owned recipes
  experiments/             # investigations and app studies, excluded from npm
  generated/api/           # generated and ignored API JSON
  public/                  # showcase assets and font notices

tests/
  browser/                 # gallery and installed-consumer behavior checks
  consumer/                # packed-artifact fixture
  adoption/                # archived independent consumer trial
scripts/                   # build, docs, token and fixture orchestration
docs/                      # contracts, rationale, evidence and release records
dist/                      # generated npm output, ignored
.local/                    # ignored disk-backed builds, fixtures and diagnostics
```

Keep component-local variants and relative sibling imports. Create a component
directory only when multiple files warrant it. No monorepo runner, empty
registry scaffold, separate tokens package or product model belongs here without
a concrete need. Runtime and pnpm pins live in `mise.toml` and `package.json`.

## Showcase and devspace

The gallery implements overview, setup, foundations, recipes, component
examples/API views, app studies and devspace. Search and shareable links aid
composition discovery; availability notices distinguish checkout examples from
npm. Experiments stay outside the package until their contracts and relevant
checks justify promotion. See [showcase](./showcase.md).

## M0 — Foundations and package proof

Implemented foundation: scoped `.u-theme`, explicit `tokens` overrides, inherited
appearance/direction, canonical CSS values and generated token-name types.
Package utilities use `ui:` with `ui-theme`, `ui-base`, `ui-utilities` layers.

Preserve the integration gate: opposite nested appearances and token overrides
reach portals; host controls remain isolated; allowed consumer overrides work
in the documented cascade; packed exports/types/CSS resolve without repository
aliases; DOM-free SSR and browser hydration succeed. A plain React fixture and
an app-owned Tailwind fixture cover the supported style boundary. A broader
framework claim needs its own fixture.

## M1 — Actions and fields

Button, Field, Input and Textarea are preview implementations. The current
checkout uses standard Button variant/size names and retains older aliases.
Icon-only sizes require an accessible name; apps supply icons. Loading retains
layout/name and exposes busy state.

Field preserves Base UI association and validation timing. It supplies no form
framework or business validation. Text controls retain controlled/uncontrolled,
ref/event, disabled and read-only behavior. Preserve keyboard-completable forms,
associated errors, visible focus, touch sizing and consumer composition.

## M2 — Overlays and the first alpha

Dialog, Popover and Tooltip compose Base UI without a generic replacement
engine. Content wrappers own the portal/positioning composition and restore
originating Theme settings, including nested overrides and direction.

Preserve title/description and trigger naming, focus containment/return,
dismissal, nested popup stacking, narrow layouts and reduced motion. Essential
information must remain available without hover. The packed project-form slice,
keyboard cases and representative axe checks supplied the first alpha's bounded
integration evidence. No comprehensive human accessibility audit is implied.

Alpha.1 was published on 2026-10-20; alpha.2 followed on 2026-10-22. Publication
is an explicit release action, not a milestone's automatic side effect.

## M3 — Common controls and presentation

Select, RadioGroup (including segmented selection), Checkbox, Combobox,
Calendar, DatePicker, Toast, Spinner, Skeleton, Badge, Alert, Card, ScrollArea
and PhysicalButton are preview implementations. Switch, Tabs and Menu are
alpha.3 previews. Calendar wraps React DayPicker single-date mode;
DatePicker composes Calendar, Popover and Button. PhysicalButton is an opt-in
expressive control, separate from ordinary Button geometry.

Apps own search/debouncing, effective today/timezone policy, local-date
serialization and scheduling logic. Empty states and settings/task workflows
remain compositions, not new runtime widgets. Full scheduling calendars,
data-table engines, chart systems and product navigation remain outside the
current library scope.

## Validation and scripts

- `pnpm dev`: regenerate API docs and run the local gallery.
- `pnpm check`: regenerate token types/API docs and type-check source/examples.
- `pnpm docs:generate` / `pnpm test:docs`: generate and verify public API extraction.
- `pnpm tokens:check`: regenerate the foundations sheet and contrast report;
  currently 98 palette pairs, not a component accessibility audit.
- `pnpm build`: clean ESM, declarations, CSS, tokens and Tailwind adapter output.
- `pnpm showcase:build`: regenerate API docs and build the static gallery.
- `pnpm test:browser`: Playwright gallery workflows, responsive behavior and
  representative axe checks. Human screen-reader/zoom/device checks are separate.
- `pnpm test:consumer`: build/pack/install the artifact, check exports/docs/types,
  copied recipes/app-study types, SSR/hydration, portals and CSS integration in
  plain React and consumer Tailwind modes.
- `pnpm release:check`: the complete pre-publication gate above. `prepack`
  builds; `prepublishOnly` runs the release gate. See [releasing](./releasing.md).

Use the narrowest meaningful checks after ordinary changes and the full gate
for a release candidate. Test integration behavior rather than static class maps;
one passing palette or screenshot does not establish accessibility. Keep heavy
fixtures/caches on disk and use separate Playwright output directories for
concurrent diagnostic runs.

## Validation records and open evidence

The [migration council record](./council-review-2026-10-30.md) identifies its
frozen baselines, accepted fixes, prior gallery/consumer results and limits.
These historical results must not be presented as fresh checks of later edits.

Before the owner's visual/motion revision, the app-study baseline passed a
clean sequential `pnpm release:check`: type/docs/token checks, production build,
57 gallery cases and nine packed-consumer cases in each styling mode. The local
log is `.local/app-studies/release-check-sequential.log`. Earlier logs failed on
CSS-import fixture typing and concurrent trace-artifact writes; those invocations
were not green release gates. The revised checks, final council and subsequent
corrections are recorded in [the app-study evidence](./app-studies-2026-10-30.md).

One fresh package-only agent trial produced Reading room using public installed
guidance and declarations; the parent subsequently checked a bounded browser
workflow. This demonstrates feasibility for that task, not general agent
productivity, owner-recognized branding or maintenance savings. Human
screen-reader speech, real zoom, physical-device/virtual-keyboard ergonomics,
actual app upgrades and a useful upstream adaptation remain open evidence.

The showcase workflow checks pull requests and deploys successful `main` builds;
see [deployment](../deploy/README.md). Nothing in these records authorizes a new
publication, deployment or another repository's migration.
