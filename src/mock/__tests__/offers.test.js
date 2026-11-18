/* eslint-env jest */
// getActiveOffersForMerchant is exported from offers.js for intra-folder
// consumers; the mock barrel intentionally does not re-export it.
import {
  getActiveOffersForMerchant,
  getOfferById,
  getOfferHeadline,
  getOfferValidity,
} from "../offers";

describe("getOfferById", () => {
  it("resolves an active offer by id", () => {
    const offer = getOfferById("lucky-discount-1");
    expect(offer).toMatchObject({
      type: "PERCENTAGE",
      value: 20,
      merchantId: "lucky-m-1",
    });
  });

  it("resolves null for an expired offer", () => {
    expect(getOfferById("lucky-discount-expired")).toBeNull();
  });

  it("resolves null for an unknown id", () => {
    expect(getOfferById("nope")).toBeNull();
    expect(getOfferById(undefined)).toBeNull();
  });
});

describe("getOfferHeadline", () => {
  it("formats a percentage discount", () => {
    expect(getOfferHeadline({ type: "PERCENTAGE", value: 20 })).toBe("20% off");
  });

  it("formats a fixed-amount discount", () => {
    expect(getOfferHeadline({ type: "FIXED_AMOUNT", value: 100 })).toBe("PKR 100 off");
  });

  it("formats BOGO without a value", () => {
    expect(getOfferHeadline({ type: "BOGO", value: null })).toBe("Buy 1 get 1");
  });

  it("falls back to the title for an unknown type", () => {
    expect(getOfferHeadline({ type: "MYSTERY", title: "Mystery deal" })).toBe("Mystery deal");
  });
});

describe("getOfferValidity", () => {
  it("joins both dates when present", () => {
    expect(
      getOfferValidity({ validFrom: "2026-01-01T00:00:00Z", endsAt: "2026-02-01T00:00:00Z" }),
    ).toMatch(/ – /);
  });

  it("formats an end-only offer as Until …", () => {
    expect(getOfferValidity({ endsAt: "2026-02-01T00:00:00Z" })).toMatch(/^Until /);
  });

  it("formats a start-only offer as From …", () => {
    expect(getOfferValidity({ validFrom: "2026-01-01T00:00:00Z" })).toMatch(/^From /);
  });

  it("returns null when neither date parses", () => {
    expect(getOfferValidity({})).toBeNull();
    expect(getOfferValidity({ validFrom: "not-a-date", endsAt: "also-not" })).toBeNull();
  });
});

describe("getActiveOffersForMerchant", () => {
  it("returns light summaries for one merchant's active offers", () => {
    expect(getActiveOffersForMerchant("lucky-m-1")).toEqual([
      { id: "lucky-discount-1", label: "20% OFF", title: "20% off lunch combos" },
    ]);
  });

  it("excludes expired offers", () => {
    const ids = getActiveOffersForMerchant("lucky-m-3").map((offer) => offer.id);
    expect(ids).toContain("lucky-discount-2");
    expect(ids).not.toContain("lucky-discount-expired");
  });

  it("returns an empty list for a merchant with no offers", () => {
    expect(getActiveOffersForMerchant("lucky-m-99")).toEqual([]);
  });
});
