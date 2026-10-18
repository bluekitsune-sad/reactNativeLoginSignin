import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "../../components";
import { MallMateTheme } from "../../constants";
import { MALLS } from "../../mock/malls";
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

const MallSelectorScreen = ({ navigation }) => {
  const { selectedMall, selectMall } = useMallManagement();

  const onSelect = (mall) => {
    selectMall(mall);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={MallMateTheme.spacing.sm}
        >
          <Ionicons name="chevron-back-outline" size={28} color={MallMateTheme.color.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Choose a mall</Text>
        <View style={styles.headerSpacer} />
      </View>
      <FlatList
        data={MALLS}
        keyExtractor={(mall) => mall.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isSelected = item.slug === selectedMall.slug;
          return (
            <Card onPress={() => onSelect(item)} style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.logoPlaceholderText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.mallName}>{item.name}</Text>
                  <Text style={styles.mallMeta}>{item.address}</Text>
                  <Text style={styles.mallMeta}>{hoursSummary(item)}</Text>
                </View>
                {isSelected ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={MallMateTheme.color.primary}
                    accessibilityLabel="Selected"
                  />
                ) : null}
              </View>
            </Card>
          );
        }}
      />
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
    minHeight: MallMateTheme.touchTarget.ideal,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  headerSpacer: {
    width: 28,
  },
  list: {
    padding: MallMateTheme.spacing.lg,
  },
  card: {
    marginBottom: MallMateTheme.spacing.md,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: MallMateTheme.radius.control,
    backgroundColor: MallMateTheme.color.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    marginRight: MallMateTheme.spacing.md,
  },
  logoPlaceholderText: {
    color: MallMateTheme.color.primary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.bold,
  },
  cardBody: {
    flex: 1,
  },
  mallName: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginBottom: 2,
  },
  mallMeta: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
});

export default MallSelectorScreen;
