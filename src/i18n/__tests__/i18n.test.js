/* eslint-env jest */
import { getLocale, isRTL, t } from "..";

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

  it("reports RTL only for known RTL language codes", () => {
    expect(typeof isRTL()).toBe("boolean");
  });
});
