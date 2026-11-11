/* eslint-env jest */
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import { SectionHeader } from "..";

describe("mallmate SectionHeader", () => {
  it("renders its title as a header", () => {
    render(<SectionHeader title="Active offers" />);

    expect(screen.getByRole("header").props.children).toBe("Active offers");
  });

  it("renders an action button that fires onAction", () => {
    const onAction = jest.fn();
    render(<SectionHeader title="Events" actionLabel="See all" onAction={onAction} />);

    fireEvent.press(screen.getByRole("button"));

    expect(screen.getByText("See all")).toBeTruthy();
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("hides the action when only actionLabel is given", () => {
    render(<SectionHeader title="Events" actionLabel="See all" />);

    expect(screen.queryByText("See all")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("hides the action when only onAction is given", () => {
    const onAction = jest.fn();
    render(<SectionHeader title="Events" onAction={onAction} />);

    expect(screen.queryByRole("button")).toBeNull();
    expect(onAction).not.toHaveBeenCalled();
  });
});
