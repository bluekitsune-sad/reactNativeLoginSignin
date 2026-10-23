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

const BACKEND_API = {
  BASE_API_URL: `${BACKEND_BASE_URL}/api`,
  REGISTER: "/register",
  LOGIN: "/getUser/",
  USER_EXIST: "/user-exist",
  REFRESH_TOKEN: "/refresh-token",
};

export default { BACKEND_API, BACKEND_BASE_URL };
