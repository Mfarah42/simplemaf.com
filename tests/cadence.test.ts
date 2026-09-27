import { describe, expect, it } from "vitest";
import { describe as sentence, parseDate, parseRotation, rotationStatus } from "../src/features/cadence";

const d = (s: string) => parseDate(s) as Date;

describe("parseRotation", () => {
  it("reads on/off pairs and rejects junk", () => {
    expect(parseRotation("14/14")).toEqual({ on: 14, off: 14 });
    expect(parseRotation(" 21 / 7 ")).toEqual({ on: 21, off: 7 });
    expect(parseRotation("0/7")).toBeNull();
    expect(parseRotation("14")).toBeNull();
    expect(parseRotation("a/b")).toBeNull();
  });
});

describe("rotationStatus", () => {
  const r = { on: 14, off: 14 };

  it("day one of the first hitch is on", () => {
    const s = rotationStatus(r, d("2026-09-01"), d("2026-09-01"));
    expect(s.state).toBe("on");
    expect(s.day).toBe(1);
    expect(s.next).toEqual(d("2026-09-15"));
    expect(s.daysUntil).toBe(14);
  });

  it("the last on day flips tomorrow", () => {
    const s = rotationStatus(r, d("2026-09-01"), d("2026-09-14"));
    expect(s).toMatchObject({ state: "on", day: 14, daysUntil: 1 });
  });

  it("first off day and the way back on", () => {
    const s = rotationStatus(r, d("2026-09-01"), d("2026-09-15"));
    expect(s).toMatchObject({ state: "off", day: 1, length: 14, daysUntil: 14 });
    expect(s.next).toEqual(d("2026-09-29"));
  });

  it("wraps across many cycles and uneven rotations", () => {
    const s = rotationStatus({ on: 21, off: 7 }, d("2026-01-05"), d("2026-09-27"));
    // 265 days elapsed, cycle 28 -> position 13 -> on, day 14
    expect(s).toMatchObject({ state: "on", day: 14, length: 21, daysUntil: 8 });
  });

  it("before the first hitch reports the start date", () => {
    const s = rotationStatus(r, d("2026-10-03"), d("2026-09-27"));
    expect(s).toMatchObject({ state: "before", daysUntil: 6 });
    expect(s.next).toEqual(d("2026-10-03"));
  });

  it("is unaffected by the DST change in early November", () => {
    const s = rotationStatus({ on: 7, off: 7 }, d("2026-10-26"), d("2026-11-03"));
    expect(s).toMatchObject({ state: "off", day: 2 });
  });
});

describe("describe", () => {
  it("escapes nothing dangerous and names the flip", () => {
    const text = sentence(rotationStatus({ on: 14, off: 14 }, d("2026-09-01"), d("2026-09-14")));
    expect(text).toContain("On");
    expect(text).toContain("day 14 of 14");
    expect(text).toContain("tomorrow");
    expect(text).not.toContain("<script");
  });
});
