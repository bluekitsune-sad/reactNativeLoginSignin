import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { MallMateTheme } from "../../constants";

const ListRow = ({ title, subtitle, leading, trailing, showChevron = true, onPress, style }) => {
  const content = (
    <View style={[styles.row, style]}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      {showChevron && onPress ? (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={MallMateTheme.color.textMuted}
          style={styles.chevron}
        />
      ) : null}
    </View>
  );
  if (!onPress) {
    return content;
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => pressed && styles.pressed}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    minHeight: MallMateTheme.touchTarget.ideal,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: MallMateTheme.spacing.sm,
    paddingHorizontal: MallMateTheme.spacing.lg,
    backgroundColor: MallMateTheme.color.surface,
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
  },
  pressed: {
    opacity: 0.8,
    backgroundColor: MallMateTheme.color.surfaceElevated,
  },
  leading: {
    marginRight: MallMateTheme.spacing.md,
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
  subtitle: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  trailing: {
    marginLeft: MallMateTheme.spacing.sm,
  },
  chevron: {
    marginLeft: MallMateTheme.spacing.sm,
  },
});

export default ListRow;
