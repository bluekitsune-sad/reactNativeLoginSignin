import { getLocales } from "expo-localization";

import { en } from "./en";

/**
 * i18n groundwork (PRD section 10): device-locale detection via
 * expo-localization plus a tiny `t()` lookup over the English catalog.
 * Only English ships for now — full Urdu translation (and RTL force-flip)
 * is a later decision. `t` never throws: unknown keys return the key so
 * missing strings are visible but non-fatal.
 */
const CATALOGS = {
  en,
};

const DEFAULT_LOCALE = "en";

/** Device locale normalized to a catalog key (e.g. "en-US" → "en"). */
export const getLocale = () => {
  try {
    const tag = getLocales()[0]?.languageCode || DEFAULT_LOCALE;
    return CATALOGS[tag] ? tag : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
};

/** True when the device locale reads right-to-left ( Urdu, Arabic… ). */
export const isRTL = () => {
  try {
    const tag = getLocales()[0]?.languageCode || "";
    return ["ur", "ar", "he", "fa"].includes(tag);
  } catch {
    return false;
  }
};

/**
 * Look up `key` (dot path, e.g. "common.retry") in the active catalog and
 * interpolate `{placeholders}` from `params`. Falls back to English, then
 * to the key itself.
 */
export const t = (key, params) => {
  const catalog = CATALOGS[getLocale()] || CATALOGS[DEFAULT_LOCALE];
  const path = String(key).split(".");
  let value = catalog;
  for (const segment of path) {
    value = value?.[segment];
    if (value == null) {
      break;
    }
  }
  if (typeof value !== "string") {
    const fallback = path.reduce((acc, segment) => acc?.[segment], CATALOGS[DEFAULT_LOCALE]);
    value = typeof fallback === "string" ? fallback : key;
  }
  if (!params) {
    return value;
  }
  return value.replace(/\{(\w+)\}/g, (match, name) =>
    params[name] != null ? String(params[name]) : match,
  );
};

export { en };
export default t;
