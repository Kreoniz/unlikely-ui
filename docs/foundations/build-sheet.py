"""Build the review sheet and check its palette; Python standard library only."""

import base64
import html
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
CSS = ROOT.joinpath("../../src/styles/tokens.css").read_text()
BLOCKS = re.findall(
    r"\.u-theme(?:\[data-appearance=['\"]dark['\"]\])?\s*\{(.*?)\n\}",
    CSS,
    re.S,
)[:2]
assert len(BLOCKS) == 2, "Expected the light default and dark appearance blocks"


def parse(block):
    return dict(re.findall(r"(--u-[\w-]+):\s*([^;]+);", block))


LIGHT = parse(BLOCKS[0])
THEMES = {"light": LIGHT, "dark": {**LIGHT, **parse(BLOCKS[1])}}


def resolve(tokens, key):
    value = tokens[key]
    seen = {key}
    while value.startswith("var("):
        key = value[4:-1]
        assert key not in seen, f"Circular token alias: {key}"
        seen.add(key)
        value = tokens[key]
    return value


def luminance(color):
    rgb = [int(color[i : i + 2], 16) / 255 for i in (1, 3, 5)]
    linear = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in rgb]
    return sum(v * weight for v, weight in zip(linear, (0.2126, 0.7152, 0.0722)))


PAIRS = []


def check(theme, tokens, foreground, background, minimum, kind):
    a = luminance(resolve(tokens, foreground))
    b = luminance(resolve(tokens, background))
    ratio = (max(a, b) + 0.05) / (min(a, b) + 0.05)
    PAIRS.append({
        "appearance": theme, "foreground": foreground, "background": background,
        "ratio": round(ratio, 2), "minimum": minimum, "pass": ratio >= minimum,
        "kind": kind,
    })


for name, tokens in THEMES.items():
    for background in ("canvas", "surface", "surface-raised", "well", "surface-hover"):
        for foreground in ("ink", "muted", "accent-text"):
            check(name, tokens, f"--u-{foreground}", f"--u-{background}", 4.5, "text")
        for foreground in ("line", "focus"):
            check(name, tokens, f"--u-{foreground}", f"--u-{background}", 3, "control/focus")
    for background in ("accent", "accent-hover", "accent-pressed"):
        check(name, tokens, "--u-accent-ink", f"--u-{background}", 4.5, "button text")
    check(name, tokens, "--u-accent-text", "--u-accent-soft", 4.5, "selection text")
    for status in ("success", "warning", "danger", "info"):
        check(name, tokens, f"--u-{status}", f"--u-{status}-soft", 4.5, "status text")
        check(name, tokens, f"--u-{status}-border", f"--u-{status}-soft", 3, "status outline")
    check(name, tokens, "--u-accent-border", "--u-accent-soft", 3, "selection outline")
    check(name, tokens, "--u-selection-ink", "--u-selection", 4.5, "selection text")
    check(name, tokens, "--u-selection-border", "--u-selection", 3, "selection outline")
    for category in range(1, 7):
        check(name, tokens, "--u-category-ink", f"--u-category-{category}", 4.5, "category text")
    for state in ("hover", "pressed"):
        check(name, tokens, "--u-danger", f"--u-danger-soft-{state}", 4.5, "danger button text")
    check(name, tokens, "--u-physical-ink", "--u-physical-cap", 4.5, "physical button label")

ROOT.joinpath("contrast.json").write_text(json.dumps({
    "method": "WCAG relative luminance, opaque sRGB; palette checks only",
    "pairs": PAIRS,
}, indent=2) + "\n")
failures = [pair for pair in PAIRS if not pair["pass"]]
assert not failures, json.dumps(failures, indent=2)

ROLES = (
    ("canvas", "Canvas"), ("surface", "Surface"), ("surface-raised", "Raised"),
    ("ink", "Primary text"), ("muted", "Secondary text"), ("line", "Control border"),
    ("accent", "Accent fill"), ("accent-text", "Accent text"),
)
BRAND_MARK = ROOT.joinpath("../../dev/public/button-logo.png")
assert BRAND_MARK.is_file(), "The review sheet needs dev/public/button-logo.png"
MARK_URI = "data:image/png;base64," + base64.b64encode(BRAND_MARK.read_bytes()).decode("ascii")
samples = []
for name, tokens in THEMES.items():
    rows = "".join(
        f'<div class="color-row"><span class="color-mark" style="background:var(--u-{role})"></span>'
        f'<span>{label}</span><code>{html.escape(resolve(tokens, "--u-" + role).upper())}</code></div>'
        for role, label in ROLES
    )
    categories = "".join(
        f'<span class="category" style="background:var(--u-category-{n})">Group {chr(64 + n)}</span>'
        for n in range(1, 7)
    )
    samples.append(f'''<section class="u-theme sample" data-appearance="{name}" aria-label="{name.title()} palette">
      <div class="sample-top"><div class="brand"><img src="{MARK_URI}" alt="">unlikely ui</div><span class="appearance">{name.title()}</span></div>
      <h2>Make room for<br>what matters.</h2>
      <p class="sample-desc">Calm foundations. A playful streak.</p>
      <div class="product"><strong>Your next good idea.</strong><p>A small project is a good place to start.</p><label for="project-{name}">Project name</label><input id="project-{name}" placeholder="Something unlikely"><div class="actions"><button type="button" class="primary">Create project ↗</button><button type="button" class="secondary">Browse projects</button></div></div>
      <div class="feedback" role="status">✓ Changes saved. You're all set.</div>
      <div class="selection">✓ Selected item <span>Selection role</span></div>
      <p class="eyebrow">Semantic color roles</p><div class="palette">{rows}</div>
      <p class="eyebrow">Status roles</p><div class="statuses"><span class="status success">Success</span><span class="status warning">Warning</span><span class="status danger">Error</span><span class="status info">Info</span></div>
      <p class="eyebrow">Categorical fills · same labels in both themes</p><div class="categories">{categories}</div>
    </section>''')

spacing = "".join(
    f'<div class="spacing-item"><div class="space-mark" style="width:{n}px;height:{n}px"></div>{n}</div>'
    for n in (4, 8, 12, 16, 24, 32)
)
minimum_text = min(pair["ratio"] for pair in PAIRS if pair["minimum"] == 4.5)
minimum_outline = min(pair["ratio"] for pair in PAIRS if pair["minimum"] == 3)
contrast = (
    f"{len(PAIRS)} palette contrast pairs checked · minimum text {minimum_text}:1 · "
    f"minimum identifying outline {minimum_outline}:1."
)
output = ROOT.joinpath("token-sheet.template.html").read_text()
for key, value in {
    "TOKENS": CSS, "SAMPLES": "\n".join(samples), "SPACING": spacing, "CONTRAST": contrast,
}.items():
    output = output.replace(f"%%{key}%%", value)
assert "%%" not in output, "Unresolved template placeholder"
ROOT.joinpath("token-sheet.html").write_text(output)
print(f"Generated token-sheet.html. {contrast} All pairs passed.")
