"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { PLAN_DEFINITIONS, PLAN_ORDER } from "@shared/plans";

export const PricingTiersSection: React.FC = () => {
  return (
    <section
      id="pricing"
      className="py-12 sm:py-20 px-3.5 sm:px-6 max-w-[1180px] w-full mx-auto border-t border-[#DDD8CE] dark:border-white/[0.08]"
    >
      <div className="text-left max-w-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#18181B] dark:text-white tracking-tight">
          Plans sized around your organization
        </h2>
        <p className="text-xs sm:text-sm text-[#52525B] dark:text-slate-400 mt-2 leading-relaxed">
          Start free with a small pilot group, or move into Lite, Full, and custom Enterprise agreements across web and Android.
        </p>
      </div>

      <div className="md:hidden mt-5 flex items-center justify-between text-[11px] font-mono text-[#71717A]">
        <span>4 plans</span>
        <span>Swipe &rarr;</span>
      </div>

      {/* Unified architectural 4-column table on desktop, swipeable row on mobile */}
      <div className="mt-2 md:mt-10 flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 -mx-3.5 px-3.5 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-0 md:rounded-xl md:border md:border-[#DDD8CE] md:dark:border-white/[0.1] md:bg-white md:dark:bg-[#111318] md:divide-y lg:divide-y-0 md:divide-x md:divide-[#DDD8CE] md:dark:divide-white/[0.08] md:overflow-hidden text-left [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PLAN_ORDER.map((tierId) => {
          const plan = PLAN_DEFINITIONS[tierId];
          const isFeatured = tierId === "pro";

          return (
            <div
              key={tierId}
              className={`pricing-card shrink-0 w-[82vw] max-w-[310px] md:w-auto md:max-w-none snap-start p-5 sm:p-6 rounded-xl md:rounded-none border md:border-0 flex flex-col justify-between ${
                isFeatured
                  ? "bg-[#FAF8F4] dark:bg-[#161922] border-[#18181B] dark:border-white/30"
                  : "bg-white dark:bg-[#111318] border-[#DDD8CE] dark:border-white/[0.1]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold text-[#18181B] dark:text-white">
                    {plan.shortName}
                  </span>
                  {isFeatured && (
                    <span className="text-[10px] font-mono font-medium text-[#52525B] dark:text-slate-300 border border-[#DDD8CE] dark:border-white/15 px-1.5 py-0.5 rounded">
                      Popular
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5 mb-2.5">
                  <span className="text-3xl font-bold tracking-tight tabular-nums text-[#18181B] dark:text-white">
                    {plan.priceMonthlyInr === null
                      ? "Custom"
                      : tierId === "free"
                      ? "Free"
                      : `₹${plan.priceMonthlyInr}`}
                  </span>
                  {plan.priceMonthlyInr !== null && tierId !== "free" && (
                    <span className="text-xs text-[#71717A] dark:text-slate-400">
                      / month
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#52525B] dark:text-slate-400 mb-5 leading-relaxed">
                  {plan.tagline}
                </p>

                <ul className="space-y-2 text-xs text-[#3F3F46] dark:text-slate-300">
                  {plan.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#18181B] dark:text-slate-200 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[#ECE8DF] dark:border-white/[0.08]">
                <Link
                  href="/onboarding"
                  className={`w-full py-2.5 min-h-[40px] rounded-lg font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                    isFeatured
                      ? "bg-[#18181B] hover:bg-[#27272A] text-white dark:bg-white dark:hover:bg-slate-200 dark:text-[#090B10]"
                      : "bg-[#F4F2ED] hover:bg-[#EAE6DC] dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-[#18181B] dark:text-white border border-[#DDD8CE] dark:border-white/10"
                  }`}
                >
                  {tierId === "enterprise"
                    ? "Request quote"
                    : tierId === "free"
                    ? "Start free"
                    : `Try ${plan.shortName} (14d)`}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
