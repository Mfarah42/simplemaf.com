import { LINKS } from "../config";
import { safeUrl } from "../lib/dom";

/** A LINKS entry is live once it no longer contains the YOUR_ placeholder. */
export function resolved(key: string): string | null {
  const raw = LINKS[key];
  if (!raw || /YOUR_/.test(raw)) return null;
  return safeUrl(raw);
}

export function applyLink(el: Element, key: string): boolean {
  const url = resolved(key);
  if (!url) return false;
  el.setAttribute("href", url);
  if (!url.startsWith("mailto:")) {
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  }
  return true;
}

export function initLinks(): void {
  document.querySelectorAll<HTMLElement>("[data-social]").forEach((el) => {
    const key = el.dataset["social"];
    if (!key) return;
    const wired = applyLink(el, key);
    // elements marked data-optional stay hidden until their link is real,
    // e.g. the Email button before the simplemaf address exists
    if (!wired && el.dataset["optional"] !== undefined) el.hidden = true;
  });
}
