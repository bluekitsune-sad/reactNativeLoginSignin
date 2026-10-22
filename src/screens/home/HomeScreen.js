import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge, CapabilityCard, Card, EmptyState, SectionHeader } from "../../components";
import { CAPABILITIES, CAPABILITY_META, CAPABILITY_STATUS, MallMateTheme } from "../../constants";
import { t } from "../../i18n";
import { getHomeSections } from "../../mock";
import { useMallManagement } from "../../utils";

const hoursSummary = (mall) => {
  const days = mall.openingHours?.days ?? [];
  if (!days.length) {
    return t("mall.hoursUnavailable");
  }
  const uniform = days.every(
    (day) => day.opensAt === days[0].opensAt && day.closesAt === days[0].closesAt,
  );
  if (uniform) {
    return t("mall.hoursDaily", { opensAt: days[0].opensAt, closesAt: days[0].closesAt });
  }
  return t("mall.hoursSeeWeekly");
};

const goExplore = (navigation) => navigation.navigate("Explore");

const CategoryShortcuts = ({ categories, onSelect }) => {
  if (!categories.length) {
    return null;
  }
  return (
    <View>
      <SectionHeader title={t("home.browse")} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {categories.map((category) => (
          <Pressable
            key={category.key}
            onPress={() => onSelect(category)}
            accessibilityRole="button"
            accessibilityLabel={t("home.browseCategory", { category: category.title })}
            style={({ pressed }) => [styles.categoryChip, pressed && styles.categoryChipPressed]}
          >
            <Ionicons name={category.icon} size={22} color={MallMateTheme.color.primary} />
            <Text style={styles.categoryLabel} numberOfLines={1}>
              {category.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const FeaturedCarousel = ({ items, onSelect }) => {
  if (!items.length) {
    return null;
  }
  return (
    <View>
      <SectionHeader title={t("home.featured")} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselRow}
      >
        {items.map((item) => (
          <Card key={item.id} onPress={() => onSelect(item)} style={styles.featuredCard}>
            <Badge
              label={item.placement === "SPONSORED" ? t("home.sponsored") : t("home.featured")}
              tone={item.placement === "SPONSORED" ? "sponsored" : "featured"}
              style={styles.featuredBadge}
            />
            <Text style={styles.featuredTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.featuredMerchant} numberOfLines={1}>
              {item.merchant}
            </Text>
            <Text style={styles.featuredSubtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const DiscountsSection = ({ offers, onSelect }) => {
  if (!offers.length) {
    return null;
  }
  return (
    <View>
      <SectionHeader title={t("home.activeDiscounts")} />
      {offers.map((offer) => (
        <Card key={offer.id} onPress={() => onSelect(offer)} style={styles.discountCard}>
          <View style={styles.discountLabelBox}>
            <Text style={styles.discountLabel}>{offer.label}</Text>
          </View>
          <View style={styles.discountBody}>
            <Text style={styles.discountTitle} numberOfLines={1}>
              {offer.title}
            </Text>
            <Text style={styles.discountMerchant} numberOfLines={1}>
              {offer.merchant} ·{" "}
              {offer.scope === "restaurant" ? t("home.dining") : t("home.retail")}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={MallMateTheme.color.textMuted} />
        </Card>
      ))}
    </View>
  );
};

const EventsSection = ({ events, onSelect }) => {
  if (!events.length) {
    return null;
  }
  return (
    <View>
      <SectionHeader title={t("events.title")} />
      {events.map((event) => (
        <Card key={event.id} onPress={() => onSelect(event)} style={styles.eventCard}>
          <Ionicons
            name="calendar-outline"
            size={22}
            color={MallMateTheme.color.primary}
            style={styles.eventIcon}
          />
          <View style={styles.eventBody}>
            <Text style={styles.eventTitle} numberOfLines={1}>
              {event.title}
            </Text>
            <Text style={styles.eventMeta} numberOfLines={1}>
              {event.when}
            </Text>
            <Text style={styles.eventMeta} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
};

const TopSellingSection = ({ topSelling, onSelect }) => {
  if (!topSelling) {
    return null;
  }
  const { disclosure, restaurants, retail } = topSelling;
  const groups = [
    { key: "restaurants", title: t("home.topRestaurants"), items: restaurants },
    { key: "retail", title: t("home.topRetail"), items: retail },
  ].filter((group) => group.items.length > 0);
  if (!groups.length) {
    return null;
  }
  return (
    <View>
      <SectionHeader title={t("home.popularNow")} />
      <Text style={styles.disclosure} accessibilityLabel={disclosure}>
        {disclosure}
      </Text>
      {groups.map((group) => (
        <View key={group.key} style={styles.topGroup}>
          <Text style={styles.topGroupTitle}>{group.title}</Text>
          {group.items.map((item, index) => (
            <Card key={item.id} onPress={() => onSelect(item)} style={styles.topRow}>
              <View style={styles.topRankBox}>
                <Text style={styles.topRank}>{index + 1}</Text>
              </View>
              <View style={styles.topBody}>
                <Text style={styles.topMerchant} numberOfLines={1}>
                  {item.merchant}
                </Text>
                {item.note ? (
                  <Text style={styles.topNote} numberOfLines={1}>
                    {item.note}
                  </Text>
                ) : null}
              </View>
            </Card>
          ))}
        </View>
      ))}
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const { selectedMall } = useMallManagement();
  const capabilityMap = selectedMall.capabilities || {};
  const visibleCapabilities = Object.values(CAPABILITIES).filter((key) => {
    const status = capabilityMap[key];
    return status === CAPABILITY_STATUS.ENABLED || status === CAPABILITY_STATUS.DEGRADED;
  });
  const { categories, featured, discounts, events, topSelling } = getHomeSections(
    selectedMall.slug,
    capabilityMap,
  );
  const hasContent =
    categories.length > 0 ||
    featured.length > 0 ||
    discounts.length > 0 ||
    events.length > 0 ||
    !!topSelling;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Pressable
        onPress={() => navigation.navigate("MallSelector")}
        accessibilityRole="button"
        accessibilityLabel={t("home.mallBarAccessibility", { mall: selectedMall.name })}
        style={styles.mallBar}
      >
        <Ionicons name="storefront-outline" size={22} color={MallMateTheme.color.primary} />
        <View style={styles.mallBarBody}>
          <Text style={styles.mallBarLabel}>{t("home.shoppingAt")}</Text>
          <Text style={styles.mallBarName}>{selectedMall.name}</Text>
          <Text style={styles.mallBarMeta} numberOfLines={1}>
            {selectedMall.address} · {hoursSummary(selectedMall)}
          </Text>
        </View>
        <Text style={styles.mallBarAction}>{t("mall.switchMall")}</Text>
        <Ionicons name="chevron-down" size={20} color={MallMateTheme.color.textMuted} />
      </Pressable>
      <ScrollView key={selectedMall.slug} contentContainerStyle={styles.content}>
        <CategoryShortcuts categories={categories} onSelect={() => goExplore(navigation)} />
        <FeaturedCarousel items={featured} onSelect={() => goExplore(navigation)} />
        <View>
          <SectionHeader title={t("home.services")} />
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
            <EmptyState title={t("home.noServicesTitle")} message={t("home.noServicesMessage")} />
          )}
        </View>
        <DiscountsSection
          offers={discounts}
          onSelect={(offer) => navigation.navigate("OfferDetail", { offerId: offer.id })}
        />
        <EventsSection
          events={events}
          onSelect={(event) => navigation.navigate("EventDetail", { eventId: event.id })}
        />
        <TopSellingSection topSelling={topSelling} onSelect={() => goExplore(navigation)} />
        {!hasContent ? (
          <EmptyState title={t("home.emptyTitle")} message={t("home.emptyMessage")} />
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
  mallBarAction: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    marginEnd: MallMateTheme.spacing.sm,
  },
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryRow: {
    paddingBottom: MallMateTheme.spacing.xs,
    gap: MallMateTheme.spacing.sm,
  },
  categoryChip: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 72,
    minHeight: MallMateTheme.touchTarget.ideal,
    paddingVertical: MallMateTheme.spacing.sm,
    paddingHorizontal: MallMateTheme.spacing.md,
    backgroundColor: MallMateTheme.color.surface,
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
  },
  categoryChipPressed: {
    backgroundColor: MallMateTheme.color.surfaceElevated,
  },
  categoryLabel: {
    marginTop: MallMateTheme.spacing.xs,
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
  carouselRow: {
    paddingBottom: MallMateTheme.spacing.xs,
    gap: MallMateTheme.spacing.md,
  },
  featuredCard: {
    width: 220,
  },
  featuredBadge: {
    marginBottom: MallMateTheme.spacing.sm,
  },
  featuredTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginBottom: 2,
  },
  featuredMerchant: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.label.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
  featuredSubtitle: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  discountCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: MallMateTheme.spacing.md,
    padding: MallMateTheme.spacing.md,
  },
  discountLabelBox: {
    backgroundColor: MallMateTheme.color.highlight,
    borderRadius: MallMateTheme.radius.control / 2,
    paddingHorizontal: MallMateTheme.spacing.sm,
    paddingVertical: MallMateTheme.spacing.xs,
    marginEnd: MallMateTheme.spacing.md,
  },
  discountLabel: {
    color: MallMateTheme.color.background,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.bold,
  },
  discountBody: {
    flex: 1,
  },
  discountTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginBottom: 2,
  },
  discountMerchant: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: MallMateTheme.spacing.md,
    padding: MallMateTheme.spacing.md,
  },
  eventIcon: {
    marginEnd: MallMateTheme.spacing.md,
    marginTop: 2,
  },
  eventBody: {
    flex: 1,
  },
  eventTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginBottom: 2,
  },
  eventMeta: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  disclosure: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginBottom: MallMateTheme.spacing.md,
  },
  topGroup: {
    marginBottom: MallMateTheme.spacing.md,
  },
  topGroupTitle: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.label.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    marginBottom: MallMateTheme.spacing.sm,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: MallMateTheme.spacing.sm,
    padding: MallMateTheme.spacing.md,
  },
  topRankBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MallMateTheme.color.surfaceElevated,
    borderWidth: 1,
    borderColor: MallMateTheme.color.primary,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: MallMateTheme.spacing.md,
  },
  topRank: {
    color: MallMateTheme.color.primary,
    fontSize: MallMateTheme.typography.label.fontSize,
    fontFamily: MallMateTheme.fontFamily.bold,
  },
  topBody: {
    flex: 1,
  },
  topMerchant: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  topNote: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
});

export default HomeScreen;
