import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ListRow, SectionHeader } from "../../components";
import { MallMateTheme } from "../../constants";
import useUserManagement from "../../utils/userData";

const FALLBACK_USER = {
  username: "Guest shopper",
  email: "guest@mallmate.app",
};

const PROFILE_ROWS = [
  {
    key: "orders",
    title: "Orders",
    subtitle: "Order history and tracking",
    icon: "receipt-outline",
    placeholder: {
      title: "Orders",
      message: "Your order history will appear here once ordering is available.",
    },
  },
  {
    key: "favorites",
    title: "Favorites",
    subtitle: "Saved merchants and offers",
    icon: "heart-outline",
    placeholder: {
      title: "Favorites",
      message: "Save merchants you love and find them here.",
    },
  },
  {
    key: "settings",
    title: "Settings",
    subtitle: "Preferences and notifications",
    icon: "settings-outline",
    route: "Settings",
  },
  {
    key: "help",
    title: "Help",
    subtitle: "Support and FAQs",
    icon: "help-circle-outline",
    placeholder: {
      title: "Help",
      message: "Support articles and contact options will appear here.",
    },
  },
  {
    key: "privacy",
    title: "Privacy",
    subtitle: "Privacy and account controls",
    icon: "shield-checkmark-outline",
    placeholder: {
      title: "Privacy",
      message: "Privacy options and account deletion controls will appear here.",
    },
  },
];

const ProfileScreen = ({ navigation }) => {
  const { userData } = useUserManagement();
  const user = userData || FALLBACK_USER;
  const displayName = user?.username || user?.name || FALLBACK_USER.username;
  const email = user?.email || FALLBACK_USER.email;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.headerBody}>
            <Text style={styles.displayName} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {email}
            </Text>
          </View>
        </View>
        <SectionHeader title="Account" style={styles.section} />
        <View style={styles.rows}>
          {PROFILE_ROWS.map((row) => (
            <ListRow
              key={row.key}
              title={row.title}
              subtitle={row.subtitle}
              leading={<Ionicons name={row.icon} size={22} color={MallMateTheme.color.primary} />}
              onPress={() => {
                if (row.route) {
                  navigation.navigate(row.route);
                } else {
                  navigation.navigate("ProfilePlaceholder", {
                    title: row.placeholder.title,
                    message: row.placeholder.message,
                  });
                }
              }}
              style={styles.row}
            />
          ))}
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
    marginLeft: MallMateTheme.spacing.lg,
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
});

export default ProfileScreen;
