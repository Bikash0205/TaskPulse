"use client";

import React, { useState } from "react";
import { X, Check, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { PlanTierId } from "@shared/types";
import { PLAN_DEFINITIONS, formatPlanStatusLabel, getEffectivePlan, normalizePlanId } from "@shared/plans";
import { useOrganization } from "@/context/OrganizationContext";
import { PlanSelectionCards, PaidFulfillmentMode } from "./PlanSelectionCards";

interface UserSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  userEmail?: string | null;
  onPlanSelected?: (planId: PlanTierId) => void;
}

export const UserSubscriptionModal: React.FC<UserSubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  userEmail,
  onPlanSelected,
}) => {
  const { currentOrg, updateOrgPlan, submitEnterpriseQuote } = useOrganization();
  const effectivePlan = getEffectivePlan(currentOrg, userEmail);
  const resolvedCurrentId = currentPlan ? normalizePlanId(currentPlan) : effectivePlan.id;

  const [selectedPlan, setSelectedPlan] = useState<PlanTierId>(resolvedCurrentId);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    currentOrg?.billingCycle || "monthly"
  );
  const [fulfillmentMode, setFulfillmentMode] = useState<PaidFulfillmentMode>("web_trial");
  const [quoteSeats, setQuoteSeats] = useState<number>(100);
  const [quoteRequirements, setQuoteRequirements] = useState<string>("");
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [successNote, setSuccessNote] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmPlan = async () => {
    setIsUpgrading(true);
    try {
      const targetPlan = PLAN_DEFINITIONS[selectedPlan];
      const billingSource =
        selectedPlan === "free"
          ? ("free" as const)
          : selectedPlan === "enterprise"
          ? ("enterprise_quote" as const)
          : fulfillmentMode;
      const planStatus =
        selectedPlan === "free"
          ? ("active" as const)
          : selectedPlan === "enterprise"
          ? ("quote_pending" as const)
          : fulfillmentMode === "web_trial"
          ? ("trialing" as const)
          : ("past_due" as const);

      if (currentOrg?.id && currentOrg.id !== "org-core") {
        await updateOrgPlan(currentOrg.id, {
          planId: selectedPlan,
          planStatus,
          billingSource,
          billingCycle,
          trialDays: 14,
        });
      }

      if (selectedPlan === "enterprise" && userEmail) {
        await submitEnterpriseQuote({
          orgId: currentOrg?.id,
          companyName: currentOrg?.name || "Workspace",
          contactName: userEmail.split("@")[0],
          contactEmail: userEmail,
          teamSize: currentOrg?.teamSize || "201-1000",
          estimatedSeats: quoteSeats,
          requirements: quoteRequirements.trim() || "Custom enterprise agreement",
        });
      } else if (userEmail) {
        await fetch("/api/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action:
              planStatus === "trialing"
                ? "start_trial"
                : billingSource === "manual_invoice"
                ? "request_invoice"
                : "update_plan",
            userEmail,
            orgId: currentOrg?.id,
            orgName: currentOrg?.name,
            planId: selectedPlan,
            billingSource,
            billingCycle,
            status: planStatus,
            days: 14,
          }),
        });
      }

      onPlanSelected?.(selectedPlan);
      setSuccessNote(
        selectedPlan === "enterprise"
          ? "Enterprise custom quote submitted. Our team will reach out shortly."
          : selectedPlan === "free"
          ? "Workspace plan set to TaskPulse Free."
          : fulfillmentMode === "web_trial"
          ? `14-day ${targetPlan.name} trial activated across Web & Mobile.`
          : fulfillmentMode === "google_play"
          ? `Workspace set to ${targetPlan.name}. Complete payment in Android app to unlock live.`
          : `Invoice / UPI request logged for ${targetPlan.name}.`
      );
      setTimeout(() => {
        setSuccessNote(null);
        onClose();
      }, 1800);
    } catch (e) {
      console.warn("Failed to update plan:", e);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-[#FAF8F4] dark:bg-[#111827] border border-[#DDD8CE] dark:border-slate-800 shadow-2xl text-[#1E222D] dark:text-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#DDD8CE] dark:border-slate-800 flex items-center justify-between bg-[#F4F2ED] dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5D55D6]/10 dark:bg-purple-500/20 flex items-center justify-center text-[#5D55D6] dark:text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">TaskPulse Workspace Plans</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAE8F8] dark:bg-[#5D55D6]/20 text-[#5D55D6] dark:text-[#818CF8] text-[10px] font-bold">
                  {effectivePlan.name} — {formatPlanStatusLabel(currentOrg?.planStatus, currentOrg?.trialEndsAt)}
                </span>
              </div>
              <p className="text-xs text-[#4E5565] dark:text-slate-400 mt-0.5">
                Hybrid entitlement sync keeps Web and Android workspaces aligned in real time via Firestore.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successNote && (
          <div className="px-6 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successNote}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          <PlanSelectionCards
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
            billingCycle={billingCycle}
            onChangeBillingCycle={setBillingCycle}
            fulfillmentMode={fulfillmentMode}
            onChangeFulfillmentMode={setFulfillmentMode}
            quoteSeats={quoteSeats}
            onChangeQuoteSeats={setQuoteSeats}
            quoteRequirements={quoteRequirements}
            onChangeQuoteRequirements={setQuoteRequirements}
            orgIdForDeepLink={currentOrg?.id}
            currentActivePlan={resolvedCurrentId}
          />
        </div>

        <div className="px-6 py-3.5 border-t border-[#DDD8CE] dark:border-slate-800 bg-[#F4F2ED] dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#4E5565] dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#0F8C65]" />
            <span>Hybrid Flow: Web Trial, Manual Invoice/UPI &amp; Google Play Billing Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DDD8CE] dark:border-slate-700 text-[#4E5565] dark:text-slate-300 font-semibold text-xs cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              disabled={isUpgrading}
              onClick={handleConfirmPlan}
              className="px-5 py-2 rounded-xl bg-[#5D55D6] hover:bg-[#4F47C7] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>
                {isUpgrading
                  ? "Applying Plan..."
                  : selectedPlan === "enterprise"
                  ? "Submit Custom Quote"
                  : selectedPlan === "free"
                  ? "Switch to Free"
                  : fulfillmentMode === "web_trial"
                  ? `Start 14-Day ${PLAN_DEFINITIONS[selectedPlan].shortName} Trial`
                  : fulfillmentMode === "google_play"
                  ? "Link Google Play Purchase"
                  : "Request Invoice Activation"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
