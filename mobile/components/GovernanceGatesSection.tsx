import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { ShieldCheckIcon, ClockIcon, CheckCircleFilledIcon } from "./Icons";

export interface ApprovalGate {
  id: string;
  discipline: string;
  title: string;
  requiredRole: string;
  signedBy?: string;
  signedAt?: string;
  authStamp?: string;
  avatarUrl?: string;
  isSigned: boolean;
}

interface GovernanceGatesSectionProps {
  priority: "low" | "medium" | "high" | "critical";
  gates: ApprovalGate[];
  isDarkMode: boolean;
  onSignGate: (gateId: string) => void;
  triggerHaptic?: (style?: "light" | "selection" | "success") => void;
}

export const GovernanceGatesSection: React.FC<GovernanceGatesSectionProps> = ({
  priority,
  gates,
  isDarkMode,
  onSignGate,
  triggerHaptic,
}) => {
  const colors = {
    cardBg: isDarkMode ? "#1A2234" : "#F8FAFC",
    border: isDarkMode ? "#2D3748" : "#E2E8F0",
    textPrimary: isDarkMode ? "#FFFFFF" : "#0F172A",
    textSecondary: isDarkMode ? "#94A3B8" : "#64748B",
    primary: "#756EF3",
    emerald: "#10B981",
    emeraldBg: isDarkMode ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.1)",
    amber: "#F59E0B",
    amberBg: isDarkMode ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.1)",
    rose: "#EF4444",
    trackBg: isDarkMode ? "#0F172A" : "#E2E8F0",
  };

  // SLA Resolution Policy Configuration
  const getSlaDetails = () => {
    switch (priority) {
      case "critical":
        return { totalHours: 4, remainingStr: "1h 42m remaining", percentElapsed: 58, isWarning: true };
      case "high":
        return { totalHours: 24, remainingStr: "16h 20m remaining", percentElapsed: 32, isWarning: false };
      case "medium":
        return { totalHours: 72, remainingStr: "52h remaining", percentElapsed: 28, isWarning: false };
      default:
        return { totalHours: 120, remainingStr: "98h remaining", percentElapsed: 18, isWarning: false };
    }
  };

  const sla = getSlaDetails();
  const signedCount = gates.filter((g) => g.isSigned).length;
  const allSigned = signedCount === gates.length;

  return (
    <View style={styles.container}>
      {/* SLA Policy Monitor */}
      <View style={[styles.slaCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <View style={styles.slaHeaderRow}>
          <View style={styles.slaTitleWrap}>
            <ClockIcon size={14} color={sla.isWarning ? colors.amber : colors.primary} />
            <Text style={[styles.slaTitle, { color: colors.textPrimary }]}>
              Resolution SLA ({sla.totalHours}h Target)
            </Text>
          </View>
          <View
            style={[
              styles.slaPill,
              {
                backgroundColor: sla.isWarning ? colors.amberBg : colors.emeraldBg,
                borderColor: sla.isWarning ? colors.amber : colors.emerald,
              },
            ]}
          >
            <View
              style={[
                styles.slaStatusDot,
                { backgroundColor: sla.isWarning ? colors.amber : colors.emerald },
              ]}
            />
            <Text
              style={[
                styles.slaPillText,
                { color: sla.isWarning ? colors.amber : colors.emerald },
              ]}
            >
              {sla.remainingStr}
            </Text>
          </View>
        </View>

        {/* SLA Progress Bar */}
        <View style={[styles.slaProgressBarTrack, { backgroundColor: colors.trackBg }]}>
          <View
            style={[
              styles.slaProgressBarFill,
              {
                width: `${sla.percentElapsed}%`,
                backgroundColor: sla.isWarning ? colors.amber : colors.emerald,
              },
            ]}
          />
        </View>

        <View style={styles.slaFooterRow}>
          <Text style={[styles.slaFooterText, { color: colors.textSecondary }]}>
            Target: P{priority === "critical" ? 0 : priority === "high" ? 1 : 2} Enterprise Resolution
          </Text>
          <Text style={[styles.slaFooterText, { color: colors.textSecondary }]}>
            {sla.percentElapsed}% of SLA Window Elapsed
          </Text>
        </View>
      </View>

      {/* Governance Sign-Off Gates Header */}
      <View style={styles.governanceHeaderRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <ShieldCheckIcon size={16} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            GOVERNANCE SIGN-OFF GATES ({signedCount}/{gates.length})
          </Text>
        </View>
        {allSigned && (
          <View style={[styles.allSignedPill, { backgroundColor: colors.emeraldBg, borderColor: colors.emerald }]}>
            <CheckCircleFilledIcon size={12} color={colors.emerald} />
            <Text style={[styles.allSignedText, { color: colors.emerald }]}>Compliant</Text>
          </View>
        )}
      </View>

      {/* Gate Cards List */}
      <View style={styles.gatesList}>
        {gates.map((gate) => (
          <View
            key={gate.id}
            style={[
              styles.gateCard,
              {
                backgroundColor: colors.cardBg,
                borderColor: gate.isSigned ? colors.emerald : colors.border,
              },
            ]}
          >
            <View style={styles.gateTopRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.disciplineTagRow}>
                  <Text style={[styles.disciplineText, { color: colors.primary }]}>
                    {gate.discipline}
                  </Text>
                  <Text style={[styles.requiredRoleText, { color: colors.textSecondary }]}>
                    • {gate.requiredRole}
                  </Text>
                </View>
                <Text style={[styles.gateTitle, { color: colors.textPrimary }]}>
                  {gate.title}
                </Text>
              </View>

              {gate.isSigned ? (
                <View style={[styles.signedBadge, { backgroundColor: colors.emeraldBg }]}>
                  <CheckCircleFilledIcon size={14} color={colors.emerald} />
                  <Text style={[styles.signedBadgeText, { color: colors.emerald }]}>Signed</Text>
                </View>
              ) : (
                <View style={[styles.pendingBadge, { backgroundColor: colors.amberBg }]}>
                  <Text style={[styles.pendingBadgeText, { color: colors.amber }]}>Pending</Text>
                </View>
              )}
            </View>

            {/* Signer Info & Actions */}
            <View style={[styles.gateBottomRow, { borderTopColor: colors.border }]}>
              {gate.isSigned ? (
                <View style={styles.signedAuditInfo}>
                  {gate.avatarUrl ? (
                    <Image source={{ uri: gate.avatarUrl }} style={styles.signerAvatar} />
                  ) : (
                    <View style={[styles.signerAvatarFallback, { backgroundColor: colors.emerald }]}>
                      <Text style={styles.signerAvatarLetter}>
                        {(gate.signedBy || "S").charAt(0)}
                      </Text>
                    </View>
                  )}
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={[styles.signerName, { color: colors.textPrimary }]}>
                      {gate.signedBy}
                    </Text>
                    <Text style={[styles.signedStamp, { color: colors.textSecondary }]}>
                      {gate.signedAt} • {gate.authStamp}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.pendingActionRow}>
                  <Text style={[styles.pendingPrompt, { color: colors.textSecondary }]}>
                    Sign-off authorization required
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      triggerHaptic?.("success");
                      onSignGate(gate.id);
                    }}
                    style={[styles.signGateBtn, { backgroundColor: colors.primary }]}
                  >
                    <ShieldCheckIcon size={12} color="#FFFFFF" />
                    <Text style={styles.signGateBtnText}>Sign Off Gate</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  slaCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  slaHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  slaTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  slaTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  slaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  slaStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  slaPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  slaProgressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  slaProgressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  slaFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slaFooterText: {
    fontSize: 10,
    fontWeight: "500",
  },
  governanceHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  allSignedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  allSignedText: {
    fontSize: 11,
    fontWeight: "700",
  },
  gatesList: {
    gap: 10,
  },
  gateCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  gateTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 12,
  },
  disciplineTagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  disciplineText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  requiredRoleText: {
    fontSize: 11,
    fontWeight: "500",
    marginLeft: 4,
  },
  gateTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  signedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  signedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  pendingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  gateBottomRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  signedAuditInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  signerAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  signerAvatarFallback: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  signerAvatarLetter: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  signerName: {
    fontSize: 12,
    fontWeight: "700",
  },
  signedStamp: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 1,
  },
  pendingActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pendingPrompt: {
    fontSize: 11,
    fontWeight: "500",
  },
  signGateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  signGateBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
