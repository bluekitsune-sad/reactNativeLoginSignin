import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Card, StatusChip } from "../../components";
import { MallMateTheme } from "../../constants";
import { createMockSession } from "../../mock";
import { useMallManagement } from "../../utils";

/**
 * Seat confirmation (SCREEN_INVENTORY 30). Shows the resolved seat and
 * asks the guest to confirm before "starting" a session. Pure
 * presentation: starting builds a display-only mock session (no session
 * rules, no server round-trip — blocked on open decisions #9/#10).
 */
const SeatConfirmScreen = ({ navigation, route }) => {
  const { selectedMall } = useMallManagement();
  const seat = route?.params?.seat;

  if (!seat) {
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
            <Ionicons
              name="chevron-back-outline"
              size={28}
              color={MallMateTheme.color.textPrimary}
            />
          </Pressable>
          <Text style={styles.headerMeta}>Seat confirmation</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.missingBody}>
          <Text style={styles.missingMessage}>
            No seat was resolved from that scan. Please scan a table code again.
          </Text>
          <Button
            label="Scan again"
            onPress={() => navigation.goBack()}
            style={styles.missingButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const startSession = () => {
    const session = createMockSession(seat, selectedMall.slug);
    navigation.replace("SeatSession", { session });
  };

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
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.hero}>
          <View style={styles.heroTop}>
            <Ionicons
              name="qr-code-outline"
              size={28}
              color={MallMateTheme.color.primary}
              style={styles.heroIcon}
            />
            <View style={styles.heroBody}>
              <Text style={styles.heroTitle}>{seat.label}</Text>
              <Text style={styles.heroMeta}>
                {seat.zoneName} · {seat.floor}
              </Text>
              <StatusChip label="Available" tone="success" style={styles.heroChip} />
            </View>
          </View>
        </Card>

        <Card style={styles.confirmCard}>
          <Text style={styles.confirmTitle}>Start a seat session here?</Text>
          <Text style={styles.confirmMessage}>
            Confirm you are at this table to start a session. You can end it any time from the
            session card. This preview does not validate scans or enforce session rules yet.
          </Text>
        </Card>

        <View style={styles.actions}>
          <Button label="Yes, start session" onPress={startSession} style={styles.action} />
          <Button
            label="Scan a different table"
            variant="secondary"
            onPress={() => navigation.goBack()}
            style={styles.action}
          />
        </View>
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
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  hero: {
    marginBottom: MallMateTheme.spacing.md,
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
  heroMeta: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  heroChip: {
    alignSelf: "flex-start",
    marginTop: MallMateTheme.spacing.sm,
  },
  confirmCard: {
    marginBottom: MallMateTheme.spacing.lg,
  },
  confirmTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginBottom: MallMateTheme.spacing.xs,
  },
  confirmMessage: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  actions: {
    gap: MallMateTheme.spacing.sm,
  },
  action: {
    marginBottom: 0,
  },
  missingBody: {
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
  missingButton: {
    minWidth: 160,
  },
});

export default SeatConfirmScreen;
