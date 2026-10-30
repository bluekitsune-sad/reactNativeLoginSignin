import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Platform } from "react-native";

import {
  SigninScreen,
  SignupScreen,
  ForgotPasswordScreen,
  RegisterPhoneScreen,
  VerificationScreen,
  CountryPickerScreen,
  MallSelectorScreen,
  MerchantDetailScreen,
  MenuItemScreen,
  MerchantListScreen,
  MenuScreen,
  OfferDetailScreen,
  FavoritesScreen,
  FoodCourtScreen,
  EventsScreen,
  EventDetailScreen,
  SeatScanScreen,
  SeatConfirmScreen,
  SeatSessionScreen,
  SeatSessionEndScreen,
  SeatHelpScreen,
  ProfilePlaceholderScreen,
  SettingsScreen,
  SearchScreen,
  FloorMapScreen,
  DestinationSearchScreen,
  DestinationDetailScreen,
  StartPointSelectScreen,
  RoutePreviewScreen,
  OrderHistoryScreen,
  OrderDetailScreen,
} from "../screens";
import MainTabNavigator from "./MainTabNavigator";
import { UserProvider } from "../utils";
import { FavoritesProvider } from "../utils/favorites";
import { MallProvider } from "../utils/mallData";

const Stack = createStackNavigator();

/**
 * Web-only deep-link config so browser URLs restore navigation state
 * (used by the screenshot capture script and useful for direct links on
 * web). Without a `config`, React Navigation maps path segments to screen
 * names and query params to route params (`/Main/Home`,
 * `/MerchantDetail?merchantId=…`). Native behaviour is unchanged — linking
 * is not enabled there.
 */
const linking =
  Platform.OS === "web" && typeof window !== "undefined" && window.location?.origin
    ? { prefixes: [window.location.origin] }
    : undefined;

const Navigators = () => {
  return (
    <UserProvider>
      <MallProvider>
        <FavoritesProvider>
          <NavigationContainer linking={linking}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <>
                <Stack.Screen name="Signin" component={SigninScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="RegisterPhone" component={RegisterPhoneScreen} />
                <Stack.Screen name="Verification" component={VerificationScreen} />
                <Stack.Screen name="CountryPicker" component={CountryPickerScreen} />
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
                <Stack.Screen name="MerchantDetail" component={MerchantDetailScreen} />
                <Stack.Screen name="Menu" component={MenuScreen} />
                <Stack.Screen name="MenuItem" component={MenuItemScreen} />
                <Stack.Screen name="OfferDetail" component={OfferDetailScreen} />
                <Stack.Screen name="Favorites" component={FavoritesScreen} />
                <Stack.Screen name="FoodCourt" component={FoodCourtScreen} />
                <Stack.Screen name="Events" component={EventsScreen} />
                <Stack.Screen name="EventDetail" component={EventDetailScreen} />
                <Stack.Screen name="SeatScan" component={SeatScanScreen} />
                <Stack.Screen name="SeatConfirm" component={SeatConfirmScreen} />
                <Stack.Screen name="SeatSession" component={SeatSessionScreen} />
                <Stack.Screen name="SeatSessionEnd" component={SeatSessionEndScreen} />
                <Stack.Screen name="SeatHelp" component={SeatHelpScreen} />
                <Stack.Screen name="FloorMap" component={FloorMapScreen} />
                <Stack.Screen name="DestinationSearch" component={DestinationSearchScreen} />
                <Stack.Screen name="DestinationDetail" component={DestinationDetailScreen} />
                <Stack.Screen name="StartPointSelect" component={StartPointSelectScreen} />
                <Stack.Screen name="RoutePreview" component={RoutePreviewScreen} />
                <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
                <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
              </>
            </Stack.Navigator>
          </NavigationContainer>
        </FavoritesProvider>
      </MallProvider>
    </UserProvider>
  );
};

export default Navigators;
