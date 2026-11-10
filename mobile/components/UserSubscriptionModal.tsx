import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { XIcon, CheckIcon, CheckCircleFilledIcon } from "./Icons";
import { MemberSubscription } from "./AdminSubscriptionPanelModal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface UserSubscriptionModalProps {
  visible: boolean;
  isDarkMode: boolean;
  onClose: () => void;
  currentSubscription?: MemberSubscription;
  onUpgradePlan: (planId: "free" | "pro" | "enterprise") => void;
  triggerHaptic?: (type?: "light" | "selection" | "success") => void;
}

const PLANS = [
  {
    id: "free" as const,
    name: "Starter Free",
    price: 0,
    tagline: "Essential project tracking for solo creators & micro-teams",
    features: [
      "Up to 3 active projects",
      "Standard Kanban task boards",
      "Community support",
      "7-day activity history",
    ],
    sku: "taskpulse_free_tier",
  },
  {
    id: "pro" as const,
    name: "TaskPulse Pro",
    price: 19,
    tagline: "Supercharged velocity & sprint analytics for growing teams",
    features: [
      "Unlimited active projects & boards",
      "Real-time Sprint Burndown charts",
      "Automated team velocity reports",
      "Executive PDF board exports",
      "Priority 24/7 technical support",
    ],
    sku: "taskpulse_pro_monthly_19",
    popular: true,
  },
  {
    id: "enterprise" as const,
    name: "Enterprise Suite",
    price: 49,
    tagline: "Complete governance, SOC 2 compliance & dedicated support",
    features: [
      "Everything in Pro included",
      "SOC 2 immutable audit logging",
      "Custom RBAC granular permissions",
      "Google Workspace & SAML SSO",
      "Dedicated account manager & SLA",
    ],
    sku: "taskpulse_ent_monthly_49",
  },
];

export const UserSubscriptionModal: React.FC<UserSubscriptionModalProps> = ({
  visible,
  isDarkMode,
  onClose,
  currentSubscription,
  onUpgradePlan,
  triggerHaptic,
}) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [confirmingPlan, setConfirmingPlan] = useState<typeof PLANS[0] | null>(null);

  const colors = {
    bg: isDarkMode ? "#0F172A" : "#FFFFFF",
    cardBg: isDarkMode ? "#1E293B" : "#F8FAFC",
    innerCard: isDarkMode ? "#111827" : "#FFFFFF",
    border: isDarkMode ? "#334155" : "#E2E8F0",
    textPrimary: isDarkMode ? "#F8FAFC" : "#0F172A",
    textSecondary: isDarkMode ? "#94A3B8" : "#64748B",
    primary: "#756EF3",
    success: "#10B981",
    googleBlue: "#4285F4",
  };

  const handleSelectPlan = (plan: typeof PLANS[0]) => {
    if (triggerHaptic) triggerHaptic("selection");
    setConfirmingPlan(plan);
  };

  const handleConfirmGooglePlayPurchase = () => {
    if (!confirmingPlan) return;
    if (triggerHaptic) triggerHaptic("success");
    onUpgradePlan(confirmingPlan.id);
    setConfirmingPlan(null);
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
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                  Subscriptions & Plans
                </Text>
                <View style={styles.playBadge}>
                  <Text style={styles.playBadgeText}>Google Play Billing</Text>
                </View>
              </View>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Scale your workspace with enterprise productivity tiers
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
            contentContainerStyle={{ paddingBottom: 28 }}
          >
            {/* Current Plan Card */}
            {currentSubscription && (
              <View
                style={[
                  styles.currentSubCard,
                  { backgroundColor: colors.cardBg, borderColor: colors.primary },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.currentSubLabel, { color: colors.primary }]}>
                    ACTIVE WORKSPACE PLAN
                  </Text>
                  <Text style={[styles.currentSubName, { color: colors.textPrimary }]}>
                    {currentSubscription.planName}
                  </Text>
                  <Text style={[styles.currentSubRenews, { color: colors.textSecondary }]}>
                    Renews on {currentSubscription.renewsAt} via {currentSubscription.paymentMethod}
                  </Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>
                    {currentSubscription.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            )}

            {/* Cycle Selector */}
            <View
              style={[
                styles.cycleSelector,
                { backgroundColor: colors.cardBg, borderColor: colors.border },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  if (triggerHaptic) triggerHaptic("selection");
                  setBillingCycle("monthly");
                }}
                style={[
                  styles.cycleBtn,
                  billingCycle === "monthly" && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.cycleBtnText,
                    { color: billingCycle === "monthly" ? "#FFFFFF" : colors.textSecondary },
                  ]}
                >
                  Monthly Billing
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (triggerHaptic) triggerHaptic("selection");
                  setBillingCycle("annual");
                }}
                style={[
                  styles.cycleBtn,
                  billingCycle === "annual" && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.cycleBtnText,
                    { color: billingCycle === "annual" ? "#FFFFFF" : colors.textSecondary },
                  ]}
                >
                  Annual Billing (Save 20%)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Plans List */}
            <View style={styles.plansList}>
              {PLANS.map((plan) => {
                const isCurrent = currentSubscription?.planId === plan.id;
                const price =
                  billingCycle === "annual" && plan.price > 0
                    ? Math.round(plan.price * 10)
                    : plan.price;
                const period = billingCycle === "annual" && plan.price > 0 ? "yr" : "mo";

                return (
                  <View
                    key={plan.id}
                    style={[
                      styles.planCard,
                      {
                        backgroundColor: colors.cardBg,
                        borderColor: plan.popular ? colors.primary : colors.border,
                        borderWidth: plan.popular ? 2 : 1,
                      },
                    ]}
                  >
                    {plan.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                      </View>
                    )}

                    <View style={styles.planCardHeader}>
                      <View>
                        <Text style={[styles.planName, { color: colors.textPrimary }]}>
                          {plan.name}
                        </Text>
                        <Text style={[styles.planTagline, { color: colors.textSecondary }]}>
                          {plan.tagline}
                        </Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={[styles.planPrice, { color: colors.textPrimary }]}>
                          ${price}
                        </Text>
                        <Text style={[styles.planPeriod, { color: colors.textSecondary }]}>
                          /{period}
                        </Text>
                      </View>
                    </View>

                    {/* Features */}
                    <View style={styles.featuresList}>
                      {plan.features.map((feat, fIdx) => (
                        <View key={fIdx} style={styles.featureRow}>
                          <View style={styles.featureIconWrap}>
                            <CheckIcon size={12} color="#10B981" />
                          </View>
                          <Text style={[styles.featureText, { color: colors.textPrimary }]}>
                            {feat}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity
                      disabled={isCurrent}
                      onPress={() => handleSelectPlan(plan)}
                      style={[
                        styles.planActionBtn,
                        {
                          backgroundColor: isCurrent
                            ? isDarkMode
                              ? "#334155"
                              : "#E2E8F0"
                            : plan.popular
                            ? colors.primary
                            : colors.googleBlue,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.planActionBtnText,
                          { color: isCurrent ? colors.textSecondary : "#FFFFFF" },
                        ]}
                      >
                        {isCurrent ? "Current Plan" : `Upgrade via Google Play`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* Google Play Billing Confirmation Sheet */}
          {confirmingPlan && (
            <View
              style={[
                styles.confirmSheet,
                { backgroundColor: colors.innerCard, borderColor: colors.border },
              ]}
            >
              <View style={styles.confirmHeader}>
                <Text style={[styles.confirmTitle, { color: colors.textPrimary }]}>
                  Google Play In-App Purchase
                </Text>
                <TouchableOpacity onPress={() => setConfirmingPlan(null)}>
                  <XIcon size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.confirmDesc, { color: colors.textSecondary }]}>
                Confirm subscription to {confirmingPlan.name} for ${confirmingPlan.price}/month billed to your Google Play balance.
              </Text>

              <View
                style={[
                  styles.skuRow,
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.skuLabel, { color: colors.textSecondary }]}>
                  BILLING SKU
                </Text>
                <Text style={[styles.skuValue, { color: colors.textPrimary }]}>
                  {confirmingPlan.sku}
                </Text>
              </View>

              <View style={styles.confirmBtnRow}>
                <TouchableOpacity
                  onPress={() => setConfirmingPlan(null)}
                  style={[styles.cancelBtn, { borderColor: colors.border }]}
                >
                  <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleConfirmGooglePlayPurchase}
                  style={[styles.confirmBtn, { backgroundColor: colors.googleBlue }]}
                >
                  <Text style={styles.confirmBtnText}>Confirm via Google Play</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  playBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(66, 133, 244, 0.15)",
  },
  playBadgeText: {
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
  currentSubCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  currentSubLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  currentSubName: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 2,
  },
  currentSubRenews: {
    fontSize: 11,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
  },
  cycleSelector: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  cycleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  cycleBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  plansList: {
    gap: 14,
  },
  planCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    right: 16,
    backgroundColor: "#756EF3",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  popularBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  planCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  planName: {
    fontSize: 16,
    fontWeight: "700",
  },
  planTagline: {
    fontSize: 11,
    marginTop: 2,
    maxWidth: 200,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: "800",
  },
  planPeriod: {
    fontSize: 11,
  },
  featuresList: {
    marginBottom: 16,
    gap: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIconWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  featureText: {
    fontSize: 12,
  },
  planActionBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  planActionBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  confirmSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 20,
  },
  confirmHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  confirmDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  skuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  skuLabel: {
    fontSize: 10,
    fontWeight: "700",
  },
  skuValue: {
    fontSize: 11,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  confirmBtnRow: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
