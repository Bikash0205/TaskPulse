import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Image,
  Vibration,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

interface MobileBootSplashProps {
  isDarkMode?: boolean;
  onBootComplete: () => void;
  durationMs?: number;
}

/**
 * TaskPulse HD Boot Splash
 * Exact video animation in High Definition (720x1280 @ 60fps equivalent)
 * - Fluid organic 3D pulse wave drawing
 * - Smooth camera pull-back
 * - Arrow summit snap with haptic feedback
 * - Typographic reveal of "TaskPulse"
 * - Solid theme background (#0B0F19 in Dark Mode, #FFFFFF in Light Mode)
 * - Smooth upward glide and dissolve into workspace
 */
export const MobileBootSplash: React.FC<MobileBootSplashProps> = ({
  isDarkMode = false,
  onBootComplete,
  durationMs = 2600,
}) => {
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const contentScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Tactile haptic feedback when arrow snaps (~1.1s)
    const hapticTimer = setTimeout(() => {
      try {
        Vibration.vibrate(22);
      } catch {}
    }, 1100);

    // Smooth upward glide and fade exit once animation completes
    const exitTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateYAnim, {
          toValue: -SCREEN_HEIGHT * 0.4,
          duration: 380,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 360,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(contentScale, {
          toValue: 0.96,
          duration: 380,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onBootComplete();
      });
    }, durationMs);

    return () => {
      clearTimeout(hapticTimer);
      clearTimeout(exitTimer);
    };
  }, [durationMs, onBootComplete]);

  const bgColor = isDarkMode ? "#0B0F19" : "#FFFFFF";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          opacity: splashOpacity,
          transform: [
            { translateY: translateYAnim },
            { scale: contentScale },
          ],
        },
      ]}
      pointerEvents="auto"
    >
      <StatusBar
        translucent
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
      />
      <Image
        source={{
          uri: isDarkMode
            ? "asset:/taskpulse_boot_animated_dark.gif"
            : "asset:/taskpulse_boot_animated.gif",
        }}
        style={styles.fullScreenImage}
        resizeMode="contain"
        fadeDuration={0}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999999,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
