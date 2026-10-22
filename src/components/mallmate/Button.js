import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { MallMateTheme } from "../../constants";
import { t } from "../../i18n";

const variants = {
  primary: {
    container: { backgroundColor: MallMateTheme.color.primary },
    label: {
      color: MallMateTheme.color.background,
      fontFamily: MallMateTheme.fontFamily.semiBold,
    },
  },
  secondary: {
    container: {
      backgroundColor: MallMateTheme.color.surfaceElevated,
      borderWidth: 1,
      borderColor: MallMateTheme.color.border,
    },
    label: {
      color: MallMateTheme.color.textPrimary,
      fontFamily: MallMateTheme.fontFamily.semiBold,
    },
  },
  ghost: {
    container: { backgroundColor: "transparent" },
    label: {
      color: MallMateTheme.color.primary,
      fontFamily: MallMateTheme.fontFamily.semiBold,
    },
  },
};

const Button = ({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}) => {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        (variants[variant] || variants.primary).container,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" ? MallMateTheme.color.background : MallMateTheme.color.primary
          }
          accessibilityLabel={t("common.loading")}
        />
      ) : (
        <Text style={[styles.label, (variants[variant] || variants.primary).label]}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: MallMateTheme.touchTarget.ideal,
    borderRadius: MallMateTheme.radius.control,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: MallMateTheme.spacing.lg,
    paddingVertical: MallMateTheme.spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: MallMateTheme.typography.button.fontSize,
    textAlign: "center",
  },
});

export default Button;
