import { STACK } from "../config";
import { byId, esc } from "../lib/dom";

export function initStack(): void {
  byId("stackGrid").innerHTML = STACK.map(
    (g) => `
    <div class="gear">
      <span class="g-emoji" aria-hidden="true">${esc(g.emoji)}</span>
      <div class="g-body"><b>${esc(g.name)}</b><span>${esc(g.note)}</span></div>
    </div>`,
  ).join("");
}
