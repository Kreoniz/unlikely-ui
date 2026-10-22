# Component contracts

Status: alpha previews for `0.1.0-alpha.2`, 2026-10-22. All examples require a
`Theme` boundary and one import of `unlikely-ui/styles.css`.
Each component is exported from the root and its matching kebab-case subpath.
For app and agent setup, follow the [consumer guide](../USAGE.md).
ScrollArea is included starting with alpha.2.

## Actions and sizing

Button owns text, text-with-icon, and icon-only actions. Regular sizes are
`sm`, `md` (default), and `lg`. Square sizes are `icon-sm`, `icon`, and `icon-lg`.
An icon size requires `aria-label` or `aria-labelledby` in TypeScript. Icons are
supplied by the app. The separate private IconButton export has been removed.
This follows [shadcn's Button sizing convention](https://ui.shadcn.com/docs/components/base/button).

There are no comfortable/compact theme modes. Theme controls appearance,
direction and tokens; components expose explicit sizes. All small controls
retain at least 44px touch targets on coarse-pointer devices.

## Fields

`Field.Root`, `Field.Label`, `Field.Description` and `Field.Error` wrap the
corresponding Base UI parts. `Field.Control`, `Field.Item` and `Field.Validity`
are available for composition; Control is unstyled. Use `Input` or `Textarea`
for the default styled text controls. Labels, descriptions and visible errors
are associated with the control through Base UI.

```tsx
import { Field } from 'unlikely-ui/field';
import { Input } from 'unlikely-ui/input';

<Field.Root name="email" validationMode="onBlur">
  <Field.Label>Email address</Field.Label>
  <Input type="email" required autoComplete="email" />
  <Field.Description>Used for project invitations.</Field.Description>
  <Field.Error match="valueMissing">Enter your email address.</Field.Error>
  <Field.Error match="typeMismatch">Enter a valid email address.</Field.Error>
</Field.Root>;
```

Base UI owns field state and validation timing. Its blur validation defers a
required error while an empty field remains pristine. The showcase demonstrates
this behavior and errors after editing. An app can instead supply
`invalid` on Root and `match={true}` on Error for externally managed validation.
The library supplies no form-state framework or business validation.

Input preserves Base UI's `render`, state-aware `className`/`style`, events,
refs, and controlled/uncontrolled conventions. Its `size` is `sm | md | lg`;
`md` is the 40px default, with `sm` and `lg` selecting 32px and 48px heights.
It replaces the native numeric input `size` attribute.

Textarea renders a native `<textarea>` through `Field.Control`, retaining field
associations and validation. It accepts native textarea props/events and an
`HTMLTextAreaElement` ref, plus `onValueChange`, state-aware `className`/`style`
and the same visual sizes as Input. It defaults to four rows and vertical
resizing. Controlled values use `value` with `onValueChange` or native
`onChange`; uncontrolled values use `defaultValue`.

Disabled controls cannot receive input. Read-only controls remain focusable and
selectable. Invalid state changes the identifying border and must have an error
message when needed. Coarse-pointer controls retain at least 44px height and
16px editable text, including small controls.

## Overlays

Dialog and Popover expose `Root`, `Trigger`, `Content`, `Title`, `Description`
and `Close`. Root, Trigger and Close retain the Base UI APIs, including
controlled/uncontrolled state and `render` composition. Content forwards popup
props such as refs, state-aware classes, `initialFocus` and `finalFocus`.

Content is a styled composition: it includes the Base UI portal, a restoring
Theme boundary, and the positioning parts. Dialog also includes its backdrop
and scrollable viewport. Consumers do not add another portal around Content.
Use `portalProps` to set the container or `keepMounted`. Popover additionally
accepts `positionerProps` for side, alignment, offsets and collision options.
Base UI owns positioning, focus, dismissal and scroll locking.

Popover positioners default to `positionMethod="fixed"`. This prevents the
document from jumping when focus enters a popup portaled after the app content.
The regression check verifies both scroll position and input focus. Callers can
still override positioning through `positionerProps` for a specific container.

Dialog, Popover, Tooltip and Select use token-based entry/exit transitions.
Positioned popups scale and fade from the anchor; dialogs fade and move slightly.
Base UI controls the closing mount phase. Reduced motion disables transitions.

```tsx
import { Dialog } from 'unlikely-ui/dialog';
import { Button } from 'unlikely-ui/button';

<Dialog.Root>
  <Dialog.Trigger render={<Button />}>New project</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Create project</Dialog.Title>
    <Dialog.Description>Add project details.</Dialog.Description>
    {/* Fields and application-owned submit behavior */}
    <Dialog.Close render={<Button variant="secondary" />}>Cancel</Dialog.Close>
  </Dialog.Content>
</Dialog.Root>;
```

Supply an accessible title and a concise description when relevant. Keep an
explicit close/cancel action reachable on touch screens. Dialog scrolls within
the available viewport. Popover uses available positioning space and scrolls
when necessary. The shared layer tokens allow a popover above a dialog.

Content inherits appearance, direction and `Theme.tokens` overrides
from its originating React tree. Ordinary ancestor CSS and `style` overrides
are not transferred automatically. Importing an overlay does not set the app's
global theme. A custom portal still needs its own empty Theme boundary.

## Tooltip

Tooltip exposes `Provider`, `Root`, `Trigger` and `Content`. Keep Trigger and
Content under the same Root. Content accepts `portalProps` and
`positionerProps` and restores the originating theme. Base UI supplies hover,
keyboard, delay and dismissal behavior. The wrapper adds `role="tooltip"` and
an `aria-describedby` relationship while open, preserving existing trigger
descriptions. Set an optional `id` on Root to choose the description ID.
The built-in Base UI Arrow follows the resolved popup side and anchor position,
including collision-driven changes. It is decorative and hidden from assistive
technology.

The default hover delay is 300ms, including without a Provider. Provider's
`delay` configures its descendants; Trigger's `delay` overrides it. Every hover
uses the configured delay, including repeated hovers and movement between
triggers. Provider shares configuration without Base UI's instant-open group
phase. Keyboard focus opens immediately. `closeDelay` defaults to 0 and can be
set on Provider or overridden on Trigger. Provider does not accept `timeout`;
there is no group warmup period. Base UI retains hoverable popup behavior and
Escape dismissal.
The shorter hover delay follows the quick end of
[NN/g's 300–500ms hover-intent guidance](https://www.nngroup.com/articles/timing-exposing-content/).
This is a chosen library default, not an accessibility timing requirement.

```tsx
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger render={<Button size="icon" aria-label="Add project" />}>
      <PlusIcon />
    </Tooltip.Trigger>
    <Tooltip.Content>Create a new project</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

Tooltip text is supplementary. Icons still require accessible names; essential
information and actions must remain available without hover. Native disabled
buttons cannot be keyboard triggers. The showcase includes an explicitly
disabled Tooltip Root and disabled action; it does not add a focusable wrapper
around an unavailable action.

## Selection controls

Select exposes `Root`, `Trigger`, `Value`, `Content`, `Item`, `Group` and
`GroupLabel`. Root retains Base UI's value, events and form integration. Pass
`items` to map values to display labels. Content includes the themed portal,
positioner and scrollable list; it supports `portalProps` and `positionerProps`.
The default popup opens below its trigger (`alignItemWithTrigger={false}`).
Trigger accepts `sm | md | lg`, disabled and invalid states through Field.
Use Field.Label to name the select.

RadioGroup exposes `Root` and `Item`. Root preserves Base UI's controlled and
uncontrolled state, arrow-key interaction, name and form props. Give the group
an accessible name and label each item. When composing a group inside Field.Root, wrap each labeled item with
Field.Item so its label and control retain independent IDs. Outside Field,
a normal wrapping label is sufficient.

Checkbox preserves Base UI's checked/defaultChecked, onCheckedChange, required,
disabled, read-only, indeterminate and form props. Label it with a wrapping
label or an explicit accessible name. Mixed state has its own dash indicator.

```tsx
<RadioGroup.Root aria-label="Schedule" defaultValue="weekly">
  <label><RadioGroup.Item value="daily" />Daily</label>
  <label><RadioGroup.Item value="weekly" />Weekly</label>
</RadioGroup.Root>

<label><Checkbox name="updates" />Email updates</label>
```

The playground uses Select to choose Button variants, RadioGroup to choose sizes,
and Checkbox for disabled/loading toggles. Examples also cover keyboard use,
native form values, disabled items, mixed state and field errors.

## Checked integration

The gallery covers keyboard form completion, field descriptions/errors,
disabled/read-only controls, dialog focus containment and return, a popover
inside a dialog, tooltip descriptions, nested themes and RTL, and narrow layouts
from 320px to desktop. Short-screen touch checks exercise the dialog at 320×568.
Representative pages and open overlays pass axe in both appearances.

The packed fixture imports all new subpaths and checks declarations, server
rendering, hydration, controlled fields, nested overlays and style isolation
with and without consumer Tailwind. These are the tested browser cases, not a
complete assistive-technology or physical-device audit. The package name and MIT
license are selected; publication remains a separate step.

## Private API changes in this iteration

Imports now use `unlikely-ui/*`. Replace the former personal-scope imports.
Replace IconButton with Button using `size="icon"`, `icon-sm`, or `icon-lg`,
retaining its accessible name and choosing its variant explicitly. Remove
Theme's density prop; use explicit sizes when a small or large control is needed.
Separator has been removed. Use CSS borders for decorative divisions and native
`hr` for a thematic break in content.
These changes affect private previews; no published release has been replaced.

## Typed reference

Every component's showcase page includes a generated API reference at
`#components/<component>/api`. It covers public compound parts, props and
inherited attributes, declared defaults, exported types and callable helpers.
The tables are generated from source TypeScript and JSDoc; the behavior
contracts in this document remain hand-written. The repository's
`docs/showcase.md` describes the generation workflow. Installed consumers can
inspect the declarations described in the [consumer guide](../USAGE.md#inspect-types-and-component-contracts).

## Choosing components

Keep behavior and repeated visual contracts in the library. Dialog, Popover,
Combobox and selection controls provide keyboard/focus/theme integration that
each app would otherwise have to repeat. Card and Badge provide shared
presentation styles. Use CSS borders for ordinary layout edges and native `hr`
for thematic breaks in content.
There is no requirement to turn every layout element into a component.

Prioritize Switch for boolean settings, Tabs for views with associated panels,
and Menu for contextual actions when those uses arise. Full schedule views,
group assignment and empty-state copy stay with the consuming app or a recipe.
PhysicalButton belongs to the expressive set requested for playful surfaces.

## Scroll area

`ScrollArea` is exported from `unlikely-ui/scroll-area` and the
root entry. It composes Base UI Scroll Area without an additional dependency.
The viewport uses native scrolling: wheel, trackpad, touch momentum and keyboard
navigation retain browser behavior. Only the scrollbar presentation is custom.

```tsx
import { ScrollArea } from 'unlikely-ui/scroll-area';

<ScrollArea.Root style={{ height: 240 }}>
  <ScrollArea.Viewport role="region" aria-label="Resources">
    <ScrollArea.Content>{/* Long content */}</ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar />
</ScrollArea.Root>;
```

The compound parts preserve Base UI props, state-based class/style callbacks,
render composition and refs. Put a bounded size on Root, an accessible name and
optional region role on Viewport, and content inside Content so geometry updates
when it changes. Put scroll handlers and the programmatic scrolling ref on
Viewport, not Root. Base UI makes overflowing viewports keyboard reachable and
removes non-overflowing ones from the tab order.

Scrollbar includes a styled Thumb by default; optional children can provide a
custom `ScrollArea.Thumb`. Its orientation defaults to vertical. For both axes,
add a second Scrollbar with `orientation="horizontal"` and a `ScrollArea.Corner`.
Bars mount when that axis overflows; inherited `keepMounted` remains available.
Content reserves a small end gutter so the overlaid tracks do not cover text;
its padding can be overridden for custom layouts. Coarse pointers have wider
tracks while keeping the visible thumb thin.

Use contained scroll areas for panels, sidebars, code and wide tables. Give
content enough space around focusable controls and avoid unnecessary nested
scrolling. Leave touch and wheel scrolling native; do not intercept gestures or
enable smooth scrolling globally. The default thumb is always visible when an
axis overflows, darkens on hover/focus/scroll, follows semantic theme tokens and
has a forced-colors outline. In reduced motion the color transition is disabled
by the shared duration tokens. The document itself can retain its native
scrollbar rather than introducing a full-page nested viewport.

Implementation references: [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area)
and [shadcn Scroll Area](https://ui.shadcn.com/docs/components/base/scroll-area).

## Physical button

`PhysicalButton` is exported from `unlikely-ui/physical-button` and the root.
It composes Base UI Button with a decorative housing, plate, bezel and cap.
It keeps native button props, refs, disabled behavior, form submission and
state-aware className/style. Its geometry is a distinct composition, so the
regular Button's everyday variants stay small.

```tsx
import { PhysicalButton } from 'unlikely-ui/physical-button';

<PhysicalButton
  size="md"
  shape="round"
  pattern="hazard"
  depth="high"
  onClick={handleAction}
>
  Push
</PhysicalButton>;
```

Sizes sm/md/lg have nominal widths 144/192/240px and fit within their container.
Shape is round or square and applies to the entire assembly, including housing,
plate, bezel and cap. Round is the default, with a circular base and a domed cap
viewed from a lower, front-facing angle, level from left to right.
Plate pattern is hazard or plain, and depth is
low/medium/high. The cap depresses while activated and returns on release;
reduced motion removes transitions while preserving the pressed appearance.
An app can supply aria-pressed for a persistent toggle state. No sound,
vibration, application action or timers are installed by the component.

The optional `indicator` prop adds a recessed light to the front of the casing.
It follows `aria-pressed="true"` for toggles; without aria-pressed it lights
only while the button is held. Disabled buttons retain the displayed toggle
state without accepting activation. The light is decorative: the app supplies
the accessible name, aria-pressed state and any visible On/Off text. It adds no
independent toggle state or status announcement. Reduced motion also removes
the light's fade.

`colors` accepts cap, capText, casing, plate, stripe and indicator as CSS colors, including
semantic variable references. For example:

```tsx
<PhysicalButton
  pattern="plain"
  indicator
  colors={{ cap: 'var(--u-accent)', capText: 'var(--u-accent-ink)' }}
  aria-label="Power"
  aria-pressed={powered}
  onClick={() => setPowered((value) => !value)}
>
  <PowerIcon aria-hidden="true" />
</PhysicalButton>
```

The defaults come from the six `--u-physical-*` Theme tokens; colors overrides
apply locally, and style remains available for normal consumer overrides.
Keep visible labels short, give icon-only buttons an accessible name, and
check contrast when choosing custom colors. The default red cap is a material
choice, not destructive-action semantics. Hazard stripes are decorative.

Visual references reviewed 2026-10-19: [Adafruit's domed arcade button](https://www.adafruit.com/product/1185)
for the cap and retaining ring; [EAO Series 45](https://www.eao.com/en/series/45/series-45)
for the recessed bezel and distinct indication. The CSS uses layered highlights,
concentric bezel grooves and a small front lamp; it includes no third-party images.

## Search and segmented selection

Combobox exposes Base UI's generic Root, Input, InputGroup, Trigger, Clear,
Content, List, Item, Group, GroupLabel, Status, Empty, and useFilter. Content
includes a themed fixed positioner and animated popup. Input accepts the same
visual sizes as Input. Root keeps controlled/uncontrolled query/value APIs,
object equality/stringification, filtering and form integration.

Keep Field.Label, Field.Description and Combobox under the same Field.Root
to associate the label and help text. An explicit aria-label also works.
Pass `items` and render List's item callback. For externally filtered
results use `filter={null}`. Requests, debouncing and stale-response cancellation
belong to the app. The showcase simulates them without a network dependency.
Keep Status and Empty mounted and conditionally change their children; Base UI
uses those parts for live announcements. Do not announce an empty result while
loading or showing an error.

RadioGroup.Root accepts `variant="segmented"`. Put text inside each Item and
name the group. It retains radio selection and arrow keys; it is appropriate
for filters in one view. Tabs with separate panels require a different contract.

## Calendar and date picker

Calendar wraps React DayPicker's single-date mode. It accepts `selected` and
`onSelect`, controlled or default month, disabled/hidden date matchers, locale,
month bounds and labeling options. Weeks start Monday and display six weeks
with outside days by default. `highlightWeek` adds a visual highlight around the
selected date's week; the actual selection remains one date. Caller-provided
classNames/modifiers may extend the presentation. Multiple/range selection and
a scheduling grid are outside this wrapper's contract.

Selected dates retain accent ink and their selection outline on hover, using
the accent hover fill in both appearances and inside DatePicker popups.

`ru` and `enUS` are exported from `unlikely-ui/calendar`. Other DayPicker locales
can be supplied by apps that depend on that package. Calendar's default labels
are English; DatePicker's label, placeholder and Today text are app-supplied.

```tsx
import { DatePicker } from 'unlikely-ui/date-picker';
import { ru } from 'unlikely-ui/calendar';

<DatePicker
  label="Дата расписания"
  value={date}
  onValueChange={setDate}
  locale={ru}
  todayLabel="Сегодня"
  highlightWeek
/>;
```

DatePicker requires `label` for its trigger and popup. It accepts controlled
`value` (`null` clears selection), or uncontrolled `defaultValue`, and emits a
Date on selection. Clicking the selected date retains it and closes the popup.
Opening focuses the selected date; selecting or dismissing returns trigger
focus. Today respects disabled/hidden matchers. Use calendarProps for calendar
options and triggerProps for native trigger attributes/ref/className.

Dates represent local calendar dates. Apps own the effective today, timezone
conversion and URL serialization; supply `today` for a deterministic server
render or a timezone-specific product. Do not serialize a local date through
UTC ISO slicing unless that is the application's intentional date policy.
The library does not calculate free periods, academic weeks or event overlaps.

## Notifications and loading

Toast exposes Base UI's Provider, useToastManager, createToastManager and a
styled Viewport. Mount one Viewport under the intended Theme and Provider.
Viewport restores theme settings in its portal; closeLabel localizes dismissal.

```tsx
<Toast.Provider timeout={4500} limit={3}>
  <App />
  <Toast.Viewport closeLabel="Dismiss notification" />
</Toast.Provider>;
// In App:
const toast = Toast.useToastManager();
toast.add({ title: 'Link copied', type: 'success' });
```

Use neutral/success/warning/danger/info types for the matching tone. Base UI
owns queue limits, timers, hover/focus pausing, announcements and swipe dismissal.
`timeout: 0` persists until dismissed; `actionProps` adds an action;
`priority: 'high'` requests urgent announcement. Reserve urgent announcements
for important changes. F6 focuses the notification area; Tab reaches its
controls, and Escape dismisses the focused toast. Toasts overlap by default,
with the newest at the front. Hover, keyboard focus, or a touch tap expands the
stack into individually accessible cards. Content behind the front card is
hidden until expansion. Gaps between expanded cards retain pointer interaction;
swipe and dismissal transitions respect reduced motion.
This follows the stacking pattern in [shadcn's Base UI Toast](https://ui.shadcn.com/docs/components/base/toast),
using [Base UI's measured stack variables](https://base-ui.com/react/components/toast#stacking-and-animations).

Spinner accepts sizes sm/md/lg and a label (default Loading). It renders a named
status; `label={null}` makes it decorative when nearby text already announces
progress. Skeleton is always decorative. Put aria-busy and a meaningful loading
message on the region containing placeholders. Both stop animation when reduced
motion is requested.

## Presentation and recipes

Badge accepts a status tone or a category number 1–6, with category taking visual
precedence. Retain descriptive text so color is supplementary. Category-to-group
assignment stays in the app. Alert exposes Root, Title, Description and Actions;
Root defaults to the polite status role, with role="alert" available for urgent
updates. Apps own retry/offline/update behavior.

Card exposes Root, Header, Title (h2), Description (p), Content and Footer with
native props/refs. It covers ordinary panels without another Panel alias.

Alert, Badge, Card, Skeleton and Spinner have presentation-only
subpaths without client directives. The Card showcase contains an empty-state
recipe assembled from Card, text and Button; no EmptyState component is exported.
Illustrations and app-specific copy remain outside the library runtime.
