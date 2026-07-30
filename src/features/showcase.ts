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

/** The Maghrib countdown scrubs from 30:48 down to 5:12 across scenes 1-3. */
export function countdownAt(p: number): string {
  const FULL = 30 * 60 + 48;
  const FLOOR = 5 * 60 + 12;
  if (p < 0.25) return "30:48";
  const t = Math.min(1, (p - 0.25) / 0.75);
  const secs = Math.round(FULL - t * (FULL - FLOOR));
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
}

const PHONE_W = 290;
const PHONE_H = 688;

/** 0 while the showcase is still a viewport away, 1 once it pins. Drives the
    app icon's journey from its card down to the phone. */
export function flyProgress(regionTop: number, viewportH: number): number {
  if (viewportH <= 0) return 0;
  return Math.min(1, Math.max(0, 1 - regionTop / viewportH));
}

const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

/** Largest scale at which the fixed-size phone fits the space available. */
export function phoneScale(slotWidth: number, availableHeight: number): number {
  const byWidth = slotWidth / PHONE_W;
  const byHeight = availableHeight / PHONE_H;
  return Math.max(0.4, Math.min(1, byWidth, byHeight));
}

export function initShowcase(): void {
  const region = document.getElementById("showcase-scroll");
  const stage = document.getElementById("showcase-stage");
  if (!region || !stage) return;

  const slot = stage.querySelector<HTMLElement>(".phone-slot");
  const captions = stage.querySelector<HTMLElement>(".sc-captions");
  const fly = stage.querySelector<HTMLElement>(".sc-flyicon");
  const flySrc = document.querySelector<HTMLElement>("[data-flysrc]");

  /** The icon hands off from the app card and travels to the phone. */
  function updateFly(): void {
    if (!fly || !flySrc || !slot) return;
    const t = flyProgress(region!.getBoundingClientRect().top, window.innerHeight);
    if (t <= 0) {
      fly.style.opacity = "0";
      flySrc.style.opacity = "1";
      return;
    }
    const src = flySrc.getBoundingClientRect();
    const box = slot.getBoundingClientRect();
    const stacked = window.innerWidth <= 760;
    const destSize = stacked ? 46 : 56;
    const destLeft = stacked ? box.left - 10 : box.left - destSize - 26;
    const destTop = stacked ? box.top - destSize - 12 : box.top + 10;
    const e = easeOut(t);
    const size = src.width + (destSize - src.width) * e;

    fly.style.width = `${size}px`;
    fly.style.height = `${size}px`;
    fly.style.left = `${src.left + (destLeft - src.left) * e}px`;
    fly.style.top = `${src.top + (destTop - src.top) * e}px`;
    fly.style.transform = `rotate(${(1 - e) * -12}deg)`;
    fly.style.opacity = "1";
    // hand off: the card's own icon fades as the flying copy takes over
    flySrc.style.opacity = String(Math.max(0, 1 - t * 4));
  }

  function fitPhone(): void {
    if (!slot) return;
    const stacked = window.innerWidth <= 760;
    // stacked: caption sits above the phone, so it eats from the height budget
    const capH = stacked && captions ? captions.getBoundingClientRect().height + 34 : 0;
    const avail = window.innerHeight - capH - (stacked ? 40 : 60);
    const room = stacked
      ? Math.min(window.innerWidth - 48, 420)
      : stage!.getBoundingClientRect().width * 0.46;
    stage!.style.setProperty("--phone-scale", phoneScale(room, avail).toFixed(4));
  }

  function relayout(): void {
    fitPhone();
    updateFly();
  }

  relayout();
  // serif metrics change the panel heights, so measure again once fonts land
  document.fonts?.ready.then(relayout).catch(() => {});
  window.addEventListener("load", relayout);
  window.addEventListener("resize", relayout, { passive: true });

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
    stage!.style.setProperty("--fill", (0.55 + fill * 0.4).toFixed(4));

    updateFly();

    const count = document.getElementById("pwCountdown");
    if (count) count.textContent = countdownAt(p);
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
