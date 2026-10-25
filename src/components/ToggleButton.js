import React, { useState } from "react";
import { TouchableOpacity, Animated, Easing } from "react-native";

import { Colors } from "../constants";

const containerStyle = (size, isActive) => ({
  backgroundColor: isActive ? Colors.DEFAULT_GREEN : Colors.DEFAULT_GREY,
  height: 32 * size,
  width: 64 * size,
  borderRadius: 32,
  padding: 4 * size,
});

const toggleStyle = (size, animatedValue) => ({
  height: 24 * size,
  width: 24 * size,
  backgroundColor: Colors.DEFAULT_WHITE,
  borderRadius: 32,
  transform: [
    {
      translateX: animatedValue,
    },
  ],
});

/**
 * Legacy pill switch (the only Colors.js consumer left). Controlled when
 * `value`/`onValueChange` are provided; otherwise keeps internal state for
 * any uncontrolled use. Exposes the RN `switch` role with a checked state
 * and hitSlop so the small pill still meets the 44px touch-target rule.
 */
const ToggleButton = ({ size, value, onValueChange, accessibilityLabel }) => {
  const [internalActive, setInternalActive] = useState(false);
  const isActive = value ?? internalActive;
  const [animatedValue] = useState(new Animated.Value(value ? 32 * size : 0));

  const toggleHandle = () => {
    const next = !isActive;
    Animated.timing(animatedValue, {
      toValue: next ? 32 * size : 0,
      duration: 250,
      easing: Easing.bounce,
      delay: 0,
      useNativeDriver: true,
    }).start();
    if (value === undefined) {
      setInternalActive(next);
    }
    onValueChange?.(next);
  };

  return (
    <TouchableOpacity
      style={containerStyle(size, isActive)}
      onPress={() => toggleHandle()}
      activeOpacity={0.8}
      hitSlop={{ top: 14, bottom: 14, start: 6, end: 6 }}
      accessibilityRole="switch"
      accessibilityState={{ checked: isActive }}
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={toggleStyle(size, animatedValue)} />
    </TouchableOpacity>
  );
};

export default ToggleButton;
