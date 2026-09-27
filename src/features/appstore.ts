import snapshot from "../generated/appstore.json";
import { esc } from "../lib/dom";

export interface StoreEntry {
  version: string;
  /** YYYY-MM-DD */
  updated: string;
  rating: number;
  ratings: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-10" -> "Sep 10". Parsed by hand so the date never shifts with the viewer's timezone. */
export function shortDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${MONTHS[Number(m[2]) - 1] ?? "?"} ${Number(m[3])}`;
}

/** "v1.3.0 · updated Sep 10 · 5.0 ★ (3)". The rating only appears once someone has left one. */
export function storeLine(e: StoreEntry): string {
  const parts = [`v${e.version}`, `updated ${shortDate(e.updated)}`];
  if (e.ratings > 0 && e.rating > 0) {
    parts.push(`${e.rating.toFixed(1)} ★ (${e.ratings})`);
  }
  return parts.join(" · ");
}

export function renderAppStore(root: ParentNode = document, apps: Record<string, StoreEntry> = snapshot.apps): void {
  root.querySelectorAll<HTMLElement>("[data-store]").forEach((el) => {
    const entry = apps[el.dataset["store"] ?? ""];
    if (!entry) {
      el.hidden = true;
      return;
    }
    el.innerHTML = esc(storeLine(entry));
    el.hidden = false;
  });
}

export function initAppStore(): void {
  renderAppStore();
}
