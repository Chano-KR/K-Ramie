<div align="center">
  <h1>K-Ramie</h1>
  <p><b>A Korean-first quiet design system for professional documents.</b></p>
  <a href="https://github.com/Chano-KR/K-Ramie/stargazers"><img src="https://img.shields.io/github/stars/Chano-KR/K-Ramie?style=flat-square" alt="Stars"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"></a>
  <a href="https://github.com/tw93/Kami"><img src="https://img.shields.io/badge/fork%20of-tw93%2FKami-purple?style=flat-square" alt="Upstream"></a>
</div>

## Why

K-Ramie is a Korean-first fork of [Kami](https://github.com/tw93/Kami). Korean documents have their own typographic rhythm — Hangul body density, mixed Hangul–Latin runs, and the word-break behavior that Western serif systems assume away. K-Ramie keeps Kami's constraint-language architecture (one accent, serif-led hierarchy, editorial whitespace) and re-tunes every layer for Korean as the default language. English is paired in `-en` variants. Chinese and Japanese are intentionally out of scope.

On top of the core document system, K-Ramie ships three additional subsystems:

- **Slides** — keynote / pitch / vertical deck templates with deterministic per-template spacing and strict text-density limits
- **Blog** — long-form personal-website templates (index, post, series) with Korean reading typography
- **Video** — a drop-in modular layer (`remotion-skill/`) that attaches to an existing Remotion harness without modifying it; splits heavy motion (Remotion) and lightweight scenes (Hyperframes) and stitches them with ffmpeg

## Install

**Claude Code**

```bash
npx skills add Chano-KR/K-Ramie -a claude-code -g -y
```

**Claude Code plugin marketplace** (requires Claude Code v2.1.142+)

```bash
/plugin marketplace add Chano-KR/K-Ramie
/plugin install k-ramie@k-ramie
```

**Generic agents** (Codex, OpenCode, Pi, other tools that read from `~/.agents/`)

```bash
npx skills add Chano-KR/K-Ramie -a '*' -g -y
```

**Claude Desktop**

Download `k-ramie.zip` from GitHub Releases, open Customize → Skills → "+" → Create skill, and upload the ZIP directly.

**Optional: brand profile**

Create `~/.config/k-ramie/brand.md` to persist identity, brand, defaults, and writing habits. See [brand.example.md](references/brand.example.md).

## Languages

K-Ramie produces output in Korean (default) and English (`-en` variants). The system optimizes for:

- Korean body typography — `word-break: keep-all`, `line-break: strict`, `overflow-wrap: anywhere`, line-height 1.7–1.8 for serif body, letter-spacing −0.005em on body / −0.02em on headings
- Mixed Korean–Latin runs — Latin substrings inside Korean text inherit a `--latin-ui` proxy stack so they don't collide with the Hangul serif
- Korean punctuation, formality (해체 ↔ 합니다체), 띄어쓰기 baseline — codified in [writing.md](references/writing.md)

Example prompts:

- 한국어: `스타트업용 원페이저 만들어줘` / `이 자료로 장문 보고서 만들어줘` / `격식 있는 편지 작성해줘` / `프로젝트 포트폴리오 만들어줘` / `이력서 만들어줘` / `발표용 슬라이드 만들어줘` / `랜딩페이지 만들어줘`
- English: `make a one-pager for my startup` / `turn this research into a long doc` / `write a formal letter` / `make a portfolio of my projects` / `build me a resume` / `design a slide deck for my talk` / `build a landing page for my app`

## Design

Warm parchment canvas, ink blue as the sole accent, serif carries hierarchy, no hard shadows or flashy palettes. Not a UI framework; a constraint system for printed matter.

Template families: One-Pager, Long Doc, Letter, Portfolio, Resume, Slides (Weasy / Keynote / Pitch / Vertical), Equity Report, Changelog, Landing Page, Blog (Index / Post / Series).

| Element | Rule |
|---|---|
| Canvas | `#f5f4ed` parchment, never pure white |
| Accent | Ink blue `#1B365D` only, no second chromatic hue |
| Neutrals | All warm-toned (yellow-brown undertone), no cool blue-grays |
| Serif | Body 400, headings 500. Avoid synthetic bold |
| Line-height (KO body) | 1.7–1.8 serif body, 1.4–1.5 slides, 1.85 blog long-form |
| Letter-spacing (KO) | Body −0.005em, headings −0.02em |
| Word-break (KO) | `word-break: keep-all`, `line-break: strict`, `overflow-wrap: anywhere` |
| Shadows | Ring or whisper only, no hard drop shadows |
| Tags | Solid hex backgrounds only — `rgba()` triggers a WeasyPrint double-rectangle bug |

**Fonts.** See [FONTS.md](FONTS.md) for the full license map.

| Role | Stack |
|---|---|
| Serif (body) | Chosunilbo Myungjo → Bareun Batang → KoPub World Batang → Noto Serif KR → Source Han Serif K → Nanum Myeongjo → Georgia |
| Sans (UI) | Pretendard → Noto Sans KR → Apple SD Gothic Neo → Malgun Gothic → system-ui |
| Mono (code) | JetBrains Mono → D2Coding → Fira Code → SF Mono → Consolas |
| Display (opt-in only) | Sandoll Gukdae Tteokbokki — gated behind `.display` / `.poster` / `.hero-mark` classes, never inherited by body or slide titles |
| Latin-UI proxy | Charter → Georgia → Iowan Old Style → Palatino |

Full spec: [design.md](references/design.md). Cheatsheet: [CHEATSHEET.md](CHEATSHEET.md).

## Subsystems

### Slides (`slides-weasy`, `slides-keynote`, `slides-pitch`, `slides-vertical`)

Deterministic per-template spacing (letter-spacing and line-height fixed per template), strict text-density limits (≤ 28자 title, ≤ 3 bullets, hard cap on slide word count). Enforced by `scripts/slide-density.py` via `scripts/lint.py`. Export to PDF (WeasyPrint) or screen (decktape via `scripts/export-deck.sh`).

### Blog (`blog-index`, `blog-post`, `blog-series`)

Long-form personal-website templates derived from `landing-page.html`. Korean reading typography (line-height 1.85, no first-line indent, optional KO drop-cap), Open Graph `og:locale = ko_KR` defaults, JSON-LD `BlogPosting`, RSS feed via `scripts/build-blog-feed.py`, static-site assembly via `scripts/build-blog.py`.

### Video (`remotion-skill/`)

Drop-in modular layer that attaches to an existing Remotion harness without modifying it. Workload split:

- **Remotion** — heavy motion, complex keyframing, state-driven animation (title cards, data chart reveals, multi-page section transitions)
- **Hyperframes** — lightweight scenes, rapid render, deterministic per-frame (KO subtitles, lower thirds, image pans, color tiles, outro stings)

Multi-pipeline stitching via `ffmpeg` against a scene manifest. Execution modes: `remotion-only` / `hyperframes-only` / `hybrid`. Korean captions hardcode Pretendard for legibility. See [remotion-skill/README.md](remotion-skill/README.md) and [remotion-skill/INTEGRATION.md](remotion-skill/INTEGRATION.md).

## Relation to upstream Kami

K-Ramie tracks `tw93/Kami` via the `upstream` git remote. Non–language-specific upstream improvements (stabilizer rules, lint fixes, render pipeline) are cherry-picked. ZH / TW / JA index pages, demo assets, and `html[lang]` blocks are intentionally stripped — those are Kami's domain. See [CONTRIBUTING.md](CONTRIBUTING.md) for the sync workflow.

## License

MIT License for K-Ramie code and templates. See [FONTS.md](FONTS.md) for per-font licensing terms — every bundled or referenced font is free for commercial use, but Sandoll Gukdae Tteokbokki forbids CI/BI use (which is why it's isolated to the `--display` opt-in slot and never used for body or titles).

Upstream credit: Kami by [tw93](https://github.com/tw93/Kami) — MIT.
