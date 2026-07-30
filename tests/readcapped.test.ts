import { describe, expect, it } from "vitest";
import { readCapped } from "../src/features/videos";

const CAP = 1024;

function streamResponse(chunks: string[], headers: Record<string, string> = {}): Response {
  const enc = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(enc.encode(c));
      controller.close();
    },
  });
  return new Response(body, { headers });
}

describe("readCapped", () => {
  it("returns small bodies intact", async () => {
    const res = streamResponse(['{"videos":', "[]}"]);
    expect(await readCapped(res, CAP)).toBe('{"videos":[]}');
  });

  it("rejects on declared content-length without reading", async () => {
    const res = streamResponse(["x"], { "content-length": String(CAP + 1) });
    expect(await readCapped(res, CAP)).toBeNull();
  });

  it("aborts mid-stream when the body exceeds the cap", async () => {
    const big = "a".repeat(600);
    const res = streamResponse([big, big]); // 1200 bytes > 1024, no content-length
    expect(await readCapped(res, CAP)).toBeNull();
  });

  it("counts bytes, not UTF-16 units", async () => {
    // 400 emoji = 400 chars but 1600 UTF-8 bytes
    const res = streamResponse(["💸".repeat(400)]);
    expect(await readCapped(res, CAP)).toBeNull();
  });

  it("accepts a body exactly at the cap", async () => {
    const exact = "b".repeat(CAP);
    const res = streamResponse([exact]);
    expect(await readCapped(res, CAP)).toBe(exact);
  });
});
