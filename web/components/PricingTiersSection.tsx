"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Zap, Building2, Smartphone, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export const PricingTiersSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 max-w-[1300px] w-full mx-auto text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE8F8] dark:bg-[#756EF3]/15 border border-[#D4D0F0] dark:border-[#756EF3]/30 text-[#5D55D6] dark:text-[#818CF8] text-xs font-semibold mb-4">
        <Zap className="w-3.5 h-3.5" />
        <span>Transparent, Disruption-First Pricing</span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1E222D] dark:text-white tracking-tight">
        Zero Per-Seat Penalties. Built for Real Teams.
      </h2>
      <p className="text-xs sm:text-sm md:text-base text-[#4E5565] dark:text-slate-200 mt-3 max-w-2xl mx-auto leading-relaxed">
        Legacy tools charge you for every single team member and contractor. TaskPulse offers lightweight offline autonomy for local teams and flat workspace pricing for growing startups.
      </p>

      {/* Cards Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto text-left">
        {/* Tier 1: TaskPulse Lite */}
        <div className="pricing-card p-6 sm:p-8 rounded-3xl bg-[#FAF8F4] dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#4E5565] dark:text-slate-200 uppercase tracking-wider">
                <Smartphone className="w-4 h-4 text-[#5D55D6]" />
                <span>TaskPulse Lite</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E4F2EC] dark:bg-emerald-950/60 text-[#0F7656] dark:text-emerald-400 text-[11px] font-bold border border-[#C5E3D5] dark:border-transparent">
                Mobile Focused
              </span>
            </div>

            <p className="text-xs text-[#4E5565] dark:text-slate-200 mb-4">
              For micro stores, local trades, solo founders, and agile contractors who need rapid, friction-free tracking.
            </p>

            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="text-3xl sm:text-4xl font-black text-[#1E222D] dark:text-white">
                &#8377;199
              </span>
              <span className="text-xs text-[#4E5565] dark:text-slate-200 font-medium">
                / month (Google Play)
              </span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-[#1E222D] dark:text-white">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#0F8C65] shrink-0" />
                <span><strong>100% Offline-First</strong> (Fast local SQLite storage)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#0F8C65] shrink-0" />
                <span>Instant Daily Task Checklists &amp; Subtasks</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#0F8C65] shrink-0" />
                <span>One-Tap Floating Task Stopwatch</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#0F8C65] shrink-0" />
                <span>Export Client Summary Sheets (PDF / CSV)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#0F8C65] shrink-0" />
                <span>Optional Google Drive Encrypted Cloud Backup</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E5E0D6] dark:border-white/10">
            <Link
              href="/mobile"
              className="w-full py-3 rounded-xl bg-[#EAE8F8] dark:bg-[#756EF3]/15 hover:bg-[#DDD8F4] dark:hover:bg-[#756EF3]/25 text-[#5D55D6] dark:text-[#818CF8] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Get Lite on Android / iOS</span>
            </Link>
          </div>
        </div>

        {/* Tier 2: TaskPulse Enterprise */}
        <div className="pricing-card p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#FAF8F4] to-[#F1EEE7] dark:from-[#151C2C] dark:to-[#0F1626] border-2 border-[#5D55D6] shadow-xl shadow-[#5D55D6]/[0.08] hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#5D55D6] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Recommended for Teams</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5D55D6] dark:text-[#818CF8] uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-[#5D55D6]" />
                <span>TaskPulse Enterprise</span>
              </div>
            </div>

            <p className="text-xs text-[#4E5565] dark:text-slate-200 mb-4">
              Full synchronous web + mobile suite with real-time edge sync, Gantt scheduling, and Gemini AI.
            </p>

            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="text-3xl sm:text-4xl font-black text-[#1E222D] dark:text-white">
                $19
              </span>
              <span className="text-xs text-[#4E5565] dark:text-slate-200 font-medium">
                / month flat (Unlimited Seats)
              </span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-[#1E222D] dark:text-white">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#5D55D6] shrink-0" />
                <span><strong>No Per-User Fees</strong>: Invite your whole company</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#5D55D6] shrink-0" />
                <span><strong>60fps Interactive Gantt Timeline</strong> &amp; Critical Path</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#5D55D6] shrink-0" />
                <span><strong>Gemini Pro AI</strong> Task Architect &amp; Sprint Summaries</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#5D55D6] shrink-0" />
                <span>Live Multi-User Sync (Realtime Cloud Sync)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#5D55D6] shrink-0" />
                <span>Manager Verification Pipeline &amp; Audit Trail</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#5D55D6] shrink-0" />
                <span>Team Workload &amp; Bandwidth Heatmap</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E5E0D6] dark:border-white/10">
            <Link
              href="/onboarding"
              className="w-full py-3 rounded-xl bg-[#5D55D6] hover:bg-[#4F47C7] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Launch Enterprise Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
