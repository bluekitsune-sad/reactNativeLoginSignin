import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Card } from "../../components";
import { MallMateTheme } from "../../constants";
import { SEAT_HELP_COPY } from "../../mock";
import { useMallManagement } from "../../utils";

/**
 * Seat help/error screen (SCREEN_INVENTORY 33): invalid QR, occupied,
 * unavailable and stale outcomes from a mock scan resolve here with
 * actionable copy. No validation happens in-app — the mock resolver
 * stands in for the backend (session rules are blocked).
 */
const SeatHelpScreen = ({ navigation, route }) => {
  const { selectedMall } = useMallManagement();
  const outcome = route?.params?.outcome;
  const copy = SEAT_HELP_COPY[outcome] ?? SEAT_HELP_COPY.INVALID;
  const seat = route?.params?.seat;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={MallMateTheme.spacing.sm}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={28} color={MallMateTheme.color.textPrimary} />
        </Pressable>
        <Text style={styles.headerMeta} numberOfLines={1}>
          {selectedMall.name}
        </Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.body}>
        <Card style={styles.card}>
          <Ionicons
            name="alert-circle-outline"
            size={44}
            color={MallMateTheme.color.error}
            style={styles.icon}
          />
          <Text style={styles.title} accessibilityRole="header">
            {copy.title}
          </Text>
          <Text style={styles.message}>{copy.message}</Text>
          {seat ? (
            <Text style={styles.seatMeta}>
              Scanned {seat.label} · {seat.zoneName}
            </Text>
          ) : null}
        </Card>
        <Button
          label="Scan again"
          onPress={() => navigation.navigate("SeatScan")}
          style={styles.action}
        />
        <Button
          label="Back to food court"
          variant="secondary"
          onPress={() => navigation.navigate("FoodCourt")}
          style={styles.action}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MallMateTheme.color.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: MallMateTheme.spacing.lg,
    paddingVertical: MallMateTheme.spacing.sm,
  },
  backButton: {
    minHeight: MallMateTheme.touchTarget.min,
    minWidth: MallMateTheme.touchTarget.min,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: MallMateTheme.spacing.sm,
  },
  headerMeta: {
    flex: 1,
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  headerSpacer: {
    width: MallMateTheme.touchTarget.min,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  card: {
    alignItems: "center",
    marginBottom: MallMateTheme.spacing.lg,
  },
  icon: {
    marginBottom: MallMateTheme.spacing.md,
  },
  title: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h3.fontSize,
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
  seatMeta: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.md,
  },
  action: {
    marginBottom: MallMateTheme.spacing.sm,
  },
});

export default SeatHelpScreen;
