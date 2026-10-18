import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { MallMateTheme } from "../../constants";

const tones = {
  sponsored: {
    backgroundColor: MallMateTheme.color.highlight,
    textColor: MallMateTheme.color.background,
  },
  featured: {
    backgroundColor: MallMateTheme.color.primary,
    textColor: MallMateTheme.color.background,
  },
  neutral: {
    backgroundColor: MallMateTheme.color.surfaceElevated,
    textColor: MallMateTheme.color.textSecondary,
  },
};

const Badge = ({ label, tone = "neutral", style }) => {
  const palette = tones[tone] || tones.neutral;
  return (
    <View
      accessibilityLabel={label}
      style={[styles.badge, { backgroundColor: palette.backgroundColor }, style]}
    >
      <Text style={[styles.label, { color: palette.textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: MallMateTheme.radius.control / 2,
    paddingHorizontal: MallMateTheme.spacing.sm,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
});

export default Badge;
