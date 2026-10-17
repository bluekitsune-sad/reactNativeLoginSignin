import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { MallMateTheme } from "../../constants";

const Card = ({ children, onPress, unavailable = false, style }) => {
  if (!onPress) {
    return <View style={[styles.card, unavailable && styles.unavailable, style]}>{children}</View>;
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
        unavailable && styles.unavailable,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: MallMateTheme.color.surface,
    borderRadius: MallMateTheme.radius.card,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
    padding: MallMateTheme.spacing.lg,
  },
  pressed: {
    backgroundColor: MallMateTheme.color.surfaceElevated,
  },
  unavailable: {
    opacity: 0.6,
  },
});

export default Card;
