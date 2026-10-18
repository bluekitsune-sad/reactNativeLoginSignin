import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, EmptyState, SectionHeader, StatusChip } from "../../components";
import { MallMateTheme } from "../../constants";
import { getFloorPlan, getPoiIcon } from "../../mock";
import { useMallManagement } from "../../utils";

/**
 * Mall floor selector + static floor map (SCREEN_INVENTORY 43–44, 50;
 * PRD 5.12) on placeholder assets: floor chips, a static plan area with
 * percentage-positioned POI pins, and a clear "map data unavailable"
 * state for unpublished floors. No live positioning, no routing — the
 * preview says so on-screen. Capability-gated on indoor_navigation.
 */
const FloorMapScreen = ({ navigation }) => {
  const { selectedMall } = useMallManagement();
  const { available, degraded, floors } = getFloorPlan(
    selectedMall.slug,
    selectedMall.capabilities || {},
  );
  const [selectedFloorId, setSelectedFloorId] = useState(floors[0]?.id ?? null);
  const [selectedPoiId, setSelectedPoiId] = useState(null);

  const selectedFloor = floors.find((floor) => floor.id === selectedFloorId) ?? floors[0] ?? null;
  const selectedPoi = selectedFloor?.pois.find((poi) => poi.id === selectedPoiId) ?? null;

  const header = (
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
  );

  if (!available) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {header}
        <EmptyState
          icon={<Ionicons name="map-outline" size={48} color={MallMateTheme.color.textMuted} />}
          title="Indoor maps unavailable"
          message="This mall doesn't offer indoor maps in the app right now."
        />
      </SafeAreaView>
    );
  }

  const selectFloor = (floor) => {
    setSelectedFloorId(floor.id);
    setSelectedPoiId(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {header}
      <ScrollView key={selectedMall.slug} contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Floor map</Text>
          {degraded ? <StatusChip label="Limited" tone="warning" /> : null}
        </View>
        {degraded ? (
          <Text style={styles.limitedNote}>
            Indoor maps are running in limited mode — some floor data may be missing.
          </Text>
        ) : null}

        <SectionHeader title="Choose a floor" style={styles.section} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.floorRow}
        >
          {floors.map((floor) => {
            const selected = floor.id === selectedFloor?.id;
            return (
              <Pressable
                key={floor.id}
                onPress={() => selectFloor(floor)}
                accessibilityRole="button"
                accessibilityLabel={`Show ${floor.name}`}
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  styles.floorChip,
                  selected && styles.floorChipSelected,
                  pressed && !selected && styles.floorChipPressed,
                ]}
              >
                <Text style={[styles.floorLabel, selected && styles.floorLabelSelected]}>
                  {floor.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {selectedFloor ? <Text style={styles.floorName}>{selectedFloor.name}</Text> : null}

        {selectedFloor?.mapPublished ? (
          <>
            <View
              style={styles.plan}
              accessible
              accessibilityLabel={`Static floor plan preview for ${selectedFloor.name}`}
            >
              <Text style={styles.planWatermark}>Static floor plan · preview</Text>
              {selectedFloor.pois.map((poi) => {
                const selected = poi.id === selectedPoiId;
                return (
                  <Pressable
                    key={poi.id}
                    onPress={() => setSelectedPoiId(selected ? null : poi.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${poi.name}, ${poi.category}`}
                    accessibilityState={{ selected }}
                    style={[
                      styles.pin,
                      { left: `${poi.x}%`, top: `${poi.y}%` },
                      selected && styles.pinSelected,
                    ]}
                  >
                    <Ionicons
                      name={getPoiIcon(poi.category)}
                      size={16}
                      color={
                        selected ? MallMateTheme.color.background : MallMateTheme.color.primary
                      }
                    />
                  </Pressable>
                );
              })}
            </View>
            {selectedPoi ? (
              <Card style={styles.poiCard}>
                <Text style={styles.poiName}>{selectedPoi.name}</Text>
                <Text style={styles.poiMeta}>
                  {selectedPoi.category} · {selectedFloor.name}
                </Text>
              </Card>
            ) : (
              <Text style={styles.hint}>Tap a pin to see what's there.</Text>
            )}
          </>
        ) : (
          <Card style={styles.unavailableCard}>
            <Ionicons
              name="cloud-offline-outline"
              size={32}
              color={MallMateTheme.color.highlight}
              style={styles.unavailableIcon}
            />
            <Text style={styles.unavailableTitle}>Map data unavailable</Text>
            <Text style={styles.unavailableMessage}>
              A floor plan for {selectedFloor?.name ?? "this floor"} hasn't been published yet. Try
              another floor or check with guest services.
            </Text>
          </Card>
        )}

        <Text style={styles.disclaimer}>
          Static preview — no live positioning, routing or turn-by-turn navigation.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const PIN_SIZE = 30;

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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h2.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  limitedNote: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.xs,
  },
  section: {
    marginTop: MallMateTheme.spacing.lg,
  },
  floorRow: {
    gap: MallMateTheme.spacing.sm,
    paddingVertical: 2,
  },
  floorChip: {
    minWidth: MallMateTheme.touchTarget.ideal,
    minHeight: MallMateTheme.touchTarget.ideal,
    paddingHorizontal: MallMateTheme.spacing.md,
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
    backgroundColor: MallMateTheme.color.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  floorChipSelected: {
    backgroundColor: MallMateTheme.color.primary,
    borderColor: MallMateTheme.color.primary,
  },
  floorChipPressed: {
    backgroundColor: MallMateTheme.color.surfaceElevated,
  },
  floorLabel: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.button.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  floorLabelSelected: {
    color: MallMateTheme.color.background,
  },
  floorName: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.label.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.sm,
  },
  plan: {
    marginTop: MallMateTheme.spacing.md,
    aspectRatio: 4 / 3,
    borderRadius: MallMateTheme.radius.card,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: MallMateTheme.color.border,
    backgroundColor: MallMateTheme.color.surface,
  },
  planWatermark: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  pin: {
    position: "absolute",
    width: PIN_SIZE,
    height: PIN_SIZE,
    marginStart: -PIN_SIZE / 2,
    marginTop: -PIN_SIZE / 2,
    borderRadius: PIN_SIZE / 2,
    borderWidth: 1,
    borderColor: MallMateTheme.color.primary,
    backgroundColor: MallMateTheme.color.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  pinSelected: {
    backgroundColor: MallMateTheme.color.primary,
  },
  poiCard: {
    marginTop: MallMateTheme.spacing.md,
    marginBottom: 0,
  },
  poiName: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
  poiMeta: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  hint: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.sm,
  },
  unavailableCard: {
    marginTop: MallMateTheme.spacing.md,
    alignItems: "center",
    marginBottom: 0,
  },
  unavailableIcon: {
    marginBottom: MallMateTheme.spacing.sm,
  },
  unavailableTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginBottom: MallMateTheme.spacing.xs,
  },
  unavailableMessage: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    textAlign: "center",
  },
  disclaimer: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.lg,
  },
});

export default FloorMapScreen;
