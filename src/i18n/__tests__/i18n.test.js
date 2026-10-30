/* eslint-env jest */
import { getLocale, t, CATALOGS, en, ur } from "..";

describe("i18n t() helper", () => {
  it("resolves dot-path keys from the English catalog", () => {
    expect(t("common.retry")).toBe("Retry");
    expect(t("orders.timeline")).toBe("Status timeline");
  });

  it("interpolates {placeholders} from params", () => {
    expect(t("search.placeholder", { mall: "LuckyOne Mall" })).toBe("Search LuckyOne Mall");
  });

  it("leaves unknown placeholders untouched", () => {
    expect(t("search.placeholder")).toBe("Search {mall}");
  });

  it("returns the key itself for unknown keys (never throws)", () => {
    expect(t("nope.nope.nope")).toBe("nope.nope.nope");
  });

  it("normalizes the device locale to a supported catalog key", () => {
    expect(["en"]).toContain(getLocale());
  });
});

describe("Urdu catalog", () => {
  const leafKeys = (node, prefix = "") =>
    Object.entries(node).flatMap(([key, value]) =>
      typeof value === "string" ? [`${prefix}${key}`] : leafKeys(value, `${prefix}${key}.`),
    );

  const placeholderNames = (value) =>
    [...String(value).matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();

  it("is registered as a supported locale alongside English", () => {
    expect(Object.keys(CATALOGS)).toEqual(expect.arrayContaining(["en", "ur"]));
  });

  it("mirrors every English key (and vice versa)", () => {
    expect(leafKeys(ur).sort()).toEqual(leafKeys(en).sort());
  });

  it("has a non-empty Urdu string for every key", () => {
    for (const key of leafKeys(ur)) {
      const value = key.split(".").reduce((acc, segment) => acc?.[segment], ur);
      expect(typeof value).toBe("string");
      expect(value.trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps the same {placeholders} as the English source", () => {
    for (const key of leafKeys(en)) {
      const enValue = key.split(".").reduce((acc, segment) => acc?.[segment], en);
      const urValue = key.split(".").reduce((acc, segment) => acc?.[segment], ur);
      expect(placeholderNames(urValue)).toEqual(placeholderNames(enValue));
    }
  });

  it("serves Urdu strings when a locale override is passed to t()", () => {
    expect(t("common.retry", undefined, "ur")).toBe(ur.common.retry);
    expect(t("search.placeholder", { mall: "LuckyOne" }, "ur")).toBe("LuckyOne میں تلاش کریں");
  });

  it("falls back to English for keys missing from an overridden locale", () => {
    expect(t("common.retry", undefined, "xx")).toBe("Retry");
  });
});
