# Signature studies

Six working experiments live at `#devspace`, under `dev/experiments/signature/`.
They are separate from the twenty-five package previews, have no npm exports and
are not published APIs. Their declarations contain the prop contracts; this
guide records behavior and limits rather than duplicating prop tables.

The owner selected all six for exploration. Implementation does not establish
their value in daily apps, personal recognizability or readiness for promotion.

The first studies were rejected on 2026-10-30 for missing the original imagegen
references and intended jobs. All six have now been reconstructed against those
references. This is an unaccepted checkout revision, not a renewed council score
or a package release.

| Study          | Useful job                               | Ownership boundary                                  |
| -------------- | ---------------------------------------- | --------------------------------------------------- |
| Receipt        | Issue a keepable result after completion | App owns operation, slip content and output actions |
| Split-flap     | Read a short changing count              | App supplies the complete reading                   |
| Guarded action | Lift a cover, then invoke a consequence  | App owns effect, progress, error and recovery       |
| Allocation bar | Distribute a finite total                | Controlled parts, bounds and conserved transfers    |
| XY pad         | Set signed CSS shadow offsets            | App defines axis meaning and renders the preview    |
| Radial menu    | Invoke six contextual actions            | App supplies one ordered action set and its effects |

## Behavior and limits

**Receipt** uses an article and description-list rows. An olive output slot
reveals a cream perforated slip only when `issued` is true. It performs no work,
parsing, printing or persistence itself. The scene prepares a real Markdown Blob
from selected notes, then offers a native download and clipboard copy with
truthful failure feedback. Changing the selection immediately removes obsolete
output actions and accessible success, while the retained paper falls and fades
out. Reissuing first clears the old slip, then issues the latest result. Entry
uses a deliberate 700ms default; exit takes 75% of that duration. The local
`duration` prop and scene slider tune timing; zero or reduced motion settles
immediately. Mid-flight reversals retain the rendered pose. The entry uses a
near-linear feed; the mobile scene reserves paper space to keep controls still.
Its picker and Prepare action precede the device, with output actions after it,
so keyboard activation keeps the slot nearby.

**Split-flap** exposes one complete accessible reading, with decorative cells
hidden from assistive technology. Changed glyphs fold once. An active 400ms cycle finishes before the latest
pending reading begins; intermediate requests coalesce into that one target.
There is no growing queue or overlapping flip. Positive `duration` changes apply
to the next cycle; zero, reduced motion or forced colors settle the latest value
immediately, including mid-cycle. The complete accessible reading always reflects
the latest supplied value. Cells retain left-to-right order in RTL themes.
They suit independent Latin/Cyrillic glyphs, digits and graphemes; use ordinary
text for joined or mixed-direction scripts. Intl.Segmenter groups graphemes where
available; its fallback is code points. This is a short readout, not a long-text
renderer, live-region manager or station-board engine. The scene's numeric field
allows an empty draft during editing; valid changes apply immediately and blur
normalizes or restores it.

**Guarded action** is an inline native disclosure: an opaque cream lid hinges
up to expose the existing coral PhysicalButton in an olive housing. Opening
changes no app data and retains cover focus; Tab reaches the separate action.
Cancel, the lifted cover and Escape close it. Confirmation does not implicitly
close; the app can control `open` after success. Closing restores cover focus,
or the persistent consequence heading if the closed cover is disabled. This
includes delayed completion while Cancel is focused; an outside focus choice
is preserved. Pending
blocks repeated confirmation while closing remains available; closing does not
cancel an app request. Closed cap content is inert and hidden from assistive
technology. The lid owns its 3D scene, separate from the housing, with separated
front/back faces. Its printed action label remains stable during travel and is
included in both accessible cover action names. Travel defaults to 500ms and
reverses continuously; `duration`, a scene slider, zero and reduced motion are
supported. The scene resets an editable local sandbox with a recovery copy,
disabled/pending states and a retryable failure. This is no security boundary.
Routine reversible actions may need only an ordinary action and recovery.

**Allocation bar** accepts at least two stable, ordered parts with non-negative
safe integer values, bounds and total. Moving a divider transfers units between
the nearest editable part on each side, preserving the total. A locked amount
stays fixed while its position can move; transfers can pass across locked parts.
Base UI Slider owns grip behavior;
fixed boundaries are noninteractive. Parts run physically left to right in every
text direction. Exact fields commit on blur, round/clamp to the effective bounds,
and restore the current value after an empty entry. Every part has exact entry,
including the last and zero-valued parts. Exact edits balance with the next
editable part, or the previous one if none follows. With no editable partner,
the field is read-only. Zero amounts remain in these controls. Very small adjacent
portions can crowd grips; exact entry remains the
ordinary alternative. No general constraint or budgeting engine is provided.
Percentage and weekly-hour scenes retain independent in-memory distributions.
Mint, cream and coral use opt-in physical materials and retain their paint colors
in both appearances. On narrow segments the full name/value can hide inside the
track; the labelled exact controls remain available below.

**XY pad** is controlled and uses safe integer bounds, ranges and in-range
values. X increases right, Y down (CSS coordinates), including in RTL. Native ranges and
exact fields provide keyboard and non-drag input. The pointer surface previews
locally, commits on release, and discards cancellation/lost capture. External
value, bound or interaction-state changes supersede a gesture. Disabled prevents
editing; read-only retains readable exact fields. Exact entry commits on blur.
Inactive surfaces allow native touch scrolling. An optional pure render slot
lets an app preview transient coordinates without committing effects. The study
starts at X +18/Y −12 and previews a real CSS shadow during dragging; cancellation
restores the applied offset. Zero axes, ticks, projected guides and signed
readouts follow the original sheet. Forced colors uses a translated system-color
silhouette for the shadow. Coordinate pairs stay explicitly LTR within RTL layout.

**Radial menu** uses Base UI ContextMenu for right-click/long-press invocation
and an ordinary Menu trigger for keyboard/touch access. Six separate cream
wedges surround the invocation point, shifting within viewport bounds; the
highlighted sector lifts outward in mint. Clockwise order is Copy, Duplicate,
Move, Pin, Delete, More. Base UI's Up/Down, typeahead and Escape follow that linear
order; no geometric arrow-key engine is added. During opening, Escape from the
opener or body uses Base UI's close action and cancels an obsolete deferred
pointer request. Once popup focus is installed, Base UI handles its keys.
Exactly six labels of at most
fourteen code points use the fan. Other counts, longer labels, explicit list
preference or very short viewports use the same ordinary list. Large custom
fonts may require list layout. The scene copies real note text, creates/selects
duplicates, moves, pins, deletes with recovery and expands details. Disabled
states and an enabled final focus destination remain app-owned. It is neither
a marking-gesture menu nor a nested radial system.

## Review and promotion

The scene links preserve local edits while staying in Devspace; leaving the page
or reloading resets them. The RTL control scopes direction to these six scenes.
The examples use local state and add no form/reset/serialization contract.

ContextMenu/Menu/Slider reuse existing Base UI behavior; the cover is a native
inline disclosure. Native numeric/range controls
remain available. No dependency, registry, second implementation, font request
or package export was added. Promotion requires owner feedback, suitable behavior
and packed-consumer checks, and separation of app-scene styling from runtime CSS.
Keep one implementation when moving a settled piece into `src/`.

Dedicated browser cases cover representative keyboard, focus, state transitions,
layout fallbacks and narrow layouts; scenes and the radial portal also receive scoped axe,
reduced-motion, forced-colors and simulated-touch checks. These do not establish
human screen-reader speech, physical touch, real zoom, every font/theme or a
cross-browser matrix. See the dated [whole-project council record](./council-review-2026-10-30.md)
for the reviewed baseline, actual scores and validation limits.

The focused [motion review](./motion-review-2026-10-30.md) records the owner's
follow-up concerns, two-round scope, decisions and current validation limits.
