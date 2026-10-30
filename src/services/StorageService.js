import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "user";
const SELECTED_MALL_KEY = "selectedMallSlug";
const FAVORITE_IDS_KEY = "favoriteMerchantIds";
const REMEMBERED_USERNAME_KEY = "rememberedUsername";

const setUser = (userData) => {
  return AsyncStorage.setItem(USER_KEY, JSON.stringify(userData ?? null)).catch(() => {});
};

const getUser = async () => {
  try {
    const storedUser = await AsyncStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const removeUser = () => {
  return AsyncStorage.removeItem(USER_KEY).catch(() => {});
};

const setSelectedMallSlug = (slug) => {
  return AsyncStorage.setItem(SELECTED_MALL_KEY, slug).catch(() => {});
};

const getSelectedMallSlug = async () => {
  try {
    return await AsyncStorage.getItem(SELECTED_MALL_KEY);
  } catch {
    return null;
  }
};

const getFavoriteIds = async () => {
  try {
    const stored = await AsyncStorage.getItem(FAVORITE_IDS_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
};

const setFavoriteIds = (ids) => {
  return AsyncStorage.setItem(FAVORITE_IDS_KEY, JSON.stringify(ids ?? [])).catch(() => {});
};

const setRememberedUsername = (username) => {
  return AsyncStorage.setItem(REMEMBERED_USERNAME_KEY, username).catch(() => {});
};

const getRememberedUsername = async () => {
  try {
    return await AsyncStorage.getItem(REMEMBERED_USERNAME_KEY);
  } catch {
    return null;
  }
};

const removeRememberedUsername = () => {
  return AsyncStorage.removeItem(REMEMBERED_USERNAME_KEY).catch(() => {});
};

export default {
  setUser,
  getUser,
  removeUser,
  setSelectedMallSlug,
  getSelectedMallSlug,
  getFavoriteIds,
  setFavoriteIds,
  setRememberedUsername,
  getRememberedUsername,
  removeRememberedUsername,
};
