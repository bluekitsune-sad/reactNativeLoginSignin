import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import Button from "./Button";
import { MallMateTheme } from "../../constants";

const OptionPill = ({ label, selected, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    accessibilityLabel={label}
    style={[styles.pill, selected && styles.pillSelected]}
  >
    <Text style={[styles.pillLabel, selected && styles.pillLabelSelected]} numberOfLines={1}>
      {label}
    </Text>
  </Pressable>
);

const OptionGroup = ({ title, options, selected, onSelect, anyLabel = "Any" }) => {
  if (!options.length) {
    return null;
  }
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.pillRow}>
        <OptionPill label={anyLabel} selected={!selected} onPress={() => onSelect(null)} />
        {options.map((option) => (
          <OptionPill
            key={option.value}
            label={option.label}
            selected={selected === option.value}
            onPress={() => onSelect(option.value)}
          />
        ))}
      </View>
    </View>
  );
};

/**
 * Bottom-sheet style filter panel (SCREEN_INVENTORY 20). Local state only;
 * the caller owns the filter object and applies it client-side.
 */
const FilterSheet = ({
  visible,
  onClose,
  onApply,
  onClear,
  options,
  filters,
  onChange,
  resultCount,
}) => {
  const toggleOpenNow = () => onChange({ ...filters, openNow: !filters.openNow });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close filters" />
      <View style={styles.sheet} accessibilityViewIsModal>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close filters"
            hitSlop={MallMateTheme.spacing.sm}
            style={styles.closeButton}
          >
            <Ionicons name="close-outline" size={26} color={MallMateTheme.color.textPrimary} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.body}>
          <OptionGroup
            title="Category"
            options={options.categories}
            selected={filters.category}
            onSelect={(value) => onChange({ ...filters, category: value })}
          />
          <OptionGroup
            title="Cuisine"
            options={options.cuisines}
            selected={filters.cuisine}
            onSelect={(value) => onChange({ ...filters, cuisine: value })}
          />
          <View style={styles.group}>
            <Text style={styles.groupTitle}>Open now</Text>
            <OptionPill
              label={filters.openNow ? "Open now only" : "Show all"}
              selected={filters.openNow}
              onPress={toggleOpenNow}
            />
          </View>
          <OptionGroup
            title="Floor"
            options={options.floors}
            selected={filters.floor}
            onSelect={(value) => onChange({ ...filters, floor: value })}
          />
          <OptionGroup
            title="Price"
            options={options.priceBands}
            selected={filters.priceBand}
            onSelect={(value) => onChange({ ...filters, priceBand: value })}
          />
        </ScrollView>
        <View style={styles.footer}>
          <Button
            label="Clear all"
            onPress={onClear}
            variant="secondary"
            style={styles.footerBtn}
          />
          <Button
            label={resultCount != null ? `Show ${resultCount}` : "Apply"}
            onPress={onApply}
            style={styles.footerBtn}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  sheet: {
    backgroundColor: MallMateTheme.color.surface,
    borderTopLeftRadius: MallMateTheme.radius.sheet,
    borderTopRightRadius: MallMateTheme.radius.sheet,
    borderTopWidth: 1,
    borderColor: MallMateTheme.color.border,
    maxHeight: "80%",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: MallMateTheme.color.border,
    marginTop: MallMateTheme.spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: MallMateTheme.spacing.lg,
    paddingTop: MallMateTheme.spacing.md,
    paddingBottom: MallMateTheme.spacing.sm,
  },
  title: {
    color: MallMateTheme.color.textPrimary,
    fontSize: MallMateTheme.typography.h3.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
  },
  closeButton: {
    minHeight: MallMateTheme.touchTarget.min,
    minWidth: MallMateTheme.touchTarget.min,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.lg,
  },
  group: {
    marginBottom: MallMateTheme.spacing.lg,
  },
  groupTitle: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.label.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    marginBottom: MallMateTheme.spacing.sm,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: MallMateTheme.spacing.sm,
  },
  pill: {
    minHeight: MallMateTheme.touchTarget.min,
    justifyContent: "center",
    paddingHorizontal: MallMateTheme.spacing.md,
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
    backgroundColor: MallMateTheme.color.surfaceElevated,
  },
  pillSelected: {
    borderColor: MallMateTheme.color.primary,
    backgroundColor: MallMateTheme.color.surface,
  },
  pillLabel: {
    color: MallMateTheme.color.textSecondary,
    fontSize: MallMateTheme.typography.label.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
  },
  pillLabelSelected: {
    color: MallMateTheme.color.primary,
  },
  footer: {
    flexDirection: "row",
    gap: MallMateTheme.spacing.md,
    paddingHorizontal: MallMateTheme.spacing.lg,
    paddingTop: MallMateTheme.spacing.sm,
    paddingBottom: MallMateTheme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: MallMateTheme.color.border,
  },
  footerBtn: {
    flex: 1,
  },
});

export default FilterSheet;
