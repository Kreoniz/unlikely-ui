# unlikely ui: foundations draft

Status: implemented alpha foundations, visual direction under owner review,
2026-10-30. Derived from the mascot and library
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
physical-button reference. The `--u-physical-*` material roles (cap, ink,
casing, plate, stripe, indicator and cream inset) have canonical defaults in tokens.css, independent
of status and brand meanings. They retain their material identity in both
appearances. The optional front indicator is paired with aria-pressed and visible
On/Off text in the toggle example; it is not the sole state cue. Ordinary controls
retain the flat treatment above.

The reference-led Allocation bar experiment uses this same opt-in material
family: mint, cream inset and coral are segment paints, not status meanings.
The cream inset retains its material color in both appearances. Its label and
the mint label join the palette checks; this does not promote the experiment.

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

The 2026-10-30 checkout also exposes shadcn vocabulary inside `.u-theme`:
background/foreground, card, popover, primary, secondary, muted, accent,
destructive, border, input, ring and radius. These are computed aliases to
the canonical `--u-*` roles, not another set of editable palette values.
`primary` maps to the action family; `accent` maps to selection. Each theme
boundary resolves aliases again, including restored portal themes. The optional
Tailwind adapter supplies matching app utilities. Chart/sidebar palette roles
are not inferred from categorical fills. Existing contrast checks still cover
the documented canonical pairings; imported blocks need their own review.

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
  `cubic-bezier(0.4, 0, 1, 1)`. Components disable relevant transitions and
  decorative animation for reduced motion; the three duration tokens resolve
  to 0ms in that preference so app-owned transitions follow it too.
  Ordinary buttons move down 1px while pressed when motion is allowed.
  Avoid spatial travel on ordinary hover. Apps choreograph entry, filtering,
  task completion and save feedback with these tokens; update state immediately
  and retain keyboard focus. Do not delay an action merely to play an animation.
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

The review sheet embeds the display derivative `dev/public/button-logo-small.png` as a data URI
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
Theme inherits appearance, direction, explicit `lang` and `tokens` overrides through React context.
An empty Theme inside a custom portal restores them at its DOM boundary. A popup mounted under body must retain the appearance of
the control that opened it, including nested theme scopes.

## Styling and delivery contract

One implementation uses Base UI, Tailwind CSS v4 utilities and semantic CSS.
The package ships precompiled styles; consuming apps need Tailwind only when
using their own utilities. `unlikely-ui/tailwind.css` is an implemented optional
adapter, including the checkout's unreleased shadcn semantic mappings. Keep
scoped values, complete static class names, utility isolation and the tested
CSS layer order. Class-string order does not determine conflicting precedence.

The npm package owns shared controls and tokens. Apps own fonts, layout,
workflow state and requests; they may use plain CSS or the optional adapter.
Source registry installation remains a possible later delivery path using the
same implementation. It is not implemented. A second styling edition or
compiler integration has no current requirement.

Use the [consumer guide](../../USAGE.md) for working CSS/import examples and
app-level styling, [packaging](../packaging.md) for artifact and cascade contracts,
and [implementation](../implementation.md) for milestone status. Keep release
policy and publication procedures in the [changelog](../../CHANGELOG.md#release-policy)
and [release guide](../releasing.md), rather than duplicating proposals here.
React/React DOM are peers; Base UI is a runtime dependency. Fonts, gallery assets
and build tools are excluded from the runtime package. Local tarballs support
temporary evaluation; an exact published version provides shared distribution.

## App character and motion

The owner's 2026-10-30 feedback rejected the first app studies as too quiet
and static. The revised studies explore stronger display typography, numbered
sections, ledger/document composition and selective depth. This changes
app-owned presentation; ordinary control semantics and canonical palette
values remain shared. The studies load Manrope for display text and Inter for
body text as an explicit app choice, with font overrides passed through Theme
so portals inherit them. This is an experiment awaiting owner feedback, not
proof of cross-app brand recognition.

Use motion to explain a change: a newly added row settles into place, selection
changes visibly, and save/recovery feedback appears without moving the user's
focus. Keep spatial movement small and bounded, using the existing timings.
Honor reduced motion. Preserve immediate data updates, current status text,
focus return and the ability to interrupt or repeat actions. Motion is an
enhancement; status and meaning must remain available without it.

## Current milestone

The runtime has one default sizing system and explicit control sizes. Theme,
Button (including icon sizes), fields, selection controls and overlays are alpha
preview implementations, with compiled ESM/types/CSS, explicit exports, a local
workspace and tarball consumer fixtures. The unscoped package was published as
`0.1.0-alpha.1` on 2026-10-20 with MIT licensing and the `next` tag. npm also
assigned `latest` on this first publication; the release record documents it.
Alpha.2, published on 2026-10-22 under `next`, adds ScrollArea and a toast
measurement fix without changing semantic token values. See
[the alpha.2 record](../release-2026-10-22.md).
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
