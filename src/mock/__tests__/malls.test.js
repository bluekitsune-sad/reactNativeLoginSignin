/* eslint-env jest */
import { CAPABILITY_STATUS } from "../../constants";
import { MALLS } from "../malls";

describe("MALLS", () => {
  it("exposes at least two malls with unique slugs and ids", () => {
    expect(MALLS.length).toBeGreaterThanOrEqual(2);
    const slugs = MALLS.map((mall) => mall.slug);
    const ids = MALLS.map((mall) => mall.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives each mall a capability map that differs from the others", () => {
    // The multi-mall switching flow depends on this: selecting another mall
    // must visibly refresh mall-scoped capability-gated screens.
    const [first, second] = MALLS;
    expect(first.capabilities).not.toEqual(second.capabilities);
  });

  it("declares every known capability with a valid status on each mall", () => {
    const validStatuses = Object.values(CAPABILITY_STATUS);
    const capabilityKeys = [
      "food_court",
      "restaurant_discovery",
      "retail_discovery",
      "online_ordering",
      "online_payment",
      "loyalty",
      "indoor_navigation",
      "live_parking",
      "events",
      "seat_sessions",
      "reservations",
      "digital_coupons",
    ];
    for (const mall of MALLS) {
      for (const key of capabilityKeys) {
        expect(validStatuses).toContain(mall.capabilities[key]);
      }
    }
  });

  it("keeps branding blocked (logoUrl null) and opening hours populated", () => {
    for (const mall of MALLS) {
      expect(mall.logoUrl).toBeNull();
      expect(mall.currency).toBe("PKR");
      expect(mall.openingHours.days.length).toBe(7);
      for (const day of mall.openingHours.days) {
        expect(day.opensAt).toMatch(/^\d{2}:\d{2}$/);
        expect(day.closesAt).toMatch(/^\d{2}:\d{2}$/);
      }
    }
  });
});
