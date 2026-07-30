import { VIDEOS, type Video } from "../config";
import { byId, esc, safeUrl } from "../lib/dom";
import { resolved } from "./links";

const MAX_VIDEOS = 8;
const MAX_JSON_BYTES = 64 * 1024;

function hasReceipt(v: Video): boolean {
  return Boolean(v.receipt?.length || v.note || v.sources?.length);
}

function receiptBody(v: Video): string {
  const cells = (v.receipt ?? [])
    .map((r) => `<div><dt>${esc(r.label)}</dt><dd class="serif">${esc(r.value)}</dd></div>`)
    .join("");
  const srcs = (v.sources ?? [])
    .flatMap((s) => {
      const url = safeUrl(s.url);
      return url
        ? [`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`]
        : [];
    })
    .join(" · ");
  return (
    (cells ? `<dl class="receipt-grid">${cells}</dl>` : "") +
    (v.note ? `<p class="receipt-note">${esc(v.note)}</p>` : "") +
    (srcs ? `<p class="receipt-src"><b>Sources:</b> ${srcs}</p>` : "")
  );
}

export function renderVideos(videos: Video[]): void {
  const list = byId("vidList");

  list.innerHTML = videos
    .map((v, i) => {
      const expandable = hasReceipt(v);
      return `<div class="vid" data-i="${i}" data-receipt="${expandable ? "1" : "0"}">
      <button class="vid-head" type="button" aria-expanded="false">
        <span class="kicker">${esc(v.date)}</span>
        <span class="vb">
          <h3 class="serif">${esc(v.title)}</h3>
          <span class="tags mono">${esc(v.tags ?? "")}</span>
        </span>
        <span class="mark" aria-hidden="true">${expandable ? "Receipts" : "Watch ↗"}</span>
      </button>
      ${expandable ? `<div class="vid-body">${receiptBody(v)}</div>` : ""}
    </div>`;
    })
    .join("");

  list.querySelectorAll<HTMLElement>(".vid").forEach((row) => {
    const v = videos[Number(row.dataset["i"])];
    const btn = row.querySelector<HTMLButtonElement>(".vid-head");
    if (!v || !btn) return;

    btn.addEventListener("click", () => {
      if (row.dataset["receipt"] === "1") {
        const open = row.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
        return;
      }
      const url = safeUrl(v.url) ?? resolved("tiktok");
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    });
  });
}

const str = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);

/**
 * Normalize one untrusted videos.json row into a well-shaped Video, or null.
 * Per-entry, so one malformed row never silently discards the whole refresh
 * (the audit's failure case: a bad receipt shape throwing mid-render).
 * URLs are additionally scheme-checked at the sinks via safeUrl.
 */
export function normalizeVideo(v: unknown): Video | null {
  if (typeof v !== "object" || v === null) return null;
  const o = v as Record<string, unknown>;
  const title = str(o["title"]);
  const date = str(o["date"]);
  if (!title || !date) return null;

  const out: Video = { date, title };
  const tags = str(o["tags"]);
  if (tags) out.tags = tags;
  const note = str(o["note"]);
  if (note) out.note = note;
  const url = str(o["url"]);
  if (url && safeUrl(url)) out.url = url;

  if (Array.isArray(o["receipt"])) {
    const cells = (o["receipt"] as unknown[]).flatMap((r) => {
      const c = r as Record<string, unknown> | null;
      const label = c && str(c["label"]);
      const value = c && str(c["value"]);
      return label && value ? [{ label, value }] : [];
    });
    if (cells.length) out.receipt = cells;
  }
  if (Array.isArray(o["sources"])) {
    const srcs = (o["sources"] as unknown[]).flatMap((s) => {
      const c = s as Record<string, unknown> | null;
      const label = c && str(c["label"]);
      const u = c && str(c["url"]);
      return label && u && safeUrl(u) ? [{ label, url: u }] : [];
    });
    if (srcs.length) out.sources = srcs;
  }
  return out;
}

/**
 * videos.json beats the inline list when present, so a scheduled job can
 * refresh the feed without touching the page. Same-origin only; capped in
 * size and count; every row normalized; every URL scheme-checked.
 * Browsers block this fetch for a file:// open, which is fine.
 */
export async function loadExternalVideos(): Promise<void> {
  try {
    const res = await fetch("videos.json", { cache: "no-store" });
    if (!res.ok) return;
    const text = await res.text();
    if (text.length > MAX_JSON_BYTES) {
      console.warn("videos.json skipped: over size cap");
      return;
    }
    const data: unknown = JSON.parse(text);
    const list = Array.isArray(data)
      ? data
      : (data as { videos?: unknown[] } | null)?.videos;
    if (Array.isArray(list)) {
      const fresh = list
        .map(normalizeVideo)
        .filter((v): v is Video => v !== null)
        .slice(0, MAX_VIDEOS);
      if (fresh.length) {
        renderVideos(fresh);
        injectVideoJsonLd(fresh);
      } else {
        console.warn("videos.json skipped: no valid rows");
      }
    }
  } catch (e) {
    // file:// origin or no videos.json: expected, stay quiet is wrong only
    // when the file exists but is broken, so surface a diagnostic anyway.
    if (location.protocol !== "file:") console.warn("videos.json skipped:", e);
  }
}

/**
 * Structured data so search engines see each explainer as a distinct work.
 * Uses the direct video url when a row has one; the TikTok profile otherwise.
 * Rebuilt whenever the list renders (including a videos.json refresh).
 */
export function injectVideoJsonLd(videos: Video[]): void {
  const profile = resolved("tiktok") ?? "https://www.tiktok.com/@simplemaf";
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SimpleMAF explainers",
    itemListElement: videos.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: v.title,
        url: safeUrl(v.url) ?? profile,
        creator: { "@type": "Person", name: "Mohamed", alternateName: "SimpleMAF" },
      },
    })),
  };
  document.getElementById("videosJsonLd")?.remove();
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.id = "videosJsonLd";
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

export function initVideos(): void {
  renderVideos(VIDEOS);
  injectVideoJsonLd(VIDEOS);
  void loadExternalVideos();
}
