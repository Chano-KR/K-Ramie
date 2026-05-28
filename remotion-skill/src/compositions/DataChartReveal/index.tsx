/**
 * DataChartReveal — Remotion composition stub.
 *
 * Keyframe-driven data viz reveal. Implement when the host project needs a
 * chart that animates in over time (line, bar, donut). The K-Ramie color
 * palette and font stacks are available via `../../theme/index.js`.
 */

import React from "react";
import { AbsoluteFill } from "remotion";

import { colors, fontStacks } from "../../theme/index.js";

export interface DataChartRevealProps {
  title: string;
  /** Implementation-defined payload — chart series, labels, etc. */
  data?: unknown;
}

export const DataChartReveal: React.FC<DataChartRevealProps> = ({ title }) => (
  <AbsoluteFill
    style={{
      backgroundColor: colors.parchment,
      fontFamily: fontStacks.serif,
      color: colors.nearBlack,
      padding: "10%",
    }}
  >
    <h2 style={{ fontSize: 72, fontWeight: 500, letterSpacing: "-0.02em" }}>{title}</h2>
    <p style={{ marginTop: 32, color: colors.stone, fontFamily: fontStacks.sans, fontSize: 28 }}>
      DataChartReveal stub — implement in host project.
    </p>
  </AbsoluteFill>
);

export default DataChartReveal;
