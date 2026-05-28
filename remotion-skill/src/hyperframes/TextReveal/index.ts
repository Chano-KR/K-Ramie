/**
 * TextReveal — Hyperframes scene: typewriter / opacity text reveal.
 * Sans-serif (Pretendard) for caption-grade legibility.
 */

import { fontStacks, colors } from "../../theme/index.js";

export interface TextRevealProps {
  text: string;
  width: number;
  height: number;
  /** "typewriter" reveals one char per frame; "opacity" cross-fades whole text. */
  mode?: "typewriter" | "opacity";
  fontSize?: number;
}

export function describeTextRevealScene(
  props: TextRevealProps,
  durationFrames: number,
): {
  engine: "hyperframes";
  durationFrames: number;
  text: string;
  mode: "typewriter" | "opacity";
  style: Record<string, string | number>;
} {
  const fontSize = props.fontSize ?? Math.round(props.height * 0.045);
  return {
    engine: "hyperframes",
    durationFrames,
    text: props.text,
    mode: props.mode ?? "opacity",
    style: {
      position: "absolute",
      left: "10%",
      right: "10%",
      top: "50%",
      transform: "translateY(-50%)",
      fontFamily: fontStacks.sans,
      fontSize: `${fontSize}px`,
      fontWeight: 600,
      color: colors.nearBlack,
      letterSpacing: "-0.02em",
      lineHeight: 1.3,
      wordBreak: "keep-all",
      lineBreak: "strict",
    },
  };
}
