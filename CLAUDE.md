# K-Ramie

Korean-first document-generation skill and template system. Editorial HTML templates + PDF/PPTX/PNG build pipeline. Fork of [tw93/Kami](https://github.com/tw93/Kami).

## Before starting

- Personal/global rules can live outside this repo; this file only records K-Ramie's Claude Code entry points and maintenance rules.
- Repository map, Working Rules, Current Risk Areas, Verification Details, Release Flow, and Fonts all live in `AGENTS.md`.
- Template design spec → `references/design.md`. Writing rules → `references/writing.md`. Anti-pattern checklist → `references/anti-patterns.md`. Korean font licensing and roles → `FONTS.md`. Fork sync workflow → `CONTRIBUTING.md`.

## Common commands

```bash
python3 scripts/build.py                   # build all targets
python3 scripts/build.py --check           # quick lint + token sync
python3 scripts/build.py --verify          # full verification
python3 scripts/stabilize.py all --report  # HTML template normalization
python3 scripts/tests/test_build.py        # test suite
bash scripts/ensure-fonts.sh               # Korean web font fetch / verify (POSIX / Git Bash / WSL)
pwsh scripts/ensure-fonts.ps1              # Korean web font fetch / verify (Windows PowerShell)
bash scripts/package-skill.sh              # build release archive (dist/k-ramie.zip)
```

## K-Ramie hard rules

- When changing styles, sync `references/design.md` and the per-template `:root` tokens — never patch a single point.
- When adding a template: copy from the nearest existing template, align with `references/design.md`, add demo coverage.
- No graphic emoticons in docs, template comments, or script output. Use `OK:` / `ERROR:` for script status.
- Templates inline their CSS — no shared partial. When fixing CSS drift, apply the same change across affected templates rather than introducing a build-time include.
- The canonical `HTML_TEMPLATES` registry lives in `scripts/shared.py`. Add or remove templates there only — do not edit per-script dicts in `build.py` / `stabilize.py`.
- Do not bundle large commercial fonts in `dist/k-ramie.zip`. Templates must keep stable local-preview paths and rely on system fallback chains.
- `dist/k-ramie.zip` is a tracked release artifact. Small fixes usually refresh the latest release asset rather than cutting a new tag.
- After changing build / stabilize / packaging code, refresh and inspect `dist/k-ramie.zip`. When adding helpers / modules / reference JSON, confirm the file is tracked by Git and enters the package.
- Do not commit one-off review reports or diagnostic snapshots. Stable rules belong in `AGENTS.md`, `SKILL.md`, or `references/`; everything else gets discarded.

## Korean / English scope

- Default-slot templates (no suffix) render Korean. `-en` variants render English. ZH / TW / JA are out of scope — they belong to upstream [Kami](https://github.com/tw93/Kami).
- Cross-template `:root` drift between a default-slot template and its `-en` pair is governed by `references/cross_template_diff_allowlist.json` — currently `--serif`, `--sans`, `--mono`, `--latin-ui`, `--display`, and per-pair slide typography metrics.
- Reference docs are English-only. Korean-specific output lives in templates, not duplicated reference files.

## Upstream sync

Non–language-specific upstream improvements (stabilizer rules, lint fixes, render pipeline) are cherry-picked from `upstream/main` (`tw93/Kami`). See `CONTRIBUTING.md` for the workflow.
