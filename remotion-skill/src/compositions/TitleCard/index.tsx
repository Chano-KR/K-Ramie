/**
 * TitleCard — Remotion composition for heavy-motion title cards.
 *
 * Serif title (Chosunilbo Myungjo chain) with spring-physics entrance.
 * Sans-serif eyebrow label above the title (Pretendard).
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  fontStacks,
  typeScale,
  safeArea,
  colors,
} from "../../theme/index.js";

export interface TitleCardProps {
  title: string;
  eyebrow?: string;
  byline?: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({ title, eyebrow, byline }) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.6 },
  });

  const opacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(titleSpring, [0, 1], [40, 0]);

  const sideInset = Math.round(width * safeArea.titleSidePct);
  const topInset = Math.round(height * safeArea.titleTopPct);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.parchment }}>
      <div
        style={{
          position: "absolute",
          left: `${sideInset}px`,
          right: `${sideInset}px`,
          top: `${topInset}px`,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {eyebrow ? (
          <div
            style={{
              fontFamily: fontStacks.sans,
              fontSize: `${typeScale.label}px`,
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: colors.brand,
              marginBottom: 24,
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        <h1
          style={{
            fontFamily: fontStacks.serif,
            fontSize: `${typeScale.h1}px`,
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: colors.nearBlack,
            margin: 0,
            wordBreak: "keep-all",
            lineBreak: "strict",
            overflowWrap: "anywhere",
          }}
        >
          {title}
        </h1>

        {byline ? (
          <div
            style={{
              marginTop: 32,
              fontFamily: fontStacks.sans,
              fontSize: `${typeScale.subhead}px`,
              fontWeight: 400,
              color: colors.olive,
            }}
          >
            {byline}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export default TitleCard;
