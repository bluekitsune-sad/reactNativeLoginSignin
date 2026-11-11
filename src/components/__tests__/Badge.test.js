/* eslint-env jest */
import { render, screen } from "@testing-library/react-native";
import React from "react";
import { StyleSheet } from "react-native";

import { Badge } from "..";
import { MallMateTheme } from "../../constants";

const styleOf = (element) => StyleSheet.flatten(element.props.style);

describe("mallmate Badge", () => {
  it("renders its label and exposes it to assistive tech", () => {
    render(<Badge label="Sponsored" />);

    expect(screen.getByText("Sponsored")).toBeTruthy();
    expect(screen.getByLabelText("Sponsored")).toBeTruthy();
  });

  it("maps the sponsored tone onto the background and label colours", () => {
    render(<Badge label="Sponsored" tone="sponsored" />);

    expect(styleOf(screen.getByLabelText("Sponsored")).backgroundColor).toBe(
      MallMateTheme.color.highlight,
    );
    expect(styleOf(screen.getByText("Sponsored")).color).toBe(MallMateTheme.color.background);
  });

  it("maps the featured tone onto the primary colour", () => {
    render(<Badge label="Featured" tone="featured" />);

    expect(styleOf(screen.getByLabelText("Featured")).backgroundColor).toBe(
      MallMateTheme.color.primary,
    );
  });

  it("defaults to the neutral tone", () => {
    render(<Badge label="New" />);

    expect(styleOf(screen.getByLabelText("New")).backgroundColor).toBe(
      MallMateTheme.color.surfaceElevated,
    );
    expect(styleOf(screen.getByText("New")).color).toBe(MallMateTheme.color.textSecondary);
  });

  it("falls back to the neutral tone for an unknown tone", () => {
    render(<Badge label="Odd" tone="sparkle" />);

    expect(styleOf(screen.getByLabelText("Odd")).backgroundColor).toBe(
      MallMateTheme.color.surfaceElevated,
    );
  });
});
