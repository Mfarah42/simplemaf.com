/** Escape a string for interpolation into HTML text or attribute context. */
export function esc(s: unknown): string {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

/**
 * Allow only http(s) and mailto URLs. Everything else (javascript:, data:,
 * vbscript:, protocol-relative surprises) collapses to null. Applied to every
 * URL that reaches an href or window.open, including ones from videos.json.
 */
export function safeUrl(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > 2048) return null;
  let url: URL;
  try {
    url = new URL(raw); // absolute URLs only: relative ones are not links we generate
  } catch {
    return null;
  }
  const scheme = url.protocol;
  if (scheme === "http:" || scheme === "https:" || scheme === "mailto:") return url.href;
  return null;
}

export function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`missing #${id}`);
  return el as T;
}

/** Read a localStorage key, tolerating private-mode and corrupt values. */
export function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function storageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode: scores and theme just don't persist */
  }
}
