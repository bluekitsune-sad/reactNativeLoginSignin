import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { MallMateTheme } from "../../constants";

const SectionHeader = ({ title, actionLabel, onAction, style }) => (
  <View style={[styles.row, style]}>
    <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
      {title}
    </Text>
    {actionLabel && onAction ? (
      <Pressable
        onPress={onAction}
        accessibilityRole="button"
        hitSlop={MallMateTheme.spacing.sm}
        style={styles.action}
      >
        <Text style={styles.actionLabel}>{actionLabel}</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: MallMateTheme.touchTarget.min,
    marginBottom: MallMateTheme.spacing.sm,
  },
  title: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    flexShrink: 1,
  },
  action: {
    minHeight: MallMateTheme.touchTarget.min,
    justifyContent: "center",
    paddingHorizontal: MallMateTheme.spacing.sm,
  },
  actionLabel: {
    color: MallMateTheme.color.primary,
    fontSize: MallMateTheme.typography.label.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
});

export default SectionHeader;
