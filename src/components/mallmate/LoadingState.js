import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { MallMateTheme } from "../../constants";
import { t } from "../../i18n";

const LoadingState = ({ message = t("common.loading"), style }) => (
  <View style={[styles.wrapper, style]}>
    <ActivityIndicator
      size="large"
      color={MallMateTheme.color.primary}
      accessibilityLabel={message}
    />
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    padding: MallMateTheme.spacing.xl,
  },
  message: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.md,
  },
});

export default LoadingState;
