/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import { StyleSheet, Text } from "react-native";

import { Card } from "..";
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

describe("mallmate Card", () => {
  it("renders a plain view when there is no onPress", () => {
    render(
      <Card>
        <Text>Content</Text>
      </Card>,
    );

    expect(screen.getByText("Content")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders a button and fires onPress when given one", () => {
    const onPress = jest.fn();
    render(
      <Card onPress={onPress}>
        <Text>Content</Text>
      </Card>,
    );

    fireEvent.press(screen.getByRole("button"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("passes accessibilityState through (e.g. selected)", () => {
    render(
      <Card onPress={jest.fn()} accessibilityState={{ selected: true }}>
        <Text>Content</Text>
      </Card>,
    );

    expect(screen.getByRole("button").props.accessibilityState).toMatchObject({ selected: true });
  });

  it("dims an unavailable plain card", () => {
    const { toJSON } = render(
      <Card unavailable>
        <Text>Content</Text>
      </Card>,
    );

    expect(StyleSheet.flatten(toJSON().props.style).opacity).toBe(0.6);
  });

  it("dims an unavailable pressable card", () => {
    render(
      <Card onPress={jest.fn()} unavailable>
        <Text>Content</Text>
      </Card>,
    );

    expect(styleOf(screen.getByRole("button")).opacity).toBe(0.6);
  });

  it("elevates while pressed and restores once the press ends", async () => {
    render(
      <Card onPress={jest.fn()}>
        <Text>Content</Text>
      </Card>,
    );
    const styleNow = () => styleOf(screen.getByRole("button"));
    expect(styleNow().backgroundColor).toBe(MallMateTheme.color.surface);

    fireEvent(
      screen.getByRole("button"),
      "responderGrant",
      responderEvent(screen.getByRole("button")),
    );
    expect(styleNow().backgroundColor).toBe(MallMateTheme.color.surfaceElevated);

    fireEvent(
      screen.getByRole("button"),
      "responderRelease",
      responderEvent(screen.getByRole("button")),
    );
    // Pressability honours a minimum press duration before onPressOut.
    await waitFor(() => expect(styleNow().backgroundColor).toBe(MallMateTheme.color.surface));
  });
});
