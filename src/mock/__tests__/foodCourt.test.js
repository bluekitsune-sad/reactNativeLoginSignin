/* eslint-env jest */
import { CAPABILITY_STATUS } from "../../constants";
import { getFoodCourtOverview, getZoneStatus } from "../foodCourt";

const on = (overrides = {}) => ({
  food_court: CAPABILITY_STATUS.ENABLED,
  seat_sessions: CAPABILITY_STATUS.ENABLED,
  ...overrides,
});

describe("getFoodCourtOverview", () => {
  it("resolves the venue when food_court is ENABLED", () => {
    const overview = getFoodCourtOverview("luckyone", on());
    expect(overview.available).toBe(true);
    expect(overview.degraded).toBe(false);
    expect(overview.seatSessionsOn).toBe(true);
    expect(overview.venue.name).toBe("Central Food Court");
    expect(overview.venue.zones.length).toBeGreaterThan(0);
  });

  it("flags DEGRADED food_court as limited", () => {
    const overview = getFoodCourtOverview(
      "luckyone",
      on({ food_court: CAPABILITY_STATUS.DEGRADED }),
    );
    expect(overview.available).toBe(true);
    expect(overview.degraded).toBe(true);
  });

  it("hides the venue entirely when food_court is DISABLED", () => {
    const overview = getFoodCourtOverview(
      "luckyone",
      on({ food_court: CAPABILITY_STATUS.DISABLED }),
    );
    expect(overview).toEqual({
      available: false,
      degraded: false,
      seatSessionsOn: false,
      venue: null,
    });
  });

  it("reports seat_sessions separately so scan-to-sit gating is truthful", () => {
    const overview = getFoodCourtOverview(
      "luckyone",
      on({ seat_sessions: CAPABILITY_STATUS.DISABLED }),
    );
    expect(overview.available).toBe(true);
    expect(overview.seatSessionsOn).toBe(false);
  });

  it("resolves unavailable for a mall with no mock venue", () => {
    const overview = getFoodCourtOverview("harbourwalk", on());
    expect(overview.available).toBe(false);
    expect(overview.venue).toBeNull();
    expect(overview.seatSessionsOn).toBe(true);
  });
});

describe("getZoneStatus", () => {
  it("marks a zone with no seat count as Unknown", () => {
    expect(getZoneStatus({ seatsTotal: 0, seatsAvailable: 0 })).toEqual({
      label: "Unknown",
      tone: "muted",
    });
  });

  it("marks a zone with zero seats available as Full", () => {
    expect(getZoneStatus({ seatsTotal: 32, seatsAvailable: 0 })).toEqual({
      label: "Full",
      tone: "muted",
    });
  });

  it("marks Busy at or below 20% availability", () => {
    expect(getZoneStatus({ seatsTotal: 64, seatsAvailable: 6 })).toEqual({
      label: "Busy",
      tone: "warning",
    });
    expect(getZoneStatus({ seatsTotal: 10, seatsAvailable: 2 })).toEqual({
      label: "Busy",
      tone: "warning",
    });
  });

  it("marks Open above 20% availability", () => {
    expect(getZoneStatus({ seatsTotal: 48, seatsAvailable: 14 })).toEqual({
      label: "Open",
      tone: "success",
    });
    expect(getZoneStatus({ seatsTotal: 10, seatsAvailable: 3 })).toEqual({
      label: "Open",
      tone: "success",
    });
  });
});
