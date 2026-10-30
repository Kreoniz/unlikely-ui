# Working conventions

## Scope and reading

- **unlikely ui** is one React design system using Base UI, Tailwind CSS v4 and
  semantic CSS tokens, distributed as one npm package and a separate gallery.
- These are contributor instructions. App consumers use `USAGE.md` and
  `docs/components.md`; do not copy this file into consumer projects.
- Start with `README.md` and the `CONTEXT.md` glossary. Read the contracts affected
  by the task: `docs/implementation.md` for scope, `USAGE.md`/`docs/components.md`
  for public APIs, `docs/packaging.md` for artifacts/cascade, `docs/showcase.md`
  for gallery work, and `docs/foundations/tokens.md` for visual/token changes.
  Read `docs/releasing.md` or `deploy/README.md` before their respective work.
  Distinguish proposals, checkout behavior and published capabilities.
- Campus is visual evidence only. Changes, migration and deployment in that
  repository are outside this project.

## Implementation

- Prefer mise and pnpm; preserve runtime/package-manager pins and the lockfile.
  Record runtime pins in `mise.toml` when scaffolding new tooling.
  Prioritize YAGNI, then KISS, then DRY. Add dependencies, directories and
  configuration only for a current requirement, not a proposed tree.
- Keep modules small, with local variants and relative sibling imports rather
  than the root barrel. Avoid app aliases, product models and a large runtime.
- Base UI owns behavior, state attributes, accessibility semantics, keyboard,
  focus and positioning. Preserve its composition and controlled/uncontrolled
  conventions; do not add an unrelated polymorphic API. Use semantic HTML for
  presentation components.
- Use shadcn's Base UI named-part conventions. Keep one implementation with
  existing compound compatibility aliases; preserve documented validation,
  loading, theme and portal contracts. Review `docs/shadcn-upstream.json`
  before adaptations, update provenance and retain the upstream MIT notice.
- Do not speculatively add StyleX, another component edition, an installer,
  generator, form-state framework or product-specific library widgets.
- Add public components to alphabetical `dev/catalog.ts` entries with meaningful
  examples and actual maturity. Keep experiments in `dev/experiments/`;
  promotion into `src/` requires behavior and package checks.

## Styling contracts

- `src/styles/tokens.css` is the only editable value source. After changes,
  regenerate token types with `scripts/token-types.mjs` (also run by check/build)
  and the foundations sheet/contrast report with `pnpm tokens:check`.
- Use semantic roles; keep action, selection, category and status meanings
  separate. Avoid raw palette values in component styles.
- Scope tokens to Theme. Components must not alter consumer root font sizes,
  request fonts, ship a global reset or install global light/dark state.
- Keep one default sizing system with explicit sizes, visible focus, reduced
  motion and effective touch targets. Theme and explicit token overrides must
  reach nested portals, including explicit Theme.lang; verify a portaled
  component before expanding overlays. Document language remains app-owned.
- Preserve `ui:` utilities and the `ui-theme`, `ui-base`, `ui-utilities` layers.
  Follow the tested consumer cascade in `docs/packaging.md`. Class-string order
  does not establish precedence; avoid blanket `!important` fixes.
- Keep complete static Tailwind classes and readable style inputs so a future
  source delivery option can reuse the same implementation and stylesheet.

## Package and release boundaries

- Shared npm consumption is the default for uniform apps. Apps own workflows
  and layouts; source copies/registry delivery are optional future choices,
  not a second implementation. Avoid per-app control forks without a need.
- Use one version, explicit component subpaths and a CSS-only token export.
  React/React DOM are peers; Base UI is a runtime dependency. Declare only
  platform versions checked by consumer fixtures.
- Preserve client directives in interactive output and lightweight presentation
  imports. Keep CSS explicit and marked as side effects. Test the packed
  tarball in a separate consumer, not only repository source.
- Ship consumer guidance (`USAGE.md`, `docs/components.md`), with local README
  and guide links resolving in the tarball. Exclude contributor/planning docs,
  tooling, gallery, fonts and mascots. Preserve asset/license notices.
- Do not claim unimplemented/unverified exports, commands or compatibility.
  Identify proposed APIs. Include visual, token and behavior changes in release
  notes; TypeScript compatibility alone is insufficient.
- The selected package is unscoped `unlikely-ui`, MIT licensed. Published release
  evidence and tag history are in `docs/releasing.md` and
  `docs/release-2026-10-30.md`; checkout changes may be newer. Further npm
  publication requires an explicit request. Never publish during routine work.
- Before a release, run `pnpm release:check` and inspect the tarball. Preserve
  lifecycle hooks and registry/access/tag settings; follow `docs/releasing.md`
  and the documented 0.x policy. Do not invent URLs or broaden unchecked peers.
- Public showcase deployment follows successful `main` builds in GitHub Actions.
  Keep credentials, private deployment evidence and concept boards outside Git.
  The deployment account replaces static files only; server configuration and
  npm publication remain separate authorized operations. See `deploy/README.md`.

## Validation and documentation

- Run the narrowest meaningful checks: `pnpm check`, `pnpm test:docs`,
  `pnpm tokens:check`, `pnpm build`, `pnpm showcase:build`, `pnpm test:browser`
  and/or `pnpm test:consumer`. Consumer checks build/pack the installed artifact.
- Test integration and behavior: names, keyboard/focus return, states, nested
  themes, portals and consumer overrides. Avoid static-class tests and snapshots
  that merely repeat implementation. Review representative light/dark, size,
  narrow and wide examples; palette checks are not an accessibility audit.
- Keep caches and dependency-heavy fixtures on disk in normal defaults or
  ignored `.local/`; `/tmp` is RAM-backed. Keep secrets and local operational
  data out of source and examples.
- `CONTEXT.md` is a glossary. Use existing implementation/delivery documents for
  decisions and an ADR only when a consequential tradeoff needs durable rationale.
- Update affected docs and milestone status after verified changes; scaffolding
  alone is not completion. Document custom props with declaration JSDoc, run
  `pnpm docs:generate`, and never edit `dev/generated/` or duplicate prop tables.
  Run `pnpm test:docs` after generator changes.
