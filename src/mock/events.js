import { CAPABILITY_STATUS } from "../constants";

/**
 * Mock event catalogue (PRD 5.14, SCREEN_INVENTORY 54–56). One source of
 * truth for the Home "Events" section and the Events list/detail screens.
 * Expired events (endsAt in the past) are hidden by every resolver, the
 * way the backend would. Images are placeholders (banner icon + tone) —
 * real creative assets are blocked pending merchant/mall permissions.
 * Registration is a placeholder handoff only (no external links yet).
 */
const farFuture = "2099-12-31T23:59:59Z";

export const MOCK_EVENTS = {
  "lucky-event-1": {
    id: "lucky-event-1",
    mallSlug: "luckyone",
    title: "Weekend pop-up market",
    subtitle: "Local makers and food stalls",
    description:
      "A curated weekend market with local makers, crafts and specialty food stalls. Wander the stalls, meet the vendors and grab a bite from the pop-up kitchens.",
    category: "Market",
    bannerTone: "primary",
    when: "Sat & Sun · 2 PM – 10 PM",
    startsAt: "2020-01-01T00:00:00Z",
    endsAt: farFuture,
    location: "Central atrium",
    organizer: "Mall management",
    registrationUrl: null,
    capacity: null,
    capability: "events",
  },
  "lucky-event-2": {
    id: "lucky-event-2",
    mallSlug: "luckyone",
    title: "Kids craft workshop",
    subtitle: "Free entry, limited seats",
    description:
      "A guided craft session for children aged 5–12. Materials are provided; seats are limited so arrive early. Guardians must stay with their children.",
    category: "Workshop",
    bannerTone: "highlight",
    when: "Every Saturday · 4 PM",
    startsAt: "2020-01-01T00:00:00Z",
    endsAt: farFuture,
    location: "Activity zone, Level 3",
    organizer: "Mall management",
    registrationUrl: null,
    capacity: 30,
    capability: "events",
  },
  "lucky-event-expired": {
    id: "lucky-event-expired",
    mallSlug: "luckyone",
    title: "Expired event (should be hidden)",
    subtitle: "Ended in 2020",
    description: "This event ended long ago and must never appear in upcoming lists.",
    category: "Market",
    bannerTone: "muted",
    when: "Ended Jan 2020",
    startsAt: "2019-01-01T00:00:00Z",
    endsAt: "2020-01-15T00:00:00Z",
    location: "Central atrium",
    organizer: "Mall management",
    registrationUrl: null,
    capacity: null,
    capability: "events",
  },
  "harbour-event-1": {
    id: "harbour-event-1",
    mallSlug: "harbourwalk",
    title: "Waterfront art walk",
    subtitle: "Local artists along the promenade",
    description:
      "An open-air art walk along the promenade featuring local artists, live sketching and a sunset acoustic set.",
    category: "Art",
    bannerTone: "info",
    when: "Sunday · 5 PM – 9 PM",
    startsAt: "2020-01-01T00:00:00Z",
    endsAt: farFuture,
    location: "Promenade",
    organizer: "Harbour Walk events desk",
    registrationUrl: null,
    capacity: null,
    capability: "events",
  },
};

const isEventActive = (event, now) => {
  if (!event.endsAt) {
    return true;
  }
  const end = Date.parse(event.endsAt);
  return !Number.isFinite(end) || now.getTime() <= end;
};

/** Icon (Ionicons outline name) per event category for banner placeholders. */
export const EVENT_ICONS = {
  Market: "storefront-outline",
  Workshop: "color-palette-outline",
  Art: "brush-outline",
};

export const getEventIcon = (category) => EVENT_ICONS[category] ?? "calendar-outline";

const isCapabilityOn = (capabilityMap, capability) => {
  const status = capabilityMap?.[capability];
  return status === CAPABILITY_STATUS.ENABLED || status === CAPABILITY_STATUS.DEGRADED;
};

/** Light summary used by Home cards and the events list. */
export const toEventSummary = (event) => ({
  id: event.id,
  title: event.title,
  subtitle: event.subtitle,
  when: event.when,
  location: event.location,
  category: event.category,
  bannerTone: event.bannerTone,
  capability: event.capability,
  endsAt: event.endsAt,
});

/**
 * Active, capability-gated events for a mall as list summaries. Expired
 * events are filtered out (PRD 5.14).
 */
export const getEventList = (mallSlug, capabilityMap, now = new Date()) => {
  if (!isCapabilityOn(capabilityMap, "events")) {
    return [];
  }
  return Object.values(MOCK_EVENTS)
    .filter((event) => event.mallSlug === mallSlug)
    .filter((event) => isEventActive(event, now))
    .map(toEventSummary);
};

/**
 * Resolve one active event by id. Expired events resolve to null so the
 * detail screen can show an "unavailable" state.
 */
export const getEventById = (eventId, now = new Date()) => {
  const event = MOCK_EVENTS[eventId];
  if (!event || !isEventActive(event, now)) {
    return null;
  }
  return event;
};

export default MOCK_EVENTS;
