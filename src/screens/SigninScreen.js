import { Ionicons, Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, TextInput, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Separator, ToggleButton } from "../components";
import { MallMateTheme } from "../constants";
import { t } from "../i18n";
import { isSuspiciousLogin } from "../mock";
import { AuthenicationService } from "../services";
import useUserManagement from "../utils/userData";

const SigninScreen = ({ navigation }) => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const insets = useSafeAreaInsets();
  const { updateUser } = useUserManagement();

  const signIn = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const user = {
      username,
      password,
    };
    AuthenicationService.login(user).then((response) => {
      setIsLoading(false);
      if (response?.status) {
        updateUser(response?.data);
        // Decided flow (issue #9): logins the backend flags as suspicious
        // take an extra OTP step (mock rule in src/mock/otp.js); everyone
        // else proceeds straight to the app.
        if (isSuspiciousLogin(username)) {
          navigation.replace("Verification", { flow: "login", destination: username });
        } else {
          navigation.replace("Main");
        }
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
        <Text style={styles.headerTitle}>{t("auth.signIn")}</Text>
      </View>
      <Text style={styles.title}>{t("auth.welcome")}</Text>
      <Text style={styles.content}>{t("auth.welcomeSubtitle")}</Text>
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
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <View style={styles.forgotPasswordContainer}>
        <View style={styles.toggleContainer}>
          <ToggleButton size={0.5} />
          <Text style={styles.rememberMeText}>{t("auth.rememberMe")}</Text>
        </View>
        <Text
          style={styles.forgotPasswordText}
          onPress={() => navigation.navigate("ForgotPassword")}
          accessibilityRole="button"
        >
          {t("auth.forgotPassword")}
        </Text>
      </View>
      <Button
        label={t("auth.signIn")}
        onPress={signIn}
        loading={isLoading}
        style={styles.signinButton}
      />
      <View style={styles.signupContainer}>
        <Text style={styles.accountText}>{t("auth.noAccount")}</Text>
        <Text
          style={styles.signupText}
          onPress={() => navigation.navigate("Signup")}
          accessibilityRole="button"
        >
          {t("auth.signUp")}
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
    marginTop: MallMateTheme.spacing.huge,
    marginBottom: MallMateTheme.spacing.sm,
    marginHorizontal: MallMateTheme.spacing.lg,
  },
  content: {
    ...MallMateTheme.typography.bodyLarge,
    fontFamily: MallMateTheme.fontFamily.regular,
    color: MallMateTheme.color.textSecondary,
    marginTop: MallMateTheme.spacing.sm,
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
  forgotPasswordContainer: {
    marginHorizontal: MallMateTheme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rememberMeText: {
    marginStart: MallMateTheme.spacing.sm,
    ...MallMateTheme.typography.label,
    fontFamily: MallMateTheme.fontFamily.regular,
    color: MallMateTheme.color.textSecondary,
  },
  forgotPasswordText: {
    ...MallMateTheme.typography.label,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    color: MallMateTheme.color.primary,
  },
  signinButton: {
    marginHorizontal: MallMateTheme.spacing.lg,
    marginTop: MallMateTheme.spacing.xl,
  },
  signupContainer: {
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
  signupText: {
    ...MallMateTheme.typography.label,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    color: MallMateTheme.color.primary,
    marginStart: MallMateTheme.spacing.xs,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorMessage: {
    ...MallMateTheme.typography.caption,
    fontFamily: MallMateTheme.fontFamily.medium,
    color: MallMateTheme.color.error,
    marginHorizontal: MallMateTheme.spacing.lg,
    marginTop: MallMateTheme.spacing.xs,
    marginBottom: MallMateTheme.spacing.md,
  },
});

export default SigninScreen;
