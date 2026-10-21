import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, EmptyState, ListRow, SectionHeader } from "../../components";
import { MallMateTheme } from "../../constants";
import { t } from "../../i18n";
import { getEventById, getEventIcon } from "../../mock";
import { useMallManagement } from "../../utils";

const BANNER_COLORS = {
  primary: MallMateTheme.color.primary,
  highlight: MallMateTheme.color.highlight,
  info: MallMateTheme.color.info,
  muted: MallMateTheme.color.textMuted,
};

/**
 * Event detail (SCREEN_INVENTORY 55, PRD 5.14) on mock events: placeholder
 * banner, time/location/organizer, description and a registration-link
 * placeholder row (56 — the handoff itself is not wired yet). Expired or
 * unknown ids show an unavailable state, matching the offers pattern.
 */
const EventDetailScreen = ({ navigation, route }) => {
  const { selectedMall } = useMallManagement();
  const eventId = route?.params?.eventId;
  const event = getEventById(eventId);

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
        {selectedMall.name}
      </Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  if (!event) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {header}
        <EmptyState
          icon={
            <Ionicons name="calendar-outline" size={48} color={MallMateTheme.color.textMuted} />
          }
          title={t("events.detailUnavailableTitle")}
          message={t("events.detailUnavailableMessage")}
        />
      </SafeAreaView>
    );
  }

  const openRegistrationPlaceholder = () => {
    navigation.navigate("ProfilePlaceholder", {
      title: t("events.registrationPlaceholderTitle"),
      message: t("events.registrationPlaceholderMessage"),
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {header}
      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.banner,
            { backgroundColor: BANNER_COLORS[event.bannerTone] ?? BANNER_COLORS.primary },
          ]}
        >
          <Ionicons
            name={getEventIcon(event.category)}
            size={44}
            color={MallMateTheme.color.background}
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        </View>

        <Text style={styles.category}>{event.category}</Text>
        <Text style={styles.title} accessibilityRole="header">
          {event.title}
        </Text>
        <Text style={styles.subtitle}>{event.subtitle}</Text>

        <Card style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Ionicons
              name="time-outline"
              size={20}
              color={MallMateTheme.color.primary}
              style={styles.detailIcon}
            />
            <Text style={styles.detailText}>{event.when}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons
              name="location-outline"
              size={20}
              color={MallMateTheme.color.primary}
              style={styles.detailIcon}
            />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons
              name="person-outline"
              size={20}
              color={MallMateTheme.color.primary}
              style={styles.detailIcon}
            />
            <Text style={styles.detailText}>
              {t("events.organisedBy", { organizer: event.organizer })}
            </Text>
          </View>
          {event.capacity ? (
            <View style={styles.detailRow}>
              <Ionicons
                name="people-outline"
                size={20}
                color={MallMateTheme.color.primary}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>
                {t("events.capacity", { capacity: event.capacity })}
              </Text>
            </View>
          ) : null}
        </Card>

        <SectionHeader title={t("events.about")} style={styles.section} />
        <Card>
          <Text style={styles.description}>{event.description}</Text>
        </Card>

        <SectionHeader title={t("events.registrationPlaceholderTitle")} style={styles.section} />
        <ListRow
          title={t("events.registerTitle")}
          subtitle={t("events.registerSubtitle")}
          leading={<Ionicons name="ticket-outline" size={20} color={MallMateTheme.color.primary} />}
          onPress={openRegistrationPlaceholder}
          style={styles.row}
        />
        <Text style={styles.note}>{t("events.registerNote")}</Text>
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
  headerSpacer: {
    width: MallMateTheme.touchTarget.min,
  },
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  banner: {
    height: 120,
    borderRadius: MallMateTheme.radius.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: MallMateTheme.spacing.lg,
  },
  category: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  title: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h2.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  subtitle: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
    marginBottom: MallMateTheme.spacing.md,
  },
  detailsCard: {
    marginBottom: 0,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: MallMateTheme.spacing.sm,
  },
  detailIcon: {
    marginEnd: MallMateTheme.spacing.md,
  },
  detailText: {
    flex: 1,
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  section: {
    marginTop: MallMateTheme.spacing.lg,
  },
  description: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    lineHeight: 22,
  },
  row: {
    marginBottom: 0,
  },
  note: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.sm,
  },
});

export default EventDetailScreen;
