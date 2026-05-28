#!/usr/bin/env python3
"""K-Ramie blog RSS feed generator.

Reads post metadata via the same @meta comment block as `build-blog.py`
and emits a single `feed.xml` (RSS 2.0) suitable for serving alongside the
static blog index.

Usage:
  python3 scripts/build-blog-feed.py --site https://k-ramie.vercel.app --content content/blog --out dist/blog/feed.xml
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path
from xml.sax.saxutils import escape

# Reuse the post parser from build-blog.py
sys.path.insert(0, str(Path(__file__).resolve().parent))
from importlib import import_module
build_blog = import_module("build-blog")

ROOT = Path(__file__).resolve().parents[1]


def isoformat_to_rfc822(date_str: str) -> str:
    # Minimal: assume YYYY-MM-DD; RFC822 needs day-name and timezone.
    # Use 00:00:00 +0000 for date-only entries.
    from datetime import datetime
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return date_str
    return dt.strftime("%a, %d %b %Y 00:00:00 +0000")


def build_feed(posts: list, site_url: str, title: str, description: str, language: str) -> str:
    items = []
    for p in posts:
        items.append(f"""    <item>
      <title>{escape(p.title)}</title>
      <link>{escape(site_url.rstrip('/') + '/posts/' + p.slug + '.html')}</link>
      <guid isPermaLink="false">{escape(p.slug)}</guid>
      <pubDate>{isoformat_to_rfc822(p.date)}</pubDate>
      <description>{escape(p.summary)}</description>
    </item>""")

    items_xml = "\n".join(items)
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>{escape(title)}</title>
    <link>{escape(site_url)}</link>
    <description>{escape(description)}</description>
    <language>{escape(language)}</language>
{items_xml}
  </channel>
</rss>
"""


def main() -> int:
    ap = argparse.ArgumentParser(description="K-Ramie blog RSS feed generator")
    ap.add_argument("--site", required=True, help="base site URL (e.g. https://k-ramie.vercel.app)")
    ap.add_argument("--content", default="content/blog", help="source directory of post HTML files")
    ap.add_argument("--out", default="dist/blog/feed.xml", help="output RSS file path")
    ap.add_argument("--title", default="K-Ramie Blog", help="feed channel title")
    ap.add_argument("--description", default="K-Ramie blog posts", help="feed channel description")
    ap.add_argument("--language", default="ko-KR", help="feed channel language (ko-KR / en-US)")
    args = ap.parse_args()

    content = ROOT / args.content
    out = ROOT / args.out

    if not content.exists():
        print(f"ERROR: content directory not found: {content}")
        return 1

    posts = [p for p in (build_blog.read_post(f) for f in sorted(content.glob("*.html"))) if p]
    posts.sort(key=lambda p: p.date, reverse=True)

    feed_xml = build_feed(posts, args.site, args.title, args.description, args.language)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(feed_xml, encoding="utf-8")
    print(f"OK: wrote {out} with {len(posts)} item(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
