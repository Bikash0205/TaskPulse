import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
  Easing,
} from "react-native";

interface FluidPressableProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  targetScale?: number;
  activeOpacity?: number;
}

export const FluidPressable: React.FC<FluidPressableProps> = ({
  children,
  style,
  targetScale = 0.965,
  activeOpacity = 0.92,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: any) => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: targetScale,
        duration: 90,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: activeOpacity,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start();
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4.5,
        tension: 85,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
    if (onPressOut) onPressOut(e);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};
