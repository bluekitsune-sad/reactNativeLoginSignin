/* eslint-env jest */
import { CAPABILITY_STATUS } from "../../constants";
import { LIST_PAGE_SIZE, applyMerchantFilters, fetchMerchantListPage } from "../merchants";

const fixture = (overrides) => ({
  id: "m-1",
  name: "Fixture Merchant",
  category: "Restaurants",
  cuisine: "Pakistani",
  floor: "Level 2 · Food court",
  priceBand: "mid",
  openNow: true,
  capability: "restaurant_discovery",
  ...overrides,
});

const MERCHANTS = [
  fixture({ id: "m-1", name: "Alpha", cuisine: "Pakistani", openNow: true, priceBand: "mid" }),
  fixture({
    id: "m-2",
    name: "Beta",
    cuisine: "Chinese",
    openNow: false,
    priceBand: "budget",
    floor: "Level 1 · Main wing",
  }),
  fixture({
    id: "m-3",
    name: "Gamma",
    category: "Fashion",
    cuisine: null,
    openNow: true,
    priceBand: "premium",
    floor: "Level 1 · Main wing",
  }),
];

const ids = (list) => list.map((merchant) => merchant.id);

describe("applyMerchantFilters", () => {
  it("returns everyone when filters are empty or missing", () => {
    expect(ids(applyMerchantFilters(MERCHANTS, null))).toEqual(["m-1", "m-2", "m-3"]);
    expect(ids(applyMerchantFilters(MERCHANTS, {}))).toEqual(["m-1", "m-2", "m-3"]);
    expect(ids(applyMerchantFilters(MERCHANTS, undefined))).toEqual(["m-1", "m-2", "m-3"]);
  });

  it("filters by category", () => {
    expect(ids(applyMerchantFilters(MERCHANTS, { category: "Fashion" }))).toEqual(["m-3"]);
  });

  it("filters by cuisine", () => {
    expect(ids(applyMerchantFilters(MERCHANTS, { cuisine: "Chinese" }))).toEqual(["m-2"]);
  });

  it("filters open-now to open merchants only", () => {
    expect(ids(applyMerchantFilters(MERCHANTS, { openNow: true }))).toEqual(["m-1", "m-3"]);
  });

  it("filters by floor", () => {
    expect(ids(applyMerchantFilters(MERCHANTS, { floor: "Level 1 · Main wing" }))).toEqual([
      "m-2",
      "m-3",
    ]);
  });

  it("filters by price band", () => {
    expect(ids(applyMerchantFilters(MERCHANTS, { priceBand: "premium" }))).toEqual(["m-3"]);
  });

  it("ANDs multiple active filters", () => {
    expect(
      ids(applyMerchantFilters(MERCHANTS, { category: "Restaurants", cuisine: "Chinese" })),
    ).toEqual(["m-2"]);
  });

  it("returns an empty list when no merchant matches", () => {
    expect(
      applyMerchantFilters(MERCHANTS, { category: "Restaurants", cuisine: "Desserts" }),
    ).toEqual([]);
  });

  it("treats null/false filter values as 'any'", () => {
    expect(
      ids(applyMerchantFilters(MERCHANTS, { category: null, cuisine: null, openNow: false })),
    ).toEqual(["m-1", "m-2", "m-3"]);
  });

  it("does not mutate the input list", () => {
    const before = [...MERCHANTS];
    applyMerchantFilters(MERCHANTS, { category: "Fashion" });
    expect(MERCHANTS).toEqual(before);
  });
});

describe("fetchMerchantListPage", () => {
  // Module-level state: the first attempt per mall+kind fails once. Each
  // test therefore owns a unique mall slug so the fail-first machine is
  // deterministic regardless of test order.
  const ALL_ENABLED = {
    restaurant_discovery: CAPABILITY_STATUS.ENABLED,
    retail_discovery: CAPABILITY_STATUS.ENABLED,
  };
  const ALL_DISABLED = {
    restaurant_discovery: CAPABILITY_STATUS.DISABLED,
    retail_discovery: CAPABILITY_STATUS.DISABLED,
  };

  it("fails the first attempt for a mall+kind, then succeeds", async () => {
    const args = { mallSlug: "fail-once-mall", capabilityMap: ALL_ENABLED, kind: "restaurants" };
    const first = await fetchMerchantListPage(args);
    expect(first).toEqual({
      status: false,
      message: "Couldn't load this list. Check your connection and try again.",
      data: null,
    });

    const second = await fetchMerchantListPage(args);
    expect(second.status).toBe(true);
    expect(second.data).toMatchObject({ page: 1, pageSize: LIST_PAGE_SIZE, total: 0 });
  });

  it("fails the first attempt per kind independently", async () => {
    const restaurants = {
      mallSlug: "dual-kind-mall",
      capabilityMap: ALL_ENABLED,
      kind: "restaurants",
    };
    const outlets = { mallSlug: "dual-kind-mall", capabilityMap: ALL_ENABLED, kind: "outlets" };
    await fetchMerchantListPage(restaurants); // consumes restaurants' failure
    const outletsFirst = await fetchMerchantListPage(outlets);
    expect(outletsFirst.status).toBe(false); // outlets still fails once
    const outletsSecond = await fetchMerchantListPage(outlets);
    expect(outletsSecond.status).toBe(true);
  });

  it("returns an error envelope for an unknown kind", async () => {
    const response = await fetchMerchantListPage({
      mallSlug: "unknown-kind-mall",
      capabilityMap: ALL_ENABLED,
      kind: "parking",
    });
    expect(response).toEqual({ status: false, message: "Unknown merchant list.", data: null });
  });

  it("paginates the LuckyOne restaurant pool with hasMore and totals", async () => {
    const base = { mallSlug: "luckyone", capabilityMap: ALL_ENABLED, kind: "restaurants" };
    await fetchMerchantListPage(base); // consume the fail-first attempt

    const page1 = await fetchMerchantListPage({ ...base, page: 1 });
    expect(page1.status).toBe(true);
    expect(page1.data.page).toBe(1);
    expect(page1.data.items).toHaveLength(LIST_PAGE_SIZE);
    expect(page1.data.total).toBeGreaterThan(LIST_PAGE_SIZE);
    expect(page1.data.hasMore).toBe(true);

    const page2 = await fetchMerchantListPage({ ...base, page: 2 });
    expect(page2.status).toBe(true);
    expect(page2.data.page).toBe(2);
    expect(page2.data.items.length).toBeLessThanOrEqual(LIST_PAGE_SIZE);
    expect(page2.data.hasMore).toBe(false);
    // Pages never overlap.
    const page1Ids = page1.data.items.map((item) => item.id);
    const page2Ids = page2.data.items.map((item) => item.id);
    expect(page1Ids.filter((id) => page2Ids.includes(id))).toEqual([]);
  });

  it("returns an empty page for a page beyond the pool", async () => {
    const base = { mallSlug: "past-end-mall", capabilityMap: ALL_ENABLED, kind: "restaurants" };
    await fetchMerchantListPage(base);
    const response = await fetchMerchantListPage({ ...base, page: 99 });
    expect(response.status).toBe(true);
    expect(response.data.items).toEqual([]);
    expect(response.data.hasMore).toBe(false);
  });

  it("clamps page numbers below 1 to page 1", async () => {
    const base = { mallSlug: "clamp-mall", capabilityMap: ALL_ENABLED, kind: "outlets" };
    await fetchMerchantListPage(base);
    const response = await fetchMerchantListPage({ ...base, page: 0 });
    expect(response.data.page).toBe(1);
  });

  it("returns an empty successful page when the capability is DISABLED", async () => {
    const base = { mallSlug: "disabled-mall", capabilityMap: ALL_DISABLED, kind: "restaurants" };
    await fetchMerchantListPage(base);
    const response = await fetchMerchantListPage(base);
    expect(response.status).toBe(true);
    expect(response.data.items).toEqual([]);
    expect(response.data.total).toBe(0);
    expect(response.data.hasMore).toBe(false);
  });

  it("treats DEGRADED as visible (limited but listed)", async () => {
    const base = {
      mallSlug: "degraded-mall",
      capabilityMap: { restaurant_discovery: CAPABILITY_STATUS.DEGRADED },
      kind: "restaurants",
    };
    await fetchMerchantListPage(base);
    const response = await fetchMerchantListPage(base);
    expect(response.status).toBe(true);
  });
});
