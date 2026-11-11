/* eslint-env jest */
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { StyleSheet } from "react-native";

import { TextInput } from "..";
import { MallMateTheme } from "../../constants";

const styleOf = (element) => StyleSheet.flatten(element.props.style);

describe("mallmate TextInput", () => {
  it("labels the field and reports typed text", () => {
    const onChangeText = jest.fn();
    render(
      <TextInput
        label="Email"
        value=""
        onChangeText={onChangeText}
        placeholder="you@mallmate.app"
      />,
    );

    const input = screen.getByLabelText("Email");
    expect(input.props.editable).toBe(true);

    fireEvent.changeText(input, "shopper@mallmate.app");
    expect(onChangeText).toHaveBeenCalledWith("shopper@mallmate.app");
  });

  it("falls back to the placeholder for the accessibility label", () => {
    render(<TextInput value="" onChangeText={jest.fn()} placeholder="Search the mall" />);

    expect(screen.getByLabelText("Search the mall")).toBeTruthy();
  });

  it("swaps the border to the focus colour on focus and back on blur", () => {
    render(<TextInput label="Email" value="" onChangeText={jest.fn()} />);

    let input = screen.getByLabelText("Email");
    expect(styleOf(input).borderColor).toBe(MallMateTheme.color.border);

    fireEvent(input, "focus");
    input = screen.getByLabelText("Email");
    expect(styleOf(input).borderColor).toBe(MallMateTheme.color.primary);

    fireEvent(input, "blur");
    input = screen.getByLabelText("Email");
    expect(styleOf(input).borderColor).toBe(MallMateTheme.color.border);
  });

  it("marks an invalid field with the error colour and the message", () => {
    render(<TextInput label="Email" value="" onChangeText={jest.fn()} error="Email is required" />);

    expect(screen.getByText("Email is required")).toBeTruthy();
    expect(styleOf(screen.getByLabelText("Email")).borderColor).toBe(MallMateTheme.color.error);
  });

  it("rejects input while disabled", () => {
    const onChangeText = jest.fn();
    render(<TextInput label="Email" value="" onChangeText={onChangeText} disabled />);

    const input = screen.getByLabelText("Email");
    expect(input.props.editable).toBe(false);

    fireEvent.changeText(input, "typed anyway");
    expect(onChangeText).not.toHaveBeenCalled();
  });
});
