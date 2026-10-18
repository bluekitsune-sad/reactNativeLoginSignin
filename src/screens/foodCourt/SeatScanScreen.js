import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, ListRow, SectionHeader } from "../../components";
import { MallMateTheme } from "../../constants";
import { MOCK_SCAN_TARGETS, SCAN_OUTCOMES, resolveMockScan } from "../../mock";
import { useMallManagement } from "../../utils";

/**
 * QR scanner permission + scan screen (SCREEN_INVENTORY 29). Pure
 * presentation: shows the camera-permission explainer and stands the
 * camera in with demo table codes — no camera integration and no QR
 * validation (blocked on open decisions #9/#10). A resolved AVAILABLE
 * seat routes to confirmation; every other outcome routes to the
 * seat-help screen.
 */
const SeatScanScreen = ({ navigation }) => {
  const { selectedMall } = useMallManagement();

  const handleDemoScan = (code) => {
    const { outcome, seat } = resolveMockScan(code);
    if (outcome === SCAN_OUTCOMES.AVAILABLE && seat) {
      navigation.navigate("SeatConfirm", { seat });
      return;
    }
    navigation.navigate("SeatHelp", { outcome, seat });
  };

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
        <Text style={styles.headerMeta} numberOfLines={1}>
          {selectedMall.name}
        </Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.permissionCard}>
          <Ionicons
            name="camera-outline"
            size={28}
            color={MallMateTheme.color.primary}
            style={styles.permissionIcon}
          />
          <Text style={styles.permissionTitle}>Camera access for table codes</Text>
          <Text style={styles.permissionMessage}>
            MallMate only asks for camera access when you start a scan, and uses it solely to read
            the QR sticker on a food-court table.
          </Text>
        </Card>

        <SectionHeader title="Try a demo scan" style={styles.section} />
        <Text style={styles.demoNote}>
          Live camera scanning arrives with the real integration. Pick a demo table code below to
          preview each outcome.
        </Text>
        <View style={styles.rows}>
          {MOCK_SCAN_TARGETS.map((target) => (
            <ListRow
              key={target.code}
              title={target.label}
              subtitle={`Demo code ${target.code}`}
              leading={
                <Ionicons name="qr-code-outline" size={22} color={MallMateTheme.color.primary} />
              }
              onPress={() => handleDemoScan(target.code)}
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
    marginRight: MallMateTheme.spacing.sm,
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
  permissionCard: {
    marginBottom: MallMateTheme.spacing.sm,
  },
  permissionIcon: {
    marginBottom: MallMateTheme.spacing.sm,
  },
  permissionTitle: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h4.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginBottom: MallMateTheme.spacing.xs,
  },
  permissionMessage: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
  section: {
    marginTop: MallMateTheme.spacing.lg,
  },
  demoNote: {
    color: MallMateTheme.color.textMuted,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    marginBottom: MallMateTheme.spacing.md,
  },
  rows: {
    gap: MallMateTheme.spacing.sm,
  },
  row: {
    marginBottom: 0,
  },
});

export default SeatScanScreen;
