import React, { useState } from "react";
import { StyleSheet, Text, TextInput as RNTextInput, View } from "react-native";

import { MallMateTheme } from "../../constants";

const MallMateTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize,
  style,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={MallMateTheme.color.textMuted}
        editable={!disabled}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label || placeholder}
        style={[
          styles.input,
          focused && styles.focused,
          !!error && styles.invalid,
          disabled && styles.disabled,
        ]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.label.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    marginBottom: MallMateTheme.spacing.xs,
  },
  input: {
    minHeight: MallMateTheme.touchTarget.ideal,
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
    backgroundColor: MallMateTheme.color.surface,
    color: MallMateTheme.color.textPrimary,
    fontFamily: MallMateTheme.fontFamily.regular,
    fontSize: MallMateTheme.typography.body.fontSize,
    paddingHorizontal: MallMateTheme.spacing.md,
    paddingVertical: MallMateTheme.spacing.sm,
  },
  focused: {
    borderColor: MallMateTheme.color.primary,
  },
  invalid: {
    borderColor: MallMateTheme.color.error,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    color: MallMateTheme.color.error,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.xs,
  },
});

export default MallMateTextInput;
