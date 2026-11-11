/* eslint-env jest */
import { render, screen } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

import { EmptyState } from "..";

describe("mallmate EmptyState", () => {
  it("renders its icon, title and message", () => {
    render(
      <EmptyState
        icon={<Text testID="empty-icon">∅</Text>}
        title="No favorites yet"
        message="Tap the heart on a merchant to save it."
      />,
    );

    expect(screen.getByTestId("empty-icon")).toBeTruthy();
    expect(screen.getByText("No favorites yet")).toBeTruthy();
    expect(screen.getByText("Tap the heart on a merchant to save it.")).toBeTruthy();
  });

  it("omits anything that was not provided", () => {
    const { toJSON } = render(<EmptyState />);

    expect(screen.queryByText(/.+/)).toBeNull();
    expect(toJSON()).toBeTruthy();
  });

  it("renders only the title when no message is given", () => {
    render(<EmptyState title="Nothing here" />);

    expect(screen.getByText("Nothing here")).toBeTruthy();
    expect(screen.queryByTestId("empty-icon")).toBeNull();
  });
});
