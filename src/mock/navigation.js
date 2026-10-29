import { CAPABILITY_STATUS } from "../constants";
import { FLOORS } from "./floors";

/**
 * Mock destination search + static route preview (SCREEN_INVENTORY 45–49;
 * PRD 5.12). Destinations are the published POIs from `floors.js`; routes
 * are hand-built step lists — no pathfinding, no live positioning, no QR
 * checkpoints. Capability-gated on indoor_navigation.
 */

const isCapabilityOn = (capabilityMap, capability) => {
  const status = capabilityMap?.[capability];
  return status === CAPABILITY_STATUS.ENABLED || status === CAPABILITY_STATUS.DEGRADED;
};

/** Flatten a mall's published-floor POIs into searchable destinations. */
const getDestinations = (mallSlug) => {
  const floors = FLOORS[mallSlug] ?? [];
  const destinations = [];
  floors
    .filter((floor) => floor.mapPublished)
    .forEach((floor) => {
      floor.pois.forEach((poi) => {
        destinations.push({
          id: poi.id,
          name: poi.name,
          category: poi.category,
          floorId: floor.id,
          floorLabel: floor.label,
          floorName: floor.name,
        });
      });
    });
  return destinations;
};

/** Idle-state suggestion queries per mall for the destination search. */
const DESTINATION_SUGGESTIONS = {
  luckyone: ["Food court", "Guest services", "Restrooms", "Cinema"],
  harbourwalk: [],
};

export const getDestinationSuggestions = (mallSlug) => DESTINATION_SUGGESTIONS[mallSlug] || [];

/** Curated manual start points (entrances, guest services) per mall. */
const START_POINT_IDS = {
  luckyone: ["lz-g-entrance", "lz-g-desk"],
  harbourwalk: [],
};

/**
 * Search published POIs for a destination. Returns the standard mock
 * envelope. A query of "!error" simulates a recoverable failure so the
 * error + retry path is reachable in the preview (same trick as merchant
 * search). Empty query resolves to an empty ok result.
 */
export const searchDestinations = (mallSlug, capabilityMap, rawQuery) => {
  if (!isCapabilityOn(capabilityMap, "indoor_navigation")) {
    return {
      status: false,
      message: "Indoor navigation isn't available at this mall.",
      data: [],
    };
  }
  const query = (rawQuery || "").trim().toLowerCase();
  if (query === "!error") {
    return { status: false, message: "Search is temporarily unavailable. Try again.", data: [] };
  }
  if (!query) {
    return { status: true, message: "ok", data: [] };
  }
  const matches = getDestinations(mallSlug).filter(
    (destination) =>
      destination.name.toLowerCase().includes(query) ||
      destination.category.toLowerCase().includes(query) ||
      destination.floorName.toLowerCase().includes(query),
  );
  return { status: true, message: "ok", data: matches };
};

/** Resolve one destination by id (SCREEN_INVENTORY 46). */
export const getDestinationById = (mallSlug, capabilityMap, destinationId) => {
  if (!isCapabilityOn(capabilityMap, "indoor_navigation")) {
    return {
      status: false,
      message: "Indoor navigation isn't available at this mall.",
      data: null,
    };
  }
  const destination = getDestinations(mallSlug).find((item) => item.id === destinationId) || null;
  if (!destination) {
    return {
      status: false,
      message: "That destination isn't on a published floor plan.",
      data: null,
    };
  }
  return { status: true, message: "ok", data: destination };
};

/** Curated manual start points for a mall (SCREEN_INVENTORY 49). */
export const getStartPoints = (mallSlug, capabilityMap) => {
  if (!isCapabilityOn(capabilityMap, "indoor_navigation")) {
    return {
      status: false,
      message: "Indoor navigation isn't available at this mall.",
      data: [],
    };
  }
  const ids = START_POINT_IDS[mallSlug] || [];
  const startPoints = getDestinations(mallSlug).filter((item) => ids.includes(item.id));
  return { status: true, message: "ok", data: startPoints };
};

/**
 * Build a static route preview (SCREEN_INVENTORY 47–48) between a chosen
 * start point and destination. Steps are deterministic text instructions —
 * this is not pathfinding and never claims live positioning.
 */
export const buildRoutePreview = (mallSlug, capabilityMap, startId, destinationId) => {
  if (!isCapabilityOn(capabilityMap, "indoor_navigation")) {
    return {
      status: false,
      message: "Indoor navigation isn't available at this mall.",
      data: null,
    };
  }
  const start = getDestinations(mallSlug).find((item) => item.id === startId) || null;
  const destination = getDestinations(mallSlug).find((item) => item.id === destinationId) || null;
  if (!start || !destination) {
    return {
      status: false,
      message: "We couldn't build that route. Pick your start point and destination again.",
      data: null,
    };
  }

  const steps = [];
  steps.push(`Start at ${start.name} (${start.floorName}).`);
  if (start.floorId !== destination.floorId) {
    steps.push(
      `Take the escalators from ${start.floorLabel === "G" ? "Ground" : `Level ${start.floorLabel}`} up to ${destination.floorLabel === "G" ? "Ground" : `Level ${destination.floorLabel}`}.`,
    );
    steps.push(`Follow signs for ${destination.category}.`);
  } else {
    steps.push(`Follow signs for ${destination.category} on ${destination.floorName}.`);
  }
  steps.push(`Arrive at ${destination.name}, ${destination.floorName}.`);

  return {
    status: true,
    message: "ok",
    data: { origin: start, destination, steps },
  };
};

export default searchDestinations;
