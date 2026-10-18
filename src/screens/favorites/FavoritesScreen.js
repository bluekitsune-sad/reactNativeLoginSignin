import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState, ListRow } from "../../components";
import { MallMateTheme } from "../../constants";
import { getMerchantDetail } from "../../mock";
import { useFavorites, useMallManagement } from "../../utils";

/**
 * Favorites screen (SCREEN_INVENTORY 27): locally saved merchants for the
 * selected mall, persisted with AsyncStorage via the FavoritesProvider.
 * Rows open the merchant detail; the trailing heart removes a favorite.
 * Empty state explains how to save merchants.
 */
const FavoritesScreen = ({ navigation }) => {
  const { selectedMall } = useMallManagement();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const merchants = favoriteIds
    .map((id) => getMerchantDetail(selectedMall.slug, id))
    .filter(Boolean);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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
        <View style={styles.headerBody}>
          <Text style={styles.headerTitle}>Favorites</Text>
          <Text style={styles.headerMeta} numberOfLines={1}>
            {selectedMall.name}
          </Text>
        </View>
      </View>

      {merchants.length === 0 ? (
        <EmptyState
          icon={<Ionicons name="heart-outline" size={48} color={MallMateTheme.color.primary} />}
          title="No favorites yet"
          message={`Tap the heart on a merchant page to save it here. Favorites at ${selectedMall.name} will appear in this list.`}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.caption}>
            Saved on this device · {merchants.length} merchant{merchants.length === 1 ? "" : "s"}
          </Text>
          <View style={styles.rows}>
            {merchants.map((merchant) => (
              <ListRow
                key={merchant.id}
                title={merchant.name}
                subtitle={`${merchant.category}${merchant.cuisine ? ` · ${merchant.cuisine}` : ""} · ${merchant.floor}`}
                leading={
                  <Ionicons
                    name="storefront-outline"
                    size={20}
                    color={MallMateTheme.color.primary}
                  />
                }
                trailing={
                  <Pressable
                    onPress={() => toggleFavorite(merchant.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${merchant.name} from favorites`}
                    hitSlop={MallMateTheme.spacing.sm}
                    style={styles.heartButton}
                  >
                    <Ionicons name="heart" size={22} color={MallMateTheme.color.error} />
                  </Pressable>
                }
                onPress={() => navigation.navigate("MerchantDetail", { merchantId: merchant.id })}
                style={styles.row}
              />
            ))}
          </View>
        </ScrollView>
      )}
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
  headerBody: {
    flex: 1,
  },
  headerTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h3.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  headerMeta: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  caption: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginBottom: MallMateTheme.spacing.sm,
  },
  rows: {
    gap: MallMateTheme.spacing.sm,
  },
  row: {
    marginBottom: 0,
  },
  heartButton: {
    minHeight: MallMateTheme.touchTarget.min,
    minWidth: MallMateTheme.touchTarget.min,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FavoritesScreen;
