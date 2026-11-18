/* eslint-env jest */
import { CAPABILITY_STATUS } from "../../constants";
import { ORDER_STATE_META, formatOrderDateTime, getOrderById, getOrderList } from "../orders";

const on = (overrides = {}) => ({
  online_ordering: CAPABILITY_STATUS.ENABLED,
  ...overrides,
});

const ids = (list) => list.map((order) => order.id);

describe("getOrderList", () => {
  it("returns the mall's orders when online_ordering is ENABLED", () => {
    const result = getOrderList("luckyone", on());
    expect(result.status).toBe(true);
    expect(ids(result.data)).toEqual([
      "mm-order-1042",
      "mm-order-1038",
      "mm-order-1031",
      "mm-order-1029",
    ]);
  });

  it("still lists when online_ordering is DEGRADED", () => {
    const result = getOrderList("luckyone", on({ online_ordering: CAPABILITY_STATUS.DEGRADED }));
    expect(result.status).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
  });

  it("fails when online_ordering is DISABLED", () => {
    const result = getOrderList("luckyone", on({ online_ordering: CAPABILITY_STATUS.DISABLED }));
    expect(result.status).toBe(false);
    expect(result.data).toEqual([]);
    expect(getOrderList("luckyone", {}).status).toBe(false);
    expect(getOrderList("luckyone", undefined).status).toBe(false);
  });

  it("returns an empty ok list for a mall with no mock orders", () => {
    const result = getOrderList("harbourwalk", on());
    expect(result.status).toBe(true);
    expect(result.data).toEqual([]);
  });
});

describe("getOrderById", () => {
  it("derives currentState from the last history entry", () => {
    const result = getOrderById("luckyone", on(), "mm-order-1042");
    expect(result.status).toBe(true);
    expect(result.data.currentState).toBe("PREPARING");
    expect(result.data.currentMeta.label).toBe("Preparing");
  });

  it("hints the next state for an in-progress order", () => {
    const result = getOrderById("luckyone", on(), "mm-order-1042");
    expect(result.data.nextState).toBe("READY_FOR_PICKUP");
    expect(result.data.nextMeta.label).toBe("Ready for pickup");
  });

  it("returns no next state for terminal orders", () => {
    const completed = getOrderById("luckyone", on(), "mm-order-1038");
    expect(completed.data.currentState).toBe("COMPLETED");
    expect(completed.data.nextState).toBeNull();
    expect(completed.data.nextMeta).toBeNull();

    const cancelled = getOrderById("luckyone", on(), "mm-order-1031");
    expect(cancelled.data.currentState).toBe("CANCELLED");
    expect(cancelled.data.nextState).toBeNull();

    const failed = getOrderById("luckyone", on(), "mm-order-1029");
    expect(failed.data.currentState).toBe("PAYMENT_FAILED");
    expect(failed.data.nextState).toBeNull();
  });

  it("formats totals and per-line prices", () => {
    const result = getOrderById("luckyone", on(), "mm-order-1042");
    expect(result.data.totalLabel).toBe("PKR 2,650");
    expect(result.data.itemLines[0].lineLabel).toBe("PKR 2,300");
    expect(result.data.itemLines[1].lineLabel).toBe("PKR 350");
  });

  it("fails for an unknown order id", () => {
    const result = getOrderById("luckyone", on(), "nope");
    expect(result.status).toBe(false);
    expect(result.data).toBeNull();
  });

  it("fails when online_ordering is DISABLED", () => {
    const result = getOrderById(
      "luckyone",
      on({ online_ordering: CAPABILITY_STATUS.DISABLED }),
      "mm-order-1042",
    );
    expect(result.status).toBe(false);
    expect(result.data).toBeNull();
  });
});

describe("ORDER_STATE_META", () => {
  it("labels every PRD 5.10 state with a tone and group", () => {
    const states = [
      "PENDING_PAYMENT",
      "PAID",
      "AWAITING_MERCHANT",
      "ACCEPTED",
      "PREPARING",
      "READY_FOR_PICKUP",
      "COMPLETED",
      "CANCELLATION_REQUESTED",
      "CANCELLED",
      "REFUNDED",
      "PAYMENT_FAILED",
    ];
    for (const state of states) {
      expect(ORDER_STATE_META[state]).toMatchObject({
        label: expect.any(String),
        tone: expect.any(String),
        group: expect.any(String),
        description: expect.any(String),
      });
    }
  });

  it("groups pending vs confirmed states distinctly", () => {
    expect(ORDER_STATE_META.PENDING_PAYMENT.group).toBe("pending");
    expect(ORDER_STATE_META.PAID.group).toBe("confirmed");
    expect(ORDER_STATE_META.PREPARING.group).toBe("confirmed");
    expect(ORDER_STATE_META.CANCELLED.group).toBe("cancelled");
    expect(ORDER_STATE_META.PAYMENT_FAILED.group).toBe("failed");
  });
});

describe("formatOrderDateTime", () => {
  it("formats a valid ISO timestamp", () => {
    expect(formatOrderDateTime("2026-10-12T19:24:00+05:00")).toMatch(
      /^\d{1,2} \w{3} \d{4}, \d{2}:\d{2}$/,
    );
  });

  it("returns null for an unparseable value", () => {
    expect(formatOrderDateTime("not-a-date")).toBeNull();
    expect(formatOrderDateTime(undefined)).toBeNull();
  });
});
