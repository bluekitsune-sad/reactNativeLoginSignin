import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, EmptyState } from "../../components";
import { CAPABILITY_STATUS, MallMateTheme } from "../../constants";
import { getEventIcon, getEventList } from "../../mock";
import { useMallManagement } from "../../utils";

const BANNER_COLORS = {
  primary: MallMateTheme.color.primary,
  highlight: MallMateTheme.color.highlight,
  info: MallMateTheme.color.info,
  muted: MallMateTheme.color.textMuted,
};

/**
 * Event list (SCREEN_INVENTORY 54) on mock events (PRD 5.14):
 * capability-gated, expired events hidden upstream, placeholder banners
 * (icon + tone — real creative assets are blocked). Tapping an event
 * opens the detail page.
 */
const EventsScreen = ({ navigation }) => {
  const { selectedMall } = useMallManagement();
  const capabilityStatus = (selectedMall.capabilities || {}).events;
  const enabled =
    capabilityStatus === CAPABILITY_STATUS.ENABLED ||
    capabilityStatus === CAPABILITY_STATUS.DEGRADED;
  const events = getEventList(selectedMall.slug, selectedMall.capabilities || {});

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
      <View style={styles.headerSpacer} />
    </View>
  );

  if (!enabled) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {header}
        <EmptyState
          icon={
            <Ionicons name="calendar-outline" size={48} color={MallMateTheme.color.textMuted} />
          }
          title="Events unavailable"
          message={`This mall doesn't list events in the app right now.`}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {header}
      <ScrollView key={selectedMall.slug} contentContainerStyle={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          Events
        </Text>
        <Text style={styles.subtitle}>What's on at {selectedMall.name}</Text>
        {events.length ? (
          <View style={styles.list}>
            {events.map((event) => (
              <Card
                key={event.id}
                onPress={() => navigation.navigate("EventDetail", { eventId: event.id })}
                style={styles.eventCard}
              >
                <View
                  style={[
                    styles.banner,
                    { backgroundColor: BANNER_COLORS[event.bannerTone] ?? BANNER_COLORS.primary },
                  ]}
                >
                  <Ionicons
                    name={getEventIcon(event.category)}
                    size={32}
                    color={MallMateTheme.color.background}
                    accessibilityElementsHidden
                    importantForAccessibility="no"
                  />
                </View>
                <View style={styles.eventBody}>
                  <Text style={styles.eventCategory}>{event.category}</Text>
                  <Text style={styles.eventTitle} numberOfLines={2}>
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
        ) : (
          <EmptyState
            icon={
              <Ionicons name="calendar-outline" size={48} color={MallMateTheme.color.textMuted} />
            }
            title="No upcoming events"
            message="New events will appear here when the mall publishes them."
          />
        )}
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
  title: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h2.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  subtitle: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
    marginBottom: MallMateTheme.spacing.lg,
  },
  list: {
    gap: MallMateTheme.spacing.md,
  },
  eventCard: {
    marginBottom: 0,
    padding: 0,
    overflow: "hidden",
  },
  banner: {
    height: 84,
    alignItems: "center",
    justifyContent: "center",
  },
  eventBody: {
    padding: MallMateTheme.spacing.lg,
  },
  eventCategory: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  eventTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginBottom: MallMateTheme.spacing.xs,
  },
  eventMeta: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
});

export default EventsScreen;
