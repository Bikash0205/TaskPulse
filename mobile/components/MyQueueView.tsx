import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface MyQueueItemProps {
  task: {
    id: string;
    title: string;
    projectBadge: string;
    status: string;
    progressPercentage: number;
    isBlocked?: boolean;
  };
  onUpdateProgress: (taskId: string, progress: number) => void;
  onToggleBlocked: (taskId: string) => void;
}

export const MyQueueItem: React.FC<MyQueueItemProps> = ({
  task,
  onUpdateProgress,
  onToggleBlocked,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{task.projectBadge}</Text>
        </View>
        <Text style={styles.statusText}>{task.status.replace("_", " ")}</Text>
      </View>

      <Text style={styles.title}>{task.title}</Text>

      {/* Progress Buttons */}
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Velocity: {task.progressPercentage}%</Text>
        <View style={styles.steps}>
          {[25, 50, 75, 100].map((step) => (
            <TouchableOpacity
              key={step}
              onPress={() => onUpdateProgress(task.id, step)}
              style={[
                styles.stepButton,
                task.progressPercentage >= step && styles.stepButtonActive,
              ]}
            >
              <Text style={styles.stepText}>{step}%</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        onPress={() => onToggleBlocked(task.id)}
        style={[styles.blockButton, task.isBlocked && styles.blockButtonActive]}
      >
        <Text style={[styles.blockButtonText, task.isBlocked && styles.blockButtonTextActive]}>
          {task.isBlocked ? "⚠ Flagged as Blocked" : "Mark as Blocked"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(15, 23, 42, 0.70)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "rgba(37, 99, 235, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.4)",
  },
  badgeText: {
    color: "#60A5FA",
    fontSize: 10,
    fontWeight: "700",
  },
  statusText: {
    color: "#94A3B8",
    fontSize: 11,
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressLabel: {
    color: "#94A3B8",
    fontSize: 11,
    fontFamily: "monospace",
  },
  steps: {
    flexDirection: "row",
    gap: 4,
  },
  stepButton: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stepButtonActive: {
    backgroundColor: "rgba(16, 185, 129, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.5)",
  },
  stepText: {
    color: "#E2E8F0",
    fontSize: 10,
    fontFamily: "monospace",
  },
  blockButton: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  blockButtonActive: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  blockButtonText: {
    color: "#94A3B8",
    fontSize: 11,
  },
  blockButtonTextActive: {
    color: "#FCA5A5",
    fontWeight: "600",
  },
});

export default MyQueueItem;
