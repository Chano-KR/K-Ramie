/**
 * Hyperframes scenes — lightweight, rapid, deterministic.
 *
 * No React peer-dep needed. Each scene exports a `describe*Scene()` function
 * that returns a declarative descriptor the host's Hyperframes runner can
 * convert into a frame sequence.
 *
 * Use these for subtitles, lower thirds, image pans, color tiles, outro
 * stings — anything that does not require React state or spring physics.
 */

export {
  describeCaptionScene,
  getCaptionStyle,
  validateCaption,
  resolveFontSize as resolveCaptionFontSize,
} from "./KOSubtitle/index.js";
export type { KOSubtitleProps } from "./KOSubtitle/index.js";

export {
  describeLowerThirdScene,
  getLowerThirdStyle,
} from "./LowerThird/index.js";
export type { LowerThirdProps } from "./LowerThird/index.js";

export { describeImagePanScene } from "./ImagePan/index.js";
export type { ImagePanProps } from "./ImagePan/index.js";

export { describeColorTileScene } from "./ColorTile/index.js";
export type { ColorTileProps } from "./ColorTile/index.js";

export { describeTextRevealScene } from "./TextReveal/index.js";
export type { TextRevealProps } from "./TextReveal/index.js";
