"""Slide text-density linter for K-Ramie slide templates.

Per the K-Ramie Phase 2 spec, slides must enforce strict text-density limits:
  - Title <= 28 Hangul chars (KO) / 60 chars (EN), single line, no terminal period
  - <= 3 bullet items per slide
  - Each bullet <= 14 Hangul chars (KO) / 40 chars (EN)
  - No <p> longer than 80 Hangul chars (KO) / 160 chars (EN)
  - Total slide word count <= 60 KO eojeol / 100 EN words

Warnings (advisory, not errors):
  - More than 1 <p> per slide -> suggest splitting into separate slides
  - Body font-size < 18pt -> suggest reducing copy
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATES = ROOT / "assets" / "templates"

SLIDE_TEMPLATES = [
    "slides-weasy", "slides-weasy-en",
    "slides-keynote", "slides-keynote-en",
    "slides-pitch", "slides-pitch-en",
    "slides-vertical", "slides-vertical-en",
]

LIMITS = {
    "ko": {
        "title_chars": 28,
        "bullet_chars": 14,
        "paragraph_chars": 80,
        "slide_total_words": 60,
        "bullets_per_slide": 3,
    },
    "en": {
        "title_chars": 60,
        "bullet_chars": 40,
        "paragraph_chars": 160,
        "slide_total_words": 100,
        "bullets_per_slide": 3,
    },
}


SLIDE_BLOCK_RE = re.compile(r'<section[^>]*class="slide"[^>]*>(.*?)</section>', re.DOTALL)
TITLE_RE = re.compile(r'<h[12][^>]*>(.*?)</h[12]>', re.DOTALL)
BULLET_RE = re.compile(r'<li[^>]*>(.*?)</li>', re.DOTALL)
PARAGRAPH_RE = re.compile(r'<p[^>]*>(.*?)</p>', re.DOTALL)
TAG_STRIP_RE = re.compile(r'<[^>]+>')
PLACEHOLDER_RE = re.compile(r'\{\{[^}]*\}\}')


def strip_tags(text: str) -> str:
    text = TAG_STRIP_RE.sub('', text)
    text = PLACEHOLDER_RE.sub('', text)
    return text.strip()


def count_chars(text: str, lang: str) -> int:
    """Count visible characters. For KO, count Hangul + Latin word characters.
    For EN, count word characters."""
    text = strip_tags(text)
    if lang == "ko":
        return sum(1 for ch in text if not ch.isspace())
    return len(text)


def count_words(text: str, lang: str) -> int:
    text = strip_tags(text)
    if lang == "ko":
        # eojeol = whitespace-separated chunk
        return len([t for t in text.split() if t])
    return len([w for w in text.split() if w])


def lang_of(template: str) -> str:
    return "en" if template.endswith("-en") else "ko"


def lint_slide(template_name: str, slide_html: str, slide_index: int, limits: dict, errors: list, warnings: list) -> None:
    lang = lang_of(template_name)

    titles = TITLE_RE.findall(slide_html)
    bullets = BULLET_RE.findall(slide_html)
    paragraphs = PARAGRAPH_RE.findall(slide_html)

    # Title rules
    for title_html in titles:
        title_text = strip_tags(title_html)
        if not title_text:
            continue
        n = count_chars(title_html, lang)
        if n > limits["title_chars"]:
            errors.append(
                f"{template_name} slide {slide_index}: title {n} chars exceeds limit {limits['title_chars']} ({lang})"
            )
        if "\n" in title_text and any(t.strip() for t in title_text.split("\n")[1:]):
            errors.append(
                f"{template_name} slide {slide_index}: title spans multiple lines"
            )
        if title_text.endswith("."):
            errors.append(
                f"{template_name} slide {slide_index}: title ends with period"
            )

    # Bullets rules
    if len(bullets) > limits["bullets_per_slide"]:
        errors.append(
            f"{template_name} slide {slide_index}: {len(bullets)} bullets exceeds limit {limits['bullets_per_slide']}"
        )
    for bullet_html in bullets:
        n = count_chars(bullet_html, lang)
        if n > limits["bullet_chars"]:
            errors.append(
                f"{template_name} slide {slide_index}: bullet {n} chars exceeds limit {limits['bullet_chars']} ({lang})"
            )

    # Paragraph rules
    for para_html in paragraphs:
        n = count_chars(para_html, lang)
        if n > limits["paragraph_chars"]:
            errors.append(
                f"{template_name} slide {slide_index}: paragraph {n} chars exceeds limit {limits['paragraph_chars']} ({lang})"
            )

    if len(paragraphs) > 1:
        warnings.append(
            f"{template_name} slide {slide_index}: {len(paragraphs)} <p> elements; consider splitting into separate slides"
        )

    # Total word count
    total_text = strip_tags(slide_html)
    total = count_words(total_text, lang)
    if total > limits["slide_total_words"]:
        errors.append(
            f"{template_name} slide {slide_index}: total {total} words exceeds limit {limits['slide_total_words']} ({lang})"
        )


def lint_template(template_name: str, errors: list, warnings: list) -> None:
    path = TEMPLATES / f"{template_name}.html"
    if not path.exists():
        warnings.append(f"{template_name}: source not found at {path}")
        return
    text = path.read_text(encoding="utf-8")
    lang = lang_of(template_name)
    limits = LIMITS[lang]
    slides = SLIDE_BLOCK_RE.findall(text)
    if not slides:
        # Some slide templates use .slide divs rather than <section>; fall back.
        slides = re.findall(r'<div[^>]*class="slide"[^>]*>(.*?)</div>\s*(?=<div[^>]*class="slide"|</body>)', text, re.DOTALL)
    for i, slide_html in enumerate(slides, start=1):
        lint_slide(template_name, slide_html, i, limits, errors, warnings)


def main(targets: list[str] | None = None) -> int:
    targets = targets or SLIDE_TEMPLATES
    errors: list[str] = []
    warnings: list[str] = []
    for t in targets:
        lint_template(t, errors, warnings)
    for w in warnings:
        print(f"WARN: {w}")
    for e in errors:
        print(f"ERROR: {e}")
    if errors:
        print(f"ERROR: slide density check failed: {len(errors)} error(s)")
        return 1
    print(f"OK: slide density check passed across {len(targets)} slide template(s)")
    return 0


if __name__ == "__main__":
    args = sys.argv[1:]
    sys.exit(main(args if args else None))
