"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PLAN_DEFINITIONS, PLAN_ORDER } from "@shared/plans";

export const PricingTiersSection: React.FC = () => {
  return (
    <section id="pricing" className="py-12 sm:py-20 px-3.5 sm:px-6 max-w-[1280px] w-full mx-auto border-t border-[#DDD8CE] dark:border-white/[0.08]">
      <div className="text-left max-w-2xl">
        <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#5D55D6] dark:text-[#818CF8] font-semibold mb-2">
          PRICING
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1E222D] dark:text-white tracking-tight">
          Predictable workspace tiers for any team size.
        </h2>
        <p className="text-xs sm:text-sm text-[#4E5565] dark:text-slate-300 mt-2 leading-relaxed">
          Start free or activate Growth, Pro, and custom Enterprise contracts across web and Android.
        </p>
      </div>

      <div className="md:hidden mt-5 flex items-center justify-between text-[11px] font-mono text-[#5D55D6]">
        <span>4 Plan Tiers</span>
        <span>Swipe plans &rarr;</span>
      </div>

      <div className="mt-2 md:mt-10 flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-3 -mx-3.5 px-3.5 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 text-left [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PLAN_ORDER.map((tierId) => {
          const plan = PLAN_DEFINITIONS[tierId];
          const isFeatured = tierId === "pro";

          return (
            <div
              key={tierId}
              className={`pricing-card shrink-0 w-[82vw] max-w-[320px] md:w-auto md:max-w-none snap-start p-5 sm:p-6 rounded-xl flex flex-col justify-between transition-colors ${
                isFeatured
                  ? "bg-[#FAF8F4] dark:bg-[#11151E] border-2 border-[#5D55D6]"
                  : "bg-[#FAF8F4] dark:bg-[#0D1017] border border-[#DDD8CE] dark:border-white/[0.08]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-[#5D55D6] dark:text-[#818CF8] uppercase tracking-wider">
                    {plan.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold ${
                      isFeatured
                        ? "bg-[#5D55D6] text-white"
                        : "bg-[#EDEAE2] dark:bg-white/[0.06] text-[#4E5565] dark:text-slate-300"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-3xl font-black text-[#1E222D] dark:text-white">
                    {plan.priceMonthlyUsd === null ? "Custom" : `$${plan.priceMonthlyUsd}`}
                  </span>
                  {plan.priceMonthlyUsd !== null && (
                    <span className="text-xs text-[#4E5565] dark:text-slate-300 font-medium">
                      / month
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#4E5565] dark:text-slate-300 mb-5 leading-relaxed">
                  {plan.tagline}
                </p>

                <ul className="space-y-2.5 text-xs text-[#1E222D] dark:text-white">
                  {plan.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#0F8C65] shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 pt-5 border-t border-[#E5E0D6] dark:border-white/10">
                <Link
                  href="/onboarding"
                  className={`w-full py-3 min-h-[42px] rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isFeatured
                      ? "bg-[#5D55D6] hover:bg-[#4F47C7] text-white shadow-md"
                      : "bg-[#EAE8F8] dark:bg-[#756EF3]/15 hover:bg-[#DDD8F4] dark:hover:bg-[#756EF3]/25 text-[#5D55D6] dark:text-[#818CF8]"
                  }`}
                >
                  <span>
                    {tierId === "enterprise"
                      ? "Request Custom Quote"
                      : tierId === "free"
                      ? "Start Free"
                      : `Try ${plan.shortName} (14d Free)`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
