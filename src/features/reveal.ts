/** Site-wide scroll reveals: elements with [data-reveal] rise in when they
    enter the viewport. Children of [data-reveal-group] stagger. The page is
    fully visible without JS (styles only apply under html.js) and under
    prefers-reduced-motion. */

let observer: IntersectionObserver | null = null;

function reduced(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Show everything immediately: used when reveals can't or shouldn't run, so
    content is never left invisible. */
export function revealAll(root: ParentNode): void {
  root.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("in"));
}

function ensureObserver(): IntersectionObserver | null {
  if (reduced()) return null;
  if (typeof window.IntersectionObserver !== "function") return null;
  observer ??= new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  return observer;
}

/** Reveal elements inside `root` (used after content renders dynamically).
    `stagger` adds a per-item delay; pass 0 for independent, one-at-a-time
    reveals as the visitor scrolls. */
export function registerReveals(root: ParentNode, stagger = 0): void {
  const io = ensureObserver();
  if (!io) {
    revealAll(root); // no observer available: never hide content
    return;
  }
  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
    if (el.classList.contains("in")) return;
    if (stagger) el.style.setProperty("--reveal-delay", `${Math.min(i * stagger, 420)}ms`);
    io.observe(el);
  });
}

export function initReveal(): void {
  if (reduced() || typeof window.IntersectionObserver !== "function") {
    revealAll(document);
    return;
  }

  document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.setAttribute("data-reveal", "");
      (child as HTMLElement).style.setProperty("--reveal-delay", `${Math.min(i * 70, 420)}ms`);
    });
  });

  registerReveals(document);
}
