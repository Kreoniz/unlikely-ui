# Using unlikely ui

This guide is for people and agents adding unlikely ui to an app. The package
uses the unscoped package name `unlikely-ui`. Alpha releases use the `next` tag;
all components are previews. A local tarball supports evaluation of changes
before their next registry release. Repository contributors follow the repository's
`AGENTS.md` instead.

This guide describes alpha.3, including Switch, Tabs, Menu, shadcn-style named
parts and semantic utility mappings. The repository showcase can be newer than
your installed version. Consult the installed component contracts and
[release notes](./CHANGELOG.md) before copying an example. Existing compound
APIs remain compatibility aliases, with intentional differences documented in
[upgrades and validation](#upgrades-and-validation).

## Install and import

```sh
pnpm add -E unlikely-ui@0.1.0-alpha.3
```

For temporary evaluation of later checkout changes, run
`pnpm pack --pack-destination .local/packages` in the library repository, then
install the printed absolute tarball path from your app with `pnpm add -E`.
A lockfile does not distribute that file: other machines and CI need the same
artifact at the referenced path. Use a distinct published version for a shared
app dependency, or make the artifact available at a stable shared path.

Commit the app's lockfile with a reproducible dependency source.
React and React DOM are peers, currently `^19.3.1`
(fixtures use 19.3.1). Check the installed `package.json` when upgrading.
The package is ESM only; consumers do not need mise, pnpm, or the build tools
at runtime. Its code and documentation are MIT licensed; retain the included
license when redistributing them. See [release notes](./CHANGELOG.md).

```tsx
import { Button } from 'unlikely-ui/button';
import { Theme } from 'unlikely-ui/theme';
import 'unlikely-ui/styles.css';

export function App() {
  return (
    <Theme appearance="light">
      <Button onClick={() => console.log('Created')}>Create project</Button>
    </Theme>
  );
}
```

Import the stylesheet once at the app's stylesheet or entry boundary. Default
styles are precompiled: Tailwind is optional for consumers. The package does
not install a reset, request fonts, or supply a mascot or icon library. Prefer
documented component subpaths; root exports are also available. Do not import
private `dist/` paths or copy package internals into the app.

## Tailwind and styling

For an app using Tailwind v4, put this order in its CSS entry:

```css
@layer theme, base, ui-theme, ui-base, ui-utilities, components, utilities;
@import 'tailwindcss';
@import 'unlikely-ui/styles.css';
@import 'unlikely-ui/tailwind.css';
```

Import that CSS entry from the app instead of importing the library stylesheet
again in JavaScript. The app's utilities can override supported properties
through `className`; class-string order does not determine CSS precedence.
The library's utility names use the `ui:` prefix. The optional
`unlikely-ui/tailwind.css` adapter exposes semantic utilities to a Tailwind v4
build; it does not replace the runtime stylesheet.

Use semantic `Theme.tokens` overrides for a shared visual change. A change to
an action color should cover its fill, hover, pressed, foreground, border and
focus roles together and be checked for contrast. Private palette references
are not supported theme overrides.

## Keeping multiple apps consistent

Use the same pinned unlikely ui release for shared controls and foundations.
The package owns control appearance, sizes, focus treatment and component
composition. Apps own page layout, product workflows, data and business state.
Headless primitives supply behavior; tokens supply values; styled components
apply those decisions consistently. Tokens alone do not standardize markup,
control spacing, loading or disabled states.

With the Tailwind adapter above, use semantic utilities for app surfaces:

```tsx
<Theme
  appearance="light"
  className="min-h-dvh bg-background text-foreground font-sans"
>
  <main className="mx-auto max-w-5xl p-6">
    <section className="rounded-md border border-border bg-card p-6 text-card-foreground">
      <h1 className="text-xl font-semibold">Projects</h1>
      <p className="text-muted-foreground">Your team's current work.</p>
      <Button>Create project</Button>
    </section>
  </main>
</Theme>
```

`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`,
`accent`, `destructive`, `border`, `input` and `ring` resolve from the shared
semantic roles inside each Theme. `primary` is the mint action family; `accent`
is selection/highlighting. Keep category, selection and status roles distinct.
Chart and sidebar palettes are not implicitly supplied. Override canonical
`--u-*` roles through `Theme.tokens` so nested themes and portals receive them.
The app owns any `dark:` variant configuration; shared controls use semantic
tokens and do not require a global `.dark` class.

Prefer shared variants to per-screen restyling of buttons and inputs. If several
apps need the same new treatment, add it once here. Keep one-off product
compositions in the app. Load the chosen fonts in each app if exact typography
is required; the package uses system fallbacks and never downloads fonts.

### App-level visual language

The local app studies use this starting contract. It is a reference for owner
feedback, not a requirement that every product share a layout:

- Wrap the app in Theme. Use canvas for the page, surface for ordinary panels,
  and raised surfaces for overlays. Use soft dividers for structure and the
  stronger line role where a control needs identification.
- Load the same chosen font in each app for matching typography. The showcase
  loads Inter separately; the app studies additionally load Manrope for display
  text through a scoped `--u-font-display` override. Use the small type role (14/20) for ordinary controls
  and lists, body (16/24) for longer reading, and caption (12/16) for metadata.
  Use the heading roles for page and section hierarchy; keep one visible h1.
- Use the spacing scale: 8–12px within compact groups, 16–24px within sections,
  and 32–40px between major areas. Start with a bounded content width around
  70rem and 16px phone gutters; reflow columns before content becomes cramped.
- Keep default control sizes, radii, focus and motion. Reserve mint action
  emphasis for the current primary action. Selection, categories and statuses
  retain their separate roles; text must also explain their meaning.
- Use simple currentColor icons with consistent size/stroke. Icon-only actions
  need names. Artwork and expressive controls are optional product choices.
- Show current state: empty content offers a next action, errors retain drafts
  and offer recovery, pending actions prevent duplicates, and later edits
  replace stale saved feedback with a visible unsaved indicator.

App-owned CSS can arrange shared controls and style semantic HTML with tokens.
Use public className/style/variant props for customization. Avoid depending on
private descendant markup or overriding shared button/input internals per app.
Review long strings, both themes and narrow layouts with the actual content.

Plain CSS uses the same tokens; Tailwind is optional:

```css
.app-shell {
  min-height: 100svh;
  background: var(--u-canvas);
  color: var(--u-ink);
  font: var(--u-type-small-size) / var(--u-type-small-leading) var(--u-font);
}
.app-content {
  max-width: 70rem;
  margin-inline: auto;
  padding: var(--u-space-6) var(--u-space-4);
}
.app-section {
  padding: var(--u-space-6);
  border: 1px solid var(--u-line-soft);
  border-radius: var(--u-panel-radius);
  background: var(--u-surface);
}
.app-help {
  color: var(--u-muted);
}
```

Apply app-shell to Theme and app-content to your main. Useful roles are canvas
(page), surface (panel), surface-raised (overlay), ink (text), muted (supporting
text), line-soft (divider), line (control boundary) and selection/selection-ink
(selected item). Prefix each with `--u-`. The installed `unlikely-ui/tokens.css`
contains all value names; ThemeToken declarations expose the typed override
names. Your app owns its reset and font loading.

### Motion

Shared controls own press, selection and popup transitions. Alpha.3 adds a
1px button press movement when motion is allowed. Apps own choreography such as
row entry, filtering and save feedback, using `--u-duration-fast`,
`--u-duration-normal`, `--u-duration-slow` and the `--u-ease-*` roles. Keep movement
small and purposeful; update data immediately rather than waiting for animation.
Status text and selected/error states must remain understandable without motion.

Disable app-owned spatial/decorative animation under
`prefers-reduced-motion: reduce`. Preserve input, focus and recovery; an async
response must not pull focus back after the user has moved elsewhere. Theme
changes may update colors immediately. A screenshot demonstrates appearance;
use the live workflow or a recording to judge motion.

## Source ownership and distribution

For apps that should stay uniform, consume the npm package. The shared library
owns its adapted shadcn source once; upgrading the app's dependency distributes
reviewed fixes and visual changes. Shadcn source ownership does not require a
separate editable copy in every app. Customizing copies independently also
makes upstream fixes a per-app responsibility.

Use app-owned source for product-specific compositions. A future source registry
can support consumers who intentionally need to change component internals;
it is not implemented and is not the default update path. Both delivery modes
must use the same component implementation. Shadcn's CLI is tooling, rather
than a runtime dependency that upgrades copied controls automatically.

## Themes and portals

`Theme` controls `appearance="light" | "dark"`, optional `dir="ltr" | "rtl"`,
HTML `lang`, and typed semantic token overrides. Nested themes inherit unspecified settings
and merge `tokens` with their parent.

```tsx
<Theme appearance="dark" tokens={{ '--u-radius': '12px' }}>
  <AppContent />
</Theme>
```

Dialog, Popover, Tooltip, Select and Combobox `Content`, plus Toast `Viewport`,
already include a portal and restore the originating theme there. Do not wrap
them in a second portal. Configure their `portalProps` or `positionerProps`
where available. For an app-owned React portal, place an empty `Theme` inside
the portal to restore its originating React theme context.

Use `tokens` for overrides that must reach portals. Ordinary ancestor CSS and
a Theme wrapper's `style` are not copied into portal scopes. The app owns theme
choice, system-preference resolution and persistence; Theme does not install
global appearance state.

Set `lang` on Theme when a scoped language must reach built-in portals, for
example `<Theme lang="ru">`. Nested `<Theme lang="en">` overrides also reach
their portals. This sets HTML language metadata; apps still translate labels,
choose date/number locales and own the document's language. Ordinary ancestor
HTML attributes are not copied through React context. Use a nested Theme for
language overrides that must survive another portal.

## Compose controls

Use Base UI's `render` composition API. There is no `asChild` prop. For example,
the trigger renders the library Button as a single control:

```tsx
import { Button } from 'unlikely-ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from 'unlikely-ui/dialog';

<Dialog>
  <DialogTrigger render={<Button />}>New project</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create project</DialogTitle>
      <DialogDescription>Add the project details.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

Keep parts under the relevant root. Give dialogs an accessible title,
fields visible labels, and icon-only actions an accessible name. Button sizes
`icon`, `icon-xs`, `icon-sm` and `icon-lg` require `aria-label` or `aria-labelledby`.
Tooltips provide supplementary descriptions; the action still needs its own
name. Apps supply icons. Use `Field`, `FieldLabel`, `FieldDescription`
and `FieldError` with Input/Textarea for associated field text and errors.

New code should use the named parts (`Field`, `FieldLabel`, `FieldDescription`,
`FieldError`) and callable roots (`Dialog`, `Select`, `Card`, `Tabs`, etc.).
The original `Dialog.Root` / `Dialog.Content` and similar compound properties
remain aliases for existing consumers. `Menu` also has the standard
`unlikely-ui/dropdown-menu` import path with `DropdownMenu` and named parts.
Use `buttonVariants()` on a native `<a>` for button-styled links, preserving
native link semantics. The legacy Button `render={<a>}` composition remains
supported, but new examples use the native-link helper.

Compatibility is intentionally bounded: Field retains Base UI validation,
Tooltip retains its configured delay on every hover, and overlays restore
scoped themes. A third-party block may also require additional components,
dependencies or adaptation; matching export names is not a blanket promise
that every shadcn block is interchangeable.

Use controlled values with the corresponding change callback, or uncontrolled
`defaultValue`/`defaultChecked` props as supported by the component. Do not add
parallel state around a controlled component. Match the component's actual
events rather than assuming every control emits a native change event.

## App-owned behavior

The app owns validation policy, requests, debouncing, routing, product copy and
business state. Combobox can display externally filtered results with
`filter={null}`; requests and stale-response handling remain in the app.
Mount a Toast Provider and Viewport within the intended Theme, then call
`Toast.useToastManager()` from descendants. Keep important information
available without hovering or opening a notification.

Calendar and DatePicker handle local calendar dates, not schedule comparisons
or timezone conversion. Supply `today` for deterministic server rendering or
the app's timezone policy. DatePicker's controlled `value={null}` clears its
selection; its selection callback emits a Date. Do not use UTC ISO slicing to
serialize local dates unless that is the app's intended date policy.

## Inspect types and component contracts

Read the [component contracts](./docs/components.md) before changing interaction
or composition. Public TypeScript declarations ship with every component
subpath. Import exported prop types for wrapper components and use editor
completion or Go to Definition for inherited APIs:

```tsx
import type { ButtonProps } from 'unlikely-ui/button';
import type { TooltipTriggerProps } from 'unlikely-ui/tooltip';

const action: ButtonProps = { variant: 'secondary', size: 'default' };
const trigger: TooltipTriggerProps = { delay: 150 };
```

For a non-generic part without a named exported prop type,
`React.ComponentProps<typeof DialogTrigger>` can inspect its props. Prefer
exported generic types where available; extracting props from a generic
component can lose its type parameters. Do not invent variants or copy API
shapes from another component library. The repository showcase additionally
generates searchable API references from the same declarations.

## Upgrades and validation

Migration differences to check before adopting the named API:

- DialogContent and its Dialog.Content source alias now include a dismiss button
  by default. This is an intentional behavior change, not behavioral compatibility.
  Set `showCloseButton={false}` when migrating a dialog that supplies its own
  dismissal controls or policy; recheck tab order and focus return.
- ComboboxInput is a composed control. Combobox.Input is the bare input for
  explicit layouts. Use ComboboxInputProps for the named component and
  ComboboxBareInputProps for that bare surface. Removable ComboboxChip controls
  require a localized value-specific removeLabel; non-removable chips use
  showRemove={false}.
- Switch and ScrollArea include their ordinary parts. Their compound Root
  surfaces remain available for explicit composition. Field retains Base UI
  association/validation and Tooltip retains per-hover timing.
- DropdownMenu currently supplies basic action-menu parts; upstream submenu,
  checkbox/radio menu items and arbitrary blocks are not implied by its name.

This migration establishes naming/composition conventions. Maintenance savings
remain unproven: Base UI already owns the core interaction logic. Review useful
upstream changes here, preserve the local guarantees, and measure actual app
adoption before expanding the compatibility surface or adding a registry.

Keep preview dependencies pinned to an exact version. Alpha/beta identify
maturity; they do not make visual, token or behavior changes harmless. Review
release notes and the app's affected screens before upgrading. An npm upgrade
updates the shared implementation; editing files under `node_modules` is not
a persistent customization strategy. Source installation is not implemented.

After integration, check the app's actual controlled states, labels, keyboard
focus, portal appearance, narrow layouts and relevant light/dark screens. The
library's React SSR/hydration checks do not establish support for every React
framework. Verify framework-specific client boundaries in the consuming app.
