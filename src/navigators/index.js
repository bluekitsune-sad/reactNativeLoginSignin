import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import {
  SigninScreen,
  SignupScreen,
  ForgotPasswordScreen,
  MallSelectorScreen,
  MerchantListScreen,
  ProfilePlaceholderScreen,
  SettingsScreen,
  SearchScreen,
  // RegisterPhoneScreen,
  // VerificationScreen,
} from "../screens";
import MainTabNavigator from "./MainTabNavigator";
import { MallProvider } from "../utils/mallData";
import { UserProvider } from "../utils/userData";

const Stack = createStackNavigator();

const Navigators = () => {
  return (
    <UserProvider>
      <MallProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <>
              <Stack.Screen name="Signin" component={SigninScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="Main" component={MainTabNavigator} />
              <Stack.Screen name="MallSelector" component={MallSelectorScreen} />
              <Stack.Screen name="ProfilePlaceholder" component={ProfilePlaceholderScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="Search" component={SearchScreen} />
              <Stack.Screen
                name="RestaurantList"
                component={MerchantListScreen}
                initialParams={{ kind: "restaurants" }}
              />
              <Stack.Screen
                name="OutletList"
                component={MerchantListScreen}
                initialParams={{ kind: "outlets" }}
              />
              {/* <Stack.Screen name="RegisterPhone" component={RegisterPhoneScreen} /> */}
              {/* <Stack.Screen name="Verification" component={VerificationScreen} /> */}
            </>
          </Stack.Navigator>
        </NavigationContainer>
      </MallProvider>
    </UserProvider>
  );
};

export default Navigators;
