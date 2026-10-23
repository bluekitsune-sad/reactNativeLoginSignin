import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "user";
const SELECTED_MALL_KEY = "selectedMallSlug";
const FAVORITE_IDS_KEY = "favoriteMerchantIds";

const setUser = (userData) => {
  return AsyncStorage.setItem(USER_KEY, JSON.stringify(userData ?? null));
};

const getUser = async () => {
  const storedUser = await AsyncStorage.getItem(USER_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
};

const removeUser = () => {
  return AsyncStorage.removeItem(USER_KEY);
};

const setSelectedMallSlug = (slug) => {
  return AsyncStorage.setItem(SELECTED_MALL_KEY, slug);
};

const getSelectedMallSlug = () => {
  return AsyncStorage.getItem(SELECTED_MALL_KEY);
};

const removeSelectedMallSlug = () => {
  return AsyncStorage.removeItem(SELECTED_MALL_KEY);
};

const getFavoriteIds = async () => {
  const stored = await AsyncStorage.getItem(FAVORITE_IDS_KEY);
  if (!stored) {
    return [];
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
};

const setFavoriteIds = (ids) => {
  return AsyncStorage.setItem(FAVORITE_IDS_KEY, JSON.stringify(ids ?? []));
};

export default {
  setUser,
  getUser,
  removeUser,
  setSelectedMallSlug,
  getSelectedMallSlug,
  removeSelectedMallSlug,
  getFavoriteIds,
  setFavoriteIds,
};
