/* eslint-env jest */
import { CAPABILITY_STATUS } from "../../constants";
import {
  buildRoutePreview,
  getDestinationById,
  getDestinationSuggestions,
  getStartPoints,
  searchDestinations,
} from "../navigation";

const on = (overrides = {}) => ({
  indoor_navigation: CAPABILITY_STATUS.ENABLED,
  ...overrides,
});

const ids = (list) => list.map((item) => item.id);

describe("getDestinationSuggestions", () => {
  it("returns the mall's idle-state suggestions", () => {
    expect(getDestinationSuggestions("luckyone")).toEqual([
      "Food court",
      "Guest services",
      "Restrooms",
      "Cinema",
    ]);
  });

  it("returns an empty list for malls without suggestions", () => {
    expect(getDestinationSuggestions("harbourwalk")).toEqual([]);
    expect(getDestinationSuggestions("nowhere")).toEqual([]);
  });
});

describe("searchDestinations", () => {
  it("matches published POIs by name, category and floor name", () => {
    const result = searchDestinations("luckyone", on(), "restroom");
    expect(result.status).toBe(true);
    expect(ids(result.data)).toEqual(
      expect.arrayContaining(["lz-g-restrooms", "lz-1-restrooms", "lz-2-restrooms"]),
    );
  });

  it("matches by floor name", () => {
    const result = searchDestinations("luckyone", on(), "fashion");
    expect(result.status).toBe(true);
    expect(ids(result.data)).toContain("lz-1-fashion");
  });

  it("returns an empty ok result for an empty query", () => {
    expect(searchDestinations("luckyone", on(), "")).toEqual({
      status: true,
      message: "ok",
      data: [],
    });
    expect(searchDestinations("luckyone", on(), "   ").data).toEqual([]);
    expect(searchDestinations("luckyone", on(), undefined).data).toEqual([]);
  });

  it("simulates a recoverable failure for the !error query", () => {
    const result = searchDestinations("luckyone", on(), "!error");
    expect(result.status).toBe(false);
    expect(result.message).toBeTruthy();
    expect(result.data).toEqual([]);
  });

  it("fails when indoor_navigation is DISABLED", () => {
    const result = searchDestinations(
      "luckyone",
      on({ indoor_navigation: CAPABILITY_STATUS.DISABLED }),
      "restroom",
    );
    expect(result.status).toBe(false);
    expect(result.data).toEqual([]);
  });

  it("searches only published floors", () => {
    const result = searchDestinations("luckyone", on(), "terrace");
    expect(result.data).toEqual([]);
  });
});

describe("getDestinationById", () => {
  it("resolves a published destination", () => {
    const result = getDestinationById("luckyone", on(), "lz-g-desk");
    expect(result.status).toBe(true);
    expect(result.data).toMatchObject({
      name: "Guest services",
      floorLabel: "G",
    });
  });

  it("fails for an unknown destination", () => {
    const result = getDestinationById("luckyone", on(), "nope");
    expect(result.status).toBe(false);
    expect(result.data).toBeNull();
  });

  it("fails when indoor_navigation is DISABLED", () => {
    const result = getDestinationById(
      "luckyone",
      on({ indoor_navigation: CAPABILITY_STATUS.DISABLED }),
      "lz-g-desk",
    );
    expect(result.status).toBe(false);
    expect(result.data).toBeNull();
  });
});

describe("getStartPoints", () => {
  it("returns the curated start points for the mall", () => {
    const result = getStartPoints("luckyone", on());
    expect(result.status).toBe(true);
    expect(ids(result.data)).toEqual(["lz-g-entrance", "lz-g-desk"]);
  });

  it("returns an empty list for a mall without curated points", () => {
    expect(getStartPoints("harbourwalk", on())).toEqual({
      status: true,
      message: "ok",
      data: [],
    });
  });

  it("fails when indoor_navigation is DISABLED", () => {
    const result = getStartPoints(
      "luckyone",
      on({ indoor_navigation: CAPABILITY_STATUS.DISABLED }),
    );
    expect(result.status).toBe(false);
    expect(result.data).toEqual([]);
  });
});

describe("buildRoutePreview", () => {
  it("builds a cross-floor route with an escalator step", () => {
    const result = buildRoutePreview("luckyone", on(), "lz-g-entrance", "lz-1-fashion");
    expect(result.status).toBe(true);
    expect(result.data.origin.id).toBe("lz-g-entrance");
    expect(result.data.destination.id).toBe("lz-1-fashion");
    expect(result.data.steps[0]).toBe("Start at Main entrance (Ground).");
    expect(result.data.steps[1]).toBe("Take the escalators from Ground up to Level 1.");
    expect(result.data.steps).toHaveLength(4);
  });

  it("builds a same-floor route without an escalator step", () => {
    const result = buildRoutePreview("luckyone", on(), "lz-g-entrance", "lz-g-restrooms");
    expect(result.status).toBe(true);
    expect(result.data.steps).toHaveLength(3);
    expect(result.data.steps[1]).toBe("Follow signs for Amenity on Ground.");
  });

  it("fails when either endpoint is unknown", () => {
    expect(buildRoutePreview("luckyone", on(), "nope", "lz-g-desk").status).toBe(false);
    expect(buildRoutePreview("luckyone", on(), "lz-g-desk", "nope").status).toBe(false);
    expect(buildRoutePreview("luckyone", on(), "nope", "nope").data).toBeNull();
  });

  it("fails when indoor_navigation is DISABLED", () => {
    const result = buildRoutePreview(
      "luckyone",
      on({ indoor_navigation: CAPABILITY_STATUS.DISABLED }),
      "lz-g-entrance",
      "lz-g-desk",
    );
    expect(result.status).toBe(false);
    expect(result.data).toBeNull();
  });
});
