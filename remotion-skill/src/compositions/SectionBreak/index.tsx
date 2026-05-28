/**
 * SectionBreak — Remotion composition for inter-section transition cards.
 *
 * Sans-serif section number (Pretendard) + serif section title (Chosunilbo
 * Myungjo). Slide-in motion drives the rule line; title cross-fades.
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { fontStacks, colors, typeScale } from "../../theme/index.js";

export interface SectionBreakProps {
  number: string | number;
  title: string;
}

export const SectionBreak: React.FC<SectionBreakProps> = ({ number, title }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const ruleProgress = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.4 },
  });
  const ruleScaleX = interpolate(ruleProgress, [0, 1], [0, 1]);

  const titleOpacity = interpolate(frame, [fps * 0.3, fps * 0.7], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.parchment,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 10%",
      }}
    >
      <div
        style={{
          fontFamily: fontStacks.sans,
          fontSize: `${typeScale.label}px`,
          fontWeight: 600,
          letterSpacing: "0.3em",
          color: colors.brand,
          marginBottom: 32,
        }}
      >
        {String(number).padStart(2, "0")}
      </div>

      <div
        style={{
          height: 2,
          width: width * 0.4,
          background: colors.brand,
          transform: `scaleX(${ruleScaleX})`,
          transformOrigin: "left center",
          marginBottom: 40,
        }}
      />

      <h2
        style={{
          fontFamily: fontStacks.serif,
          fontSize: `${typeScale.h2}px`,
          fontWeight: 500,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: colors.nearBlack,
          textAlign: "center",
          opacity: titleOpacity,
          wordBreak: "keep-all",
          lineBreak: "strict",
        }}
      >
        {title}
      </h2>
    </AbsoluteFill>
  );
};

export default SectionBreak;
