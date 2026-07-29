import { esc } from "../lib/dom";
import { resolved } from "./links";

export interface Command {
  label: string;
  hint: string;
  run: () => void;
}

/** ⌘K / Ctrl+K command palette. Every action is local: navigation, theme,
    game, and opening the socials that are actually configured. */
export function initPalette(deps: { cycleTheme: () => void; startGame: () => void }): void {
  const jump = (sel: string) => () =>
    document.querySelector(sel)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const open = (key: string) => () => {
    const url = resolved(key);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const commands: Command[] = [
    { label: "Go to explainers", hint: "videos", run: jump("#explainers") },
    { label: "Go to apps", hint: "Stockd · Prayer Windows · Cadence", run: jump("#apps") },
    { label: "Go to AI decoder", hint: "jargon, translated", run: jump("#decoder") },
    { label: "Run the math", hint: "lease vs buy", run: jump("#math") },
    { label: "Go to stack", hint: "/uses", run: jump("#stack") },
    { label: "Toggle theme", hint: "auto → light → dark", run: deps.cycleTheme },
    {
      label: "Play Ship It",
      hint: "30 seconds",
      run: () => {
        jump("#play")();
        setTimeout(deps.startGame, 450);
      },
    },
    ...(resolved("tiktok")
      ? [{ label: "Open TikTok", hint: "@simplemaf", run: open("tiktok") }]
      : []),
    ...(resolved("bluesky")
      ? [{ label: "Open Bluesky", hint: "@simplemaf.bsky.social", run: open("bluesky") }]
      : []),
  ];

  const host = document.createElement("div");
  host.id = "palette";
  host.hidden = true;
  host.innerHTML = `
    <div class="pal-scrim" data-close></div>
    <div class="pal-box" role="dialog" aria-modal="true" aria-label="Command palette">
      <input id="palInput" type="text" placeholder="Type a command…" autocomplete="off" spellcheck="false">
      <div class="pal-list" id="palList" role="listbox"></div>
      <div class="pal-foot"><span>↑↓ navigate · ↵ run · esc close</span><span class="mono">⌘K</span></div>
    </div>`;
  document.body.appendChild(host);

  const input = host.querySelector<HTMLInputElement>("#palInput");
  const listEl = host.querySelector<HTMLElement>("#palList");
  if (!input || !listEl) return;

  let filtered = commands;
  let sel = 0;

  function render(): void {
    listEl!.innerHTML = filtered.length
      ? filtered
          .map(
            (c, i) => `
        <button type="button" class="pal-item${i === sel ? " sel" : ""}" data-i="${i}" role="option" aria-selected="${i === sel}">
          <span>${esc(c.label)}</span><span class="pal-hint">${esc(c.hint)}</span>
        </button>`,
          )
          .join("")
      : `<p class="pal-empty">Nothing matches. It's a small site.</p>`;
  }

  function openPal(): void {
    host.hidden = false;
    input!.value = "";
    filtered = commands;
    sel = 0;
    render();
    input!.focus();
  }

  function closePal(): void {
    host.hidden = true;
  }

  function runSel(): void {
    const cmd = filtered[sel];
    if (!cmd) return;
    closePal();
    cmd.run();
  }

  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      host.hidden ? openPal() : closePal();
      return;
    }
    if (host.hidden) return;
    if (e.key === "Escape") closePal();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      sel = Math.min(sel + 1, filtered.length - 1);
      render();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      sel = Math.max(sel - 1, 0);
      render();
    } else if (e.key === "Enter") {
      e.preventDefault();
      runSel();
    }
  });

  input.addEventListener("input", () => {
    const q = input!.value.trim().toLowerCase();
    filtered = commands.filter((c) =>
      `${c.label} ${c.hint}`.toLowerCase().includes(q),
    );
    sel = 0;
    render();
  });

  listEl.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>(".pal-item");
    if (!b) return;
    sel = Number(b.dataset["i"]);
    runSel();
  });

  host.querySelector("[data-close]")?.addEventListener("click", closePal);
}
