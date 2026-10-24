import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Button from "./Button";
import { MallMateTheme } from "../../constants";
import { t } from "../../i18n";

const ErrorState = ({
  title = t("common.somethingWentWrong"),
  message,
  onRetry,
  retryLabel = t("common.retry"),
  style,
}) => (
  <View style={[styles.wrapper, style]}>
    <Ionicons
      name="alert-circle-outline"
      size={40}
      color={MallMateTheme.color.error}
      style={styles.icon}
    />
    <Text style={styles.title}>{title}</Text>
    {message ? <Text style={styles.message}>{message}</Text> : null}
    {onRetry ? (
      <Button label={retryLabel} onPress={onRetry} variant="secondary" style={styles.retry} />
    ) : null}
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
    marginBottom: MallMateTheme.spacing.md,
  },
  retry: {
    marginTop: MallMateTheme.spacing.md,
    minWidth: 160,
  },
});

export default ErrorState;
