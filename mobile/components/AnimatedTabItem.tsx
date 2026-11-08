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

  useEffect(() => {
    if (isActive) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 70,
        useNativeDriver: true,
      }).start();
    }
  }, [isActive]);

  const handlePressIn = () => {
    // Fire tab switch and haptics instantly on touch down (0ms latency)
    onPress();
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      style={styles.navItem}
    >
      <View style={styles.tabContentContainer}>
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
    backgroundColor: "transparent",
    zIndex: 2,
  },
  tabContentContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "transparent",
    zIndex: 2,
  },
  navText: {
    fontSize: 10,
    marginTop: 3,
    backgroundColor: "transparent",
  },
  navTextActive: {
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  activeIndicatorDot: {
    position: "absolute",
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
