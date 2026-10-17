import React from "react";
import Navigators from "./src/navigators";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { CustomFonts } from "./src/constants";

export default () => {
  const [fontsLoaded] = useFonts({
    ...CustomFonts,
    Inter: Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });
  return fontsLoaded ? <Navigators /> : null;
};
