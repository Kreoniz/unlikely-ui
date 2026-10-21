# Component workspace

Status: local implementation, 2026-10-19. The showcase is the daily development
surface for unlikely ui, with a gallery of actual components and a devspace for
new work. It is separate from the npm runtime. The public target is
https://ui.kreoniz.ru; successful `main` builds deploy through GitHub Actions.
See [deployment and rollback](../deploy/README.md).

## Start and build

```sh
pnpm dev
# http://127.0.0.1:5177

pnpm showcase:build
# static output: .local/showcase
```

Vite/React and the Tailwind Vite plugin provide source and stylesheet updates.
The dev and showcase build commands regenerate typed API references first.
The workspace wordmark uses `dev/public/button-logo.png`: a large
red cap, circular dark housing, and broad yellow hazard ring, facing the viewer
directly without an indicator light. The wordmark uses a 52px logo with no
subtitle. The overview has no large logo image.
The browser tab uses a simplified `dev/public/favicon.svg` and the title
“unlikely ui — Playground”. Sidebar branding has 16px above/below it on desktop;
the mobile header has 10px above the logo and before search.
The sidebar and page footer show the package version without local-development
or publication-status labels.
The foundations sheet embeds the same PNG separately. Inter and the logo are
development assets; importing the npm package loads neither. Inter's notice
is retained in `dev/public/fonts/Inter-LICENSE.txt`.

## Views

- `#overview`: actual previews, entry into devspace and the next implementation
  set. Counts/status describe local work, not npm availability or API stability.
- `#foundations`: semantic colors, type/spacing, category fills and geometry.
- `#components/button`: interactive variants,
  sizes and disabled/loading states, plus examples and copyable code.
- `#components/physical-button`: a tactile button with a circular base and domed
  cap viewed from a lower, front-facing angle by default. Controls cover label,
  size, whole-button shape, press depth,
  stripes, six material colors and presets, plus momentary/toggle behavior and
  an optional front light. The light follows committed toggle state or momentary
  pressure. Examples cover both appearances, icon-only naming, an app-controlled
  toggle with an indicator and disabled state.
- `#components/field`, `#components/input`, `#components/textarea`: controlled
  editing, associated descriptions/errors, blur validation and read-only/disabled states.
- `#components/dialog`, `#components/popover`, `#components/tooltip`: project form,
  editable popover, keyboard hints and nested-theme examples.
- `#components/select`, `#components/radio-group`, `#components/checkbox`:
  keyboard selection, form values, disabled, invalid, and mixed states.
- `#components/theme`: theme/portal experiment and a composition example.
- `#components/combobox`: simulated async group search, minimum query length,
  loading, empty/error states, clearing, and selection inside a dialog.
- `#components/calendar`, `#components/date-picker`: Russian/English labels,
  Monday-first weeks, disabled dates, keyboard navigation, selected-week
  highlighting, Today, clearing and disabled controls. The reference date is fixed at 19 October 2026.
- `#components/toast`: timed messages, urgent errors, persistent actions and
  dismissal. Show stack adds three persistent cards of different heights.
  Cards overlap until hover, keyboard focus or a touch tap expands them.
  Timers pause on hover/focus; F6 reaches the notification area.
- `#components/spinner`, `#components/skeleton`: named progress and decorative
  placeholders with a working loaded state and reduced-motion support.
- `#components/badge`, `#components/alert`: status/category labels and recovery actions.
- `#components/card`: content panels.
  The Card page includes an interactive empty-state recipe with no separate export.
- `#components/scroll-area`: native scrolling with custom vertical and horizontal
  scrollbars, changing content length, a viewport ref, and an RTL table example.
  This component is a local unreleased preview after alpha.1.
- `#devspace`: experiments that answer a specific implementation question.
- Planned entries have a clear placeholder, not an advertised package export.

Each component page has an **API reference** link at
`#components/<component>/api`. It lists prop types, required/optional status,
declared defaults, source descriptions and origins. Compound components have a
part/function picker. Search includes inherited props; React and DOM attributes
are expandable. Exported helper types retain their original declarations,
including conditional requirements. Hooks and manager factories include their
call signatures and return members.

Code blocks use a lazily loaded Shiki highlighter with TSX and TypeScript
grammars and light/dark themes. Tokens are rendered as escaped React text;
the Copy action always uses the original source. Plain text remains available
while the highlighter loads or when highlighting is unavailable. Syntax colors
use semantic ink for low-contrast tokens to maintain contrast on
the showcase's cream and olive surfaces.

## Typed API generation

`pnpm docs:generate` uses the existing TypeScript compiler to inspect the source
modules named by package.json exports. It discovers compound members rather
than maintaining a second component/prop list. It retains generic signatures,
inherited Base UI/DayPicker props, native attributes, local JSDoc descriptions,
and exported type aliases. The ignored `dev/generated/api/` JSON files are
loaded per component; they are excluded from npm.

Run generation after changing a public API or its comments while the dev server
is running. `pnpm dev`, `pnpm check` and `pnpm showcase:build` also regenerate it.
Use `pnpm test:docs` for extraction checks. Describe custom props next to their
TypeScript declarations so editor hints and the showcase share the same text.
Do not edit generated JSON or keep a parallel hand-written props table.

Defaults are read from parameter initializers, then JSDoc `@default` or
`@defaultValue`. The generator does not execute components or infer all
conditional runtime behavior. Explain those rules in JSDoc and the component
contracts. Inherited documentation retains its upstream attribution. Full type
declarations remain available because a flat table cannot express every union
constraint.

Optional function options are expanded from their non-nullable object type;
their call signatures still show that the argument is optional. Property types
are formatted in the component module's scope so upstream aliases use their
public imports. If a type exposes private paths or an excessive compiler
expansion, the table shows an exact public indexed-access type. The original
compiler output remains in a labeled disclosure; internal paths there are not
application imports. Generic names match the selected part's signature.

The full module declaration disclosure is emitted into memory by TypeScript,
including required imports and private helper declarations. It supplies context
for individual type excerpts without executing component code or maintaining
another type model. Its relative imports resolve from the installed declaration
file. Source declarations and runtime modules are not modified by doc generation.

The component catalogue is alphabetical in the sidebar, search results and
overview. The sidebar searches component names/categories. At widths up to 900px a
Components button expands the complete catalogue; search also exposes matching
components. Choosing an entry closes the menu, clears the query and focuses the
main content. The preview toolbar stays available while scrolling on mobile.
The appearance control applies to the workspace and is saved in localStorage
under `unlikely-ui:appearance`. The selected light/dark appearance is restored
on reload and navigation, including portaled components. Invalid or unavailable
storage falls back to light; toggling still works when storage is blocked.
Persistence belongs to the showcase; the library's Theme remains controlled by
its consuming app. Copy uses direct, descriptive labels throughout the workspace.

The sidebar and code examples use ScrollArea for consistent rounded scrollbars.
The page itself keeps document scrolling. Code viewports cap their height at
400px and preserve line formatting with horizontal scrolling; Copy stays outside
the viewport. Named scrollable viewports are keyboard reachable when content
overflows. The sidebar returns to its natural content height on mobile.

## Maturity and adding work

**Planned**: no implementation/export. **Experimental**: a runnable devspace
investigation, excluded from the package. **Preview**: a real library
implementation with examples, still subject to API/visual changes. Do not label
a component stable until its support contract has actually been met.

1. Add/update its entry in `dev/catalog.ts` with actual status and purpose.
2. Put exploratory work in `dev/experiments/`, outside the public export map.
3. Move settled implementations into `src/components/`, add explicit exports,
   and add gallery examples. Document custom props with JSDoc and regenerate API
   references. Use shared semantic tokens and scoped themes.
4. Cover meaningful states and accessible names, appearance and sizes and narrow
   layouts. Examples should make composition and keyboard behavior reviewable.
5. Run relevant checks. Theme/style boundaries require packed consumer checks;
   an experiment does not establish a public component's full integration gate.

The first experiment mounts a Base UI popover inside nested Theme boundaries.
It covers opposite appearances, local overrides, RTL across
a portal. It is deliberately not exported as unlikely ui's Popover.

## Verification

`pnpm test:browser` exercises the gallery with Playwright: actions, loading
names, disabled styling, native-link role, themes, portal settings and
focus return, search/mobile navigation, 320–1440px layouts, touch sizing and
reduced motion. New checks cover field associations and validation, a complete
dialog form, nested popovers and tooltip keyboard descriptions. Axe runs in
both appearances, including the open Dialog and Popover. Packed consumer checks
exercise the exported fields/overlays with and without consumer Tailwind.
Combobox is checked as a complete closed page and, while open, within its popup
scope against WCAG rules. Base UI temporarily hides outside content for virtual
cursor navigation, so an open whole-page scan would incorrectly include the
outside focus targets. Keyboard interaction and dismissal are checked separately.

Local tests use `/usr/bin/google-chrome` when available; CI uses Playwright's
full Chromium in [new headless mode](https://playwright.dev/docs/browsers#chromium-new-headless-mode),
matching the browser used locally rather than the separate headless shell.
Accessibility scans use reduced motion so they inspect settled colors; animation
behavior has separate coverage. Use `UI_CHROMIUM_PATH` for another executable or install Chromium with
`pnpm exec playwright install chromium`. These checks are evidence for the
covered cases, not blanket accessibility certification.

The Button playground uses the library Select for variants, RadioGroup for sizes,
and Checkbox for state toggles. Icon-only actions are Button sizes rather than
a separate catalogue component. Overlay transitions follow the motion tokens
and reduced-motion preference; Tooltip includes a positioned arrow. Popover
positioners default to fixed positioning to avoid focus-induced document scrolling.
RadioGroup also demonstrates a segmented filter using the same radio semantics.
Tooltip demonstrates a default 300ms hover delay, an instant option and an
explicit 600ms override. Every hover honors the selected delay, including
movement between the two enabled triggers and repeated hover on one trigger.
Keyboard focus opens immediately; Provider shares settings without an instant-open
group phase.
