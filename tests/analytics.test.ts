import { describe, expect, it } from "vitest";
import { isValidMeasurementId } from "../src/features/analytics";

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
