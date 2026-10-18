import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { MallMateTheme } from "../../constants";

const EmptyState = ({ icon, title, message, style }) => (
  <View style={[styles.wrapper, style]}>
    {icon ? <View style={styles.icon}>{icon}</View> : null}
    {title ? <Text style={styles.title}>{title}</Text> : null}
    {message ? <Text style={styles.message}>{message}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    padding: MallMateTheme.spacing.xl,
  },
  icon: {
    marginBottom: MallMateTheme.spacing.md,
  },
  title: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    textAlign: "center",
    marginBottom: MallMateTheme.spacing.xs,
  },
  message: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    textAlign: "center",
  },
});

export default EmptyState;
