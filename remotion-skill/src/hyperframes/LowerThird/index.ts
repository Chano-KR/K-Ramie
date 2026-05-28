/**
 * LowerThird — Hyperframes lightweight scene for speaker / source label.
 * Sans-serif (Pretendard) for legibility.
 */

import { fontStacks, colors } from "../../theme/index.js";

export interface LowerThirdProps {
  name: string;
  role?: string;
  side?: "left" | "right";
  width: number;
  height: number;
}

export function getLowerThirdStyle(props: LowerThirdProps): {
  container: Record<string, string | number>;
  name: Record<string, string | number>;
  role: Record<string, string | number>;
} {
  const isLeft = (props.side ?? "left") === "left";
  return {
    container: {
      position: "absolute",
      left: isLeft ? "5%" : "auto",
      right: isLeft ? "auto" : "5%",
      bottom: `${Math.round(props.height * 0.18)}px`,
      padding: "16px 24px",
      background: `${colors.nearBlack}cc`,
      borderLeft: `4px solid ${colors.brand}`,
      borderRadius: 2,
      maxWidth: "40%",
    },
    name: {
      fontFamily: fontStacks.sans,
      fontWeight: 700,
      fontSize: "36px",
      color: colors.parchment,
      letterSpacing: "-0.02em",
      margin: 0,
    },
    role: {
      fontFamily: fontStacks.sans,
      fontWeight: 400,
      fontSize: "22px",
      color: colors.brandTint,
      letterSpacing: "0",
      marginTop: 4,
    },
  };
}

export function describeLowerThirdScene(
  props: LowerThirdProps,
  durationFrames: number,
): {
  engine: "hyperframes";
  durationFrames: number;
  styles: ReturnType<typeof getLowerThirdStyle>;
  name: string;
  role?: string;
} {
  return {
    engine: "hyperframes",
    durationFrames,
    styles: getLowerThirdStyle(props),
    name: props.name,
    role: props.role,
  };
}
