# unlikely ui: foundations draft

Status: draft 02 for discussion, 2026-10-19. Derived from the mascot and library
mockups, plus the Marvin Campus screenshots and palette supplied in this conversation.
Values are deliberately chosen from that visual direction, not presented as
exact measurements of raster mockups. [tokens.css](../../src/styles/tokens.css) is the
authoritative value source for this draft; the HTML sheet reads that source.
Mint is the single initial design direction. The tokens feed the alpha runtime
build; the first runtime alpha, `0.1.0-alpha.1`, was published on 2026-10-20.

## Character

Warm paper, olive charcoal, fresh mint, readable type, fine borders and small
soft shadows. The standalone brand mark is a red push button with a large red
cap, round dark housing, and a broad yellow hazard ring, selected on 2026-10-20.
It faces the viewer directly, with concentric circles, no tilt, and no indicator
light. The workspace pairs it with its wordmark; the overview has no large logo.
Its illustration colors belong to the brand layer. UI actions retain the mint semantic family, and
destructive actions use their own semantic palette. Brand and success are
separate roles, even when both are green. Everyday controls remain quiet and
predictable. Avoid gradients, texture, glow and illustrative shapes in ordinary
controls. Using components does not require displaying the unlikely ui mark
or replacing a product's own identity.

PhysicalButton is an explicit, opt-in expressive exception: its dimensional
housing, gradients, shadows and hazard stripes follow the owner's supplied
physical-button reference. The six `--u-physical-*` material roles (cap, ink,
casing, plate, stripe and indicator) have canonical defaults in tokens.css, independent
of status and brand meanings. They retain their material identity in both
appearances. The optional front indicator is paired with aria-pressed and visible
On/Off text in the toggle example; it is not the sole state cue. Ordinary controls
retain the flat treatment above.

## Campus-informed refinement

Marvin Campus is a visual reference for the library. This pass designs unlikely
ui only; it does not change Campus or plan its framework migration. The library
direction remains React, Base UI and Tailwind.

Adopt the owner's requested neutral anchors: cream canvas `#F7F4EB`, paper
surface `#FCFAF5`, charcoal canvas `#292D28` and olive surface `#2C322B`.
In light appearance, surfaces become slightly brighter than the page. In dark
appearance, they become lighter as they rise. The earlier draft's dark colors
were deeper and more saturated green; this revision stays closer to Campus.

Keep mint as unlikely ui's default action accent. Campus's sage selection
treatment is useful evidence for independent selection roles, not a reason to
replace the library brand with sage. Introduce selection aliases and six
categorical fill/ink pairs. Keep category identity, action, selection and status
as distinct meanings, even when their initial palettes are related.

Use 6px control, 8px card and 12px dialog radii for a more precise, compact
character. Keep 40px default controls and an explicit 32px small size;
dense information should not make every interaction target small. Favor 14/20
text in dense controls and lists, with 12/16 for secondary metadata. The 16/24
body role remains available. Avoid copying Campus's many 10–11px labels into
the library defaults. Use soft dividers for structure and stronger outlines
only where they identify controls or a specific state. Reserve pronounced
offset shadows for product expression rather than every shared component.

Evidence checked 2026-10-19: the live Campus computed theme and the local
`marvin-campus/src/app.css`, component styles and `src/lib/colors.ts`. The live
site and local CSS currently use slightly different anchors (`#F7F4EC`,
`#242923`, `#282E27`) from the owner's requested targets above. Treat the supplied
targets as design choices, not claims about the currently deployed palette.

## Token contract

Use the `--u-` namespace. Use three levels only where useful:

1. Private references, such as `--u-ref-mint-300`: raw palette values.
2. Public semantic tokens, such as `--u-accent`, `--u-ink`, `--u-line`.
3. A few role aliases, such as `--u-control-height`, `--u-panel-radius`.

Components consume semantic roles, never raw color names. Products override
semantic tokens at their theme boundary. Keep appearance (light/dark) separate
from explicit control size. A brand override must update its whole
family: fill, hover, pressed, ink, soft, text, border and focus, then recheck
contrast. A single arbitrary brand color cannot guarantee readable states.

CSS custom properties are enough for the initial source of truth. Add a token
JSON export or generation step when a concrete Figma/native/tooling consumer
needs it. Avoid maintaining duplicate CSS and JSON values by hand.

## Color roles

| Token                | Light     | Dark      | Use                          |
| -------------------- | --------- | --------- | ---------------------------- |
| `--u-canvas`         | `#F7F4EB` | `#292D28` | App background               |
| `--u-surface`        | `#FCFAF5` | `#2C322B` | Cards and sections           |
| `--u-surface-raised` | `#FFFFFF` | `#353C33` | Menus and popovers           |
| `--u-well`           | `#EEE8DD` | `#232720` | Recessed areas               |
| `--u-ink`            | `#1F2421` | `#F5F5EE` | Primary text                 |
| `--u-muted`          | `#5D6860` | `#B4B9AE` | Secondary text               |
| `--u-line-soft`      | `#E2DCCF` | `#41483E` | Decorative dividers          |
| `--u-line`           | `#7B857C` | `#8B9985` | Identifying control outlines |
| `--u-accent`         | `#88F19E` | `#88F19E` | Primary action fill          |
| `--u-accent-ink`     | `#102818` | `#102818` | Text/icons on mint           |
| `--u-accent-text`    | `#21613A` | `#9AF4AE` | Links and accent text        |
| `--u-accent-soft`    | `#DCFBE2` | `#203E2A` | Selected subtle surfaces     |
| `--u-focus`          | `#21613A` | `#88F19E` | Focus outline                |

Accent hover is `#6DE584`; pressed is `#4BCB6D` in both modes. Do not use
mint as small text on cream, or white text on mint. Use the accent text and
accent ink roles respectively. Selected items pair the soft surface with
accent text, a checked indicator or underline, and an appropriate selected state.
`--u-selection`, `--u-selection-ink` and `--u-selection-border` initially alias
the accent soft/text/border family. Components expressing selection should use
these roles so a theme can tune selection independently of primary actions.

Each status has foreground (`--u-success`, `--u-warning`, `--u-danger`,
`--u-info`), soft surface (`*-soft`) and border (`*-border`) tokens. These
foregrounds are designed for status text, not solid button backgrounds. Start
destructive buttons with the danger foreground/soft pairing; add a separately
verified solid pairing if a product needs it. Labels and icons carry meaning
alongside color.

`--u-category-1` through `--u-category-6` are opaque pastel fills with the common
`--u-category-ink` foreground. Their theme values derive from Campus's blue,
lilac, sage, peach, aqua and coral fills. These support category labels and data
cards; they are independent of success/warning/danger/info. Keep category
assignments stable and retain labels or other cues. This is a categorical fill
palette, not a promise of chart-line contrast, perceptual ordering or reliable
distinction by color alone. Product-specific category allocation remains in apps.

State contract: default, hover, pressed, focus-visible, selected/checked,
invalid, disabled and read-only. Use explicit disabled surface and text for
text controls; `--u-opacity-disabled` is an alternative for decorative parts,
not an extra opacity layer over those colors. Disabled is distinct from
read-only. Loading retains the button's size and accessible name.

## Type

| Role            | Family         | Size / line height | Weight    | Tracking |
| --------------- | -------------- | ------------------ | --------- | -------- |
| Display         | Inter Tight    | 56 / 64            | 700       | -0.02em  |
| Heading lg      | Inter Tight    | 40 / 48            | 700       | -0.02em  |
| Heading md      | Inter Tight    | 32 / 40            | 600       | -0.01em  |
| Heading sm      | Inter Tight    | 24 / 32            | 600       | -0.01em  |
| Body            | Inter          | 16 / 24            | 400       | 0        |
| Small / control | Inter          | 14 / 20            | 400 / 500 | 0        |
| Caption         | Inter          | 12 / 16            | 400       | 0        |
| Code            | JetBrains Mono | 14 / 20            | 400       | 0        |

Use rem for size and line height. The pixel values above assume a 16px browser
root. Do not set or lock the consumer's root font size. Fonts are optional
consumer-loaded assets, with system fallbacks; importing the library never
starts a font request. Use 16px editable-field text on touch devices. Display
sizes are roles, independent of HTML heading levels, and may step down on narrow
layouts. Use tabular numbers only where values need to align.

## Geometry and behavior

- Space steps: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px. The main rhythm is
  4px; 2px is for fine alignment. Default inline gaps 8px; card padding 16–24px;
  section gaps 24–32px. No CSS utility class library is implied.
- Radius: 0, 4, 6, 8, 12, 16, 24px and full. Controls 6px, cards 8px, dialogs 12px;
  full is reserved for avatars, switches and occasional badges.
- Borders: 1px. Focus: 2px outline with 2px offset. The offset exposes the local
  surface, so a focus ring around mint is compared with the surrounding surface.
  Do not clip focus with container overflow.
- Control heights: small 32px, medium 40px, large 48px. The default is medium; size props choose small or large. Provide a non-overlapping effective target of at least 44px
  for touch controls; choosing a small size must not shrink touch targets.
- Icons: 16/20/24px, stroke 1.75 or 2 consistently within a set, with currentColor.
  The base package does not need an icon-library dependency.
- Shadows: small `0 1px 2px / 8%`, medium `0 4px 12px / 12%`, large
  `0 12px 32px / 18%` in light appearance. Dark values are in CSS. Elevation
  also uses surface and border; no shadow on every component.
- Motion: 100/160/240ms, standard `cubic-bezier(0.2, 0, 0, 1)`, exit
  `cubic-bezier(0.4, 0, 1, 1)`. Reduced motion sets durations to zero. Avoid
  transforms for ordinary hover; animate only the state properties needed.
- Layers: sticky 10, dialog/backdrop tier 100, popup 110, tooltip 130, toast 150.
  A dialog's backdrop and panel need an explicit local stacking order. Keep the
  app root isolated and allow menus opened from dialogs above the dialog tier.
- Responsive constants: 640, 768, 1024, 1280, 1536px. Keep them as documented
  build-time values; CSS custom properties cannot be substituted into standard
  media query conditions. Components should usually respond to available space.

## Accessibility checks

Regenerate the sheet and its [contrast report](./contrast.json) from the CSS:

```sh
python3 docs/foundations/build-sheet.py
```

The review sheet embeds the canonical `dev/public/button-logo.png` as a data URI
so its red button mark also works when the HTML is opened by itself.
The accompanying contrast report
checks the concrete opaque sRGB pairs used in
this draft: text at 4.5:1 and identifying outlines at 3:1. Decorative dividers
are intentionally excluded from the outline promise. It also includes actual
button hover/pressed, subtle selected surfaces and category label fills.
The current draft checks 98 pairs, including danger-button hover/pressed text
and the default physical-button label/cap pair. This is a palette check,
not a WCAG conformance audit of components or products. Check keyboard behavior,
zoom/reflow, screen reader names, reduced motion and focus clipping in real UI.

Base UI supplies unstyled interaction primitives; unlikely ui remains
responsible for styling, composition and accessible usage. Preserve compound
parts, refs, event semantics, controlled values and Base UI state attributes.
Theme inherits scoped settings and explicit `tokens` overrides through React context.
An empty Theme inside a custom portal restores them at its DOM boundary. A popup mounted under body must retain the appearance of
the control that opened it, including nested theme scopes.

## Styling direction: Tailwind

Recommended initial scope, following the owner's preference on 2026-10-19:
React, Base UI and Tailwind CSS v4, with one component implementation.
Author component styles with Tailwind classes and Base UI state attributes.
Use semantic CSS custom properties for token values and scoped light/dark
themes. These are part of the Tailwind implementation, not a separate styling
edition. Theme changes should update semantic values rather than duplicate
light/dark color utilities throughout components.

For this personal library, prioritize a small integration and maintenance
surface. Base UI documents Tailwind styling directly. StyleX offers a useful
typed JavaScript composition model, but adopting it would also commit this
project to its compiler integration and a different style override API. There
is no concrete consumer requirement for that commitment yet.

StyleX is outside the initial scope. Keep the CSS token contract portable;
reconsider another styling engine only when a real project demonstrates a
need. There is no planned StyleX adapter, edition or parity milestone.

Map semantic properties to namespaced utilities through a small Tailwind
theme adapter. The following is a proposed integration, not an existing
package export:

```css
@import 'tailwindcss';
/* Also import unlikely ui tokens and apply its theme scope. */

@theme inline {
  --color-u-canvas: var(--u-canvas);
  --color-u-surface: var(--u-surface);
  --color-u-ink: var(--u-ink);
  --color-u-muted: var(--u-muted);
  --color-u-accent: var(--u-accent);
  --color-u-accent-ink: var(--u-accent-ink);
  --radius-u-control: var(--u-radius);
}
```

This gives utilities such as `bg-u-surface`, `text-u-ink` and
`rounded-u-control`. Use `@theme inline` when referencing scoped properties
so utilities resolve them where they are used. Avoid replacing the consumer's
entire Tailwind theme or shipping Preflight as part of the library.

For npm distribution, prefer compiling the component CSS inside the library
and shipping it alongside JavaScript. Consuming projects import that CSS;
they need Tailwind only if they also author their own Tailwind utilities.
Keep package classes isolated from consumer utility names, and document CSS
layer order and supported `className` overrides before the first release.
Appending a class name alone does not guarantee which conflicting rule wins.
Validate overrides in a Tailwind consumer as part of the first integration.

Source recipes remain a separate distribution option if a real customization
need appears. They require complete static class names and an explicit
`@source` registration for the package because Tailwind does not scan
`node_modules` automatically. Do not add both delivery paths at the outset.

Build Button, Input and portaled Dialog with this one styling implementation
to validate tokens, states, scoped themes and packaging before expanding.

## Distribution proposal

The detailed delivery contract and later source-installation path are in
[packaging](../packaging.md); the planned source layout and component milestones
are in [implementation](../implementation.md). Start with one npm delivery path
and keep a future registry generated from the same source, rather than a second
component implementation. Those documents refine the proposal below.

Start with one ESM React package, with root, per-component, theme and CSS
subpaths. The selected package name is the unscoped `unlikely-ui`, subject to
npm accepting the first publication. Keep tokens in
the same versioned package, with the implemented CSS-only `tokens.css` subpath.
A separate tokens package is useful only when an actual
independent consumer needs independent releases.

React and React DOM should be peer dependencies. Base UI should be a regular
runtime dependency. Publish compiled ESM, declarations and plain CSS; leave
Tailwind, Vite, fonts, icons and the gallery out of consumer requirements.
Tailwind is a library build dependency for the proposed precompiled-CSS
distribution. Mark CSS files as package side effects so bundlers retain
explicit style imports.
Declare the React versions actually validated in consumer projects rather than
promising a broad untested range. Keep product-specific calendars, dashboards
and business logic in the consuming projects.

For separate pet-project repositories, use the selected unscoped public npm
package `unlikely-ui`. The owner chose this name on 2026-10-20 and selected MIT
for package code/documentation. Local tarballs
are useful before publishing and for testing the exact package contents.
Use workspace dependencies only when projects actually share a workspace.
Git dependencies and permanent symlinks are less useful as the normal release
path because built output and reproducibility need additional care. A source
registry or copy-and-paste model is useful for heavy per-app customization,
but copied components stop receiving central fixes automatically; use it only
if that ownership tradeoff is intentional. Keep shared components in the
package and compose product-specific wrappers in each app by default.

Example for alpha.2:

```sh
pnpm add -E unlikely-ui@0.1.0-alpha.2
```

```tsx
import { Theme, Button } from 'unlikely-ui';
import 'unlikely-ui/styles.css';

export function App() {
  return (
    <Theme appearance="dark">
      <Button variant="primary">Create project</Button>
    </Theme>
  );
}
```

Theme and Button are alpha preview implementations in the published alpha.
Import CSS once at the consumer
entry and wrap the appropriate UI in Theme. Implement semantic overrides
through Theme's `tokens` prop so customization also reaches portals.
Pin exact versions while iterating, commit lockfiles, and upgrade each project
deliberately after checking its critical screens. Test changes in one pilot
project, then a second different product before calling the API stable.

## Versioning proposal

Use alpha and beta as specific readiness signals, not indefinite labels:

- `0.1.0-alpha.1`: the first integrated reference implementation; naming,
  components and visual contracts may still change. Publish under `next`.
- `0.1.0-beta.1`: the initial token contract and selected component APIs are
  settled; validate adoption, accessibility and packaging. Publish under `beta`.
- `0.1.0`: the first regular release on `latest`; document the 0.x policy.
- `1.0.0`: the supported public contract is used successfully in two pet
  projects, with migrations, accessibility checks and predictable packaging.
  A small dependable component set is enough; a huge catalogue is unnecessary.

Before 1.0, adopt an explicit project convention: breaking changes increment
the minor version (0.1 → 0.2), compatible additions/fixes increment patch, with
additions identified in the changelog. SemVer itself makes no stability promise
for 0.x. After 1.0, use patch for compatible fixes, minor for compatible additions
and deprecations, major for incompatible changes.

The public contract includes exports, props, event behavior, semantic token
names/meaning, theme/portal behavior and supported platform versions. Treat
visual changes explicitly: a correction to a documented value can be a patch;
a compatible optional variant can be minor; a default redesign or a change
to layout/density/meaning that requires consumer work deserves a major release.
Document screenshot-relevant changes even when the TypeScript API is unchanged.
Do not require a major for every tiny pixel correction.

Prerelease suffixes and registry tags are different mechanisms. A suffix does
not choose a tag automatically: set `--tag next` or `--tag beta` explicitly
when publishing prereleases, keeping `latest` for regular releases. Pin actual
versions in apps rather than depending on a moving tag. After 1.0, use e.g.
`2.0.0-alpha.1` on `next` for a breaking redesign while 1.x stays on `latest`.

## Current milestone

The runtime has one default sizing system and explicit control sizes. Theme,
Button (including icon sizes), fields, selection controls and overlays are alpha
preview implementations, with compiled ESM/types/CSS, explicit exports, a local
workspace and tarball consumer fixtures. The unscoped package was published as
`0.1.0-alpha.1` on 2026-10-20 with MIT licensing and the `next` tag. npm also
assigned `latest` on this first publication; the release record documents it.
See [implementation](../implementation.md), [showcase](../showcase.md)
and [packaging](../packaging.md) for current scope.
Further releases, registry source installation and Campus migration are separate.

## Primary references checked 2026-10-19

- [Base UI quick start](https://base-ui.com/react/overview/quick-start)
- [Base UI styling and state hooks](https://base-ui.com/react/handbook/styling)
- [Tailwind theme variables and inline aliases](https://tailwindcss.com/docs/theme)
- [Tailwind package source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [StyleX style definitions](https://stylexjs.com/docs/learn/styling-ui/defining-styles/)
- [StyleX variable definitions](https://stylexjs.com/docs/learn/theming/defining-variables/)
- [StyleX compiler setup](https://stylexjs.com/docs/learn/installation/)
- [pnpm add: exact versions, workspace and package sources](https://pnpm.io/cli/add)
- [pnpm publish: dist-tags and access](https://pnpm.io/cli/publish)
- [npm dist-tags](https://docs.npmjs.com/adding-dist-tags-to-packages/)
- [Semantic Versioning 2.0.0](https://semver.org/)
