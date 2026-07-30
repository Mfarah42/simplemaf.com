import { ANALYTICS } from "../config";

/** A Measurement ID is usable only once it is a real G- id, not the placeholder. */
export function isValidMeasurementId(id: unknown): id is string {
  return typeof id === "string" && /^G-[A-Z0-9]{6,}$/.test(id) && !id.includes("YOUR");
}

/**
 * Loads Google Analytics 4, and only then. Until a real Measurement ID is set
 * the page still makes zero third-party requests, so the default build stays
 * self-contained. IP anonymisation is on by default in GA4.
 */
export function initAnalytics(): boolean {
  const id = ANALYTICS.measurementId;
  if (!isValidMeasurementId(id)) return false;

  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  function gtag(...args: unknown[]): void {
    w.dataLayer!.push(args);
  }
  w.gtag = gtag;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);

  gtag("js", new Date());
  gtag("config", id);
  return true;
}
