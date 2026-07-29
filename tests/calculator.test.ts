import { describe, expect, it } from "vitest";
import { computeLeaseVsBuy, money, toDollars } from "../src/features/calculator";

describe("toDollars", () => {
  it("passes through sane values", () => {
    expect(toDollars(1199)).toBe(1199);
    expect(toDollars(0)).toBe(0);
    expect(toDollars(54.5)).toBe(54.5);
  });

  it("clamps hostile input", () => {
    expect(toDollars(NaN)).toBe(0);
    expect(toDollars(Infinity)).toBe(0);
    expect(toDollars(-500)).toBe(0);
    expect(toDollars("1e999")).toBe(0); // parses to Infinity
    expect(toDollars("garbage")).toBe(0);
    expect(toDollars(99_999_999_999)).toBe(10_000_000);
  });
});

describe("computeLeaseVsBuy", () => {
  it("matches the default example", () => {
    const r = computeLeaseVsBuy({ price: 1199, monthly: 54, months: 24, resale: 450, upfront: 0 });
    expect(r.leaseTotal).toBe(1296);
    expect(r.buyNet).toBe(749);
    expect(r.verdict).toBe("buy");
    expect(r.diff).toBe(547);
  });

  it("never divides by zero months", () => {
    const r = computeLeaseVsBuy({ price: 1000, monthly: 50, months: 0, resale: 0, upfront: 0 });
    expect(Number.isFinite(r.perMonthLease)).toBe(true);
    expect(Number.isFinite(r.perMonthBuy)).toBe(true);
  });

  it("caps resale at price so ownership never goes negative", () => {
    const r = computeLeaseVsBuy({ price: 500, monthly: 10, months: 12, resale: 99999, upfront: 0 });
    expect(r.buyNet).toBe(0);
  });

  it("calls a wash a wash", () => {
    const r = computeLeaseVsBuy({ price: 1200, monthly: 100, months: 12, resale: 0, upfront: 0 });
    expect(r.verdict).toBe("wash");
  });

  it("recognizes when the plan wins", () => {
    const r = computeLeaseVsBuy({ price: 2000, monthly: 20, months: 12, resale: 0, upfront: 0 });
    expect(r.verdict).toBe("lease");
  });

  it("clamps months into 1..600", () => {
    expect(computeLeaseVsBuy({ price: 0, monthly: 1, months: 9999, resale: 0, upfront: 0 }).leaseTotal).toBe(600);
  });
});

describe("money", () => {
  it("formats whole dollars with separators", () => {
    expect(money(1296)).toBe("$1,296");
    expect(money(0)).toBe("$0");
    expect(money(547.4)).toBe("$547");
  });
});
