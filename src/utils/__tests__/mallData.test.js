/* eslint-env jest */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { Button, Text } from "react-native";

import { MALLS } from "../../mock/malls";
import useMallManagement, { MallProvider } from "../mallData";

const Probe = () => {
  const { selectedMall, selectedMallSlug, selectMall } = useMallManagement();
  return (
    <>
      <Text testID="mall-name">{selectedMall.name}</Text>
      <Text testID="mall-slug">{selectedMallSlug}</Text>
      <Button testID="pick-harbour" title="pick" onPress={() => selectMall("harbourwalk")} />
      <Button testID="pick-unknown" title="bad" onPress={() => selectMall("nowhere")} />
      <Button testID="pick-by-object" title="obj" onPress={() => selectMall(MALLS[0])} />
    </>
  );
};

const renderWithProvider = () =>
  render(
    <MallProvider>
      <Probe />
    </MallProvider>,
  );

describe("MallContext switching", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("defaults to the first mall in the catalog", () => {
    renderWithProvider();
    expect(screen.getByTestId("mall-name").props.children).toBe(MALLS[0].name);
    expect(screen.getByTestId("mall-slug").props.children).toBe(MALLS[0].slug);
  });

  it("switches to another mall by slug and never keeps stale identity", () => {
    renderWithProvider();
    const harbour = MALLS.find((mall) => mall.slug === "harbourwalk");
    fireEvent.press(screen.getByTestId("pick-harbour"));
    expect(screen.getByTestId("mall-name").props.children).toBe(harbour.name);
    expect(screen.getByTestId("mall-slug").props.children).toBe(harbour.slug);
  });

  it("ignores unknown malls and keeps the current selection", () => {
    renderWithProvider();
    fireEvent.press(screen.getByTestId("pick-unknown"));
    expect(screen.getByTestId("mall-slug").props.children).toBe(MALLS[0].slug);
  });

  it("re-resolves a mall passed as an object (no stale copies)", () => {
    renderWithProvider();
    fireEvent.press(screen.getByTestId("pick-harbour"));
    fireEvent.press(screen.getByTestId("pick-by-object"));
    expect(screen.getByTestId("mall-slug").props.children).toBe(MALLS[0].slug);
  });
});
