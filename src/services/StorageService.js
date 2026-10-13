import AsyncStorage from "@react-native-async-storage/async-storage";

const setFirstTimeUse = () => {
  return AsyncStorage.setItem("isFirstTimeUse", "true");
};

const getFirstTimeUse = () => {
  return AsyncStorage.getItem("isFirstTimeUse");
};

const setUser = (userData) => {
  return AsyncStorage.setItem("user", JSON.stringify(userData));
};

const getUser = () => {
  return AsyncStorage.getItem("user").then((data) =>
    data ? JSON.parse(data) : null
  );
};

export default { setFirstTimeUse, getFirstTimeUse, setUser, getUser };
