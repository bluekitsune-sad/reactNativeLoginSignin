import { getLocales } from "expo-localization";

import { en } from "./en";
import { ur } from "./ur";

/**
 * i18n (PRD section 10 — English and Urdu at launch): device-locale
 * detection via expo-localization plus a tiny `t()` lookup over the
 * shipped catalogs. `t` never throws: unknown keys fall back to English,
 * then to the key itself, so missing strings are visible but non-fatal.
 */
export const CATALOGS = {
  en,
  ur,
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

/**
 * Look up `key` (dot path, e.g. "common.retry") in the active catalog and
 * interpolate `{placeholders}` from `params`. Falls back to English, then
 * to the key itself. Pass `locale` to force a catalog (e.g. a future
 * in-app language setting); otherwise the device locale decides.
 */
export const t = (key, params, locale) => {
  const catalog = CATALOGS[locale] || CATALOGS[getLocale()] || CATALOGS[DEFAULT_LOCALE];
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

export { en, ur };
export default t;
