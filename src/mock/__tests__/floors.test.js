/* eslint-env jest */
import { CAPABILITY_STATUS } from "../../constants";
import { getFloorPlan, getPoiIcon } from "../floors";

const on = (overrides = {}) => ({
  indoor_navigation: CAPABILITY_STATUS.ENABLED,
  ...overrides,
});

describe("getFloorPlan", () => {
  it("returns the mall's floors when indoor_navigation is ENABLED", () => {
    const plan = getFloorPlan("luckyone", on());
    expect(plan.available).toBe(true);
    expect(plan.degraded).toBe(false);
    expect(plan.floors.map((floor) => floor.label)).toEqual(["G", "1", "2", "3"]);
  });

  it("surfaces DEGRADED as limited but keeps the floors", () => {
    const plan = getFloorPlan("luckyone", on({ indoor_navigation: CAPABILITY_STATUS.DEGRADED }));
    expect(plan.available).toBe(true);
    expect(plan.degraded).toBe(true);
    expect(plan.floors.length).toBeGreaterThan(0);
  });

  it("hides everything when indoor_navigation is DISABLED", () => {
    expect(getFloorPlan("luckyone", on({ indoor_navigation: CAPABILITY_STATUS.DISABLED }))).toEqual(
      { available: false, degraded: false, floors: [] },
    );
    expect(getFloorPlan("luckyone", {})).toEqual({
      available: false,
      degraded: false,
      floors: [],
    });
    expect(getFloorPlan("luckyone", undefined)).toEqual({
      available: false,
      degraded: false,
      floors: [],
    });
  });

  it("keeps unpublished floors in the list (the screen shows them as unavailable)", () => {
    const plan = getFloorPlan("luckyone", on());
    const terrace = plan.floors.find((floor) => floor.label === "3");
    expect(terrace.mapPublished).toBe(false);
    expect(terrace.pois).toEqual([]);
  });

  it("resolves an empty floor list for an unknown mall even when capable", () => {
    expect(getFloorPlan("nowhere", on())).toEqual({
      available: false,
      degraded: false,
      floors: [],
    });
  });

  it("lists a mall whose floors are all unpublished", () => {
    const plan = getFloorPlan("harbourwalk", on());
    expect(plan.available).toBe(true);
    expect(plan.floors.every((floor) => floor.mapPublished === false)).toBe(true);
  });
});

describe("getPoiIcon", () => {
  it("maps known categories to Ionicons outline names", () => {
    expect(getPoiIcon("Entrance")).toBe("enter-outline");
    expect(getPoiIcon("Transition")).toBe("swap-vertical-outline");
    expect(getPoiIcon("Food court")).toBe("cafe-outline");
    expect(getPoiIcon("Landmark")).toBe("location-outline");
  });

  it("falls back to the generic pin for unknown categories", () => {
    expect(getPoiIcon("Parking")).toBe("location-outline");
    expect(getPoiIcon(undefined)).toBe("location-outline");
  });
});
