import React, { useEffect, useRef } from "react";
import {
  Pressable,
  Animated,
  StyleSheet,
  Vibration,
} from "react-native";

interface AnimatedToggleSwitchProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  isDarkMode?: boolean;
  disabled?: boolean;
}

export const AnimatedToggleSwitch: React.FC<AnimatedToggleSwitchProps> = ({
  value,
  onValueChange,
  activeColor = "#10B981",
  inactiveColor,
  isDarkMode = false,
  disabled = false,
}) => {
  // Slide progress: 0 (Off/Left) to 1 (On/Right)
  const slideAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  // Squash/stretch width of knob on press: 24 to 28
  const knobWidthAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: value ? 1 : 0,
      friction: 7,
      tension: 50,
      useNativeDriver: false, // background interpolation requires false
    }).start();
  }, [value]);

  const handlePressIn = () => {
    if (disabled) return;
    Animated.timing(knobWidthAnim, {
      toValue: 28, // iOS knob stretches on touch
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(knobWidthAnim, {
      toValue: 24, // Snaps back to circle
      friction: 5,
      tension: 50,
      useNativeDriver: false,
    }).start();
  };

  const handleToggle = () => {
    if (disabled) return;
    try {
      Vibration.vibrate(10); // Micro-pulse
    } catch {
      // ignore
    }
    onValueChange(!value);
  };

  const defaultInactive = inactiveColor || (isDarkMode ? "#334155" : "#E2E8F0");

  const trackBgInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [defaultInactive, activeColor],
  });

  // Track is width 48, knob is width 24.
  // When off: left: 2. When on: left: 22.
  const knobTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <Pressable
      onPress={handleToggle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: trackBgInterpolation,
            borderColor: value ? activeColor : isDarkMode ? "#475569" : "#CBD5E1",
          },
        ]}
      >
        <Animated.View
          style={[
            styles.knob,
            {
              left: knobTranslate,
              width: knobWidthAnim,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.2,
    justifyContent: "center",
    position: "relative",
  },
  knob: {
    position: "absolute",
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.5,
    elevation: 3,
  },
});
