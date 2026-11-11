"use client";

import React from "react";
import Link from "next/link";
import { Check, Zap, ArrowRight, Sparkles } from "lucide-react";
import { PLAN_DEFINITIONS, PLAN_ORDER } from "@shared/plans";

export const PricingTiersSection: React.FC = () => {
  return (
    <section id="pricing" className="py-10 sm:py-24 px-3.5 sm:px-6 max-w-[1300px] w-full mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE8F8] dark:bg-[#756EF3]/15 border border-[#D4D0F0] dark:border-[#756EF3]/30 text-[#5D55D6] dark:text-[#818CF8] text-xs font-semibold mb-4">
        <Zap className="w-3.5 h-3.5" />
        <span>Transparent 4-Tier SaaS Architecture</span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1E222D] dark:text-white tracking-tight">
        Start Free. Scale Without Per-Seat Penalties.
      </h2>
      <p className="text-xs sm:text-sm md:text-base text-[#4E5565] dark:text-slate-200 mt-3 max-w-2xl mx-auto leading-relaxed">
        Sign up, configure your organization, and activate Free, Growth, Pro, or custom-quoted Enterprise across Desktop Web and Android.
      </p>

      <div className="md:hidden mt-6 flex items-center justify-between text-[11px] font-mono text-[#5D55D6]">
        <span>4 Plan Tiers</span>
        <span>Swipe plans &rarr;</span>
      </div>

      <div className="mt-2 md:mt-12 flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-3 -mx-3.5 px-3.5 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5 text-left [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PLAN_ORDER.map((tierId) => {
          const plan = PLAN_DEFINITIONS[tierId];
          const isFeatured = tierId === "pro";

          return (
            <div
              key={tierId}
              className={`pricing-card shrink-0 w-[82vw] max-w-[325px] md:w-auto md:max-w-none snap-start p-5 sm:p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden transition-all ${
                isFeatured
                  ? "bg-gradient-to-b from-[#FAF8F4] to-[#F1EEE7] dark:from-[#151C2C] dark:to-[#0F1626] border-2 border-[#5D55D6] shadow-xl shadow-[#5D55D6]/[0.08]"
                  : "bg-[#FAF8F4] dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-white/10 shadow-sm hover:shadow-md"
              }`}
            >
              {isFeatured && (
                <div className="absolute top-0 right-0 bg-[#5D55D6] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-[#5D55D6] dark:text-[#818CF8] uppercase tracking-wider">
                    {plan.name}
                  </span>
                  {!isFeatured && (
                    <span className="px-2 py-0.5 rounded-full bg-[#EDEAE2] dark:bg-white/5 text-[#4E5565] dark:text-slate-300 text-[10px] font-semibold">
                      {plan.badge}
                    </span>
                  )}
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
