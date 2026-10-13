import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Separator } from "../components";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Colors, Fonts, Images } from "../constants";
import { Display } from "../utils";
import { AuthenicationService } from "../services";
import LottieView from "lottie-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
          "If an account exists for this email, password reset instructions will be sent to it."
        );
      } else {
        setErrorMessage(response?.message || "No account found with this email");
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.DEFAULT_WHITE}
        translucent
      />
      <Separator height={insets.top} />
      <View style={styles.headerContainer}>
        <Ionicons
          name="chevron-back-outline"
          size={30}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Forgot Password</Text>
      </View>
      <Text style={styles.title}>Reset your password</Text>
      <Text style={styles.content}>
        Enter the email associated with your account and we will send you reset
        instructions
      </Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputSubContainer}>
          <Feather
            name="mail"
            size={22}
            color={Colors.DEFAULT_GREY}
            style={{ marginRight: 10 }}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={Colors.DEFAULT_GREY}
            selectionColor={Colors.DEFAULT_GREY}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.inputText}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
      </View>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <Text style={styles.infoMessage}>{infoMessage}</Text>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => resetPassword()}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <LottieView source={Images.LOADING} autoPlay />
        ) : (
          <Text style={styles.resetButtonText}>Send Instructions</Text>
        )}
      </TouchableOpacity>
      <View style={styles.signinContainer}>
        <Text
          style={styles.signinText}
          onPress={() => navigation.navigate("Signin")}
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
    backgroundColor: Colors.DEFAULT_WHITE,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 20 * 1.4,
    width: Display.setWidth(80),
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 20 * 1.4,
    marginTop: 50,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  content: {
    fontSize: 14,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 14 * 1.4,
    marginTop: 5,
    marginBottom: 20,
    marginHorizontal: 20,
    color: Colors.DEFAULT_GREY,
  },
  inputContainer: {
    backgroundColor: Colors.LIGHT_GREY,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors.LIGHT_GREY2,
    justifyContent: "center",
  },
  inputSubContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputText: {
    fontSize: 18,
    textAlignVertical: "center",
    padding: 0,
    height: Display.setHeight(6),
    color: Colors.DEFAULT_BLACK,
    flex: 1,
  },
  errorMessage: {
    fontSize: 10,
    lineHeight: 10 * 1.4,
    color: Colors.DEFAULT_RED,
    fontFamily: Fonts.POPPINS_MEDIUM,
    marginHorizontal: 20,
    marginTop: 3,
    marginBottom: 10,
  },
  infoMessage: {
    fontSize: 11,
    lineHeight: 11 * 1.4,
    color: Colors.DEFAULT_GREEN,
    fontFamily: Fonts.POPPINS_MEDIUM,
    marginHorizontal: 20,
    marginTop: 3,
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: Colors.DEFAULT_GREEN,
    borderRadius: 8,
    marginHorizontal: 20,
    height: Display.setHeight(6),
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  resetButtonText: {
    fontSize: 18,
    lineHeight: 18 * 1.4,
    color: Colors.DEFAULT_WHITE,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  signinContainer: {
    marginHorizontal: 20,
    justifyContent: "center",
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  signinText: {
    fontSize: 13,
    lineHeight: 13 * 1.4,
    color: Colors.DEFAULT_GREEN,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
});

export default ForgotPasswordScreen;
