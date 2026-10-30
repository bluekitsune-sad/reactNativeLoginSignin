import { CAPABILITY_STATUS } from "../constants";

/**
 * Mock mall floors with static POI pins (SCREEN_INVENTORY 43–44, 50;
 * PRD 5.12 indoor maps). Coordinates are percentages of the placeholder
 * plan area. No real floor plans, no routing, no live positioning —
 * those need real integration data and are out of the preview scope.
 */
export const FLOORS = {
  luckyone: [
    {
      id: "lz-floor-g",
      label: "G",
      name: "Ground",
      mapPublished: true,
      pois: [
        { id: "lz-g-entrance", name: "Main entrance", category: "Entrance", x: 50, y: 90 },
        { id: "lz-g-desk", name: "Guest services", category: "Amenity", x: 22, y: 70 },
        { id: "lz-g-escalator", name: "Escalators up", category: "Transition", x: 38, y: 50 },
        { id: "lz-g-restrooms", name: "Restrooms", category: "Amenity", x: 78, y: 42 },
        { id: "lz-g-shops", name: "Supermarket entrance", category: "Shop", x: 68, y: 72 },
      ],
    },
    {
      id: "lz-floor-1",
      label: "1",
      name: "Level 1 · Fashion",
      mapPublished: true,
      pois: [
        { id: "lz-1-escalator", name: "Escalators", category: "Transition", x: 38, y: 50 },
        { id: "lz-1-restrooms", name: "Restrooms", category: "Amenity", x: 78, y: 42 },
        { id: "lz-1-fashion", name: "Fashion wing", category: "Shop", x: 28, y: 35 },
        { id: "lz-1-boutiques", name: "Boutique row", category: "Shop", x: 66, y: 62 },
        { id: "lz-1-atrium", name: "Atrium overlook", category: "Landmark", x: 50, y: 78 },
      ],
    },
    {
      id: "lz-floor-2",
      label: "2",
      name: "Level 2 · Food & fun",
      mapPublished: true,
      pois: [
        { id: "lz-2-foodcourt", name: "Food court", category: "Food court", x: 50, y: 48 },
        { id: "lz-2-cinema", name: "Cinema", category: "Landmark", x: 76, y: 28 },
        { id: "lz-2-escalator", name: "Escalators", category: "Transition", x: 38, y: 50 },
        { id: "lz-2-restrooms", name: "Restrooms", category: "Amenity", x: 78, y: 42 },
      ],
    },
    {
      id: "lz-floor-3",
      label: "3",
      name: "Terrace",
      mapPublished: false,
      pois: [],
    },
  ],
  harbourwalk: [
    { id: "hw-floor-g", label: "G", name: "Ground", mapPublished: false, pois: [] },
    { id: "hw-floor-1", label: "1", name: "Level 1", mapPublished: false, pois: [] },
  ],
};

const isCapabilityOn = (capabilityMap, capability) => {
  const status = capabilityMap?.[capability];
  return status === CAPABILITY_STATUS.ENABLED || status === CAPABILITY_STATUS.DEGRADED;
};

/**
 * Resolve the floor-map preview for a mall. Capability-gated on
 * indoor_navigation (DISABLED hides the whole feature; DEGRADED is
 * surfaced as "Limited"). Floors may individually be unpublished, which
 * the screen renders as the "map data unavailable" state.
 */
export const getFloorPlan = (mallSlug, capabilityMap) => {
  if (!isCapabilityOn(capabilityMap, "indoor_navigation")) {
    return { available: false, degraded: false, floors: [] };
  }
  const floors = FLOORS[mallSlug] ?? [];
  return {
    available: floors.length > 0,
    degraded: capabilityMap?.indoor_navigation === CAPABILITY_STATUS.DEGRADED,
    floors,
  };
};

/** Icon (Ionicons outline name) per POI category for the pin markers. */
const POI_ICONS = {
  Entrance: "door-outline",
  Amenity: "information-circle-outline",
  Transition: "swap-vertical-outline",
  Shop: "bag-handle-outline",
  Restaurant: "restaurant-outline",
  "Food court": "cafe-outline",
  Landmark: "location-outline",
};

export const getPoiIcon = (category) => POI_ICONS[category] ?? "location-outline";

export default FLOORS;
