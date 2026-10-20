# Packaging and source installation

Status: unscoped `unlikely-ui@0.1.0-alpha.1` release preparation, 2026-10-20.
ESM, types, CSS, explicit exports and tarball consumer checks exist. MIT is the
selected code/documentation license. No package is published; source registry
installation is future work. See [the release workflow](./releasing.md).

## Initial decision

Start with one npm package containing compiled ESM, declarations and CSS.
Keep one component source tree. Add shadcn-compatible source installation later
when editing internals independently in multiple products becomes a real need.
Offer that as an additional adoption mode; existing package consumers need not
switch and should not lose their versioned upgrade path.

The tradeoff is ownership. With packaged adoption, a bug fix is released once
and each product receives it when upgrading. With source adoption, each product
owns its copy and reviews upstream changes against any local modifications.
Source installation is useful for extensive changes to markup, behavior or
internal styling. Theme overrides, documented variants and ordinary composition
can cover many changes while retaining packaged adoption.

An npm install includes the package's tarball. ESM subpath exports and a good
consumer build can keep unused JavaScript out of the application bundle; verify
that result rather than promising universal tree shaking. The initial combined
CSS import includes styles for the shipped component set. Per-component CSS
entry points are a later optimization if measured CSS size warrants them.

Source installation copies requested items plus their required files and
dependencies. It does not eliminate React, Base UI or other declared runtime
dependencies. Installing only a component's source is different from removing
all unused bytes from a bundle.

## npm contract

The owner selected the unscoped name `unlikely-ui`. npm returned E404 for that
name on 2026-10-20; this is not a reservation or a guarantee of acceptance.
Start with ESM only. Do not add CommonJS support without
a real consumer requirement. Implemented exports are:

```text
unlikely-ui             # explicit root exports
unlikely-ui/alert
unlikely-ui/badge
unlikely-ui/button
unlikely-ui/calendar
unlikely-ui/card
unlikely-ui/checkbox
unlikely-ui/combobox
unlikely-ui/date-picker
unlikely-ui/dialog
unlikely-ui/field
unlikely-ui/input
unlikely-ui/physical-button
unlikely-ui/popover
unlikely-ui/radio-group
unlikely-ui/select
unlikely-ui/skeleton
unlikely-ui/spinner
unlikely-ui/textarea
unlikely-ui/theme
unlikely-ui/toast
unlikely-ui/tooltip
unlikely-ui/styles.css  # tokens + compiled component styles
unlikely-ui/tailwind.css # optional utility mapping for consumer use
unlikely-ui/tokens.css  # framework-independent values/scope
```

Partial export-map example; `package.json` is authoritative:

```json
{
  "type": "module",
  "files": [
    "dist",
    "LICENSE",
    "CHANGELOG.md",
    "USAGE.md",
    "docs/components.md"
  ],
  "sideEffects": ["**/*.css"],
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./theme": { "types": "./dist/theme.d.ts", "import": "./dist/theme.js" },
    "./button": {
      "types": "./dist/components/button.d.ts",
      "import": "./dist/components/button.js"
    },
    "./styles.css": "./dist/styles.css",
    "./tokens.css": "./dist/tokens.css",
    "./tailwind.css": "./dist/tailwind.css"
  }
}
```

The actual map grows only when the corresponding output exists. Preserve the
module-level client directives required by interactive React entries. Verify
that supported SSR use does not read the DOM during module evaluation. Avoid
turning every presentational entry into a client boundary through a broad
re-export chain.
Alert, Badge, Card, Skeleton, and Spinner subpaths are presentation
modules without a client directive. The packed check preserves that distinction.

Dependencies:

- React and React DOM: peers, with an initially narrow verified range.
- Base UI: regular runtime dependency, imported through relevant subpaths and
  left external to the library's JS output.
- React DayPicker: runtime dependency for the date grid, localized labels and
  keyboard navigation. Its date-fns dependencies remain external. Calendar and
  DatePicker support single dates; schedule business logic stays in the app.
- Tailwind: build tooling; consumers need it only for their own Tailwind source
  or the optional adapter. The default packaged component styles are compiled.
- Vite, TypeScript, browser test tooling and the gallery: development only.
- Shiki and generated API references: showcase-only. Syntax highlighting and
  TypeScript reflection do not add dependencies or files to the installed runtime.
- Fonts, mascots and a default icon package: outside component runtime imports.
  Consumers supply them. Distribution and licensing for assets are separate.

Use an allowlist for published files and inspect `pnpm pack` contents. The
package is prepared for public npm with MIT, explicit public access, the `next`
tag, and the official registry in `publishConfig`. `prepack` builds clean output;
`prepublishOnly` runs the release checks. Publication still requires an explicit
request. Do not add unverified repository URLs or registry ownership claims.

The tarball includes README, LICENSE, CHANGELOG, `USAGE.md` and
`docs/components.md` for people and agents consuming the package. Local
Markdown links are checked against
the archive contents. Contributor `AGENTS.md`, planning documents, the showcase,
generated API JSON and development assets stay outside the artifact. Keep
repository-only references in README as explicit repository paths rather than
links to files absent from an installation.

Illustrative consumer after a release exists:

```sh
pnpm add -E unlikely-ui@0.1.0-alpha.1
```

```tsx
import { Button } from 'unlikely-ui/button';
import { Theme } from 'unlikely-ui/theme';
import 'unlikely-ui/styles.css';

export function Example() {
  return (
    <Theme appearance="dark">
      <Button variant="primary">Create project</Button>
    </Theme>
  );
}
```

Theme and Button are alpha preview implementations. Import CSS once in the application's
appropriate stylesheet/entry boundary. The CSS-only export contains no React code, but this combined npm package retains its React peer requirements.
Keep apps pinned to exact prerelease versions and commit their lockfiles.

## Tailwind compilation and overrides

The library uses `ui:`-prefixed utilities in `ui-theme`, `ui-base` and
`ui-utilities` layers. Components consume scoped `.u-theme` semantic tokens.
The runtime CSS has no Preflight, fonts or host-wide body rules. The packed
plain-React fixture uses the compiled stylesheet without a Tailwind build.

For an app with its own Tailwind build, declare layer order before imports:

```css
@layer theme, base, ui-theme, ui-base, ui-utilities, components, utilities;
@import 'tailwindcss';
@import 'unlikely-ui/styles.css';
```

The consumer's utilities layer can override allowed properties through
`className`. Prefixing prevents utility-name clashes; layer order establishes
precedence. Class-string order does not. The packed fixture verifies default
styling and a real unprefixed background override.

The optional `tailwind.css` adapter exposes semantic utilities and does not
replace the app's whole theme. Import it in a Tailwind v4 pipeline if needed,
alongside the runtime styles or token CSS.

`Theme` accepts `appearance`, optional `dir` and typed public token
names in `tokens`. Nested scopes inherit unspecified settings and merge token
overrides. An empty `Theme` inside a custom portal restores those React-context
settings to the new DOM scope. Use `tokens` for overrides that must cross portals;
arbitrary ancestor CSS changes and a wrapper's ordinary `style` are not copied.
The app owns theme choice, system-preference resolution and persistence.

`pnpm test:consumer` invokes the clean prepack build, then installs the artifact
offline under `.local/`.
It checks declarations, client directives, a DOM-free server render, hydration,
portal inheritance, native-control isolation without Tailwind and the utility
override above with Tailwind. All implemented components are exercised by the
fixture. A full Next.js/RSC or other framework compatibility claim requires
its own fixture; the current tests establish React SSR/hydration behavior only.
It also verifies the package file allowlist, the included consumer guides and
the local file targets of their Markdown links.

## Later source registry

Shadcn supports custom registries and items declaring source files, npm
dependencies, registry dependencies and CSS/theme setup. Reuse that protocol
and CLI before considering a custom installer. A static registry build is
enough for basic distribution; an authenticated service or registry UI is not
an initial requirement.

Adding this later is a contained delivery project if source boundaries stay
small. It is not only a hosting change. The work includes:

1. Describe items and shared dependencies in registry manifests, using the
   canonical component files as inputs. Share Theme/helpers/tokens as explicit
   items, with one installed copy of each per consumer project.
2. Generate registry payloads from a release revision. Normalize portable import
   paths and the package's Tailwind prefix/build contract as needed. Generate
   transformations rather than maintaining a second component implementation.
3. Supply Tailwind v4 token mappings, theme scope and any required CSS. Copied
   source must be genuinely editable and compile in the target app; referencing
   a precompiled class that cannot be regenerated is not sufficient.
4. Preserve client directives, names, state attributes, relative dependencies
   and explicit runtime package requirements. Adapt destination aliases through
   the registry/consumer configuration rather than assuming `@/components`.
5. Test installation in a clean React/Tailwind app: install Button, then Dialog;
   confirm shared dependencies are not duplicated, both work and a locally
   changed variant can be rebuilt. Cover custom tokens and a nested portal.
6. Document ownership and updates. Use release-pinned registry URLs or repository
   refs where supported. Keep the consumer lockfile and commit the installed
   source. An install can be reviewed with the CLI's dry-run/diff facilities;
   it is not an automatic safe merge of local and upstream edits.

A source installer can be added without changing the existing npm API; component
or token changes made at the same time still follow the normal version policy.
Keep generated registry artifacts tied to the same library release rather than
inventing separate per-component versions at the start.

## What makes a later registry easier

- Components import their actual sibling modules, not the npm root barrel or
  host-app aliases. Examples, routing and product logic stay outside them.
- Tokens, variants and their requirements are explicit. Complete static class
  strings and a deterministic prefix are easier to transform than runtime
  utility construction or an opaque recipe engine.
- Theme has a small explicit contract, including portals. Shared context is
  a known dependency rather than an implicit package-wide singleton.
- Both output paths use the same source and examples. Validate semantic and
  visual parity for generated output before advertising it.

Do not prebuild registry metadata, AST tooling or a generic component generator
now. Keep these boundaries and validate a single source-install proof when
source delivery is actually selected. The cost grows with hidden coupling and
the size of the catalogue; adopting these boundaries now limits that growth.

## Existing consumers changing adoption mode

Adding a delivery path for maintainers and migrating an existing app are
different tasks. A consumer switching from package imports to local source must
install the chosen components and shared dependencies, change import paths,
adjust CSS setup and rerun its important interaction and visual checks.

Take particular care with Theme: two independently instantiated theme contexts
do not automatically share settings. Move a coherent themed subtree together
or explicitly use the same foundation runtime during a mixed transition. A
copied Dialog still needs the same theme/portal contract as its trigger.

After source adoption, an npm component upgrade no longer updates those copied
files. Dependency upgrades may still affect them. Document upstream changes
and merge them intentionally; do not promise an automatic switch back after
local edits have diverged.

## Release policy

Follow [the changelog's alpha/beta and 0.x policy](../CHANGELOG.md#release-policy). The first
alpha follows M2's verified vertical slice; beta follows API and token settling
plus real adoption feedback. A source registry does not need to exist for 1.0.
Publish prereleases with explicit `next` or `beta` tags, never accidentally as
`latest`. The prepared first release is `0.1.0-alpha.1`; `0.1.0-alpha.0` was
unpublished development metadata. All components remain previews.

## Primary references checked 2026-10-19

- [Shadcn registry overview](https://ui.shadcn.com/docs/registry)
- [Building a registry](https://ui.shadcn.com/docs/registry/getting-started)
- [Registry item schema](https://ui.shadcn.com/docs/registry/registry-item-json)
- [Shadcn add, dry-run and diff](https://ui.shadcn.com/docs/cli)
- [Node package subpath exports](https://nodejs.org/api/packages.html#subpath-exports)
- [React client boundaries](https://react.dev/reference/rsc/use-client)
- [Tailwind utility prefixes](https://tailwindcss.com/docs/styling-with-utility-classes#using-the-prefix-option)
