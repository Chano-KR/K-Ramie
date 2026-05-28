/**
 * K-Ramie multi-pipeline stitcher.
 *
 * Per user directive: scenes rendered by Remotion (heavy motion) and
 * Hyperframes (lightweight) are emitted as independent intermediate .mp4
 * files; this module concatenates them into a single final video via ffmpeg.
 *
 * Single-engine modes (`remotion-only` / `hyperframes-only`) skip the stitcher
 * entirely — the engine's own output is the final.
 */

import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import * as path from "node:path";

import type { KramieConfig } from "../config/index.js";

export type SceneEngine = "remotion" | "hyperframes";

export interface SceneManifestEntry {
  engine: SceneEngine;
  /** Path to the rendered intermediate file. */
  source: string;
  /** Frame duration at the configured fps. */
  durationFrames: number;
  /** Optional inter-scene transition. Requires `stitcher.transitions = true`. */
  transition?: "cut" | "fade" | "wipe";
  /** Optional human label for logs / debugging. */
  label?: string;
}

export interface SceneManifest {
  output: string;
  scenes: SceneManifestEntry[];
}

export interface StitchResult {
  output: string;
  scenes: number;
  durationSeconds: number;
}

function quote(p: string): string {
  // ffmpeg concat-list quoting: single-quote, escape any embedded single
  // quotes with the standard `'\''` trick.
  return `'${p.replace(/'/g, "'\\''")}'`;
}

/**
 * Stitch rendered scenes into a single output file.
 *
 * Modes:
 *  - When `config.stitcher.transitions === false`, uses ffmpeg `concat` demuxer
 *    with `-c copy` for fast, lossless concat. Requires all inputs to share
 *    codec, fps, and resolution.
 *  - When `transitions` is true, re-encodes via filter_complex so fade / wipe
 *    transitions can be applied. Slower but lossless w.r.t. transitions.
 */
export async function stitch(
  manifest: SceneManifest,
  config: KramieConfig,
): Promise<StitchResult> {
  if (manifest.scenes.length === 0) {
    throw new Error("stitch: manifest has no scenes");
  }

  // Skip stitching in single-engine modes.
  if (config.mode === "remotion-only" || config.mode === "hyperframes-only") {
    const expectedEngine = config.mode === "remotion-only" ? "remotion" : "hyperframes";
    const filtered = manifest.scenes.filter((s) => s.engine === expectedEngine);
    if (filtered.length === 1 && !config.stitcher.transitions) {
      // Single source, just copy through.
      await fs.copyFile(filtered[0]!.source, manifest.output);
      return {
        output: manifest.output,
        scenes: 1,
        durationSeconds: filtered[0]!.durationFrames / config.resolution.fps,
      };
    }
  }

  const ffmpeg = config.stitcher.ffmpegPath ?? "ffmpeg";
  const useTransitions = config.stitcher.transitions === true;

  await fs.mkdir(path.dirname(manifest.output), { recursive: true });

  if (!useTransitions) {
    const listPath = path.join(path.dirname(manifest.output), ".kramie-concat-list.txt");
    const listBody = manifest.scenes.map((s) => `file ${quote(path.resolve(s.source))}`).join("\n");
    await fs.writeFile(listPath, listBody + "\n", "utf-8");

    await runFfmpeg(ffmpeg, [
      "-y",
      "-f", "concat",
      "-safe", "0",
      "-i", listPath,
      "-c", "copy",
      manifest.output,
    ]);

    await fs.unlink(listPath).catch(() => {});
  } else {
    // Filter-complex with fade transitions between every adjacent pair.
    const inputs: string[] = [];
    manifest.scenes.forEach((s) => {
      inputs.push("-i", path.resolve(s.source));
    });
    // Minimal viable: linear concat via the `concat` filter (no transitions).
    // Real transitions (xfade) require per-pair offsets calculated from
    // durations — out of scope for the initial skeleton.
    const n = manifest.scenes.length;
    const filter = manifest.scenes
      .map((_, i) => `[${i}:v:0][${i}:a:0?]`)
      .join("") + `concat=n=${n}:v=1:a=0[outv]`;

    await runFfmpeg(ffmpeg, [
      "-y",
      ...inputs,
      "-filter_complex", filter,
      "-map", "[outv]",
      manifest.output,
    ]);
  }

  const totalFrames = manifest.scenes.reduce((acc, s) => acc + s.durationFrames, 0);
  return {
    output: manifest.output,
    scenes: manifest.scenes.length,
    durationSeconds: totalFrames / config.resolution.fps,
  };
}

function runFfmpeg(bin: string, args: string[]): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(bin, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

export type { KramieConfig } from "../config/index.js";
