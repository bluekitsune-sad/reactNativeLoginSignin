import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, EmptyState, ListRow, SectionHeader } from "../../components";
import { MallMateTheme } from "../../constants";
import { t } from "../../i18n";
import { getExploreContent } from "../../mock";
import { useMallManagement } from "../../utils";

const DIRECTORY_PLACEHOLDERS = {
  offers: {
    titleKey: "explore.offersPlaceholderTitle",
    messageKey: "explore.offersPlaceholderMessage",
  },
};

const DIRECTORY_ROUTES = {
  restaurants: "RestaurantList",
  outlets: "OutletList",
  "food-court": "FoodCourt",
  events: "Events",
};

const CATEGORY_PLACEHOLDER = {
  messageKey: "explore.categoryPlaceholderMessage",
};

const ExploreScreen = ({ navigation }) => {
  const { selectedMall } = useMallManagement();
  const { directories, categoryGrid } = getExploreContent(
    selectedMall.slug,
    selectedMall.capabilities || {},
  );

  const openDirectory = (entry) => {
    if (entry.key && DIRECTORY_ROUTES[entry.key]) {
      navigation.navigate(DIRECTORY_ROUTES[entry.key]);
      return;
    }
    const fallback = { title: entry.title, messageKey: "explore.sectionPlaceholderMessage" };
    const placeholder =
      entry.key && DIRECTORY_PLACEHOLDERS[entry.key] ? DIRECTORY_PLACEHOLDERS[entry.key] : fallback;
    navigation.navigate("ProfilePlaceholder", {
      title: placeholder.titleKey ? t(placeholder.titleKey) : placeholder.title,
      message: t(placeholder.messageKey),
    });
  };

  const openCategory = (category) => {
    navigation.navigate("ProfilePlaceholder", {
      title: category.title,
      message: t(CATEGORY_PLACEHOLDER.messageKey),
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView key={selectedMall.slug} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle} accessibilityRole="header">
            {t("explore.title")}
          </Text>
          <Text style={styles.headerMeta} numberOfLines={1}>
            {selectedMall.name}
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate("Search")}
          accessibilityRole="button"
          accessibilityLabel={t("explore.searchA11y")}
          style={({ pressed }) => [styles.searchBar, pressed && styles.searchBarPressed]}
        >
          <Ionicons name="search-outline" size={20} color={MallMateTheme.color.textMuted} />
          <Text style={styles.searchPlaceholder}>{t("explore.searchPlaceholder")}</Text>
        </Pressable>

        <SectionHeader title={t("explore.browseByType")} style={styles.section} />
        {directories.length ? (
          <View style={styles.rows}>
            {directories.map((entry) => (
              <ListRow
                key={entry.key}
                title={entry.title}
                subtitle={entry.subtitle}
                leading={
                  <Ionicons name={entry.icon} size={22} color={MallMateTheme.color.primary} />
                }
                onPress={() => openDirectory(entry)}
                style={styles.row}
              />
            ))}
          </View>
        ) : (
          <EmptyState title={t("explore.emptyTitle")} message={t("explore.emptyMessage")} />
        )}

        {categoryGrid.length ? (
          <>
            <SectionHeader title={t("explore.categories")} style={styles.section} />
            <View style={styles.grid}>
              {categoryGrid.map((category) => (
                <Card
                  key={category.key}
                  onPress={() => openCategory(category)}
                  style={styles.categoryCard}
                >
                  <Ionicons
                    name={category.icon}
                    size={24}
                    color={MallMateTheme.color.primary}
                    style={styles.categoryIcon}
                  />
                  <Text style={styles.categoryTitle} numberOfLines={1}>
                    {category.title}
                  </Text>
                </Card>
              ))}
            </View>
          </>
        ) : null}
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
  header: {
    marginBottom: MallMateTheme.spacing.md,
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
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: MallMateTheme.touchTarget.ideal,
    paddingHorizontal: MallMateTheme.spacing.md,
    backgroundColor: MallMateTheme.color.surface,
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
  },
  searchBarPressed: {
    backgroundColor: MallMateTheme.color.surfaceElevated,
  },
  searchPlaceholder: {
    marginStart: MallMateTheme.spacing.sm,
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  section: {
    marginTop: MallMateTheme.spacing.lg,
  },
  rows: {
    gap: MallMateTheme.spacing.sm,
  },
  row: {
    marginBottom: 0,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    flexGrow: 1,
    flexBasis: "45%",
    marginBottom: MallMateTheme.spacing.md,
    padding: MallMateTheme.spacing.md,
    minHeight: MallMateTheme.touchTarget.ideal,
  },
  categoryIcon: {
    marginBottom: MallMateTheme.spacing.sm,
  },
  categoryTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
});

export default ExploreScreen;
