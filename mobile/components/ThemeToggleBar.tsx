import React, { useEffect, useRef } from "react";
import {
  View,
  Pressable,
  Animated,
  Easing,
  StyleSheet,
  Vibration,
  GestureResponderEvent,
} from "react-native";

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
  // Slide animation value: 0 for Dark (left), 1 for Light (right)
  const slideAnim = useRef(new Animated.Value(isDarkMode ? 0 : 1)).current;

  // Knob glow pulse & scale animation
  const glowAnim = useRef(new Animated.Value(1)).current;
  const pressScaleAnim = useRef(new Animated.Value(1)).current;

  // Particle rotation and pulse
  const particleSpin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 60 FPS Native Spring Transition
    Animated.spring(slideAnim, {
      toValue: isDarkMode ? 0 : 1,
      friction: 6,
      tension: 65,
      useNativeDriver: true,
    }).start();

    // Pulse specular glow on switch
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1.25,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(glowAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Spin particle cluster slightly
    particleSpin.setValue(0);
    Animated.timing(particleSpin, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
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

  const handleTrackPress = (event: GestureResponderEvent) => {
    try {
      Vibration.vibrate(12);
    } catch (e) {}

    const { locationX } = event.nativeEvent;
    const isLeftSide = locationX < 38; // Capsule width is 76

    if (isLeftSide) {
      if (!isDarkMode) {
        if (onSelectDark) onSelectDark();
        else onToggle();
      } else {
        onToggle();
      }
    } else {
      if (isDarkMode) {
        if (onSelectLight) onSelectLight();
        else onToggle();
      } else {
        onToggle();
      }
    }
  };

  // Slide interpolations: x=2 in Dark (left), x=38 in Light (right)
  const slideInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 38],
  });

  const particleRotate = particleSpin.interpolate({
    inputRange: [0, 1],
    outputRange: isDarkMode ? ["-20deg", "0deg"] : ["20deg", "0deg"],
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
        {/* Subtle Ambient Track Glow */}
        <View
          pointerEvents="none"
          style={[
            styles.trackGlow,
            isDarkMode ? styles.trackGlowDark : styles.trackGlowLight,
          ]}
        />

        {/* 1. Fluid Sliding Squircle Thumb */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activeKnob,
            isDarkMode ? styles.activeKnobDark : styles.activeKnobLight,
            {
              transform: [
                { translateX: slideInterpolation },
                { scale: glowAnim },
              ],
            },
          ]}
        >
          {/* Specular Rim Light Arc (Exact replica of video) */}
          <View
            style={[
              styles.specularRim,
              isDarkMode ? styles.specularRimDark : styles.specularRimLight,
            ]}
          />

          {/* 2. Pixel Particle Glyph Cluster */}
          <Animated.View
            style={[
              styles.particleCenter,
              { transform: [{ rotate: particleRotate }] },
            ]}
          >
            {isDarkMode ? (
              // Digital Pixel Moon Matrix
              <View style={styles.pixelMatrixBox}>
                <View style={[styles.pixelDot, { backgroundColor: "#FFFFFF", top: 1, left: 6 }]} />
                <View style={[styles.pixelDot, { backgroundColor: "#C7D2FE", top: 3, left: 4 }]} />
                <View style={[styles.pixelDot, { backgroundColor: "#818CF8", top: 6, left: 3 }]} />
                <View style={[styles.pixelDot, { backgroundColor: "#C7D2FE", top: 9, left: 4 }]} />
                <View style={[styles.pixelDot, { backgroundColor: "#FFFFFF", top: 11, left: 6 }]} />
                {/* Secondary Star Pixels */}
                <View style={[styles.microStar, { top: 4, left: 10, backgroundColor: "#93C5FD" }]} />
                <View style={[styles.microStar, { top: 8, left: 9, backgroundColor: "#C4B5FD" }]} />
              </View>
            ) : (
              // Digital Radiant Sun Burst Matrix
              <View style={styles.pixelMatrixBox}>
                {/* Center Sun Core Block */}
                <View style={styles.sunCoreBlock} />
                {/* Cardinal Ray Pixels */}
                <View style={[styles.pixelDot, { backgroundColor: "#D97706", top: 0, left: 6.5 }]} />
                <View style={[styles.pixelDot, { backgroundColor: "#D97706", top: 12, left: 6.5 }]} />
                <View style={[styles.pixelDot, { backgroundColor: "#D97706", top: 6, left: 0 }]} />
                <View style={[styles.pixelDot, { backgroundColor: "#D97706", top: 6, left: 13 }]} />
                {/* Diagonal Ray Pixels */}
                <View style={[styles.microStar, { top: 2.5, left: 2.5, backgroundColor: "#B45309" }]} />
                <View style={[styles.microStar, { top: 2.5, left: 10.5, backgroundColor: "#B45309" }]} />
                <View style={[styles.microStar, { top: 9.5, left: 2.5, backgroundColor: "#B45309" }]} />
                <View style={[styles.microStar, { top: 9.5, left: 10.5, backgroundColor: "#B45309" }]} />
              </View>
            )}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  capsuleTrack: {
    width: 76,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.2,
    position: "relative",
    justifyContent: "center",
  },
  capsuleTrackLight: {
    backgroundColor: "#E2E8F0",
    borderColor: "#CBD5E1",
  },
  capsuleTrackDark: {
    backgroundColor: "#0B0F19",
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  trackGlow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 18,
  },
  trackGlowDark: {
    backgroundColor: "rgba(99, 102, 241, 0.08)",
  },
  trackGlowLight: {
    backgroundColor: "rgba(245, 158, 11, 0.08)",
  },
  activeKnob: {
    position: "absolute",
    top: 2,
    left: 0,
    width: 34,
    height: 30,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  activeKnobLight: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activeKnobDark: {
    backgroundColor: "#1E2538",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  specularRim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  specularRimDark: {
    borderTopColor: "#818CF8",
    borderLeftColor: "#818CF8",
  },
  specularRimLight: {
    borderTopColor: "#F59E0B",
    borderLeftColor: "#F59E0B",
  },
  particleCenter: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pixelMatrixBox: {
    width: 16,
    height: 16,
    position: "relative",
  },
  pixelDot: {
    position: "absolute",
    width: 2.5,
    height: 2.5,
    borderRadius: 0.5,
  },
  microStar: {
    position: "absolute",
    width: 2,
    height: 2,
    borderRadius: 0.5,
  },
  sunCoreBlock: {
    position: "absolute",
    top: 5,
    left: 5,
    width: 5.5,
    height: 5.5,
    borderRadius: 1.2,
    backgroundColor: "#0F172A",
  },
});
