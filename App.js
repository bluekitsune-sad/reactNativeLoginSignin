// React Navigation's stack navigator requires gesture-handler to be
// initialized before anything else — keep this import first.
import "react-native-gesture-handler";

import { useFonts } from "expo-font";
import React from "react";

import { CustomFonts } from "./src/constants";
import Navigators from "./src/navigators";

export default () => {
  const [fontsLoaded] = useFonts(CustomFonts);
  return fontsLoaded ? <Navigators /> : null;
};
