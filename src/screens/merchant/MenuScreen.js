import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge, Card, EmptyState, SectionHeader } from "../../components";
import { MallMateTheme } from "../../constants";
import { formatPrice, getMerchantDetail, getMenuForMerchant } from "../../mock";
import { useMallManagement } from "../../utils";

const priceStyle = { fontVariant: ["tabular-nums"] };

/**
 * Menu / product list screen (SCREEN_INVENTORY 24) on mock data: sections
 * with item cards, tabular-numeral prices, sold-out chips and browse-only
 * note. Tapping an item opens the item detail (SCREEN_INVENTORY 25).
 * Ordering/checkout is blocked — this screen is presentation only.
 */
const MenuScreen = ({ navigation, route }) => {
  const merchantId = route?.params?.merchantId;
  const { selectedMall } = useMallManagement();
  const merchant = getMerchantDetail(selectedMall.slug, merchantId);
  const menu = getMenuForMerchant(merchantId);

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
      <View style={styles.headerBody}>
        <Text style={styles.headerTitle} numberOfLines={1} accessibilityRole="header">
          {merchant ? `${merchant.name} menu` : "Menu"}
        </Text>
        <Text style={styles.headerMeta} numberOfLines={1}>
          {selectedMall.name}
        </Text>
      </View>
    </View>
  );

  if (!merchant) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {header}
        <EmptyState
          icon={<Ionicons name="book-outline" size={48} color={MallMateTheme.color.textMuted} />}
          title="Merchant not found"
          message={`This merchant isn't listed at ${selectedMall.name}.`}
        />
      </SafeAreaView>
    );
  }

  if (!menu || !menu.sections || !menu.sections.length) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {header}
        <EmptyState
          icon={<Ionicons name="book-outline" size={48} color={MallMateTheme.color.primary} />}
          title="No menu yet"
          message={`The menu for ${merchant.name} hasn't been published yet.`}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {header}
      <ScrollView contentContainerStyle={styles.content}>
        {menu.sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <SectionHeader title={section.title} />
            <View style={styles.items}>
              {(section.items || []).map((item) => (
                <Card
                  key={item.id}
                  onPress={() => navigation.navigate("MenuItem", { merchantId, itemId: item.id })}
                  style={styles.itemCard}
                >
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {!item.available ? (
                      <Badge label="Sold out" tone="neutral" style={styles.soldOut} />
                    ) : null}
                  </View>
                  {item.description ? (
                    <Text style={styles.itemDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  ) : null}
                  <View style={styles.itemFooter}>
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                    {item.tags && item.tags.length ? (
                      <View style={styles.tags}>
                        {item.tags.map((tag) => (
                          <Badge key={tag} label={tag} tone="neutral" style={styles.tag} />
                        ))}
                      </View>
                    ) : null}
                  </View>
                </Card>
              ))}
            </View>
          </View>
        ))}
        <Text style={styles.browseNote}>
          Browse-only preview — ordering and payment are not enabled yet.
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
  section: {
    marginBottom: MallMateTheme.spacing.lg,
  },
  items: {
    gap: MallMateTheme.spacing.sm,
  },
  itemCard: {
    minHeight: MallMateTheme.touchTarget.ideal,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemName: {
    flex: 1,
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
  soldOut: {
    marginStart: MallMateTheme.spacing.sm,
  },
  itemDescription: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.xs,
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: MallMateTheme.spacing.sm,
  },
  price: {
    color: MallMateTheme.color.primary,
    fontSize: MallMateTheme.typography.price.fontSize,
    fontFamily: MallMateTheme.fontFamily.bold,
    ...priceStyle,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: MallMateTheme.spacing.xs,
  },
  tag: {
    marginEnd: 0,
  },
  browseNote: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    textAlign: "center",
    marginTop: MallMateTheme.spacing.md,
  },
});

export default MenuScreen;
