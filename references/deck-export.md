# Deck Export

K-Ramie's slide subsystem supports two export paths. Pick by whether the deck depends on web fonts, CSS animations, or media that WeasyPrint cannot render.

## Path 1 · WeasyPrint (default)

```bash
python3 scripts/build.py slides-keynote
```

Renders the slide template through WeasyPrint, the same engine that produces every other K-Ramie document PDF. Use this path when the deck is text-and-shape only, no CSS animation, no `position: sticky`, no web fonts loaded from a CDN.

Pros: deterministic, headless, no browser dependency, exact spacing match across runs.
Cons: cannot render CSS animations, `position: sticky`, modern viewport units in some places, or web fonts that require a JS loader.

## Path 2 · Browser via decktape

```bash
bash scripts/export-deck.sh slides-keynote
bash scripts/export-deck.sh slides-vertical dist/vertical.pdf
```

Drives a headless Chromium via the `decktape` tool to capture each slide as it renders in a real browser, then assembles the captured frames into a PDF. Use this path when the deck depends on a browser feature WeasyPrint cannot reproduce.

Pros: full browser fidelity, CSS animations preserved, web fonts loaded normally.
Cons: requires `decktape` (`npm i -g decktape`) and chromium on PATH; non-deterministic timing (use `--load-pause` and `--pause` knobs in `export-deck.sh` when frames render incompletely).

## Aspect handling

`scripts/export-deck.sh` picks viewport size from the template name:

- `slides-vertical*` → 1080×1920 (9:16)
- everything else → 1920×1080 (16:9)

The WeasyPrint pipeline uses `@page` size declarations baked into each template's `:root`.

## Per-template typography

Each slide template carries deterministic per-template spacing CSS variables:

| Template | `--slide-body-tracking` | `--slide-body-leading` | `--slide-title-tracking` | `--slide-title-leading` |
|---|---|---|---|---|
| `slides-weasy`    | -0.005em | 1.45 | -0.01em  | 1.2  |
| `slides-keynote`  | -0.01em  | 1.5  | -0.02em  | 1.15 |
| `slides-pitch`    | -0.005em | 1.4  | -0.015em | 1.1  |
| `slides-vertical` | -0.005em | 1.55 | -0.02em  | 1.2  |

These are governed by `references/cross_template_diff_allowlist.json` and may legitimately drift between paired language variants.

## Text-density gate

`scripts/slide_density.py` enforces hard text-density limits per slide:

- Title ≤ 28자 (KO) / 60 chars (EN), single line, no terminal period
- ≤ 3 bullets per slide; each bullet ≤ 14자 / 40 chars
- No `<p>` longer than 80자 / 160 chars
- Total slide word count ≤ 60 KO 어절 / 100 EN words

Warnings (advisory only) fire when a slide has more than one `<p>` element. Run before exporting:

```bash
python3 scripts/slide_density.py                                # all slide templates
python3 scripts/slide_density.py slides-keynote slides-pitch    # subset
```

The gate runs in CI via `.github/workflows/check.yml` (Phase 2 addition).
