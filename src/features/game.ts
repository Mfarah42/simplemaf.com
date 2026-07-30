import { byId, storageGet, storageSet } from "../lib/dom";

interface FallingItem {
  x: number;
  y: number;
  v: number;
  emoji: string;
  bad: boolean;
  phase: number;
}

const GOOD = ["⚡", "🧠", "✨", "📱", "🎯", "🚢"];
const BAD = ["🐛", "☁️", "📊", "💸"];
const ROUND = 30;

export function scoreDelta(bad: boolean): number {
  return bad ? -3 : 1;
}

export function endQuip(score: number): string {
  if (score >= 26) return "Suspiciously productive. Are you sure you wrote tests?";
  if (score >= 14) return "Solid sprint. Ship it Friday, regret it Saturday.";
  if (score >= 6) return "The bugs put up a fight.";
  return "Scope creep won. Happens to all of us.";
}

export function initGame(): { start: () => void } {
  const canvas = document.querySelector<HTMLCanvasElement>("canvas#game");
  if (!canvas) throw new Error("missing game canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no 2d context");

  const overlay = byId("gameOverlay");
  const oTitle = byId("overlayTitle");
  const oText = byId("overlayText");
  const legend = byId("legend");
  const playBtn = byId<HTMLButtonElement>("playBtn");
  const shareBtn = byId<HTMLButtonElement>("shareBtn");
  const scoreEl = byId("score");
  const timeEl = byId("time");
  const bestEl = byId("best");
  const noteEl = byId("gameNote");

  // The board sizes itself to its rendered width: wide and shallow on
  // desktop, taller than wide on phones so the overlay content fits and
  // there's actually room to play. Coordinates are CSS pixels.
  let W = canvas.width;
  let H = canvas.height;

  function sizeBoard(): void {
    const cssW = Math.round(canvas!.getBoundingClientRect().width);
    if (cssW < 100) return; // hidden or not laid out yet: keep defaults
    W = cssW;
    H = cssW < 560 ? Math.round(cssW * 1.15) : Math.round(cssW * (470 / 900));
    canvas!.width = W;
    canvas!.height = H;
  }

  let best = Number(storageGet("shipItBest")) || 0;
  if (!Number.isFinite(best) || best < 0 || best > 9999) best = 0;
  bestEl.textContent = String(best);

  let running = false;
  let score = 0;
  let timeLeft = ROUND;
  let pad = { x: W / 2, w: 122, h: 26 };
  let items: FallingItem[] = [];
  let spawnAcc = 0;
  let lastTs: number | null = null;
  let raf = 0;
  // Round length is wall-clock so rAF throttling in occluded windows can't
  // stretch a 30-second sprint into minutes; hiding the tab pauses instead.
  let roundEndsAt = 0;
  let pausedRemaining: number | null = null;

  const cssVar = (n: string): string =>
    getComputedStyle(document.documentElement).getPropertyValue(n).trim() || "#C97A62";

  function reset(): void {
    score = 0;
    timeLeft = ROUND;
    items = [];
    spawnAcc = 0;
    lastTs = null;
    pausedRemaining = null;
    // pad narrows on small boards so mobile isn't trivially easy
    pad = { x: W / 2, w: Math.min(122, Math.round(W * 0.3)), h: 26 };
    scoreEl.textContent = "0";
    timeEl.textContent = String(ROUND);
  }

  function spawn(): void {
    const bad = Math.random() < 0.26;
    const pool = bad ? BAD : GOOD;
    items.push({
      x: 46 + Math.random() * (W - 92),
      y: -34,
      v: 2.3 + Math.random() * 2.3 + (ROUND - timeLeft) * 0.055,
      emoji: pool[(Math.random() * pool.length) | 0] as string,
      bad,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function draw(): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    const padY = H - 48;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = '34px system-ui, "Apple Color Emoji", sans-serif';
    for (const it of items) ctx.fillText(it.emoji, it.x + Math.sin(it.phase) * 7, it.y);

    ctx.fillStyle = cssVar("--rust-fill");
    ctx.beginPath();
    ctx.roundRect(pad.x - pad.w / 2, padY, pad.w, pad.h, 10);
    ctx.fill();

    ctx.fillStyle = cssVar("--on-rust");
    ctx.font = '600 13px ui-monospace, "SF Mono", Menlo, monospace';
    ctx.fillText("SHIP", pad.x, padY + pad.h / 2 + 1);
  }

  function frame(ts: number): void {
    if (!running) return;
    if (lastTs === null) lastTs = ts;
    const dt = Math.min(ts - lastTs, 60); // background-tab gaps never fast-forward
    lastTs = ts;

    timeLeft = Math.ceil((roundEndsAt - performance.now()) / 1000);
    timeEl.textContent = String(Math.max(0, timeLeft));
    if (timeLeft <= 0) {
      end();
      return;
    }

    spawnAcc += dt;
    if (spawnAcc >= Math.max(400, 880 - (ROUND - timeLeft) * 15)) {
      spawnAcc = 0;
      spawn();
    }

    const padY = H - 48;
    const step = dt / 16.7;
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i] as FallingItem;
      it.y += it.v * step;
      it.phase += 0.045 * step;
      const hit =
        it.y > padY - 14 &&
        it.y < padY + pad.h + 12 &&
        Math.abs(it.x - pad.x) < pad.w / 2 + 15;
      if (hit) {
        score = Math.max(0, score + scoreDelta(it.bad));
        scoreEl.textContent = String(score);
        items.splice(i, 1);
      } else if (it.y > H + 40) {
        items.splice(i, 1);
      }
    }

    draw();
    raf = requestAnimationFrame(frame);
  }

  function end(): void {
    running = false;
    cancelAnimationFrame(raf);
    const isBest = score > best;
    if (isBest) {
      best = score;
      storageSet("shipItBest", String(best));
      bestEl.textContent = String(best);
    }
    oTitle.textContent = isBest ? "New best" : "Sprint over";
    oText.textContent = `You shipped ${score} feature${score === 1 ? "" : "s"}. ${endQuip(score)}`;
    playBtn.textContent = "Run it again";
    legend.style.display = "none";
    shareBtn.hidden = false;
    overlay.hidden = false;
  }

  function start(): void {
    reset();
    legend.style.display = "";
    overlay.hidden = true;
    running = true;
    roundEndsAt = performance.now() + ROUND * 1000;
    raf = requestAnimationFrame(frame);
  }

  playBtn.addEventListener("click", start);

  document.addEventListener("visibilitychange", () => {
    if (!running) return;
    if (document.hidden) {
      pausedRemaining = Math.max(0, roundEndsAt - performance.now());
      cancelAnimationFrame(raf);
    } else if (pausedRemaining !== null) {
      roundEndsAt = performance.now() + pausedRemaining;
      pausedRemaining = null;
      lastTs = null;
      raf = requestAnimationFrame(frame);
    }
  });

  shareBtn.addEventListener("click", () => {
    const text = `I shipped ${score} features in Ship It (best: ${best}) 🚢`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          noteEl.textContent = "Copied. Go paste it in the comments.";
        },
        () => {
          noteEl.textContent = text;
        },
      );
    } else {
      noteEl.textContent = text;
    }
  });

  function movePad(clientX: number): void {
    const r = canvas!.getBoundingClientRect();
    pad.x = Math.max(pad.w / 2, Math.min(W - pad.w / 2, (clientX - r.left) * (W / r.width)));
  }
  canvas.addEventListener("pointermove", (e) => {
    if (running) movePad(e.clientX);
  });
  canvas.addEventListener("pointerdown", (e) => {
    if (running) movePad(e.clientX);
  });
  canvas.addEventListener(
    "touchmove",
    (e) => {
      if (!running) return;
      e.preventDefault();
      const t = e.touches[0];
      if (t) movePad(t.clientX);
    },
    { passive: false },
  );

  window.addEventListener("keydown", (e) => {
    if (!running) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    pad.x = Math.max(
      pad.w / 2,
      Math.min(W - pad.w / 2, pad.x + (e.key === "ArrowLeft" ? -52 : 52)),
    );
    draw();
  });

  window.addEventListener("resize", () => {
    if (running) return; // never yank the board mid-sprint
    const before = W;
    sizeBoard();
    if (W !== before) {
      reset();
      draw();
    }
  });

  sizeBoard();
  reset();
  draw(); // idle board so the section never looks broken before first play
  return { start };
}
