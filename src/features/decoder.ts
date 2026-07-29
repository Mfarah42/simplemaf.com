import { TERMS } from "../config";
import { byId, esc } from "../lib/dom";

export function matchesQuery(haystack: string, query: string): boolean {
  return !query || haystack.includes(query.toLowerCase());
}

export function initDecoder(): void {
  const grid = byId("decoderTerms");
  const filterBox = byId("decoderFilters");
  const search = byId<HTMLInputElement>("decoderSearch");
  const empty = byId("decoderEmpty");
  const cats = ["All", ...new Set(TERMS.map((t) => t.cat))];
  let activeCat = "All";

  filterBox.innerHTML = cats
    .map(
      (c) =>
        `<button class="filter" type="button" data-cat="${esc(c)}" aria-pressed="${c === "All"}">${esc(c)}</button>`,
    )
    .join("");

  grid.innerHTML = TERMS.map(
    (t, i) => `
    <div class="term" data-cat="${esc(t.cat)}">
      <button type="button" aria-expanded="false" aria-controls="tb-${i}">
        <span><span class="t-cat">${esc(t.cat)}</span><span class="t-name">${esc(t.term)}</span></span>
        <span class="t-plus" aria-hidden="true">+</span>
      </button>
      <div class="t-body" id="tb-${i}">
        <p class="t-short">${esc(t.short)}</p>
        <p class="t-why"><b>Why you care.</b> ${esc(t.why)}</p>
      </div>
    </div>`,
  ).join("");

  // haystacks kept off the DOM so quotes in copy can never break an attribute
  const haystacks = TERMS.map((t) =>
    `${t.term} ${t.cat} ${t.short} ${t.why}`.toLowerCase(),
  );

  grid.querySelectorAll<HTMLButtonElement>(".term > button").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      const open = grid.children[i]?.classList.toggle("open") ?? false;
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  function apply(): void {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    Array.from(grid.children).forEach((el, i) => {
      const show =
        (activeCat === "All" || (el as HTMLElement).dataset["cat"] === activeCat) &&
        matchesQuery(haystacks[i] ?? "", q);
      (el as HTMLElement).style.display = show ? "" : "none";
      if (show) shown++;
    });
    empty.classList.toggle("show", shown === 0);
  }

  filterBox.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>(".filter");
    if (!b) return;
    activeCat = b.dataset["cat"] ?? "All";
    filterBox
      .querySelectorAll(".filter")
      .forEach((f) => f.setAttribute("aria-pressed", String(f === b)));
    apply();
  });
  search.addEventListener("input", apply);
}
