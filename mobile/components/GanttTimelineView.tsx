import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { DiamondMilestoneIcon, XIcon } from "./Icons";

export interface Milestone {
  id: string;
  title: string;
  projectId?: string;
  projectName?: string;
  targetDate: string;
  status: "upcoming" | "reached" | "delayed";
  description?: string;
}

export interface RoadmapItem {
  id: string;
  projectId: string;
  projectName: string;
  code: string;
  department: string;
  startWeek: number;
  durationWeeks: number;
  progressPercentage: number;
  status: "on_track" | "at_risk" | "delayed" | "completed";
  leadName: string;
  leadRole: string;
  leadAvatar?: string;
  dependencies?: string[];
  milestones?: Milestone[];
}

export const mockMilestones: Milestone[] = [
  {
    id: "ms-1",
    title: "Sprint 14 Release Gate",
    projectId: "proj-web",
    projectName: "Website Building",
    targetDate: "Sep 28",
    status: "reached",
    description: "All backend auth migrations and frontend mock layouts approved.",
  },
  {
    id: "ms-2",
    title: "SOC 2 Type II Audit Checkpoint",
    projectId: "p4",
    projectName: "Cubbles Engine",
    targetDate: "Oct 12",
    status: "upcoming",
    description: "External auditor inspection of role-based permissions and access logs.",
  },
  {
    id: "ms-3",
    title: "Executive Board Showcase",
    projectId: "p5",
    projectName: "Ui8 Platform",
    targetDate: "Oct 24",
    status: "upcoming",
    description: "Q3 portfolio presentation to leadership with live velocity KPIs.",
  },
  {
    id: "ms-4",
    title: "Q4 Public GA Launch",
    projectId: "proj-mktg",
    projectName: "Digital Marketing",
    targetDate: "Nov 15",
    status: "upcoming",
    description: "Multichannel marketing campaign and global customer onboarding.",
  },
];

export const mockRoadmapItems: RoadmapItem[] = [
  {
    id: "rm-1",
    projectId: "proj-web",
    projectName: "Website Building",
    code: "WEB",
    department: "Engineering",
    startWeek: 1,
    durationWeeks: 4,
    progressPercentage: 75,
    status: "on_track",
    leadName: "Sarah Chen",
    leadRole: "Engineering Lead",
    leadAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    dependencies: ["Core Auth", "Database Sharding"],
    milestones: [mockMilestones[0]],
  },
  {
    id: "rm-2",
    projectId: "p1",
    projectName: "Application Design",
    code: "APP",
    department: "Design",
    startWeek: 2,
    durationWeeks: 3,
    progressPercentage: 62,
    status: "on_track",
    leadName: "David Kim",
    leadRole: "Staff Product Designer",
    leadAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
    dependencies: ["Design Tokens v2"],
  },
  {
    id: "rm-3",
    projectId: "p4",
    projectName: "Cubbles Engine",
    code: "ENG",
    department: "Engineering",
    startWeek: 2,
    durationWeeks: 5,
    progressPercentage: 80,
    status: "on_track",
    leadName: "Marcus Vance",
    leadRole: "Principal Systems Architect",
    leadAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    dependencies: ["WebSocket Cluster"],
    milestones: [mockMilestones[1]],
  },
  {
    id: "rm-4",
    projectId: "p2",
    projectName: "Unity Dashboard",
    code: "UNT",
    department: "Engineering",
    startWeek: 4,
    durationWeeks: 3,
    progressPercentage: 50,
    status: "at_risk",
    leadName: "Elena Rostova",
    leadRole: "Senior Frontend Engineer",
    leadAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
    dependencies: ["Telemetry Aggregator"],
  },
  {
    id: "rm-5",
    projectId: "proj-mktg",
    projectName: "Digital Marketing",
    code: "MKTG",
    department: "Marketing",
    startWeek: 3,
    durationWeeks: 4,
    progressPercentage: 54,
    status: "on_track",
    leadName: "Elena Rostova",
    leadRole: "Growth Specialist",
    leadAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
    dependencies: ["Audience Segments"],
    milestones: [mockMilestones[3]],
  },
  {
    id: "rm-6",
    projectId: "p5",
    projectName: "Ui8 Platform",
    code: "PRD",
    department: "Product",
    startWeek: 5,
    durationWeeks: 3,
    progressPercentage: 90,
    status: "completed",
    leadName: "Sarah Chen",
    leadRole: "VP of Product",
    leadAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    dependencies: ["Roadmap Alignment"],
    milestones: [mockMilestones[2]],
  },
];

interface GanttTimelineViewProps {
  isDark: boolean;
  onSelectProject: (projectId: string) => void;
  triggerHaptic?: (style?: "light" | "selection" | "success") => void;
}

const WEEKS = [
  { id: 1, label: "W38", date: "Sep 15", isCurrent: false },
  { id: 2, label: "W39", date: "Sep 22", isCurrent: true, labelTag: "Sprint 14" },
  { id: 3, label: "W40", date: "Sep 29", isCurrent: false },
  { id: 4, label: "W41", date: "Oct 06", isCurrent: false },
  { id: 5, label: "W42", date: "Oct 13", isCurrent: false, labelTag: "Audit Gate" },
  { id: 6, label: "W43", date: "Oct 20", isCurrent: false },
  { id: 7, label: "W44", date: "Oct 27", isCurrent: false, labelTag: "Board Demo" },
  { id: 8, label: "W45", date: "Nov 03", isCurrent: false, labelTag: "Public GA" },
];

const COL_WIDTH = 110;
const LEFT_COL_WIDTH = 140;

export const GanttTimelineView: React.FC<GanttTimelineViewProps> = ({
  isDark,
  onSelectProject,
  triggerHaptic,
}) => {
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const colors = {
    bg: isDark ? "#0A0F1D" : "#F8FAFC",
    cardBg: isDark ? "#131C31" : "#FFFFFF",
    cardBorder: isDark ? "#24324F" : "#E2E8F0",
    textPrimary: isDark ? "#FFFFFF" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    trackBg: isDark ? "#0F172A" : "#F1F5F9",
    gridLine: isDark ? "#1E293B" : "#E2E8F0",
    currentCol: isDark ? "rgba(117, 110, 243, 0.12)" : "rgba(117, 110, 243, 0.08)",
    primary: "#756EF3",
    emerald: "#10B981",
    amber: "#F59E0B",
    rose: "#EF4444",
  };

  const filteredItems = mockRoadmapItems.filter((item) => {
    if (activeFilter === "all") return true;
    return item.department.toLowerCase() === activeFilter.toLowerCase();
  });

  const getStatusColor = (status: RoadmapItem["status"]) => {
    switch (status) {
      case "completed":
        return colors.emerald;
      case "on_track":
        return colors.primary;
      case "at_risk":
        return colors.amber;
      case "delayed":
        return colors.rose;
      default:
        return colors.primary;
    }
  };

  const getStatusLabel = (status: RoadmapItem["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "on_track":
        return "On Track";
      case "at_risk":
        return "At Risk";
      case "delayed":
        return "Delayed";
      default:
        return "Active";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Portfolio Stats Header */}
      <View style={[styles.statsRow, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{mockRoadmapItems.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Initiatives</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.emerald }]}>
            {mockRoadmapItems.filter((i) => i.status === "on_track" || i.status === "completed").length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>On Schedule</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.amber }]}>
            {mockRoadmapItems.filter((i) => i.status === "at_risk").length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>At Risk</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: "#F59E0B" }]}>{mockMilestones.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Milestones</Text>
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {["all", "engineering", "design", "product", "marketing"].map((dept) => {
          const isActive = activeFilter === dept;
          return (
            <TouchableOpacity
              key={dept}
              onPress={() => {
                triggerHaptic?.("selection");
                setActiveFilter(dept);
              }}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? colors.primary : colors.cardBg,
                  borderColor: isActive ? colors.primary : colors.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: isActive ? "#FFFFFF" : colors.textSecondary },
                ]}
              >
                {dept === "all" ? "All Departments" : dept.charAt(0).toUpperCase() + dept.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Milestones Strip */}
      <View style={[styles.milestoneBar, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <View style={styles.milestoneTitleWrap}>
          <DiamondMilestoneIcon size={14} color={colors.amber} />
          <Text style={[styles.milestoneBarTitle, { color: colors.textPrimary }]}>Key Milestones</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.milestoneScroll}>
          {mockMilestones.map((ms) => {
            const isReached = ms.status === "reached";
            return (
              <TouchableOpacity
                key={ms.id}
                onPress={() => {
                  triggerHaptic?.("selection");
                  setSelectedMilestone(ms);
                }}
                style={[
                  styles.milestoneBadge,
                  {
                    backgroundColor: isReached ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)",
                    borderColor: isReached ? colors.emerald : colors.amber,
                  },
                ]}
              >
                <DiamondMilestoneIcon size={10} color={isReached ? colors.emerald : colors.amber} />
                <Text style={[styles.milestoneBadgeText, { color: colors.textPrimary }]}>
                  {ms.targetDate}: {ms.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Gantt Grid Area */}
      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.timelineHorizontal}>
          <View>
            {/* Timescale Header */}
            <View style={[styles.timescaleHeader, { borderBottomColor: colors.cardBorder }]}>
              {/* Left sticky spacer */}
              <View style={[styles.stickyCorner, { width: LEFT_COL_WIDTH, borderRightColor: colors.cardBorder }]}>
                <Text style={[styles.stickyCornerText, { color: colors.textSecondary }]}>Initiative / Lead</Text>
              </View>

              {/* Week Columns */}
              {WEEKS.map((w) => (
                <View
                  key={w.id}
                  style={[
                    styles.weekColHeader,
                    {
                      width: COL_WIDTH,
                      borderRightColor: colors.gridLine,
                      backgroundColor: w.isCurrent ? colors.currentCol : "transparent",
                    },
                  ]}
                >
                  <Text style={[styles.weekLabel, { color: w.isCurrent ? colors.primary : colors.textPrimary }]}>
                    {w.label}
                  </Text>
                  <Text style={[styles.weekDate, { color: colors.textSecondary }]}>{w.date}</Text>
                  {w.labelTag && (
                    <View
                      style={[
                        styles.weekTagPill,
                        { backgroundColor: w.isCurrent ? colors.primary : colors.cardBorder },
                      ]}
                    >
                      <Text
                        style={[
                          styles.weekTagText,
                          { color: w.isCurrent ? "#FFFFFF" : colors.textSecondary },
                        ]}
                      >
                        {w.labelTag}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Workstream Lanes */}
            {filteredItems.map((item, index) => {
              const statusCol = getStatusColor(item.status);
              const barLeft = LEFT_COL_WIDTH + (item.startWeek - 1) * COL_WIDTH;
              const barWidth = item.durationWeeks * COL_WIDTH - 12;

              return (
                <View
                  key={item.id}
                  style={[
                    styles.laneRow,
                    {
                      borderBottomColor: colors.gridLine,
                      backgroundColor: index % 2 === 0 ? "transparent" : colors.trackBg,
                    },
                  ]}
                >
                  {/* Left Column: Project Code & Lead */}
                  <TouchableOpacity
                    onPress={() => {
                      triggerHaptic?.("selection");
                      setSelectedItem(item);
                    }}
                    style={[
                      styles.leftColCell,
                      { width: LEFT_COL_WIDTH, borderRightColor: colors.cardBorder },
                    ]}
                  >
                    <View style={styles.leftColTop}>
                      <View style={[styles.codeBadge, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                        <Text style={[styles.codeText, { color: colors.primary }]}>{item.code}</Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[styles.initiativeName, { color: colors.textPrimary }]}
                      >
                        {item.projectName}
                      </Text>
                    </View>
                    <View style={styles.leadRow}>
                      {item.leadAvatar ? (
                        <Image source={{ uri: item.leadAvatar }} style={styles.leadAvatar} />
                      ) : (
                        <View style={[styles.leadAvatarFallback, { backgroundColor: colors.primary }]}>
                          <Text style={styles.leadAvatarLetter}>{item.leadName.charAt(0)}</Text>
                        </View>
                      )}
                      <Text numberOfLines={1} style={[styles.leadName, { color: colors.textSecondary }]}>
                        {item.leadName}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Right Timeline Area: Background Grid Lines */}
                  <View style={styles.gridColumnsOverlay} pointerEvents="none">
                    {WEEKS.map((w) => (
                      <View
                        key={w.id}
                        style={[
                          styles.gridColCell,
                          {
                            width: COL_WIDTH,
                            borderRightColor: colors.gridLine,
                            backgroundColor: w.isCurrent ? colors.currentCol : "transparent",
                          },
                        ]}
                      />
                    ))}
                  </View>

                  {/* Gantt Bar Element */}
                  <TouchableOpacity
                    onPress={() => {
                      triggerHaptic?.("selection");
                      setSelectedItem(item);
                    }}
                    style={[
                      styles.ganttBar,
                      {
                        left: barLeft + 6,
                        width: barWidth,
                        backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                        borderColor: statusCol,
                      },
                    ]}
                  >
                    {/* Fill Progress Bar */}
                    <View
                      style={[
                        styles.ganttProgressFill,
                        {
                          width: `${item.progressPercentage}%`,
                          backgroundColor: statusCol,
                        },
                      ]}
                    />

                    {/* Bar Label & Metrics */}
                    <View style={styles.ganttBarContent}>
                      <View style={styles.ganttBarTop}>
                        <Text numberOfLines={1} style={[styles.ganttBarTitle, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                          {item.projectName}
                        </Text>
                        <Text style={[styles.ganttPercent, { color: statusCol }]}>
                          {item.progressPercentage}%
                        </Text>
                      </View>

                      <View style={styles.ganttBarBottom}>
                        <View style={[styles.statusPill, { backgroundColor: `${statusCol}20` }]}>
                          <Text style={[styles.statusPillText, { color: statusCol }]}>
                            {getStatusLabel(item.status)}
                          </Text>
                        </View>
                        {item.dependencies && item.dependencies.length > 0 && (
                          <Text numberOfLines={1} style={[styles.depTag, { color: colors.textSecondary }]}>
                            Dep: {item.dependencies[0]}
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>

      {/* Initiative Inspector Modal */}
      <Modal
        visible={selectedItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View>
                <View style={styles.modalHeaderTagRow}>
                  <View style={[styles.codeBadge, { backgroundColor: colors.trackBg }]}>
                    <Text style={[styles.codeText, { color: colors.primary }]}>{selectedItem?.code}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: `${getStatusColor(selectedItem?.status || "on_track")}20`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        { color: getStatusColor(selectedItem?.status || "on_track") },
                      ]}
                    >
                      {getStatusLabel(selectedItem?.status || "on_track")}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                  {selectedItem?.projectName}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedItem(null)}
                style={[styles.modalCloseBtn, { backgroundColor: colors.trackBg }]}
              >
                <XIcon size={16} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.modalMetaRow}>
                <Text style={[styles.modalMetaLabel, { color: colors.textSecondary }]}>Department</Text>
                <Text style={[styles.modalMetaValue, { color: colors.textPrimary }]}>
                  {selectedItem?.department}
                </Text>
              </View>

              <View style={styles.modalMetaRow}>
                <Text style={[styles.modalMetaLabel, { color: colors.textSecondary }]}>Lead Owner</Text>
                <View style={styles.modalLeadInfo}>
                  <Text style={[styles.modalMetaValue, { color: colors.textPrimary }]}>
                    {selectedItem?.leadName} ({selectedItem?.leadRole})
                  </Text>
                </View>
              </View>

              <View style={styles.modalMetaRow}>
                <Text style={[styles.modalMetaLabel, { color: colors.textSecondary }]}>Timeline Window</Text>
                <Text style={[styles.modalMetaValue, { color: colors.textPrimary }]}>
                  Week {selectedItem?.startWeek} to Week {(selectedItem?.startWeek || 1) + (selectedItem?.durationWeeks || 1) - 1} ({selectedItem?.durationWeeks} weeks)
                </Text>
              </View>

              <View style={styles.modalMetaRow}>
                <Text style={[styles.modalMetaLabel, { color: colors.textSecondary }]}>Progress</Text>
                <Text style={[styles.modalMetaValue, { color: colors.primary, fontWeight: "700" }]}>
                  {selectedItem?.progressPercentage}% Completed
                </Text>
              </View>

              {selectedItem?.dependencies && selectedItem.dependencies.length > 0 && (
                <View style={styles.modalDepBlock}>
                  <Text style={[styles.modalMetaLabel, { color: colors.textSecondary, marginBottom: 6 }]}>
                    Cross-Project Dependencies
                  </Text>
                  <View style={styles.depChipsWrap}>
                    {selectedItem.dependencies.map((dep, i) => (
                      <View key={i} style={[styles.depChip, { backgroundColor: colors.trackBg, borderColor: colors.cardBorder }]}>
                        <Text style={[styles.depChipText, { color: colors.textPrimary }]}>{dep}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => {
                  if (selectedItem) {
                    onSelectProject(selectedItem.projectId);
                    setSelectedItem(null);
                  }
                }}
                style={[styles.primaryActionBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.primaryActionBtnText}>Inspect Project Tasks</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Milestone Detail Modal */}
      <Modal
        visible={selectedMilestone !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMilestone(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View>
                <View style={styles.modalHeaderTagRow}>
                  <DiamondMilestoneIcon size={16} color={selectedMilestone?.status === "reached" ? colors.emerald : colors.amber} />
                  <Text style={[styles.milestoneModalStatus, { color: selectedMilestone?.status === "reached" ? colors.emerald : colors.amber }]}>
                    {selectedMilestone?.status === "reached" ? "Milestone Reached" : "Scheduled Gate"}
                  </Text>
                </View>
                <Text style={[styles.modalTitle, { color: colors.textPrimary, marginTop: 4 }]}>
                  {selectedMilestone?.title}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedMilestone(null)}
                style={[styles.modalCloseBtn, { backgroundColor: colors.trackBg }]}
              >
                <XIcon size={16} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={[styles.milestoneDesc, { color: colors.textSecondary }]}>
                {selectedMilestone?.description}
              </Text>
              <View style={styles.modalMetaRow}>
                <Text style={[styles.modalMetaLabel, { color: colors.textSecondary }]}>Target Gate Date</Text>
                <Text style={[styles.modalMetaValue, { color: colors.textPrimary }]}>
                  {selectedMilestone?.targetDate}
                </Text>
              </View>
              <View style={styles.modalMetaRow}>
                <Text style={[styles.modalMetaLabel, { color: colors.textSecondary }]}>Initiative</Text>
                <Text style={[styles.modalMetaValue, { color: colors.primary }]}>
                  {selectedMilestone?.projectName}
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setSelectedMilestone(null)}
                style={[styles.primaryActionBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.primaryActionBtnText}>Acknowledge Checkpoint</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
  },
  milestoneBar: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  milestoneTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  milestoneBarTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  milestoneScroll: {
    gap: 8,
  },
  milestoneBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  milestoneBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  mainScroll: {
    flex: 1,
  },
  timelineHorizontal: {
    flexDirection: "column",
    paddingBottom: 40,
  },
  timescaleHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    height: 52,
  },
  stickyCorner: {
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRightWidth: 1,
  },
  stickyCornerText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  weekColHeader: {
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    paddingHorizontal: 4,
  },
  weekLabel: {
    fontSize: 12,
    fontWeight: "800",
  },
  weekDate: {
    fontSize: 10,
    fontWeight: "500",
  },
  weekTagPill: {
    marginTop: 2,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  weekTagText: {
    fontSize: 9,
    fontWeight: "700",
  },
  laneRow: {
    flexDirection: "row",
    height: 78,
    borderBottomWidth: 1,
    position: "relative",
  },
  leftColCell: {
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRightWidth: 1,
    zIndex: 2,
  },
  leftColTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  codeBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  codeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  initiativeName: {
    fontSize: 12,
    fontWeight: "700",
    flex: 1,
  },
  leadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  leadAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  leadAvatarFallback: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  leadAvatarLetter: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  leadName: {
    fontSize: 11,
    fontWeight: "500",
    flex: 1,
  },
  gridColumnsOverlay: {
    position: "absolute",
    left: LEFT_COL_WIDTH,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 1,
  },
  gridColCell: {
    height: "100%",
    borderRightWidth: 1,
  },
  ganttBar: {
    position: "absolute",
    top: 12,
    height: 54,
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: "hidden",
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ganttProgressFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    opacity: 0.22,
  },
  ganttBarContent: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: "space-between",
  },
  ganttBarTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ganttBarTitle: {
    fontSize: 12,
    fontWeight: "700",
    flex: 1,
    marginRight: 6,
  },
  ganttPercent: {
    fontSize: 11,
    fontWeight: "800",
  },
  ganttBarBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  depTag: {
    fontSize: 10,
    fontWeight: "500",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  modalHeaderTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    gap: 12,
  },
  modalMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalMetaLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  modalMetaValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  modalLeadInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalDepBlock: {
    marginTop: 4,
  },
  depChipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  depChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  depChipText: {
    fontSize: 11,
    fontWeight: "600",
  },
  modalActions: {
    marginTop: 20,
  },
  primaryActionBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryActionBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  milestoneModalStatus: {
    fontSize: 12,
    fontWeight: "700",
  },
  milestoneDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
});
