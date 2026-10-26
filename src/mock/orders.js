import { CAPABILITY_STATUS } from "../constants";
import { formatPrice } from "./menus";

/**
 * Mock order history + per-order status timelines (SCREEN_INVENTORY 40–41;
 * PRD 5.10). Display only — no checkout, no payments, no state machine
 * transitions (ordering scope is blocked). States use the PRD 5.10 names.
 * Capability-gated on online_ordering.
 */

export const ORDER_STATES = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PAID: "PAID",
  AWAITING_MERCHANT: "AWAITING_MERCHANT",
  ACCEPTED: "ACCEPTED",
  PREPARING: "PREPARING",
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  COMPLETED: "COMPLETED",
  CANCELLATION_REQUESTED: "CANCELLATION_REQUESTED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
};

/** Display metadata per state: chip label, tone, and grouping. */
export const ORDER_STATE_META = {
  [ORDER_STATES.PENDING_PAYMENT]: {
    label: "Awaiting payment",
    tone: "warning",
    group: "pending",
    description: "Payment hasn't been confirmed yet.",
  },
  [ORDER_STATES.PAID]: {
    label: "Paid",
    tone: "info",
    group: "confirmed",
    description: "Payment received. Waiting for the merchant.",
  },
  [ORDER_STATES.AWAITING_MERCHANT]: {
    label: "Sent to merchant",
    tone: "info",
    group: "confirmed",
    description: "The merchant has been notified of your order.",
  },
  [ORDER_STATES.ACCEPTED]: {
    label: "Accepted",
    tone: "info",
    group: "confirmed",
    description: "The merchant accepted your order.",
  },
  [ORDER_STATES.PREPARING]: {
    label: "Preparing",
    tone: "info",
    group: "confirmed",
    description: "Your order is being prepared.",
  },
  [ORDER_STATES.READY_FOR_PICKUP]: {
    label: "Ready for pickup",
    tone: "success",
    group: "confirmed",
    description: "Collect your order from the merchant counter.",
  },
  [ORDER_STATES.COMPLETED]: {
    label: "Completed",
    tone: "success",
    group: "confirmed",
    description: "This order was completed.",
  },
  [ORDER_STATES.CANCELLATION_REQUESTED]: {
    label: "Cancellation requested",
    tone: "warning",
    group: "pending",
    description: "Waiting for the merchant to confirm the cancellation.",
  },
  [ORDER_STATES.CANCELLED]: {
    label: "Cancelled",
    tone: "muted",
    group: "cancelled",
    description: "This order was cancelled.",
  },
  [ORDER_STATES.REFUNDED]: {
    label: "Refunded",
    tone: "muted",
    group: "cancelled",
    description: "This order was refunded.",
  },
  [ORDER_STATES.PAYMENT_FAILED]: {
    label: "Payment failed",
    tone: "error",
    group: "failed",
    description: "Payment couldn't be completed for this order.",
  },
};

/** Expected next state for still-active orders (display hint only). */
const NEXT_STATE_HINT = {
  [ORDER_STATES.PAID]: ORDER_STATES.AWAITING_MERCHANT,
  [ORDER_STATES.AWAITING_MERCHANT]: ORDER_STATES.ACCEPTED,
  [ORDER_STATES.ACCEPTED]: ORDER_STATES.PREPARING,
  [ORDER_STATES.PREPARING]: ORDER_STATES.READY_FOR_PICKUP,
  [ORDER_STATES.READY_FOR_PICKUP]: ORDER_STATES.COMPLETED,
  [ORDER_STATES.CANCELLATION_REQUESTED]: ORDER_STATES.CANCELLED,
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const formatOrderDateTime = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const day = `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}, ${hours}:${minutes}`;
};

/**
 * Mock orders per mall. Each order: id/code, merchant, placedAt ISO,
 * fulfilment, line items, total, and a history of {state, at} entries —
 * the last entry is the current state.
 */
export const MOCK_ORDERS = {
  luckyone: [
    {
      id: "mm-order-1042",
      code: "MM-1042",
      merchantId: "lucky-m-1",
      merchantName: "Spice Route Kitchen",
      fulfilment: "Dine-in",
      placedAt: "2026-10-12T19:24:00+05:00",
      items: [
        { name: "Chicken tikka platter", qty: 2, price: 1150 },
        { name: "Mint margarita", qty: 1, price: 350 },
      ],
      total: 2650,
      history: [
        { state: ORDER_STATES.PAID, at: "2026-10-12T19:24:00+05:00" },
        { state: ORDER_STATES.AWAITING_MERCHANT, at: "2026-10-12T19:24:20+05:00" },
        { state: ORDER_STATES.ACCEPTED, at: "2026-10-12T19:26:00+05:00" },
        { state: ORDER_STATES.PREPARING, at: "2026-10-12T19:28:00+05:00" },
      ],
    },
    {
      id: "mm-order-1038",
      code: "MM-1038",
      merchantId: "lucky-m-8",
      merchantName: "Sweet Tooth Desserts",
      fulfilment: "Pickup",
      placedAt: "2026-10-10T13:05:00+05:00",
      items: [
        { name: "Chocolate fudge slice", qty: 1, price: 620 },
        { name: "Cappuccino", qty: 1, price: 380 },
      ],
      total: 1000,
      history: [
        { state: ORDER_STATES.PAID, at: "2026-10-10T13:05:00+05:00" },
        { state: ORDER_STATES.AWAITING_MERCHANT, at: "2026-10-10T13:05:15+05:00" },
        { state: ORDER_STATES.ACCEPTED, at: "2026-10-10T13:07:00+05:00" },
        { state: ORDER_STATES.PREPARING, at: "2026-10-10T13:09:00+05:00" },
        { state: ORDER_STATES.READY_FOR_PICKUP, at: "2026-10-10T13:22:00+05:00" },
        { state: ORDER_STATES.COMPLETED, at: "2026-10-10T13:31:00+05:00" },
      ],
    },
    {
      id: "mm-order-1031",
      code: "MM-1031",
      merchantId: "lucky-m-2",
      merchantName: "Noodle Bar Express",
      fulfilment: "Pickup",
      placedAt: "2026-10-04T20:40:00+05:00",
      items: [{ name: "Chicken chow mein", qty: 1, price: 780 }],
      total: 780,
      history: [
        { state: ORDER_STATES.PAID, at: "2026-10-04T20:40:00+05:00" },
        { state: ORDER_STATES.AWAITING_MERCHANT, at: "2026-10-04T20:40:18+05:00" },
        { state: ORDER_STATES.CANCELLATION_REQUESTED, at: "2026-10-04T20:44:00+05:00" },
        { state: ORDER_STATES.CANCELLED, at: "2026-10-04T20:51:00+05:00" },
      ],
    },
    {
      id: "mm-order-1029",
      code: "MM-1029",
      merchantId: "lucky-m-7",
      merchantName: "Burger Boulevard",
      fulfilment: "Pickup",
      placedAt: "2026-09-28T18:12:00+05:00",
      items: [
        { name: "Classic burger", qty: 2, price: 890 },
        { name: "Loaded fries", qty: 1, price: 420 },
      ],
      total: 2200,
      history: [
        { state: ORDER_STATES.PENDING_PAYMENT, at: "2026-09-28T18:12:00+05:00" },
        { state: ORDER_STATES.PAYMENT_FAILED, at: "2026-09-28T18:13:00+05:00" },
      ],
    },
  ],
  harbourwalk: [],
};

const isCapabilityOn = (capabilityMap, capability) => {
  const status = capabilityMap?.[capability];
  return status === CAPABILITY_STATUS.ENABLED || status === CAPABILITY_STATUS.DEGRADED;
};

/** Resolve the mock order list for a mall (SCREEN_INVENTORY 41). */
export const getOrderList = (mallSlug, capabilityMap) => {
  if (!isCapabilityOn(capabilityMap, "online_ordering")) {
    return {
      status: false,
      message: "Order history isn't available for this mall yet.",
      data: [],
    };
  }
  const orders = MOCK_ORDERS[mallSlug] ?? [];
  return { status: true, message: "ok", data: orders };
};

/** Resolve one mock order with its display-ready timeline (40). */
export const getOrderById = (mallSlug, capabilityMap, orderId) => {
  if (!isCapabilityOn(capabilityMap, "online_ordering")) {
    return {
      status: false,
      message: "Order history isn't available for this mall yet.",
      data: null,
    };
  }
  const order = (MOCK_ORDERS[mallSlug] ?? []).find((item) => item.id === orderId) || null;
  if (!order) {
    return { status: false, message: "We couldn't find that order.", data: null };
  }
  const current = order.history[order.history.length - 1];
  const next = NEXT_STATE_HINT[current.state] || null;
  return {
    status: true,
    message: "ok",
    data: {
      ...order,
      currentState: current.state,
      currentMeta: ORDER_STATE_META[current.state],
      nextState: next,
      nextMeta: next ? ORDER_STATE_META[next] : null,
      totalLabel: formatPrice(order.total),
      itemLines: order.items.map((item) => ({
        ...item,
        lineLabel: formatPrice(item.price * item.qty),
      })),
    },
  };
};

export default MOCK_ORDERS;
