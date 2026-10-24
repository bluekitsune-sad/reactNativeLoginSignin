import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, EmptyState, ListRow } from "../../components";
import { MallMateTheme } from "../../constants";
import { t } from "../../i18n";
import { getDestinationById, getStartPoints } from "../../mock";
import { useMallManagement } from "../../utils";

/**
 * Manual start-point selection (SCREEN_INVENTORY 49). Live positioning is
 * unavailable in the preview, so the user picks where they are from a
 * curated list; choosing one opens the static route preview to the
 * destination they selected earlier.
 */
const StartPointSelectScreen = ({ navigation, route }) => {
  const { selectedMall } = useMallManagement();
  const destinationId = route?.params?.destinationId;
  const destinationResponse = getDestinationById(
    selectedMall.slug,
    selectedMall.capabilities || {},
    destinationId,
  );
  const startResponse = getStartPoints(selectedMall.slug, selectedMall.capabilities || {});
  const startPoints = startResponse.data;
  const destination = destinationResponse.data;

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
      <Text style={styles.headerMeta} numberOfLines={1} accessibilityRole="header">
        {t("maps.chooseStartPoint")}
      </Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  if (!startResponse.status || !destination || startPoints.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {header}
        <EmptyState
          icon={<Ionicons name="walk-outline" size={48} color={MallMateTheme.color.textMuted} />}
          title={t("maps.noStartPointsTitle")}
          message={
            startResponse.status === false ? startResponse.message : t("maps.noStartPointsMessage")
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {header}
      <ScrollView key={selectedMall.slug} contentContainerStyle={styles.content}>
        <Text style={styles.intro}>{t("maps.startPointIntro")}</Text>
        <Card style={styles.destinationCard}>
          <Text style={styles.destinationLabel}>{t("maps.destinationLabel")}</Text>
          <Text style={styles.destinationName}>
            {destination.name} · {destination.floorName}
          </Text>
        </Card>
        <View style={styles.list}>
          {startPoints.map((startPoint) => (
            <ListRow
              key={startPoint.id}
              title={startPoint.name}
              subtitle={startPoint.floorName}
              leading={
                <Ionicons name="walk-outline" size={20} color={MallMateTheme.color.primary} />
              }
              onPress={() =>
                navigation.navigate("RoutePreview", {
                  destinationId: destination.id,
                  startId: startPoint.id,
                })
              }
              style={styles.row}
            />
          ))}
        </View>
        <Text style={styles.disclaimer}>{t("maps.staticPreviewDisclaimer")}</Text>
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
  intro: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginBottom: MallMateTheme.spacing.md,
  },
  destinationCard: {
    marginBottom: 0,
  },
  destinationLabel: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  destinationName: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    marginTop: 2,
  },
  list: {
    gap: MallMateTheme.spacing.sm,
    marginTop: MallMateTheme.spacing.lg,
  },
  row: {
    marginBottom: 0,
  },
  disclaimer: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.lg,
  },
});

export default StartPointSelectScreen;
