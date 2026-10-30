# Component workspace

Status: preview showcase, updated 2026-10-30. The showcase is the daily development
surface for unlikely ui, with a gallery of actual components and a devspace for
new work. It is separate from the npm runtime. The public target is
https://ui.kreoniz.ru; successful `main` builds deploy through GitHub Actions.
See [deployment and rollback](../deploy/README.md).

The checkout uses shadcn Base UI callable roots and named parts from one shared
implementation, retaining compound aliases and old API links. These APIs and
the semantic app-token adapter are included in alpha.3. Quick start installs the
exact release, with a separate local-tarball evaluation path; source/API copy
points identify the matching version. Generated imports follow the selected part. Complete
recipes include essential app-owned layout styles and are type-checked against
the packed package. See the [migration review](./council-review-2026-10-30.md)
for its frozen baselines, fixes and evidence limits.

The `#apps/desk` and `#apps/settings` routes are app-owned reference studies:
Margin's project queue and Dispatch's settings editor. They use shared semantic
foundations and named controls without the component gallery chrome or mascot.
The separate review bar switches light/dark appearance, English/Russian and
populated/loading/empty/error content. These in-memory fictional products live
in `dev/experiments/app-studies/`; they are not new library widgets or published
apps. Their entry is loaded lazily. See the [app-study evidence](./app-studies-2026-10-30.md).
The owner requested stronger visual identity and motion after the first studies;
that revision is implemented and the final council is complete. Its scores
describe the frozen review baseline; subsequent fixes were not rescored.
Owner feedback on the visual direction remains pending.

## Start and build

```sh
pnpm dev
# http://127.0.0.1:5177

pnpm showcase:build
# static output: .local/showcase
```

Vite/React and the Tailwind Vite plugin provide source and stylesheet updates.
The dev and showcase build commands regenerate typed API references first.
The workspace wordmark uses the `dev/public/button-logo-small.png` display
derivative: a large
red cap, circular dark housing, and broad yellow hazard ring, facing the viewer
directly without an indicator light. The desktop wordmark uses a 52px logo;
the compact mobile header uses 32px. Neither has a subtitle. The overview has
no large logo image.
The browser tab uses a simplified `dev/public/favicon.svg` and the title
“unlikely ui — Playground” before React loads, then the current page name.
Sidebar branding retains 16px spacing on desktop. On phones, a compact sticky
brand/Components/appearance row is followed by the component search.
The sidebar and page footer show the package version without local-development
or publication-status labels.
The foundations sheet embeds the same display derivative separately. See
[asset provenance and regeneration](./assets.md). Inter and the logo are
development assets; importing the npm package loads neither. Inter's notice
is retained in `dev/public/fonts/Inter-LICENSE.txt`.

## Views

- `#overview`: catalogue and composition entry points. Counts and maturity
  describe local work, not npm availability or API stability.
- `#quick-start`: checkout/published setup, CSS/Theme imports, Tailwind layer
  order and a working project form.
- `#recipes`: complete recoverable-save and required DatePicker/FormData
  compositions, with actual source rewritten to public package imports.
- `#foundations`: semantic pairings, type/geometry specimens and synchronized
  light/dark control comparisons.
- `#apps/desk`, `#apps/settings`: in-memory app studies. The review bar controls
  appearance, language and content state; View app only hides it and the footer
  restores it. `appearance`, `locale`, `state` and `review` hash-query parameters
  make a review view shareable.
- `#devspace`: Receipt, Split-flap, Guarded action, Allocation bar, XY pad and
  Radial menu, plus the existing theme/portal experiment. These working studies
  are outside the package; see [contracts and limits](./signature-studies.md).

Component routes follow `#components/<catalogue-id>`; `dev/catalog.ts` is the
source for their names, descriptions, aliases and maturity. Switch, Tabs and
Menu require alpha.3 or later. Planned entries must show a placeholder
rather than advertise a package export.

Representative complex examples include the validated Dialog form and nested
Popover, async Combobox with error/empty states, Russian/English Calendar and
DatePicker, nested/RTL portals, and Toast stacking with hover/keyboard/touch
expansion. PhysicalButton exposes material/shape/press controls and momentary
or toggle indicator behavior. Card's empty state is an app-owned recipe, not a
new runtime export. The component contracts document supported behavior;
examples make it inspectable.

Each component page has an **API reference** link at
`#components/<component>/api`. It lists prop types, required/optional status,
declared defaults, source descriptions and origins. Compound components have a
part/function picker, with canonical names before labelled compatibility and
explicit-composition surfaces. Selection is preserved in `?part=DialogContent`
(old `?part=Dialog.Content` links remain valid); property
links add `&prop=initialFocus`. Example headings use `?example=example-playground`.
The “On this page” links scroll smoothly and focus the destination heading,
including when selecting the current link again. Reduced-motion preferences and
initial deep-link loads use instant scrolling.
Search explicitly names its current part and points to matches in other parts.
On phones, property rows stack into full-width named/type/default items.
Generator methodology is available in a disclosure. Search includes inherited props; React and DOM attributes
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
overview. Search includes names, categories, descriptions, and explicit aliases.
The mobile Components action remains in the sticky toolbar while reading. At widths up to 900px a
Components button expands the complete catalogue; search also exposes matching
components. Choosing an entry closes the menu, clears the query and focuses the
main content. The preview toolbar stays available while scrolling on mobile.
The component workspace appearance is saved in localStorage
under `unlikely-ui:appearance`. The selected light/dark appearance is restored
on reload and navigation, including portaled components. Invalid or unavailable
storage falls back to light; toggling still works when storage is blocked.
Persistence belongs to the showcase; the library's Theme remains controlled by
its consuming app. App-study URL parameters can select their review appearance.

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

The theme/portal experiment mounts a Base UI popover across opposite nested
appearances, local overrides and RTL; it is not a public Popover implementation.
App studies are product compositions, not candidates for new runtime widgets.

## Verification

`pnpm test:browser` exercises the gallery with Playwright: actions, loading
names, disabled styling, native-link role, themes, portal settings and
focus return, search/mobile navigation, 320–1440px layouts, touch sizing and
reduced motion. Checks include field associations and validation, a complete
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
Accessibility scans use reduced motion or wait for finite entry motion so they inspect settled colors; animation
behavior has separate coverage. Use `UI_CHROMIUM_PATH` for another executable or install Chromium with
`pnpm exec playwright install chromium`. These checks are evidence for the
covered cases, not blanket accessibility certification.

App-study checks cover task/settings workflows, forced-state recovery,
English/Russian reflow and representative accessibility samples. Inspect motion
through live interaction or recordings; static captures only establish a frame.
Root text scaling is not equivalent to human browser-zoom, screen-reader speech
or physical-device/virtual-keyboard testing. Dated results belong in the linked
review records, with the exact baseline and remaining limits.

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

For an already running showcase on a different port, use
`UI_SHOWCASE_URL=http://127.0.0.1:5195 pnpm test:browser`. This opts out of the
test runner's managed dev server; normal runs retain port 5177.

Run gallery commands sequentially by default. For concurrent diagnostic runs,
give each a distinct `--output .local/<diagnostic-name>` directory so Playwright
does not delete another run's traces. Do not present an invocation that failed
on artifact handling as a green release gate; retain a clean sequential result.
