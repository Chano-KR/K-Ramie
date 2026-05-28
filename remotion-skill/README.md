# @kramie/remotion

K-Ramie video subsystem. A drop-in modular layer that attaches to an existing Remotion harness without modifying it. Splits heavy motion (Remotion) and lightweight scenes (Hyperframes), and stitches them into a single output via ffmpeg.

Korean captions hardcode Pretendard for legibility. The K-Ramie color palette pulls directly from `references/tokens.json` — when document tokens change, video re-renders pick up the change.

## Install

In your existing Remotion project:

```bash
pnpm add file:../k-ramie/remotion-skill        # local path (development)
# or once published:
# pnpm add @kramie/remotion
```

Peer dependencies (your Remotion host already provides them):

- `remotion ^4.0.0`
- `react ^18 || ^19`
- `react-dom ^18 || ^19`
- `@remotion/google-fonts ^4.0.0` (optional — used only for font loading)

## Workload split

| Workload | Engine | Why |
|---|---|---|
| Title cards with complex motion | Remotion | React state + spring physics |
| Data chart reveals | Remotion | Frame-driven keyframes, React data binding |
| Multi-page section transitions | Remotion | Stateful animation orchestration |
| Korean subtitles | **Hyperframes** | Lightweight, fast render, deterministic per frame |
| Lower thirds | **Hyperframes** | Static-ish overlay, brief duration |
| Image pans / Ken Burns | **Hyperframes** | Single asset + keyframe path, no React overhead |
| Color tile transitions | **Hyperframes** | Pure declarative timing |
| Outro / branding stings | **Hyperframes** | Reusable, static composition |

## Usage

### Import the theme

```ts
import { fontStacks, colors, typeScale, safeArea } from "@kramie/remotion/theme";
```

### Use a Remotion composition

```tsx
import { TitleCard } from "@kramie/remotion/compositions";

export const MyTitle: React.FC = () => (
  <TitleCard
    eyebrow="K-RAMIE · INTRO"
    title="한국어 디자인 시스템"
    byline="2026.05"
  />
);
```

### Describe a Hyperframes scene

```ts
import { describeCaptionScene } from "@kramie/remotion/hyperframes";

const caption = describeCaptionScene(
  { text: "안녕하세요\n반갑습니다", width: 1920, height: 1080 },
  120, // 4 seconds at 30 fps
);
```

### Stitch heterogeneous scenes

```ts
import { stitch, defaultConfig } from "@kramie/remotion";

await stitch(
  {
    output: "./out/final.mp4",
    scenes: [
      { engine: "remotion", source: "./out/title.mp4", durationFrames: 90 },
      { engine: "hyperframes", source: "./out/lower-third.mp4", durationFrames: 60 },
      { engine: "remotion", source: "./out/section-break.mp4", durationFrames: 90 },
      { engine: "hyperframes", source: "./out/caption.mp4", durationFrames: 120 },
    ],
  },
  defaultConfig,
);
```

### Execution modes

```ts
import { defaultConfig, type KramieConfig } from "@kramie/remotion/config";

const remotionOnly: KramieConfig = { ...defaultConfig, mode: "remotion-only" };
const hyperOnly: KramieConfig    = { ...defaultConfig, mode: "hyperframes-only" };
const hybrid: KramieConfig       = { ...defaultConfig, mode: "hybrid" };
```

## Caption rules (Korean subtitles)

Enforced by `KOSubtitle`:

- Sans-serif (Pretendard) — hardcoded, no prop override
- Bottom 12% safe area
- Max 2 lines, max 18자 per line
- Min font size 32px at 1080p, 64px at 4K, 28px at vertical 1080×1920
- Outline + drop-shadow for legibility over arbitrary backgrounds
- WCAG 1.4.3 contrast minimum 7:1 via theme-enforced color pairs

`validateCaption(text)` throws if a caption violates the limits.

## Integration with `D:\01.Coding\06_video`

K-Ramie's video subsystem is non-destructive — it does not modify the host Remotion project's source files. See [INTEGRATION.md](./INTEGRATION.md) for the test plan.

## License

MIT. See repo root [LICENSE](../LICENSE).
