import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, EmptyState, ListRow, SectionHeader } from "../../components";
import { MallMateTheme } from "../../constants";
import { getExploreContent } from "../../mock";
import { useMallManagement } from "../../utils";

const DIRECTORY_PLACEHOLDERS = {
  restaurants: {
    title: "Restaurants",
    message: "The full restaurant list for this mall will appear here.",
  },
  outlets: {
    title: "Outlets",
    message: "The full outlet list for this mall will appear here.",
  },
  "food-court": {
    title: "Food court",
    message: "Food-court zones and vendors will appear here.",
  },
  offers: {
    title: "Offers",
    message: "All active offers and coupons will appear here.",
  },
  events: {
    title: "Events",
    message: "Upcoming mall events will appear here.",
  },
};

const CATEGORY_PLACEHOLDER = {
  title: "Category",
  message: "Merchants in this category will appear here.",
};

const ExploreScreen = ({ navigation }) => {
  const { selectedMall } = useMallManagement();
  const { directories, categoryGrid } = getExploreContent(
    selectedMall.slug,
    selectedMall.capabilities || {},
  );

  const openPlaceholder = (entry) => {
    const fallback = { title: entry.title, message: "Merchants in this section will appear here." };
    const placeholder =
      entry.key && DIRECTORY_PLACEHOLDERS[entry.key] ? DIRECTORY_PLACEHOLDERS[entry.key] : fallback;
    navigation.navigate("ProfilePlaceholder", {
      title: placeholder.title,
      message: placeholder.message,
    });
  };

  const openCategory = (category) => {
    navigation.navigate("ProfilePlaceholder", {
      title: category.title,
      message: CATEGORY_PLACEHOLDER.message,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView key={selectedMall.slug} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
          <Text style={styles.headerMeta} numberOfLines={1}>
            {selectedMall.name}
          </Text>
        </View>
        <Pressable
          onPress={() =>
            navigation.navigate("ProfilePlaceholder", {
              title: "Search",
              message: "Search across restaurants, outlets and offers is coming soon.",
            })
          }
          accessibilityRole="button"
          accessibilityLabel="Search this mall"
          style={({ pressed }) => [styles.searchBar, pressed && styles.searchBarPressed]}
        >
          <Ionicons name="search-outline" size={20} color={MallMateTheme.color.textMuted} />
          <Text style={styles.searchPlaceholder}>Search restaurants, outlets, offers</Text>
        </Pressable>

        <SectionHeader title="Browse by type" style={styles.section} />
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
                onPress={() => openPlaceholder(entry)}
                style={styles.row}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title="Nothing to browse yet"
            message="Directory sections will appear when this mall enables them."
          />
        )}

        {categoryGrid.length ? (
          <>
            <SectionHeader title="Categories" style={styles.section} />
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
    marginLeft: MallMateTheme.spacing.sm,
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
