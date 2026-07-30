import { describe, expect, it } from "vitest";
import { SCENES, countdownAt, iconProgress, phoneScale, sceneAt, sunPos } from "../src/features/showcase";

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

describe("countdownAt", () => {
  it("holds 30:48 before the hero scene", () => {
    expect(countdownAt(0)).toBe("30:48");
    expect(countdownAt(0.24)).toBe("30:48");
  });

  it("reaches 5:12 at the end", () => {
    expect(countdownAt(1)).toBe("5:12");
    expect(countdownAt(2)).toBe("5:12");
  });

  it("counts down monotonically with zero-padded seconds", () => {
    const mid = countdownAt(0.6);
    expect(mid).toMatch(/^\d{1,2}:\d{2}$/);
    const toSecs = (s: string) => Number(s.split(":")[0]) * 60 + Number(s.split(":")[1]);
    expect(toSecs(countdownAt(0.3))).toBeGreaterThan(toSecs(countdownAt(0.6)));
    expect(toSecs(countdownAt(0.6))).toBeGreaterThan(toSecs(countdownAt(0.9)));
  });
});

describe("iconProgress", () => {
  it("flies in over the first fifth then holds", () => {
    expect(iconProgress(0)).toBe(0);
    expect(iconProgress(0.1)).toBeCloseTo(0.5);
    expect(iconProgress(0.2)).toBe(1);
    expect(iconProgress(0.9)).toBe(1);
  });

  it("clamps out-of-range input", () => {
    expect(iconProgress(-1)).toBe(0);
    expect(iconProgress(5)).toBe(1);
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

describe("phoneScale", () => {
  it("never upscales past the design size", () => {
    expect(phoneScale(900, 2000)).toBe(1);
  });

  it("fits by width when width is the constraint", () => {
    expect(phoneScale(232, 2000)).toBeCloseTo(0.8);
  });

  it("fits by height when height is the constraint", () => {
    expect(phoneScale(900, 295)).toBeCloseTo(0.5);
  });

  it("takes the smaller of the two constraints", () => {
    expect(phoneScale(232, 295)).toBeCloseTo(0.5);
  });

  it("has a sane floor so it never collapses", () => {
    expect(phoneScale(10, 10)).toBe(0.4);
  });
});
