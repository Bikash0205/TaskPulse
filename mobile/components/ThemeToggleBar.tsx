import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Pressable,
  Animated,
  Easing,
  StyleSheet,
  Image,
  GestureResponderEvent,
} from "react-native";
import {
  ICON_SUN_ACTIVE,
  ICON_SUN_MUTED,
  ICON_MOON_ACTIVE,
  ICON_MOON_MUTED,
} from "../assets/themeIconsBase64";

interface ThemeToggleBarProps {
  isDarkMode: boolean;
  onToggle: () => void;
  onSelectLight?: () => void;
  onSelectDark?: () => void;
}

export const ThemeToggleBar: React.FC<ThemeToggleBarProps> = ({
  isDarkMode,
  onToggle,
  onSelectLight,
  onSelectDark,
}) => {
  // Slide animation value: 0 for Light (left), 1 for Dark (right)
  const slideAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  // Icon animation values
  const sunRotateAnim = useRef(new Animated.Value(0)).current;
  const sunScaleAnim = useRef(new Animated.Value(1)).current;
  const moonRotateAnim = useRef(new Animated.Value(0)).current;
  const moonScaleAnim = useRef(new Animated.Value(1)).current;

  // Track press scale animation for immediate tactile feedback
  const pressScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate slider transition
    Animated.spring(slideAnim, {
      toValue: isDarkMode ? 1 : 0,
      friction: 7,
      tension: 50,
      useNativeDriver: true,
    }).start();

    // Trigger icon dynamics
    if (isDarkMode) {
      // Moon activates
      moonRotateAnim.setValue(0);
      Animated.parallel([
        Animated.timing(moonRotateAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(moonScaleAnim, {
            toValue: 1.25,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.spring(moonScaleAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      // Sun activates
      sunRotateAnim.setValue(0);
      Animated.parallel([
        Animated.timing(sunRotateAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(sunScaleAnim, {
            toValue: 1.25,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.spring(sunScaleAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isDarkMode]);

  const handlePressIn = () => {
    Animated.timing(pressScaleAnim, {
      toValue: 0.94,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  // Robust tap handler: detects which half was clicked or toggles reliably
  const handleTrackPress = (event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    const isLeftSide = locationX < 38; // Capsule width is 76
    if (isLeftSide) {
      if (isDarkMode) {
        if (onSelectLight) onSelectLight();
        else onToggle();
      } else {
        // If already light and tapped, toggle to dark!
        onToggle();
      }
    } else {
      if (!isDarkMode) {
        if (onSelectDark) onSelectDark();
        else onToggle();
      } else {
        // If already dark and tapped, toggle to light!
        onToggle();
      }
    }
  };

  const slideInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 38], // Translates knob from x=2 to x=38
  });

  const sunSpin = sunRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const moonTilt = moonRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-20deg", "0deg"],
  });

  return (
    <Pressable
      onPress={handleTrackPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
      accessibilityRole="switch"
      accessibilityLabel={`Toggle theme. Current mode is ${isDarkMode ? "Dark" : "Light"}`}
    >
      <Animated.View
        style={[
          styles.capsuleTrack,
          isDarkMode ? styles.capsuleTrackDark : styles.capsuleTrackLight,
          { transform: [{ scale: pressScaleAnim }] },
        ]}
      >
        {/* Sliding Active Indicator Knob - pointerEvents none so it never blocks clicks */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activeKnob,
            isDarkMode ? styles.activeKnobDark : styles.activeKnobLight,
            {
              transform: [{ translateX: slideInterpolation }],
            },
          ]}
        />

        {/* Light Mode (Sun) Slot */}
        <View pointerEvents="none" style={styles.slotButton}>
          <Animated.View
            style={{
              transform: [
                { rotate: !isDarkMode ? sunSpin : "0deg" },
                { scale: !isDarkMode ? sunScaleAnim : 1 },
              ],
              opacity: !isDarkMode ? 1 : 0.65,
            }}
          >
            <Image
              source={{ uri: !isDarkMode ? ICON_SUN_ACTIVE : ICON_SUN_MUTED }}
              style={styles.iconImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Dark Mode (Moon) Slot */}
        <View pointerEvents="none" style={styles.slotButton}>
          <Animated.View
            style={{
              transform: [
                { rotate: isDarkMode ? moonTilt : "0deg" },
                { scale: isDarkMode ? moonScaleAnim : 1 },
              ],
              opacity: isDarkMode ? 1 : 0.65,
            }}
          >
            <Image
              source={{ uri: isDarkMode ? ICON_MOON_ACTIVE : ICON_MOON_MUTED }}
              style={styles.iconImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  capsuleTrack: {
    flexDirection: "row",
    alignItems: "center",
    width: 76,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.2,
    position: "relative",
    paddingHorizontal: 1,
  },
  capsuleTrackLight: {
    backgroundColor: "#EDF2F7",
    borderColor: "#CBD5E1",
  },
  capsuleTrackDark: {
    backgroundColor: "#0F172A",
    borderColor: "#334155",
  },
  activeKnob: {
    position: "absolute",
    top: 2,
    left: 0,
    width: 34,
    height: 30,
    borderRadius: 15,
  },
  activeKnobLight: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activeKnobDark: {
    backgroundColor: "#1E293B",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#475569",
  },
  slotButton: {
    width: 36,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  iconImage: {
    width: 20,
    height: 20,
  },
});
