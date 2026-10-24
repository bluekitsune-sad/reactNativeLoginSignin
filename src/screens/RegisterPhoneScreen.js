import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, TextInput } from "../components";
import { CountryCode, MallMateTheme } from "../constants";
import { t } from "../i18n";
import { sendMockOtp } from "../mock";

const DEFAULT_COUNTRY = CountryCode.find((country) => country.code === "PK") ?? CountryCode[0];

/**
 * Phone-entry step of the decided register flow (issue #9:
 * register -> OTP -> app). Sends a mock OTP and hands off to
 * Verification; the country picker reuses the parked FlagItem row.
 * Pure presentation — no SMS and no backend endpoints yet.
 */
const RegisterPhoneScreen = ({ navigation, route }) => {
  const flow = route?.params?.flow ?? "register";
  const username = route?.params?.username;
  const country = route?.params?.country ?? DEFAULT_COUNTRY;

  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleContinue = async () => {
    setErrorMessage("");
    if (!phone.trim()) {
      setErrorMessage(t("otp.requiredPhone"));
      return;
    }
    setIsSending(true);
    const destination = `${country.dial_code}${phone.trim()}`;
    const response = await sendMockOtp(destination);
    setIsSending(false);
    if (response?.status) {
      navigation.navigate("Verification", { flow, destination, username });
    } else {
      setErrorMessage(response?.message || t("otp.sendFailed"));
    }
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
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          {t("otp.phoneTitle")}
        </Text>
        <Text style={styles.subtitle}>{t("otp.phoneSubtitle")}</Text>

        <Text style={styles.fieldLabel}>{t("otp.countryLabel")}</Text>
        <Pressable
          onPress={() => navigation.navigate("CountryPicker")}
          accessibilityRole="button"
          accessibilityLabel={`${t("otp.countryLabel")}: ${country.name}`}
          style={styles.countryRow}
        >
          <Text style={styles.countryFlag}>{country.flag}</Text>
          <Text style={styles.countryName}>{country.name}</Text>
          <Text style={styles.countryDial}>{country.dial_code}</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={MallMateTheme.color.textMuted}
          />
        </Pressable>

        <TextInput
          label={t("otp.phoneLabel")}
          value={phone}
          onChangeText={setPhone}
          placeholder={t("otp.phoneLabel")}
          keyboardType="phone-pad"
          style={styles.input}
        />
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <Button
          label={t("otp.continueLabel")}
          onPress={handleContinue}
          loading={isSending}
          style={styles.continueButton}
        />
        <Text style={styles.mockNote}>{t("common.mockDataNote")}</Text>
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
    paddingHorizontal: MallMateTheme.spacing.lg,
    paddingVertical: MallMateTheme.spacing.sm,
  },
  backButton: {
    minHeight: MallMateTheme.touchTarget.min,
    minWidth: MallMateTheme.touchTarget.min,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: MallMateTheme.spacing.lg,
    paddingBottom: MallMateTheme.spacing.xl,
  },
  title: {
    ...MallMateTheme.typography.h2,
    fontFamily: MallMateTheme.fontFamily.bold,
    color: MallMateTheme.color.textPrimary,
    marginTop: MallMateTheme.spacing.sm,
    marginBottom: MallMateTheme.spacing.sm,
  },
  subtitle: {
    ...MallMateTheme.typography.body,
    fontFamily: MallMateTheme.fontFamily.regular,
    color: MallMateTheme.color.textSecondary,
    marginBottom: MallMateTheme.spacing.xl,
  },
  fieldLabel: {
    ...MallMateTheme.typography.label,
    fontFamily: MallMateTheme.fontFamily.medium,
    color: MallMateTheme.color.textSecondary,
    marginBottom: MallMateTheme.spacing.xs,
  },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: MallMateTheme.touchTarget.ideal,
    backgroundColor: MallMateTheme.color.surface,
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
    paddingHorizontal: MallMateTheme.spacing.md,
    marginBottom: MallMateTheme.spacing.lg,
  },
  countryFlag: {
    fontSize: 20,
    marginEnd: MallMateTheme.spacing.sm,
  },
  countryName: {
    ...MallMateTheme.typography.body,
    fontFamily: MallMateTheme.fontFamily.regular,
    color: MallMateTheme.color.textPrimary,
    flex: 1,
  },
  countryDial: {
    ...MallMateTheme.typography.body,
    fontFamily: MallMateTheme.fontFamily.medium,
    color: MallMateTheme.color.textSecondary,
    marginEnd: MallMateTheme.spacing.sm,
  },
  input: {
    marginBottom: MallMateTheme.spacing.sm,
  },
  errorMessage: {
    ...MallMateTheme.typography.caption,
    fontFamily: MallMateTheme.fontFamily.medium,
    color: MallMateTheme.color.error,
    marginBottom: MallMateTheme.spacing.sm,
    minHeight: 18,
  },
  continueButton: {
    marginTop: MallMateTheme.spacing.sm,
  },
  mockNote: {
    ...MallMateTheme.typography.caption,
    fontFamily: MallMateTheme.fontFamily.regular,
    color: MallMateTheme.color.textMuted,
    marginTop: MallMateTheme.spacing.lg,
  },
});

export default RegisterPhoneScreen;
