# Development assets

The workspace uses a red button logo beside its wordmark, a simplified button
favicon, and a local Inter font. The overview has no large logo image. These
assets are excluded from the npm package; importing the library loads none.

## Red button mascot

`dev/public/button-logo.png` is the current brand asset, generated on
2026-10-20 with the built-in image generation tool at the owner's request.
The reference was a screenshot of this repository's PhysicalButton, with its
round housing, default red cap, yellow hazard ring, and mint front indicator.
No character artwork was supplied to the generator. At the owner's request,
a subsequent built-in image edit changed the view to head-on. The current
revision widens the striped base around the red cap, following an earlier edit
that enlarged the framing and removed the indicator entirely. It retains
concentric circular rings and no perspective tilt.
The transparent RGBA output is copied into the repository without post-processing.

The [current edit record](./brand/red-button/2026-10-20/wider-base.json) preserves
the full prompt and links to the original generation record. Previous variants
are retained beside their generation/edit records.
The [reference capture](./brand/red-button/2026-10-20/component-reference.png)
records the component used for generation. Its cap label was omitted and the
indicator illuminated for the capture.

The wordmark uses the detailed PNG. `dev/public/favicon.svg` is a separately
authored small-size version for browser tabs: a large red face with a subtle
radial highlight, a continuous dark outline, and four broad yellow ring
segments. The geometry uses a 32-unit canvas and minimal transparent padding;
the former fine diagonal pattern is removed to avoid flecks at 16px. It uses
native SVG shapes and a gradient, with no additional generated image. The overview
illustration has been removed. The foundations sheet builder embeds the logo as
a data URI,
keeping that HTML portable without another editable copy. Its illustration
colors are independent of runtime semantic action/status tokens. The existing
PhysicalButton component's optional indicator API is unchanged.

The logo and favicon are brand artwork outside the software's MIT grant and are
not a new component or package export. This provenance record does not assert
exclusive rights to a generated image or reserve a trademark.

## Font

`dev/public/fonts/InterVariable.woff2` was reused from the existing local Campus
development asset. Its accompanying notice is preserved unchanged in
`dev/public/fonts/Inter-LICENSE.txt`. The font retains its SIL Open Font License;
it is not relicensed under the project's MIT grant. Upstream: [Inter](https://rsms.me/inter/).

## README images

The README reuses `dev/public/button-logo.png` without another editable copy.
`docs/images/showcase-dark.png` is an actual browser capture of
https://ui.kreoniz.ru/#overview in dark mode, at 1440×1050 CSS pixels and 2× pixel
density. Refresh it with `mise exec -- pnpm readme:screenshot`; the script uses
the existing Playwright dependency, waits for fonts and images, and changes no
page content. It captures the deployed showcase, which can differ from local work.

Both README image URLs point to GitHub-hosted files so they also resolve from
the npm README. The images remain outside the packed runtime; the screenshot
does not add a component export or change the logo's separate artwork terms.

## Retired artwork

The former character is no longer served by the workspace or referenced by
the foundations sheet. Its former active PNG files were moved to ignored
local backups at `.local/retired-assets/dev/public/mascot.png` and
`.local/retired-assets/docs/foundations/assets/mascot.png` on 2026-10-20.

Unused mascot, knot, and space exploration directories and the four dated
mascot-research documents were moved on 2026-10-20 into
`.local/retired-assets/docs/`, preserving their relative paths. These local
historical records are excluded from Git as well as npm. The first source
commit contains only the current red-button brand assets and their provenance.
The former supplied character's underlying rights are not changed or cleared
by this replacement. See [the pre-upload audit](./repository-audit-2026-10-20.md).
