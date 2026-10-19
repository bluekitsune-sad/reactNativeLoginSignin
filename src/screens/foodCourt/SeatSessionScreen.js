import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Card, SectionHeader, StatusChip } from "../../components";
import { MallMateTheme } from "../../constants";
import { useMallManagement } from "../../utils";

const formatTime = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

/**
 * Active seat session (SCREEN_INVENTORY 31). Pure presentation: the
 * session object is the display-only mock created at confirmation —
 * no timer enforcement, no expiry rules, no server sync (blocked on open
 * decisions #9/#10). Ending or simulating expiry routes to the
 * ended/expired screen.
 */
const SeatSessionScreen = ({ navigation, route }) => {
  const { selectedMall } = useMallManagement();
  const session = route?.params?.session;

  if (!session) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.body}>
          <Text style={styles.missingMessage}>No active seat session.</Text>
          <Button label="Back to food court" onPress={() => navigation.navigate("FoodCourt")} />
        </View>
      </SafeAreaView>
    );
  }

  const goToOutcome = (reason) => {
    navigation.replace("SeatSessionEnd", { reason, session });
  };

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
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.hero}>
          <View style={styles.heroTop}>
            <Ionicons
              name="time-outline"
              size={28}
              color={MallMateTheme.color.primary}
              style={styles.heroIcon}
            />
            <View style={styles.heroBody}>
              <Text style={styles.heroTitle} accessibilityRole="header">
                Session active
              </Text>
              <StatusChip label="Ongoing" tone="success" style={styles.heroChip} />
            </View>
          </View>
          <Text style={styles.seatLabel}>{session.seat?.label}</Text>
          <Text style={styles.heroMeta}>
            {session.seat?.zoneName} · {session.seat?.floor}
          </Text>
          <View style={styles.timesRow}>
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Started</Text>
              <Text style={styles.timeValue}>{formatTime(session.startedAt)}</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Preview until</Text>
              <Text style={styles.timeValue}>{formatTime(session.expiresAt)}</Text>
            </View>
          </View>
          <Text style={styles.disclosure}>
            Preview only — sessions aren't enforced or validated in this build.
          </Text>
        </Card>

        <SectionHeader title="Manage" style={styles.section} />
        <Card>
          <Text style={styles.manageMessage}>
            End your session when you leave the table so the seat frees up for the next guest.
          </Text>
          <Button
            label="End session"
            onPress={() => goToOutcome("ended")}
            style={styles.manageButton}
          />
          <Button
            label="Simulate expiry"
            variant="secondary"
            onPress={() => goToOutcome("expired")}
            style={styles.manageButton}
          />
        </Card>
      </ScrollView>
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
    alignItems: "center",
    justifyContent: "center",
    padding: MallMateTheme.spacing.xl,
  },
  missingMessage: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    textAlign: "center",
    marginBottom: MallMateTheme.spacing.lg,
  },
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  hero: {
    marginBottom: MallMateTheme.spacing.sm,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroIcon: {
    marginEnd: MallMateTheme.spacing.md,
  },
  heroBody: {
    flex: 1,
  },
  heroTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h3.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  heroChip: {
    alignSelf: "flex-start",
    marginTop: MallMateTheme.spacing.xs,
  },
  seatLabel: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    marginTop: MallMateTheme.spacing.md,
  },
  heroMeta: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  timesRow: {
    flexDirection: "row",
    marginTop: MallMateTheme.spacing.md,
    gap: MallMateTheme.spacing.lg,
  },
  timeBox: {
    flex: 1,
  },
  timeLabel: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  timeValue: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    fontVariant: ["tabular-nums"],
  },
  disclosure: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.md,
  },
  section: {
    marginTop: MallMateTheme.spacing.lg,
  },
  manageMessage: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginBottom: MallMateTheme.spacing.md,
  },
  manageButton: {
    marginBottom: MallMateTheme.spacing.sm,
  },
});

export default SeatSessionScreen;
