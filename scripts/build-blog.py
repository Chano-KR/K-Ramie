#!/usr/bin/env python3
"""K-Ramie blog static-site assembler.

Walks `content/blog/` for filled blog-post-*.html files and assembles a
paginated `blog-index.html` listing. No SSG framework — pure template
assembly stays aligned with Kami's no-build-time-include rule.

Each post file must include a leading HTML comment metadata block:

  <!-- @meta
  title: 글 제목
  slug: my-first-post
  date: 2026-05-28
  tags: korean, design, typography
  summary: 한 줄 요약.
  series: K-Ramie 도입기 (optional)
  -->

Usage:
  python3 scripts/build-blog.py [--content content/blog] [--out dist/blog]
"""
from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

META_RE = re.compile(r'<!--\s*@meta\s*(.*?)\s*-->', re.DOTALL)


@dataclass
class Post:
    title: str
    slug: str
    date: str
    tags: list[str] = field(default_factory=list)
    summary: str = ""
    series: str | None = None
    body_path: Path | None = None


def parse_meta(text: str) -> dict[str, str]:
    m = META_RE.search(text)
    if not m:
        return {}
    out: dict[str, str] = {}
    for line in m.group(1).splitlines():
        line = line.strip()
        if not line or ":" not in line:
            continue
        k, _, v = line.partition(":")
        out[k.strip()] = v.strip()
    return out


def read_post(path: Path) -> Post | None:
    text = path.read_text(encoding="utf-8")
    meta = parse_meta(text)
    if not meta.get("title") or not meta.get("slug") or not meta.get("date"):
        print(f"WARN: skipping {path}: missing required meta (title/slug/date)")
        return None
    tags = [t.strip() for t in meta.get("tags", "").split(",") if t.strip()]
    return Post(
        title=meta["title"],
        slug=meta["slug"],
        date=meta["date"],
        tags=tags,
        summary=meta.get("summary", ""),
        series=meta.get("series") or None,
        body_path=path,
    )


def assemble_index(posts: list[Post], out_dir: Path, index_template: Path) -> None:
    posts_sorted = sorted(posts, key=lambda p: p.date, reverse=True)
    template = index_template.read_text(encoding="utf-8")

    # Minimal substitution: replace a {{POSTS_LIST}} marker with a generated list.
    # Authors who customize the template can wire this differently.
    rows = []
    for p in posts_sorted:
        tags_html = " ".join(f'<span class="tag">{t}</span>' for t in p.tags)
        series = f' <em class="series">[{p.series}]</em>' if p.series else ""
        rows.append(
            f'<article class="post-row"><h3><a href="./posts/{p.slug}.html">{p.title}</a></h3>'
            f'{series}<p class="date">{p.date}</p>'
            f'<p class="summary">{p.summary}</p>'
            f'<p class="tags">{tags_html}</p></article>'
        )
    posts_html = "\n".join(rows)

    if "{{POSTS_LIST}}" in template:
        rendered = template.replace("{{POSTS_LIST}}", posts_html)
    else:
        # If template doesn't have a marker, append a generated section near the end of body.
        rendered = template.replace(
            "</body>",
            f'<section class="posts-list">{posts_html}</section></body>',
            1,
        )

    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "blog-index.html").write_text(rendered, encoding="utf-8")
    print(f"OK: wrote {out_dir / 'blog-index.html'} with {len(posts_sorted)} post(s)")


def copy_posts(posts: list[Post], out_dir: Path) -> None:
    posts_dir = out_dir / "posts"
    posts_dir.mkdir(parents=True, exist_ok=True)
    for p in posts:
        target = posts_dir / f"{p.slug}.html"
        target.write_text(p.body_path.read_text(encoding="utf-8"), encoding="utf-8")
    print(f"OK: copied {len(posts)} post(s) into {posts_dir}")


def main() -> int:
    ap = argparse.ArgumentParser(description="K-Ramie blog assembler")
    ap.add_argument("--content", default="content/blog", help="source directory of post HTML files")
    ap.add_argument("--out", default="dist/blog", help="output directory")
    ap.add_argument("--template", default="assets/templates/blog-index.html", help="index template file")
    args = ap.parse_args()

    content = ROOT / args.content
    out = ROOT / args.out
    tpl = ROOT / args.template

    if not content.exists():
        print(f"ERROR: content directory not found: {content}")
        print(f"  Create it and add blog-post HTML files (see assets/templates/blog-post.html)")
        return 1
    if not tpl.exists():
        print(f"ERROR: index template not found: {tpl}")
        return 1

    posts = [p for p in (read_post(f) for f in sorted(content.glob("*.html"))) if p]
    if not posts:
        print("WARN: no posts found")

    assemble_index(posts, out, tpl)
    copy_posts(posts, out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
