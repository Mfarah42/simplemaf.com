import { describe, expect, it } from "vitest";
import { SCENES, sceneAt, sunPos } from "../src/features/showcase";

describe("sceneAt", () => {
  it("splits progress into equal scenes", () => {
    expect(sceneAt(0)).toEqual({ scene: 0, sp: 0 });
    expect(sceneAt(0.24).scene).toBe(0);
    expect(sceneAt(0.26).scene).toBe(1);
    expect(sceneAt(0.51).scene).toBe(2);
    expect(sceneAt(0.76).scene).toBe(3);
  });

  it("clamps out-of-range progress", () => {
    expect(sceneAt(-1)).toEqual({ scene: 0, sp: 0 });
    expect(sceneAt(1)).toEqual({ scene: SCENES - 1, sp: 1 });
    expect(sceneAt(99).scene).toBe(SCENES - 1);
  });

  it("within-scene progress spans 0..1", () => {
    const { sp } = sceneAt(0.375); // middle of scene 1
    expect(sp).toBeCloseTo(0.5);
  });
});

describe("sunPos", () => {
  it("rises to noon at the midpoint", () => {
    expect(sunPos(0).y).toBe(1);
    expect(sunPos(0.5).y).toBe(0);
    expect(sunPos(1).y).toBe(1);
    expect(sunPos(0.5).x).toBe(0.5);
  });

  it("clamps input", () => {
    expect(sunPos(-2).x).toBe(0);
    expect(sunPos(2).x).toBe(1);
  });
});
