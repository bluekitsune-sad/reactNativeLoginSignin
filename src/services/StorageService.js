import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "user";
const SELECTED_MALL_KEY = "selectedMallSlug";

const setFirstTimeUse = () => {
  return AsyncStorage.setItem("isFirstTimeUse", "true");
};

const getFirstTimeUse = () => {
  return AsyncStorage.getItem("isFirstTimeUse");
};

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

export default {
  setFirstTimeUse,
  getFirstTimeUse,
  setUser,
  getUser,
  removeUser,
  setSelectedMallSlug,
  getSelectedMallSlug,
  removeSelectedMallSlug,
};
