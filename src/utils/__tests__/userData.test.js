/* eslint-env jest */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import { Button, Text } from "react-native";

import { StorageService } from "../../services";
import useUserManagement, { UserProvider } from "../userData";

const Probe = () => {
  const { userData, updateUser, resetUser } = useUserManagement();
  return (
    <>
      <Text testID="user">{userData ? userData.username : "none"}</Text>
      <Button testID="update" title="update" onPress={() => updateUser({ username: "alice" })} />
      <Button testID="update-undefined" title="update undefined" onPress={() => updateUser()} />
      <Button testID="reset" title="reset" onPress={() => resetUser()} />
    </>
  );
};

const renderWithProvider = () =>
  render(
    <UserProvider>
      <Probe />
    </UserProvider>,
  );

describe("UserProvider", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it("starts with no user", () => {
    renderWithProvider();
    expect(screen.getByTestId("user").props.children).toBe("none");
  });

  it("updateUser sets userData and persists it via setUser", () => {
    const setUserSpy = jest.spyOn(StorageService, "setUser");
    renderWithProvider();

    fireEvent.press(screen.getByTestId("update"));

    expect(screen.getByTestId("user").props.children).toBe("alice");
    expect(setUserSpy).toHaveBeenCalledWith({ username: "alice" });
    setUserSpy.mockRestore();
  });

  it("updateUser persists the written user to AsyncStorage under the user key", async () => {
    renderWithProvider();

    fireEvent.press(screen.getByTestId("update"));

    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({ username: "alice" }),
      ),
    );
  });

  it("updateUser with no argument coerces state and persistence to null", async () => {
    const setUserSpy = jest.spyOn(StorageService, "setUser");
    renderWithProvider();

    fireEvent.press(screen.getByTestId("update"));
    fireEvent.press(screen.getByTestId("update-undefined"));

    expect(screen.getByTestId("user").props.children).toBe("none");
    expect(setUserSpy).toHaveBeenLastCalledWith(null);
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenLastCalledWith("user", "null"));
    setUserSpy.mockRestore();
  });

  it("resetUser clears state and calls removeUser", async () => {
    const removeUserSpy = jest.spyOn(StorageService, "removeUser");
    renderWithProvider();

    fireEvent.press(screen.getByTestId("update"));
    expect(screen.getByTestId("user").props.children).toBe("alice");

    fireEvent.press(screen.getByTestId("reset"));

    expect(screen.getByTestId("user").props.children).toBe("none");
    expect(removeUserSpy).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(AsyncStorage.removeItem).toHaveBeenCalledWith("user"));
    removeUserSpy.mockRestore();
  });

  it("throws when useUserManagement is used outside the provider", () => {
    const Orphan = () => {
      useUserManagement();
      return null;
    };
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow(/UserProvider/);
    spy.mockRestore();
  });
});
