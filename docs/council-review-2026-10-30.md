# Design system and playground council — 2026-10-30

The council supports retaining unlikely ui as one shared npm implementation
with scoped semantic foundations and app-owned layouts. The shadcn adaptation
improves familiar composition and discovery in the checked cases. It has not
demonstrated lower maintenance cost, faster agent delivery, universal shadcn
block compatibility, or recognizable branding across real apps.

## Scope and method

This section records the initial migration review. The separately requested
five-member whole-project sequence is recorded under [Whole-project extension](#whole-project-extension).

The owner requested two rounds of critical review covering uniform personal
apps, distinctive styling, agent usability, interaction/accessibility,
upstream maintenance and distribution. Each round used three independent
OpenAI reviewers at xhigh: Sol for product/interaction, Terra for visual design
and accessibility, and Terra for implementation/correctness. Reviewers examined
the whole system with distinct lenses; they did not delegate further.

Round one reviewed the unreleased migration working tree at HEAD
`af10d7329cc10c7e54318fed2d0d364d4c164b66`, with 142 source files frozen by hash.
Accepted fixes were implemented and checked before round two. Three new tasks
then reviewed the updated 144-file baseline independently, with the first
round's reports and parent dispositions. Every round-two reviewer and the
parent verified zero hash mismatches. The six raw reports and manifests remain
local diagnostics under `.local/council/`.

No third migration round was requested or run. Scores below apply to each frozen review
baseline. The final small corrections described below were made by the parent
after round two and have **not been independently rescored**. These judgments
are neither measured adoption outcomes nor accessibility certification.

| Member and lens                               | Round 1 | Round 2 |
| --------------------------------------------- | ------: | ------: |
| Sol — product, interaction and agent adoption |  7.0/10 |  7.8/10 |
| Terra — visual design and accessibility       |  6.5/10 |  7.0/10 |
| Terra — implementation and correctness        |  6.0/10 |  7.0/10 |

## Decisions for the owner's goals

1. **Keep the shared package.** It centralizes repeatable choices beyond token
   values: sizes, loading and naming contracts, Field integration, portal theme
   restoration and the consumer cascade. A tokens-only approach would leave
   each app and agent to reproduce those decisions. This is a reasoned boundary,
   not a comparative cost trial proving a package is always cheaper.
2. **Use shared tokens and controls for uniform apps; keep workflows in apps.**
   Use the canonical semantic values through the theme and optional Tailwind
   adapter for surfaces, type, spacing and status/action roles. Apps own font
   loading, layouts, content, navigation and business state. Consistent controls
   alone do not guarantee consistent entire screens.
3. **Keep npm as the default distribution.** Source ownership starts in this
   repository. App-owned compositions already provide flexibility. A registry
   or copied controls would introduce update/distribution obligations and
   divergence without fixing the issues found here. Add source delivery only
   for a concrete need and derive it from the same implementation.
4. **Treat shadcn alignment as a bounded API/composition adaptation.** Base UI
   supplied primitive interaction logic before the migration. Local styles,
   integration, aliases and tests remain owned here. Useful upstream changes
   need selective review against the pinned provenance; savings remain
   unproved. Do not expand the compatibility surface to justify the migration.
5. **Keep the visual direction while testing it in context.** Warm paper,
   olive dark surfaces, mint emphasis, fine boundaries and compact geometry
   were coherent in sampled views. PhysicalButton offers an expressive option.
   Whether ordinary controls communicate the owner's style without gallery
   chrome needs an owner review of a populated app screen. Artwork exclusion
   does not by itself establish a branding defect.

## Findings and dispositions

| Finding                                                                               | Decision and resulting behavior                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Installation points to alpha.2 while copied code uses unreleased APIs                 | Fixed between rounds: local pack/install instructions lead checkout evaluation; published alpha.2 is separately labelled and points to its installed guide. Availability notices sit on component/API/recipe pages and beside copied code.                                                                                                                               |
| Complete recipes depend on hidden gallery layout CSS                                  | Fixed between rounds: five actual compositions carry essential app-owned layout styles and compile against the packed artifact. The copied ProjectDialog runs without gallery CSS. The existing multi-selection composition is available as complete source.                                                                                                             |
| Selected API import is wrong; canonical parts are obscured                            | Fixed between rounds: import follows the selected symbol, canonical parts precede a labelled compatibility/explicit-composition group, and old links remain.                                                                                                                                                                                                             |
| ComboboxInputProps describes the bare input                                           | Fixed between rounds: ComboboxInputProps describes the composed control; ComboboxBareInputProps names the bare surface. The prior composed type remains an alias.                                                                                                                                                                                                        |
| Removable chips share generic names                                                   | Fixed between rounds at the typed boundary: a removable ComboboxChip requires removeLabel; examples and packed checks use distinct value-specific labels. TypeScript cannot prove arbitrary strings meaningful or enforce the contract for untyped callers.                                                                                                              |
| Existing-consumer checks were replaced by named examples                              | Improved between rounds: a representative compound fixture exercises old Button/Field/bare Combobox composition, nested Dialog tokens, explicit close-button opt-out and focus return. This is bounded regression evidence.                                                                                                                                              |
| Dialog.Content gains a built-in corner close action                                   | Accepted intentional behavior change. Both surfaces share one default. Upgrade guidance and changelog require auditing consuming dialogs, using showCloseButton=false for custom dismissal controls/policies, and rechecking tab order/focus. Aliases do not preserve untouched old Dialog behavior.                                                                     |
| Combobox triggerLabel loses to Field aria-labelledby                                  | Found independently by Sol and visual Terra in round two. Fixed afterward: the composed trigger explicitly overrides its inherited naming relationship, while the input keeps its Field name and description. Default and localized effective names, popup state/association and selection are checked. Explicit bare Trigger composition retains its existing behavior. |
| Save recipe keeps showing success/restoration after later edits                       | Reproduced by Sol in round two. Fixed afterward: editing either draft field clears transient completion feedback, restoring the current unsaved-state message. Existing retry/focus checks now include edits after success and discard.                                                                                                                                  |
| Local tarball and lockfile appear to be a durable shared install                      | Clarified afterward: checkout tarballs are temporary local evaluation. A lockfile does not distribute the file. Other machines/CI need the artifact at the referenced path, or a deliberately published distinct version must replace it. Local alpha.2 metadata does not identify the published artifact.                                                               |
| Consumer prose teaches two default styles and suggests publication has never occurred | Corrected afterward: ordinary examples use named parts; explicit compound composition is labelled where needed. Publication wording distinguishes existing alpha releases from further unreleased changes.                                                                                                                                                               |

## Disagreement and parent judgment

The visual reviewer initially placed more weight on branding outside the gallery
and accessibility uncertainty; Sol considered the ordinary styling useful and
did not treat missing mascot distribution as a demonstrated defect. Round two
preserved the evidence question without prescribing more ornament or packaging
the artwork. The parent agrees: owner recognition needs context, not a new
component or a higher score.

The initial Dialog objection could be solved with a wrapper retaining the old
default. That would create a lasting semantic distinction between named and
compound APIs. The parent chose one default plus an explicit alpha migration.
Round two accepted this documented tradeoff, while both Terra reviewers retained
the real upgrade risk. No unchanged downstream Dialog has been audited here.

Reviewers assigned different priorities to chip names, density and adoption
evidence. Repeated findings were merged, not counted as additional independent
defects. No aggregate score was invented and no target score drove additions.

## Validation and limits

Before the council, the migration passed type/docs/token checks, library and
showcase builds, 51 gallery cases and eight packed-consumer cases in each mode.
Those full gallery results predate the council corrections.

Between rounds, the parent passed type/docs checks, a production showcase build,
seven targeted gallery cases and nine packed-consumer cases in each of plain
React and consumer Tailwind. Consumer checks include compiling the five actual
copied recipes, public types, tarball contents/links/licenses, DOM-free SSR,
hydration, scoped portals and consumer overrides. Sol independently verified
copied-source identity and the existing packed-consumer TypeScript check in
round two; reviewers did not independently rerun the full suites.

After the final corrections, `pnpm check`, `pnpm test:docs`, a production
showcase build, three targeted gallery checks and all nine packed-consumer
checks in each mode passed. These verify the default
and localized Combobox action names with Field label/description retention,
popup state/association, selection and nested focus, plus recipe edits after
save/discard. The consumer command also rebuilt/packed the library and checked
types, the five copied recipes, SSR/hydration and package contents/links.
Neither these checks nor the earlier results constitute a full human
accessibility audit. The final full gallery suite was not rerun. Formatting
and `git diff --check` also passed.

Round-one browser failures limited independent visual/interaction coverage.
Round two added successful live accessibility-tree and visual samples at
verified 390px and 1280px viewports; Sol also inspected a 320×568 Dialog and
exercised validation, contained tab navigation, Escape/focus return, async
selection, chip removal and retry/edit feedback. Later automation timeouts
prevented its independent Menu handoff check. Implementation Terra did not
complete a narrow interaction/visual audit. Tool timeouts are limitations, not
confirmed product defects. Supplied older screenshots are historical evidence.

Still unverified: human screen-reader speech, 200% zoom, long translations,
physical touch/virtual keyboard ergonomics, all themes/states, actual downstream
upgrades, a fresh install of the published artifact, comparative agent task
time, cross-app identity and longitudinal upstream maintenance cost. The guide's
release facts come from repository release records, not a new live registry
audit. Large generated-doc chunks still produce build-size warnings.

## Next evidence to collect

Use the existing package to compose one realistic app-owned workflow with
populated, empty, loading and error states, in both themes and narrow/wide
views. Review it without gallery branding and let the owner judge whether it
feels like their style. Observe an agent following only installed consumer
guidance: record incorrect API guesses, local styling escapes and owner
interventions, rather than asserting agent efficiency from familiar names.

Run a bounded human keyboard/screen-reader, zoom and long-content review of that
workflow, and change density/targets where it reveals difficulties. When a
useful upstream change naturally appears, record the work to adapt and verify
it. These are proposed evidence tasks; no other app migration, publication,
deployment, source registry or further review round was performed or authorized
by this council.

## Whole-project extension

A later owner request starts a separate sequence: two full-project review and
refinement rounds, then a third round with Receipt, Split-flap, Guarded action,
Allocation bar, XY pad and Radial menu. Each round uses two GPT-6.1 Terra and
three GPT-6.1 Sol reviewers at xhigh, including an independent sceptic/simplifier.
A separate three-member research mini-council proposes additional components;
its coverage-fit judgments are not implementation scores or extra audit rounds.
No further publication, deployment or other application work is included.

| Member and primary lens            |             Round 1 |             Round 2 |             Round 3 |
| ---------------------------------- | ------------------: | ------------------: | ------------------: |
| Terra — correctness/integration    |              7.5/10 |              7.5/10 | 7.6/10, provisional |
| Terra — visual/accessibility       | 7.5/10, provisional | 7.5/10, provisional | 7.4/10, provisional |
| Sol — product/workflows            |              7.8/10 |              8.1/10 |              8.0/10 |
| Sol — docs/agent/package contracts |              8.0/10 |              8.2/10 |              8.2/10 |
| Sol — sceptic/simplifier           |              7.5/10 |              8.0/10 |              8.0/10 |

Round one froze all 161 maintained tracked/nonignored files at the same HEAD.
All five reviewers verified hashes, HEAD and working-tree status. Their reports,
per-file reading inventories and source manifest are under
`.local/project-council-2026-10-30/r1/`. The Terra reports explicitly disclose
incomplete primary-source reading caused by truncated outputs. Collective
coverage and the parent's bounded supplementary reads are stronger than either
alone; they are not an exhaustive line-by-line or real-world audit. Round two
must fill remaining primary-surface gaps with bounded reads. Integrity hashes
never count as substantive review.

Accepted round-one refinements:

- Reproduced the closed keep-mounted Dialog pointer blocker before changing
  its Theme wrapper from fixed to relative. Page clicks now work before opening
  and after closing, with the draft retained. Added an installed-artifact case.
- Recovery actions focus a persistent queue/settings heading before their
  transient controls disappear. Corrected study edit-lifetime copy, made the
  retained-queue Empty preview explicit in app-only mode, and seeded Russian
  sample description only at initial mount. Locale changes preserve edits.
- Packed browser readiness checks an owned run/mode marker and process health,
  retains startup diagnostics, and never adopts or kills an unrelated listener.
  Added real local stale-response/port-collision/startup regressions.
- Deployment transport failure now requests guarded rollback, preserving its
  failure status and credential cleanup. Stubbed client cases cover failures
  before/after promotion, verification failure, rollback uncertainty and success.
  These are local tests, not operations against the deployed service.
- Fixed portable public type aliases and explicit upstream attribution; identical
  reflected API parts serialize once and closed reference bodies mount on demand.
  Canonical names, legacy links and distinct composed contracts remain available.
- Kept the original logo/provenance and generated a small display derivative.
  Fixed standalone sheet theme scope, stale Menu/reduced-motion wording and
  copy-feedback lifetime. Date submission feedback is explicitly historical.
- Removed the orphaned HTML implementation plan, shortened speculative registry
  planning and made contributor reading depend on the affected contract.

The Empty preview remains a view over retained data: deleting authored tasks to
make it look like first use would undo a prior correctness fix. The cheaper
truthful disclosure was chosen. Physical left coordinates alone do not establish
an RTL bug; that risk needs actual layout/behavior evidence. Human accessibility,
owner recognition, useful upstream adaptation and real app-upgrade economics
remain unverified and are not resolved by more features or higher review scores.

Round-one refinements passed the complete `pnpm release:check`: seven API tests,
four fixture-startup tests, 98 palette pairs, production showcase, 62 gallery
tests and eleven packed-consumer tests per plain/Tailwind mode (22 total).
Eight local deployment client/receiver tests and shell syntax also passed.
The successful log is `r1/parent/release-check-corrected.log`; the earlier
`release-check.log` remains a failed invocation caused by the old singleton
theme assertion. Formatting and refreshed four captures/two real interaction
clips are recorded alongside it. No source was published or deployed.

Measured generated reference data fell from 17,042,616 to 11,742,369 bytes while
retaining all 191 public names. The display mark is 53,440 bytes; the untouched
original is 1,660,761 bytes. The portable sheet is 169,309 bytes after using the
derivative instead of embedding the original twice. These are local artifact
sizes, not measured latency, app-runtime savings or accessibility outcomes.

Round two froze 163 files. All five verified the same hashes, HEAD and status;
the parent verified them again before unfreezing. The Terra visual report remains
partial and provisional. The sceptic completed all maintained primary text,
including both large browser suites and the complete stylesheets, in bounded
reads. This closes the collective reading gap without turning source coverage
into independent runtime or human accessibility evidence. Reports and per-file
inventories are under `.local/project-council-2026-10-30/r2/`.

Accepted round-two refinements:

- Runtime reproduction confirmed DatePicker could change while disabled after
  opening. It now closes and guards selection, and enabling it does not reopen
  the popup. Apps choose an enabled focus destination when externally disabling
  a focused control; the disabled trigger cannot receive focus.
- A real Theme-rendered RTL composition confirmed the fallback vertical line
  was on the wrong edge. Correct it and preserve a forced-colors selection cue.
  Initial horizontal RTL coordinates were correct. Changing Theme direction
  did leave the optional indicator stale: refresh only Base UI's decoration
  after the committed direction change, retaining tab selection and focus.
- A 200-character unbroken submitted name expanded the 320px recipe document to
  2191px. A zero-minimum form track and full-text wrapping keep it at 320px.
- Keep the empty-state action mounted while its label changes, preserving
  keyboard continuity in both directions without a focus manager. Move the
  Dispatch loading status outside its busy skeleton region; screen-reader
  speech remains unverified.
- Correct the active display-logo path, remove four proven unused gallery
  selectors and narrow test titles to the assertions they actually make.
  Defer broad cascade reorganization and speculative process-supervision work.

The archived adoption trial remains unchanged, including its source-inferred
transient filter-action focus risk. Recompiling that archive does not repeat
adoption or improve the original agent result. Closed reference bodies are
intentionally absent from browser Find until opened and remount on reopening.
Those tradeoffs do not justify a new runtime or delivery abstraction.

Round-two refinements passed the generated API step, corrected TypeScript check,
four affected gallery cases and all thirteen packed-consumer cases per
plain/Tailwind mode (26 total), including SSR/hydration, public/copied types and
package boundaries. Parent runtime probes verified the reported transitions and
long-content failure before fixing them. The first packed run exposed a
production-only `:dir()` transformation; logical CSS positioning then passed
both consumer modes. Failed initial typing/consumer logs remain alongside the
corrected results. These are targeted follow-up checks, not another complete
release gate or a new council score.

Before round three, all six owner-selected studies were integrated in Devspace
with separate experimental catalogue metadata and documented behavioral limits.
They add no dependency or npm export. Receipt and Split-flap explore registered
data and changing readouts; Guarded action and Radial menu reuse existing overlay
behavior; Allocation bar and XY pad include ordinary exact-input alternatives.
The garden crop is app-owned artwork. Promotion remains a separate decision.

The integrated revision passed the complete release gate: seven API tests, four
fixture-startup tests, 98 palette pairs, builds, 78 gallery cases and thirteen
packed-consumer cases in each mode (26 total). Formatting also passed. The first
gate exposed a stale source assertion, a timeout and axe reports on Base UI's
hidden Tab-routing sentinels. The corrected audit retains a full closed-page
scan, narrowly excludes those markers in the open Devspace scan, and adds a
trusted pointer/keyboard Tab and Shift+Tab regression. No global rule is disabled
and no human assistive-technology result is implied.

A local production trace then reproduced Devspace layout shift when the lazy
studies displaced already visible content (CLS0.194). Including the following
portal/guidance in the loading boundary and reserving loading space removed
observed shifts in the repeated sample. The rebuilt showcase passed all fifteen
signature cases again and TypeScript. This follow-up concerns gallery loading;
the earlier complete gate predates that small correction. The profile was one
unthrottled loopback sample per route on a desktop, with revalidated resources;
it establishes no cold-load, mobile, field or INP result.

Round three completed the requested sequence on a frozen 183-file baseline.
All five reviewers and the parent verified hashes, sizes, HEAD and exact status
before the final parent corrections. Reports and reading inventories remain
under `.local/project-council-2026-10-30/r3/`. Both Terra whole-project passes are
incomplete and their scores provisional. Across members, 144 paths received a
complete static read, 30 structural/sampled coverage and nine binary checks.
Every new study module/style/helper/spec and the primary guides were read;
several existing large style/test/fixture bodies were sampled this round.
This is not five exhaustive audits, and integrity does not replace reading.

The council recommends keeping the shared npm core and excluding all six from
public exports. Receipt and Guarded action may remain recipes; Allocation has
the strongest finite-total task, while Split-flap is a narrow expressive option.
XY needs actual positioning use. Radial has the weakest productization case:
keep the owner's study for feedback, use ordinary Menu in apps and require a
concrete repeated-position benefit before doing further general-purpose work.

Accepted final parent corrections:

- Catch rejected lazy study loads with gallery-only recovery, retained navigation
  and a real Reload action. React.lazy caches rejection; rerendering alone is
  not presented as retry. Cover both Devspace and App studies.
- Restore heading focus and scroll when reselecting the active study link,
  preserving modifier links and mounted scene edits.
- Isolate XY coordinate order and allocation quantities within RTL layouts.
  Inactive XY surfaces allow native touch panning without changing the frame.
- Let app-owned XY visuals render temporary coordinates through one pure render
  slot. The crop follows a drag; release commits, cancellation/lost capture
  restores the controlled frame. Ranges and exact values follow that preview.
  This is the parent's choice among differing recommendations: some reviewers
  preferred merely labeling the applied frame. No effect synchronization layer
  or image-processing runtime was added, and no unanimous endorsement is claimed.
- Replace private Guarded action descendant selectors with owned markup/classes;
  inspect real animated flap leaves in reduced-motion tests and finite/latest
  reading behavior in normal motion. The earlier assertion was ineffective,
  although the CSS behavior itself worked in reviewers' probes.
- Surface the readout's script restriction beside its editor, explain allocation
  boundary editing, correct recipe/portal wording and repair eight historical
  source links while preserving their historical line context.

The final build, TypeScript and all 21 focused production signature checks
passed, including injected chunk failures/reload, same-link focus, crop preview/
lost capture, unequal RTL coordinates, actual Chromium touch panning and animated
leaf suppression. The complete production gallery suite then passed all 84
cases; formatting and all 69 checked local Markdown file targets also pass.
The final screenshot pass exposed a cover-content alignment regression after
removing the private selector. An owned root grid corrected it; the rebuild
and all ten affected action cases passed afterward.
The earlier 26 packed-consumer passes concern the unchanged package source;
the final corrections affect gallery, experiments, tests and documentation.
These
parent changes were made after the scored baseline and are not independently
rescored. No fourth round, npm promotion, release or deployment was performed.

Outstanding evidence includes owner recognition and usefulness, real app
adoption/upgrades, human assistive technology, physical touch/zoom, crowded
allocation grips and numeric extremes/fixed parts, other browser engines and
longitudinal maintenance or agent productivity. The scores are review judgments;
the requested 10/10 target was not achieved or asserted.

## Owner feedback after the final showcase

On 2026-10-30 the owner rejected the six new studies for missing the visual style
and functionality of the original imagegen concepts. The implementation and
review briefs retained the names and generic tactile guidance but omitted the
specific images and interaction requirements. The council therefore reviewed
substituted designs. Its scores and passing tests do not establish successful
delivery of the selected concepts. The source and historical scores remain
recorded; this feedback supersedes any implication of owner acceptance.

Reference fidelity and the intended job must be explicit acceptance conditions
for reconstruction. In particular, objections to the delivered four-button cross
do not establish that the originally requested six-sector contextual radial menu
should be abandoned. No further council or promotion is implied.

The subsequent reconstruction restores all six reference constructions and their
intended jobs in Devspace: issuing export slip, folding tally, hinged cover,
conserved material allocation with locks, signed shadow offsets and six-sector
contextual fan. It is a new, unscored revision pending owner acceptance. Current
contracts are in [Signature studies](./signature-studies.md); none of the prior
council scores or test counts certify the reconstructed set.
