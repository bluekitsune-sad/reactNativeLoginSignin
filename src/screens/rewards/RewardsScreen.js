import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, EmptyState, SectionHeader, StatusChip } from "../../components";
import { MallMateTheme } from "../../constants";
import { LEDGER_META, getRewardsOverview } from "../../mock";
import { useMallManagement } from "../../utils";

/**
 * Rewards dashboard + ledger (SCREEN_INVENTORY 57–58) on mock data (PRD
 * 5.11): a points balance card and an append-only-style ledger preview
 * with EARN / REDEEM / REVERSE entries. Display only — no earning,
 * redemption or balance logic (loyalty policy is blocked on the owner).
 * Capability-gated on loyalty: DISABLED shows a clear unavailable state
 * instead of implying a balance exists.
 */
const RewardsScreen = () => {
  const { selectedMall } = useMallManagement();
  const { available, degraded, rewards } = getRewardsOverview(
    selectedMall.slug,
    selectedMall.capabilities || {},
  );

  if (!available) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <EmptyState
          icon={<Ionicons name="gift-outline" size={48} color={MallMateTheme.color.textMuted} />}
          title="Rewards unavailable"
          message={`Loyalty rewards aren't offered at ${selectedMall.name} yet.`}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView key={selectedMall.slug} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle} accessibilityRole="header">
            Rewards
          </Text>
          {degraded ? <StatusChip label="Limited" tone="warning" /> : null}
        </View>
        <Text style={styles.headerMeta} numberOfLines={1}>
          {selectedMall.name}
        </Text>

        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Points balance</Text>
          <Text style={styles.balanceValue} accessibilityLabel={`${rewards.balance} points`}>
            {rewards.balance.toLocaleString()}
          </Text>
          {rewards.pending > 0 ? (
            <Text style={styles.balanceMeta}>{rewards.pending} points pending</Text>
          ) : null}
          {rewards.expiringSoon ? (
            <View style={styles.expiringRow}>
              <StatusChip label="Expiring" tone="warning" />
              <Text style={styles.expiringText}>
                {rewards.expiringSoon.points} points expire by {rewards.expiringSoon.byDate}
              </Text>
            </View>
          ) : null}
          <Text style={styles.disclosure}>
            Mock preview — balances and points are demo values. Earning and redemption are validated
            server-side and aren't active in this build.
          </Text>
        </Card>

        <SectionHeader title="Activity" style={styles.section} />
        {rewards.ledger.length ? (
          <View style={styles.ledger}>
            {rewards.ledger.map((entry) => {
              const meta = LEDGER_META[entry.type] ?? LEDGER_META.EARN;
              return (
                <Card key={entry.id} style={styles.ledgerCard}>
                  <View style={styles.ledgerRow}>
                    <Ionicons
                      name={meta.icon}
                      size={22}
                      color={MallMateTheme.color.primary}
                      style={styles.ledgerIcon}
                    />
                    <View style={styles.ledgerBody}>
                      <Text style={styles.ledgerTitle} numberOfLines={2}>
                        {entry.title}
                      </Text>
                      <Text style={styles.ledgerContext} numberOfLines={1}>
                        {entry.context}
                      </Text>
                      {entry.status === "PENDING" ? (
                        <StatusChip label="Pending" tone="warning" style={styles.ledgerChip} />
                      ) : null}
                    </View>
                    <Text
                      style={[
                        styles.ledgerPoints,
                        entry.points < 0 ? styles.ledgerPointsNegative : null,
                      ]}
                      accessibilityLabel={`${entry.points > 0 ? "plus " : ""}${entry.points} points`}
                    >
                      {meta.sign}
                      {entry.points}
                    </Text>
                  </View>
                </Card>
              );
            })}
          </View>
        ) : (
          <Card>
            <Text style={styles.emptyLedger}>
              No points activity yet. Activity will appear here after qualifying purchases.
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MallMateTheme.color.background,
  },
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h2.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  headerMeta: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
    marginBottom: MallMateTheme.spacing.lg,
  },
  balanceCard: {
    marginBottom: MallMateTheme.spacing.sm,
  },
  balanceLabel: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    textTransform: "uppercase",
  },
  balanceValue: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.display.fontSize,
    fontFamily: MallMateTheme.fontFamily.bold,
    fontVariant: ["tabular-nums"],
    marginTop: 2,
  },
  balanceMeta: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.xs,
  },
  expiringRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: MallMateTheme.spacing.sm,
    gap: MallMateTheme.spacing.sm,
  },
  expiringText: {
    flex: 1,
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
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
  ledger: {
    gap: MallMateTheme.spacing.sm,
  },
  ledgerCard: {
    marginBottom: 0,
  },
  ledgerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ledgerIcon: {
    marginEnd: MallMateTheme.spacing.md,
  },
  ledgerBody: {
    flex: 1,
  },
  ledgerTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
  ledgerContext: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  ledgerChip: {
    alignSelf: "flex-start",
    marginTop: MallMateTheme.spacing.xs,
  },
  ledgerPoints: {
    color: MallMateTheme.color.primary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    fontVariant: ["tabular-nums"],
    marginStart: MallMateTheme.spacing.sm,
  },
  ledgerPointsNegative: {
    color: MallMateTheme.color.textSecondary,
  },
  emptyLedger: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
});

export default RewardsScreen;
