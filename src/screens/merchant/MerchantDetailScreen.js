import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge, Card, EmptyState, ListRow, SectionHeader, StatusChip } from "../../components";
import { MallMateTheme } from "../../constants";
import { getMerchantDetail } from "../../mock";
import { useFavorites, useMallManagement } from "../../utils";

/**
 * Merchant detail page (PRD 5.4, SCREEN_INVENTORY 23) on mock data:
 * initials logo placeholder (real branding is blocked), name, open-now
 * status, category/cuisine, floor/location, hours, active offers (expired
 * ones hidden upstream), tags, placeholder contact details, a
 * map-destination placeholder row and a menu placeholder row (menu screen
 * is a follow-up task). Mall-scoped: resolves against the selected mall.
 * Header heart toggles local favorites (SCREEN_INVENTORY 27).
 */
const MerchantDetailScreen = ({ navigation, route }) => {
  const merchantId = route?.params?.merchantId;
  const { selectedMall } = useMallManagement();
  const { isFavorite, toggleFavorite } = useFavorites();
  const merchant = getMerchantDetail(selectedMall.slug, merchantId);
  const favorited = isFavorite(merchantId);

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
      {merchant ? (
        <Pressable
          onPress={() => toggleFavorite(merchantId)}
          accessibilityRole="button"
          accessibilityLabel={favorited ? "Remove from favorites" : "Add to favorites"}
          accessibilityState={{ selected: favorited }}
          hitSlop={MallMateTheme.spacing.sm}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={favorited ? "heart" : "heart-outline"}
            size={26}
            color={favorited ? MallMateTheme.color.error : MallMateTheme.color.textPrimary}
          />
        </Pressable>
      ) : null}
    </View>
  );

  if (!merchant) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {header}
        <EmptyState
          icon={
            <Ionicons name="storefront-outline" size={48} color={MallMateTheme.color.textMuted} />
          }
          title="Merchant not found"
          message={`This merchant isn't listed at ${selectedMall.name}. It may belong to another mall.`}
        />
      </SafeAreaView>
    );
  }

  const openPlaceholder = (title, message) => {
    navigation.navigate("ProfilePlaceholder", { title, message });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {header}
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>{merchant.logoInitials}</Text>
            </View>
            <View style={styles.heroBody}>
              <Text style={styles.name} accessibilityRole="header">
                {merchant.name}
              </Text>
              <Text style={styles.category}>
                {merchant.category}
                {merchant.cuisine ? ` · ${merchant.cuisine}` : ""}
              </Text>
              <StatusChip
                label={merchant.openNow ? "Open now" : "Closed"}
                tone={merchant.openNow ? "success" : "muted"}
                style={styles.statusChip}
              />
            </View>
          </View>
          {merchant.description ? (
            <Text style={styles.description}>{merchant.description}</Text>
          ) : null}
          {merchant.tags && merchant.tags.length ? (
            <View style={styles.tags}>
              {merchant.tags.map((tag) => (
                <Badge key={tag} label={tag} tone="neutral" style={styles.tag} />
              ))}
            </View>
          ) : null}
        </Card>

        <SectionHeader title="Location" style={styles.section} />
        <ListRow
          title={merchant.floor}
          subtitle={selectedMall.name}
          leading={
            <Ionicons name="location-outline" size={20} color={MallMateTheme.color.primary} />
          }
          onPress={() =>
            openPlaceholder(
              "Map destination",
              "Directions to this merchant will open on the mall map soon.",
            )
          }
          style={styles.row}
        />

        <SectionHeader title="Hours" style={styles.section} />
        <Card>
          <Text style={styles.hours}>{merchant.hours || "Hours to be confirmed"}</Text>
          <Text style={styles.hoursNote}>
            {merchant.openNow ? "Open now" : "Closed right now"} · mock hours
          </Text>
        </Card>

        <SectionHeader title="Active offers" style={styles.section} />
        {merchant.offers && merchant.offers.length ? (
          <View style={styles.rows}>
            {merchant.offers.map((offer) => (
              <ListRow
                key={offer.id}
                title={offer.title}
                leading={<Badge label={offer.label} tone="sponsored" style={styles.offerBadge} />}
                onPress={() => navigation.navigate("OfferDetail", { offerId: offer.id })}
                style={styles.row}
              />
            ))}
          </View>
        ) : (
          <Card>
            <Text style={styles.mutedNote}>No active offers right now.</Text>
          </Card>
        )}

        <SectionHeader title="Menu" style={styles.section} />
        <ListRow
          title="View menu"
          subtitle="Sections, items and prices"
          leading={<Ionicons name="book-outline" size={20} color={MallMateTheme.color.primary} />}
          onPress={() => navigation.navigate("Menu", { merchantId: merchant.id })}
          style={styles.row}
        />

        <SectionHeader title="Contact" style={styles.section} />
        <View style={styles.rows}>
          {merchant.contact?.phone ? (
            <ListRow
              title={merchant.contact.phone}
              subtitle="Phone"
              leading={
                <Ionicons name="call-outline" size={20} color={MallMateTheme.color.primary} />
              }
              showChevron={false}
              style={styles.row}
            />
          ) : null}
          {merchant.contact?.email ? (
            <ListRow
              title={merchant.contact.email}
              subtitle="Email"
              leading={
                <Ionicons name="mail-outline" size={20} color={MallMateTheme.color.primary} />
              }
              showChevron={false}
              style={styles.row}
            />
          ) : null}
        </View>
        <Text style={styles.contactNote}>
          Placeholder contact details. Published only once a merchant approves listing them.
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
  favoriteButton: {
    minHeight: MallMateTheme.touchTarget.min,
    minWidth: MallMateTheme.touchTarget.min,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  hero: {
    marginBottom: MallMateTheme.spacing.sm,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: MallMateTheme.color.surfaceElevated,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: MallMateTheme.spacing.md,
  },
  logoText: {
    color: MallMateTheme.color.primary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.bold,
  },
  heroBody: {
    flex: 1,
  },
  name: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h3.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  category: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  statusChip: {
    marginTop: MallMateTheme.spacing.sm,
  },
  description: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.md,
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
  section: {
    marginTop: MallMateTheme.spacing.lg,
  },
  rows: {
    gap: MallMateTheme.spacing.sm,
  },
  row: {
    marginBottom: 0,
  },
  hours: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
  hoursNote: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.xs,
  },
  offerBadge: {
    marginEnd: 0,
  },
  mutedNote: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  contactNote: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.sm,
  },
});

export default MerchantDetailScreen;
