/** Site-wide scroll reveals: elements with [data-reveal] rise in when they
    enter the viewport. Children of [data-reveal-group] stagger. The page is
    fully visible without JS (styles only apply under html.js) and under
    prefers-reduced-motion. */
export function initReveal(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.setAttribute("data-reveal", "");
      (child as HTMLElement).style.setProperty("--reveal-delay", `${Math.min(i * 70, 420)}ms`);
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
}
