import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, EmptyState, ListRow } from "../../components";
import { CAPABILITY_STATUS, MallMateTheme } from "../../constants";
import { t } from "../../i18n";
import { useMallManagement } from "../../utils";

/**
 * Map tab landing: capability-gated entry to the static floor map
 * (SCREEN_INVENTORY 43–44) and destination search / route preview
 * (SCREEN_INVENTORY 45–49). Live positioning and real routing arrive
 * with mall map integration.
 */
const MapScreen = ({ navigation }) => {
  const { selectedMall } = useMallManagement();
  const status = (selectedMall.capabilities || {}).indoor_navigation;
  const enabled = status === CAPABILITY_STATUS.ENABLED || status === CAPABILITY_STATUS.DEGRADED;

  if (!enabled) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <EmptyState
          icon={<Ionicons name="map-outline" size={48} color={MallMateTheme.color.textMuted} />}
          title={t("mall.mapsUnavailable")}
          message={t("maps.unavailableMessage", { mall: selectedMall.name })}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle} accessibilityRole="header">
          {t("maps.title")}
        </Text>
        <Text style={styles.headerMeta} numberOfLines={1}>
          {selectedMall.name}
        </Text>
        <ListRow
          title={t("maps.floorMap")}
          subtitle={t("maps.floorMapSubtitle")}
          leading={<Ionicons name="map-outline" size={22} color={MallMateTheme.color.primary} />}
          onPress={() => navigation.navigate("FloorMap")}
          style={styles.row}
        />
        <ListRow
          title={t("maps.findDestination")}
          subtitle={t("maps.findDestinationSubtitle")}
          leading={
            <Ionicons name="navigate-outline" size={22} color={MallMateTheme.color.primary} />
          }
          onPress={() => navigation.navigate("DestinationSearch")}
          style={styles.row}
        />
        <Card style={styles.noteCard}>
          <Text style={styles.note}>{t("maps.tabNote")}</Text>
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
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
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
  row: {
    marginBottom: 0,
  },
  noteCard: {
    marginTop: MallMateTheme.spacing.lg,
  },
  note: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
});

export default MapScreen;
