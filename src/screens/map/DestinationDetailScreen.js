import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Card, EmptyState } from "../../components";
import { MallMateTheme } from "../../constants";
import { getDestinationById, getPoiIcon } from "../../mock";
import { useMallManagement } from "../../utils";

/**
 * Destination detail (SCREEN_INVENTORY 46) for a mock POI: name, category,
 * floor/location, and an entry to the manual start-point picker that leads
 * to the static route preview. No live positioning.
 */
const DestinationDetailScreen = ({ navigation, route }) => {
  const { selectedMall } = useMallManagement();
  const destinationId = route?.params?.destinationId;
  const response = getDestinationById(
    selectedMall.slug,
    selectedMall.capabilities || {},
    destinationId,
  );
  const destination = response.data;

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

  if (!destination) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {header}
        <EmptyState
          icon={
            <Ionicons name="location-outline" size={48} color={MallMateTheme.color.textMuted} />
          }
          title="Destination unavailable"
          message={response.message || "We couldn't load that destination."}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {header}
      <ScrollView key={selectedMall.slug} contentContainerStyle={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons
            name={getPoiIcon(destination.category)}
            size={32}
            color={MallMateTheme.color.primary}
          />
        </View>
        <Text style={styles.title}>{destination.name}</Text>
        <Text style={styles.category}>{destination.category}</Text>

        <Card style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Ionicons
              name="layers-outline"
              size={20}
              color={MallMateTheme.color.textSecondary}
              style={styles.detailIcon}
            />
            <View style={styles.detailBody}>
              <Text style={styles.detailLabel}>Floor</Text>
              <Text style={styles.detailValue}>{destination.floorName}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Ionicons
              name="map-outline"
              size={20}
              color={MallMateTheme.color.textSecondary}
              style={styles.detailIcon}
            />
            <View style={styles.detailBody}>
              <Text style={styles.detailLabel}>Mall</Text>
              <Text style={styles.detailValue}>{selectedMall.name}</Text>
            </View>
          </View>
        </Card>

        <Button
          label="Get directions"
          onPress={() => navigation.navigate("StartPointSelect", { destinationId: destination.id })}
          style={styles.cta}
        />
        <Text style={styles.disclaimer}>
          Preview build — routes are illustrative static steps. No live positioning.
        </Text>
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
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: MallMateTheme.radius.card,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
    backgroundColor: MallMateTheme.color.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: MallMateTheme.spacing.md,
  },
  title: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h2.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  category: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.label.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
    marginBottom: MallMateTheme.spacing.lg,
  },
  detailsCard: {
    marginBottom: 0,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: MallMateTheme.spacing.sm,
  },
  detailIcon: {
    marginEnd: MallMateTheme.spacing.md,
  },
  detailBody: {
    flex: 1,
  },
  detailLabel: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  detailValue: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    marginTop: 2,
  },
  cta: {
    marginTop: MallMateTheme.spacing.lg,
  },
  disclaimer: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.md,
    textAlign: "center",
  },
});

export default DestinationDetailScreen;
