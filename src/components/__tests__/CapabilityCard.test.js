/* eslint-env jest */
import { render, screen } from "@testing-library/react-native";
import React from "react";
import { StyleSheet } from "react-native";

import { CapabilityCard } from "..";
import { MallMateTheme } from "../../constants";

const styleOf = (element) => StyleSheet.flatten(element.props.style);

describe("mallmate CapabilityCard", () => {
  it("renders the capability title and description", () => {
    render(
      <CapabilityCard
        title="Food court"
        description="Seating, zones and scan-to-sit"
        icon="restaurant-outline"
      />,
    );

    expect(screen.getByText("Food court")).toBeTruthy();
    expect(screen.getByText("Seating, zones and scan-to-sit")).toBeTruthy();
    expect(screen.queryByText("Limited")).toBeNull();
  });

  it("shows the warning-toned Limited chip when degraded", () => {
    render(<CapabilityCard title="Indoor maps" icon="map-outline" degraded />);

    expect(screen.getByText("Limited")).toBeTruthy();
    expect(styleOf(screen.getByText("Limited")).color).toBe(MallMateTheme.color.highlight);
    expect(screen.getByLabelText("Limited")).toBeTruthy();
  });

  it("renders a non-pressable card when no description or action is given", () => {
    render(<CapabilityCard title="Loyalty" icon="star-outline" />);

    expect(screen.getByText("Loyalty")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
