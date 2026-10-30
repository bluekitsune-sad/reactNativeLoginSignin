/**
 * Mock QR seat-session data (SCREEN_INVENTORY 29–33, PRD 5.9). Pure
 * presentation: `resolveMockScan` stands in for the backend scan endpoint
 * and the demo codes below stand in for the camera. No QR validation, no
 * session rules, no overlapping-session enforcement — those are blocked on
 * open decisions #9/#10. Seat states follow the PRD naming.
 */
export const SCAN_OUTCOMES = {
  AVAILABLE: "AVAILABLE",
  OCCUPIED: "OCCUPIED",
  UNAVAILABLE: "UNAVAILABLE",
  INVALID: "INVALID",
  STALE: "STALE",
};

/** Demo scan targets shown on the scan screen instead of a live camera. */
export const MOCK_SCAN_TARGETS = [
  {
    code: "LZ-QR-A1",
    label: "Table A1 · Window seating",
    outcome: SCAN_OUTCOMES.AVAILABLE,
    seat: {
      id: "lz-seat-a1",
      code: "LZ-QR-A1",
      label: "Table A1",
      zoneName: "Window seating",
      floor: "Level 2",
    },
  },
  {
    code: "LZ-QR-C7",
    label: "Table C7 · Atrium ring",
    outcome: SCAN_OUTCOMES.OCCUPIED,
    seat: {
      id: "lz-seat-c7",
      code: "LZ-QR-C7",
      label: "Table C7",
      zoneName: "Atrium ring",
      floor: "Level 2",
    },
  },
  {
    code: "LZ-QR-D2",
    label: "Table D2 · Family tables",
    outcome: SCAN_OUTCOMES.UNAVAILABLE,
    seat: {
      id: "lz-seat-d2",
      code: "LZ-QR-D2",
      label: "Table D2",
      zoneName: "Family tables",
      floor: "Level 2",
    },
  },
  {
    code: "LZ-QR-OLD9",
    label: "Old sticker on column 9",
    outcome: SCAN_OUTCOMES.STALE,
    seat: {
      id: "lz-seat-old9",
      code: "LZ-QR-OLD9",
      label: "Column 9 sticker",
      zoneName: "Atrium ring",
      floor: "Level 2",
    },
  },
  {
    code: "unrecognised",
    label: "Damaged sticker (no code)",
    outcome: SCAN_OUTCOMES.INVALID,
    seat: null,
  },
];

/** Preview session window shown on the active-session card (display only). */
const MOCK_SESSION_PREVIEW_MINUTES = 120;

/**
 * Stand-in for "server resolves the seat behind the QR": unknown codes
 * resolve to INVALID, known codes resolve to their mock outcome/seat.
 */
export const resolveMockScan = (code) => {
  const target = MOCK_SCAN_TARGETS.find((entry) => entry.code === code);
  if (!target) {
    return { outcome: SCAN_OUTCOMES.INVALID, seat: null };
  }
  return { outcome: target.outcome, seat: target.seat };
};

/** Build a display-only session object after the user confirms a seat. */
export const createMockSession = (seat, mallSlug) => {
  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + MOCK_SESSION_PREVIEW_MINUTES * 60 * 1000);
  return {
    id: `mock-session-${seat.id}`,
    seat,
    mallSlug,
    startedAt: startedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
};

/** Help/error copy per scan outcome (SCREEN_INVENTORY 33). */
export const SEAT_HELP_COPY = {
  [SCAN_OUTCOMES.INVALID]: {
    title: "QR code not recognised",
    message:
      "This code doesn't belong to a table at this mall. Look for the MallMate sticker on the table and try again.",
  },
  [SCAN_OUTCOMES.OCCUPIED]: {
    title: "Seat already occupied",
    message:
      "Another guest may have an active session at this table. Please pick a free table and scan its code.",
  },
  [SCAN_OUTCOMES.UNAVAILABLE]: {
    title: "Seat unavailable",
    message:
      "This table is closed for cleaning or maintenance right now. Please use another table.",
  },
  [SCAN_OUTCOMES.STALE]: {
    title: "Code out of date",
    message:
      "This sticker is from an older setup. Please report it to food-court staff and scan a current table code.",
  },
};

export default MOCK_SCAN_TARGETS;
