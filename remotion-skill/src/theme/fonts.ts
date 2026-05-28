/**
 * Font loaders for Remotion compositions.
 *
 * Compositions running inside Remotion Studio or the renderer must call
 * `loadFonts()` once at module init so the browser registers the faces before
 * the first frame is rendered. Outside Remotion (e.g. unit tests, the
 * Hyperframes scenes) this is a no-op; the runtime falls back to the OS-level
 * font chain in `fontStacks`.
 */

let loaded = false;

/**
 * Idempotent font loader. Safe to call multiple times.
 *
 * Implementation note: imports `@remotion/google-fonts` lazily because the
 * peer dependency is marked optional. Host projects without it still get a
 * working theme via system fallbacks.
 */
export async function loadFonts(): Promise<void> {
  if (loaded) return;
  try {
    const { loadFont: loadPretendard } = await import(
      "@remotion/google-fonts/Pretendard" as string
    ).catch(() => ({ loadFont: undefined as undefined | (() => unknown) }));
    if (typeof loadPretendard === "function") {
      loadPretendard();
    }
    // Noto Serif KR via @remotion/google-fonts is the closest available Korean
    // editorial serif — Chosunilbo Myungjo is not on Google Fonts. The host
    // project should self-host Chosunilbo Myungjo if needed.
    const { loadFont: loadNotoSerifKR } = await import(
      "@remotion/google-fonts/NotoSerifKR" as string
    ).catch(() => ({ loadFont: undefined as undefined | (() => unknown) }));
    if (typeof loadNotoSerifKR === "function") {
      loadNotoSerifKR();
    }
  } catch {
    // Font loading is best-effort. Compositions fall back through the system
    // font chain in fontStacks if Google Fonts loaders are unavailable.
  }
  loaded = true;
}
