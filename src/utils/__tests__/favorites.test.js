/* eslint-env jest */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import { Button, Text } from "react-native";

import useFavorites, { FavoritesProvider } from "../favorites";

const Probe = () => {
  const { favoriteIds, hydrated, isFavorite, toggleFavorite } = useFavorites();
  return (
    <>
      <Text testID="hydrated">{hydrated ? "yes" : "no"}</Text>
      <Text testID="ids">{favoriteIds.join(",")}</Text>
      <Text testID="is-m1">{isFavorite("lucky-m-1") ? "yes" : "no"}</Text>
      <Text testID="is-missing">{isFavorite("nope") ? "yes" : "no"}</Text>
      <Button testID="toggle-m1" title="toggle" onPress={() => toggleFavorite("lucky-m-1")} />
      <Button testID="toggle-empty" title="toggle empty" onPress={() => toggleFavorite("")} />
    </>
  );
};

const renderWithProvider = () =>
  render(
    <FavoritesProvider>
      <Probe />
    </FavoritesProvider>,
  );

describe("FavoritesProvider", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it("hydrates from persisted storage", async () => {
    await AsyncStorage.setItem("favoriteMerchantIds", JSON.stringify(["lucky-m-1"]));
    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId("hydrated").props.children).toBe("yes"));
    expect(screen.getByTestId("ids").props.children).toBe("lucky-m-1");
    expect(screen.getByTestId("is-m1").props.children).toBe("yes");
  });

  it("starts empty when nothing is persisted", async () => {
    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId("hydrated").props.children).toBe("yes"));
    expect(screen.getByTestId("ids").props.children).toBe("");
    expect(screen.getByTestId("is-m1").props.children).toBe("no");
  });

  it("still hydrates (empty) when storage read rejects", async () => {
    jest.spyOn(AsyncStorage, "getItem").mockRejectedValueOnce(new Error("disk error"));
    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId("hydrated").props.children).toBe("yes"));
    expect(screen.getByTestId("ids").props.children).toBe("");
  });

  it("toggles a merchant on and persists the new list", async () => {
    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId("hydrated").props.children).toBe("yes"));

    fireEvent.press(screen.getByTestId("toggle-m1"));
    expect(screen.getByTestId("is-m1").props.children).toBe("yes");
    expect(screen.getByTestId("ids").props.children).toBe("lucky-m-1");
    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "favoriteMerchantIds",
        JSON.stringify(["lucky-m-1"]),
      ),
    );
  });

  it("toggles a favorite back off and persists the removal", async () => {
    await AsyncStorage.setItem("favoriteMerchantIds", JSON.stringify(["lucky-m-1"]));
    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId("hydrated").props.children).toBe("yes"));
    expect(screen.getByTestId("is-m1").props.children).toBe("yes");

    fireEvent.press(screen.getByTestId("toggle-m1"));
    expect(screen.getByTestId("is-m1").props.children).toBe("no");
    expect(screen.getByTestId("ids").props.children).toBe("");
    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("favoriteMerchantIds", "[]"),
    );
  });

  it("ignores toggles with a falsy merchant id", async () => {
    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId("hydrated").props.children).toBe("yes"));

    fireEvent.press(screen.getByTestId("toggle-empty"));
    expect(screen.getByTestId("ids").props.children).toBe("");
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it("throws when useFavorites is used outside the provider", () => {
    const Orphan = () => {
      useFavorites();
      return null;
    };
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow(/FavoritesProvider/);
    spy.mockRestore();
  });
});
