/**
 * MotionTransition — Remotion composition stub for state-driven page-to-page
 * transitions between heavy scenes. Implement when the host project needs
 * orchestrated multi-element motion.
 */

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

import { colors } from "../../theme/index.js";

export interface MotionTransitionProps {
  fromColor?: string;
  toColor?: string;
}

export const MotionTransition: React.FC<MotionTransitionProps> = ({
  fromColor = colors.parchment,
  toColor = colors.brand,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1]);
  const blended = `color-mix(in srgb, ${fromColor} ${(1 - t) * 100}%, ${toColor})`;
  return <AbsoluteFill style={{ backgroundColor: blended }} />;
};

export default MotionTransition;
