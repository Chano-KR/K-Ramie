#!/usr/bin/env bash
set -euo pipefail

# K-Ramie font helper.
# Portable across bash 3.2+ (macOS stock /bin/bash) and bash 4+ (Linux, Homebrew).
# Avoids `declare -A` so the script runs on a fresh macOS without `brew install bash`.
#
# K-Ramie uses Korean web fonts under assets/fonts/<FontFamily>/<file>.woff2.
# Most Korean fonts do not have stable, redistribution-friendly CDN mirrors,
# so this script (a) auto-fetches the few that do (Pretendard, D2Coding) and
# (b) verifies the rest are present locally and prints manual-download
# instructions if they are missing. Nothing here pulls a CJK font that is not
# intended for Korean output.
#
# Body / heading rendering will fall back to system fonts (Noto Serif KR,
# Apple SD Gothic Neo, Malgun Gothic) if web fonts are absent — pages still
# render, just with a different optical rhythm.

FONT_DIR="$(cd "$(dirname "$0")/../assets/fonts" && pwd)"
MIN_SIZE=10000  # 10KB sanity threshold (subset WOFF2 files are small but never near-empty)

# Tuple format: "subdir|filename|url|attribution_note"
# Empty url => manual install only.
FONT_SPECS=(
  "Pretendard|PretendardVariable.woff2|https://github.com/orioncactus/pretendard/raw/main/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2|SIL OFL 1.1, orioncactus/pretendard"
  "D2Coding|D2Coding.woff2||SIL OFL 1.1, NaverCloudPlatform/d2codingfont — manual download required"
  "ChosunilboMyungjo|ChosunilboMyungjo.woff2||free commercial via Chosun Ilbo — manual download from chosun.com"
  "BareunBatang|BareunBatang.woff2||free commercial via 대한인쇄문화협회 — manual download required"
  "KoPubWorldBatang|KoPubWorldBatang.woff2||free commercial (Korean Govt) — manual download from kopus.org"
  "SandollGukdaeTteokbokki|SandollGukdaeTteokbokki.woff2||free commercial display-only (CI/BI prohibited) — manual download from sandollcloud.com"
)

check_size() {
  local file="$1"
  [[ -f "$file" ]] || return 1
  local size
  size=$(wc -c < "$file" | tr -d ' ')
  [[ "$size" -ge "$MIN_SIZE" ]]
}

download_font() {
  local subdir="$1"
  local filename="$2"
  local url="$3"
  local target_dir="$FONT_DIR/$subdir"
  local target="$target_dir/$filename"

  mkdir -p "$target_dir"

  if check_size "$target"; then
    echo "  OK: $subdir/$filename already present"
    return 0
  fi

  if [[ -z "$url" ]]; then
    echo "  SKIP: $subdir/$filename has no auto-download source (see manual install note below)"
    return 2
  fi

  echo "  Fetching $subdir/$filename"
  if curl --retry 2 --connect-timeout 15 --max-time 300 -fSL "$url" -o "$target.tmp" 2>/dev/null; then
    if check_size "$target.tmp"; then
      mv "$target.tmp" "$target"
      echo "  OK: $subdir/$filename downloaded ($(du -h "$target" | cut -f1))"
      return 0
    else
      rm -f "$target.tmp"
      echo "  ERROR: download size below threshold for $subdir/$filename"
      return 1
    fi
  else
    rm -f "$target.tmp"
    echo "  ERROR: download failed for $subdir/$filename"
    return 1
  fi
}

mkdir -p "$FONT_DIR"

failed=0
manual=0
for spec in "${FONT_SPECS[@]}"; do
  IFS='|' read -r subdir filename url note <<<"$spec"
  if ! download_font "$subdir" "$filename" "$url"; then
    rc=$?
    if [[ "$rc" == "2" ]]; then
      manual=$((manual + 1))
      printf '    note: %s\n' "$note"
    else
      failed=$((failed + 1))
      printf '    note: %s\n' "$note"
    fi
  fi
done

if [[ "$failed" -gt 0 ]]; then
  echo ""
  echo "Some auto-fetchable fonts could not be downloaded."
  echo "K-Ramie will still render via system fallbacks (Noto Serif KR, Apple SD Gothic Neo, Malgun Gothic)."
  echo "See FONTS.md for licensing and source URLs."
  exit 1
fi

if [[ "$manual" -gt 0 ]]; then
  echo ""
  echo "OK: auto-fetched fonts present."
  echo "${manual} manual-install font(s) above — download per the linked source and place under assets/fonts/<Subdir>/<Filename>.woff2."
  echo "Until then, K-Ramie renders via the system fallback chain. See FONTS.md."
  exit 0
fi

echo "OK: all K-Ramie fonts ready"
