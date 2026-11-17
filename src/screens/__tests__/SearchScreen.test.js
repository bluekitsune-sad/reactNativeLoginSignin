/* eslint-env jest */
import { render, screen, waitFor } from "@testing-library/react-native";
import React from "react";

import { MallProvider } from "../../utils";
import SearchScreen from "../search/SearchScreen";

const createNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
});

const renderScreen = (route) =>
  render(
    <MallProvider>
      <SearchScreen navigation={createNavigation()} route={route} />
    </MallProvider>,
  );

describe("SearchScreen deep-link q param", () => {
  it("seeds the query from route.params.q and runs the search on mount", async () => {
    renderScreen({ params: { q: "spice" } });

    expect(screen.getByDisplayValue("spice")).toBeTruthy();

    await waitFor(() => expect(screen.getByText("Spice Route Kitchen")).toBeTruthy());
    expect(screen.queryByText("Try searching for")).toBeNull();
  });

  it("shows the distinct empty-results state for a query with no mock matches", async () => {
    renderScreen({ params: { q: "pizza" } });

    expect(await screen.findByText("No results")).toBeTruthy();
    expect(screen.getByText(/Nothing at .* matches .pizza./)).toBeTruthy();
  });

  it("stays on the idle suggestions state when no q param is passed", async () => {
    renderScreen(undefined);

    expect(screen.getByText("Try searching for")).toBeTruthy();
    expect(screen.getByText("Spice Route")).toBeTruthy();
  });
});
