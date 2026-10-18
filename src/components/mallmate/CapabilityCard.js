import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Card from "./Card";
import StatusChip from "./StatusChip";
import { MallMateTheme } from "../../constants";

const CapabilityCard = ({ title, description, icon, degraded = false }) => (
  <Card style={styles.card}>
    <View style={styles.iconRow}>
      <Ionicons
        name={icon}
        size={24}
        color={MallMateTheme.color.primary}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      {degraded ? <StatusChip label="Limited" tone="warning" style={styles.chip} /> : null}
    </View>
    <Text style={styles.title}>{title}</Text>
    {description ? <Text style={styles.description}>{description}</Text> : null}
  </Card>
);

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: "45%",
    marginBottom: MallMateTheme.spacing.md,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: MallMateTheme.spacing.sm,
  },
  chip: {
    marginStart: MallMateTheme.spacing.sm,
  },
  title: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    marginBottom: 2,
  },
  description: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.caption.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
  },
});

export default CapabilityCard;
