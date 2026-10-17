import { CAPABILITY_STATUS } from "../constants";
import { isCapabilityVisible } from "./homeContent";

/**
 * Mock merchant directory for mall-scoped search (PRD 5.7, SCREEN_INVENTORY
 * 10/19). Pure presentation data — no backend. Each mall keeps only merchants
 * whose discovery capability is visible; DISABLED capabilities hide their
 * merchants entirely.
 */
export const MOCK_MERCHANTS = {
  luckyone: [
    {
      id: "lucky-m-1",
      name: "Spice Route Kitchen",
      category: "Restaurants",
      cuisine: "Pakistani",
      floor: "Level 2 · Food court",
      priceBand: "mid",
      openNow: true,
      tags: ["dining", "family", "buffet"],
      offerKeywords: ["lunch", "combo", "20% off"],
      capability: "restaurant_discovery",
    },
    {
      id: "lucky-m-2",
      name: "Noodle Bar Express",
      category: "Restaurants",
      cuisine: "Chinese",
      floor: "Level 2 · Food court",
      priceBand: "budget",
      openNow: false,
      tags: ["dining", "quick bite", "noodles"],
      offerKeywords: ["BOGO"],
      capability: "restaurant_discovery",
    },
    {
      id: "lucky-m-3",
      name: "Demo Fashion",
      category: "Fashion",
      cuisine: null,
      floor: "Level 1 · Main wing",
      priceBand: "mid",
      openNow: true,
      tags: ["retail", "clothing", "sale"],
      offerKeywords: ["mid-season", "sale"],
      capability: "retail_discovery",
    },
    {
      id: "lucky-m-4",
      name: "TechHub Electronics",
      category: "Electronics",
      cuisine: null,
      floor: "Level 1 · East wing",
      priceBand: "premium",
      openNow: true,
      tags: ["retail", "gadgets"],
      offerKeywords: [],
      capability: "retail_discovery",
    },
    {
      id: "lucky-m-5",
      name: "Bloom Beauty Studio",
      category: "Beauty & health",
      cuisine: null,
      floor: "Level 3 · West wing",
      priceBand: "premium",
      openNow: false,
      tags: ["retail", "beauty", "services"],
      offerKeywords: ["facial"],
      capability: "retail_discovery",
    },
  ],
  harbourwalk: [
    {
      id: "harbour-m-1",
      name: "Harbour Boutique",
      category: "Fashion",
      cuisine: null,
      floor: "Ground · Boutique row",
      priceBand: "mid",
      openNow: true,
      tags: ["retail", "clothing", "summer"],
      offerKeywords: ["15% off", "summer"],
      capability: "retail_discovery",
    },
    {
      id: "harbour-m-2",
      name: "Promenade Home",
      category: "Home & living",
      cuisine: null,
      floor: "Level 1",
      priceBand: "premium",
      openNow: true,
      tags: ["retail", "home"],
      offerKeywords: [],
      capability: "retail_discovery",
    },
    {
      id: "harbour-m-3",
      name: "Spice Route Kitchen",
      category: "Restaurants",
      cuisine: "Pakistani",
      floor: "Level 2",
      priceBand: "budget",
      openNow: false,
      tags: ["dining"],
      offerKeywords: [],
      capability: "restaurant_discovery",
    },
  ],
};

export const SEARCH_SUGGESTIONS = {
  luckyone: ["Spice Route", "Fashion", "Electronics", "Beauty", "Lunch combo"],
  harbourwalk: ["Harbour Boutique", "Home", "Summer edit", "Fashion"],
};

const ERROR_QUERY = "!error";

export const isCapabilityOn = (capabilityMap, capability) => {
  if (!capability) {
    return true;
  }
  const status = capabilityMap?.[capability];
  return status === CAPABILITY_STATUS.ENABLED || status === CAPABILITY_STATUS.DEGRADED;
};

/**
 * Client-side mock search: mall-scoped, capability-gated, matches name,
 * category, cuisine, tags and offer keywords (PRD 5.7). Query "!error"
 * simulates a recoverable network error so the UI error state is reachable
 * without a backend.
 */
export const searchMerchants = (mallSlug, capabilityMap, rawQuery) => {
  const query = (rawQuery || "").trim().toLowerCase();
  if (query === ERROR_QUERY) {
    return { status: false, message: "Search is temporarily unavailable. Try again.", data: [] };
  }
  const pool = MOCK_MERCHANTS[mallSlug] || [];
  const visible = pool.filter((merchant) =>
    isCapabilityVisible(capabilityMap, merchant.capability),
  );
  if (!query) {
    return { status: true, message: "ok", data: [] };
  }
  const matches = visible.filter((merchant) => {
    const haystack = [
      merchant.name,
      merchant.category,
      merchant.cuisine || "",
      merchant.floor,
      ...(merchant.tags || []),
      ...(merchant.offerKeywords || []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
  return { status: true, message: "ok", data: matches };
};

export const getSuggestions = (mallSlug) => SEARCH_SUGGESTIONS[mallSlug] || [];

export const EMPTY_FILTERS = {
  category: null,
  cuisine: null,
  openNow: false,
  floor: null,
  priceBand: null,
};

export const PRICE_BAND_LABELS = {
  budget: "Budget",
  mid: "Mid-range",
  premium: "Premium",
};

/**
 * Distinct filter option values present in a merchant list (PRD 5.7).
 */
export const collectFilterOptions = (merchants) => {
  const unique = (values) => [...new Set(values.filter(Boolean))];
  return {
    categories: unique(merchants.map((m) => m.category)),
    cuisines: unique(merchants.map((m) => m.cuisine)),
    floors: unique(merchants.map((m) => m.floor)),
    priceBands: unique(merchants.map((m) => m.priceBand)),
  };
};

/**
 * Client-side filter application (category, cuisine, open-now, floor, price).
 * `filters` follows EMPTY_FILTERS' shape; null/false means "any".
 */
export const applyMerchantFilters = (merchants, filters) => {
  const f = { ...EMPTY_FILTERS, ...(filters || {}) };
  return merchants.filter((merchant) => {
    if (f.category && merchant.category !== f.category) {
      return false;
    }
    if (f.cuisine && merchant.cuisine !== f.cuisine) {
      return false;
    }
    if (f.openNow && !merchant.openNow) {
      return false;
    }
    if (f.floor && merchant.floor !== f.floor) {
      return false;
    }
    if (f.priceBand && merchant.priceBand !== f.priceBand) {
      return false;
    }
    return true;
  });
};

export const countActiveFilters = (filters) => {
  const f = { ...EMPTY_FILTERS, ...(filters || {}) };
  const active = [f.category, f.cuisine, f.openNow ? "openNow" : null, f.floor, f.priceBand];
  return active.filter(Boolean).length;
};
