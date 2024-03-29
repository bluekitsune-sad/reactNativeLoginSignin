import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  SigninScreen,
  // SignupScreen,
  // ForgotPasswordScreen,
  // RegisterPhoneScreen,
  // VerificationScreen,
} from "../screens";

const Stack = createStackNavigator();

const Navigators = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <>
          <Stack.Screen name="Signin" component={SigninScreen} />
          {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
          {/* <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          /> */}
          {/* <Stack.Screen name="RegisterPhone" component={RegisterPhoneScreen} /> */}
          {/* <Stack.Screen name="Verification" component={VerificationScreen} /> */}
        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigators;
