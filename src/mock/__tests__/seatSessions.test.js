/* eslint-env jest */
import {
  MOCK_SCAN_TARGETS,
  SCAN_OUTCOMES,
  SEAT_HELP_COPY,
  createMockSession,
  resolveMockScan,
} from "../seatSessions";

describe("resolveMockScan", () => {
  it("resolves each demo code to its mocked outcome and seat", () => {
    expect(resolveMockScan("LZ-QR-A1")).toEqual({
      outcome: SCAN_OUTCOMES.AVAILABLE,
      seat: expect.objectContaining({ id: "lz-seat-a1", code: "LZ-QR-A1" }),
    });
    expect(resolveMockScan("LZ-QR-C7").outcome).toBe(SCAN_OUTCOMES.OCCUPIED);
    expect(resolveMockScan("LZ-QR-D2").outcome).toBe(SCAN_OUTCOMES.UNAVAILABLE);
    expect(resolveMockScan("LZ-QR-OLD9").outcome).toBe(SCAN_OUTCOMES.STALE);
    expect(resolveMockScan("unrecognised").outcome).toBe(SCAN_OUTCOMES.INVALID);
  });

  it("resolves INVALID with no seat for an unknown code", () => {
    expect(resolveMockScan("totally-unknown")).toEqual({
      outcome: SCAN_OUTCOMES.INVALID,
      seat: null,
    });
    expect(resolveMockScan(undefined)).toEqual({
      outcome: SCAN_OUTCOMES.INVALID,
      seat: null,
    });
  });
});

describe("MOCK_SCAN_TARGETS", () => {
  it("exposes unique demo codes", () => {
    const codes = MOCK_SCAN_TARGETS.map((target) => target.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes.length).toBeGreaterThan(0);
  });

  it("every target's outcome is a known scan outcome", () => {
    for (const target of MOCK_SCAN_TARGETS) {
      expect(Object.values(SCAN_OUTCOMES)).toContain(target.outcome);
      if (target.outcome === SCAN_OUTCOMES.INVALID) {
        expect(target.seat).toBeNull();
      } else {
        expect(target.seat).toMatchObject({ code: target.code });
      }
    }
  });
});

describe("createMockSession", () => {
  const seat = MOCK_SCAN_TARGETS[0].seat;

  it("builds a display-only session with a 2-hour preview window", () => {
    const session = createMockSession(seat, "luckyone");
    expect(session.id).toBe(`mock-session-${seat.id}`);
    expect(session.mallSlug).toBe("luckyone");
    expect(session.seat).toBe(seat);
    const started = Date.parse(session.startedAt);
    const expires = Date.parse(session.expiresAt);
    expect(expires - started).toBe(120 * 60 * 1000);
    expect(Number.isFinite(started)).toBe(true);
    expect(Number.isFinite(expires)).toBe(true);
  });
});

describe("SEAT_HELP_COPY", () => {
  it("has copy for every non-available scan outcome", () => {
    for (const outcome of [
      SCAN_OUTCOMES.INVALID,
      SCAN_OUTCOMES.OCCUPIED,
      SCAN_OUTCOMES.UNAVAILABLE,
      SCAN_OUTCOMES.STALE,
    ]) {
      expect(SEAT_HELP_COPY[outcome]).toMatchObject({
        title: expect.any(String),
        message: expect.any(String),
      });
      expect(SEAT_HELP_COPY[outcome].title.length).toBeGreaterThan(0);
      expect(SEAT_HELP_COPY[outcome].message.length).toBeGreaterThan(0);
    }
  });

  it("has no copy for AVAILABLE (no error screen for a good scan)", () => {
    expect(SEAT_HELP_COPY[SCAN_OUTCOMES.AVAILABLE]).toBeUndefined();
  });
});
