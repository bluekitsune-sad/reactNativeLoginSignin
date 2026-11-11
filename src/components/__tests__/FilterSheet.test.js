/* eslint-env jest */
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import { FilterSheet } from "..";

const options = {
  categories: [
    { value: "restaurants", label: "Restaurants" },
    { value: "retail", label: "Retail" },
  ],
  cuisines: [],
  floors: [{ value: "g", label: "Ground floor" }],
  priceBands: [
    { value: "low", label: "Low" },
    { value: "mid", label: "Mid" },
  ],
};

const emptyFilters = {
  category: null,
  cuisine: null,
  floor: null,
  priceBand: null,
  openNow: false,
};

const renderSheet = (overrides = {}) => {
  const props = {
    visible: true,
    onClose: jest.fn(),
    onApply: jest.fn(),
    onClear: jest.fn(),
    options,
    filters: { ...emptyFilters },
    onChange: jest.fn(),
    resultCount: 4,
    ...overrides,
  };
  render(<FilterSheet {...props} />);
  return props;
};

describe("mallmate FilterSheet", () => {
  it("renders nothing while hidden", () => {
    renderSheet({ visible: false });

    expect(screen.queryByText("Filters")).toBeNull();
    expect(screen.queryByLabelText("Close filters")).toBeNull();
  });

  it("renders one group per non-empty option set", () => {
    renderSheet();

    expect(screen.getByText("Filters")).toBeTruthy();
    expect(screen.getByText("Category")).toBeTruthy();
    expect(screen.getByText("Floor")).toBeTruthy();
    expect(screen.getByText("Price")).toBeTruthy();
    expect(screen.getByText("Open now")).toBeTruthy();
    // `cuisines` is empty, so its group (and its Any pill) never renders.
    expect(screen.queryByText("Cuisine")).toBeNull();
    expect(screen.getAllByLabelText("Any")).toHaveLength(3);
  });

  it("marks the selected option and reports option changes", () => {
    const { onChange } = renderSheet({ filters: { ...emptyFilters, category: "restaurants" } });

    expect(screen.getByLabelText("Restaurants").props.accessibilityState).toMatchObject({
      selected: true,
    });
    expect(screen.getByLabelText("Retail").props.accessibilityState).toMatchObject({
      selected: false,
    });

    fireEvent.press(screen.getByLabelText("Retail"));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ category: "retail" }));
  });

  it("clears a selection through the Any pill", () => {
    const { onChange } = renderSheet({ filters: { ...emptyFilters, category: "retail" } });

    // Pill order mirrors the group order: Category, Floor, Price.
    fireEvent.press(screen.getAllByLabelText("Any")[0]);

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ category: null }));
  });

  it("toggles open-now on from the Show all pill", () => {
    const { onChange } = renderSheet();

    expect(screen.getByLabelText("Show all").props.accessibilityState).toMatchObject({
      selected: false,
    });

    fireEvent.press(screen.getByText("Show all"));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ openNow: true }));
  });

  it("marks the open-now pill selected when it is on", () => {
    renderSheet({ filters: { ...emptyFilters, openNow: true } });

    expect(screen.getByLabelText("Open now only").props.accessibilityState).toMatchObject({
      selected: true,
    });
  });

  it("offers clear-all and a result-count apply footer", () => {
    const { onApply, onClear } = renderSheet({ resultCount: 3 });

    expect(screen.getByText("Show 3")).toBeTruthy();

    fireEvent.press(screen.getByText("Clear all"));
    expect(onClear).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByText("Show 3"));
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it("falls back to an Apply label without a result count", () => {
    renderSheet({ resultCount: null });

    expect(screen.getByText("Apply")).toBeTruthy();
  });

  it("closes from the header button and the backdrop", () => {
    const { onClose } = renderSheet();

    // The sheet sets `accessibilityViewIsModal`, so RNTL treats the backdrop
    // sitting behind it as hidden from the accessibility tree — include
    // hidden elements to reach both close targets.
    const closers = screen.getAllByLabelText("Close filters", { includeHiddenElements: true });
    expect(closers).toHaveLength(2);
    closers.forEach((element) => fireEvent.press(element));

    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
