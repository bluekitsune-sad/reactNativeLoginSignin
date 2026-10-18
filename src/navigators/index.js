import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import {
  SigninScreen,
  SignupScreen,
  ForgotPasswordScreen,
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
  // RegisterPhoneScreen,
  // VerificationScreen,
} from "../screens";
import MainTabNavigator from "./MainTabNavigator";
import { FavoritesProvider } from "../utils/favorites";
import { MallProvider } from "../utils/mallData";
import { UserProvider } from "../utils/userData";

const Stack = createStackNavigator();

const Navigators = () => {
  return (
    <UserProvider>
      <MallProvider>
        <FavoritesProvider>
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
                {/* <Stack.Screen name="RegisterPhone" component={RegisterPhoneScreen} /> */}
                {/* <Stack.Screen name="Verification" component={VerificationScreen} /> */}
              </>
            </Stack.Navigator>
          </NavigationContainer>
        </FavoritesProvider>
      </MallProvider>
    </UserProvider>
  );
};

export default Navigators;
