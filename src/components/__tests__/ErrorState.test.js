/* eslint-env jest */
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import { ErrorState } from "..";
import { t } from "../../i18n";

describe("mallmate ErrorState", () => {
  it("defaults its title and retry label through t()", () => {
    render(<ErrorState onRetry={jest.fn()} />);

    expect(screen.getByText(t("common.somethingWentWrong"))).toBeTruthy();
    expect(screen.getByText(t("common.retry"))).toBeTruthy();
  });

  it("fires onRetry from the retry button", () => {
    const onRetry = jest.fn();
    render(<ErrorState onRetry={onRetry} />);

    fireEvent.press(screen.getByRole("button"));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders no retry button without onRetry", () => {
    render(<ErrorState />);

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("shows an optional message and honours custom title/retry labels", () => {
    render(
      <ErrorState
        title="Could not load offers"
        message="Check your connection and try again."
        retryLabel="Try again"
        onRetry={jest.fn()}
      />,
    );

    expect(screen.getByText("Could not load offers")).toBeTruthy();
    expect(screen.getByText("Check your connection and try again.")).toBeTruthy();
    expect(screen.getByText("Try again")).toBeTruthy();
    expect(screen.queryByText(t("common.somethingWentWrong"))).toBeNull();
  });
});
