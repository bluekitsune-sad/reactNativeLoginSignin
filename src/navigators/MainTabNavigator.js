import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import { MallMateTheme } from "../constants";
import { HomeScreen, ExploreScreen, MapScreen, RewardsScreen, ProfileScreen } from "../screens";

const Tab = createBottomTabNavigator();

const icons = {
  Home: "home-outline",
  Explore: "compass-outline",
  Map: "map-outline",
  Rewards: "gift-outline",
  Profile: "person-outline",
};

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: MallMateTheme.color.primary,
      tabBarInactiveTintColor: MallMateTheme.color.textMuted,
      tabBarStyle: {
        backgroundColor: MallMateTheme.color.surface,
        borderTopColor: MallMateTheme.color.border,
      },
      tabBarIcon: ({ color, size }) => (
        <Ionicons name={icons[route.name]} size={size} color={color} />
      ),
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Explore" component={ExploreScreen} />
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Rewards" component={RewardsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default MainTabNavigator;
