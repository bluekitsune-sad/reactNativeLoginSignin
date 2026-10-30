import { CAPABILITY_STATUS } from "../constants";

/**
 * Mock food-court overview data (SCREEN_INVENTORY 28, PRD 5.9 seating
 * preview). Zones carry static seat counts for presentation only — no live
 * seat state, no session logic (those are blocked on open decisions #9/#10).
 */
const FOOD_COURTS = {
  luckyone: {
    name: "Central Food Court",
    floor: "Level 2 · Atrium wing",
    hours: "10:00–23:00 daily",
    zones: [
      {
        id: "lz-zone-window",
        name: "Window seating",
        description: "Along the glass facade, natural light.",
        seatsTotal: 48,
        seatsAvailable: 14,
        accessible: true,
      },
      {
        id: "lz-zone-atrium",
        name: "Atrium ring",
        description: "Around the central atrium, overlooking Level 1.",
        seatsTotal: 64,
        seatsAvailable: 6,
        accessible: true,
      },
      {
        id: "lz-zone-quiet",
        name: "Quiet corner",
        description: "Away from the counters, better for groups.",
        seatsTotal: 32,
        seatsAvailable: 0,
        accessible: false,
      },
      {
        id: "lz-zone-family",
        name: "Family tables",
        description: "Large shared tables with stroller space.",
        seatsTotal: 40,
        seatsAvailable: 22,
        accessible: true,
      },
    ],
  },
};

const isCapabilityOn = (capabilityMap, capability) => {
  const status = capabilityMap?.[capability];
  return status === CAPABILITY_STATUS.ENABLED || status === CAPABILITY_STATUS.DEGRADED;
};

/**
 * Resolve the food-court overview for a mall. Capability-gated: DISABLED
 * food_court hides the venue entirely; DEGRADED is surfaced as "Limited".
 * The scan-to-sit entry point additionally reflects the seat_sessions
 * capability so the UI never implies sessions work where they don't.
 */
export const getFoodCourtOverview = (mallSlug, capabilityMap) => {
  const foodCourtOn = isCapabilityOn(capabilityMap, "food_court");
  const seatSessionsOn = isCapabilityOn(capabilityMap, "seat_sessions");
  if (!foodCourtOn) {
    return {
      available: false,
      degraded: false,
      seatSessionsOn: false,
      venue: null,
    };
  }
  const venue = FOOD_COURTS[mallSlug] ?? null;
  return {
    available: !!venue,
    degraded: capabilityMap?.food_court === CAPABILITY_STATUS.DEGRADED,
    seatSessionsOn,
    venue,
  };
};

/** Mock busy-level for a zone derived from its static counts. */
export const getZoneStatus = (zone) => {
  if (!zone.seatsTotal) {
    return { label: "Unknown", tone: "muted" };
  }
  if (zone.seatsAvailable <= 0) {
    return { label: "Full", tone: "muted" };
  }
  if (zone.seatsAvailable / zone.seatsTotal <= 0.2) {
    return { label: "Busy", tone: "warning" };
  }
  return { label: "Open", tone: "success" };
};

export default FOOD_COURTS;
