/* eslint-env jest */
import { CAPABILITY_STATUS } from "../../constants";
import { getExploreContent, getHomeSections, isCapabilityVisible } from "../homeContent";

const allOn = () => ({
  restaurant_discovery: CAPABILITY_STATUS.ENABLED,
  food_court: CAPABILITY_STATUS.ENABLED,
  retail_discovery: CAPABILITY_STATUS.ENABLED,
  digital_coupons: CAPABILITY_STATUS.ENABLED,
  events: CAPABILITY_STATUS.ENABLED,
  live_parking: CAPABILITY_STATUS.ENABLED,
});

describe("isCapabilityVisible", () => {
  it("treats a missing capability declaration as visible", () => {
    expect(isCapabilityVisible(allOn(), undefined)).toBe(true);
  });

  it("shows ENABLED and DEGRADED capabilities", () => {
    expect(isCapabilityVisible({ x: CAPABILITY_STATUS.ENABLED }, "x")).toBe(true);
    expect(isCapabilityVisible({ x: CAPABILITY_STATUS.DEGRADED }, "x")).toBe(true);
  });

  it("hides DISABLED and missing capabilities", () => {
    expect(isCapabilityVisible({ x: CAPABILITY_STATUS.DISABLED }, "x")).toBe(false);
    expect(isCapabilityVisible({}, "x")).toBe(false);
    expect(isCapabilityVisible(undefined, "x")).toBe(false);
  });
});

describe("getHomeSections", () => {
  it("returns every section for a fully-capable mall", () => {
    const sections = getHomeSections("luckyone", allOn());
    expect(sections.categories.length).toBeGreaterThan(0);
    expect(sections.featured.map((item) => item.id)).toEqual([
      "lucky-featured-1",
      "lucky-featured-2",
    ]);
    expect(sections.discounts.map((item) => item.id)).toEqual([
      "lucky-discount-1",
      "lucky-discount-2",
    ]);
    expect(sections.events.map((event) => event.id)).toEqual(["lucky-event-1", "lucky-event-2"]);
    expect(sections.topSelling).not.toBeNull();
    expect(sections.topSelling.disclosure).toContain("app orders only");
  });

  it("filters expired campaigns and offers out", () => {
    const sections = getHomeSections("luckyone", allOn());
    const ids = [...sections.featured, ...sections.discounts].map((item) => item.id);
    expect(ids).not.toContain("lucky-featured-expired");
    expect(ids).not.toContain("lucky-discount-expired");
  });

  it("hides entries whose capability is DISABLED", () => {
    const sections = getHomeSections("luckyone", {
      ...allOn(),
      restaurant_discovery: CAPABILITY_STATUS.DISABLED,
    });
    expect(sections.categories.map((category) => category.key)).not.toContain("restaurants");
    expect(sections.featured.map((item) => item.id)).toEqual(["lucky-featured-1"]);
    expect(sections.discounts.map((item) => item.id)).toEqual(["lucky-discount-2"]);
    expect(sections.topSelling.restaurants).toEqual([]);
    expect(sections.topSelling.retail.length).toBeGreaterThan(0);
  });

  it("drops topSelling entirely when both discovery capabilities are off", () => {
    const sections = getHomeSections("luckyone", {
      ...allOn(),
      restaurant_discovery: CAPABILITY_STATUS.DISABLED,
      retail_discovery: CAPABILITY_STATUS.DISABLED,
    });
    expect(sections.topSelling).toBeNull();
  });

  it("returns empty sections for an unknown mall", () => {
    expect(getHomeSections("nowhere", allOn())).toEqual({
      categories: [],
      featured: [],
      discounts: [],
      events: [],
      topSelling: null,
    });
  });

  it("excludes events when the events capability is DISABLED", () => {
    const sections = getHomeSections("luckyone", {
      ...allOn(),
      events: CAPABILITY_STATUS.DISABLED,
    });
    expect(sections.events).toEqual([]);
  });
});

describe("getExploreContent", () => {
  it("returns directories and category grid for a capable mall", () => {
    const content = getExploreContent("luckyone", allOn());
    expect(content.directories.length).toBeGreaterThan(0);
    expect(content.categoryGrid.length).toBeGreaterThan(0);
    expect(content.directories.map((entry) => entry.key)).toContain("restaurants");
  });

  it("gates directories and categories on their capabilities", () => {
    const content = getExploreContent("luckyone", {
      ...allOn(),
      restaurant_discovery: CAPABILITY_STATUS.DISABLED,
      food_court: CAPABILITY_STATUS.DISABLED,
    });
    const keys = content.directories.map((entry) => entry.key);
    expect(keys).not.toContain("restaurants");
    expect(keys).not.toContain("food-court");
    expect(keys).toContain("outlets");
    expect(content.categoryGrid.map((category) => category.key)).not.toContain("dining");
  });

  it("returns empty content for an unknown mall", () => {
    expect(getExploreContent("nowhere", allOn())).toEqual({
      directories: [],
      categoryGrid: [],
    });
  });
});
