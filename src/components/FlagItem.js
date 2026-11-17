import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

import { MallMateTheme } from "../constants";
import { Display } from "../utils";
import Separator from "./Separator";

/**
 * Country-code picker row: emoji flag + name + dial code, used by the
 * phone-OTP `CountryPickerScreen`. Uses MallMate theme fonts and logical
 * margins so it is RTL-ready; exposes a labelled button role and a 44px
 * minimum touch target per the design system.
 */
const FlagItem = ({ code, name, dial_code, flag, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress({ code, name, dial_code })}
      accessibilityRole="button"
      accessibilityLabel={`${name} ${dial_code}`}
    >
      <View style={styles.subContainer}>
        <Text>{flag}</Text>
        <Separator width={10} />
        <Text style={styles.flagText}>{name}</Text>
      </View>
      <Text style={styles.flagText}>{dial_code}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: Display.setWidth(60),
  },
  flagText: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    color: MallMateTheme.color.textPrimary,
    fontFamily: MallMateTheme.fontFamily.medium,
    marginEnd: 10,
  },
});

export default FlagItem;
