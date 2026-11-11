/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import { StyleSheet } from "react-native";

import { Button } from "..";
import { MallMateTheme } from "../../constants";

// `fireEvent.press` only invokes onPress; the pressed style comes from
// Pressable's responder state machine, so drive it with synthetic responder
// events (the measure stubs satisfy Pressability's region measurement).
const responderEvent = (element) => {
  const target = {
    ...element,
    measure: (callback) => callback(0, 0, 48, 48, 0, 0),
    measureInLayout: (callback) => callback(0, 0, 48, 48, 0, 0),
    measureLayout: jest.fn(),
  };
  return { persist: jest.fn(), currentTarget: target, target, nativeEvent: {} };
};

describe("mallmate Button", () => {
  it("renders its label as an accessible button and fires onPress", () => {
    const onPress = jest.fn();
    render(<Button label="Continue" onPress={onPress} />);

    fireEvent.press(screen.getByText("Continue"));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button").props.accessibilityState).toMatchObject({
      disabled: false,
      busy: false,
    });
  });

  it("keeps the 44–48px touch target from the theme", () => {
    render(<Button label="Continue" onPress={jest.fn()} />);

    expect(StyleSheet.flatten(screen.getByRole("button").props.style).minHeight).toBe(
      MallMateTheme.touchTarget.ideal,
    );
  });

  it("dims while pressed and restores once the press ends", async () => {
    render(<Button label="Press" onPress={jest.fn()} />);
    const styleNow = () => StyleSheet.flatten(screen.getByRole("button").props.style);
    expect(styleNow().opacity).toBeUndefined();

    fireEvent(
      screen.getByRole("button"),
      "responderGrant",
      responderEvent(screen.getByRole("button")),
    );
    expect(styleNow().opacity).toBe(0.85);

    fireEvent(
      screen.getByRole("button"),
      "responderRelease",
      responderEvent(screen.getByRole("button")),
    );
    // Pressability honours a minimum press duration before onPressOut.
    await waitFor(() => expect(styleNow().opacity).toBeUndefined());
  });

  it("blocks presses while disabled", () => {
    const onPress = jest.fn();
    render(<Button label="Delete" onPress={onPress} disabled />);

    fireEvent.press(screen.getByText("Delete"));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole("button").props.accessibilityState).toMatchObject({
      disabled: true,
      busy: false,
    });
  });

  it("swaps the label for a labelled spinner and blocks presses while loading", () => {
    const onPress = jest.fn();
    render(<Button label="Save" onPress={onPress} loading />);

    expect(screen.queryByText("Save")).toBeNull();
    expect(screen.getByLabelText("Loading…")).toBeTruthy();
    expect(screen.getByRole("button").props.accessibilityState).toMatchObject({
      disabled: true,
      busy: true,
    });

    fireEvent.press(screen.getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("falls back to the primary styling for an unknown variant", () => {
    render(<Button label="Go" onPress={jest.fn()} variant="nope" />);

    const style = StyleSheet.flatten(screen.getByRole("button").props.style);
    expect(style.backgroundColor).toBe(MallMateTheme.color.primary);
  });
});
