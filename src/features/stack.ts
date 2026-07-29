import { STACK } from "../config";
import { byId, esc } from "../lib/dom";

export function initStack(): void {
  byId("stackGrid").innerHTML = STACK.map(
    (g) => `
    <div class="stack-col">
      <h3>${esc(g.group)}</h3>
      <ul>${g.items
        .map((i) => `<li><b>${esc(i.name)}</b><span>${esc(i.note)}</span></li>`)
        .join("")}</ul>
    </div>`,
  ).join("");
}
