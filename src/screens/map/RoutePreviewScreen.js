import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, EmptyState } from "../../components";
import { MallMateTheme } from "../../constants";
import { t } from "../../i18n";
import { buildRoutePreview } from "../../mock";
import { useMallManagement } from "../../utils";

/**
 * Static route preview + navigation instructions (SCREEN_INVENTORY 47–48)
 * between a manually chosen start point and destination. Steps come from
 * the mock route builder — illustrative text only, never live positioning
 * or real pathfinding.
 */
const RoutePreviewScreen = ({ navigation, route }) => {
  const { selectedMall } = useMallManagement();
  const { destinationId, startId } = route?.params || {};
  const response = buildRoutePreview(
    selectedMall.slug,
    selectedMall.capabilities || {},
    startId,
    destinationId,
  );
  const preview = response.data;

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
        {t("maps.routePreview")}
      </Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  if (!preview) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {header}
        <EmptyState
          icon={<Ionicons name="route-outline" size={48} color={MallMateTheme.color.textMuted} />}
          title={t("maps.routeUnavailableTitle")}
          message={response.message || t("maps.routeUnavailableMessage")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {header}
      <ScrollView key={`${startId}-${destinationId}`} contentContainerStyle={styles.content}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryDot} />
            <View style={styles.summaryBody}>
              <Text style={styles.summaryLabel}>{t("maps.from")}</Text>
              <Text style={styles.summaryValue}>
                {preview.origin.name} · {preview.origin.floorName}
              </Text>
            </View>
          </View>
          <View style={styles.summaryLine} />
          <View style={styles.summaryRow}>
            <View style={[styles.summaryDot, styles.summaryDotEnd]} />
            <View style={styles.summaryBody}>
              <Text style={styles.summaryLabel}>{t("maps.to")}</Text>
              <Text style={styles.summaryValue}>
                {preview.destination.name} · {preview.destination.floorName}
              </Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>{t("maps.directions")}</Text>
        <View style={styles.steps}>
          {preview.steps.map((step, index) => (
            <View key={`${index}-${step}`} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <Card style={styles.noteCard}>
          <Text style={styles.note}>{t("maps.routeNote")}</Text>
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
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  headerSpacer: {
    width: MallMateTheme.touchTarget.min,
  },
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  summaryCard: {
    marginBottom: 0,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  summaryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: MallMateTheme.color.primary,
    marginTop: 6,
    marginEnd: MallMateTheme.spacing.md,
  },
  summaryDotEnd: {
    backgroundColor: MallMateTheme.color.highlight,
  },
  summaryBody: {
    flex: 1,
  },
  summaryLabel: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  summaryValue: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    marginTop: 2,
  },
  summaryLine: {
    width: 2,
    height: 16,
    backgroundColor: MallMateTheme.color.border,
    marginStart: 4,
    marginVertical: 4,
  },
  sectionTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginTop: MallMateTheme.spacing.lg,
    marginBottom: MallMateTheme.spacing.sm,
  },
  steps: {
    gap: MallMateTheme.spacing.md,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: MallMateTheme.color.primary,
    backgroundColor: MallMateTheme.color.surface,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: MallMateTheme.spacing.md,
  },
  stepNumberText: {
    color: MallMateTheme.color.primary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  stepText: {
    flex: 1,
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    lineHeight: 22,
  },
  noteCard: {
    marginTop: MallMateTheme.spacing.lg,
  },
  note: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    lineHeight: 18,
  },
});

export default RoutePreviewScreen;
