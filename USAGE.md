# Using unlikely ui

This guide is for people and agents adding unlikely ui to an app. The package
uses the unscoped package name `unlikely-ui`. Alpha releases use the `next` tag;
all components are previews. A local tarball supports integration before a
registry release exists. Repository contributors follow the repository's
`AGENTS.md` instead.

## Install and import

Install the chosen tarball with pnpm, or pin an exact version after publication:

```sh
pnpm add -E unlikely-ui@0.1.0-alpha.1
```

Commit the app's lockfile. React and React DOM are peers, currently `^19.3.1`
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

## Themes and portals

`Theme` controls `appearance="light" | "dark"`, optional `dir="ltr" | "rtl"`
and typed semantic token overrides. Nested themes inherit unspecified settings
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

## Compose controls

Use Base UI's `render` composition API. There is no `asChild` prop. For example,
the trigger renders the library Button as a single control:

```tsx
import { Button } from 'unlikely-ui/button';
import { Dialog } from 'unlikely-ui/dialog';

<Dialog.Root>
  <Dialog.Trigger render={<Button />}>New project</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Create project</Dialog.Title>
    <Dialog.Description>Add the project details.</Dialog.Description>
    <Dialog.Close render={<Button variant="secondary" />}>Cancel</Dialog.Close>
  </Dialog.Content>
</Dialog.Root>;
```

Keep compound parts under the relevant Root. Give dialogs an accessible title,
fields visible labels, and icon-only actions an accessible name. Button sizes
`icon`, `icon-sm` and `icon-lg` require `aria-label` or `aria-labelledby`.
Tooltips provide supplementary descriptions; the action still needs its own
name. Apps supply icons. Use `Field.Root`, `Field.Label`, `Field.Description`
and `Field.Error` with Input/Textarea for associated field text and errors.

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

const action: ButtonProps = { variant: 'secondary', size: 'md' };
const trigger: TooltipTriggerProps = { delay: 150 };
```

For a non-generic part without a named exported prop type,
`React.ComponentProps<typeof Dialog.Trigger>` can inspect its props. Prefer
exported generic types where available; extracting props from a generic
component can lose its type parameters. Do not invent variants or copy API
shapes from another component library. The repository showcase additionally
generates searchable API references from the same declarations.

## Upgrades and validation

Keep preview dependencies pinned to an exact version. Alpha/beta identify
maturity; they do not make visual, token or behavior changes harmless. Review
release notes and the app's affected screens before upgrading. An npm upgrade
updates the shared implementation; editing files under `node_modules` is not
a persistent customization strategy. Source installation is not implemented.

After integration, check the app's actual controlled states, labels, keyboard
focus, portal appearance, narrow layouts and relevant light/dark screens. The
library's React SSR/hydration checks do not establish support for every React
framework. Verify framework-specific client boundaries in the consuming app.
