import React, { createContext, useCallback, useContext, useState } from "react";

import { StorageService } from "../services";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const updateUser = useCallback((userInfo) => {
    setUserData(userInfo ?? null);
    StorageService.setUser(userInfo ?? null);
  }, []);

  const resetUser = useCallback(() => {
    setUserData(null);
    StorageService.removeUser();
  }, []);

  return (
    <UserContext.Provider value={{ userData, updateUser, resetUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserManagement = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserManagement must be used within a <UserProvider> (see src/navigators)");
  }
  return context;
};

export default useUserManagement;
