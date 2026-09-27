import { describe, expect, it } from "vitest";
import { renderAppStore, shortDate, storeLine } from "../src/features/appstore";
import snapshot from "../src/generated/appstore.json";

describe("storeLine", () => {
  it("shows version and date, and the rating only once one exists", () => {
    expect(storeLine({ version: "1.3.0", updated: "2026-09-10", rating: 5, ratings: 3 })).toBe(
      "v1.3.0 · updated Sep 10 · 5.0 ★ (3)",
    );
    expect(storeLine({ version: "1.0", updated: "2026-09-22", rating: 0, ratings: 0 })).toBe("v1.0 · updated Sep 22");
  });

  it("formats dates without touching the timezone", () => {
    expect(shortDate("2026-01-01")).toBe("Jan 1");
    expect(shortDate("2026-12-31")).toBe("Dec 31");
    expect(shortDate("garbage")).toBe("garbage");
  });
});

describe("renderAppStore", () => {
  it("fills known apps and hides unknown ones", () => {
    document.body.innerHTML = `<p data-store="cadence"></p><p data-store="nope"></p>`;
    renderAppStore(document, { cadence: { version: "1.4", updated: "2026-09-17", rating: 5, ratings: 1 } });
    expect(document.querySelector<HTMLElement>('[data-store="cadence"]')?.textContent).toBe("v1.4 · updated Sep 17 · 5.0 ★ (1)");
    expect(document.querySelector<HTMLElement>('[data-store="nope"]')?.hidden).toBe(true);
  });

  it("the committed snapshot covers every app card key", () => {
    for (const key of ["quran", "cadence", "prayerwindows", "sweep", "tinycritic", "stockd"]) {
      expect(snapshot.apps).toHaveProperty(key);
    }
  });
});
