/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import { StyleSheet, Text } from "react-native";

import { ListRow } from "..";
import { MallMateTheme } from "../../constants";

// Pressable's pressed style comes from its responder state machine, so drive
// it with synthetic responder events (the measure stubs satisfy
// Pressability's region measurement) — same technique as Button.test.js.
const responderEvent = (element) => {
  const target = {
    ...element,
    measure: (callback) => callback(0, 0, 48, 48, 0, 0),
    measureInLayout: (callback) => callback(0, 0, 48, 48, 0, 0),
    measureLayout: jest.fn(),
  };
  return { persist: jest.fn(), currentTarget: target, target, nativeEvent: {} };
};

const styleOf = (element) => StyleSheet.flatten(element.props.style);

describe("mallmate ListRow", () => {
  it("renders its title and subtitle", () => {
    render(<ListRow title="Orders" subtitle="Track your orders" />);

    expect(screen.getByText("Orders")).toBeTruthy();
    expect(screen.getByText("Track your orders")).toBeTruthy();
  });

  it("is a labelled button that fires onPress when given one", () => {
    const onPress = jest.fn();
    render(<ListRow title="Orders" onPress={onPress} />);

    fireEvent.press(screen.getByLabelText("Orders"));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button").props.accessibilityLabel).toBe("Orders");
  });

  it("is not a button without onPress", () => {
    render(<ListRow title="Orders" />);

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("shows the chevron only when pressable and showChevron is on", () => {
    const { rerender } = render(<ListRow title="Orders" onPress={jest.fn()} />);
    expect(screen.UNSAFE_getByProps({ name: "chevron-forward" })).toBeTruthy();

    rerender(<ListRow title="Orders" onPress={jest.fn()} showChevron={false} />);
    expect(screen.UNSAFE_queryByProps({ name: "chevron-forward" })).toBeNull();

    rerender(<ListRow title="Orders" />);
    expect(screen.UNSAFE_queryByProps({ name: "chevron-forward" })).toBeNull();
  });

  it("renders leading and trailing slots", () => {
    render(
      <ListRow
        title="Orders"
        leading={<Text testID="lead">L</Text>}
        trailing={<Text testID="trail">T</Text>}
      />,
    );

    expect(screen.getByTestId("lead")).toBeTruthy();
    expect(screen.getByTestId("trail")).toBeTruthy();
  });

  it("applies titleColor to the title", () => {
    render(<ListRow title="Sign out" titleColor={MallMateTheme.color.error} />);

    expect(styleOf(screen.getByText("Sign out")).color).toBe(MallMateTheme.color.error);
  });

  it("dims while pressed and restores once the press ends", async () => {
    render(<ListRow title="Orders" onPress={jest.fn()} />);
    // ListRow's style fn returns `false` when unpressed; flatten() turns
    // that into undefined, so fall back to {} for the property access.
    const styleNow = () => StyleSheet.flatten(screen.getByRole("button").props.style) ?? {};
    expect(styleNow().opacity).toBeUndefined();

    fireEvent(
      screen.getByRole("button"),
      "responderGrant",
      responderEvent(screen.getByRole("button")),
    );
    expect(styleNow().opacity).toBe(0.8);

    fireEvent(
      screen.getByRole("button"),
      "responderRelease",
      responderEvent(screen.getByRole("button")),
    );
    // Pressability honours a minimum press duration before onPressOut.
    await waitFor(() => expect(styleNow().opacity).toBeUndefined());
  });
});
