import { ANALYTICS } from "../config";

/** A Measurement ID is usable only once it is a real G- id, not the placeholder. */
export function isValidMeasurementId(id: unknown): id is string {
  return typeof id === "string" && /^G-[A-Z0-9]{6,}$/.test(id) && !id.includes("YOUR");
}

/**
 * Builds the gtag shim.
 *
 * gtag.js reads each queued command as the `arguments` object it was called
 * with, not as an array. Pushing a plain array (the natural thing to write
 * with rest parameters) loads the script but silently sends nothing, so this
 * forwards `arguments` itself. Covered by a test to keep it that way.
 */
export function createGtag(dataLayer: unknown[]): (...args: unknown[]) => void {
  function gtag(): void {
    dataLayer.push(arguments);
  }
  return gtag as unknown as (...args: unknown[]) => void;
}

/**
 * Loads Google Analytics 4, and only then. Until a real Measurement ID is set
 * the page still makes zero third-party requests, so the default build stays
 * self-contained. IP anonymisation is on by default in GA4.
 */
export function initAnalytics(): boolean {
  const id = ANALYTICS.measurementId;
  if (!isValidMeasurementId(id)) return false;
  if (/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) return false;

  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...a: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer ?? [];
  const gtag = createGtag(w.dataLayer);
  w.gtag = gtag;

  gtag("js", new Date());
  gtag("config", id);

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
  return true;
}
