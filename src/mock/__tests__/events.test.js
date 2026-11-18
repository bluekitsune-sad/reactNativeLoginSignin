/* eslint-env jest */
import { CAPABILITY_STATUS } from "../../constants";
import { getEventById, getEventIcon, getEventList } from "../events";

const on = (overrides = {}) => ({
  events: CAPABILITY_STATUS.ENABLED,
  ...overrides,
});

const ids = (list) => list.map((event) => event.id);

describe("getEventList", () => {
  it("returns active events for the mall when events is ENABLED", () => {
    const events = getEventList("luckyone", on());
    expect(ids(events)).toEqual(["lucky-event-1", "lucky-event-2"]);
    expect(events[0]).toMatchObject({
      title: "Weekend pop-up market",
      category: "Market",
      capability: "events",
    });
  });

  it("filters expired events out of the list", () => {
    const events = getEventList("luckyone", on());
    expect(ids(events)).not.toContain("lucky-event-expired");
  });

  it("scopes results to the requested mall", () => {
    expect(ids(getEventList("harbourwalk", on()))).toEqual(["harbour-event-1"]);
  });

  it("returns an empty list when events is DISABLED", () => {
    expect(getEventList("luckyone", on({ events: CAPABILITY_STATUS.DISABLED }))).toEqual([]);
    expect(getEventList("luckyone", {})).toEqual([]);
    expect(getEventList("luckyone", undefined)).toEqual([]);
  });

  it("still lists when events is DEGRADED (shown as limited)", () => {
    expect(ids(getEventList("luckyone", on({ events: CAPABILITY_STATUS.DEGRADED })))).toEqual([
      "lucky-event-1",
      "lucky-event-2",
    ]);
  });

  it("filters by the injected now for time-travel checks", () => {
    const during = new Date("2020-01-10T00:00:00Z");
    expect(ids(getEventList("luckyone", on(), during))).toEqual([
      "lucky-event-1",
      "lucky-event-2",
      "lucky-event-expired",
    ]);
    const after = new Date("2100-01-01T00:00:00Z");
    expect(getEventList("luckyone", on(), after)).toEqual([]);
  });
});

describe("getEventById", () => {
  it("resolves an active event by id", () => {
    const event = getEventById("lucky-event-2");
    expect(event.title).toBe("Kids craft workshop");
    expect(event.capacity).toBe(30);
  });

  it("resolves null for an expired event", () => {
    expect(getEventById("lucky-event-expired")).toBeNull();
  });

  it("resolves null for an unknown id", () => {
    expect(getEventById("nope")).toBeNull();
    expect(getEventById(undefined)).toBeNull();
  });

  it("honours the injected now", () => {
    const during = new Date("2020-01-10T00:00:00Z");
    expect(getEventById("lucky-event-expired", during)).not.toBeNull();
  });
});

describe("getEventIcon", () => {
  it("maps known categories to banner icons", () => {
    expect(getEventIcon("Market")).toBe("storefront-outline");
    expect(getEventIcon("Workshop")).toBe("color-palette-outline");
    expect(getEventIcon("Art")).toBe("brush-outline");
  });

  it("falls back to the calendar icon for unknown categories", () => {
    expect(getEventIcon("Concert")).toBe("calendar-outline");
    expect(getEventIcon(undefined)).toBe("calendar-outline");
  });
});
