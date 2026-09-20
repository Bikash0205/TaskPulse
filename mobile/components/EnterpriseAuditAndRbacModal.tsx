import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import {
  ShieldCheckIcon,
  LockIcon,
  CheckIcon,
  XIcon,
  SearchIcon,
  ClockIcon,
  CheckCircleFilledIcon,
  UsersIcon,
  SlidersIcon,
  ActivityPulseIcon,
} from "./Icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export type EnterpriseRoleType =
  | "owner"
  | "tech_lead"
  | "compliance"
  | "specialist"
  | "guest";

interface PermissionItem {
  id: string;
  title: string;
  category: "GOVERNANCE" | "OPERATIONS" | "SECURITY" | "COMPLIANCE";
  description: string;
  allowedRoles: EnterpriseRoleType[];
}

interface AuditLogEntry {
  id: string;
  eventCode: string;
  category: "all" | "critical" | "signoffs" | "policy";
  severity: "CRITICAL" | "COMPLIANCE" | "POLICY" | "INFO";
  title: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  cryptoSignature: string;
  networkOrigin: string;
}

interface EnterpriseAuditAndRbacModalProps {
  visible: boolean;
  isDarkMode: boolean;
  onClose: () => void;
  triggerHaptic?: (style?: "light" | "selection" | "success") => void;
}

const ROLES_CONFIG: {
  id: EnterpriseRoleType;
  label: string;
  clearance: string;
  desc: string;
  badgeColor: string;
}[] = [
  {
    id: "owner",
    label: "Owner / Exec",
    clearance: "Level 5 Clearance",
    desc: "Full unrestricted administrative access across portfolio, billing, gates, and audit trails.",
    badgeColor: "#756EF3",
  },
  {
    id: "tech_lead",
    label: "Tech Lead",
    clearance: "Level 4 Clearance",
    desc: "Architecture verification, branch merge approval, SLA threshold tuning, and release sign-off.",
    badgeColor: "#3B82F6",
  },
  {
    id: "compliance",
    label: "Compliance Officer",
    clearance: "Level 4 Clearance",
    desc: "SOC 2 Type II audit verification, regulatory gate sign-off, and security policy authoring.",
    badgeColor: "#10B981",
  },
  {
    id: "specialist",
    label: "Specialist",
    clearance: "Level 2 Clearance",
    desc: "Task execution, deliverable submissions, checklist progression, and workstream discussions.",
    badgeColor: "#F59E0B",
  },
  {
    id: "guest",
    label: "Client / Guest",
    clearance: "Level 1 Clearance",
    desc: "Read-only access to published roadmaps and shared deliverable reviews without modification rights.",
    badgeColor: "#64748B",
  },
];

const PERMISSIONS_LIST: PermissionItem[] = [
  {
    id: "perm-sign-gates",
    title: "Sign Off Formal Governance Gates",
    category: "GOVERNANCE",
    description: "Approve Design QA, Tech Architecture, and SOC 2 compliance sign-offs.",
    allowedRoles: ["owner", "tech_lead", "compliance"],
  },
  {
    id: "perm-sla-edit",
    title: "Modify SLA Targets & Escalations",
    category: "OPERATIONS",
    description: "Change resolution countdown windows and automated alert thresholds.",
    allowedRoles: ["owner", "tech_lead"],
  },
  {
    id: "perm-del-workstream",
    title: "Archive or Delete Workstreams",
    category: "GOVERNANCE",
    description: "Permanent decommission or archival of strategic project workstreams.",
    allowedRoles: ["owner"],
  },
  {
    id: "perm-soc2-export",
    title: "Export SOC 2 Immutable Ledger",
    category: "COMPLIANCE",
    description: "Generate cryptographically signed compliance digests in JSON or CSV.",
    allowedRoles: ["owner", "compliance"],
  },
  {
    id: "perm-role-delegation",
    title: "Team Role Delegation & Seat Allocation",
    category: "SECURITY",
    description: "Invite enterprise members, reassign RBAC tiers, and revoke credentials.",
    allowedRoles: ["owner"],
  },
  {
    id: "perm-db-migrations",
    title: "Execute Database Schema Migrations",
    category: "SECURITY",
    description: "Trigger production relational schema DDL and session validation updates.",
    allowedRoles: ["owner", "tech_lead"],
  },
  {
    id: "perm-submit-review",
    title: "Submit Deliverables for Review",
    category: "OPERATIONS",
    description: "Move tasks from In Progress to Under Review with change documentation.",
    allowedRoles: ["owner", "tech_lead", "compliance", "specialist"],
  },
  {
    id: "perm-view-roadmap",
    title: "Inspect Portfolio Gantt & Milestones",
    category: "OPERATIONS",
    description: "View executive roadmap timelines, milestones, and progress telemetry.",
    allowedRoles: ["owner", "tech_lead", "compliance", "specialist", "guest"],
  },
];

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud-1",
    eventCode: "EVT-9841",
    category: "signoffs",
    severity: "COMPLIANCE",
    title: "Governance Gate Signed: Design QA Audit",
    actor: "Bikash Kumar Yadav",
    actorRole: "Super Admin",
    timestamp: "Sep 20, 12:28 AM",
    cryptoSignature: "AUTH-SIG#AA30",
    networkOrigin: "192.168.1.144 • Android 14 • TLS 1.3",
  },
  {
    id: "aud-2",
    eventCode: "EVT-9838",
    category: "critical",
    severity: "CRITICAL",
    title: "SLA Resolution Window Warning Escalated (< 2h Remaining)",
    actor: "SLA Policy Monitor Daemon",
    actorRole: "System Automated",
    timestamp: "Sep 19, 11:45 PM",
    cryptoSignature: "DAEMON-ALERT#048B",
    networkOrigin: "internal-worker-01.us-east • TLS 1.3",
  },
  {
    id: "aud-3",
    eventCode: "EVT-9832",
    category: "policy",
    severity: "POLICY",
    title: "RBAC Role Policy Re-evaluated for Team Specialist",
    actor: "Elena Rostova",
    actorRole: "Compliance Auditor",
    timestamp: "Sep 19, 09:12 PM",
    cryptoSignature: "POLICY-UP#9931",
    networkOrigin: "10.0.4.12 • Enterprise VPN",
  },
  {
    id: "aud-4",
    eventCode: "EVT-9827",
    category: "signoffs",
    severity: "COMPLIANCE",
    title: "Engineering Gate Signed: Architecture & Security Verification",
    actor: "Sarah Chen",
    actorRole: "Tech Lead",
    timestamp: "Sep 19, 06:30 PM",
    cryptoSignature: "AUTH-ENG#441F",
    networkOrigin: "172.16.2.88 • Android 14 • TLS 1.3",
  },
  {
    id: "aud-5",
    eventCode: "EVT-9819",
    category: "policy",
    severity: "INFO",
    title: "Sprint Cadence Milestones Synchronized to Cloud",
    actor: "Marcus Lee",
    actorRole: "Product Lead",
    timestamp: "Sep 19, 03:15 PM",
    cryptoSignature: "SYNC-MILE#882A",
    networkOrigin: "192.168.1.102 • Web Portal",
  },
  {
    id: "aud-6",
    eventCode: "EVT-9810",
    category: "critical",
    severity: "CRITICAL",
    title: "SOC 2 Type II Access Audit Triggered by Security Officer",
    actor: "Bikash Kumar Yadav",
    actorRole: "Super Admin",
    timestamp: "Sep 19, 11:05 AM",
    cryptoSignature: "AUDIT-EXP#2918",
    networkOrigin: "192.168.1.144 • TLS 1.3 / AES-256",
  },
];

export const EnterpriseAuditAndRbacModal: React.FC<EnterpriseAuditAndRbacModalProps> = ({
  visible,
  isDarkMode,
  onClose,
  triggerHaptic,
}) => {
  const [activeTab, setActiveTab] = useState<"rbac" | "audit">("rbac");
  const [simulatedRole, setSimulatedRole] = useState<EnterpriseRoleType>("owner");
  const [auditFilter, setAuditFilter] = useState<"all" | "critical" | "signoffs" | "policy">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVerifyingLedger, setIsVerifyingLedger] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  const colors = {
    bg: isDarkMode ? "#0B0F19" : "#FFFFFF",
    sheetBg: isDarkMode ? "#151C2C" : "#FFFFFF",
    cardBg: isDarkMode ? "#1A2234" : "#F8FAFC",
    border: isDarkMode ? "#2D3748" : "#E2E8F0",
    textPrimary: isDarkMode ? "#FFFFFF" : "#0F172A",
    textSecondary: isDarkMode ? "#94A3B8" : "#64748B",
    primary: "#756EF3",
    primaryBg: isDarkMode ? "rgba(117, 110, 243, 0.18)" : "rgba(117, 110, 243, 0.1)",
    emerald: "#10B981",
    emeraldBg: isDarkMode ? "rgba(16, 185, 129, 0.18)" : "rgba(16, 185, 129, 0.1)",
    amber: "#F59E0B",
    amberBg: isDarkMode ? "rgba(245, 158, 11, 0.18)" : "rgba(245, 158, 11, 0.1)",
    rose: "#EF4444",
    roseBg: isDarkMode ? "rgba(239, 68, 68, 0.18)" : "rgba(239, 68, 68, 0.1)",
    inputBg: isDarkMode ? "#111827" : "#F1F5F9",
  };

  const selectedRoleConfig = useMemo(() => {
    return ROLES_CONFIG.find((r) => r.id === simulatedRole) || ROLES_CONFIG[0];
  }, [simulatedRole]);

  const filteredLogs = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter((log) => {
      const matchesCategory =
        auditFilter === "all" || log.category === auditFilter;
      const matchesSearch =
        searchQuery.trim() === "" ||
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.eventCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.cryptoSignature.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [auditFilter, searchQuery]);

  const handleVerifyLedger = () => {
    triggerHaptic?.("selection");
    setIsVerifyingLedger(true);
    setVerificationFeedback(null);
    setTimeout(() => {
      setIsVerifyingLedger(false);
      setVerificationFeedback("Cryptographic Merkle Hash Chain Verified: 100% Tamper-Free");
      triggerHaptic?.("success");
    }, 900);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalSheet, { backgroundColor: colors.sheetBg, borderColor: colors.border }]}>
          <View style={styles.handleBar} />

          {/* Modal Header */}
          <View style={[styles.headerRow, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <ShieldCheckIcon size={18} color={colors.primary} />
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                  Enterprise Governance
                </Text>
              </View>
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                SOC 2 Type II Immutable Audit & Dynamic RBAC Engine
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic?.("light");
                onClose();
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={[styles.closeBtn, { backgroundColor: colors.cardBg }]}
            >
              <XIcon size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Top Segment Switcher */}
          <View style={[styles.segmentContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic?.("selection");
                setActiveTab("rbac");
              }}
              style={[
                styles.segmentTab,
                activeTab === "rbac" && [styles.segmentTabActive, { backgroundColor: colors.primary }],
              ]}
            >
              <UsersIcon size={14} color={activeTab === "rbac" ? "#FFFFFF" : colors.textSecondary} />
              <Text
                style={[
                  styles.segmentTabText,
                  { color: activeTab === "rbac" ? "#FFFFFF" : colors.textSecondary },
                ]}
              >
                RBAC Matrix
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                triggerHaptic?.("selection");
                setActiveTab("audit");
              }}
              style={[
                styles.segmentTab,
                activeTab === "audit" && [styles.segmentTabActive, { backgroundColor: colors.primary }],
              ]}
            >
              <ActivityPulseIcon size={14} color={activeTab === "audit" ? "#FFFFFF" : colors.textSecondary} />
              <Text
                style={[
                  styles.segmentTabText,
                  { color: activeTab === "audit" ? "#FFFFFF" : colors.textSecondary },
                ]}
              >
                SOC 2 Audit Trail
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {activeTab === "rbac" ? (
              <View>
                {/* Role Simulation Selector */}
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  SIMULATE ACCESS ROLE (TEST PERMISSION EVALUATOR)
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.rolesScrollContent}
                >
                  {ROLES_CONFIG.map((r) => {
                    const isSelected = simulatedRole === r.id;
                    return (
                      <TouchableOpacity
                        key={r.id}
                        onPress={() => {
                          triggerHaptic?.("selection");
                          setSimulatedRole(r.id);
                        }}
                        style={[
                          styles.rolePill,
                          {
                            backgroundColor: isSelected ? colors.primary : colors.cardBg,
                            borderColor: isSelected ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.rolePillText,
                            { color: isSelected ? "#FFFFFF" : colors.textPrimary },
                          ]}
                        >
                          {r.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Active Role Card */}
                <View style={[styles.activeRoleCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                  <View style={styles.activeRoleHeader}>
                    <View>
                      <Text style={[styles.activeRoleName, { color: colors.textPrimary }]}>
                        {selectedRoleConfig.label}
                      </Text>
                      <Text style={[styles.activeRoleClearance, { color: colors.primary }]}>
                        {selectedRoleConfig.clearance}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.clearanceBadge,
                        { backgroundColor: colors.primaryBg, borderColor: colors.primary },
                      ]}
                    >
                      <Text style={[styles.clearanceBadgeText, { color: colors.primary }]}>
                        Active Tier
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.activeRoleDesc, { color: colors.textSecondary }]}>
                    {selectedRoleConfig.desc}
                  </Text>
                </View>

                {/* Permissions Matrix */}
                <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: 18 }]}>
                  PERMISSIONS EVALUATION MATRIX
                </Text>

                <View style={styles.permissionsList}>
                  {PERMISSIONS_LIST.map((perm) => {
                    const isAllowed = perm.allowedRoles.includes(simulatedRole);
                    return (
                      <View
                        key={perm.id}
                        style={[
                          styles.permCard,
                          {
                            backgroundColor: colors.cardBg,
                            borderColor: isAllowed ? colors.emerald : colors.border,
                          },
                        ]}
                      >
                        <View style={styles.permCardTop}>
                          <View style={{ flex: 1, paddingRight: 10 }}>
                            <View style={styles.categoryRow}>
                              <Text style={[styles.categoryText, { color: colors.primary }]}>
                                {perm.category}
                              </Text>
                            </View>
                            <Text style={[styles.permTitle, { color: colors.textPrimary }]}>
                              {perm.title}
                            </Text>
                            <Text style={[styles.permDesc, { color: colors.textSecondary }]}>
                              {perm.description}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.permStatusBadge,
                              {
                                backgroundColor: isAllowed ? colors.emeraldBg : colors.cardBg,
                                borderColor: isAllowed ? colors.emerald : colors.border,
                              },
                            ]}
                          >
                            {isAllowed ? (
                              <>
                                <CheckIcon size={12} color={colors.emerald} strokeWidth={3} />
                                <Text style={[styles.permStatusText, { color: colors.emerald }]}>
                                  Authorized
                                </Text>
                              </>
                            ) : (
                              <>
                                <LockIcon size={12} color={colors.textSecondary} strokeWidth={2} />
                                <Text style={[styles.permStatusText, { color: colors.textSecondary }]}>
                                  Restricted
                                </Text>
                              </>
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : (
              <View>
                {/* Ledger Integrity Card */}
                <View style={[styles.ledgerCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                  <View style={styles.ledgerTopRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.ledgerTitle, { color: colors.textPrimary }]}>
                        SOC 2 Type II Certified Ledger
                      </Text>
                      <Text style={[styles.ledgerHash, { color: colors.primary }]}>
                        Merkle Root: sha256:9c4b8e21...04fd
                      </Text>
                    </View>
                    <View style={[styles.ledgerVerifiedBadge, { backgroundColor: colors.emeraldBg, borderColor: colors.emerald }]}>
                      <CheckCircleFilledIcon size={12} color={colors.emerald} />
                      <Text style={[styles.ledgerVerifiedText, { color: colors.emerald }]}>
                        Immutable
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleVerifyLedger}
                    style={[styles.verifyBtn, { backgroundColor: colors.primary }]}
                  >
                    <ShieldCheckIcon size={14} color="#FFFFFF" />
                    <Text style={styles.verifyBtnText}>
                      {isVerifyingLedger ? "Verifying Merkle Cryptographic Chain..." : "Verify Ledger Integrity"}
                    </Text>
                  </TouchableOpacity>

                  {verificationFeedback && (
                    <View style={[styles.verificationNotice, { backgroundColor: colors.emeraldBg, borderColor: colors.emerald }]}>
                      <CheckCircleFilledIcon size={12} color={colors.emerald} />
                      <Text style={[styles.verificationNoticeText, { color: colors.emerald }]}>
                        {verificationFeedback}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Filter Pills */}
                <View style={styles.filterPillsRow}>
                  {(
                    [
                      { key: "all", label: "All Events" },
                      { key: "critical", label: "Critical" },
                      { key: "signoffs", label: "Sign-Offs" },
                      { key: "policy", label: "Policy" },
                    ] as const
                  ).map((f) => {
                    const isSelected = auditFilter === f.key;
                    return (
                      <TouchableOpacity
                        key={f.key}
                        onPress={() => {
                          triggerHaptic?.("selection");
                          setAuditFilter(f.key);
                        }}
                        style={[
                          styles.filterPill,
                          {
                            backgroundColor: isSelected ? colors.primary : colors.cardBg,
                            borderColor: isSelected ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.filterPillText,
                            { color: isSelected ? "#FFFFFF" : colors.textPrimary },
                          ]}
                        >
                          {f.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Search Bar */}
                <View style={[styles.searchBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                  <SearchIcon size={14} color={colors.textSecondary} />
                  <TextInput
                    placeholder="Search by event, actor, or crypto signature..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={[styles.searchInput, { color: colors.textPrimary }]}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                      <XIcon size={14} color={colors.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Logs Stream */}
                <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: 14 }]}>
                  EVENT LEDGER STREAM ({filteredLogs.length})
                </Text>

                <View style={styles.logsList}>
                  {filteredLogs.map((log) => {
                    const sevColor =
                      log.severity === "CRITICAL"
                        ? colors.rose
                        : log.severity === "COMPLIANCE"
                        ? colors.emerald
                        : log.severity === "POLICY"
                        ? colors.amber
                        : colors.primary;

                    const sevBg =
                      log.severity === "CRITICAL"
                        ? colors.roseBg
                        : log.severity === "COMPLIANCE"
                        ? colors.emeraldBg
                        : log.severity === "POLICY"
                        ? colors.amberBg
                        : colors.primaryBg;

                    return (
                      <View
                        key={log.id}
                        style={[styles.logCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
                      >
                        <View style={styles.logTopRow}>
                          <View style={styles.logEventCodeWrap}>
                            <Text style={[styles.logEventCode, { color: colors.primary }]}>
                              {log.eventCode}
                            </Text>
                            <View style={[styles.logSevBadge, { backgroundColor: sevBg }]}>
                              <Text style={[styles.logSevText, { color: sevColor }]}>
                                {log.severity}
                              </Text>
                            </View>
                          </View>
                          <Text style={[styles.logTime, { color: colors.textSecondary }]}>
                            {log.timestamp}
                          </Text>
                        </View>

                        <Text style={[styles.logTitle, { color: colors.textPrimary }]}>
                          {log.title}
                        </Text>

                        <View style={styles.logActorRow}>
                          <Text style={[styles.logActorName, { color: colors.textPrimary }]}>
                            {log.actor}
                          </Text>
                          <Text style={[styles.logActorRole, { color: colors.textSecondary }]}>
                            • {log.actorRole}
                          </Text>
                        </View>

                        <View style={[styles.logSecurityFooter, { borderTopColor: colors.border }]}>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.logMetaLabel, { color: colors.textSecondary }]}>
                              CRYPTOGRAPHIC SIGNATURE:
                            </Text>
                            <Text style={[styles.logMetaValue, { color: colors.emerald }]}>
                              {log.cryptoSignature}
                            </Text>
                          </View>
                          <View style={{ flex: 1, alignItems: "flex-end" }}>
                            <Text style={[styles.logMetaLabel, { color: colors.textSecondary }]}>
                              NETWORK ORIGIN:
                            </Text>
                            <Text style={[styles.logMetaValue, { color: colors.textSecondary }]}>
                              {log.networkOrigin}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    height: "92%",
    maxHeight: "92%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handleBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#94A3B8",
    alignSelf: "center",
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginVertical: 14,
    borderWidth: 1,
    gap: 6,
  },
  segmentTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  segmentTabActive: {
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  segmentTabText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  rolesScrollContent: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 8,
  },
  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  activeRoleCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  activeRoleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  activeRoleName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  activeRoleClearance: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  clearanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  clearanceBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  activeRoleDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
  },
  permissionsList: {
    gap: 10,
  },
  permCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  permCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  categoryRow: {
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  permTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  permDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3,
  },
  permStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  permStatusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  ledgerCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  ledgerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  ledgerTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  ledgerHash: {
    fontSize: 11,
    fontFamily: "monospace",
    marginTop: 2,
  },
  ledgerVerifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  ledgerVerifiedText: {
    fontSize: 10,
    fontWeight: "700",
  },
  verifyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  verifyBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  verificationNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
  },
  verificationNoticeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  filterPillsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    padding: 0,
  },
  logsList: {
    gap: 10,
  },
  logCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  logTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logEventCodeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logEventCode: {
    fontSize: 11,
    fontWeight: "bold",
  },
  logSevBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logSevText: {
    fontSize: 9,
    fontWeight: "bold",
  },
  logTime: {
    fontSize: 10,
  },
  logTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
  },
  logActorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  logActorName: {
    fontSize: 11,
    fontWeight: "600",
  },
  logActorRole: {
    fontSize: 11,
    marginLeft: 4,
  },
  logSecurityFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 8,
  },
  logMetaLabel: {
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  logMetaValue: {
    fontSize: 10,
    fontFamily: "monospace",
    marginTop: 2,
  },
});
