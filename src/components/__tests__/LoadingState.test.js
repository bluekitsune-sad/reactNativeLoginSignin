/* eslint-env jest */
import { render, screen } from "@testing-library/react-native";
import React from "react";

import { LoadingState } from "..";
import { t } from "../../i18n";

describe("mallmate LoadingState", () => {
  it("defaults its message through t() and mirrors it onto the spinner label", () => {
    render(<LoadingState />);

    expect(screen.getByText(t("common.loading"))).toBeTruthy();
    expect(screen.getByLabelText(t("common.loading"))).toBeTruthy();
  });

  it("uses a custom message for both the text and the spinner label", () => {
    render(<LoadingState message="Loading offers…" />);

    expect(screen.getByText("Loading offers…")).toBeTruthy();
    expect(screen.getByLabelText("Loading offers…")).toBeTruthy();
    expect(screen.queryByText(t("common.loading"))).toBeNull();
  });
});
