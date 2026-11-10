import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { XIcon, CheckCircleFilledIcon, SearchIcon, UsersIcon } from "./Icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface MemberSubscription {
  userId: string;
  userName: string;
  userEmail: string;
  role: "admin" | "manager" | "member";
  planId: "free" | "pro" | "enterprise";
  planName: string;
  price: number;
  status: "active" | "trialing" | "past_due" | "cancelled";
  billingCycle: "monthly" | "annual";
  renewsAt: string;
  paymentMethod: string;
  orderId: string;
}

interface AdminSubscriptionPanelModalProps {
  visible: boolean;
  isDarkMode: boolean;
  onClose: () => void;
  subscriptions: MemberSubscription[];
  onUpdateSubscription: (
    userId: string,
    updates: Partial<MemberSubscription>
  ) => void;
  triggerHaptic?: (type?: "light" | "selection" | "success") => void;
}

export const AdminSubscriptionPanelModal: React.FC<
  AdminSubscriptionPanelModalProps
> = ({
  visible,
  isDarkMode,
  onClose,
  subscriptions,
  onUpdateSubscription,
  triggerHaptic,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "enterprise" | "pro" | "free"
  >("all");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const colors = {
    bg: isDarkMode ? "#0F172A" : "#FFFFFF",
    cardBg: isDarkMode ? "#1E293B" : "#F8FAFC",
    innerCard: isDarkMode ? "#111827" : "#FFFFFF",
    border: isDarkMode ? "#334155" : "#E2E8F0",
    textPrimary: isDarkMode ? "#F8FAFC" : "#0F172A",
    textSecondary: isDarkMode ? "#94A3B8" : "#64748B",
    primary: "#756EF3",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  };

  // KPI Calculations
  const metrics = useMemo(() => {
    let mrr = 0;
    let activeCount = 0;
    let entCount = 0;
    let proCount = 0;
    let freeCount = 0;

    subscriptions.forEach((s) => {
      if (s.status === "active" || s.status === "trialing") {
        mrr += s.price;
        activeCount++;
      }
      if (s.planId === "enterprise") entCount++;
      else if (s.planId === "pro") proCount++;
      else freeCount++;
    });

    return { mrr, activeCount, entCount, proCount, freeCount };
  }, [subscriptions]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((s) => {
      const matchesSearch =
        s.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        selectedFilter === "all" || s.planId === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [subscriptions, searchQuery, selectedFilter]);

  const handlePlanChange = (
    userId: string,
    newPlan: "free" | "pro" | "enterprise"
  ) => {
    if (triggerHaptic) triggerHaptic("selection");
    const planName =
      newPlan === "enterprise"
        ? "Enterprise Suite"
        : newPlan === "pro"
        ? "TaskPulse Pro"
        : "Starter Free";
    const price = newPlan === "enterprise" ? 49 : newPlan === "pro" ? 19 : 0;

    onUpdateSubscription(userId, {
      planId: newPlan,
      planName,
      price,
      status: "active",
    });
    setEditingUserId(null);
  };

  const handleExtendTrial = (userId: string, days: number) => {
    if (triggerHaptic) triggerHaptic("selection");
    const currentSub = subscriptions.find((s) => s.userId === userId);
    if (!currentSub) return;

    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + days);
    const newRenewsAt = baseDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    onUpdateSubscription(userId, {
      status: "trialing",
      renewsAt: newRenewsAt,
    });
  };

  const handleToggleStatus = (userId: string) => {
    if (triggerHaptic) triggerHaptic("selection");
    const currentSub = subscriptions.find((s) => s.userId === userId);
    if (!currentSub) return;

    const nextStatus =
      currentSub.status === "active" ? "cancelled" : "active";
    onUpdateSubscription(userId, { status: nextStatus });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.bg, borderColor: colors.border },
          ]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[styles.headerTitle, { color: colors.textPrimary }]}
                >
                  Subscription Governance
                </Text>
                <View
                  style={[
                    styles.billingBadge,
                    { backgroundColor: "rgba(66, 133, 244, 0.15)" },
                  ]}
                >
                  <Text style={styles.billingBadgeText}>
                    Google Play Billing
                  </Text>
                </View>
              </View>
              <Text
                style={[styles.headerSubtitle, { color: colors.textSecondary }]}
              >
                Manage organization seat licenses, billings, and tier assignments
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={[styles.closeBtn, { backgroundColor: colors.cardBg }]}
            >
              <XIcon size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* KPI Cards Row */}
            <View style={styles.kpiRow}>
              <View
                style={[
                  styles.kpiCard,
                  {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[styles.kpiLabel, { color: colors.textSecondary }]}
                >
                  MONTHLY REVENUE
                </Text>
                <Text
                  style={[styles.kpiValue, { color: colors.textPrimary }]}
                >
                  ${metrics.mrr}
                  <Text style={styles.kpiUnit}>/mo</Text>
                </Text>
              </View>

              <View
                style={[
                  styles.kpiCard,
                  {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[styles.kpiLabel, { color: colors.textSecondary }]}
                >
                  ACTIVE SUBSCRIBERS
                </Text>
                <Text
                  style={[styles.kpiValue, { color: colors.primary }]}
                >
                  {metrics.activeCount}
                  <Text style={styles.kpiUnit}>
                    /{subscriptions.length} users
                  </Text>
                </Text>
              </View>

              <View
                style={[
                  styles.kpiCard,
                  {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[styles.kpiLabel, { color: colors.textSecondary }]}
                >
                  ENTERPRISE SEATS
                </Text>
                <Text
                  style={[styles.kpiValue, { color: colors.success }]}
                >
                  {metrics.entCount}
                  <Text style={styles.kpiUnit}> allocated</Text>
                </Text>
              </View>
            </View>

            {/* Search and Filters */}
            <View style={styles.searchSection}>
              <View
                style={[
                  styles.searchBar,
                  {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                  },
                ]}
              >
                <SearchIcon size={16} color={colors.textSecondary} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search members by name or email..."
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.searchInput, { color: colors.textPrimary }]}
                />
              </View>

              {/* Filter Pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtersScroll}
              >
                {(
                  [
                    { key: "all", label: `All (${subscriptions.length})` },
                    {
                      key: "enterprise",
                      label: `Enterprise (${metrics.entCount})`,
                    },
                    { key: "pro", label: `Pro (${metrics.proCount})` },
                    { key: "free", label: `Free (${metrics.freeCount})` },
                  ] as const
                ).map((f) => (
                  <TouchableOpacity
                    key={f.key}
                    onPress={() => {
                      if (triggerHaptic) triggerHaptic("selection");
                      setSelectedFilter(f.key);
                    }}
                    style={[
                      styles.filterPill,
                      {
                        backgroundColor:
                          selectedFilter === f.key
                            ? colors.primary
                            : colors.cardBg,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        {
                          color:
                            selectedFilter === f.key
                              ? "#FFFFFF"
                              : colors.textSecondary,
                        },
                      ]}
                    >
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Subscriptions List */}
            <View style={styles.listSection}>
              {filteredSubscriptions.map((sub) => {
                const isEditing = editingUserId === sub.userId;

                const planBadgeColor =
                  sub.planId === "enterprise"
                    ? "#8B5CF6"
                    : sub.planId === "pro"
                    ? "#3B82F6"
                    : "#64748B";

                const statusBg =
                  sub.status === "active"
                    ? "rgba(16, 185, 129, 0.15)"
                    : sub.status === "trialing"
                    ? "rgba(245, 158, 11, 0.15)"
                    : "rgba(239, 68, 68, 0.15)";

                const statusColor =
                  sub.status === "active"
                    ? "#10B981"
                    : sub.status === "trialing"
                    ? "#F59E0B"
                    : "#EF4444";

                return (
                  <View
                    key={sub.userId}
                    style={[
                      styles.subCard,
                      {
                        backgroundColor: colors.cardBg,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View style={styles.subCardTop}>
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={[
                              styles.subUserName,
                              { color: colors.textPrimary },
                            ]}
                          >
                            {sub.userName}
                          </Text>
                          <View
                            style={[
                              styles.roleBadge,
                              {
                                backgroundColor: isDarkMode
                                  ? "#334155"
                                  : "#E2E8F0",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.roleBadgeText,
                                { color: colors.textSecondary },
                              ]}
                            >
                              {sub.role.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={[
                            styles.subUserEmail,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {sub.userEmail}
                        </Text>
                      </View>

                      {/* Plan and Status Badges */}
                      <View style={{ alignItems: "flex-end" }}>
                        <View
                          style={[
                            styles.planBadge,
                            {
                              backgroundColor: `${planBadgeColor}20`,
                              borderColor: planBadgeColor,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.planBadgeText,
                              { color: planBadgeColor },
                            ]}
                          >
                            {sub.planName} (${sub.price}/mo)
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: statusBg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              { color: statusColor },
                            ]}
                          >
                            {sub.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Metadata Row */}
                    <View
                      style={[
                        styles.metadataRow,
                        { borderTopColor: colors.border },
                      ]}
                    >
                      <Text
                        style={[
                          styles.metadataText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Renewal: {sub.renewsAt} | Gateway: {sub.paymentMethod}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          setEditingUserId(isEditing ? null : sub.userId)
                        }
                        style={styles.editToggleBtn}
                      >
                        <Text style={styles.editToggleBtnText}>
                          {isEditing ? "Done" : "Manage"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Expandable Edit Controls */}
                    {isEditing && (
                      <View
                        style={[
                          styles.editControlsWrap,
                          {
                            backgroundColor: colors.innerCard,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.controlSectionTitle,
                            { color: colors.textSecondary },
                          ]}
                        >
                          CHANGE SUBSCRIPTION TIER
                        </Text>
                        <View style={styles.tierBtnRow}>
                          {(["free", "pro", "enterprise"] as const).map((tier) => (
                            <TouchableOpacity
                              key={tier}
                              onPress={() =>
                                handlePlanChange(sub.userId, tier)
                              }
                              style={[
                                styles.tierOptionBtn,
                                {
                                  backgroundColor:
                                    sub.planId === tier
                                      ? colors.primary
                                      : colors.cardBg,
                                  borderColor: colors.border,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.tierOptionBtnText,
                                  {
                                    color:
                                      sub.planId === tier
                                        ? "#FFFFFF"
                                        : colors.textPrimary,
                                  },
                                ]}
                              >
                                {tier.toUpperCase()}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>

                        <Text
                          style={[
                            styles.controlSectionTitle,
                            { color: colors.textSecondary, marginTop: 10 },
                          ]}
                        >
                          TRIAL & STATUS ACTIONS
                        </Text>
                        <View style={styles.tierBtnRow}>
                          <TouchableOpacity
                            onPress={() => handleExtendTrial(sub.userId, 30)}
                            style={[
                              styles.actionSubBtn,
                              { borderColor: colors.border },
                            ]}
                          >
                            <Text
                              style={[
                                styles.actionSubBtnText,
                                { color: colors.textPrimary },
                              ]}
                            >
                              +30 Days Trial
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => handleExtendTrial(sub.userId, 90)}
                            style={[
                              styles.actionSubBtn,
                              { borderColor: colors.border },
                            ]}
                          >
                            <Text
                              style={[
                                styles.actionSubBtnText,
                                { color: colors.textPrimary },
                              ]}
                            >
                              +90 Days Trial
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => handleToggleStatus(sub.userId)}
                            style={[
                              styles.actionSubBtn,
                              {
                                borderColor:
                                  sub.status === "active"
                                    ? colors.danger
                                    : colors.success,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.actionSubBtnText,
                                {
                                  color:
                                    sub.status === "active"
                                      ? colors.danger
                                      : colors.success,
                                },
                              ]}
                            >
                              {sub.status === "active" ? "Pause" : "Resume"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    maxHeight: "90%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.2)",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  billingBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  billingBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4285F4",
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: "800",
  },
  kpiUnit: {
    fontSize: 11,
    fontWeight: "500",
  },
  searchSection: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
  },
  filtersScroll: {
    flexDirection: "row",
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  listSection: {
    gap: 12,
  },
  subCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  subCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  subUserName: {
    fontSize: 15,
    fontWeight: "700",
  },
  roleBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: "700",
  },
  subUserEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: "700",
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  metadataText: {
    fontSize: 11,
  },
  editToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editToggleBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#756EF3",
  },
  editControlsWrap: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  controlSectionTitle: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tierBtnRow: {
    flexDirection: "row",
    gap: 8,
  },
  tierOptionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  tierOptionBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
  actionSubBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  actionSubBtnText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
