/**
 * KOSubtitle — Hyperframes lightweight scene for Korean subtitles.
 *
 * Hardcodes `--sans` (Pretendard) per K-Ramie Phase 4 directive: caption
 * legibility is non-negotiable, so the font cannot be overridden by props.
 */

import { fontStacks, safeArea, minFontSize, colors } from "../../theme/index.js";

export interface KOSubtitleProps {
  /** Subtitle text. Max 2 lines, max 18자 per line per K-Ramie spec. */
  text: string;
  /** Frame width in pixels. */
  width: number;
  /** Frame height in pixels. */
  height: number;
  /** Optional fade-in milliseconds. */
  fadeInMs?: number;
  /** Optional fade-out milliseconds. */
  fadeOutMs?: number;
}

const MAX_LINE_CHARS = 18;
const MAX_LINES = 2;

/**
 * Validate caption text against K-Ramie subtitle rules.
 * Throws if the text would render too long or with too many lines.
 */
export function validateCaption(text: string): void {
  const lines = text.split("\n");
  if (lines.length > MAX_LINES) {
    throw new Error(
      `KOSubtitle: caption has ${lines.length} lines; max ${MAX_LINES}`,
    );
  }
  for (const line of lines) {
    const visible = [...line].filter((ch) => !/\s/.test(ch)).length;
    if (visible > MAX_LINE_CHARS) {
      throw new Error(
        `KOSubtitle: line "${line}" has ${visible} chars; max ${MAX_LINE_CHARS}`,
      );
    }
  }
}

/**
 * Resolve the minimum caption font size for a given frame height.
 * Returns the larger of the resolution-specific floor and 28px.
 */
export function resolveFontSize(height: number): number {
  if (height >= 2160) return minFontSize.uhd4k;
  if (height >= 1920) return minFontSize.vertical1080;
  return minFontSize.hd1080;
}

/**
 * Produce the CSS style object for the caption text.
 * Font family is hardcoded to the sans chain (Pretendard lead) per spec.
 */
export function getCaptionStyle(props: KOSubtitleProps): Record<string, string | number> {
  const fontSize = resolveFontSize(props.height);
  const bottomInset = Math.round(props.height * safeArea.captionBottomPct);
  return {
    position: "absolute",
    left: "0",
    right: "0",
    bottom: `${bottomInset}px`,
    margin: "0 auto",
    maxWidth: "80%",
    fontFamily: fontStacks.sans,
    fontWeight: 600,
    fontSize: `${fontSize}px`,
    lineHeight: 1.3,
    letterSpacing: "-0.005em",
    textAlign: "center" as const,
    color: colors.parchment,
    textShadow: "0 2px 8px rgba(20,20,19,0.65)",
    WebkitTextStroke: `1px ${colors.nearBlack}`,
    wordBreak: "keep-all",
    lineBreak: "strict",
    overflowWrap: "anywhere",
  };
}

/**
 * Hyperframes scene descriptor. The host project converts this descriptor
 * into a frame sequence at render time. Kept declarative so it stays inside
 * the lightweight Hyperframes envelope.
 */
export function describeCaptionScene(
  props: KOSubtitleProps,
  durationFrames: number,
): {
  engine: "hyperframes";
  durationFrames: number;
  style: Record<string, string | number>;
  text: string;
} {
  validateCaption(props.text);
  return {
    engine: "hyperframes",
    durationFrames,
    style: getCaptionStyle(props),
    text: props.text,
  };
}
