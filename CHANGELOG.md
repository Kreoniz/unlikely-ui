# Changelog

## 0.1.0-alpha.3 — 2026-10-30

- Polish signature motion: adjustable Receipt entry with falling exit and
  interrupted reissue handling; a completed Split-flap cycle followed by the
  latest coalesced reading; and a separately layered Guarded action lid with
  continuous reversal and stable printed label. All three expose local timing
  controls, with zero-duration and reduced-motion behavior. Preserve Cancel
  focus during delayed closure, keep the narrow Receipt action near its output,
  and handle Escape during menu opening.

- Reconstruct six Devspace experiments against the original concept images:
  an issuing Receipt, mechanical Split-flap, hinged Guarded action, material
  Allocation bar with locks, signed shadow-offset XY pad and six-sector
  contextual Radial menu. The scenes perform real local jobs and include native
  alternatives, reduced motion, scoped portals and recovery. They remain
  experimental; no new package exports are provided.
- Second whole-project review: close and guard a DatePicker disabled while open;
  refresh optional Tabs indicator geometry after direction changes, correct
  vertical RTL fallback selection and retain forced-colors selection cues.
  Keep the empty-state recipe action mounted for keyboard continuity and wrap
  submitted long names. Move the settings loading status outside its busy region.
- Whole-project review fixes: closed keep-mounted Dialogs no longer intercept
  page clicks; app recovery actions keep a logical focus destination. Correct
  study-lifetime/empty-preview disclosures and initial Russian sample copy.
- Verify the owned build identity and CSS mode before packed browser checks;
  cover stale responders, port collisions and startup errors. Request guarded
  deployment rollback after an ambiguous transport failure and report uncertainty.
- Serialize identical API parts once, defer closed reference bodies and preserve
  public type aliases/upstream links. Use a small logo derivative in the gallery,
  README and standalone sheet; correct its theme scope. Remove the stale HTML
  plan and make contributor reading task-dependent.
- Final council corrections: inherit explicit Theme.lang through nested themes
  and portals without changing document locale; preserve due labels on narrow
  task rows and wrap long status text. Correct the copyable recovery recipe's
  async focus policy, and cover focus return from the disappearing Empty trigger.
- Add shared button press and checkbox entry feedback with reduced-motion support. Rework the
  app-owned studies with stronger display typography, ledger/document layouts
  and purposeful row/review/save motion; app fonts remain outside npm.
- Clarify project/result count scopes and reveal narrow-screen filter results.
  Preserve edited tasks through empty-state previews. Normalize settings diffs
  to saved values and avoid moving focus after asynchronous responses.
- Shorten contributor/planning guidance, correct stale adapter/package claims,
  and distinguish historical review evidence from the current visual revision.
- Preserve the composed Combobox options button's localized action name inside
  Field while retaining the input label and description. Verify default and
  localized names with expanded-state and keyboard interaction checks.
- Clear stale save/restoration feedback when the recoverable-settings recipe
  is edited again. Clarify temporary tarball evaluation and artifact availability
  for other machines/CI; align ordinary consumer examples with named parts.
- Council follow-ups: separate local-checkout setup from published alpha.2,
  label copied source/API availability, show canonical parts before compound
  compatibility surfaces, and generate imports for the selected API part.
- Complete recipe source carries its app-owned layout styles and is compiled
  against the packed package. Add a copied workflow and explicit compound
  consumer regression case. No showcase stylesheet is required in those recipes.
- Require a value-specific removeLabel for removable ComboboxChip controls.
  ComboboxInputProps now describes the named composed input; add the explicit
  ComboboxBareInputProps name and retain ComboboxComposedInputProps as an alias.

- Adopt shadcn Base UI named-part conventions for standard controls, with
  callable roots and compatibility aliases for existing compound APIs. Add
  the `dropdown-menu` subpath for the existing action-menu implementation.
- Add standard Button variants and size names, plus `buttonVariants` for
  semantic native links. primary/danger/md remain compatibility aliases.
- Dialog includes a corner dismiss action by default, changing its tab order;
  it can be disabled or localized. Audit consuming dialogs when upgrading and
  use `showCloseButton={false}` for existing custom dismissal controls/policies.
  Add DialogHeader/Footer, CardAction and a
  compact Card size, composed ComboboxInput controls and selection chips,
  complete Switch/ScrollArea composition, and filled/line TabsList treatments.
- Dialog entry/exit uses fading and translation without scaling. Nested
  asynchronous popups retain stable anchor widths during entry, avoiding
  ResizeObserver feedback as their contents change.
- Expose scoped shadcn semantic token aliases and Tailwind app utilities from
  existing canonical values. Retain field validation, loading, touch sizing,
  theme inheritance and CSS isolation. Matching names do not imply universal
  shadcn block compatibility.
- Move gallery examples to named parts, expand generated API discovery, and
  retain shadcn's MIT notice in the package. Keep shared npm distribution for
  uniform apps; source registry distribution remains future work.

- Add preview Switch, Tabs, and Menu modules with explicit subpath exports.
  Switch retains Base UI form/controlled-state semantics; Tabs associates panels
  and supports manual/automatic activation; Menu restores scoped themes and
  direction through its portal, including menu-to-dialog focus handoff.
- Correct showcase CSS precedence so library Dialog/Popover and Card description
  spacing is visible. Runtime spacing and semantic token values are unchanged.
- Reflow API properties on phones, consolidate mobile chrome, and keep the
  Components action reachable while reading. Search descriptions and aliases;
  preserve API parts/properties and example headings in shareable URLs.
- Add Quick start, complete Dialog/empty-state source, and form recipes for a
  required local due date and recoverable asynchronous saves.
- Space Quick start headings above their content and animate “On this page”
  scrolling while respecting reduced-motion preferences.
- Render actual typography tokens and semantic color pairs in foundations;
  provide synchronized light/dark state comparisons and quieter form surfaces.
- Release the named API and three new preview controls as alpha.3 under `next`.
  Peer ranges remain unchanged; the six signature studies stay outside npm.

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
