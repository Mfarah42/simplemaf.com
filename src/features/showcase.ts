/** The Prayer Windows showcase: a tall scroll region pins a hand-built phone
    and plays four scenes as the visitor scrolls. Pure DOM + CSS custom
    properties; no libraries, no video, nothing external. */

export const SCENES = 4;

/** Map overall progress 0..1 to a scene index and within-scene progress. */
export function sceneAt(p: number): { scene: number; sp: number } {
  const clamped = Math.min(1, Math.max(0, p));
  if (clamped >= 1) return { scene: SCENES - 1, sp: 1 };
  const scaled = clamped * SCENES;
  return { scene: Math.floor(scaled), sp: scaled - Math.floor(scaled) };
}

/** Sun position along a shallow arc, 0..1 across the phone screen. */
export function sunPos(p: number): { x: number; y: number } {
  const t = Math.min(1, Math.max(0, p));
  return { x: t, y: 4 * (t - 0.5) * (t - 0.5) }; // 1 at edges, 0 at noon
}

export function initShowcase(): void {
  const region = document.getElementById("showcase-scroll");
  const stage = document.getElementById("showcase-stage");
  if (!region || !stage) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    stage.classList.add("static", "scene-3");
    return;
  }

  let ticking = false;

  function update(): void {
    ticking = false;
    const rect = region!.getBoundingClientRect();
    const playable = rect.height - window.innerHeight;
    if (playable <= 0) return;
    const p = Math.min(1, Math.max(0, -rect.top / playable));
    const { scene, sp } = sceneAt(p);

    stage!.style.setProperty("--p", p.toFixed(4));
    stage!.style.setProperty("--sp", sp.toFixed(4));
    const sun = sunPos(p);
    stage!.style.setProperty("--sunx", sun.x.toFixed(4));
    stage!.style.setProperty("--suny", sun.y.toFixed(4));

    for (let i = 0; i < SCENES; i++) {
      stage!.classList.toggle(`scene-${i}`, i === scene);
    }
    // the window-fill bar scrubs through scene 1 and stays full after
    const fill = scene > 1 ? 1 : scene === 1 ? sp : 0;
    stage!.style.setProperty("--fill", fill.toFixed(4));
  }

  function onScroll(): void {
    if (document.hidden) {
      update();
      return;
    }
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}
