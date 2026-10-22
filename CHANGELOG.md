# Changelog

## 0.1.0-alpha.2 — 2026-10-22

- Add a public GitHub repository and showcase at `https://ui.kreoniz.ru`, with
  GitHub checks and deployment of successful main-branch builds. npm publication
  remains a separate release action.
- Add preview `ScrollArea`, backed by Base UI's native scroll container, with
  consistent vertical/horizontal scrollbars, theme-aware thumb states, RTL and
  forced-colors styling, and generated API documentation.
- Use ScrollArea in the playground sidebar and code examples. Long code stays
  inside its own viewport, with the Copy action outside the scrollable content.
- Fix toast height measurement during stack expansion and collapse, preventing
  ResizeObserver feedback errors with notifications of different heights.
- Include public repository, issues, and showcase links in package metadata.
- No changes to existing component APIs, peer ranges, or semantic token values.

## 0.1.0-alpha.1 — initial alpha

- Twenty-one preview components: Alert, Badge, Button, Calendar, Card,
  Checkbox, Combobox, DatePicker, Dialog, Field, Input, PhysicalButton, Popover,
  RadioGroup, Select, Skeleton, Spinner, Textarea, Theme, Toast, and Tooltip.
- Scoped light/dark themes, semantic CSS tokens, typed token overrides, and
  theme inheritance through the library's portals.
- Cream and olive-charcoal surfaces, mint actions, explicit control sizes,
  visible focus states, and reduced-motion styling.
- ESM, TypeScript declarations, root and component subpath exports, compiled
  CSS, standalone token CSS, and an optional Tailwind v4 adapter.
- Consumer and agent guidance, component contracts, and MIT licensing for the
  package's code and documentation. Development artwork and fonts are excluded.
- A separate mobile-friendly component workspace with generated API references
  and highlighted examples; the workspace is not part of the npm package.
- A generated red button logo appears beside the workspace wordmark, in the
  favicon, and in the foundations sheet. The overview has no large logo image.
  Brand assets remain outside the npm runtime.

### Compatibility and limitations

- React and React DOM peers: `^19.3.1`; fixtures use 19.3.1. ESM only.
- All components are previews; props, tokens, behavior, and appearance may
  change during alpha. Pin an exact version and review upgrades deliberately.
- Packed fixtures cover plain React and consumer Tailwind v4, TypeScript,
  SSR/hydration, theme portals, and CSS overrides. Framework-specific RSC
  integration and comprehensive accessibility conformance are not established.
- Calendar and DatePicker support single local dates. Apps own scheduling,
  requests, validation policy, routing, and theme persistence.
- Source installation and a shadcn-compatible registry are not implemented.

## Release policy

Alpha releases use the `next` npm tag; beta releases use `beta`. Regular
releases use `latest`. App dependencies should pin a version, not a moving tag.

During alpha, increment the prerelease counter and document breaking changes.
For regular 0.x releases, breaking changes increment the minor version;
compatible additions and fixes increment the patch. After 1.0, follow SemVer.
The contract includes visual defaults, token meanings, events, and theme/portal
behavior as well as TypeScript APIs.
