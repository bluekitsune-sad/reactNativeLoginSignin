import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CapabilityCard, EmptyState, SectionHeader } from "../../components";
import { CAPABILITIES, CAPABILITY_META, CAPABILITY_STATUS, MallMateTheme } from "../../constants";
import { useMallManagement } from "../../utils";

const hoursSummary = (mall) => {
  const days = mall.openingHours?.days ?? [];
  if (!days.length) {
    return "Hours unavailable";
  }
  const uniform = days.every(
    (day) => day.opensAt === days[0].opensAt && day.closesAt === days[0].closesAt,
  );
  if (uniform) {
    return `Daily ${days[0].opensAt}–${days[0].closesAt}`;
  }
  return "See weekly hours";
};

const HomeScreen = ({ navigation }) => {
  const { selectedMall } = useMallManagement();
  const capabilityMap = selectedMall.capabilities || {};
  const visibleCapabilities = Object.values(CAPABILITIES).filter((key) => {
    const status = capabilityMap[key];
    return status === CAPABILITY_STATUS.ENABLED || status === CAPABILITY_STATUS.DEGRADED;
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Pressable
        onPress={() => navigation.navigate("MallSelector")}
        accessibilityRole="button"
        accessibilityLabel={`Selected mall: ${selectedMall.name}. Change mall.`}
        style={styles.mallBar}
      >
        <Ionicons name="storefront-outline" size={22} color={MallMateTheme.color.primary} />
        <View style={styles.mallBarBody}>
          <Text style={styles.mallBarLabel}>Shopping at</Text>
          <Text style={styles.mallBarName}>{selectedMall.name}</Text>
          <Text style={styles.mallBarMeta} numberOfLines={1}>
            {selectedMall.address} · {hoursSummary(selectedMall)}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={MallMateTheme.color.textMuted} />
      </Pressable>
      <ScrollView key={selectedMall.slug} contentContainerStyle={styles.content}>
        <SectionHeader title="Services" />
        {visibleCapabilities.length ? (
          <View style={styles.grid}>
            {visibleCapabilities.map((key) => {
              const meta = CAPABILITY_META[key];
              const degraded = capabilityMap[key] === CAPABILITY_STATUS.DEGRADED;
              return (
                <CapabilityCard
                  key={key}
                  title={meta.title}
                  description={meta.description}
                  icon={meta.icon}
                  degraded={degraded}
                />
              );
            })}
          </View>
        ) : (
          <EmptyState
            title="No services yet"
            message="This mall has no enabled services right now."
          />
        )}
        <EmptyState
          title="More coming soon"
          message="Categories, offers and events will appear here."
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MallMateTheme.color.background,
  },
  mallBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: MallMateTheme.spacing.lg,
    marginTop: MallMateTheme.spacing.sm,
    padding: MallMateTheme.spacing.md,
    minHeight: MallMateTheme.touchTarget.ideal,
    backgroundColor: MallMateTheme.color.surface,
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
  },
  mallBarBody: {
    flex: 1,
    marginHorizontal: MallMateTheme.spacing.md,
  },
  mallBarLabel: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  mallBarName: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  mallBarMeta: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  content: {
    padding: MallMateTheme.spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default HomeScreen;
