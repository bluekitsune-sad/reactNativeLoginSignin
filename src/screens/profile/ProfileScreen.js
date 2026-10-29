import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ListRow, SectionHeader } from "../../components";
import { MallMateTheme } from "../../constants";
import { t } from "../../i18n";
import { useUserManagement } from "../../utils";

const PROFILE_ROWS = [
  {
    key: "orders",
    titleKey: "profile.orders",
    subtitleKey: "profile.ordersSubtitle",
    icon: "receipt-outline",
    route: "OrderHistory",
  },
  {
    key: "favorites",
    titleKey: "profile.favorites",
    subtitleKey: "profile.favoritesSubtitle",
    icon: "heart-outline",
    route: "Favorites",
  },
  {
    key: "settings",
    titleKey: "profile.settings",
    subtitleKey: "profile.settingsSubtitle",
    icon: "settings-outline",
    route: "Settings",
  },
  {
    key: "help",
    titleKey: "profile.help",
    subtitleKey: "profile.helpSubtitle",
    icon: "help-circle-outline",
    placeholder: {
      titleKey: "profile.help",
      messageKey: "profile.helpMessage",
    },
  },
  {
    key: "privacy",
    titleKey: "profile.privacy",
    subtitleKey: "profile.privacySubtitle",
    icon: "shield-checkmark-outline",
    placeholder: {
      titleKey: "profile.privacy",
      messageKey: "profile.privacyMessage",
    },
  },
];

const ProfileScreen = ({ navigation }) => {
  const { userData, resetUser } = useUserManagement();
  const user = userData;
  const displayName = user?.username || user?.name || t("profile.guestName");
  const email = user?.email || t("profile.guestEmail");
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = () => {
    resetUser();
    navigation.reset({ index: 0, routes: [{ name: "Signin" }] });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.headerBody}>
            <Text style={styles.displayName} numberOfLines={1} accessibilityRole="header">
              {displayName}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {email}
            </Text>
          </View>
        </View>
        <SectionHeader title={t("profile.account")} style={styles.section} />
        <View style={styles.rows}>
          {PROFILE_ROWS.map((row) => (
            <ListRow
              key={row.key}
              title={t(row.titleKey)}
              subtitle={t(row.subtitleKey)}
              leading={<Ionicons name={row.icon} size={22} color={MallMateTheme.color.primary} />}
              onPress={() => {
                if (row.route) {
                  navigation.navigate(row.route);
                } else {
                  navigation.navigate("ProfilePlaceholder", {
                    title: t(row.placeholder.titleKey),
                    message: t(row.placeholder.messageKey),
                  });
                }
              }}
              style={styles.row}
            />
          ))}
          <ListRow
            title={t("profile.signOut")}
            subtitle={t("profile.signOutSubtitle")}
            leading={
              <Ionicons name="log-out-outline" size={22} color={MallMateTheme.color.error} />
            }
            titleColor={MallMateTheme.color.error}
            onPress={handleSignOut}
            style={styles.signOutRow}
          />
        </View>
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
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MallMateTheme.color.surface,
    borderRadius: MallMateTheme.radius.card,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
    padding: MallMateTheme.spacing.lg,
    marginBottom: MallMateTheme.spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: MallMateTheme.color.surfaceElevated,
    borderWidth: 1,
    borderColor: MallMateTheme.color.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: MallMateTheme.color.primary,
    fontSize: MallMateTheme.typography.h3.fontSize,
    fontFamily: MallMateTheme.fontFamily.bold,
  },
  headerBody: {
    flex: 1,
    marginStart: MallMateTheme.spacing.lg,
  },
  displayName: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  email: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginTop: 2,
  },
  section: {
    marginTop: MallMateTheme.spacing.sm,
  },
  rows: {
    gap: MallMateTheme.spacing.sm,
  },
  row: {
    marginBottom: 0,
  },
  signOutRow: {
    marginTop: MallMateTheme.spacing.md,
  },
});

export default ProfileScreen;
