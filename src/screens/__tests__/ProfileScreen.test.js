/* eslint-env jest */
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import { StorageService } from "../../services";
import { UserProvider } from "../../utils/userData";
import ProfileScreen from "../profile/ProfileScreen";

const createNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
});

const renderScreen = (navigation) =>
  render(
    <UserProvider>
      <ProfileScreen navigation={navigation} />
    </UserProvider>,
  );

describe("ProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders translated rows and the guest fallback header", () => {
    const navigation = createNavigation();
    const { getByText } = renderScreen(navigation);

    expect(getByText("Guest shopper")).toBeTruthy();
    expect(getByText("guest@mallmate.app")).toBeTruthy();
    expect(getByText("Account")).toBeTruthy();
    expect(getByText("Orders")).toBeTruthy();
    expect(getByText("Order history and tracking")).toBeTruthy();
    expect(getByText("Favorites")).toBeTruthy();
    expect(getByText("Settings")).toBeTruthy();
    expect(getByText("Help")).toBeTruthy();
    expect(getByText("Privacy")).toBeTruthy();
  });

  it("navigates to routed destinations", () => {
    const navigation = createNavigation();
    const { getByText } = renderScreen(navigation);

    fireEvent.press(getByText("Orders"));
    expect(navigation.navigate).toHaveBeenCalledWith("OrderHistory");

    fireEvent.press(getByText("Settings"));
    expect(navigation.navigate).toHaveBeenCalledWith("Settings");
  });

  it("opens placeholder sections with translated title and message", () => {
    const navigation = createNavigation();
    const { getByText } = renderScreen(navigation);

    fireEvent.press(getByText("Help"));
    expect(navigation.navigate).toHaveBeenCalledWith("ProfilePlaceholder", {
      title: "Help",
      message: "Support articles and contact options will appear here.",
    });

    fireEvent.press(getByText("Privacy"));
    expect(navigation.navigate).toHaveBeenCalledWith("ProfilePlaceholder", {
      title: "Privacy",
      message: "Privacy options and account deletion controls will appear here.",
    });
  });

  it("clears the stored user and resets navigation to Signin on sign out", () => {
    const removeUserSpy = jest.spyOn(StorageService, "removeUser");
    const navigation = createNavigation();
    const { getByText } = renderScreen(navigation);

    fireEvent.press(getByText("Sign out"));

    expect(removeUserSpy).toHaveBeenCalledTimes(1);
    expect(navigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: "Signin" }],
    });

    removeUserSpy.mockRestore();
  });
});
