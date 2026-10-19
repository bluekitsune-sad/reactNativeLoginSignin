/* eslint-env jest */
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import { AuthenicationService } from "../../services";
import { UserProvider } from "../../utils/userData";
import SigninScreen from "../SigninScreen";

jest.mock("../../services", () => ({
  AuthenicationService: { login: jest.fn() },
  StorageService: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}));

const createNavigation = () => ({
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
});

const renderScreen = (navigation) =>
  render(
    <UserProvider>
      <SigninScreen navigation={navigation} />
    </UserProvider>,
  );

describe("SigninScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the sign-in form without social sign-in buttons", () => {
    const navigation = createNavigation();
    const { getAllByText, getByLabelText, queryByText } = renderScreen(navigation);

    expect(getAllByText("Sign In")).toHaveLength(2); // header + button
    expect(getByLabelText("Username")).toBeTruthy();
    expect(getByLabelText("Password")).toBeTruthy();
    expect(queryByText("OR")).toBeNull();
    expect(queryByText("Connect with Facebook")).toBeNull();
    expect(queryByText("Connect with Google")).toBeNull();
  });

  it("shows the service error message when login fails", async () => {
    const navigation = createNavigation();
    AuthenicationService.login.mockResolvedValue({
      status: false,
      message: "Please fill up all fields",
    });
    const { findByText, getByLabelText, getByRole } = renderScreen(navigation);

    fireEvent.changeText(getByLabelText("Username"), "alice");
    fireEvent.changeText(getByLabelText("Password"), "wrong");
    fireEvent.press(getByRole("button", { name: "Sign In" }));

    expect(await findByText("Please fill up all fields")).toBeTruthy();
    expect(AuthenicationService.login).toHaveBeenCalledWith({
      username: "alice",
      password: "wrong",
    });
    expect(navigation.replace).not.toHaveBeenCalled();
  });

  it("submits the credentials and replaces into Main on success", async () => {
    const navigation = createNavigation();
    AuthenicationService.login.mockResolvedValue({
      status: true,
      message: "ok",
      data: { username: "alice" },
    });
    const { getByLabelText, getByRole } = renderScreen(navigation);

    fireEvent.changeText(getByLabelText("Username"), "alice");
    fireEvent.changeText(getByLabelText("Password"), "secret");
    fireEvent.press(getByRole("button", { name: "Sign In" }));

    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith("Main"));
    expect(AuthenicationService.login).toHaveBeenCalledWith({
      username: "alice",
      password: "secret",
    });
  });

  it("navigates to the forgot-password and signup screens", () => {
    const navigation = createNavigation();
    const { getByText } = renderScreen(navigation);

    fireEvent.press(getByText("Forgot Password"));
    expect(navigation.navigate).toHaveBeenCalledWith("ForgotPassword");

    fireEvent.press(getByText("Sign Up"));
    expect(navigation.navigate).toHaveBeenCalledWith("Signup");
  });

  it("toggles the password visibility affordance", () => {
    const navigation = createNavigation();
    const { getByLabelText } = renderScreen(navigation);

    expect(getByLabelText("Show password")).toBeTruthy();
    fireEvent.press(getByLabelText("Show password"));
    expect(getByLabelText("Hide password")).toBeTruthy();
  });
});
