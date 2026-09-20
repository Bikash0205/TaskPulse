import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Alert,
} from "react-native";
import {
  XIcon,
  CheckIcon,
  ShieldCheckIcon,
  BarChartIcon,
  FileTextIcon,
  DownloadIcon,
  TrendingUpIcon,
  LockIcon,
  CalendarIcon,
} from "./Icons";
import { AnimatedToggleSwitch } from "./AnimatedToggleSwitch";

interface CorporateAnalyticsExportModalProps {
  visible: boolean;
  isDarkMode: boolean;
  onClose: () => void;
  triggerHaptic?: (style?: "light" | "selection" | "success") => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const CorporateAnalyticsExportModal: React.FC<CorporateAnalyticsExportModalProps> = ({
  visible,
  isDarkMode,
  onClose,
  triggerHaptic,
}) => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "export">("dashboard");
  const [selectedQuarter, setSelectedQuarter] = useState<"Q3-2026" | "YTD-2026" | "ALL">("Q3-2026");
  const [includeConfidentialWatermark, setIncludeConfidentialWatermark] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState<"pdf" | "csv" | "xlsx">("pdf");

  // Export generation progress state
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState<string>("");
  const [generatedReport, setGeneratedReport] = useState<{
    fileName: string;
    size: string;
    checksum: string;
    timestamp: string;
  } | null>(null);

  const exportProgressAnim = useRef(new Animated.Value(0)).current;

  // Colors
  const bgCard = isDarkMode ? "#131C2E" : "#F8FAFC";
  const bgSubCard = isDarkMode ? "#1A263D" : "#FFFFFF";
  const borderCol = isDarkMode ? "#253554" : "#E2E8F0";
  const textPrimary = isDarkMode ? "#F1F5F9" : "#0F172A";
  const textMuted = isDarkMode ? "#94A3B8" : "#64748B";
  const primaryBrand = "#6366F1";
  const accentSuccess = "#10B981";
  const accentWarning = "#F59E0B";

  const handleStartExport = () => {
    if (isExporting) return;
    if (triggerHaptic) triggerHaptic("selection");
    setIsExporting(true);
    setGeneratedReport(null);
    exportProgressAnim.setValue(0);

    setExportStep("Compiling workstream telemetry & milestones...");

    Animated.timing(exportProgressAnim, {
      toValue: 0.35,
      duration: 650,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      setExportStep("Evaluating SLA adherence & governance logs...");
      Animated.timing(exportProgressAnim, {
        toValue: 0.72,
        duration: 750,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        setExportStep("Generating SHA-256 cryptographic stamp...");
        Animated.timing(exportProgressAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start(() => {
          setIsExporting(false);
          if (triggerHaptic) triggerHaptic("success");

          const now = new Date();
          const dateStr = now.toISOString().slice(0, 10);
          const ext = selectedReportType === "pdf" ? "pdf" : selectedReportType === "csv" ? "csv" : "xlsx";
          const extName = selectedReportType === "pdf" ? "Board_Briefing" : selectedReportType === "csv" ? "Audit_Ledger" : "Resource_Plan";

          setGeneratedReport({
            fileName: `TaskPulse_${selectedQuarter}_${extName}_${dateStr}.${ext}`,
            size: selectedReportType === "pdf" ? "4.2 MB" : selectedReportType === "csv" ? "820 KB" : "1.6 MB",
            checksum: "sha256:7a94b2" + Math.floor(100000 + Math.random() * 900000) + "8c41d0",
            timestamp: "Today, " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          });
        });
      });
    });
  };

  const handleSimulatedDownloadAction = (actionName: string) => {
    if (triggerHaptic) triggerHaptic("selection");
    Alert.alert(
      "Report Action",
      `${actionName} has been executed for document: ${generatedReport?.fileName || "Executive Briefing"}.`,
      [{ text: "OK" }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalSheet,
            {
              backgroundColor: isDarkMode ? "#0B101D" : "#FFFFFF",
              borderColor: borderCol,
              height: "92%",
              maxHeight: "92%",
            },
          ]}
        >
          {/* Top Handle */}
          <View style={styles.handleWrap}>
            <View style={[styles.handleBar, { backgroundColor: isDarkMode ? "#334155" : "#CBD5E1" }]} />
          </View>

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={[styles.titleIconBadge, { backgroundColor: "rgba(99, 102, 241, 0.15)" }]}>
                  <BarChartIcon size={18} color={primaryBrand} />
                </View>
                <Text style={[styles.headerTitle, { color: textPrimary }]}>
                  Executive Analytics
                </Text>
              </View>
              <Text style={[styles.headerSubtitle, { color: textMuted }]}>
                Portfolio Velocity, SLA Adherence & Board Reporting
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (triggerHaptic) triggerHaptic("light");
                onClose();
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={[styles.closeButton, { backgroundColor: isDarkMode ? "#1E293B" : "#F1F5F9" }]}
            >
              <XIcon size={18} color={textMuted} />
            </TouchableOpacity>
          </View>

          {/* Tab Pill Switcher */}
          <View style={[styles.tabBar, { backgroundColor: isDarkMode ? "#131C2E" : "#F1F5F9" }]}>
            <TouchableOpacity
              onPress={() => {
                if (triggerHaptic) triggerHaptic("selection");
                setActiveTab("dashboard");
              }}
              style={[
                styles.tabButton,
                activeTab === "dashboard" && [styles.tabButtonActive, { backgroundColor: primaryBrand }],
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <TrendingUpIcon size={15} color={activeTab === "dashboard" ? "#FFFFFF" : textMuted} />
                <Text
                  style={[
                    styles.tabButtonText,
                    { color: activeTab === "dashboard" ? "#FFFFFF" : textMuted },
                  ]}
                >
                  KPI Dashboard
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (triggerHaptic) triggerHaptic("selection");
                setActiveTab("export");
              }}
              style={[
                styles.tabButton,
                activeTab === "export" && [styles.tabButtonActive, { backgroundColor: primaryBrand }],
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <DownloadIcon size={15} color={activeTab === "export" ? "#FFFFFF" : textMuted} />
                <Text
                  style={[
                    styles.tabButtonText,
                    { color: activeTab === "export" ? "#FFFFFF" : textMuted },
                  ]}
                >
                  Board Export Engine
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Main Scrollable Body */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === "dashboard" ? (
              /* TAB 1: EXECUTIVE KPI DASHBOARD */
              <View style={{ gap: 16 }}>
                {/* Top Metrics Grid */}
                <View style={styles.metricsGrid}>
                  {/* Metric 1 */}
                  <View style={[styles.metricCard, { backgroundColor: bgCard, borderColor: borderCol }]}>
                    <Text style={[styles.metricLabel, { color: textMuted }]}>SLA ADHERENCE</Text>
                    <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                      <Text style={[styles.metricValue, { color: accentSuccess }]}>98.4%</Text>
                      <Text style={[styles.metricBenchmark, { color: textMuted }]}>/ 95.0% tgt</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: "rgba(16, 185, 129, 0.15)", marginTop: 6 }]}>
                      <Text style={[styles.statusBadgeText, { color: accentSuccess }]}>Optimal Performance</Text>
                    </View>
                  </View>

                  {/* Metric 2 */}
                  <View style={[styles.metricCard, { backgroundColor: bgCard, borderColor: borderCol }]}>
                    <Text style={[styles.metricLabel, { color: textMuted }]}>VELOCITY (PTS)</Text>
                    <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                      <Text style={[styles.metricValue, { color: primaryBrand }]}>48.5</Text>
                      <Text style={[styles.metricBenchmark, { color: textMuted }]}>pts/cycle</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: "rgba(99, 102, 241, 0.15)", marginTop: 6 }]}>
                      <Text style={[styles.statusBadgeText, { color: primaryBrand }]}>+12% vs Prev Qtr</Text>
                    </View>
                  </View>

                  {/* Metric 3 */}
                  <View style={[styles.metricCard, { backgroundColor: bgCard, borderColor: borderCol }]}>
                    <Text style={[styles.metricLabel, { color: textMuted }]}>ON-TIME DELIVERY</Text>
                    <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                      <Text style={[styles.metricValue, { color: textPrimary }]}>94.2%</Text>
                      <Text style={[styles.metricBenchmark, { color: textMuted }]}>29 / 31</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: "rgba(16, 185, 129, 0.15)", marginTop: 6 }]}>
                      <Text style={[styles.statusBadgeText, { color: accentSuccess }]}>On Schedule</Text>
                    </View>
                  </View>

                  {/* Metric 4 */}
                  <View style={[styles.metricCard, { backgroundColor: bgCard, borderColor: borderCol }]}>
                    <Text style={[styles.metricLabel, { color: textMuted }]}>AVG RESOLUTION</Text>
                    <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                      <Text style={[styles.metricValue, { color: textPrimary }]}>4.2h</Text>
                      <Text style={[styles.metricBenchmark, { color: textMuted }]}>turnaround</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: "rgba(245, 158, 11, 0.15)", marginTop: 6 }]}>
                      <Text style={[styles.statusBadgeText, { color: accentWarning }]}>Fast Response</Text>
                    </View>
                  </View>
                </View>

                {/* Velocity Histogram Section */}
                <View style={[styles.sectionCard, { backgroundColor: bgCard, borderColor: borderCol }]}>
                  <View style={styles.sectionHeaderRow}>
                    <View>
                      <Text style={[styles.sectionCardTitle, { color: textPrimary }]}>
                        Throughput Velocity Trends
                      </Text>
                      <Text style={[styles.sectionCardSubtitle, { color: textMuted }]}>
                        Story points executed across recent enterprise sprints
                      </Text>
                    </View>
                    <View style={[styles.benchmarkIndicator, { backgroundColor: isDarkMode ? "#1E293B" : "#E2E8F0" }]}>
                      <Text style={[styles.benchmarkText, { color: textMuted }]}>Target: 40 pts</Text>
                    </View>
                  </View>

                  {/* Bar Chart Visual */}
                  <View style={styles.chartContainer}>
                    {[
                      { label: "Sprint 21", pts: 36, max: 60, heightPct: 60 },
                      { label: "Sprint 22", pts: 42, max: 60, heightPct: 70 },
                      { label: "Sprint 23", pts: 45, max: 60, heightPct: 75 },
                      { label: "Sprint 24 (Active)", pts: 52, max: 60, heightPct: 87, active: true },
                    ].map((item, idx) => (
                      <View key={item.label} style={styles.chartBarCol}>
                        <Text style={[styles.chartBarValueText, { color: item.active ? primaryBrand : textMuted }]}>
                          {item.pts}
                        </Text>
                        <View style={[styles.chartBarTrack, { backgroundColor: isDarkMode ? "#1A263D" : "#E2E8F0" }]}>
                          <View
                            style={[
                              styles.chartBarFill,
                              {
                                height: `${item.heightPct}%`,
                                backgroundColor: item.active ? primaryBrand : isDarkMode ? "#475569" : "#94A3B8",
                              },
                            ]}
                          />
                        </View>
                        <Text style={[styles.chartBarLabel, { color: item.active ? textPrimary : textMuted }]}>
                          {item.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Departmental Capital & Resource Allocation */}
                <View style={[styles.sectionCard, { backgroundColor: bgCard, borderColor: borderCol }]}>
                  <Text style={[styles.sectionCardTitle, { color: textPrimary }]}>
                    Departmental Capital & Resource Allocation
                  </Text>
                  <Text style={[styles.sectionCardSubtitle, { color: textMuted }]}>
                    Committed budget utilization for fiscal period
                  </Text>

                  <View style={{ marginTop: 12, gap: 12 }}>
                    {[
                      { dep: "Engineering Core", allocated: "$180,000", used: "$142,500", pct: 79, color: "#6366F1" },
                      { dep: "Design & UX Systems", allocated: "$80,000", used: "$64,200", pct: 80, color: "#10B981" },
                      { dep: "Growth & Marketing", allocated: "$70,000", used: "$48,000", pct: 68, color: "#F59E0B" },
                      { dep: "Compliance & Security", allocated: "$35,000", used: "$22,000", pct: 63, color: "#8B5CF6" },
                    ].map((row) => (
                      <View key={row.dep} style={[styles.depRowCard, { backgroundColor: bgSubCard, borderColor: borderCol }]}>
                        <View style={styles.depRowTop}>
                          <Text style={[styles.depRowTitle, { color: textPrimary }]}>{row.dep}</Text>
                          <Text style={[styles.depRowAmount, { color: textMuted }]}>
                            {row.used} / {row.allocated} ({row.pct}%)
                          </Text>
                        </View>
                        <View style={[styles.depProgressTrack, { backgroundColor: isDarkMode ? "#0B101D" : "#E2E8F0" }]}>
                          <View
                            style={[
                              styles.depProgressFill,
                              { width: `${row.pct}%`, backgroundColor: row.color },
                            ]}
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Portfolio Risk Distribution */}
                <View style={[styles.sectionCard, { backgroundColor: bgCard, borderColor: borderCol }]}>
                  <Text style={[styles.sectionCardTitle, { color: textPrimary }]}>
                    Portfolio Risk Index Distribution
                  </Text>
                  <Text style={[styles.sectionCardSubtitle, { color: textMuted }]}>
                    Algorithmic risk evaluation across 31 active workstreams
                  </Text>

                  <View style={styles.riskBreakdownRow}>
                    <View style={[styles.riskBadgeItem, { backgroundColor: "rgba(16, 185, 129, 0.12)" }]}>
                      <Text style={[styles.riskBadgePct, { color: accentSuccess }]}>68%</Text>
                      <Text style={[styles.riskBadgeTitle, { color: accentSuccess }]}>Low Risk</Text>
                      <Text style={[styles.riskBadgeSub, { color: textMuted }]}>21 Workstreams</Text>
                    </View>

                    <View style={[styles.riskBadgeItem, { backgroundColor: "rgba(245, 158, 11, 0.12)" }]}>
                      <Text style={[styles.riskBadgePct, { color: accentWarning }]}>22%</Text>
                      <Text style={[styles.riskBadgeTitle, { color: accentWarning }]}>Moderate</Text>
                      <Text style={[styles.riskBadgeSub, { color: textMuted }]}>7 Workstreams</Text>
                    </View>

                    <View style={[styles.riskBadgeItem, { backgroundColor: "rgba(239, 68, 68, 0.12)" }]}>
                      <Text style={[styles.riskBadgePct, { color: "#EF4444" }]}>10%</Text>
                      <Text style={[styles.riskBadgeTitle, { color: "#EF4444" }]}>Elevated</Text>
                      <Text style={[styles.riskBadgeSub, { color: textMuted }]}>3 Workstreams</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              /* TAB 2: BOARD EXPORT ENGINE */
              <View style={{ gap: 16 }}>
                {/* Scope Selection */}
                <View style={[styles.sectionCard, { backgroundColor: bgCard, borderColor: borderCol }]}>
                  <Text style={[styles.sectionCardTitle, { color: textPrimary }]}>
                    Select Reporting Period
                  </Text>
                  <Text style={[styles.sectionCardSubtitle, { color: textMuted }]}>
                    Data window captured in generated executive briefs
                  </Text>

                  <View style={styles.periodRow}>
                    {[
                      { id: "Q3-2026", label: "Q3 2026 (Current)" },
                      { id: "YTD-2026", label: "Year-to-Date" },
                      { id: "ALL", label: "All Active" },
                    ].map((p) => {
                      const isSelected = selectedQuarter === p.id;
                      return (
                        <TouchableOpacity
                          key={p.id}
                          onPress={() => {
                            if (triggerHaptic) triggerHaptic("selection");
                            setSelectedQuarter(p.id as any);
                          }}
                          style={[
                            styles.periodButton,
                            {
                              backgroundColor: isSelected ? primaryBrand : bgSubCard,
                              borderColor: isSelected ? primaryBrand : borderCol,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.periodButtonText,
                              { color: isSelected ? "#FFFFFF" : textMuted },
                            ]}
                          >
                            {p.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Report Package Format Selection */}
                <View style={[styles.sectionCard, { backgroundColor: bgCard, borderColor: borderCol }]}>
                  <Text style={[styles.sectionCardTitle, { color: textPrimary }]}>
                    Select Briefing Package
                  </Text>
                  <Text style={[styles.sectionCardSubtitle, { color: textMuted }]}>
                    Format tailored for board presentations or automated compliance ingest
                  </Text>

                  <View style={{ marginTop: 12, gap: 10 }}>
                    {/* Option 1: PDF */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        if (triggerHaptic) triggerHaptic("selection");
                        setSelectedReportType("pdf");
                      }}
                      style={[
                        styles.packageCard,
                        {
                          backgroundColor: bgSubCard,
                          borderColor: selectedReportType === "pdf" ? primaryBrand : borderCol,
                          borderWidth: selectedReportType === "pdf" ? 2 : 1,
                        },
                      ]}
                    >
                      <View style={[styles.packageIconWrap, { backgroundColor: "rgba(99, 102, 241, 0.12)" }]}>
                        <FileTextIcon size={20} color={primaryBrand} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <Text style={[styles.packageTitle, { color: textPrimary }]}>
                            Executive Board Briefing (PDF)
                          </Text>
                          <View style={[styles.packagePill, { backgroundColor: "rgba(99, 102, 241, 0.15)" }]}>
                            <Text style={[styles.packagePillText, { color: primaryBrand }]}>Formal PDF</Text>
                          </View>
                        </View>
                        <Text style={[styles.packageDesc, { color: textMuted }]}>
                          Complete visual deck: Gantt milestones, SLA health, capital burn & cryptographic seal.
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Option 2: CSV */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        if (triggerHaptic) triggerHaptic("selection");
                        setSelectedReportType("csv");
                      }}
                      style={[
                        styles.packageCard,
                        {
                          backgroundColor: bgSubCard,
                          borderColor: selectedReportType === "csv" ? primaryBrand : borderCol,
                          borderWidth: selectedReportType === "csv" ? 2 : 1,
                        },
                      ]}
                    >
                      <View style={[styles.packageIconWrap, { backgroundColor: "rgba(16, 185, 129, 0.12)" }]}>
                        <ShieldCheckIcon size={20} color={accentSuccess} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <Text style={[styles.packageTitle, { color: textPrimary }]}>
                            SOC 2 Audit Ledger Stream (CSV)
                          </Text>
                          <View style={[styles.packagePill, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
                            <Text style={[styles.packagePillText, { color: accentSuccess }]}>Immutable CSV</Text>
                          </View>
                        </View>
                        <Text style={[styles.packageDesc, { color: textMuted }]}>
                          Raw cryptographically hashed audit records with Merkle root, actor ID, and IP origin.
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Option 3: XLSX */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        if (triggerHaptic) triggerHaptic("selection");
                        setSelectedReportType("xlsx");
                      }}
                      style={[
                        styles.packageCard,
                        {
                          backgroundColor: bgSubCard,
                          borderColor: selectedReportType === "xlsx" ? primaryBrand : borderCol,
                          borderWidth: selectedReportType === "xlsx" ? 2 : 1,
                        },
                      ]}
                    >
                      <View style={[styles.packageIconWrap, { backgroundColor: "rgba(245, 158, 11, 0.12)" }]}>
                        <BarChartIcon size={20} color={accentWarning} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <Text style={[styles.packageTitle, { color: textPrimary }]}>
                            Resource & Cost Accounting (XLSX)
                          </Text>
                          <View style={[styles.packagePill, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
                            <Text style={[styles.packagePillText, { color: accentWarning }]}>Spreadsheet</Text>
                          </View>
                        </View>
                        <Text style={[styles.packageDesc, { color: textMuted }]}>
                          Workstream line-item financials, team allocation hours, and completion variances.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Security Watermark Toggle */}
                <View style={[styles.watermarkRow, { backgroundColor: bgCard, borderColor: borderCol }]}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={[styles.watermarkTitle, { color: textPrimary }]}>
                      Confidential Board Watermark
                    </Text>
                    <Text style={[styles.watermarkSub, { color: textMuted }]}>
                      Embeds "CONFIDENTIAL - BOARD OF DIRECTORS" diagonally across all pages.
                    </Text>
                  </View>
                  <AnimatedToggleSwitch
                    value={includeConfidentialWatermark}
                    onValueChange={(val) => {
                      if (triggerHaptic) triggerHaptic("selection");
                      setIncludeConfidentialWatermark(val);
                    }}
                    isDarkMode={isDarkMode}
                    activeColor={primaryBrand}
                  />
                </View>

                {/* Export Action Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={isExporting}
                  onPress={handleStartExport}
                  style={[
                    styles.primaryExportBtn,
                    { backgroundColor: isExporting ? "#475569" : primaryBrand },
                  ]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <DownloadIcon size={18} color="#FFFFFF" />
                    <Text style={styles.primaryExportBtnText}>
                      {isExporting ? "Compiling Report..." : "Generate & Compile Executive Briefing"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Export Progress Bar */}
                {isExporting && (
                  <View style={[styles.progressContainer, { backgroundColor: bgCard, borderColor: borderCol }]}>
                    <Text style={[styles.progressStepText, { color: primaryBrand }]}>{exportStep}</Text>
                    <View style={[styles.progressBarTrack, { backgroundColor: isDarkMode ? "#1A263D" : "#E2E8F0" }]}>
                      <Animated.View
                        style={[
                          styles.progressBarFill,
                          {
                            width: exportProgressAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ["0%", "100%"],
                            }),
                            backgroundColor: primaryBrand,
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}

                {/* Generated Ready Document Card */}
                {generatedReport && (
                  <View style={[styles.readyCard, { backgroundColor: bgSubCard, borderColor: accentSuccess }]}>
                    <View style={styles.readyCardHeader}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <View style={[styles.readyBadge, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
                          <CheckIcon size={14} color={accentSuccess} />
                        </View>
                        <Text style={[styles.readyCardTitle, { color: accentSuccess }]}>
                          Report Compiled & Digitally Signed
                        </Text>
                      </View>
                      <Text style={[styles.readyCardTime, { color: textMuted }]}>
                        {generatedReport.timestamp}
                      </Text>
                    </View>

                    <View style={styles.fileDetailsBox}>
                      <Text style={[styles.fileNameText, { color: textPrimary }]}>
                        {generatedReport.fileName}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 4 }}>
                        <Text style={[styles.fileMetaText, { color: textMuted }]}>
                          Size: {generatedReport.size}
                        </Text>
                        <Text style={[styles.fileMetaText, { color: textMuted }]}>
                          Checksum: {generatedReport.checksum}
                        </Text>
                      </View>
                    </View>

                    {/* Action Row */}
                    <View style={styles.readyActionRow}>
                      <TouchableOpacity
                        onPress={() => handleSimulatedDownloadAction("Download to Device Storage")}
                        style={[styles.readyActionBtn, { backgroundColor: primaryBrand }]}
                      >
                        <DownloadIcon size={14} color="#FFFFFF" />
                        <Text style={styles.readyActionBtnText}>Download</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleSimulatedDownloadAction("Secure Share Link Dispatched")}
                        style={[styles.readyActionBtnSecondary, { borderColor: borderCol }]}
                      >
                        <Text style={[styles.readyActionBtnSecondaryText, { color: textPrimary }]}>
                          Share Link
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleSimulatedDownloadAction("Cryptographic Checksum Copied")}
                        style={[styles.readyActionBtnSecondary, { borderColor: borderCol }]}
                      >
                        <Text style={[styles.readyActionBtnSecondaryText, { color: textPrimary }]}>
                          Copy Hash
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    overflow: "hidden",
  },
  handleWrap: {
    alignItems: "center",
    paddingVertical: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  titleIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  metricCard: {
    width: "48.5%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  metricBenchmark: {
    fontSize: 11,
    fontWeight: "500",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sectionCardTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  sectionCardSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  benchmarkIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  benchmarkText: {
    fontSize: 10,
    fontWeight: "600",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    marginTop: 16,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  chartBarCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  chartBarValueText: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  chartBarTrack: {
    width: 22,
    height: 80,
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  chartBarFill: {
    width: "100%",
    borderRadius: 6,
  },
  chartBarLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
  },
  depRowCard: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  depRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  depRowTitle: {
    fontSize: 12,
    fontWeight: "600",
  },
  depRowAmount: {
    fontSize: 11,
    fontWeight: "500",
  },
  depProgressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  depProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  riskBreakdownRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  riskBadgeItem: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  riskBadgePct: {
    fontSize: 20,
    fontWeight: "800",
  },
  riskBadgeTitle: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  riskBadgeSub: {
    fontSize: 10,
    marginTop: 2,
  },
  periodRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  packageCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  packageIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  packageTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  packagePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  packagePillText: {
    fontSize: 9,
    fontWeight: "700",
  },
  packageDesc: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  watermarkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  watermarkTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  watermarkSub: {
    fontSize: 11,
    marginTop: 2,
  },
  primaryExportBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#6366F1",
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  primaryExportBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  progressContainer: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  progressStepText: {
    fontSize: 12,
    fontWeight: "600",
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  readyCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 10,
  },
  readyCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  readyBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  readyCardTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  readyCardTime: {
    fontSize: 11,
  },
  fileDetailsBox: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  fileNameText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  fileMetaText: {
    fontSize: 10,
    fontFamily: "monospace",
  },
  readyActionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  readyActionBtn: {
    flex: 1.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  readyActionBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  readyActionBtnSecondary: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  readyActionBtnSecondaryText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
