# Reading room — independent adoption report

Started: 2026-10-30 05:25:47 UTC (12:25:47 Asia/Omsk).
Implementation and validation finished: 2026-10-30 05:30:06 UTC (12:30:06 Asia/Omsk).
Report written immediately afterward. This exercise is not a controlled comparison of models or speed.

## Result

Created `main.tsx`, `app.tsx`, and `app.css` for a personal reading utility. It starts with three readings and supports title/author/note search, All/To read/Read filters, read/unread actions, and an Add reading dialog with required title and author validation. Empty results include a way to clear filters. An appearance switch selects the scoped light/dark Theme. A deliberate refresh failure leads to retry and success without replacing list, draft, search, or filter state. State exists only in memory; the UI says that reloading starts fresh.

The app imports public package subpaths and the precompiled stylesheet. Page layout CSS uses semantic package tokens. No dependency or package-file changes, library edits, node_modules edits, network, server, browser, delegates, commits, publication, deployment, or persistent storage were used.

Accessibility is implemented but not browser-verified: a named main, a skip link, labeled search and fields, explicit error associations, a titled/described dialog, title-field initial focus, named item actions, result/change status announcements, and a named status radio group. Marking an item while a status filter removes it moves focus to the shelf section. The refresh button stays mounted and uses `loading` to prevent duplicate activation and retain focus. Loading announcements sit outside the busy region. Dialog focus management remains with the package.

## Inputs actually read

- This fixture's `package.json`, `tsconfig.json`, and `index.html`.
- Installed `node_modules/unlikely-ui/USAGE.md`, `docs/components.md`, and `CHANGELOG.md`. Broad initial output was truncated by the tool; USAGE was read again, and relevant component-contract sections were reread with targeted ranges.
- Installed public declarations: `dist/theme.d.ts`, `dist/token-names.d.ts`, and `dist/components/{button,dialog,field,input,radio-group,switch,card,alert,badge,textarea,spinner}.d.ts`. Spinner was considered, then omitted in favor of Button's loading state.
- The first 170 lines of public `dist/tokens.css`, reached through the installed package's documented token stylesheet.
- General React, TypeScript, CSS, and platform knowledge.
- Scope deviation: the first read also included installed `node_modules/unlikely-ui/package.json` for public version/export metadata. Although USAGE recommends inspecting it, it was beyond the task's enumerated input list. No package runtime implementation files were deliberately read. Vite's warning output automatically displayed module paths and their first `use client` lines.

No parent repository source, developer gallery, parent AGENTS files, other study files/reports, online documentation, or external examples were read during this task.

## Exact terminal commands and results

All commands ran with working directory `/home/kreoniz/code/unlikely-ui/.local/app-studies/adoption`.

1. `pwd` — exit 0; confirmed the fixture directory.
2. `cat package.json tsconfig.json index.html node_modules/unlikely-ui/package.json node_modules/unlikely-ui/USAGE.md node_modules/unlikely-ui/docs/components.md node_modules/unlikely-ui/CHANGELOG.md` — exit 0; combined tool output was truncated.
3. `cat node_modules/unlikely-ui/USAGE.md` — exit 0.
4. `cat node_modules/unlikely-ui/docs/components.md` — exit 0; combined output with other reads was truncated.
5. `cat node_modules/unlikely-ui/dist/theme.d.ts node_modules/unlikely-ui/dist/components/button.d.ts node_modules/unlikely-ui/dist/components/dialog.d.ts node_modules/unlikely-ui/dist/components/field.d.ts node_modules/unlikely-ui/dist/components/input.d.ts node_modules/unlikely-ui/dist/components/radio-group.d.ts node_modules/unlikely-ui/dist/components/switch.d.ts node_modules/unlikely-ui/dist/components/card.d.ts node_modules/unlikely-ui/dist/components/alert.d.ts node_modules/unlikely-ui/dist/components/badge.d.ts` — exit 0.
6. `sed -n '85,245p' node_modules/unlikely-ui/docs/components.md` — exit 0.
7. `cat node_modules/unlikely-ui/dist/token-names.d.ts node_modules/unlikely-ui/dist/components/spinner.d.ts` — exit 0.
8. `sed -n '1,170p' node_modules/unlikely-ui/dist/tokens.css` — exit 0.
9. `cat node_modules/unlikely-ui/dist/components/textarea.d.ts` — exit 0.
10. `sed -n '245,390p' node_modules/unlikely-ui/docs/components.md` — exit 0.
11. `mise exec -- pnpm check` — exit 0; `tsc --noEmit`, no diagnostics on the first implementation.
12. `mise exec -- pnpm check` — exit 0 after app-owned focus/live-region/ID refinements.
13. `mise exec -- pnpm build` — exit 0; Vite 8.3.4, 255 modules transformed, build completed in 254 ms. Many module-directive warnings caused tool-output truncation. Intermediate output: CSS 54.91 kB (gzip 10.12 kB), JS 331.41 kB (gzip 104.80 kB).
14. `mise exec -- pnpm check` — exit 0 after keeping the refresh button mounted and using its loading contract.
15. `mise exec -- pnpm build > build.log 2>&1` — exit 0; full final build output preserved in `build.log`.
16. `rg '^(\$|vite |✓|dist/)|\[MODULE_LEVEL_DIRECTIVE\]' build.log` — exit 0; this diagnostic display was itself truncated because it matched every warning.
17. `rg -c 'MODULE_LEVEL_DIRECTIVE' build.log` — exit 0; 103 warnings.
18. `rg '^(\$|vite |✓|dist/)' build.log` — exit 0; concise final summary below.

File creation and refinements used `apply_patch`. UTC timestamps came from the clock tool.

```text
$ vite build
vite v8.3.4 building client environment for production...
✓ 254 modules transformed.
dist/index.html                   0.37 kB │ gzip:   0.27 kB
dist/assets/index-CCOwgIoR.css   54.75 kB │ gzip:  10.10 kB
dist/assets/index-DUEubEsE.js   330.82 kB │ gzip: 104.60 kB
✓ built in 474ms
```

## Incorrect guesses, fixes, and friction

There were no TypeScript errors or failed validation commands. No rejected import or prop guesses occurred. The named Dialog/Field/Card APIs, `render={<Button />}`, controlled Switch, generic RadioGroup, `initialFocus` ref, externally controlled Field invalid/error state, and Button loading all passed the installed declarations. This establishes compilation, not runtime behavior.

App-owned refinements after the first pass moved ID allocation outside a React state updater, added focus fallback when a filtered reading disappears, moved the loading live region outside `aria-busy`, and retained the refresh action through loading/error/success. These were code-review decisions, not fixes for observed browser failures.

Documentation supplied enough information to implement the requested workflow without library edits. It clearly distinguished the unreleased named API from published alpha.2 and explained the built-in Dialog portal/dismiss control. Public declarations resolved the exact generic and focus prop shapes. There was no blocking API-documentation gap.

Two adoption frictions remain:

- The plain-CSS layout path required looking up canonical surface, ink, line, font, and spacing token names in the installed token stylesheet/type union. The guide's complete surface example favors Tailwind utilities; a small plain-CSS example or compact token reference would reduce this lookup.
- An ordinary Vite build emitted 103 repeated `MODULE_LEVEL_DIRECTIVE` warnings about `use client` semantics from unlikely-ui and Base UI modules. The build succeeded, but the noise overwhelmed the first captured output. No warning suppression or configuration changes were made.

## Limits and handoff

No browser/server was permitted, so this agent did not verify visual polish, mobile overflow, actual field/error announcements, radio keyboard behavior, dialog tab order/focus return, portal appearance, or refresh-button focus retention. These remain for the parent's independent UI review. CSS includes 800px and 540px reflow breakpoints, but their result is unverified.

The refresh is a 1.1-second in-memory demonstration, not a network request. It fails on “Try refresh demo”, succeeds on “Retry refresh”, and can be repeated. Data preservation follows from separate refresh state; it has not been exercised in a browser here. The list is intentionally temporary and has no persistence.

Authored files: `main.tsx`, `app.tsx`, `app.css`, `adoption-report.md`. Supporting generated files: `build.log` and Vite's `dist/` output. Package manifests, lockfile, fixture HTML, and TypeScript configuration were not edited.
