import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** Minimal IntersectionObserver stand-in so reveal logic is testable. */
class FakeIO {
  static instances: FakeIO[] = [];
  observed: Element[] = [];
  unobserved: Element[] = [];
  constructor(private cb: IntersectionObserverCallback) {
    FakeIO.instances.push(this);
  }
  observe(el: Element): void {
    this.observed.push(el);
  }
  unobserve(el: Element): void {
    this.unobserved.push(el);
  }
  disconnect(): void {}
  /** Fire the callback for the given elements as if they scrolled into view. */
  enter(els: Element[]): void {
    this.cb(
      els.map((target) => ({ target, isIntersecting: true }) as IntersectionObserverEntry),
      this as unknown as IntersectionObserver,
    );
  }
}

async function loadReveal(matchesReduced = false) {
  vi.stubGlobal("matchMedia", () => ({ matches: matchesReduced }) as MediaQueryList);
  vi.resetModules();
  return import("../src/features/reveal");
}

beforeEach(() => {
  FakeIO.instances = [];
  document.body.innerHTML = "";
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("registerReveals", () => {
  it("observes each target and marks it in on intersection", async () => {
    vi.stubGlobal("IntersectionObserver", FakeIO);
    const { registerReveals } = await loadReveal();
    document.body.innerHTML = `<div id="l"><p data-reveal>a</p><p data-reveal>b</p></div>`;
    const list = document.getElementById("l")!;

    registerReveals(list);
    const io = FakeIO.instances[0]!;
    expect(io.observed).toHaveLength(2);

    const [a, b] = Array.from(list.children);
    io.enter([a!]);
    expect(a!.classList.contains("in")).toBe(true);
    expect(b!.classList.contains("in")).toBe(false); // still waiting: progressive
    expect(io.unobserved).toContain(a); // fires once, never re-hides

    io.enter([b!]);
    expect(b!.classList.contains("in")).toBe(true);
  });

  it("applies a stagger delay only when asked", async () => {
    vi.stubGlobal("IntersectionObserver", FakeIO);
    const { registerReveals } = await loadReveal();
    document.body.innerHTML = `<div id="l"><p data-reveal></p><p data-reveal></p></div>`;
    const list = document.getElementById("l")!;

    registerReveals(list); // default: no stagger, rows reveal independently
    expect((list.children[1] as HTMLElement).style.getPropertyValue("--reveal-delay")).toBe("");

    document.body.innerHTML = `<div id="m"><p data-reveal></p><p data-reveal></p></div>`;
    const m = document.getElementById("m")!;
    registerReveals(m, 70);
    expect((m.children[1] as HTMLElement).style.getPropertyValue("--reveal-delay")).toBe("70ms");
  });

  it("shows content immediately when IntersectionObserver is missing", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { registerReveals } = await loadReveal();
    document.body.innerHTML = `<div id="l"><p data-reveal>a</p></div>`;
    const list = document.getElementById("l")!;
    registerReveals(list);
    expect(list.querySelector("p")!.classList.contains("in")).toBe(true);
  });

  it("shows content immediately under reduced motion", async () => {
    vi.stubGlobal("IntersectionObserver", FakeIO);
    const { initReveal } = await loadReveal(true);
    document.body.innerHTML = `<p data-reveal>a</p>`;
    initReveal();
    expect(document.querySelector("p")!.classList.contains("in")).toBe(true);
    expect(FakeIO.instances).toHaveLength(0);
  });
});

describe("initReveal groups", () => {
  it("stamps staggered delays on group children", async () => {
    vi.stubGlobal("IntersectionObserver", FakeIO);
    const { initReveal } = await loadReveal();
    document.body.innerHTML = `<div data-reveal-group><i></i><i></i><i></i></div>`;
    initReveal();
    const kids = Array.from(document.querySelectorAll("i")) as HTMLElement[];
    expect(kids.every((k) => k.hasAttribute("data-reveal"))).toBe(true);
    expect(kids[0]!.style.getPropertyValue("--reveal-delay")).toBe("0ms");
    expect(kids[2]!.style.getPropertyValue("--reveal-delay")).toBe("140ms");
  });
});
