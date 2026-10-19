import { Ionicons, Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, TextInput, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Separator } from "../components";
import { MallMateTheme } from "../constants";

/**
 * Phone-registration step between Signup and Verification (legacy P1 —
 * the two screens were only stubbed as comments until now). Collects a
 * dial code (picked on the CountryCode screen) plus a phone number with
 * local validation. There is no SMS/backend step yet, so nothing is sent
 * anywhere — VerificationScreen says the same thing on its end.
 */
const RegisterPhoneScreen = ({ navigation, route }) => {
  const dialCode = route?.params?.dialCode ?? "+92";
  const flag = route?.params?.flag ?? "🇵🇰";
  const countryName = route?.params?.countryName ?? "Pakistan";

  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const insets = useSafeAreaInsets();

  const continueToVerification = () => {
    const digits = phone.replace(/[^0-9]/g, "");
    setErrorMessage("");
    if (!digits) {
      setErrorMessage("Please enter your phone number");
      return;
    }
    if (digits.length < 4 || digits.length > 15) {
      setErrorMessage("Please enter a valid phone number");
      return;
    }
    navigation.navigate("Verification", { dialCode, flag, phone: digits });
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
          Phone
        </Text>
      </View>
      <Text style={styles.title} accessibilityRole="header">
        Add your phone number
      </Text>
      <Text style={styles.content}>
        We&apos;ll use this number for account recovery and order updates
      </Text>
      <View style={styles.inputRow}>
        <TouchableOpacity
          style={styles.dialCodeButton}
          onPress={() => navigation.navigate("CountryCode")}
          accessibilityRole="button"
          accessibilityLabel={`Country code, currently ${countryName} ${dialCode}. Change country`}
        >
          <Text style={styles.flagText}>{flag}</Text>
          <Text style={styles.dialCodeText}>{dialCode}</Text>
          <Feather name="chevron-down" size={18} color={MallMateTheme.color.textSecondary} />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Feather
            name="phone"
            size={22}
            color={MallMateTheme.color.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Phone number"
            placeholderTextColor={MallMateTheme.color.textMuted}
            selectionColor={MallMateTheme.color.primary}
            keyboardType="phone-pad"
            style={styles.inputText}
            value={phone}
            onChangeText={(text) => setPhone(text.replace(/[^0-9\s-]/g, ""))}
            accessibilityLabel="Phone number"
          />
        </View>
      </View>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <Button label="Continue" onPress={continueToVerification} style={styles.continueButton} />
      <TouchableOpacity
        onPress={() => navigation.reset({ index: 0, routes: [{ name: "Signin" }] })}
        style={styles.skipButton}
        accessibilityRole="button"
        accessibilityLabel="Skip phone number for now"
      >
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
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
  },
  headerTitle: {
    fontSize: MallMateTheme.typography.h3.fontSize,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    color: MallMateTheme.color.textPrimary,
    flex: 1,
    textAlign: "center",
    marginRight: MallMateTheme.touchTarget.min,
  },
  title: {
    ...MallMateTheme.typography.h2,
    fontFamily: MallMateTheme.fontFamily.bold,
    color: MallMateTheme.color.textPrimary,
    marginTop: MallMateTheme.spacing.xxl,
    marginBottom: MallMateTheme.spacing.sm,
    marginHorizontal: MallMateTheme.spacing.lg,
  },
  content: {
    ...MallMateTheme.typography.body,
    fontFamily: MallMateTheme.fontFamily.regular,
    color: MallMateTheme.color.textSecondary,
    marginTop: MallMateTheme.spacing.xs,
    marginBottom: MallMateTheme.spacing.xl,
    marginHorizontal: MallMateTheme.spacing.lg,
  },
  inputRow: {
    flexDirection: "row",
    marginHorizontal: MallMateTheme.spacing.lg,
    gap: MallMateTheme.spacing.sm,
  },
  dialCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MallMateTheme.color.surface,
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
    paddingHorizontal: MallMateTheme.spacing.md,
    minHeight: MallMateTheme.touchTarget.ideal,
    gap: 6,
  },
  flagText: {
    fontSize: 20,
  },
  dialCodeText: {
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.medium,
    color: MallMateTheme.color.textPrimary,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MallMateTheme.color.surface,
    paddingHorizontal: MallMateTheme.spacing.md,
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
  },
  inputIcon: {
    marginRight: MallMateTheme.spacing.sm,
  },
  inputText: {
    fontSize: MallMateTheme.typography.bodyLarge.fontSize,
    fontFamily: MallMateTheme.fontFamily.regular,
    textAlignVertical: "center",
    padding: 0,
    height: MallMateTheme.touchTarget.ideal,
    color: MallMateTheme.color.textPrimary,
    flex: 1,
  },
  errorMessage: {
    ...MallMateTheme.typography.caption,
    fontFamily: MallMateTheme.fontFamily.medium,
    color: MallMateTheme.color.error,
    marginHorizontal: MallMateTheme.spacing.lg,
    marginTop: MallMateTheme.spacing.xs,
    marginBottom: MallMateTheme.spacing.md,
  },
  continueButton: {
    marginHorizontal: MallMateTheme.spacing.lg,
    marginTop: MallMateTheme.spacing.sm,
  },
  skipButton: {
    alignSelf: "center",
    minHeight: MallMateTheme.touchTarget.min,
    justifyContent: "center",
    paddingHorizontal: MallMateTheme.spacing.lg,
    marginTop: MallMateTheme.spacing.sm,
  },
  skipText: {
    ...MallMateTheme.typography.label,
    fontFamily: MallMateTheme.fontFamily.medium,
    color: MallMateTheme.color.textSecondary,
  },
});

export default RegisterPhoneScreen;
