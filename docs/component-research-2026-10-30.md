# Additional component research — 2026-10-30

One independent research pass used GPT-6.1 Sol and two GPT-6.1 Terra reviewers,
all at xhigh. Each rated **existing component-coverage fit 7/10**. These are not
implementation scores, proposal scores or a consensus on personal style.
Reports contain 50 primary-reference entries covering 42 normalized pages,
including disclosed indexed-only and failed-access limits. The parent checked
the central platform/design-system claims and added two separate proposals.

The research identifies useful gaps more confidently than a new signature.
Ordinary ruled rows can be useful without meeting the owner's distinctiveness
goal. Static concepts and local interactive studies do not prove usability,
accessibility, owner recognition or maintenance savings.

## Shortlist

| Proposal          | Starting point                   | Boundary                                                    |
| ----------------- | -------------------------------- | ----------------------------------------------------------- |
| File picker       | Native-input component candidate | Selection and clear; app owns validation/upload             |
| Disclosure strip  | Native-first behavior experiment | Summary and in-flow details; avoid a card abstraction       |
| Progress strip    | Base UI component candidate      | Truthful value or indeterminate state; app owns work        |
| Image comparison  | Parent's expressive candidate    | Matched before/after visuals with ordinary alternatives     |
| Copy block        | Recipe                           | Explicit value, promise/error and changing-payload feedback |
| Page outline      | Recipe                           | Explicit heading IDs, native anchors and focus destinations |
| Review rows       | Recipe                           | Semantic key/value summary and contextual actions           |
| Selection actions | Parent's recipe proposal         | Existing controls; app owns selection, effects and focus    |

**File picker** is the strongest everyday addition: cover images, attachments and
imports share the selection problem. Start with one native input and a complete
filename row. Avoid mandatory dragging and a transport queue. USWDS documents
both the pattern and usability problems with combining drag/choose instructions.
[USWDS file input](https://designsystem.digital.gov/components/file-input/).

**Disclosure** should first test whether native details/summary suffices. **Progress**
can reuse Base UI's labeled numeric/indeterminate contract; never fabricate a
percentage or confuse an ordered task list with measured work.
[Native details](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details),
[Base UI Progress](https://base-ui.com/react/components/progress).

**Image comparison** could make the material edge useful: moving it exposes a
real visual difference. The interaction is established, not a novel invention.
The original CodyHouse example and Adobe's comparison workflow support the job;
our visual treatment and broader use contexts are proposals. Retain descriptions,
endpoint controls and a side-by-side alternative. Defer it if the owner's apps
rarely compare matched visual work.
[CodyHouse original](https://codyhouse.co/gem/css-jquery-image-comparison-slider),
[Adobe comparison workflow](https://helpx.adobe.com/lightroom/web/get-set-up/learn-the-basics/compare-photos.html).

The recipe candidates mainly compose existing controls or native semantics.
Copy must report actual success and reset feedback when its payload changes;
outline needs explicit destinations; review rows need meaningful key/value
structure; selection actions need an app-owned continuation when items disappear.
Generalizing Carbon's table batch actions to other collections is our inference.
[GitHub clipboard element](https://github.com/github/clipboard-copy-element),
[USWDS in-page navigation](https://designsystem.digital.gov/components/in-page-navigation/),
[GOV.UK summary list](https://design-system.service.gov.uk/components/summary-list/),
[Carbon batch actions](https://v10.carbondesignsystem.com/components/data-table/usage/).

## Design and scope decisions

Explore aligned edges, strong type, quiet rules, shallow depth and precise state
feedback. A mechanism should reveal useful information rather than add a new
task. Defer generalized diff/schema editors, workflow engines and speculative
reordering. Draggable controls require a single-pointer alternative as well as
keyboard operation. [WCAG dragging movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements).

No external assets were copied. Private source indices, independent reports,
access limits and unimplemented concept studies remain in ignored local research
artifacts. The interactive shortlist simulates file, clipboard and work outcomes;
it is not an installed package API or an upload service.

These proposals add no implementation scope. The separate owner-selected six
remain Receipt, Split-flap, Guarded action, Allocation bar, XY pad and Radial menu.
No new dependency, registry, publication or deployment follows from this research.
