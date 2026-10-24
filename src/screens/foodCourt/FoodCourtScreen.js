import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge, Card, EmptyState, SectionHeader, StatusChip } from "../../components";
import { MallMateTheme } from "../../constants";
import { t } from "../../i18n";
import { getFoodCourtOverview, getZoneStatus } from "../../mock";
import { useMallManagement } from "../../utils";

/**
 * Food-court overview (SCREEN_INVENTORY 28) on mock data: venue summary and
 * a mock seating-zone list with static seat counts. The "scan to sit" entry
 * point reflects the seat_sessions capability and opens the mock seat-session
 * flow — no QR validation or session rules here (blocked on open decisions
 * #9/#10). Capability-gated: DISABLED food_court shows an unavailable state.
 */
const FoodCourtScreen = ({ navigation }) => {
  const { selectedMall } = useMallManagement();
  const { available, degraded, seatSessionsOn, venue } = getFoodCourtOverview(
    selectedMall.slug,
    selectedMall.capabilities || {},
  );

  const header = (
    <View style={styles.header}>
      <Pressable
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel={t("common.goBack")}
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
  );

  if (!available) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {header}
        <EmptyState
          icon={<Ionicons name="cafe-outline" size={48} color={MallMateTheme.color.textMuted} />}
          title={t("foodCourt.unavailableTitle")}
          message={t("foodCourt.unavailableMessage")}
        />
      </SafeAreaView>
    );
  }

  const openScanFlow = () => {
    navigation.navigate("SeatScan");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {header}
      <ScrollView key={selectedMall.slug} contentContainerStyle={styles.content}>
        <Card style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.heroTitle} accessibilityRole="header">
              {venue.name}
            </Text>
            {degraded ? (
              <StatusChip label={t("maps.limited")} tone="warning" style={styles.heroChip} />
            ) : null}
          </View>
          <Text style={styles.heroMeta}>{venue.floor}</Text>
          <Text style={styles.heroMeta}>{venue.hours}</Text>
          <Text style={styles.disclosure}>{t("foodCourt.mockDisclosure")}</Text>
        </Card>

        <SectionHeader title={t("foodCourt.scanToSit")} style={styles.section} />
        {seatSessionsOn ? (
          <Card onPress={openScanFlow}>
            <View style={styles.scanRow}>
              <Ionicons
                name="qr-code-outline"
                size={26}
                color={MallMateTheme.color.primary}
                style={styles.scanIcon}
              />
              <View style={styles.scanBody}>
                <Text style={styles.scanTitle}>{t("foodCourt.scanTitle")}</Text>
                <Text style={styles.scanSubtitle}>{t("foodCourt.scanSubtitle")}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={MallMateTheme.color.textMuted} />
            </View>
          </Card>
        ) : (
          <Card unavailable>
            <View style={styles.scanRow}>
              <Ionicons
                name="qr-code-outline"
                size={26}
                color={MallMateTheme.color.textMuted}
                style={styles.scanIcon}
              />
              <View style={styles.scanBody}>
                <Text style={styles.scanTitleDisabled}>{t("foodCourt.scanToSit")}</Text>
                <Text style={styles.scanSubtitle}>{t("foodCourt.seatSessionsDisabled")}</Text>
              </View>
            </View>
          </Card>
        )}

        <SectionHeader title={t("foodCourt.seatingZones")} style={styles.section} />
        {venue.zones.length ? (
          <View style={styles.zones}>
            {venue.zones.map((zone) => {
              const status = getZoneStatus(zone);
              return (
                <Card key={zone.id} style={styles.zoneCard}>
                  <View style={styles.zoneTop}>
                    <Text style={styles.zoneName}>{zone.name}</Text>
                    <StatusChip label={status.label} tone={status.tone} />
                  </View>
                  {zone.description ? (
                    <Text style={styles.zoneDescription}>{zone.description}</Text>
                  ) : null}
                  <Text style={styles.zoneCounts}>
                    {t("foodCourt.seatsFree", {
                      available: zone.seatsAvailable,
                      total: zone.seatsTotal,
                    })}
                  </Text>
                  {zone.accessible ? (
                    <Badge
                      label={t("foodCourt.accessibleSeating")}
                      tone="neutral"
                      style={styles.zoneBadge}
                    />
                  ) : null}
                </Card>
              );
            })}
          </View>
        ) : (
          <Card>
            <Text style={styles.emptyZones}>{t("foodCourt.emptyZones")}</Text>
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
    marginBottom: MallMateTheme.spacing.sm,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroTitle: {
    flexShrink: 1,
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h3.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  heroChip: {
    marginStart: MallMateTheme.spacing.sm,
  },
  heroMeta: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.xs,
  },
  disclosure: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.sm,
  },
  section: {
    marginTop: MallMateTheme.spacing.lg,
  },
  scanRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  scanIcon: {
    marginEnd: MallMateTheme.spacing.md,
  },
  scanBody: {
    flex: 1,
  },
  scanTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
  scanTitleDisabled: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
  scanSubtitle: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  zones: {
    gap: MallMateTheme.spacing.sm,
  },
  zoneCard: {
    marginBottom: 0,
  },
  zoneTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  zoneName: {
    flexShrink: 1,
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    marginEnd: MallMateTheme.spacing.sm,
  },
  zoneDescription: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  zoneCounts: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.label.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    marginTop: MallMateTheme.spacing.sm,
  },
  zoneBadge: {
    alignSelf: "flex-start",
    marginTop: MallMateTheme.spacing.sm,
  },
  emptyZones: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
});

export default FoodCourtScreen;
