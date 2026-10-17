import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { MallMateTheme } from "../../constants";

const tones = {
  success: MallMateTheme.color.primary,
  warning: MallMateTheme.color.highlight,
  error: MallMateTheme.color.error,
  info: MallMateTheme.color.info,
  muted: MallMateTheme.color.textMuted,
};

const StatusChip = ({ label, tone = "muted", style }) => {
  const color = tones[tone] || tones.muted;
  return (
    <View accessibilityLabel={label} style={[styles.chip, { borderColor: color }, style]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: MallMateTheme.radius.control / 2,
    paddingHorizontal: MallMateTheme.spacing.sm,
    paddingVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: MallMateTheme.spacing.xs,
  },
  label: {
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
});

export default StatusChip;
