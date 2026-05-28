# FONTS

Every font referenced by K-Ramie, its role, its license, and where to get it.

K-Ramie does **not** bundle commercial fonts in the release archive (`dist/k-ramie.zip`). Bundled files live under `assets/fonts/<FontFamily>/<file>.woff2` and are loaded by templates and `styles.css`. Where a font has no stable mirror, `scripts/ensure-fonts.sh` documents the manual-install path. When a face is missing locally, the system fallback chain (`Noto Serif KR`, `Apple SD Gothic Neo`, `Malgun Gothic`, etc.) takes over and pages still render.

| Font | Role | License | Bundled? | Source |
|---|---|---|---|---|
| Chosunilbo Myungjo (조선일보명조) | Body serif (slot 1) | Free commercial via Chosun Ilbo. Attribution required. | Manual `assets/fonts/ChosunilboMyungjo/` | <https://noonnu.cc/font_page/63> |
| Bareun Batang (바른바탕) | Body serif (slot 2) | Free commercial via 대한인쇄문화협회 (Korean Printing Culture Association). | Manual `assets/fonts/BareunBatang/` | <https://noonnu.cc/font_page/30> |
| KoPub World Batang | Body serif (slot 3, broad fallback) | Free commercial under Korean Govt license. Attribution required. | Manual `assets/fonts/KoPubWorldBatang/` | <https://www.kopus.org/biz/electronic/font.aspx> |
| Noto Serif KR | Body serif (cross-platform fallback) | SIL OFL 1.1 | Google Fonts CDN — not bundled | <https://fonts.google.com/specimen/Noto+Serif+KR> |
| Source Han Serif K | Body serif (Adobe / Google fallback) | SIL OFL 1.1 | System / CDN — not bundled | <https://github.com/adobe-fonts/source-han-serif> |
| Nanum Myeongjo | Body serif (legacy fallback) | SIL OFL 1.1 | System / Google Fonts — not bundled | <https://fonts.google.com/specimen/Nanum+Myeongjo> |
| Pretendard | UI sans, captions, subtitles | SIL OFL 1.1 | Auto-fetched by `scripts/ensure-fonts.sh` to `assets/fonts/Pretendard/PretendardVariable.woff2` | <https://github.com/orioncactus/pretendard> |
| Noto Sans KR | Sans fallback | SIL OFL 1.1 | System / Google Fonts — not bundled | <https://fonts.google.com/specimen/Noto+Sans+KR> |
| D2Coding | Code blocks, mono | SIL OFL 1.1 | Manual `assets/fonts/D2Coding/` | <https://github.com/naver/d2codingfont> |
| JetBrains Mono | Code blocks (Latin) | SIL OFL 1.1 | Bundled `assets/fonts/JetBrainsMono.woff2` | <https://www.jetbrains.com/lp/mono/> |
| Sandoll Gukdae Tteokbokki (산돌 국대떡볶이) | **Display only** — `.display`, `.poster`, `.hero-mark`. Never inherited by body, headings, or slide titles. | Free commercial **but no CI/BI use**. Cannot be used to create corporate / brand identity marks. | Manual `assets/fonts/SandollGukdaeTteokbokki/` | <https://noonnu.cc/font_page/3> |
| Charter | Latin-UI proxy (Latin runs inside Korean), EN variant body | Original Bitstream Charter license (open for commercial use, no fee) | Inherited from upstream Kami | bundled commonly with system Bitstream distribution |

## Role definitions

- **Body serif** — long-form reading text. Heading hierarchy inherits the same face. Hangul has narrower visual rhythm than Latin serif, so K-Ramie favours editorial faces (newspaper, print-association) for body.
- **UI sans** — language switcher, navigation, captions, subtitles, button labels. Pretendard leads because of its complete Hangul–Latin metric harmony and free commercial license.
- **Mono** — code blocks, inline `<code>`, syntax-highlighted spans. D2Coding is the de-facto Korean coding mono because its Hangul glyphs share the Latin monospace width.
- **Display (opt-in only)** — hero markers, poster headlines, single-character marks. Never inherited by body. Sandoll Gukdae Tteokbokki's CI/BI-prohibition clause means it cannot anchor brand identity; isolating it to `.display` / `.poster` / `.hero-mark` classes makes the constraint mechanically enforceable.
- **Latin-UI proxy** — Latin substrings inside Korean body text. Wrap with `<span class="lat">...</span>` in templates; the class swaps `font-family` to Charter so Latin runs stay aligned with the rest of the editorial system instead of falling back to whichever face has Latin coverage.

## Why Sandoll Gukdae Tteokbokki is not in the body chain

Sandoll Gukdae Tteokbokki is a free-for-commercial-use **display** typeface — rounded, brand-themed, designed for short impact text. Two reasons it does not enter the body `--serif` chain:

1. **Readability.** Display faces break long-form reading. K-Ramie's editorial constraint is body-first; allowing a display face to inherit into body would undo the typographic discipline the rest of the system enforces.
2. **License.** The Sandoll license forbids CI/BI use. The cleanest way to honour that mechanically is to keep the face out of any class an agent might use for branded artwork or product marks. The `--display` opt-in slot keeps the face available for legitimate display use (single-glyph hero marks, decorative posters) without putting it on the path to body or brand surfaces.

## Attribution

When publishing documents rendered with K-Ramie, attribute the body face per the source license. For Chosunilbo Myungjo and KoPub World Batang in particular, the licenses require attribution; add a colophon line such as "Set in Chosunilbo Myungjo" or "Set in KoPub World Batang" to the document footer.
