"use client";

import React, { useState } from "react";
import {
  X,
  Check,
  Zap,
  Sparkles,
  Award,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

interface UserSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  userEmail?: string | null;
  onPlanSelected?: (planId: "free" | "pro" | "enterprise") => void;
}

export const UserSubscriptionModal: React.FC<UserSubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentPlan = "pro",
  userEmail,
  onPlanSelected,
}) => {
  const [selectedBilling, setSelectedBilling] = useState<"monthly" | "annual">("monthly");
  const [activeTier, setActiveTier] = useState<string>(currentPlan.toLowerCase());
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [successNote, setSuccessNote] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectTier = async (tierId: "free" | "pro" | "enterprise") => {
    setIsUpgrading(true);
    try {
      if (userEmail) {
        await fetch("/api/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_plan",
            userEmail,
            planId: tierId,
          }),
        });
      }
      setActiveTier(tierId);
      onPlanSelected?.(tierId);
      setSuccessNote(`Plan updated to ${tierId.toUpperCase()} via Google Play Billing.`);
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
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-[#111827] border border-[#E9F1FF] dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Zap className="w-5 h-5 fill-purple-600 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">TaskPulse Workspace Plans</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Scale your team with enterprise telemetry, automated SLA gates, and unlimited projects.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successNote && (
          <div className="px-6 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successNote}</span>
          </div>
        )}

        {/* Billing cycle toggle */}
        <div className="px-6 pt-5 pb-2 flex justify-center">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setSelectedBilling("monthly")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedBilling === "monthly"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setSelectedBilling("annual")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                selectedBilling === "annual"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Tier Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Free Tier */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Starter
                </span>
                {activeTier === "free" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Current
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold mt-2">$0</div>
              <p className="text-xs text-slate-500 mt-1">For small teams getting started.</p>

              <div className="space-y-2.5 mt-5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Up to 3 Active Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Basic Kanban Board</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>7-Day Activity Audit History</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectTier("free")}
              disabled={activeTier === "free" || isUpgrading}
              className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {activeTier === "free" ? "Active Plan" : "Downgrade to Starter"}
            </button>
          </div>

          {/* Pro Tier (Popular) */}
          <div className="p-5 rounded-2xl border-2 border-purple-500 bg-purple-50/20 dark:bg-purple-950/20 flex flex-col justify-between relative shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Pro Workspace
                </span>
                {activeTier === "pro" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                    Current
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold mt-2">
                ${selectedBilling === "annual" ? "15" : "19"}
                <span className="text-xs text-slate-400 font-normal"> /mo</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">High-velocity engineering and product teams.</p>

              <div className="space-y-2.5 mt-5 text-xs text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Unlimited Projects & Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Interactive Gantt Timeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Real-time Workload Telemetry</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>30-Day Activity Audit Trail</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectTier("pro")}
              disabled={activeTier === "pro" || isUpgrading}
              className="mt-6 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
            >
              {activeTier === "pro" ? "Active Plan" : "Upgrade to Pro"}
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Enterprise
                </span>
                {activeTier === "enterprise" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                    Current
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold mt-2">
                ${selectedBilling === "annual" ? "39" : "49"}
                <span className="text-xs text-slate-400 font-normal"> /mo</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Full governance, security, and SSO controls.</p>

              <div className="space-y-2.5 mt-5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Everything in Pro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Governance & SLA Approval Gates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Corporate CSV/JSON Analytics Export</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Dedicated Google Billing Manager</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectTier("enterprise")}
              disabled={activeTier === "enterprise" || isUpgrading}
              className="mt-6 w-full py-2.5 rounded-xl border border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-bold transition-colors disabled:opacity-50"
            >
              {activeTier === "enterprise" ? "Active Plan" : "Upgrade to Enterprise"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Google Play Billing Supported</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
