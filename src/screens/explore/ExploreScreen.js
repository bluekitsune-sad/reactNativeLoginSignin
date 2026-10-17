import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "../../components";
import { MallMateTheme } from "../../constants";

const ExploreScreen = () => (
  <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
    <EmptyState
      icon={<Ionicons name="compass-outline" size={48} color={MallMateTheme.color.primary} />}
      title="Explore"
      message="Categories, restaurants and outlets are coming soon."
    />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MallMateTheme.color.background,
    justifyContent: "center",
  },
});

export default ExploreScreen;
