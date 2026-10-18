/**
 * English string catalog for MallMate (i18n groundwork, PRD section 10).
 * Keys are grouped by feature area. Values may contain `{placeholders}`
 * filled by `t(key, params)`. Full Urdu translation is a later decision —
 * this catalog is the English source of truth that translations will map
 * back to.
 */
export const en = {
  common: {
    goBack: "Go back",
    retry: "Retry",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    loading: "Loading…",
    mockDataNote: "Preview build — mock data. Not connected to live services yet.",
    noLivePositioning: "No live positioning or turn-by-turn navigation.",
  },
  mall: {
    switchMall: "Switch mall",
    selectedMall: "Selected mall",
    mapsUnavailable: "Maps unavailable",
  },
  search: {
    placeholder: "Search {mall}",
    noResults: "No results",
    searchFailed: "Search failed",
  },
  orders: {
    title: "Your orders",
    empty: "No orders yet",
    timeline: "Status timeline",
  },
  rewards: {
    title: "Rewards",
    emptyLedger: "No activity yet",
    basedOnAppOrders: "Based on completed app orders only. Not total mall sales.",
  },
};

export default en;
