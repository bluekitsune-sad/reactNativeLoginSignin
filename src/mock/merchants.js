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
    {
      id: "lucky-m-6",
      name: "Karahi Corner",
      category: "Restaurants",
      cuisine: "Pakistani",
      floor: "Level 2 · Food court",
      priceBand: "mid",
      openNow: true,
      tags: ["dining", "family", "karahi"],
      offerKeywords: ["dinner"],
      capability: "restaurant_discovery",
    },
    {
      id: "lucky-m-7",
      name: "Burger Boulevard",
      category: "Restaurants",
      cuisine: "Fast food",
      floor: "Level 2 · Food court",
      priceBand: "budget",
      openNow: true,
      tags: ["dining", "burgers", "quick bite"],
      offerKeywords: ["combo"],
      capability: "restaurant_discovery",
    },
    {
      id: "lucky-m-8",
      name: "Sweet Tooth Desserts",
      category: "Restaurants",
      cuisine: "Desserts",
      floor: "Level 1 · Atrium",
      priceBand: "mid",
      openNow: false,
      tags: ["dining", "dessert", "cakes"],
      offerKeywords: ["slice"],
      capability: "restaurant_discovery",
    },
    {
      id: "lucky-m-9",
      name: "Chai Wala Cafe",
      category: "Restaurants",
      cuisine: "Cafe",
      floor: "Level 3 · Books wing",
      priceBand: "budget",
      openNow: true,
      tags: ["dining", "chai", "coffee"],
      offerKeywords: ["student"],
      capability: "restaurant_discovery",
    },
    {
      id: "lucky-m-10",
      name: "KidZone Toys",
      category: "Kids & family",
      cuisine: null,
      floor: "Level 3 · Family wing",
      priceBand: "budget",
      openNow: true,
      tags: ["retail", "toys", "gifts"],
      offerKeywords: ["buy1get1"],
      capability: "retail_discovery",
    },
    {
      id: "lucky-m-11",
      name: "Page & Spine Books",
      category: "Books & stationery",
      cuisine: null,
      floor: "Level 1 · Main wing",
      priceBand: "mid",
      openNow: true,
      tags: ["retail", "books", "stationery"],
      offerKeywords: [],
      capability: "retail_discovery",
    },
    {
      id: "lucky-m-12",
      name: "Sneaker Street",
      category: "Fashion",
      cuisine: null,
      floor: "Level 1 · East wing",
      priceBand: "mid",
      openNow: false,
      tags: ["retail", "footwear", "sneakers"],
      offerKeywords: ["running"],
      capability: "retail_discovery",
    },
    {
      id: "lucky-m-13",
      name: "Green Grocer Market",
      category: "Groceries",
      cuisine: null,
      floor: "Ground · Plaza",
      priceBand: "budget",
      openNow: true,
      tags: ["retail", "groceries", "fresh"],
      offerKeywords: [],
      capability: "retail_discovery",
    },
    {
      id: "lucky-m-14",
      name: "Zarina Jewellers",
      category: "Jewellery",
      cuisine: null,
      floor: "Level 2 · Gold row",
      priceBand: "premium",
      openNow: true,
      tags: ["retail", "jewellery", "gifts"],
      offerKeywords: [],
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
    {
      id: "harbour-m-4",
      name: "Waveform Music",
      category: "Electronics",
      cuisine: null,
      floor: "Level 1",
      priceBand: "mid",
      openNow: false,
      tags: ["retail", "music", "audio"],
      offerKeywords: [],
      capability: "retail_discovery",
    },
    {
      id: "harbour-m-5",
      name: "Coastal Coffee Roasters",
      category: "Groceries",
      cuisine: null,
      floor: "Ground · Promenade",
      priceBand: "mid",
      openNow: true,
      tags: ["retail", "coffee", "beans"],
      offerKeywords: ["roast"],
      capability: "retail_discovery",
    },
    {
      id: "harbour-m-6",
      name: "Urban Fit Gear",
      category: "Fashion",
      cuisine: null,
      floor: "Level 1",
      priceBand: "mid",
      openNow: true,
      tags: ["retail", "sportswear"],
      offerKeywords: ["gym"],
      capability: "retail_discovery",
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

export const LIST_PAGE_SIZE = 4;
const LIST_LATENCY_MS = 450;

/**
 * Per-mall/kind metadata for the full restaurant and outlet list screens
 * (SCREEN_INVENTORY 21–22). `unavailable*` is shown when the mall's
 * capability map hides the list; `empty*` when the capability is visible
 * but no merchants are listed.
 */
export const LIST_KIND_META = {
  restaurants: {
    title: "Restaurants",
    subtitle: "Dining and food-court menus",
    capability: "restaurant_discovery",
    icon: "restaurant-outline",
    emptyTitle: "No restaurants listed",
    emptyMessage: (mallName) => `No restaurants are listed at ${mallName} yet.`,
    unavailableTitle: "Restaurants unavailable",
    unavailableMessage: (mallName) => `Restaurant listings aren't available at ${mallName}.`,
  },
  outlets: {
    title: "Outlets",
    subtitle: "Shops, brands and services",
    capability: "retail_discovery",
    icon: "storefront-outline",
    emptyTitle: "No outlets listed",
    emptyMessage: (mallName) => `No outlets are listed at ${mallName} yet.`,
    unavailableTitle: "Outlets unavailable",
    unavailableMessage: (mallName) => `Outlet listings aren't available at ${mallName}.`,
  },
};

const listAttemptFailures = new Set();

/**
 * Mock paginated directory fetch for the restaurant/outlet list screens
 * (SCREEN_INVENTORY 21–22). Resolves the services envelope shape
 * `{ status, message, data }` where `data` is
 * `{ items, page, pageSize, hasMore, total }`.
 *
 * Error-state simulation: the FIRST request for a given mall+kind fails
 * once (any page), then every later request succeeds — so the loading,
 * error-with-retry, paging and end-of-list states are all reachable in the
 * UI without a backend. Pure presentation; no ranking or ordering logic.
 */
export const fetchMerchantListPage = ({ mallSlug, capabilityMap, kind, page = 1 }) =>
  new Promise((resolve) => {
    const meta = LIST_KIND_META[kind];
    setTimeout(() => {
      if (!meta) {
        resolve({ status: false, message: "Unknown merchant list.", data: null });
        return;
      }
      const failureKey = `${mallSlug}:${kind}`;
      if (!listAttemptFailures.has(failureKey)) {
        listAttemptFailures.add(failureKey);
        resolve({
          status: false,
          message: "Couldn't load this list. Check your connection and try again.",
          data: null,
        });
        return;
      }
      const visible = isCapabilityVisible(capabilityMap, meta.capability);
      const pool = visible
        ? (MOCK_MERCHANTS[mallSlug] || []).filter(
            (merchant) => merchant.capability === meta.capability,
          )
        : [];
      const total = pool.length;
      const safePage = Math.max(1, page);
      const start = (safePage - 1) * LIST_PAGE_SIZE;
      const items = pool.slice(start, start + LIST_PAGE_SIZE);
      const hasMore = start + items.length < total;
      resolve({
        status: true,
        message: "ok",
        data: { items, page: safePage, pageSize: LIST_PAGE_SIZE, hasMore, total },
      });
    }, LIST_LATENCY_MS);
  });
