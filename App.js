import React from "react";
import Navigators from "./src/navigators";
import { useFonts } from "expo-font";
import { CustomFonts } from "./src/constants";

export default () => {
  const [fontsLoaded] = useFonts(CustomFonts);
  return fontsLoaded ? <Navigators /> : null;
};
