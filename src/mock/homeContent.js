import { CAPABILITY_STATUS } from "../constants";
import { getEventList } from "./events";

/**
 * Mock home-feed content per mall (PRD 5.5 featured placements, 5.8
 * discounts; SCREEN_INVENTORY 11–15). Every entry declares the capability
 * that gates it — DISABLED capabilities hide their entries entirely.
 * Campaign windows (`activeFrom`/`activeTo`/`endsAt`) filter expired
 * content the way the backend would. All data is mock; no ranking logic.
 */
const farFuture = "2099-12-31T23:59:59Z";

const HOME_CONTENT = {
  luckyone: {
    categories: [
      {
        key: "restaurants",
        title: "Restaurants",
        icon: "restaurant-outline",
        capability: "restaurant_discovery",
      },
      {
        key: "food-court",
        title: "Food court",
        icon: "cafe-outline",
        capability: "food_court",
      },
      {
        key: "shopping",
        title: "Shopping",
        icon: "bag-handle-outline",
        capability: "retail_discovery",
      },
      {
        key: "offers",
        title: "Offers",
        icon: "pricetag-outline",
        capability: "digital_coupons",
      },
      {
        key: "events",
        title: "Events",
        icon: "calendar-outline",
        capability: "events",
      },
      {
        key: "parking",
        title: "Parking",
        icon: "car-outline",
        capability: "live_parking",
      },
    ],
    featured: [
      {
        id: "lucky-featured-1",
        placement: "SPONSORED",
        title: "Mid-season sale",
        subtitle: "Fashion wing · Level 1",
        merchant: "Demo Fashion",
        capability: "retail_discovery",
        activeFrom: "2020-01-01T00:00:00Z",
        activeTo: farFuture,
      },
      {
        id: "lucky-featured-2",
        placement: "FEATURED",
        title: "New: spice route kitchen",
        subtitle: "Food court · Level 2",
        merchant: "Spice Route",
        capability: "restaurant_discovery",
        activeFrom: "2020-01-01T00:00:00Z",
        activeTo: farFuture,
      },
      {
        id: "lucky-featured-expired",
        placement: "SPONSORED",
        title: "Expired campaign (should be hidden)",
        subtitle: "Never shown",
        merchant: "Expired Co",
        capability: "retail_discovery",
        activeFrom: "2020-01-01T00:00:00Z",
        activeTo: "2020-02-01T00:00:00Z",
      },
    ],
    discounts: [
      {
        id: "lucky-discount-1",
        title: "20% off lunch combos",
        merchant: "Spice Route",
        scope: "restaurant",
        label: "20% OFF",
        capability: "restaurant_discovery",
        endsAt: farFuture,
      },
      {
        id: "lucky-discount-2",
        title: "Buy 1 get 1 onselect footwear",
        merchant: "Demo Fashion",
        scope: "retail",
        label: "BOGO",
        capability: "retail_discovery",
        endsAt: farFuture,
      },
      {
        id: "lucky-discount-expired",
        title: "Expired offer (should be hidden)",
        merchant: "Expired Co",
        scope: "retail",
        label: "50% OFF",
        capability: "retail_discovery",
        endsAt: "2020-01-15T00:00:00Z",
      },
    ],
    topSelling: {
      disclosure: "Based on completed app orders only (last 7 days). Not total mall sales.",
      restaurants: [
        { id: "lucky-top-r1", merchant: "Spice Route Kitchen", note: "Lunch combos" },
        { id: "lucky-top-r2", merchant: "Noodle Bar Express", note: "Quick bites" },
      ],
      retail: [
        { id: "lucky-top-s1", merchant: "Demo Fashion", note: "Seasonal picks" },
        { id: "lucky-top-s2", merchant: "TechHub Electronics", note: "Accessories" },
      ],
    },
    exploreDirectories: [
      {
        key: "restaurants",
        title: "Restaurants",
        subtitle: "Dining and food-court menus",
        icon: "restaurant-outline",
        capability: "restaurant_discovery",
      },
      {
        key: "outlets",
        title: "Outlets",
        subtitle: "Shops, brands and services",
        icon: "storefront-outline",
        capability: "retail_discovery",
      },
      {
        key: "food-court",
        title: "Food court",
        subtitle: "Quick bites and seating zones",
        icon: "cafe-outline",
        capability: "food_court",
      },
      {
        key: "offers",
        title: "Offers",
        subtitle: "Active discounts and coupons",
        icon: "pricetag-outline",
        capability: "digital_coupons",
      },
      {
        key: "events",
        title: "Events",
        subtitle: "What's on at the mall",
        icon: "calendar-outline",
        capability: "events",
      },
    ],
    exploreCategories: [
      {
        key: "dining",
        title: "Dining",
        icon: "restaurant-outline",
        capability: "restaurant_discovery",
      },
      {
        key: "fashion",
        title: "Fashion",
        icon: "shirt-outline",
        capability: "retail_discovery",
      },
      {
        key: "electronics",
        title: "Electronics",
        icon: "phone-portrait-outline",
        capability: "retail_discovery",
      },
      {
        key: "groceries",
        title: "Groceries",
        icon: "cart-outline",
        capability: "retail_discovery",
      },
      {
        key: "beauty",
        title: "Beauty & health",
        icon: "sparkles-outline",
        capability: "retail_discovery",
      },
      {
        key: "kids",
        title: "Kids & family",
        icon: "happy-outline",
        capability: "retail_discovery",
      },
      {
        key: "home",
        title: "Home & living",
        icon: "home-outline",
        capability: "retail_discovery",
      },
      {
        key: "services",
        title: "Services",
        icon: "construct-outline",
        capability: "retail_discovery",
      },
    ],
  },
  harbourwalk: {
    categories: [
      {
        key: "shopping",
        title: "Shopping",
        icon: "bag-handle-outline",
        capability: "retail_discovery",
      },
      {
        key: "events",
        title: "Events",
        icon: "calendar-outline",
        capability: "events",
      },
      {
        key: "restaurants",
        title: "Restaurants",
        icon: "restaurant-outline",
        capability: "restaurant_discovery",
      },
    ],
    featured: [
      {
        id: "harbour-featured-1",
        placement: "FEATURED",
        title: "Harbour summer edit",
        subtitle: "Boutique row · Ground floor",
        merchant: "Harbour Boutique",
        capability: "retail_discovery",
        activeFrom: "2020-01-01T00:00:00Z",
        activeTo: farFuture,
      },
    ],
    discounts: [
      {
        id: "harbour-discount-1",
        title: "15% off summer collection",
        merchant: "Harbour Boutique",
        scope: "retail",
        label: "15% OFF",
        capability: "retail_discovery",
        endsAt: farFuture,
      },
    ],
    topSelling: {
      disclosure: "Based on completed app orders only (last 7 days). Not total mall sales.",
      restaurants: [],
      retail: [{ id: "harbour-top-s1", merchant: "Harbour Boutique", note: "Summer edit" }],
    },
    exploreDirectories: [
      {
        key: "outlets",
        title: "Outlets",
        subtitle: "Shops, brands and services",
        icon: "storefront-outline",
        capability: "retail_discovery",
      },
      {
        key: "restaurants",
        title: "Restaurants",
        subtitle: "Dining and food-court menus",
        icon: "restaurant-outline",
        capability: "restaurant_discovery",
      },
      {
        key: "food-court",
        title: "Food court",
        subtitle: "Quick bites and seating zones",
        icon: "cafe-outline",
        capability: "food_court",
      },
      {
        key: "offers",
        title: "Offers",
        subtitle: "Active discounts and coupons",
        icon: "pricetag-outline",
        capability: "digital_coupons",
      },
      {
        key: "events",
        title: "Events",
        subtitle: "What's on at the mall",
        icon: "calendar-outline",
        capability: "events",
      },
    ],
    exploreCategories: [
      {
        key: "fashion",
        title: "Fashion",
        icon: "shirt-outline",
        capability: "retail_discovery",
      },
      {
        key: "beauty",
        title: "Beauty & health",
        icon: "sparkles-outline",
        capability: "retail_discovery",
      },
      {
        key: "home",
        title: "Home & living",
        icon: "home-outline",
        capability: "retail_discovery",
      },
      {
        key: "services",
        title: "Services",
        icon: "construct-outline",
        capability: "retail_discovery",
      },
      {
        key: "dining",
        title: "Dining",
        icon: "restaurant-outline",
        capability: "restaurant_discovery",
      },
    ],
  },
};

const getContentForMall = (mallSlug) => HOME_CONTENT[mallSlug] || null;

export const isCapabilityVisible = (capabilityMap, capability) => {
  if (!capability) {
    return true;
  }
  const status = capabilityMap?.[capability];
  return status === CAPABILITY_STATUS.ENABLED || status === CAPABILITY_STATUS.DEGRADED;
};

const isCampaignActive = (item, now = new Date()) => {
  const start = item.activeFrom ? Date.parse(item.activeFrom) : null;
  const end = item.activeTo ? Date.parse(item.activeTo) : null;
  if (start !== null && Number.isFinite(start) && now.getTime() < start) {
    return false;
  }
  if (end !== null && Number.isFinite(end) && now.getTime() > end) {
    return false;
  }
  return true;
};

const isOfferActive = (offer, now = new Date()) => {
  if (!offer.endsAt) {
    return true;
  }
  const end = Date.parse(offer.endsAt);
  return !Number.isFinite(end) || now.getTime() <= end;
};

/**
 * Resolve the visible home sections for a mall: capability-gated and with
 * expired campaigns/offers filtered out (PRD 5.5, 5.8).
 */
export const getHomeSections = (mallSlug, capabilityMap, now = new Date()) => {
  const content = getContentForMall(mallSlug);
  if (!content) {
    return { categories: [], featured: [], discounts: [], events: [], topSelling: null };
  }
  const categories = (content.categories || []).filter((category) =>
    isCapabilityVisible(capabilityMap, category.capability),
  );
  const featured = (content.featured || []).filter(
    (item) => isCapabilityVisible(capabilityMap, item.capability) && isCampaignActive(item, now),
  );
  const discounts = (content.discounts || []).filter(
    (offer) => isCapabilityVisible(capabilityMap, offer.capability) && isOfferActive(offer, now),
  );
  // Events resolve from the shared catalogue (src/mock/events.js) — the
  // same source the Events list/detail screens use (PRD 5.14).
  const events = getEventList(mallSlug, capabilityMap, now);
  let topSelling = null;
  const rawTop = content.topSelling;
  if (rawTop) {
    const restaurants = isCapabilityVisible(capabilityMap, "restaurant_discovery")
      ? rawTop.restaurants || []
      : [];
    const retail = isCapabilityVisible(capabilityMap, "retail_discovery")
      ? rawTop.retail || []
      : [];
    if (restaurants.length || retail.length) {
      topSelling = { disclosure: rawTop.disclosure, restaurants, retail };
    }
  }
  return { categories, featured, discounts, events, topSelling };
};

/**
 * Resolve the Explore landing content for a mall (SCREEN_INVENTORY 18):
 * capability-gated directory entries and a category grid.
 */
export const getExploreContent = (mallSlug, capabilityMap) => {
  const content = getContentForMall(mallSlug);
  if (!content) {
    return { directories: [], categoryGrid: [] };
  }
  const directories = (content.exploreDirectories || []).filter((entry) =>
    isCapabilityVisible(capabilityMap, entry.capability),
  );
  const categoryGrid = (content.exploreCategories || []).filter((category) =>
    isCapabilityVisible(capabilityMap, category.capability),
  );
  return { directories, categoryGrid };
};

export default HOME_CONTENT;
