/**
 * ColorTile — Hyperframes scene: solid color background, useful as outro
 * sting or between-section transition. Pure declarative timing.
 */

import { colors } from "../../theme/index.js";

export interface ColorTileProps {
  color?: string;
  fadeInFrames?: number;
  fadeOutFrames?: number;
}

export function describeColorTileScene(
  props: ColorTileProps,
  durationFrames: number,
): {
  engine: "hyperframes";
  durationFrames: number;
  color: string;
  fadeInFrames: number;
  fadeOutFrames: number;
} {
  return {
    engine: "hyperframes",
    durationFrames,
    color: props.color ?? colors.parchment,
    fadeInFrames: props.fadeInFrames ?? 0,
    fadeOutFrames: props.fadeOutFrames ?? 0,
  };
}
