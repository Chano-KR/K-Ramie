/**
 * ImagePan — Hyperframes scene: Ken Burns style pan/zoom over a still image.
 * Single asset + linear keyframe path. No React overhead.
 */

import { colors } from "../../theme/index.js";

export interface ImagePanProps {
  /** Image source URL or filesystem path. */
  src: string;
  /** Frame width / height in pixels. */
  width: number;
  height: number;
  /** Pan direction (start position). */
  from?: { x: number; y: number; scale: number };
  /** Pan direction (end position). */
  to?: { x: number; y: number; scale: number };
}

export function describeImagePanScene(
  props: ImagePanProps,
  durationFrames: number,
): {
  engine: "hyperframes";
  durationFrames: number;
  src: string;
  background: string;
  keyframes: {
    from: { x: number; y: number; scale: number };
    to: { x: number; y: number; scale: number };
  };
} {
  return {
    engine: "hyperframes",
    durationFrames,
    src: props.src,
    background: colors.parchment,
    keyframes: {
      from: props.from ?? { x: 0, y: 0, scale: 1.05 },
      to: props.to ?? { x: 0, y: 0, scale: 1.15 },
    },
  };
}
