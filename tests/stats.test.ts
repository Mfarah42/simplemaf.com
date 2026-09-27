import { describe, expect, it } from "vitest";
import { renderStats } from "../src/features/stats";
import { STATS } from "../src/config";

describe("renderStats", () => {
  it("fills every data-stat cell with the rounded config value", () => {
    document.body.innerHTML = `
      <b data-stat="views">old</b><b data-stat="likes">old</b>
      <b data-stat="videos">old</b><b data-stat="apps">old</b><b data-stat="nope">keep</b>`;
    renderStats();
    const text = (k: string) => document.querySelector(`[data-stat="${k}"]`)?.textContent;
    expect(text("views")).toMatch(/^\d+(\.\d)?[KM]$/);
    expect(text("videos")).toBe(String(STATS.videos));
    expect(text("apps")).toBe(String(STATS.apps));
    expect(text("nope")).toBe("keep");
  });

  it("keeps the apps count in step with the cards on the page", () => {
    expect(STATS.apps).toBe(6);
  });
});
