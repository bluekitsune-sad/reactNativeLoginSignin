import React, { useState } from "react";

const UserManagement = () => {
  const [userData, setUserData] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const updateUser = (userInfo) => {
    setUserData(userInfo);
    setLoggedIn(true);
    console.log("update made: ", userInfo);
  };

  const getUser = () => {
    if (!loggedIn) {
      return loggedIn;
    } else {
      return userData;
    }
  };

  const resetUser = () => {
    setUserData("");
    setLoggedIn(false);
  };

  return {
    updateUser,
    getUser,
    resetUser,
  };
};

export default UserManagement;
