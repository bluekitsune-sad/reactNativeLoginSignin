/* eslint-env jest */
import { render, screen } from "@testing-library/react-native";
import React from "react";
import { StyleSheet } from "react-native";

import { StatusChip } from "..";
import { MallMateTheme } from "../../constants";

const styleOf = (element) => StyleSheet.flatten(element.props.style);

const TONES = [
  ["success", MallMateTheme.color.primary],
  ["warning", MallMateTheme.color.highlight],
  ["error", MallMateTheme.color.error],
  ["info", MallMateTheme.color.info],
  ["muted", MallMateTheme.color.textMuted],
];

describe("mallmate StatusChip", () => {
  it.each(TONES)("maps the %s tone onto the border and label colour", (tone, color) => {
    render(<StatusChip label="Open now" tone={tone} />);

    expect(styleOf(screen.getByLabelText("Open now")).borderColor).toBe(color);
    expect(styleOf(screen.getByText("Open now")).color).toBe(color);
  });

  it("exposes the label to assistive tech", () => {
    render(<StatusChip label="Sold out" tone="error" />);

    expect(screen.getByLabelText("Sold out")).toBeTruthy();
  });

  it("defaults to the muted tone", () => {
    render(<StatusChip label="Mock hours" />);

    expect(styleOf(screen.getByLabelText("Mock hours")).borderColor).toBe(
      MallMateTheme.color.textMuted,
    );
  });

  it("falls back to the muted tone for an unknown tone", () => {
    render(<StatusChip label="Odd tone" tone="sparkle" />);

    expect(styleOf(screen.getByLabelText("Odd tone")).borderColor).toBe(
      MallMateTheme.color.textMuted,
    );
  });
});
