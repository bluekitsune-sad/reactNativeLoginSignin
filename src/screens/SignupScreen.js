import { Ionicons, Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, TextInput, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Separator } from "../components";
import { MallMateTheme } from "../constants";
import { t } from "../i18n";
import { AuthenicationService } from "../services";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignupScreen = ({ navigation }) => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const insets = useSafeAreaInsets();

  const signUp = async () => {
    setErrorMessage("");
    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage(t("auth.fillAllFields"));
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage(t("auth.validEmail"));
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(t("auth.passwordsNoMatch"));
      return;
    }
    setIsLoading(true);
    AuthenicationService.register({ username, email, password }).then((response) => {
      setIsLoading(false);
      if (response?.status) {
        // Decided flow (issue #9): register -> OTP -> app. The phone
        // step sends a mock OTP; Verification enters the app.
        navigation.navigate("RegisterPhone", { flow: "register", username });
      } else {
        setErrorMessage(response?.message);
      }
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
          accessibilityLabel={t("common.goBack")}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={28} color={MallMateTheme.color.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("auth.signUp")}</Text>
      </View>
      <Text style={styles.title}>{t("auth.createAccount")}</Text>
      <Text style={styles.content}>{t("auth.signupSubtitle")}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputSubContainer}>
          <Feather
            name="user"
            size={22}
            color={MallMateTheme.color.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder={t("auth.username")}
            placeholderTextColor={MallMateTheme.color.textMuted}
            selectionColor={MallMateTheme.color.primary}
            style={styles.inputText}
            onChangeText={(text) => setUsername(text)}
            accessibilityLabel={t("auth.username")}
          />
        </View>
      </View>
      <Separator height={15} />
      <View style={styles.inputContainer}>
        <View style={styles.inputSubContainer}>
          <Feather
            name="mail"
            size={22}
            color={MallMateTheme.color.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder={t("auth.email")}
            placeholderTextColor={MallMateTheme.color.textMuted}
            selectionColor={MallMateTheme.color.primary}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.inputText}
            onChangeText={(text) => setEmail(text)}
            accessibilityLabel={t("auth.email")}
          />
        </View>
      </View>
      <Separator height={15} />
      <View style={styles.inputContainer}>
        <View style={styles.inputSubContainer}>
          <Feather
            name="lock"
            size={22}
            color={MallMateTheme.color.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            secureTextEntry={!isPasswordShow}
            placeholder={t("auth.password")}
            placeholderTextColor={MallMateTheme.color.textMuted}
            selectionColor={MallMateTheme.color.primary}
            style={styles.inputText}
            onChangeText={(text) => setPassword(text)}
            accessibilityLabel={t("auth.password")}
          />
          <Feather
            name={isPasswordShow ? "eye" : "eye-off"}
            size={22}
            color={MallMateTheme.color.textMuted}
            style={styles.inputIcon}
            onPress={() => setIsPasswordShow(!isPasswordShow)}
            accessibilityRole="button"
            accessibilityLabel={isPasswordShow ? t("auth.hidePassword") : t("auth.showPassword")}
          />
        </View>
      </View>
      <Separator height={15} />
      <View style={styles.inputContainer}>
        <View style={styles.inputSubContainer}>
          <Feather
            name="lock"
            size={22}
            color={MallMateTheme.color.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            secureTextEntry={!isPasswordShow}
            placeholder={t("auth.confirmPassword")}
            placeholderTextColor={MallMateTheme.color.textMuted}
            selectionColor={MallMateTheme.color.primary}
            style={styles.inputText}
            onChangeText={(text) => setConfirmPassword(text)}
            accessibilityLabel={t("auth.confirmPassword")}
          />
          <Feather
            name={isPasswordShow ? "eye" : "eye-off"}
            size={22}
            color={MallMateTheme.color.textMuted}
            style={styles.inputIcon}
            onPress={() => setIsPasswordShow(!isPasswordShow)}
            accessibilityRole="button"
            accessibilityLabel={isPasswordShow ? t("auth.hidePassword") : t("auth.showPassword")}
          />
        </View>
      </View>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <Button
        label={t("auth.signUp")}
        onPress={signUp}
        loading={isLoading}
        style={styles.signupButton}
      />
      <View style={styles.signinContainer}>
        <Text style={styles.accountText}>{t("auth.alreadyHaveAccount")}</Text>
        <Text
          style={styles.signinText}
          onPress={() => navigation.navigate("Signin")}
          accessibilityRole="button"
        >
          {t("auth.signIn")}
        </Text>
      </View>
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
    marginEnd: MallMateTheme.touchTarget.min,
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
    backgroundColor: MallMateTheme.color.surface,
    paddingHorizontal: MallMateTheme.spacing.md,
    marginHorizontal: MallMateTheme.spacing.lg,
    borderRadius: MallMateTheme.radius.control,
    borderWidth: 1,
    borderColor: MallMateTheme.color.border,
    justifyContent: "center",
  },
  inputSubContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    marginEnd: MallMateTheme.spacing.sm,
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
  signupButton: {
    marginHorizontal: MallMateTheme.spacing.lg,
    marginTop: MallMateTheme.spacing.sm,
  },
  signinContainer: {
    marginHorizontal: MallMateTheme.spacing.lg,
    justifyContent: "center",
    paddingVertical: MallMateTheme.spacing.xl,
    flexDirection: "row",
    alignItems: "center",
  },
  accountText: {
    ...MallMateTheme.typography.label,
    fontFamily: MallMateTheme.fontFamily.regular,
    color: MallMateTheme.color.textSecondary,
  },
  signinText: {
    ...MallMateTheme.typography.label,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    color: MallMateTheme.color.primary,
    marginStart: MallMateTheme.spacing.xs,
  },
});

export default SignupScreen;
