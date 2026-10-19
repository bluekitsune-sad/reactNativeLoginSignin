import { Ionicons, Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Separator } from "../components";
import { MallMateTheme } from "../constants";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

/**
 * OTP-style verification step after RegisterPhone (legacy P1 stub).
 *
 * The legacy backend has no SMS/OTP endpoints, so this screen is an
 * honest preview: it validates the code format locally, fakes the send
 * delay with a resend cooldown, and says on-screen that no real SMS is
 * sent. Wire a real service here once an endpoint exists (P3/P2 backlog).
 */
const VerificationScreen = ({ navigation, route }) => {
  const dialCode = route?.params?.dialCode ?? "+92";
  const phone = route?.params?.phone ?? "";

  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = setTimeout(() => setResendIn((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const verify = () => {
    setErrorMessage("");
    if (code.replace(/[^0-9]/g, "").length !== CODE_LENGTH) {
      setErrorMessage(`Please enter the ${CODE_LENGTH}-digit code`);
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      Alert.alert(
        "Code format accepted",
        "This preview doesn't send real SMS codes, so nothing was verified on a server. Phone verification will work once a backend endpoint exists.",
        [
          {
            text: "Go to sign in",
            onPress: () => navigation.reset({ index: 0, routes: [{ name: "Signin" }] }),
          },
        ],
      );
    }, 600);
  };

  const resend = () => {
    setErrorMessage("");
    setResendIn(RESEND_SECONDS);
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
          Verify
        </Text>
      </View>
      <Text style={styles.title} accessibilityRole="header">
        Enter the code
      </Text>
      <Text style={styles.content}>
        {`We (would) text a ${CODE_LENGTH}-digit code to ${dialCode} ${phone}.`}
      </Text>
      <View style={styles.inputContainer}>
        <Feather
          name="shield-checkmark-outline"
          size={22}
          color={MallMateTheme.color.textMuted}
          style={styles.inputIcon}
        />
        <TextInput
          placeholder="123456"
          placeholderTextColor={MallMateTheme.color.textMuted}
          selectionColor={MallMateTheme.color.primary}
          keyboardType="number-pad"
          maxLength={CODE_LENGTH}
          style={styles.codeInput}
          value={code}
          onChangeText={(text) => setCode(text.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH))}
          accessibilityLabel={`Verification code, ${CODE_LENGTH} digits`}
        />
      </View>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <Button label="Verify" onPress={verify} loading={isVerifying} style={styles.verifyButton} />
      <TouchableOpacity
        onPress={resend}
        disabled={resendIn > 0}
        style={styles.resendButton}
        accessibilityRole="button"
        accessibilityState={{ disabled: resendIn > 0 }}
        accessibilityLabel={
          resendIn > 0 ? `Resend code available in ${resendIn} seconds` : "Resend code"
        }
      >
        <Text style={[styles.resendText, resendIn > 0 && styles.resendTextDisabled]}>
          {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.previewNote}>
        Preview only — no real SMS is sent. Verification isn&apos;t wired to a backend yet.
      </Text>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MallMateTheme.color.surface,
    marginHorizontal: MallMateTheme.spacing.lg,
    paddingHorizontal: MallMateTheme.spacing.md,
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
  },
  inputIcon: {
    marginRight: MallMateTheme.spacing.sm,
  },
  codeInput: {
    flex: 1,
    fontSize: 24,
    letterSpacing: 10,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    textAlignVertical: "center",
    paddingVertical: 0,
    height: MallMateTheme.touchTarget.ideal,
    color: MallMateTheme.color.textPrimary,
  },
  errorMessage: {
    ...MallMateTheme.typography.caption,
    fontFamily: MallMateTheme.fontFamily.medium,
    color: MallMateTheme.color.error,
    marginHorizontal: MallMateTheme.spacing.lg,
    marginTop: MallMateTheme.spacing.xs,
    marginBottom: MallMateTheme.spacing.md,
  },
  verifyButton: {
    marginHorizontal: MallMateTheme.spacing.lg,
    marginTop: MallMateTheme.spacing.sm,
  },
  resendButton: {
    alignSelf: "center",
    minHeight: MallMateTheme.touchTarget.min,
    justifyContent: "center",
    paddingHorizontal: MallMateTheme.spacing.lg,
    marginTop: MallMateTheme.spacing.sm,
  },
  resendText: {
    ...MallMateTheme.typography.label,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    color: MallMateTheme.color.primary,
  },
  resendTextDisabled: {
    color: MallMateTheme.color.textMuted,
  },
  previewNote: {
    ...MallMateTheme.typography.caption,
    fontFamily: MallMateTheme.fontFamily.regular,
    color: MallMateTheme.color.textMuted,
    textAlign: "center",
    marginHorizontal: MallMateTheme.spacing.lg,
    marginTop: "auto",
    marginBottom: MallMateTheme.spacing.xl,
  },
});

export default VerificationScreen;
