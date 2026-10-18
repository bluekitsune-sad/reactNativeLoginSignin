import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Card } from "../../components";
import { MallMateTheme } from "../../constants";
import { useMallManagement } from "../../utils";

const OUTCOME_COPY = {
  ended: {
    icon: "checkmark-circle-outline",
    title: "Session ended",
    message: "Thanks — your seat session has ended and the table is free for the next guest.",
  },
  expired: {
    icon: "hourglass-outline",
    title: "Session expired",
    message: "Your seat session ran out. Scan the table code again if you're still sitting there.",
  },
};

/**
 * Seat session ended/expired (SCREEN_INVENTORY 32). Pure presentation:
 * the session was already display-only, so "ending" just swaps in this
 * confirmation — no session rules or server calls (blocked on open
 * decisions #9/#10).
 */
const SeatSessionEndScreen = ({ navigation, route }) => {
  const { selectedMall } = useMallManagement();
  const reason = route?.params?.reason === "expired" ? "expired" : "ended";
  const copy = OUTCOME_COPY[reason];
  const seat = route?.params?.session?.seat;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.navigate("FoodCourt")}
          accessibilityRole="button"
          accessibilityLabel="Back to food court"
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
            name={copy.icon}
            size={44}
            color={reason === "ended" ? MallMateTheme.color.primary : MallMateTheme.color.highlight}
            style={styles.icon}
          />
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.message}>{copy.message}</Text>
          {seat ? (
            <Text style={styles.seatMeta}>
              {seat.label} · {seat.zoneName}
            </Text>
          ) : null}
        </Card>
        <Button
          label="Back to food court"
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
    marginRight: MallMateTheme.spacing.sm,
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
    marginBottom: 0,
  },
});

export default SeatSessionEndScreen;
