import { describe, expect, it } from "vitest";
import { endQuip, scoreDelta } from "../src/features/game";

describe("scoreDelta", () => {
  it("rewards features and punishes bugs 3x", () => {
    expect(scoreDelta(false)).toBe(1);
    expect(scoreDelta(true)).toBe(-3);
  });
});

describe("endQuip", () => {
  it("tiers correctly at the boundaries", () => {
    expect(endQuip(0)).toMatch(/Scope creep/);
    expect(endQuip(5)).toMatch(/Scope creep/);
    expect(endQuip(6)).toMatch(/bugs put up a fight/);
    expect(endQuip(13)).toMatch(/bugs put up a fight/);
    expect(endQuip(14)).toMatch(/Solid sprint/);
    expect(endQuip(25)).toMatch(/Solid sprint/);
    expect(endQuip(26)).toMatch(/wrote tests/);
  });
});
