import { describe, expect, it } from "vitest";
import { esc, safeUrl } from "../src/lib/dom";

describe("esc", () => {
  it("escapes every HTML metacharacter", () => {
    expect(esc(`<img src=x onerror=alert(1)>`)).toBe(
      "&lt;img src=x onerror=alert(1)&gt;",
    );
    expect(esc(`"quoted" & 'single'`)).toBe(
      "&quot;quoted&quot; &amp; &#39;single&#39;",
    );
  });

  it("is safe in attribute context", () => {
    const payload = `" onmouseover="alert(1)`;
    expect(esc(payload)).not.toContain('"');
  });

  it("stringifies non-strings", () => {
    expect(esc(42)).toBe("42");
    expect(esc(null)).toBe("null");
  });
});

describe("safeUrl", () => {
  it("allows http, https, and mailto", () => {
    expect(safeUrl("https://apps.apple.com/app/id6786077175")).toContain("https://");
    expect(safeUrl("http://example.com/a?b=c")).toContain("http://");
    expect(safeUrl("mailto:hi@example.com")).toBe("mailto:hi@example.com");
  });

  it("rejects script-bearing schemes", () => {
    expect(safeUrl("javascript:alert(1)")).toBeNull();
    expect(safeUrl("JaVaScRiPt:alert(1)")).toBeNull();
    expect(safeUrl(" javascript:alert(1)")).toBeNull();
    expect(safeUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(safeUrl("vbscript:msgbox(1)")).toBeNull();
  });

  it("rejects relative and malformed URLs", () => {
    expect(safeUrl("/local/path")).toBeNull();
    expect(safeUrl("//evil.example")).toBeNull();
    expect(safeUrl("not a url")).toBeNull();
    expect(safeUrl("")).toBeNull();
    expect(safeUrl(undefined)).toBeNull();
    expect(safeUrl(12345)).toBeNull();
  });

  it("rejects absurdly long URLs", () => {
    expect(safeUrl("https://example.com/" + "a".repeat(3000))).toBeNull();
  });
});
