import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

import { MallMateTheme } from "../constants";

const FlagItem = ({ code, name, dial_code, flag, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress({ code, name, dial_code, flag })}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${dial_code}`}
    >
      <View style={styles.subContainer}>
        <Text style={styles.flagEmoji}>{flag || "🏳️"}</Text>
        <Text style={styles.flagText} numberOfLines={1}>
          {name}
        </Text>
      </View>
      <Text style={styles.dialCodeText}>{dial_code}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: MallMateTheme.touchTarget.ideal,
    paddingHorizontal: MallMateTheme.spacing.md,
    paddingVertical: MallMateTheme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: MallMateTheme.color.border,
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    marginRight: MallMateTheme.spacing.md,
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: MallMateTheme.spacing.sm,
  },
  flagText: {
    fontSize: MallMateTheme.typography.body.fontSize,
    lineHeight: MallMateTheme.typography.body.fontSize * 1.4,
    color: MallMateTheme.color.textPrimary,
    fontFamily: MallMateTheme.fontFamily.regular,
    flexShrink: 1,
  },
  dialCodeText: {
    fontSize: MallMateTheme.typography.body.fontSize,
    color: MallMateTheme.color.textSecondary,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
});

export default FlagItem;
