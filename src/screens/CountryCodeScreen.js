import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FlagItem, Separator } from "../components";
import { CountryCode, MallMateTheme } from "../constants";

/**
 * Country-code picker for RegisterPhone. Uses the bundled emoji-flag
 * catalogue in `constants/CountryCode.js` — no network flag images (the
 * old countryflags.io constant is gone). Selection is returned by
 * navigating back to RegisterPhone with merged route params.
 */
const CountryCodeScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const insets = useSafeAreaInsets();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CountryCode;
    return CountryCode.filter(
      (country) =>
        country.name.toLowerCase().includes(q) ||
        country.code.toLowerCase().includes(q) ||
        country.dial_code.includes(q),
    );
  }, [query]);

  const selectCountry = (country) => {
    const entry = CountryCode.find((item) => item.code === country.code) ?? country;
    navigation.navigate("RegisterPhone", {
      dialCode: entry.dial_code,
      code: entry.code,
      flag: entry.flag,
      countryName: entry.name,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={MallMateTheme.color.background}
        translucent
      />
      <Separator height={insets.top} />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={28} color={MallMateTheme.color.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Choose country
        </Text>
      </View>
      <View style={styles.searchRow}>
        <Feather
          name="search"
          size={20}
          color={MallMateTheme.color.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search country or code"
          placeholderTextColor={MallMateTheme.color.textMuted}
          selectionColor={MallMateTheme.color.primary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          accessibilityLabel="Search country or code"
        />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.code}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <FlagItem
            code={item.code}
            name={item.name}
            dial_code={item.dial_code}
            flag={item.flag}
            onPress={selectCountry}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No countries match “{query}”.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MallMateTheme.color.background,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: MallMateTheme.spacing.lg,
  },
  backButton: {
    minHeight: MallMateTheme.touchTarget.min,
    minWidth: MallMateTheme.touchTarget.min,
    alignItems: "center",
    justifyContent: "center",
    marginRight: MallMateTheme.spacing.xs,
  },
  headerTitle: {
    ...MallMateTheme.typography.h3,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    color: MallMateTheme.color.textPrimary,
    flex: 1,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: MallMateTheme.spacing.lg,
    marginBottom: MallMateTheme.spacing.sm,
    backgroundColor: MallMateTheme.color.surface,
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
    paddingHorizontal: MallMateTheme.spacing.md,
    minHeight: MallMateTheme.touchTarget.ideal,
  },
  searchIcon: {
    marginRight: MallMateTheme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: MallMateTheme.typography.body.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    color: MallMateTheme.color.textPrimary,
    paddingVertical: MallMateTheme.spacing.sm,
  },
  listContent: {
    paddingHorizontal: MallMateTheme.spacing.sm,
    paddingBottom: MallMateTheme.spacing.xl,
  },
  emptyText: {
    ...MallMateTheme.typography.body,
    fontFamily: MallMateTheme.fontFamily.regular,
    color: MallMateTheme.color.textSecondary,
    textAlign: "center",
    marginTop: MallMateTheme.spacing.xl,
    marginHorizontal: MallMateTheme.spacing.lg,
  },
});

export default CountryCodeScreen;
