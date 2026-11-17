/* eslint-env jest */
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { StyleSheet } from "react-native";

import { FlagItem } from "..";

const country = { code: "PK", name: "Pakistan", dial_code: "+92", flag: "🇵🇰" };

const styleOf = (element) => StyleSheet.flatten(element.props.style);

describe("FlagItem country row", () => {
  it("exposes a labelled button to assistive tech", () => {
    render(<FlagItem {...country} onPress={jest.fn()} />);

    const row = screen.getByLabelText("Pakistan +92");
    expect(row.props.accessibilityRole).toBe("button");
  });

  it("keeps a 44px minimum touch target", () => {
    render(<FlagItem {...country} onPress={jest.fn()} />);

    expect(styleOf(screen.getByLabelText("Pakistan +92")).minHeight).toBeGreaterThanOrEqual(44);
  });

  it("renders the flag, name and dial code", () => {
    render(<FlagItem {...country} onPress={jest.fn()} />);

    expect(screen.getByText("🇵🇰")).toBeTruthy();
    expect(screen.getByText("Pakistan")).toBeTruthy();
    expect(screen.getByText("+92")).toBeTruthy();
  });

  it("calls onPress with the country payload minus the emoji flag", () => {
    const onPress = jest.fn();
    render(<FlagItem {...country} onPress={onPress} />);

    fireEvent.press(screen.getByLabelText("Pakistan +92"));

    expect(onPress).toHaveBeenCalledWith({ code: "PK", name: "Pakistan", dial_code: "+92" });
  });
});
