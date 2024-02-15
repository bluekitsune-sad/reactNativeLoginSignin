import AsyncSorage from "@react-native-async-storage/async-storage";

const setFirstTimeUse = () => {
  return AsyncSorage.setItem("isFirstTimeUse", "true");
};

const getFirstTimeUse = () => {
  return AsyncSorage.getItem("isFirstTimeUse");
};

const setUser = (userData) => {
  return AsyncSorage.setItem("user", userData);
};

const getUser = () => {
  return AsyncSorage.getItem("token");
};

export default { setFirstTimeUse, getFirstTimeUse, setUser, getUser };
