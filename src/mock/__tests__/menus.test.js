/* eslint-env jest */
import { formatPrice, getMenuForMerchant, getMenuItemById } from "../menus";

describe("formatPrice", () => {
  it("groups thousands with commas", () => {
    expect(formatPrice(2650)).toBe("PKR 2,650");
    expect(formatPrice(1234567)).toBe("PKR 1,234,567");
  });

  it("leaves small amounts ungrouped", () => {
    expect(formatPrice(0)).toBe("PKR 0");
    expect(formatPrice(450)).toBe("PKR 450");
  });

  it("truncates fractional amounts", () => {
    expect(formatPrice(890.9)).toBe("PKR 890");
  });

  it("clamps negatives to zero", () => {
    expect(formatPrice(-5)).toBe("PKR 0");
  });

  it("treats non-finite input as zero", () => {
    expect(formatPrice(NaN)).toBe("PKR 0");
    expect(formatPrice(Infinity)).toBe("PKR 0");
    expect(formatPrice(undefined)).toBe("PKR 0");
    expect(formatPrice("abc")).toBe("PKR 0");
  });
});

describe("getMenuForMerchant", () => {
  it("returns the menu with sections for a known merchant", () => {
    const menu = getMenuForMerchant("lucky-m-1");
    expect(menu.sections.length).toBeGreaterThan(0);
    expect(menu.sections[0].items.length).toBeGreaterThan(0);
  });

  it("returns null for a merchant without a mock menu", () => {
    expect(getMenuForMerchant("lucky-m-99")).toBeNull();
    expect(getMenuForMerchant(undefined)).toBeNull();
  });
});

describe("getMenuItemById", () => {
  it("returns the item together with its section", () => {
    const result = getMenuItemById("lucky-m-1", "lucky-m-1-i4");
    expect(result.item).toMatchObject({ id: "lucky-m-1-i4", name: "Sweet lassi", price: 180 });
    expect(result.section.title).toBe("Beverages");
  });

  it("finds items beyond the first section", () => {
    const menu = getMenuForMerchant("lucky-m-1");
    const lastSection = menu.sections[menu.sections.length - 1];
    const lastItem = lastSection.items[lastSection.items.length - 1];
    const result = getMenuItemById("lucky-m-1", lastItem.id);
    expect(result.item.id).toBe(lastItem.id);
    expect(result.section.id).toBe(lastSection.id);
  });

  it("returns null for an unknown item or merchant", () => {
    expect(getMenuItemById("lucky-m-1", "nope")).toBeNull();
    expect(getMenuItemById("nope", "lucky-m-1-i1")).toBeNull();
    expect(getMenuItemById(undefined, undefined)).toBeNull();
  });
});
