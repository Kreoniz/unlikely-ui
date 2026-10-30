# App studies and adoption evidence — 2026-10-30

The owner requested implementation of the previous council's next steps,
subagent participation, a visible result for feedback, and initially one council
pass. After rejecting the first visual outcome as too quiet/static, the owner
authorized a stronger visual/motion revision with no more than two passes in
total, and explicitly requested documentation/AGENTS accuracy and conciseness,
visual design, code quality and broad quality coverage. This work explores whether shared unlikely ui foundations and
controls can make useful personal apps with coherent styling. Owner approval
of the visual language and human accessibility review remain pending.

## Result to inspect

Start the repository playground with `mise exec -- pnpm dev`:

- `http://127.0.0.1:5177/#apps/desk`: Margin, a project/work queue. Search,
  status/project filters, completion, validated task creation and a contextual
  note. Empty-state creation and loading/error recovery work in memory.
- `http://127.0.0.1:5177/#apps/settings`: Dispatch, a workspace editor. Associated
  fields, notification preferences, before/after review, validation and dirty
  state. The first save deliberately fails; retry succeeds with edits retained.
  Save/discard and subsequent edits have current-state feedback.

The review bar switches appearance, English/Russian and forced content states.
These controls are outside the fictional product interface.
The View app only action hides those controls for a cleaner owner review, and
the footer restores them without resetting the mounted app's edits.
Both screens reflow at actual narrow browser widths; there is no simulated phone frame implying
that portaled overlays share a constrained viewport. State is memory-only.
Switching content state or locale preserves a mounted screen's draft; switching
products or reloading starts a fresh screen. No backend, account or persistence
is implied.

Each screen was implemented by a separate subagent against the same short
brief and existing consumer/API guidance. The parent supplied a small shared
visual contract, route/review shell and integration checks. These agents had
repository access; their work is not the independent adoption trial below.
All screen code remains under `dev/experiments/app-studies/`. No app-specific
widget was promoted into `src/`, no runtime dependency or token value was added,
and the npm version remains unchanged. The app routes are lazy-loaded.

## Starting visual contract

The consumer guide now gives concrete app-level guidance: shared font setup,
14/20 ordinary UI, 16/24 reading, 12/16 metadata, heading roles, spacing rhythm,
bounded widths, mobile gutters, action hierarchy, semantic status/selection and
current feedback. This is a starting reference for owner feedback, not evidence
that every screen must use the same layout. A compact plain-CSS example and
common token roles were added after the adoption agent's discovery friction.

The reference screens use semantic roles and existing named controls. Parent
review removed selectors depending on library descendant classes and retained
public className/variant/children customization. Neither reference screen
requires the mascot. The playground loads Inter as an app decision; the
package still installs no fonts or global reset.

## Independent package-adoption trial

A third fresh subagent received no parent history. It worked in an isolated
fixture at `.local/app-studies/adoption`, using an installed local tarball,
shipped USAGE/component contracts/changelog, public declarations/token CSS and
general React/platform knowledge. It was told not to read repository source,
gallery examples, other agents' work or online documentation, and not to edit
the library or install dependencies. The parent preinstalled the fixture.

The result is Reading room: search/status filtering, validated Add reading
Dialog, read/unread actions, empty recovery, light/dark Theme and a refresh
failure/retry demonstration preserving list state. Original agent-authored
source and its detailed report are archived in `tests/adoption/reading-room/`;
the runnable fixture and original build log remain local. This is an archived
trial, not a new supported package or product.

Observed by the agent: TypeScript checks and a Vite production build passed;
no rejected import/prop guesses or TypeScript errors were reported, and no
library edits were needed. The agent reports also reading the installed public
package manifest for exports/version, beyond its narrowly enumerated inputs.
That scope deviation is recorded rather than presenting the trial as perfectly
controlled. The raw report's UTC timestamps are preserved; its local timezone
annotations were not used as a speed benchmark.

The plain-CSS path required extra public stylesheet/type lookup for token
names. The guide was improved afterward; the agent has not repeated the trial
against that newer guide. Its client-only Vite build emitted 103 repeated
module-directive warnings from library/Base UI `use client` boundaries. The
build succeeded. Do not remove client boundaries to silence those warnings.
Build noise remains a documented adoption limitation.

The parent's independent Playwright check subsequently exercised search/empty
recovery, Dialog initial focus, required-field association, creation/focus
return, read/unread and refresh failure/retry with the new entry retained.
The 320px dark view had no horizontal overflow and passed the sampled WCAG-tagged
axe check. Six actual app captures were saved locally. Initial parent probes
used incorrect action names and an axe-incompatible implicit context; these
test-harness errors were corrected before the successful run. They are not
classified as product failures. Human assistive-technology behavior is unproved.

This is one agent and one task with scaffolding/dependencies supplied by the
parent. It establishes feasibility in that case, not comparative speed,
general agent reliability or cross-app maintenance savings. Self-reported
implementation accessibility is separate from browser evidence.

## Upstream maintenance evidence

A read-only check of the official GitHub `commits/main` API on 2026-10-30
returned the same revision as `docs/shadcn-upstream.json`:
[`96da9cc7f1aa10580a3741664e2a77c721206c00`](https://github.com/shadcn-ui/ui/commit/96da9cc7f1aa10580a3741664e2a77c721206c00).
There is no newer candidate in that check. No artificial update was manufactured
and no upstream adaptation cost was measured. A useful future change and the
work to integrate it remain outstanding evidence.

## Validation and review

The parent checks named controls, Field association, task creation/completion,
Dialog focus return, settings failure/retry/save/discard and edits after
completion, forced-state recovery, Russian/English reflow in light/dark at
320px and 1280px, and a short touch viewport with 200% root text scaling. Root
text scaling is not equivalent to a human browser-zoom or screen-reader audit.
The packed-consumer harness also compiles both actual reference screens against
the packed artifact after replacing source imports with public subpaths.

Browser Preview successfully inspected Margin. Two settings snapshots returned
`Preview automation snapshot timed out after 15000ms.` The parent then used
Playwright for further browser evidence and actual captures. These tool failures
are not treated as product defects. Owner feedback, human assistive-technology
speech, physical-device/virtual-keyboard usability and recognition across real
deployed apps remain unverified. No other repository, deployment, npm publication
or registry installation was changed.

## Owner feedback and revised result

The owner found the first studies insufficiently distinctive and lacking
transitions. Coherence did not satisfy the personality goal. The revised Margin
uses a project rail before the queue, a ledger surface, larger display type,
numbered rows and a smaller contextual note. Dispatch uses one numbered workspace
document, a separate review rail and a save strip. Manrope display text is loaded
by the app alongside Inter and passed through Theme.tokens for portal inheritance;
the font and original license are gallery assets excluded from npm.

The shared library adds a 1px button press movement and a checkbox indicator
entry animation, guarded by reduced-motion preference. Apps use existing motion
tokens for bounded row/sheet/review/status entry. Data updates remain immediate;
no animation framework, new runtime dependency or token value was introduced.
Actual interaction recordings accompany captures, because screenshots cannot
demonstrate motion. These choices await owner feedback; no brand-recognition
or 10/10 outcome is asserted.

Documentation cleanup condensed AGENTS.md and implementation planning, corrected
stale adapter/publication wording, clarified Dialog's behavior exception, and
made release archive/verification examples follow the current package version.
Consumer guidance now explains plain CSS, app visual rules and motion ownership.
The archived Reading room source is also compiled by the packed consumer to
catch public API drift; this does not repeat the independent agent trial.

## Council pass one and dispositions

The earlier baseline had 159 hashed files. Sol supplied **7.8/10**; implementation
Terra supplied **7/10**. The visual Terra launch was rejected by the orchestration
service with `parent_not_active`, so it supplied **no score** and this was not a
complete three-member council round. The parent initially reported three active
reviews before discovering that launch failure. There is no invented third score
or claim of a complete independent pass. The final requested pass included
all three members. No third pass was run.

- Mobile project output and count scopes: corrected by moving project navigation
  before results, exposing selected project/status and live matching count, and
  labelling whole-desk and active-project totals. Narrow choices reveal results;
  keyboard navigation has a heading target rather than losing its focus.
- Empty-state creation: new tasks join the retained queue instead of replacing
  it. The review note explains the forced blank view. A regression preserves
  an earlier authored task through another empty-state creation.
- Settings diffs: dirty detection, displayed values and saving share trim
  normalization. Blank required fields say Not entered; the optional description
  has its own empty copy. Async responses no longer move focus; Retry establishes
  its persistent fallback before the request.
- Gate evidence: reviewers inspected the older failed `release-check-final.log`.
  The later `release-check-sequential.log` succeeded before the visual revision.
  Failed runs remain failures. The revised gate is recorded separately below.
- Adoption/upstream/recognition limits remain open. Public manifest access is
  recorded as a procedural input deviation, not repository contamination.

## Revised validation before the final pass

`pnpm release:check` passed on the revised baseline: type/docs checks, 98 palette
pairs, production showcase, **60 gallery tests** and **nine packed-consumer tests
in each of plain React and consumer Tailwind**. The exact parent log is
`.local/app-studies/revision-release-check.log`; it is distinct from earlier
collision logs. After a compact mobile-header layout correction, all nine
app-study checks passed again in a separate output directory. Formatting and
`git diff --check` passed for the revised source and documentation.

The added app checks cover normalized diffs, post-request focus preservation,
repeated empty-state creation, 320×568 project-result visibility and count scope,
shared press feedback, reduced-motion behavior and normal workflows. Contrast
scans wait for finite entry animation and fonts to settle; an initial scan
captured intermediate fade opacity and was corrected to measure settled colors.
Four revised actual captures and two interaction recordings are stored under
`.local/app-studies/revised-captures/`; older captures are retained separately.
Recording pauses pace the video, not application state. Human screen-reader,
real zoom/device/virtual-keyboard and owner recognition remain unverified.

The final review covers visual identity and motion, workflows and recovery,
responsive/i18n behavior, accessibility and human-evidence limits, component/API
composition, code quality, performance/dependencies, package/cascade/SSR contracts,
documentation and AGENTS correctness/conciseness, licensing/privacy and update
economics. This is a broad review scope, not a claim that every possible quality
property or real-world condition has been exhaustively verified.

## Final council and parent dispositions

The final pass used a 161-file frozen manifest. All three reviewers verified
its hashes, HEAD and working-tree status. Reviews were independent and selective;
hash verification does not imply a substantive audit of every file. Reviewers
received the owner's 10/10 aspiration without a target-score instruction.

| Reviewer                             | Earlier pass            | Final revision |
| ------------------------------------ | ----------------------- | -------------- |
| Sol — product and agent adoption     | 7.8/10                  | **8.2/10**     |
| Terra — implementation and contracts | 7.0/10                  | **8.1/10**     |
| Terra — visual design and usability  | No score; launch failed | **7.6/10**     |

The result did **not** reach 10/10. The reports are preserved locally at
`.local/app-studies/council-r2/{sol-product,terra-implementation,terra-visual}.md`.
These scores apply to the frozen revision before the following parent fixes.
No reviewer rescored those fixes and no extra council pass was run.

- **Language in portals:** Theme now inherits its explicit `lang` through nested
  themes and portaled Theme boundaries, matching its existing direction and
  appearance contract. This extends an existing HTML prop rather than adding a
  locale framework or repeating attributes on every popup. A nested explicit
  language still overrides its parent; the document language remains app-owned.
  Tests cover Russian Dialog/Select and a nested English Popover against the
  packed package, as well as the actual app Dialog/Select. This verifies metadata,
  not human screen-reader pronunciation.
- **Recovery recipe focus:** the copyable recipe now follows Dispatch's policy.
  Retry establishes a persistent Save fallback before disappearing. Neither
  failure nor success moves focus after the request. A regression moves focus
  into another field during each request and verifies it stays there.
- **Long-title overflow:** app status announcements wrap unbroken text while
  retaining the full accessible message. A 160-character title is checked at
  320×568 after creation, completion and reopening. The analogous copyable
  recipe statuses also wrap their user-authored text.
- **Mobile due information:** the compact task row now includes the due label
  alongside its project; hiding desktop metadata no longer removes that content.
- **Empty-trigger focus:** the implementation reviewer identified a risk, not a
  reproduced failure. A parent keyboard probe passed, but a pointer regression
  reproduced focus falling to the page body after the Empty trigger unmounted.
  Margin now supplies Base UI's `finalFocus` with the persistent New task trigger
  after successful Empty-state creation. Other dismissals retain Base UI's
  default return policy. Both pointer and keyboard creation are covered.
- **Documentation:** stale wording that the studies still awaited recorded
  checks/final council was corrected. Contributor, consumer, published-release
  and checkout contracts remain distinct. Generated API declarations include
  Theme's language contract; consumer guide links are checked in the package.

The visual reviewer still described the result as a polished editorial
productivity template whose personal recognizability needs owner endorsement.
The recordings show real, restrained motion; they do not establish that the
owner finds it distinctive or compelling. A new recurring motif was not invented
after the review solely to chase a score. That choice needs feedback on the
visible result.

Two lower-priority tradeoffs remain: maximum-length settings diffs can require
substantial mobile scrolling, and the New task project's initial draft is
independent of the currently selected filter. Full review text is retained and
an existing draft is preserved. There is no added truncation, sticky mobile UI
or automatic draft replacement without evidence that it improves the workflow.

Owner recognition, human assistive-technology and physical-device testing,
broader agent trials, real-app adoption and a useful upstream update-cost
exercise remain open. The single Reading room task supports feasibility, not
general agent efficiency or maintenance savings. Build warning/chunk-size costs
remain disclosed. Automated checks do not resolve these evidence gaps.

## Validation after the final review

The parent ran focused regressions for each bounded finding and the isolated
consumer check. Both installed consumer modes passed ten tests, including the
new nested-language contract. The subsequent complete `pnpm release:check`
passed: TypeScript and generated API checks, six documentation-generator tests,
98 palette pairs, the production showcase build, **62 gallery tests** and
**ten packed-consumer tests in each of plain React and consumer Tailwind**.
The exact log is `.local/app-studies/post-council-release-check.log`.
These consumer runs include declaration compilation of the actual studies,
archived Reading room and complete recipes, plus SSR/hydration, CSS isolation,
cascade and nested portal behavior. No broader framework matrix is implied.

Repository formatting and `git diff --check` also passed. The refreshed four
actual screenshots and two WebM interaction recordings are under
`.local/app-studies/revised-captures/`; browser capture reported no page errors
in `.local/app-studies/revised-visual-evidence.json`. Short GIF excerpts omit
the recording's initial page load. Narrow captures use a real 390px viewport;
the regression suite separately covers 320×568 and long user-authored content.
The local gallery and original independent adoption fixture were both reachable
at completion. No publication, deployment or other repository was changed.
