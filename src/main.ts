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
import { initDecoder } from "./features/decoder";
import { initStack } from "./features/stack";
import { initCalculator } from "./features/calculator";
import { initTheme } from "./features/theme";
import { initGame } from "./features/game";
import { initPalette } from "./features/palette";

initLinks();
initVideos();
initDecoder();
initStack();
initCalculator();
const theme = initTheme();
const game = initGame();
initPalette({ cycleTheme: theme.cycle, startGame: game.start });

// A quiet hello for whoever opens devtools. You know who you are.
console.log(
  "%cSimpleMAF %c⌘K works here. Static file, no trackers. View source, it's all there.",
  "font-weight:700",
  "font-weight:400",
);
