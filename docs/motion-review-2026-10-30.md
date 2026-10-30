# Signature motion review — 2026-10-30

Two rounds of three independent GPT-6.1 Sol reviewers at xhigh assess the six
reconstructed studies and affected gallery/docs. This is a focused motion/UX
review, not a new whole-project audit or a promotion decision. The owner reported
fast Receipt entry, interrupted Split-flap motion and a clipping Guarded lid.
The original concept images and defect screenshots are explicit review inputs.

## Initial corrections

- Receipt has a 700ms adjustable entry, retained falling/fading exit, continuous
  reversal and a coalesced latest replacement. Obsolete output actions and
  accessible success disappear immediately. Zero/reduced motion settles.
- Split-flap completes its active 400ms cycle before the latest pending reading;
  intermediate requests coalesce. Zero/reduced/forced motion settles immediately.
- Guarded action isolates the lid's 3D scene, separates its faces, retains a
  stable printed action label and reverses continuously. Travel defaults to
  500ms, with local timing control and zero/reduced alternatives.

All three have scene timing controls. The mechanisms remain in Devspace, with no
new dependency, npm export, publication or deployment.

## Council

| Sol reviewer                    | Round 1 | Round 2 |
| ------------------------------- | ------: | ------: |
| Product / interaction           |  8.3/10 |  8.6/10 |
| Visual / accessibility          |  8.3/10 |  8.6/10 |
| Implementation / simplification |  8.2/10 |  8.4/10 |

Round one verified the frozen 196-file checkout. All members viewed the original
references and owner screenshots and independently sampled current interactions.
They did not reproduce the original flap restart or lid cut-through. Each report
identifies its tested states and limits; hashes establish integrity, not coverage.
Raw reports and diagnostics remain private under `.local/motion-polish-2026-10-30/`.

## Between-round decisions

Accepted all five bounded findings:

- Reserve one mobile gallery device stage through empty, entry, steady, exit and
  removal; this removes the reproduced 95px control movement.
- Use a near-linear entry ease at the same 700ms default so most travel does not
  complete in the first 200ms. Actual feel still needs owner feedback.
- Preserve a temporary string draft in Completion count; clear-then-type works,
  valid edits update immediately, and blur normalizes/restores the value.
- Hide an entire narrow allocation amount when it cannot fit; exact entry remains.
- In forced colors, a translated system-color silhouette preserves the XY shadow
  relationship behind an opaque card, without disabling system adaptation.

The requested mechanisms and app/component ownership remain intact. No general
animation, text-measurement or form framework was added.

## Final parent corrections

Round two independently verified all five R1 fixes on the frozen 197-file
revision. After scoring, the parent made four bounded corrections:

- Restore focus before a focused Cancel button is removed by delayed completion;
  preserve an outside focus choice and the disabled-cover heading fallback.
- Put Receipt's picker/action before its stable device stage in DOM and mobile
  visual order, with compact narrow controls and result actions after the paper.
- Route early Escape on the radial opener through Base UI's public close action;
  normal popup keyboard behavior stays with Base UI.
- Use singular `note` for a one-note export.

These final changes are tested by the parent, not independently rescored. The
requested two rounds are complete; no third round or promotion was performed.

## Validation and limits

The frozen R2 baseline passed all **113 production-gallery tests**. After the
four final parent corrections, all **57 focused signature tests** passed,
including delayed Cancel/cap/outside focus, disabled-cover fallback, short-phone
keyboard visibility, single-note wording and repeated immediate Escape. This is
a focused rerun after the small corrections, not a claim that the full suite was
repeated on the final revision.

TypeScript/API generation, formatting and the production showcase build passed.
Six final scoped light/dark checks at 1280/390/320px found no measured study
overflow or WCAG-tagged axe violations. Actual browser recordings and sampled
motion frames supplement the interaction checks; no compositor performance score
is inferred. Detailed logs/captures remain under the private evidence directory.

These are Chromium DOM/keyboard/media and visual observations, not human
screen-reader speech, physical touch, real zoom, cross-browser compositing or
measured field performance. Owner recognition and daily usefulness remain open.
Historical whole-project scores in [the earlier record](./council-review-2026-10-30.md)
apply to earlier implementations and have not been reused here.
