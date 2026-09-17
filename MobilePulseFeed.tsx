/**
 * Mobile Colleague Pulse Feed (React Native Expo SDK 52 / Reanimated 3)
 * Provides 120Hz fluid feed rendering using FlashList and GPU-composited spring micro-interactions.
 */

import React from "react";
import { View, Text, StyleSheet, Image, Platform, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";

export interface ColleaguePulseData {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  department: string;
  currentTaskTitle: string;
  projectBadge: string;
  progressPercentage: number;
  activeTaskCount: number;
  isBlocked?: boolean;
}

interface ColleaguePulseItemProps {
  item: ColleaguePulseData;
}

export const ColleaguePulseItem: React.FC<ColleaguePulseItemProps> = ({ item }) => {
  // Capacity state calculation
  const isOverload = item.isBlocked || item.activeTaskCount > 5;
  const isWarning = item.activeTaskCount >= 4 && item.activeTaskCount <= 5;
  const statusColor = isOverload ? "#EF4444" : isWarning ? "#F59E0B" : "#10B981";

  // Reanimated 120Hz Progress Bar (<8.33ms native driver)
  const progressScale = useSharedValue(Math.max(0, Math.min(1, item.progressPercentage / 100)));

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleX: withSpring(progressScale.value, { damping: 28, stiffness: 350 }) }],
    };
  });

  return (
    <Animated.View style={styles.glassCard}>
      {/* Dynamic Status Aura / Glow Border */}
      <View
        style={[
          styles.statusAura,
          { borderColor: statusColor, shadowColor: statusColor },
        ]}
      />

      <View style={styles.cardHeader}>
        {/* Teammate Profile */}
        <View style={styles.colleagueInfo}>
          <View style={styles.avatarContainer}>
            {item.avatarUrl ? (
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {item.displayName.slice(0, 2).toUpperCase()}
                </Text>
              </View>
            )}
            {/* Live Pulse Indicator Pip */}
            <View style={[styles.statusPip, { backgroundColor: statusColor }]} />
          </View>

          <View>
            <Text style={styles.colleagueName}>{item.displayName}</Text>
            <Text style={styles.departmentText}>{item.department}</Text>
          </View>
        </View>

        {/* Project Tag & Load Badge */}
        <View style={styles.badgeGroup}>
          <View style={styles.projectBadge}>
            <Text style={styles.projectBadgeText}>{item.projectBadge}</Text>
          </View>
          <View
            style={[
              styles.capacityBadge,
              { backgroundColor: `${statusColor}20`, borderColor: `${statusColor}40` },
            ]}
          >
            <Text style={[styles.capacityBadgeText, { color: statusColor }]}>
              {item.activeTaskCount} Tasks
            </Text>
          </View>
        </View>
      </View>

      {/* Current Active Task */}
      <Text style={styles.taskTitle} numberOfLines={2}>
        {item.currentTaskTitle}
      </Text>

      {/* 120Hz Hardware Accelerated Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabelText}>Velocity Status</Text>
          <Text style={styles.progressValueText}>{item.progressPercentage}%</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <Animated.View
            style={[
              styles.progressBarFill,
              { backgroundColor: statusColor },
              animatedProgressStyle,
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: "rgba(15, 23, 42, 0.70)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    overflow: "hidden",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  statusAura: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  colleagueInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  statusPip: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#070A13",
  },
  colleagueName: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "600",
  },
  departmentText: {
    color: "#94A3B8",
    fontSize: 11,
  },
  badgeGroup: {
    alignItems: "flex-end",
    gap: 4,
  },
  projectBadge: {
    backgroundColor: "rgba(37, 99, 235, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.4)",
  },
  projectBadgeText: {
    color: "#60A5FA",
    fontSize: 10,
    fontWeight: "700",
  },
  capacityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  capacityBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  taskTitle: {
    color: "#E2E8F0",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    marginBottom: 12,
  },
  progressContainer: {
    width: "100%",
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressLabelText: {
    color: "#64748B",
    fontSize: 10,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  progressValueText: {
    color: "#CBD5E1",
    fontSize: 10,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    width: "100%",
    borderRadius: 2,
    transformOrigin: "left",
  },
});

export default ColleaguePulseItem;
