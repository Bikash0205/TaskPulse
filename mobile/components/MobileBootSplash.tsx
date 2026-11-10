import React, { useEffect, useRef, useState } from "react";
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
import {
  TASKPULSE_BOOT_LIGHT_WEBP,
  TASKPULSE_BOOT_DARK_WEBP,
} from "../assets/bootAnimationBase64";

export const MobileBootSplash: React.FC<MobileBootSplashProps> = ({
  isDarkMode = false,
  onBootComplete,
  durationMs = 2800,
}) => {
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const contentScale = useRef(new Animated.Value(1)).current;
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fallback safeguard if onLoad doesn't fire within 900ms
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setImageLoaded(true);
    }, 900);
    return () => clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (!imageLoaded) return;

    // Tactile haptic feedback when arrow snaps (~1.1s after playback begins)
    const hapticTimer = setTimeout(() => {
      try {
        Vibration.vibrate(22);
      } catch {}
    }, 1100);

    // Smooth upward glide and fade exit once full animation (including TaskPulse reveal) completes
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
    }, Math.max(durationMs, 2800));

    return () => {
      clearTimeout(hapticTimer);
      clearTimeout(exitTimer);
    };
  }, [imageLoaded, durationMs, onBootComplete]);

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
          uri: isDarkMode ? TASKPULSE_BOOT_DARK_WEBP : TASKPULSE_BOOT_LIGHT_WEBP,
        }}
        onLoad={() => setImageLoaded(true)}
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
