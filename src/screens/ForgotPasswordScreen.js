import { Ionicons, Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, TextInput, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Separator } from "../components";
import { MallMateTheme } from "../constants";
import { AuthenicationService } from "../services";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const insets = useSafeAreaInsets();

  const resetPassword = async () => {
    setErrorMessage("");
    setInfoMessage("");
    if (!email) {
      setErrorMessage("Please enter your email address");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    AuthenicationService.checkUserExist("email", email).then((response) => {
      setIsLoading(false);
      if (response?.status) {
        setInfoMessage(
          "If an account exists for this email, password reset instructions will be sent to it.",
        );
      } else {
        setErrorMessage(response?.message || "No account found with this email");
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
          accessibilityLabel="Go back"
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={28} color={MallMateTheme.color.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot Password</Text>
      </View>
      <Text style={styles.title}>Reset your password</Text>
      <Text style={styles.content}>
        Enter the email associated with your account and we will send you reset instructions
      </Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputSubContainer}>
          <Feather
            name="mail"
            size={22}
            color={MallMateTheme.color.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={MallMateTheme.color.textMuted}
            selectionColor={MallMateTheme.color.primary}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.inputText}
            onChangeText={(text) => setEmail(text)}
            accessibilityLabel="Email"
          />
        </View>
      </View>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <Text style={styles.infoMessage}>{infoMessage}</Text>
      <Button
        label="Send Instructions"
        onPress={resetPassword}
        loading={isLoading}
        style={styles.resetButton}
      />
      <View style={styles.signinContainer}>
        <Text
          style={styles.signinText}
          onPress={() => navigation.navigate("Signin")}
          accessibilityRole="button"
        >
          Back to Sign In
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
    marginRight: MallMateTheme.touchTarget.min,
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
    marginBottom: MallMateTheme.spacing.sm,
  },
  infoMessage: {
    ...MallMateTheme.typography.caption,
    fontFamily: MallMateTheme.fontFamily.medium,
    color: MallMateTheme.color.primary,
    marginHorizontal: MallMateTheme.spacing.lg,
    marginTop: MallMateTheme.spacing.xs,
    marginBottom: MallMateTheme.spacing.sm,
  },
  resetButton: {
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
  signinText: {
    ...MallMateTheme.typography.label,
    fontFamily: MallMateTheme.fontFamily.semiBold,
    color: MallMateTheme.color.primary,
  },
});

export default ForgotPasswordScreen;
