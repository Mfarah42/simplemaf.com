import { byId } from "../lib/dom";

export interface LeaseInputs {
  price: number;
  monthly: number;
  months: number;
  resale: number;
  upfront: number;
}

export interface LeaseResult {
  leaseTotal: number;
  buyNet: number;
  perMonthLease: number;
  perMonthBuy: number;
  verdict: "wash" | "buy" | "lease";
  diff: number;
  diffPerMonth: number;
}

/** Clamp hostile input (NaN, negatives, 1e999) into a sane dollar figure. */
export function toDollars(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, 10_000_000);
}

export function computeLeaseVsBuy(raw: Partial<LeaseInputs>): LeaseResult {
  const price = toDollars(raw.price);
  const monthly = toDollars(raw.monthly);
  const upfront = toDollars(raw.upfront);
  const resale = toDollars(raw.resale);
  const months = Math.max(1, Math.min(600, Math.round(toDollars(raw.months)) || 1));

  const leaseTotal = monthly * months + upfront;
  const buyNet = price - Math.min(resale, price);
  const diff = Math.abs(leaseTotal - buyNet);

  return {
    leaseTotal,
    buyNet,
    perMonthLease: leaseTotal / months,
    perMonthBuy: buyNet / months,
    verdict: diff < 1 ? "wash" : buyNet < leaseTotal ? "buy" : "lease",
    diff,
    diffPerMonth: diff / months,
  };
}

export const money = (n: number): string => "$" + Math.round(n).toLocaleString("en-US");

export function initCalculator(): void {
  const ids = ["cPrice", "cMonthly", "cMonths", "cResale", "cUpfront"] as const;
  const input = (id: string) => byId<HTMLInputElement>(id);
  const oLease = byId("oLease");
  const oBuy = byId("oBuy");
  const oPer = byId("oPer");
  const oVerdict = byId("oVerdict");

  function run(): void {
    const months = input("cMonths").value;
    const r = computeLeaseVsBuy({
      price: parseFloat(input("cPrice").value),
      monthly: parseFloat(input("cMonthly").value),
      months: parseFloat(months),
      resale: parseFloat(input("cResale").value),
      upfront: parseFloat(input("cUpfront").value),
    });
    const m = Math.max(1, Math.min(600, Math.round(parseFloat(months)) || 1));

    oLease.textContent = money(r.leaseTotal);
    oBuy.textContent = money(r.buyNet);
    oPer.textContent = `${money(r.perMonthLease)} vs ${money(r.perMonthBuy)}`;

    if (r.verdict === "wash") {
      oVerdict.innerHTML = `Over ${m} months it's <b>a wash</b>, within a dollar either way. Pick on flexibility, not price.`;
    } else if (r.verdict === "buy") {
      oVerdict.innerHTML = `Over ${m} months, <b>buying costs ${money(r.diff)} less</b>, about ${money(r.diffPerMonth)} a month. And you still own the thing.`;
    } else {
      oVerdict.innerHTML = `Over ${m} months, <b>the plan costs ${money(r.diff)} less</b>, about ${money(r.diffPerMonth)} a month. Double-check that resale figure before you trust it.`;
    }
  }

  for (const id of ids) {
    input(id).addEventListener("input", run);
    input(id).addEventListener("change", run);
  }
  run();
}
