import { describe, expect, it } from "vitest";
import { normalizeVideo } from "../src/features/videos";

describe("normalizeVideo", () => {
  it("accepts a minimal valid row", () => {
    expect(normalizeVideo({ date: "Jul 28", title: "Hello" })).toEqual({
      date: "Jul 28",
      title: "Hello",
    });
  });

  it("rejects rows without string title and date", () => {
    expect(normalizeVideo(null)).toBeNull();
    expect(normalizeVideo("string")).toBeNull();
    expect(normalizeVideo({ title: "x" })).toBeNull();
    expect(normalizeVideo({ date: "x", title: 42 })).toBeNull();
  });

  it("drops javascript: urls but keeps the row", () => {
    const v = normalizeVideo({ date: "d", title: "t", url: "javascript:alert(1)" });
    expect(v).not.toBeNull();
    expect(v?.url).toBeUndefined();
  });

  it("keeps https urls", () => {
    const v = normalizeVideo({ date: "d", title: "t", url: "https://www.tiktok.com/@simplemaf/video/1" });
    expect(v?.url).toContain("https://");
  });

  it("survives the audit's malformed-receipt shapes without throwing", () => {
    expect(normalizeVideo({ date: "d", title: "t", receipt: "not-an-array" })?.receipt).toBeUndefined();
    expect(normalizeVideo({ date: "d", title: "t", receipt: [null] })?.receipt).toBeUndefined();
    expect(normalizeVideo({ date: "d", title: "t", sources: "https://x" })?.sources).toBeUndefined();
  });

  it("filters bad cells but keeps good ones", () => {
    const v = normalizeVideo({
      date: "d",
      title: "t",
      receipt: [{ label: "Monthly", value: "$54" }, { label: 5, value: null }, "junk"],
      sources: [
        { label: "ok", url: "https://example.com" },
        { label: "bad scheme", url: "javascript:x" },
      ],
    });
    expect(v?.receipt).toEqual([{ label: "Monthly", value: "$54" }]);
    expect(v?.sources).toEqual([{ label: "ok", url: "https://example.com" }]);
  });
});
