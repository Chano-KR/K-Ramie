# Integration — non-destructive

`@kramie/remotion` is designed to drop into an existing Remotion harness without touching the host's source files. The reference host is `D:\01.Coding\06_video` (Remotion 4.0.446, React 19, Tailwind v4, MFA subtitle alignment tooling).

## Acceptance criteria

The integration is **non-destructive** if and only if attaching K-Ramie's video subsystem modifies nothing in the host project other than:

1. `package.json` (adding `@kramie/remotion` as a dependency)
2. A single new composition file the host author writes to use K-Ramie components

Touching `Root.tsx`, `remotion.config.ts`, `tsconfig.json`, or any existing composition under `src/compositions/` would fail the criterion. Back out and redesign rather than patch.

## Test plan

### 1 · Attach as a local dependency

```bash
cd D:\01.Coding\06_video
pnpm add file:D:\01.Coding\k-ramie\remotion-skill
```

### 2 · Verify existing scripts still pass

```bash
pnpm dev           # Remotion Studio opens, existing compositions render unchanged
pnpm build         # Remotion bundle succeeds
pnpm subtitles:validate  # MFA subtitle tooling runs unchanged
pnpm lint          # eslint + tsc green
```

If any of these fails with a message mentioning `@kramie/remotion`, the integration broke a peer dep or shared global — back out, file an issue under K-Ramie.

### 3 · Add a single new composition that uses K-Ramie

```tsx
// src/compositions/KramieDemo.tsx  (new file)
import React from "react";
import { TitleCard } from "@kramie/remotion/compositions";

export const KramieDemo: React.FC = () => (
  <TitleCard
    eyebrow="DEMO"
    title="K-Ramie 통합 확인"
    byline="2026.05"
  />
);
```

Register it in `src/Root.tsx` per the host's existing pattern, then `pnpm dev` and watch the K-Ramie title card render alongside existing compositions.

### 4 · Run a hybrid render

```ts
// scripts/render-hybrid.mts (new file in host project)
import { stitch, defaultConfig } from "@kramie/remotion";

await stitch(
  {
    output: "./out/hybrid.mp4",
    scenes: [
      { engine: "remotion", source: "./out/intro.mp4", durationFrames: 120 },
      { engine: "hyperframes", source: "./out/caption.mp4", durationFrames: 90 },
    ],
  },
  defaultConfig,
);
```

Confirm `out/hybrid.mp4` is playable in a standard video player.

## Workload allocation (recap)

When in doubt:

- Anything that needs React state, hooks, `useCurrentFrame`, `useVideoConfig`, `spring`, or `interpolate` → **Remotion composition**
- Anything that's a static-ish overlay, single image with a keyframe path, or a deterministic per-frame transform → **Hyperframes scene**

## What about the second Remotion project in the workspace?

`D:\01.Coding\02_Claude\remotion` also exists. The same integration plan applies — `@kramie/remotion` is host-agnostic. Run the test plan separately for each host before claiming compatibility.

## Reporting an integration break

If `pnpm dev` / `pnpm build` / `pnpm subtitles:*` breaks after adding `@kramie/remotion`, do not patch the host. Instead, open an issue at https://github.com/Chano-KR/K-Ramie/issues with:

- Host project name and `package.json` snippet
- The failing command and its full output
- The Node / pnpm versions

K-Ramie should be fixed to coexist; the host should not be modified.
