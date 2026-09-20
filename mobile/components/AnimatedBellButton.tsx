import React, { useRef } from "react";
import {
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Image,
  View,
} from "react-native";
import {
  ICON_BELL_LIGHT,
  ICON_BELL_DARK,
  ICON_BELL_RING_LIGHT,
  ICON_BELL_RING_DARK,
} from "../assets/themeIconsBase64";

interface AnimatedBellButtonProps {
  isDarkMode: boolean;
  hasUnread?: boolean;
  onPress: () => void;
  size?: number;
}

export const AnimatedBellButton: React.FC<AnimatedBellButtonProps> = ({
  isDarkMode,
  hasUnread = true,
  onPress,
  size = 40,
}) => {
  const wobbleAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const triggerBellRing = () => {
    // Reset and trigger acoustic wobble oscillation
    wobbleAnim.setValue(0);
    scaleAnim.setValue(1);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.88,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.15,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(wobbleAnim, {
          toValue: -1,
          duration: 60,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(wobbleAnim, {
          toValue: 1,
          duration: 80,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(wobbleAnim, {
          toValue: -0.6,
          duration: 70,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(wobbleAnim, {
          toValue: 0.6,
          duration: 70,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(wobbleAnim, {
          toValue: 0,
          duration: 60,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    onPress();
  };

  const wobbleInterpolation = wobbleAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-16deg", "0deg", "16deg"],
  });

  const iconUri = hasUnread
    ? isDarkMode
      ? ICON_BELL_RING_DARK
      : ICON_BELL_RING_LIGHT
    : isDarkMode
    ? ICON_BELL_DARK
    : ICON_BELL_LIGHT;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={triggerBellRing}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={[
        styles.circleButton,
        isDarkMode ? styles.buttonDark : styles.buttonLight,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      accessibilityLabel="Notifications"
    >
      <Animated.View
        style={{
          transform: [{ rotate: wobbleInterpolation }, { scale: scaleAnim }],
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: iconUri }}
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circleButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
  },
  buttonLight: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
