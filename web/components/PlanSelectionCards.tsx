"use client";

import React, { useState } from "react";
import {
  Check,
  Sparkles,
  Smartphone,
  FileText,
  Clock,
  Building2,
  ShieldCheck,
  Copy,
  ExternalLink,
} from "lucide-react";
import { PLAN_DEFINITIONS, PLAN_ORDER } from "@shared/plans";
import { PlanTierId } from "@shared/types";

export type PaidFulfillmentMode = "web_trial" | "google_play" | "manual_invoice";

interface PlanSelectionCardsProps {
  selectedPlan: PlanTierId;
  onSelectPlan: (plan: PlanTierId) => void;
  billingCycle: "monthly" | "annual";
  onChangeBillingCycle: (cycle: "monthly" | "annual") => void;
  fulfillmentMode: PaidFulfillmentMode;
  onChangeFulfillmentMode: (mode: PaidFulfillmentMode) => void;
  quoteSeats: number;
  onChangeQuoteSeats: (seats: number) => void;
  quoteRequirements: string;
  onChangeQuoteRequirements: (req: string) => void;
  orgIdForDeepLink?: string;
  currentActivePlan?: PlanTierId;
  compact?: boolean;
}

export const PlanSelectionCards: React.FC<PlanSelectionCardsProps> = ({
  selectedPlan,
  onSelectPlan,
  billingCycle,
  onChangeBillingCycle,
  fulfillmentMode,
  onChangeFulfillmentMode,
  quoteSeats,
  onChangeQuoteSeats,
  quoteRequirements,
  onChangeQuoteRequirements,
  orgIdForDeepLink,
  currentActivePlan,
  compact = false,
}) => {
  const [copiedDeepLink, setCopiedDeepLink] = useState(false);

  const deepLinkUrl = `taskpulse://billing?plan=${selectedPlan}&cycle=${billingCycle}${
    orgIdForDeepLink ? `&orgId=${encodeURIComponent(orgIdForDeepLink)}` : ""
  }`;

  return (
    <div className="space-y-5 text-left">
      {/* Billing Cycle Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#1E222D] dark:text-[#F8FAFC]">
            Select Your Organization Plan
          </h3>
          <p className="text-xs text-[#4E5565] dark:text-[#94A3B8]">
            Choose Free to evaluate, Growth or Pro to scale, or Enterprise for a custom quote.
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-xl bg-[#EDEAE2] dark:bg-[#0B0F19] border border-[#DDD8CE] dark:border-[#1E293B] text-xs font-semibold">
          <button
            type="button"
            onClick={() => onChangeBillingCycle("monthly")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-[#5D55D6] text-white shadow-xs"
                : "text-[#4E5565] dark:text-slate-300"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => onChangeBillingCycle("annual")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              billingCycle === "annual"
                ? "bg-[#5D55D6] text-white shadow-xs"
                : "text-[#4E5565] dark:text-slate-300"
            }`}
          >
            <span>Annual</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* 4-Tier Plan Cards */}
      <div className={`grid grid-cols-1 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"} gap-3.5`}>
        {PLAN_ORDER.map((tierId) => {
          const plan = PLAN_DEFINITIONS[tierId];
          const isSelected = selectedPlan === tierId;
          const isCurrent = currentActivePlan === tierId;
          const displayPrice =
            tierId === "enterprise"
              ? "Custom"
              : tierId === "free"
              ? "$0"
              : `$${billingCycle === "annual" ? plan.priceAnnualUsd : plan.priceMonthlyUsd}`;

          return (
            <button
              key={tierId}
              type="button"
              data-testid={`plan-card-${tierId}`}
              onClick={() => onSelectPlan(tierId)}
              className={`relative text-left p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "border-2 border-[#5D55D6] bg-[#EAE8F8]/55 dark:bg-[#5D55D6]/15 shadow-lg shadow-[#5D55D6]/10"
                  : "border-[#DDD8CE] dark:border-[#1E293B] bg-[#FAF8F4] dark:bg-[#0B0F19] hover:border-[#5D55D6]/50"
              }`}
            >
              {tierId === "pro" && (
                <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-[#5D55D6] text-white text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Popular</span>
                </span>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#5D55D6] dark:text-[#818CF8]">
                    {plan.shortName}
                  </span>
                  <div className="flex items-center gap-1">
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold">
                        Current
                      </span>
                    )}
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-[#5D55D6] bg-[#5D55D6] text-white"
                          : "border-[#C8C2B6] dark:border-slate-700"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-[#1E222D] dark:text-white">
                    {displayPrice}
                  </span>
                  {tierId !== "enterprise" && (
                    <span className="text-[11px] text-[#4E5565] dark:text-slate-400">
                      /mo{tierId !== "free" && plan.priceMonthlyInr ? ` (INR ${plan.priceMonthlyInr})` : ""}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#4E5565] dark:text-slate-400 mt-1.5 leading-snug">
                  {plan.tagline}
                </p>

                <ul className="mt-3.5 space-y-1.5 text-[11px] text-[#1E222D] dark:text-slate-200">
                  {plan.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#0F8C65] shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          );
        })}
      </div>

      {/* Hybrid Fulfillment / Enterprise Quote Panel */}
      {selectedPlan === "free" && (
        <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#0B0F19] border border-[#DDD8CE] dark:border-[#1E293B] flex items-center gap-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-[#0F8C65] shrink-0" />
          <div>
            <p className="font-bold text-[#1E222D] dark:text-white">
              TaskPulse Free activates immediately with zero payment required
            </p>
            <p className="text-[#4E5565] dark:text-slate-400 mt-0.5">
              Includes 1 Admin + up to 3 members, 1 project, 1 department, and up to 25 active tasks. You can upgrade anytime.
            </p>
          </div>
        </div>
      )}

      {(selectedPlan === "growth" || selectedPlan === "pro") && (
        <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#0B0F19] border border-[#DDD8CE] dark:border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#1E222D] dark:text-white">
              Hybrid Activation Method ({PLAN_DEFINITIONS[selectedPlan].name})
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAE8F8] dark:bg-[#5D55D6]/20 text-[#5D55D6] dark:text-[#818CF8]">
              Web + Android Real-Time Sync
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <button
              type="button"
              onClick={() => onChangeFulfillmentMode("web_trial")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                fulfillmentMode === "web_trial"
                  ? "border-[#5D55D6] bg-[#EAE8F8]/60 dark:bg-[#5D55D6]/15"
                  : "border-[#DDD8CE] dark:border-[#1E293B] hover:border-[#5D55D6]/40"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-[#1E222D] dark:text-white">
                <Clock className="w-3.5 h-3.5 text-[#5D55D6]" />
                <span>14-Day Web Trial</span>
              </div>
              <p className="text-[11px] text-[#4E5565] dark:text-slate-400 mt-1">
                Start immediately on Desktop, macOS, iOS, or Web. Zero Android device needed.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onChangeFulfillmentMode("google_play")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                fulfillmentMode === "google_play"
                  ? "border-[#5D55D6] bg-[#EAE8F8]/60 dark:bg-[#5D55D6]/15"
                  : "border-[#DDD8CE] dark:border-[#1E293B] hover:border-[#5D55D6]/40"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-[#1E222D] dark:text-white">
                <Smartphone className="w-3.5 h-3.5 text-[#0F8C65]" />
                <span>Android Google Play</span>
              </div>
              <p className="text-[11px] text-[#4E5565] dark:text-slate-400 mt-1">
                Pay in the TaskPulse Android app; Firestore unlocks Web in real time.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onChangeFulfillmentMode("manual_invoice")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                fulfillmentMode === "manual_invoice"
                  ? "border-[#5D55D6] bg-[#EAE8F8]/60 dark:bg-[#5D55D6]/15"
                  : "border-[#DDD8CE] dark:border-[#1E293B] hover:border-[#5D55D6]/40"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-[#1E222D] dark:text-white">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Request Invoice / UPI</span>
              </div>
              <p className="text-[11px] text-[#4E5565] dark:text-slate-400 mt-1">
                Receive direct UPI / invoice details for non-Android Web activation.
              </p>
            </button>
          </div>

          {fulfillmentMode === "google_play" && (
            <div className="p-3 rounded-xl bg-white dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="text-[#4E5565] dark:text-slate-300">
                Sign into the TaskPulse Android app with your organization admin email to complete Google Play Billing, or launch deep link:
                <div className="font-mono text-[10px] text-[#5D55D6] dark:text-[#818CF8] mt-0.5 break-all">
                  {deepLinkUrl}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(deepLinkUrl);
                    setCopiedDeepLink(true);
                    setTimeout(() => setCopiedDeepLink(false), 1800);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-[#DDD8CE] dark:border-[#1E293B] font-semibold text-[#1E222D] dark:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedDeepLink ? "Copied" : "Copy Link"}</span>
                </button>
                <a
                  href={deepLinkUrl}
                  className="px-2.5 py-1.5 rounded-lg bg-[#0F8C65] text-white font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open App</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedPlan === "enterprise" && (
        <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#0B0F19] border border-[#5D55D6]/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E222D] dark:text-white">
            <Building2 className="w-4 h-4 text-[#5D55D6]" />
            <span>Request Custom Enterprise Quote</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-[#4E5565] dark:text-slate-300 mb-1">
                Estimated Seats Needed
              </label>
              <input
                type="number"
                min={50}
                value={quoteSeats}
                onChange={(e) => onChangeQuoteSeats(Math.max(10, Number(e.target.value) || 50))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-[#1E293B] text-xs text-[#1E222D] dark:text-white focus:outline-none focus:border-[#5D55D6]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-[#4E5565] dark:text-slate-300 mb-1">
                Security, SSO, SLA &amp; Deployment Notes
              </label>
              <input
                type="text"
                value={quoteRequirements}
                onChange={(e) => onChangeQuoteRequirements(e.target.value)}
                placeholder="e.g. Google Workspace SSO lock, 250 seats, annual PO invoice..."
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-[#1E293B] text-xs text-[#1E222D] dark:text-white focus:outline-none focus:border-[#5D55D6]"
              />
            </div>
          </div>

          <p className="text-[11px] text-[#4E5565] dark:text-slate-400">
            Your workspace will be provisioned immediately in Enterprise Quote Pending mode with core evaluation access while our team finalizes your custom contract.
          </p>
        </div>
      )}
    </div>
  );
};
