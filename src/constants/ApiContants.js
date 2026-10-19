import Constants from "expo-constants";

const DEFAULT_BACKEND_BASE_URL = "http://localhost:3001";

const stripTrailingSlash = (url) => url.replace(/\/+$/, "");

const resolveBackendBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  if (envUrl) {
    return stripTrailingSlash(envUrl);
  }
  const extraUrl = Constants.expoConfig?.extra?.backendUrl ?? Constants.manifest?.extra?.backendUrl;
  if (extraUrl) {
    return stripTrailingSlash(extraUrl);
  }
  return DEFAULT_BACKEND_BASE_URL;
};

const BACKEND_BASE_URL = resolveBackendBaseUrl();

const STATIC_IMAGE = {
  BASE_URL: `${BACKEND_BASE_URL}/images`,
  TYPE: { POSTER: "poster", LOGO: "logo", GALLERY: "gallery" },
  SIZE: { SQUARE: "square", LANDSCAPE: "landscape", PORTRAIT: "portrait" },
  QUALITY: { SD: "sd", HD: "hd" },
};

const BACKEND_API = {
  BASE_API_URL: `${BACKEND_BASE_URL}/api`,
  REGISTER: "/register",
  LOGIN: "/getUser/",
  USER_EXIST: "/user-exist",
  USER: "/getUser",
  ADDUSER: "/addUser",
  REFRESH_TOKEN: "/refresh-token",
  ALL_RESTAURANTS: "/getAllRestaurants",
  CART: "/cart",
  FOOD: "/getfood",
  BOOKMARK_LIST: "/bookmark",
};

export default { BACKEND_API, STATIC_IMAGE, BACKEND_BASE_URL };
