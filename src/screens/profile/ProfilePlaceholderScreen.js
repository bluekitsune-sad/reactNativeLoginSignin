import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "../../components";
import { MallMateTheme } from "../../constants";

const ProfilePlaceholderScreen = ({ navigation, route }) => {
  const title = route?.params?.title ?? "Coming soon";
  const message = route?.params?.message ?? "This section is on the way.";

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
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.body}>
        <EmptyState
          icon={<Ionicons name="time-outline" size={48} color={MallMateTheme.color.primary} />}
          title={title}
          message={message}
        />
      </View>
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
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h3.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginRight: MallMateTheme.touchTarget.min,
  },
  headerSpacer: {
    width: MallMateTheme.touchTarget.min,
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
});

export default ProfilePlaceholderScreen;
