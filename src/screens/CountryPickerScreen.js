import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FlagItem, TextInput } from "../components";
import { CountryCode, MallMateTheme } from "../constants";
import { t } from "../i18n";

const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .trim();

/**
 * Country-code picker for the phone-OTP flow (parked scaffold revived
 * per issue #9). Filters the bundled `CountryCode` list (emoji flags —
 * no remote flag service) and returns the selection to RegisterPhone.
 */
const CountryPickerScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");

  const countries = useMemo(() => {
    const needle = normalize(query);
    if (!needle) {
      return CountryCode;
    }
    return CountryCode.filter(
      (country) =>
        normalize(country.name).includes(needle) ||
        normalize(country.code).includes(needle) ||
        normalize(country.dial_code).includes(needle),
    );
  }, [query]);

  const handleSelect = (country) => {
    navigation.navigate({ name: "RegisterPhone", params: { country }, merge: true });
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
          {t("otp.countryLabel")}
        </Text>
        <View style={styles.backButton} />
      </View>
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("otp.searchCountry")}
          autoCapitalize="none"
        />
      </View>
      <FlatList
        data={countries}
        keyExtractor={(item) => item.code}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <FlagItem
            code={item.code}
            name={item.name}
            dial_code={item.dial_code}
            flag={item.flag}
            onPress={() => handleSelect(item)}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>{t("otp.noCountryResults")}</Text>}
      />
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
    ...MallMateTheme.typography.h4,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    color: MallMateTheme.color.textPrimary,
    flex: 1,
    textAlign: "center",
    marginEnd: MallMateTheme.touchTarget.min,
  },
  searchWrap: {
    paddingHorizontal: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.md,
  },
  list: {
    paddingHorizontal: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xl,
  },
  empty: {
    ...MallMateTheme.typography.body,
    fontFamily: MallMateTheme.fontFamily.regular,
    color: MallMateTheme.color.textMuted,
    marginTop: MallMateTheme.spacing.lg,
    textAlign: "center",
  },
});

export default CountryPickerScreen;
