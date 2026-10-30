import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, TextInput } from "../components";
import { MallMateTheme } from "../constants";
import { t } from "../i18n";
import { DEMO_OTP_CODE, sendMockOtp, verifyMockOtp } from "../mock";
import { useUserManagement } from "../utils";

/**
 * OTP entry for the decided auth flow (issue #9). Register flow finishes
 * here into the app with a mock session; the login flow (suspicious
 * attempts) verifies and continues into the app the sign-in already set
 * up. Pure presentation — the code is never validated against a backend
 * and the demo code is shown on screen.
 */
const VerificationScreen = ({ navigation, route }) => {
  const flow = route?.params?.flow ?? "register";
  const destination = route?.params?.destination ?? "";
  const username = route?.params?.username;

  const { updateUser } = useUserManagement();

  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    setErrorMessage("");
    setIsVerifying(true);
    const response = await verifyMockOtp(code);
    setIsVerifying(false);
    if (response?.status) {
      if (flow === "register") {
        updateUser({ username, phone: destination, mockSession: true });
      }
      navigation.replace("Main");
      return;
    }
    setErrorMessage(response?.message || t("otp.invalidCode"));
  };

  const handleResend = async () => {
    setErrorMessage("");
    setIsResending(true);
    await sendMockOtp(destination);
    setIsResending(false);
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
          {t("otp.verifyTitle")}
        </Text>
        <Text style={styles.subtitle}>{t("otp.verifySubtitle", { destination })}</Text>

        {flow === "login" ? (
          <Text style={styles.reviewNote}>{t("otp.loginReviewNote")}</Text>
        ) : null}

        <TextInput
          label={t("otp.codeLabel")}
          value={code}
          onChangeText={setCode}
          placeholder={t("otp.codeLabel")}
          keyboardType="number-pad"
          style={styles.input}
        />
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <Button
          label={t("otp.verifyLabel")}
          onPress={handleVerify}
          loading={isVerifying}
          style={styles.verifyButton}
        />
        <Pressable
          onPress={handleResend}
          accessibilityRole="button"
          disabled={isResending}
          style={styles.resendButton}
        >
          <Text style={styles.resendText}>
            {isResending ? t("common.loading") : t("otp.resend")}
          </Text>
        </Pressable>
        <Text style={styles.demoNote}>{t("otp.demoCodeNote", { code: DEMO_OTP_CODE })}</Text>
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
    marginBottom: MallMateTheme.spacing.lg,
  },
  reviewNote: {
    ...MallMateTheme.typography.body,
    fontFamily: MallMateTheme.fontFamily.regular,
    color: MallMateTheme.color.highlight,
    marginBottom: MallMateTheme.spacing.lg,
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
  verifyButton: {
    marginTop: MallMateTheme.spacing.sm,
  },
  resendButton: {
    minHeight: MallMateTheme.touchTarget.min,
    alignItems: "center",
    justifyContent: "center",
    marginTop: MallMateTheme.spacing.sm,
  },
  resendText: {
    ...MallMateTheme.typography.label,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    color: MallMateTheme.color.primary,
  },
  demoNote: {
    ...MallMateTheme.typography.caption,
    fontFamily: MallMateTheme.fontFamily.medium,
    color: MallMateTheme.color.highlight,
    marginTop: MallMateTheme.spacing.md,
  },
  mockNote: {
    ...MallMateTheme.typography.caption,
    fontFamily: MallMateTheme.fontFamily.regular,
    color: MallMateTheme.color.textMuted,
    marginTop: MallMateTheme.spacing.sm,
  },
});

export default VerificationScreen;
