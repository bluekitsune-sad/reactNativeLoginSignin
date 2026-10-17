import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import {
  SigninScreen,
  SignupScreen,
  ForgotPasswordScreen,
  // RegisterPhoneScreen,
  // VerificationScreen,
} from "../screens";
import MainTabNavigator from "./MainTabNavigator";
import { UserProvider } from "../utils/userData";

const Stack = createStackNavigator();

const Navigators = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <>
            <Stack.Screen name="Signin" component={SigninScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
            {/* <Stack.Screen name="RegisterPhone" component={RegisterPhoneScreen} /> */}
            {/* <Stack.Screen name="Verification" component={VerificationScreen} /> */}
          </>
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default Navigators;
