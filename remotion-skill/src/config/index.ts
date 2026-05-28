/**
 * K-Ramie runtime configuration.
 *
 * Execution modes per user directive:
 *  - 'remotion-only'   : skip Hyperframes, render only Remotion compositions
 *  - 'hyperframes-only': skip Remotion, render only Hyperframes scenes
 *  - 'hybrid'          : render both engines, stitch via ffmpeg
 */

export type KramieMode = "remotion-only" | "hyperframes-only" | "hybrid";

export interface KramieConfig {
  mode: KramieMode;
  remotion: {
    compositionsDir: string;
  };
  hyperframes: {
    scenesDir: string;
  };
  stitcher: {
    /** Path to ffmpeg binary; defaults to PATH lookup. */
    ffmpegPath?: string;
    /** Re-encode rather than `-c copy` so transitions can be applied. */
    transitions?: boolean;
    /** Output container; ffmpeg-supported. */
    container?: "mp4" | "mov" | "webm";
  };
  /** Default frame size for renders. */
  resolution: {
    width: number;
    height: number;
    fps: number;
  };
}

export const defaultConfig: KramieConfig = {
  mode: "hybrid",
  remotion: {
    compositionsDir: "./src/remotion",
  },
  hyperframes: {
    scenesDir: "./src/hyperframes",
  },
  stitcher: {
    transitions: false,
    container: "mp4",
  },
  resolution: {
    width: 1920,
    height: 1080,
    fps: 30,
  },
};

export const presets = {
  hd1080: { width: 1920, height: 1080, fps: 30 },
  uhd4k: { width: 3840, height: 2160, fps: 30 },
  vertical1080: { width: 1080, height: 1920, fps: 30 },
} as const;

export type ResolutionPreset = keyof typeof presets;

export function withPreset(config: KramieConfig, preset: ResolutionPreset): KramieConfig {
  return {
    ...config,
    resolution: { ...presets[preset] },
  };
}
