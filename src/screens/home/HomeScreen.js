import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "../../components";
import { MallMateTheme } from "../../constants";
import { useMallManagement } from "../../utils";

const HomeScreen = ({ navigation }) => {
  const { selectedMall } = useMallManagement();
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Pressable
        onPress={() => navigation.navigate("MallSelector")}
        accessibilityRole="button"
        accessibilityLabel={`Selected mall: ${selectedMall.name}. Change mall.`}
        style={styles.mallBar}
      >
        <Ionicons name="storefront-outline" size={22} color={MallMateTheme.color.primary} />
        <View style={styles.mallBarBody}>
          <Text style={styles.mallBarLabel}>Shopping at</Text>
          <Text style={styles.mallBarName}>{selectedMall.name}</Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={MallMateTheme.color.textMuted} />
      </Pressable>
      <View style={styles.body}>
        <EmptyState
          icon={<Ionicons name="home-outline" size={48} color={MallMateTheme.color.primary} />}
          title="Home"
          message="Mall home, categories and offers are coming soon."
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
  body: {
    flex: 1,
    justifyContent: "center",
  },
});

export default HomeScreen;
