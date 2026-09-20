import React, { useEffect, useRef } from "react";
import {
  Pressable,
  Animated,
  Text,
  StyleSheet,
  View,
} from "react-native";

interface AnimatedTabItemProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  renderIcon: (color: string) => React.ReactNode;
  COLORS: any;
}

export const AnimatedTabItem: React.FC<AnimatedTabItemProps> = ({
  label,
  isActive,
  onPress,
  renderIcon,
  COLORS,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pillScaleAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.22,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3.5,
            tension: 45,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(pillScaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(pillScaleAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isActive]);

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      style={styles.navItem}
    >
      <View style={styles.tabContentContainer}>
        {/* Animated Glowing Active Pill */}
        <Animated.View
          style={[
            styles.activePillBackground,
            {
              backgroundColor: COLORS.primaryLight,
              opacity: pillScaleAnim,
              transform: [{ scale: pillScaleAnim }],
            },
          ]}
        />

        {/* Bouncing Icon */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderIcon(isActive ? COLORS.primary : COLORS.muted)}
        </Animated.View>

        {/* Tab Label */}
        <Text
          style={[
            styles.navText,
            { color: isActive ? COLORS.primary : COLORS.muted },
            isActive && styles.navTextActive,
          ]}
        >
          {label}
        </Text>

        {/* Subtle Top Active Indicator Dot */}
        {isActive && (
          <View
            style={[
              styles.activeIndicatorDot,
              { backgroundColor: COLORS.primary },
            ]}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  tabContentContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  activePillBackground: {
    position: "absolute",
    top: -2,
    bottom: -2,
    left: 4,
    right: 4,
    borderRadius: 16,
  },
  navText: {
    fontSize: 10,
    marginTop: 3,
  },
  navTextActive: {
    fontWeight: "bold",
  },
  activeIndicatorDot: {
    position: "absolute",
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
