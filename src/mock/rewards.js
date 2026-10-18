import { CAPABILITY_STATUS } from "../constants";

/**
 * Mock loyalty dashboard data (PRD 5.11, SCREEN_INVENTORY 57–58). Display
 * only: a static points balance and an append-only-style ledger preview
 * with EARN / REDEEM / REVERSE entries. No earning, redemption, expiry or
 * balance computation happens here — the server owns all of that and the
 * policy questions are blocked on the owner. Expired fixtures are kept in
 * the list on purpose to show how reversals render.
 */
export const LEDGER_TYPES = {
  EARN: "EARN",
  REDEEM: "REDEEM",
  REVERSE: "REVERSE",
};

export const MOCK_REWARDS = {
  luckyone: {
    balance: 1250,
    pending: 120,
    expiringSoon: { points: 200, byDate: "30 Apr" },
    ledger: [
      {
        id: "lz-ledger-1",
        type: LEDGER_TYPES.EARN,
        points: 120,
        title: "Earned at Spice Route Kitchen",
        context: "Order #1042 · 12 Apr",
        status: "PENDING",
      },
      {
        id: "lz-ledger-2",
        type: LEDGER_TYPES.REDEEM,
        points: -500,
        title: "Redeemed at Demo Fashion",
        context: "Coupon · 8 Apr",
        status: "COMPLETED",
      },
      {
        id: "lz-ledger-3",
        type: LEDGER_TYPES.EARN,
        points: 480,
        title: "Earned at Noodle Bar Express",
        context: "Order #0994 · 5 Apr",
        status: "COMPLETED",
      },
      {
        id: "lz-ledger-4",
        type: LEDGER_TYPES.REVERSE,
        points: 300,
        title: "Reversal for cancelled order #0981",
        context: "Order #0981 · 2 Apr",
        status: "COMPLETED",
      },
      {
        id: "lz-ledger-5",
        type: LEDGER_TYPES.EARN,
        points: 350,
        title: "Earned at Burger Boulevard",
        context: "Order #0981 · 1 Apr",
        status: "COMPLETED",
      },
    ],
  },
  harbourwalk: {
    balance: 0,
    pending: 0,
    expiringSoon: null,
    ledger: [],
  },
};

const isCapabilityOn = (capabilityMap, capability) => {
  const status = capabilityMap?.[capability];
  return status === CAPABILITY_STATUS.ENABLED || status === CAPABILITY_STATUS.DEGRADED;
};

/**
 * Resolve the rewards dashboard for a mall. Capability-gated on loyalty:
 * DISABLED returns unavailable so the tab shows a clear disabled state
 * instead of implying a balance exists (PRD 5.11 — server owns the
 * numbers; these are mock preview values only).
 */
export const getRewardsOverview = (mallSlug, capabilityMap) => {
  if (!isCapabilityOn(capabilityMap, "loyalty")) {
    return { available: false, degraded: false, rewards: null };
  }
  const rewards = MOCK_REWARDS[mallSlug] ?? null;
  return {
    available: !!rewards,
    degraded: capabilityMap?.loyalty === CAPABILITY_STATUS.DEGRADED,
    rewards,
  };
};

/** Tone + icon metadata per ledger type for consistent rendering. */
export const LEDGER_META = {
  [LEDGER_TYPES.EARN]: { tone: "success", icon: "add-circle-outline", sign: "+" },
  [LEDGER_TYPES.REDEEM]: { tone: "warning", icon: "pricetag-outline", sign: "" },
  [LEDGER_TYPES.REVERSE]: { tone: "info", icon: "arrow-undo-outline", sign: "" },
};

export default MOCK_REWARDS;
