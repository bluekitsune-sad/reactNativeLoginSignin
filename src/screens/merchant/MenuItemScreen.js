import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge, Card, EmptyState, StatusChip } from "../../components";
import { MallMateTheme } from "../../constants";
import { t } from "../../i18n";
import { formatPrice, getMerchantDetail, getMenuItemById } from "../../mock";
import { useMallManagement } from "../../utils";

const priceStyle = { fontVariant: ["tabular-nums"] };

/**
 * Menu item / product detail screen (SCREEN_INVENTORY 25) on mock data:
 * item name, description, tabular-numeral price, availability status,
 * tags and the owning section/merchant context. Browse-only — no add to
 * cart or ordering (blocked).
 */
const MenuItemScreen = ({ navigation, route }) => {
  const merchantId = route?.params?.merchantId;
  const itemId = route?.params?.itemId;
  const { selectedMall } = useMallManagement();
  const merchant = getMerchantDetail(selectedMall.slug, merchantId);
  const resolved = getMenuItemById(merchantId, itemId);

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
      <Text style={styles.headerMeta} numberOfLines={1}>
        {merchant
          ? t("menu.itemHeader", { merchant: merchant.name })
          : t("menu.itemFallbackHeader")}
      </Text>
    </View>
  );

  if (!merchant || !resolved) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {header}
        <EmptyState
          icon={
            <Ionicons name="fast-food-outline" size={48} color={MallMateTheme.color.textMuted} />
          }
          title={t("menu.itemNotFoundTitle")}
          message={t("menu.itemNotFoundMessage")}
        />
      </SafeAreaView>
    );
  }

  const { item, section } = resolved;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {header}
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.sectionCaption}>{section.title}</Text>
          <Text style={styles.name} accessibilityRole="header">
            {item.name}
          </Text>
          <View style={styles.statusRow}>
            <StatusChip
              label={item.available ? t("menu.available") : t("menu.soldOut")}
              tone={item.available ? "success" : "error"}
            />
          </View>
          {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
            <Text style={styles.currencyNote}>{t("menu.inclTaxes")}</Text>
          </View>
          {item.tags && item.tags.length ? (
            <View style={styles.tags}>
              {item.tags.map((tag) => (
                <Badge key={tag} label={tag} tone="neutral" style={styles.tag} />
              ))}
            </View>
          ) : null}
        </Card>

        <Card style={styles.note}>
          <Text style={styles.noteText}>{t("menu.browseOnlyItemNote")}</Text>
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
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  sectionCaption: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    textTransform: "uppercase",
  },
  name: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h2.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginTop: MallMateTheme.spacing.xs,
  },
  statusRow: {
    marginTop: MallMateTheme.spacing.sm,
  },
  description: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.md,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: MallMateTheme.spacing.lg,
  },
  price: {
    color: MallMateTheme.color.primary,
    fontSize: MallMateTheme.typography.display.fontSize,
    fontFamily: MallMateTheme.fontFamily.bold,
    ...priceStyle,
  },
  currencyNote: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: MallMateTheme.spacing.sm,
    marginTop: MallMateTheme.spacing.md,
  },
  tag: {
    marginEnd: 0,
  },
  note: {
    marginTop: MallMateTheme.spacing.lg,
  },
  noteText: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
});

export default MenuItemScreen;
