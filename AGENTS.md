# Working conventions

## Purpose and scope

- These instructions govern development of this repository. For using the npm
  package in an app, read `USAGE.md` and `docs/components.md`; do not copy these
  contributor instructions into a consumer project.
- Product name: **unlikely ui**. It is a React design system using Base UI,
  Tailwind CSS v4 and semantic CSS tokens.
- Read `README.md`, `CONTEXT.md`, `docs/implementation.md`, `docs/packaging.md`, `docs/showcase.md`
  and `docs/foundations/tokens.md` before implementation. Distinguish proposals,
  implemented behavior and published capabilities when reporting progress.
- Campus supplies visual evidence only. App migration, deployment and changes
  to the Campus repository are outside this project.
- Initial distribution decision: one npm package with prebuilt ESM,
  declarations and CSS. A source registry is a possible later delivery option.
  Do not build a second component implementation for it.

## Engineering

- Prefer mise for runtimes and pnpm for JavaScript tools. Preserve the pinned
  package-manager version and lockfile. Record runtime pins during scaffolding.
- Prioritize YAGNI, then KISS, then DRY. Add dependencies only for a current
  requirement. Keep one package and a local development gallery initially.
- Add directories and configuration when the corresponding milestone starts;
  the proposed tree is not an instruction to generate empty scaffolding.
- Keep component modules small, with local variant definitions and relative
  imports. Import sibling modules directly rather than through the root barrel.
  Avoid application aliases, product models and a large internal runtime.
- Reuse Base UI behavior, state attributes, composition and accessibility
  semantics. Do not reimplement keyboard interaction, focus management or
  positioning. Use semantic HTML for presentation components.
- Keep the composition and controlled/uncontrolled conventions of the relevant
  Base UI primitive. Do not introduce an unrelated polymorphic API.
- Do not add StyleX, another component edition, a custom installer, a component
  generator, a form-state framework or product-specific widgets speculatively.

## Tokens, themes and styles

- `src/styles/tokens.css` is the canonical value source. The foundations checker
  reads it and generates the review sheet and contrast report. After token
  changes, regenerate the type union with `scripts/token-types.mjs` (also run
  by check/build). Leave one editable source of truth.
- Components use semantic roles. Keep action, selection, categorical and status
  meanings separate. Avoid raw palette values in component styles.
- Scope tokens to the library theme boundary. Do not change consumer root
  font sizes, start font requests, ship a global reset, or install global
  light/dark state from an individual component.
- Use one default sizing system and explicit control sizes. Preserve focus
  visibility, reduced motion and effective touch targets for small controls.
- Theme and explicit token overrides must reach portals, including nested
  themes. Prove this with a portaled component before expanding overlays.
- Tailwind utility isolation, CSS layer order and supported consumer overrides
  must pass M0's consumer fixture. Do not assume class-string order determines
  CSS precedence, or fix integration problems with blanket `!important`.
- Keep complete static Tailwind class names. Keep style inputs readable and
  transferable so later registry generation does not need a second stylesheet
  maintained by hand.
- Package utilities use `ui:` and the `ui-theme`, `ui-base`, `ui-utilities`
  layers. Preserve the tested consumer cascade recipe in `docs/packaging.md`.
- Add each component to `dev/catalog.ts`, include meaningful examples, and
  report its actual maturity. Keep catalogue entries alphabetical by component name.
  Keep experimental code in `dev/experiments/`;
  promotion into `src/` requires the component's behavior and package checks.

## Packaging and public contracts

- Use one release version, explicit component subpath exports and a CSS-only
  token export. Keep build tools, the gallery, fonts and mascots outside the
  installed runtime contract.
- Ship `USAGE.md` and `docs/components.md` as consumer guidance. Keep contributor
  `AGENTS.md` and repository planning documents outside the package. README and
  shipped-guide links must resolve within the packed artifact; the consumer
  check verifies their local file targets.
- React and React DOM are peers; Base UI is a runtime dependency. Declare only
  React/platform versions actually checked by the consumer fixtures.
- Preserve client boundaries in emitted interactive modules. Keep imports of
  presentational components from unnecessarily pulling in the whole library.
- Keep CSS as an explicit import and mark published CSS as side effects. Test
  the packed tarball from a separate consumer, not only repository source.
- Do not claim exports, scripts, registry commands or compatibility that have
  not been implemented and verified. Examples must identify proposed APIs.
- The owner selected the unscoped `unlikely-ui` name and MIT license; the first
  published release is `0.1.0-alpha.1` on `next`, dated 2026-10-20. npm also assigned
  `latest` on first publication and rejected its removal; see `docs/releasing.md`.
  Further publication requires an explicit request. Do not publish during routine development.
- Before a release, run `pnpm release:check` and inspect the tarball. Preserve
  `prepack`/`prepublishOnly` hooks and the explicit registry/access/tag settings.
  Follow `docs/releasing.md`; do not invent repository URLs or broaden peers
  beyond the consumer fixtures' verified range.
- Include visual, token and behavior changes in release notes; TypeScript
  signatures alone do not define compatibility. Follow the documented 0.x
  policy and explicit prerelease tags.
- The owner made the repository public on 2026-10-21 and selected
  `https://ui.kreoniz.ru` for the static showcase. Keep private deployment
  evidence, credentials, and concept boards outside Git. See `deploy/README.md`.
  GitHub Actions checks pull requests and deploys successful `main` builds;
  the deployment account can replace static files only. Server configuration
  and npm publication remain separate, explicitly authorized operations.

## Validation and resources

- Run the narrowest meaningful checks for the change. Available scripts:
  `pnpm check`, `pnpm tokens:check`, `pnpm build`, `pnpm showcase:build`,
  `pnpm test:browser` and `pnpm test:consumer`. Browser checks use the gallery;
  consumer checks build/pack and exercise the isolated installed artifact.
- Test the library's integration and behavior: names, keyboard use, focus
  return, states, nested themes, portal inheritance and consumer overrides.
  Avoid snapshots or tests that simply restate static class strings.
- Review representative light/dark and size examples at narrow and wide
  widths. A passing palette report is not a component accessibility audit.
- Keep build caches and dependency-heavy fixtures on disk. Use ordinary tool
  defaults or the ignored `.local/` directory; `/tmp` is RAM-backed here.
- Keep secrets and local operational data out of source and examples. Preserve
  third-party asset notices; mascots and fonts need their own distribution
  decision.

## Documentation

- Keep `CONTEXT.md` a glossary only. Put implementation and delivery decisions
  in their existing documents. Use an ADR only for a consequential tradeoff
  that needs durable rationale.
- Update milestone status and affected documentation after confirmed changes.
  Do not mark a milestone done because its scaffolding exists.
- Document custom props with JSDoc in their TypeScript declarations. Generate
  the showcase API with `pnpm docs:generate`; do not maintain duplicate prop
  tables or edit `dev/generated/`. Use `pnpm test:docs` after generator changes.
