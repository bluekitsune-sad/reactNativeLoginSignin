/**
 * MallMate capability registry values — PRD.md section 5.3.
 *
 * Each mall has a configurable capability map. The mobile UI shows a feature
 * only when its capability is ENABLED (degraded features stay visible with a
 * clear status; disabled features are hidden). Backend APIs enforce
 * capability state independently of the UI.
 */
export const CAPABILITY_STATUS = {
  ENABLED: "ENABLED",
  DEGRADED: "DEGRADED",
  DISABLED: "DISABLED",
};

export const CAPABILITIES = {
  FOOD_COURT: "food_court",
  RESTAURANT_DISCOVERY: "restaurant_discovery",
  RETAIL_DISCOVERY: "retail_discovery",
  ONLINE_ORDERING: "online_ordering",
  ONLINE_PAYMENT: "online_payment",
  LOYALTY: "loyalty",
  INDOOR_NAVIGATION: "indoor_navigation",
  LIVE_PARKING: "live_parking",
  EVENTS: "events",
  SEAT_SESSIONS: "seat_sessions",
  RESERVATIONS: "reservations",
  DIGITAL_COUPONS: "digital_coupons",
};

export default { CAPABILITY_STATUS, CAPABILITIES };
