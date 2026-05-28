#!/usr/bin/env bash
set -euo pipefail

# Browser-driven deck exporter for K-Ramie slide subsystem.
# Wraps `decktape` so CSS animations and web fonts that WeasyPrint cannot
# render are preserved in the exported PDF. Use this when the deck depends
# on transitions, web-loaded fonts, or media that the WeasyPrint pipeline
# cannot reproduce.
#
# Usage:
#   bash scripts/export-deck.sh <template> [output.pdf]
#
# Examples:
#   bash scripts/export-deck.sh slides-keynote
#   bash scripts/export-deck.sh slides-pitch-en dist/pitch-en.pdf
#
# Requirements:
#   - decktape  (npm i -g decktape)
#   - chromium / chrome on PATH (decktape uses Puppeteer)

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <template> [output.pdf]"
  echo "  template: slides-weasy | slides-keynote | slides-pitch | slides-vertical (each + -en)"
  exit 64
fi

TEMPLATE="$1"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/assets/templates/${TEMPLATE}.html"
OUT="${2:-$ROOT/dist/${TEMPLATE}.pdf}"

if [[ ! -f "$SRC" ]]; then
  echo "ERROR: template not found: $SRC"
  exit 66
fi

if ! command -v decktape >/dev/null 2>&1; then
  echo "ERROR: decktape not installed"
  echo "  Install: npm install -g decktape"
  exit 69
fi

mkdir -p "$(dirname "$OUT")"

# Aspect: vertical templates use 9:16; others are 16:9.
case "$TEMPLATE" in
  slides-vertical*)
    VIEW_W=1080
    VIEW_H=1920
    ;;
  *)
    VIEW_W=1920
    VIEW_H=1080
    ;;
esac

echo "Rendering $TEMPLATE -> $OUT (${VIEW_W}x${VIEW_H})"
decktape generic \
  --size "${VIEW_W}x${VIEW_H}" \
  --load-pause 800 \
  --pause 300 \
  "$SRC" \
  "$OUT"

echo "OK: $OUT"
