import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SectionHeader } from "../../components";
import { MallMateTheme } from "../../constants";
import { t } from "../../i18n";

const DEFAULT_PREFERENCES = {
  orderUpdates: true,
  loyaltyActivity: true,
  eventReminders: true,
  merchantAlerts: false,
  marketingOffers: false,
};

const SettingsScreen = ({ navigation }) => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  const toggle = (key) => (value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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
        <Text style={styles.headerTitle} accessibilityRole="header">
          {t("profile.settings")}
        </Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader title={t("profile.notifications")} />
        <View style={styles.card}>
          <SettingRow
            title={t("profile.orderUpdates")}
            subtitle={t("profile.orderUpdatesSubtitle")}
            value={preferences.orderUpdates}
            onValueChange={toggle("orderUpdates")}
          />
          <SettingRow
            title={t("profile.loyaltyActivity")}
            subtitle={t("profile.loyaltyActivitySubtitle")}
            value={preferences.loyaltyActivity}
            onValueChange={toggle("loyaltyActivity")}
          />
          <SettingRow
            title={t("profile.eventReminders")}
            subtitle={t("profile.eventRemindersSubtitle")}
            value={preferences.eventReminders}
            onValueChange={toggle("eventReminders")}
          />
          <SettingRow
            title={t("profile.merchantAlerts")}
            subtitle={t("profile.merchantAlertsSubtitle")}
            value={preferences.merchantAlerts}
            onValueChange={toggle("merchantAlerts")}
            isLast
          />
        </View>
        <SectionHeader title={t("profile.marketing")} style={styles.section} />
        <View style={styles.card}>
          <SettingRow
            title={t("profile.marketingOffers")}
            subtitle={t("profile.marketingOffersSubtitle")}
            value={preferences.marketingOffers}
            onValueChange={toggle("marketingOffers")}
            isLast
          />
        </View>
        <Text style={styles.footnote}>{t("profile.settingsFootnote")}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingRow = ({ title, subtitle, value, onValueChange, isLast = false }) => (
  <View style={[styles.row, isLast && styles.rowLast]}>
    <View style={styles.rowBody}>
      <Text style={styles.rowTitle}>{title}</Text>
      {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      accessibilityLabel={title}
      trackColor={{ false: MallMateTheme.color.border, true: MallMateTheme.color.primary }}
      thumbColor={MallMateTheme.color.textPrimary}
      style={styles.switch}
    />
  </View>
);

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
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h3.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginEnd: MallMateTheme.touchTarget.min,
  },
  headerSpacer: {
    width: MallMateTheme.touchTarget.min,
  },
  content: {
    padding: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xxl,
  },
  card: {
    backgroundColor: MallMateTheme.color.surface,
    borderRadius: MallMateTheme.radius.card,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
  },
  section: {
    marginTop: MallMateTheme.spacing.xl,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: MallMateTheme.spacing.lg,
    paddingVertical: MallMateTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: MallMateTheme.color.border,
    minHeight: MallMateTheme.touchTarget.ideal,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowBody: {
    flex: 1,
    paddingEnd: MallMateTheme.spacing.md,
  },
  rowTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
  rowSubtitle: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
    lineHeight: 16,
  },
  switch: {
    marginStart: MallMateTheme.spacing.sm,
  },
  footnote: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: MallMateTheme.spacing.lg,
    lineHeight: 16,
  },
});

export default SettingsScreen;
