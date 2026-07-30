import { describe, expect, it } from "vitest";
import { createGtag, isValidMeasurementId } from "../src/features/analytics";

describe("isValidMeasurementId", () => {
  it("accepts a real GA4 measurement id", () => {
    expect(isValidMeasurementId("G-ABC1234567")).toBe(true);
    expect(isValidMeasurementId("G-XYZ789012")).toBe(true);
  });

  it("rejects the shipped placeholder so no script loads by default", () => {
    expect(isValidMeasurementId("G-YOUR_ID")).toBe(false);
  });

  it("rejects anything not shaped like a GA4 id", () => {
    expect(isValidMeasurementId("")).toBe(false);
    expect(isValidMeasurementId("UA-12345-1")).toBe(false);
    expect(isValidMeasurementId("g-abc1234567")).toBe(false);
    expect(isValidMeasurementId("G-123")).toBe(false);
    expect(isValidMeasurementId(undefined)).toBe(false);
    expect(isValidMeasurementId(12345)).toBe(false);
  });

  it("rejects ids containing YOUR in any position", () => {
    expect(isValidMeasurementId("G-YOURID1234")).toBe(false);
  });
});

describe("createGtag", () => {
  it("queues the arguments object, not an array", () => {
    // gtag.js ignores plain arrays: pushing one loads the script but sends
    // nothing, which is exactly the bug this guards against.
    const dl: unknown[] = [];
    const gtag = createGtag(dl);
    gtag("config", "G-ABC1234567");

    expect(dl).toHaveLength(1);
    const queued = dl[0] as IArguments;
    expect(Array.isArray(queued)).toBe(false);
    expect(Object.prototype.toString.call(queued)).toBe("[object Arguments]");
    expect(queued.length).toBe(2);
    expect(queued[0]).toBe("config");
    expect(queued[1]).toBe("G-ABC1234567");
  });

  it("preserves each call in order", () => {
    const dl: unknown[] = [];
    const gtag = createGtag(dl);
    const now = new Date();
    gtag("js", now);
    gtag("event", "page_view", { page_title: "x" });

    expect(dl).toHaveLength(2);
    expect((dl[0] as IArguments)[0]).toBe("js");
    expect((dl[0] as IArguments)[1]).toBe(now);
    expect((dl[1] as IArguments)[2]).toEqual({ page_title: "x" });
  });
});
