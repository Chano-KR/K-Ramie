/**
 * K-Ramie theme — colors, fonts, type scales for Remotion + Hyperframes.
 * Single source of truth: pulls from the shared `references/tokens.json`
 * so tokens stay in sync with the document templates.
 */

import tokensJson from "../../../references/tokens.json" assert { type: "json" };

export const tokens = tokensJson as Readonly<{
  "--parchment": string;
  "--ivory": string;
  "--sand": string;
  "--border": string;
  "--border-soft": string;
  "--brand": string;
  "--brand-tint": string;
  "--brand-tint-strong": string;
  "--near-black": string;
  "--dark-warm": string;
  "--charcoal": string;
  "--olive": string;
  "--stone": string;
}>;

/**
 * Font family stacks used by Remotion compositions.
 *
 * The chain mirrors `styles.css html[lang="ko"]`. When running inside Remotion
 * Studio or the renderer, register the leading face via `loadFont()`
 * (see `fonts.ts`). The browser will walk the rest of the chain as fallbacks
 * if the leading face is unavailable.
 */
export const fontStacks = {
  serif: [
    "Chosunilbo Myungjo",
    "ChosunilboMyungjo",
    "Bareun Batang",
    "BareunBatang",
    "KoPub World Batang",
    "KoPubWorld Batang",
    "KoPub Batang",
    "Noto Serif KR",
    "Source Han Serif K",
    "Nanum Myeongjo",
    "Georgia",
    "Iowan Old Style",
    "Palatino",
    "serif",
  ].join(", "),

  sans: [
    "Pretendard",
    "Pretendard Variable",
    "Noto Sans KR",
    "Apple SD Gothic Neo",
    "Malgun Gothic",
    "system-ui",
    "sans-serif",
  ].join(", "),

  mono: [
    "JetBrains Mono",
    "D2Coding",
    "Fira Code",
    "SF Mono",
    "Consolas",
    "Monaco",
    "monospace",
  ].join(", "),

  /**
   * Latin runs inside Korean body. Use for English substrings inside Korean
   * captions / titles so the Latin face stays editorially aligned.
   */
  latinUi: [
    "Charter",
    "Georgia",
    "Iowan Old Style",
    "Palatino",
    "serif",
  ].join(", "),
} as const;

/**
 * Type scale tuned for video — larger than the document scale.
 * Sizes are in pixels at 1080p. Scale linearly for 4K / vertical.
 */
export const typeScale = {
  /** Body / caption — never smaller than this at 1080p. */
  body: 32,
  caption: 32,
  /** Lower-third label */
  label: 36,
  /** Subhead / lower-third name */
  subhead: 48,
  /** H2 — section transitions */
  h2: 72,
  /** H1 — title cards */
  h1: 120,
} as const;

/**
 * Safe-area insets as fraction of frame height. Bottom-12% caption safe area
 * matches the K-Ramie design spec for KO subtitles.
 */
export const safeArea = {
  captionBottomPct: 0.12,
  titleSidePct: 0.08,
  titleTopPct: 0.18,
} as const;

/**
 * Minimum font sizes by resolution. Caption font-size must not drop below
 * these values (WCAG 1.4.3 contrast + Korean reading legibility).
 */
export const minFontSize = {
  hd1080: 32,
  uhd4k: 64,
  vertical1080: 28,
} as const;

export const colors = {
  parchment: tokens["--parchment"],
  ivory: tokens["--ivory"],
  brand: tokens["--brand"],
  brandTint: tokens["--brand-tint"],
  brandTintStrong: tokens["--brand-tint-strong"],
  nearBlack: tokens["--near-black"],
  darkWarm: tokens["--dark-warm"],
  olive: tokens["--olive"],
  stone: tokens["--stone"],
  border: tokens["--border"],
} as const;

export type Theme = {
  colors: typeof colors;
  fontStacks: typeof fontStacks;
  typeScale: typeof typeScale;
  safeArea: typeof safeArea;
  minFontSize: typeof minFontSize;
};

export const theme: Theme = {
  colors,
  fontStacks,
  typeScale,
  safeArea,
  minFontSize,
};

export * from "./fonts.js";
