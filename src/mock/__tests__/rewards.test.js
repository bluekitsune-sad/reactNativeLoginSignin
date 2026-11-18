/* eslint-env jest */
import { CAPABILITY_STATUS } from "../../constants";
import { LEDGER_META, getRewardsOverview } from "../rewards";

const on = (overrides = {}) => ({
  loyalty: CAPABILITY_STATUS.ENABLED,
  ...overrides,
});

describe("getRewardsOverview", () => {
  it("returns the dashboard when loyalty is ENABLED", () => {
    const overview = getRewardsOverview("luckyone", on());
    expect(overview.available).toBe(true);
    expect(overview.degraded).toBe(false);
    expect(overview.rewards.balance).toBe(1250);
    expect(overview.rewards.pending).toBe(120);
    expect(overview.rewards.ledger.length).toBeGreaterThan(0);
  });

  it("flags DEGRADED loyalty as limited", () => {
    const overview = getRewardsOverview("luckyone", on({ loyalty: CAPABILITY_STATUS.DEGRADED }));
    expect(overview.available).toBe(true);
    expect(overview.degraded).toBe(true);
  });

  it("returns unavailable when loyalty is DISABLED", () => {
    expect(getRewardsOverview("luckyone", on({ loyalty: CAPABILITY_STATUS.DISABLED }))).toEqual({
      available: false,
      degraded: false,
      rewards: null,
    });
    expect(getRewardsOverview("luckyone", {})).toEqual({
      available: false,
      degraded: false,
      rewards: null,
    });
    expect(getRewardsOverview("luckyone", undefined)).toEqual({
      available: false,
      degraded: false,
      rewards: null,
    });
  });

  it("resolves a mall with an empty ledger", () => {
    const overview = getRewardsOverview("harbourwalk", on());
    expect(overview.available).toBe(true);
    expect(overview.rewards.balance).toBe(0);
    expect(overview.rewards.ledger).toEqual([]);
    expect(overview.rewards.expiringSoon).toBeNull();
  });

  it("returns unavailable for an unknown mall even when capable", () => {
    expect(getRewardsOverview("nowhere", on())).toEqual({
      available: false,
      degraded: false,
      rewards: null,
    });
  });
});

describe("LEDGER_META", () => {
  it("covers all three ledger types with tone, icon and sign", () => {
    expect(LEDGER_META.EARN).toMatchObject({ tone: "success", sign: "+" });
    expect(LEDGER_META.REDEEM).toMatchObject({ tone: "warning", sign: "" });
    expect(LEDGER_META.REVERSE).toMatchObject({ tone: "info", sign: "" });
    for (const meta of Object.values(LEDGER_META)) {
      expect(meta.icon).toEqual(expect.any(String));
    }
  });
});
