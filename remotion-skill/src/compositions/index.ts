/**
 * Remotion compositions — heavy-motion, state-driven scenes.
 *
 * Each composition is a React/TSX module that runs inside Remotion's frame
 * loop. Use these for title cards, section transitions, data-chart reveals,
 * and anything that needs spring physics or React state.
 *
 * For lightweight scenes (subtitles, lower thirds, image pans), use the
 * Hyperframes scenes instead — see `../hyperframes/`.
 */

export { TitleCard } from "./TitleCard/index.js";
export type { TitleCardProps } from "./TitleCard/index.js";

export { SectionBreak } from "./SectionBreak/index.js";
export type { SectionBreakProps } from "./SectionBreak/index.js";

// Stubs (Phase 4 skeleton). Implement when needed.
export { DataChartReveal } from "./DataChartReveal/index.js";
export type { DataChartRevealProps } from "./DataChartReveal/index.js";

export { MotionTransition } from "./MotionTransition/index.js";
export type { MotionTransitionProps } from "./MotionTransition/index.js";
