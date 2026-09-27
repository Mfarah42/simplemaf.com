import { esc } from "../lib/dom";

/** "Am I on or off?" The Cadence engine, reduced to one pure function so the
    card can answer the question before anyone installs the app. */
export interface Rotation {
  on: number;
  off: number;
}

export interface RotationStatus {
  /** on or off today, or "before" when the first hitch has not started */
  state: "on" | "off" | "before";
  /** 1-based day within the current on or off block */
  day: number;
  /** length of the current block */
  length: number;
  /** the next day the answer flips (or the first day on, when "before") */
  next: Date;
  daysUntil: number;
}

const DAY = 86_400_000;

/** Days since epoch, computed in UTC so DST never shifts a hitch by an hour. */
function dayNumber(d: Date): number {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);
}

function fromDayNumber(n: number): Date {
  const u = new Date(n * DAY);
  return new Date(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate());
}

/** "14/14" -> { on: 14, off: 14 }. Anything else is null. */
export function parseRotation(text: string): Rotation | null {
  const m = /^\s*(\d{1,3})\s*\/\s*(\d{1,3})\s*$/.exec(text);
  if (!m) return null;
  const on = Number(m[1]);
  const off = Number(m[2]);
  if (on < 1 || off < 1) return null;
  return { on, off };
}

/** "2026-09-27" -> local Date at midnight, or null. */
export function parseDate(text: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function rotationStatus(r: Rotation, firstDayOn: Date, today: Date): RotationStatus {
  const start = dayNumber(firstDayOn);
  const now = dayNumber(today);
  const cycle = r.on + r.off;
  if (now < start) {
    return { state: "before", day: 0, length: r.on, next: fromDayNumber(start), daysUntil: start - now };
  }
  const elapsed = now - start;
  const pos = elapsed % cycle;
  const cycleStart = now - pos;
  if (pos < r.on) {
    const next = cycleStart + r.on;
    return { state: "on", day: pos + 1, length: r.on, next: fromDayNumber(next), daysUntil: next - now };
  }
  const next = cycleStart + cycle;
  return { state: "off", day: pos - r.on + 1, length: r.off, next: fromDayNumber(next), daysUntil: next - now };
}

const fmt = (d: Date): string => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
const inDays = (n: number): string => (n === 1 ? "tomorrow" : `in ${n} days`);

/** The sentence under the controls. Plain text in, HTML out (escaped). */
export function describe(s: RotationStatus): string {
  if (s.state === "before") {
    return `First hitch starts <b>${esc(fmt(s.next))}</b>, ${esc(inDays(s.daysUntil))}.`;
  }
  const word = s.state === "on" ? "On" : "Off";
  const flip = s.state === "on" ? "Next day off" : "Back on";
  return (
    `<b class="serif cad-${s.state}">${word}</b> · day ${s.day} of ${s.length}` +
    ` · ${flip} <b>${esc(fmt(s.next))}</b>, ${esc(inDays(s.daysUntil))}.`
  );
}

function isoToday(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function initCadence(): void {
  document.querySelectorAll<HTMLFormElement>("form[data-cadence]").forEach((form) => {
    const rotation = form.querySelector<HTMLSelectElement>("select[name=rotation]");
    const start = form.querySelector<HTMLInputElement>("input[name=start]");
    const answer = form.querySelector<HTMLElement>(".cad-answer");
    if (!rotation || !start || !answer) return;
    if (!start.value) start.value = isoToday();

    const render = (): void => {
      const r = parseRotation(rotation.value);
      const d = parseDate(start.value);
      answer.innerHTML = r && d ? describe(rotationStatus(r, d, new Date())) : "Pick a first day on.";
    };
    rotation.addEventListener("change", render);
    start.addEventListener("change", render);
    start.addEventListener("input", render);
    form.addEventListener("submit", (e) => e.preventDefault());
    render();
  });
}
