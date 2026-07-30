import "./styles.css";
// Best-effort clickjacking deterrent: meta CSP cannot carry frame-ancestors
// and GitHub Pages sends no headers, so break out of any hostile frame.
if (window.top !== window.self) {
  try {
    window.top!.location.href = window.location.href;
  } catch {
    document.documentElement.style.display = "none";
  }
}

import { initLinks } from "./features/links";
import { initVideos } from "./features/videos";
import { initStack } from "./features/stack";
import { initTheme } from "./features/theme";
import { initGame } from "./features/game";
import { initPalette } from "./features/palette";
import { initReveal } from "./features/reveal";
import { initShowcase } from "./features/showcase";
import { initAnalytics } from "./features/analytics";

// reveal styles only apply when JS runs, so a no-JS page stays fully visible
document.documentElement.classList.add("js");

initAnalytics();
initLinks();
initVideos();
initStack();
const theme = initTheme();
const game = initGame();
initPalette({ cycleTheme: theme.cycle, startGame: game.start });
// the wordmark returns to the very top, not just to the hero anchor
document.querySelector(".nav-name")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

initReveal();
initShowcase();

// A quiet hello for whoever opens devtools. You know who you are.
console.log(
  "%cSimpleMAF %c⌘K works here. One static file. View source, it's all there.",
  "font-weight:700",
  "font-weight:400",
);
