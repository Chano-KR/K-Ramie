# Contributing to K-Ramie

K-Ramie is a Korean-first fork of [Kami](https://github.com/tw93/Kami). It tracks Kami via the `upstream` git remote and cherry-picks non–language-specific improvements (stabilizer rules, lint fixes, render pipeline) on a rolling basis. Anything language-specific to Chinese, Traditional Chinese, or Japanese is intentionally out of scope — that domain belongs to upstream Kami.

## Setup

```bash
git clone https://github.com/Chano-KR/K-Ramie.git
cd K-Ramie
git remote add upstream https://github.com/tw93/Kami.git
git fetch upstream
```

## Syncing from upstream

```bash
git fetch upstream
git log --oneline upstream/main ^main          # what's new upstream
git cherry-pick <commit>                       # pick non-ZH/JA improvements
```

When deciding whether to cherry-pick:

- **Pick** — stabilizer profile tweaks, lint rules, render-pipeline fixes, dependency bumps, CI improvements, build script refactors, documentation that is language-neutral.
- **Skip** — anything that re-introduces `index-zh.html` / `index-tw.html` / `index-ja.html`, TsangerJinKai / YuMincho / Source Han Serif SC|TC|JP font references, ZH/JA demo assets, or Chinese / Japanese sample content in templates.
- **Translate** — when upstream adds a new template, translate the default-slot sample content to Korean and update the `:root --serif` to the K-Ramie chain before merging.

## Phase boundaries

K-Ramie is built in four phases (see `C:\Users\issac\.claude\plans\velvet-popping-bubble.md` for the full plan):

1. **Phase 1 — Core Korean localization.** Brand rename, ZH/JA strip, KO font stack, template content KO-ization, reference docs.
2. **Phase 2 — Slide presentation subsystem.** `slides-keynote`, `slides-pitch`, `slides-vertical` template families with deterministic per-template spacing and strict text-density limits.
3. **Phase 3 — Blog / personal-website subsystem.** `blog-index`, `blog-post`, `blog-series` long-form templates.
4. **Phase 4 — Remotion / Hyperframes video subsystem.** Drop-in `remotion-skill/` modular layer.

One PR per phase. Each phase ends with a green `python3 scripts/build.py --check` and `python3 scripts/build.py --verify`.

## House rules

These are inherited from Kami's `AGENTS.md` and apply to all K-Ramie work:

- Per-template inline `:root` redeclaration. No shared CSS partial.
- `scripts/shared.py::HTML_TEMPLATES` is the single template registry. Touch only there when adding or removing templates.
- Reference documentation is English-only. Korean-specific output lives in templates, not duplicated reference files.
- `references/cross_template_diff_allowlist.json` governs which `:root` variables may drift between paired language variants. Add new CSS variables there before relying on per-variant drift.
- Do not bundle commercial fonts into `dist/k-ramie.zip`. Keep web fallbacks.
- `stabilize.py` / `lint.py` / `verify.py` / `checks.py` are keyed by template name in the registry. Each new template gets a stabilizer profile entry.
- No graphic emoticons in docs, template comments, or script output. Use `OK:` and `ERROR:` for status text.

## Korean writing in templates

- Body line-height 1.7–1.8 for serif body, letter-spacing −0.005em.
- Headings letter-spacing −0.02em.
- `word-break: keep-all`, `line-break: strict`, `overflow-wrap: anywhere` on text containers.
- Latin substrings inside Korean body wrap with `<span class="lat">...</span>` so they pick up the `--latin-ui` proxy stack.
- 띄어쓰기 follows the National Institute of Korean Language baseline.
- Formality (해체 ↔ 합니다체) chosen per template tone; see `references/writing.md` for the rules.

See `references/design.md` for the full Korean typography section and `references/writing.md` for the writing rules.

## Commit style

Conventional Commits. Caveman-compressed messages are welcome (see the `caveman-commit` skill).

## Issue / PR

GitHub issues and PRs at <https://github.com/Chano-KR/K-Ramie>.
