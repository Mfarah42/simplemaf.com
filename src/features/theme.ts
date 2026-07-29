import { byId, storageGet, storageSet } from "../lib/dom";

export type ThemeMode = "auto" | "light" | "dark";

const ORDER: ThemeMode[] = ["auto", "light", "dark"];
const FACE: Record<ThemeMode, string> = { auto: "◐", light: "☀", dark: "☾" };
const LABEL: Record<ThemeMode, string> = {
  auto: "Theme: follows your system",
  light: "Theme: light",
  dark: "Theme: dark",
};

export function nextMode(mode: ThemeMode): ThemeMode {
  return ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length] as ThemeMode;
}

export function initTheme(): { cycle: () => void } {
  const btn = byId<HTMLButtonElement>("themeBtn");
  const icon = byId("themeIcon");
  const root = document.documentElement;

  let mode: ThemeMode = "auto";
  const saved = storageGet("theme");
  if (saved === "light" || saved === "dark") mode = saved;

  function paint(): void {
    if (mode === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", mode);
    icon.textContent = FACE[mode];
    btn.title = LABEL[mode];
    btn.setAttribute("aria-label", `${LABEL[mode]}. Tap to change.`);

    // keep the mobile browser chrome in step with an explicit choice
    const dark =
      mode === "dark" ||
      (mode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
    const m = document.createElement("meta");
    m.name = "theme-color";
    m.content = dark ? "#18181C" : "#FEFBF6";
    document.head.appendChild(m);
  }

  function cycle(): void {
    mode = nextMode(mode);
    storageSet("theme", mode);
    paint();
  }

  btn.addEventListener("click", cycle);
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (mode === "auto") paint();
    });

  paint();
  return { cycle };
}
