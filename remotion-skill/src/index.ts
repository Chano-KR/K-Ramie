/**
 * @kramie/remotion — public entry point.
 *
 * Host Remotion projects import the theme, compositions, hyperframes, and
 * stitcher from this barrel. The package is a drop-in modular layer that
 * attaches to an existing Remotion harness without modifying it.
 *
 * Workload allocation:
 *   - Remotion compositions  → heavy motion, complex keyframing, state-driven
 *   - Hyperframes scenes     → lightweight, rapid render, deterministic
 *   - Stitcher               → ffmpeg concat for hybrid output
 *
 * See INTEGRATION.md for the non-destructive integration test plan.
 */

export * from "./theme/index.js";
export * from "./config/index.js";
export * from "./stitcher/index.js";

// Compositions (React / TSX) — host project imports from sub-paths to avoid
// pulling Remotion peer-deps when not needed.
export type { TitleCardProps } from "./compositions/TitleCard/index.js";
export type { SectionBreakProps } from "./compositions/SectionBreak/index.js";

// Hyperframes scenes (vanilla TS) — no Remotion peer-deps required.
export {
  describeCaptionScene,
  getCaptionStyle,
  validateCaption,
  resolveFontSize as resolveCaptionFontSize,
} from "./hyperframes/KOSubtitle/index.js";
export type { KOSubtitleProps } from "./hyperframes/KOSubtitle/index.js";

export {
  describeLowerThirdScene,
  getLowerThirdStyle,
} from "./hyperframes/LowerThird/index.js";
export type { LowerThirdProps } from "./hyperframes/LowerThird/index.js";
