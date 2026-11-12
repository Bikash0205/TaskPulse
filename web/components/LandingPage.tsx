"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TaskPulseLogo } from "./TaskPulseLogo";
import { useTheme } from "@/context/ThemeContext";
import { useViewportProfile } from "@/lib/useViewportProfile";
import { PricingTiersSection } from "./PricingTiersSection";
import { InteractiveProductShowcase } from "./InteractiveProductShowcase";
import { Sun, Moon, Menu, X as CloseIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface LandingPageProps {
  onEnterDemo: () => void;
  onEnterMarcus: () => void;
  onEnterAdmin: () => void;
}

const CAPABILITIES = [
  {
    index: "01",
    title: "Nested subtask rollups",
    desc: "Group tasks under project folders with checkable steps that recalculate completion progress automatically.",
  },
  {
    index: "02",
    title: "Per-member capacity caps",
    desc: "Live assignee queues highlight when engineers approach active limits before sprint deadlines slip.",
  },
  {
    index: "03",
    title: "List, Kanban, table & timeline",
    desc: "Switch views inside any project without maintaining duplicate spreadsheets or status documents.",
  },
  {
    index: "04",
    title: "Evidence & manager sign-off",
    desc: "Contributors attach notes and verification screenshots before leads approve tickets and export CSV/JSON logs.",
  },
  {
    index: "05",
    title: "Multi-tenant role access",
    desc: "Admin, Manager, Member, and Viewer permissions keep departments and external stakeholders separated.",
  },
  {
    index: "06",
    title: "Web & Android workspace sync",
    desc: "Changes made on desktop browsers, mobile web, and the Android app sync to the same organization state.",
  },
];

export const LandingPage: React.FC<LandingPageProps> = () => {
  const { theme, toggleTheme } = useTheme();
  const vp = useViewportProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".lp-fade-in", {
          y: 12,
          opacity: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
          clearProps: "transform,opacity",
        });

        gsap.from("#features .cap-cell", {
          y: 14,
          opacity: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: "#features",
            start: "top 88%",
            once: true,
          },
        });
      });
    },
    { scope: pageRef }
  );

  return (
    <div
      ref={pageRef}
      data-device={vp.deviceClass}
      data-orientation={vp.orientation}
      data-aspect={vp.aspectRatio}
      className="min-h-screen w-full bg-[#F4F2ED] dark:bg-[#090B10] text-[#18181B] dark:text-[#F4F4F5] flex flex-col transition-colors duration-200 selection:bg-[#18181B]/15 dark:selection:bg-white/20 overflow-x-clip"
    >
      {/* 1. Minimal Monochrome Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-[#DDD8CE] dark:border-white/[0.08] bg-[#F4F2ED]/92 dark:bg-[#090B10]/90 backdrop-blur-md">
        <div className="max-w-[1180px] w-full mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-7 min-w-0">
            <TaskPulseLogo size={vp.isMobileViewport ? "sm" : "md"} />

            <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-[#52525B] dark:text-slate-400">
              <a href="#workspace" className="hover:text-[#18181B] dark:hover:text-white transition-colors">
                Workspace
              </a>
              <a href="#features" className="hover:text-[#18181B] dark:hover:text-white transition-colors">
                How it works
              </a>
              <a href="#pricing" className="hover:text-[#18181B] dark:hover:text-white transition-colors">
                Pricing
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={toggleTheme}
              data-testid="fluid-theme-toggle"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#DDD8CE] dark:border-white/[0.1] bg-white dark:bg-[#111318] hover:bg-[#EAE6DC] dark:hover:bg-white/[0.08] text-[#18181B] dark:text-white transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#52525B]" />
              )}
            </button>

            <Link
              href="/login"
              className="hidden sm:inline-flex whitespace-nowrap shrink-0 px-3.5 h-9 items-center rounded-lg text-[#52525B] dark:text-slate-300 hover:text-[#18181B] dark:hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Sign in
            </Link>

            <Link
              href="/onboarding"
              data-testid="nav-get-started-btn"
              className="whitespace-nowrap shrink-0 px-3 sm:px-4 h-9 rounded-lg bg-[#18181B] hover:bg-[#27272A] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#090B10] text-xs font-semibold transition-colors cursor-pointer flex items-center"
            >
              {vp.isMobileViewport ? "Start" : "Create workspace"}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[#DDD8CE] dark:border-white/[0.1] bg-white dark:bg-[#111318] text-[#18181B] dark:text-white cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <CloseIcon className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden sticky top-14 z-40 w-full bg-[#FAF8F4] dark:bg-[#090B10] border-b border-[#DDD8CE] dark:border-white/10 p-4">
          <nav className="flex flex-col gap-1 text-xs font-medium text-[#52525B] dark:text-slate-300">
            <a
              href="#workspace"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#ECE8DF]/70 dark:hover:bg-white/[0.06] text-[#18181B] dark:text-white"
            >
              Workspace preview
            </a>
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#ECE8DF]/70 dark:hover:bg-white/[0.06] text-[#18181B] dark:text-white"
            >
              How it works
            </a>
            <a
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#ECE8DF]/70 dark:hover:bg-white/[0.06] text-[#18181B] dark:text-white"
            >
              Pricing
            </a>

            <div className="pt-2 mt-1 border-t border-[#DDD8CE] dark:border-white/10 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-lg border border-[#DDD8CE] dark:border-white/10 bg-white dark:bg-[#111318] text-[#18181B] dark:text-white font-semibold"
              >
                Sign in
              </Link>
              <Link
                href="/onboarding"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-lg bg-[#18181B] dark:bg-white text-white dark:text-[#090B10] font-semibold"
              >
                Create workspace
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* 2. Editorial Hero + Live Product Frame */}
      <section className="px-3.5 sm:px-6 max-w-[1180px] w-full mx-auto pt-8 sm:pt-16 pb-10 sm:pb-16">
        <div className="max-w-2xl mx-auto text-center space-y-4 sm:space-y-5">
          <h1 className="lp-fade-in text-[30px] sm:text-[46px] lg:text-[54px] font-bold tracking-[-0.03em] leading-[1.08] text-[#18181B] dark:text-white">
            Project tracking built around real team capacity.
          </h1>

          <p className="lp-fade-in text-sm sm:text-base text-[#52525B] dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Break deliverables into verifiable subtasks, watch active workload per person, and keep web and Android teams working from one plan.
          </p>

          <div className="lp-fade-in flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 pt-1">
            <Link
              href="/onboarding"
              data-testid="hero-onboarding-btn"
              className="px-5 py-2.5 min-h-[42px] rounded-lg bg-[#18181B] hover:bg-[#27272A] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#090B10] text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center cursor-pointer"
            >
              Start organization free
            </Link>

            <Link
              href="/login"
              className="px-5 py-2.5 min-h-[42px] rounded-lg bg-white dark:bg-[#111318] border border-[#DDD8CE] dark:border-white/[0.12] hover:border-[#18181B]/35 dark:hover:border-white/30 text-[#18181B] dark:text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center cursor-pointer"
            >
              Sign in to workspace
            </Link>
          </div>
        </div>

        {/* Interactive Application Window */}
        <div id="workspace" className="lp-fade-in mt-8 sm:mt-12">
          <InteractiveProductShowcase />
        </div>
      </section>

      {/* 3. Architectural Hairline Capabilities Matrix */}
      <section
        id="features"
        className="py-10 sm:py-16 px-3.5 sm:px-6 max-w-[1180px] w-full mx-auto border-t border-[#DDD8CE] dark:border-white/[0.08]"
      >
        <div className="max-w-xl text-left mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#18181B] dark:text-white tracking-tight">
            Everything your delivery lead actually uses
          </h2>
          <p className="text-xs sm:text-sm text-[#52525B] dark:text-slate-400 mt-2 leading-relaxed">
            Built directly around team queues, nested checklists, and deliverable sign-off rather than status meetings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-[#DDD8CE] dark:border-white/[0.1] rounded-xl bg-white dark:bg-[#111318] overflow-hidden divide-y md:divide-y-0 md:grid-flow-row">
          {CAPABILITIES.map((cap, idx) => (
            <div
              key={cap.index}
              className={`cap-cell p-5 sm:p-6 text-left border-[#DDD8CE] dark:border-white/[0.08] ${
                idx < 3 ? "lg:border-b" : ""
              } ${idx % 3 !== 2 ? "lg:border-r" : ""} ${idx < 4 ? "md:max-lg:border-b" : ""} ${
                idx % 2 === 0 ? "md:max-lg:border-r" : ""
              }`}
            >
              <div className="text-[11px] font-mono text-[#71717A] dark:text-slate-500 mb-2">
                {cap.index}
              </div>
              <h3 className="text-sm font-semibold text-[#18181B] dark:text-white">
                {cap.title}
              </h3>
              <p className="text-xs text-[#52525B] dark:text-slate-400 mt-1.5 leading-relaxed">
                {cap.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Pricing Table */}
      <PricingTiersSection />

      {/* 5. Calm Bottom Conversion Strip */}
      <section className="py-10 sm:py-16 px-3.5 sm:px-6 max-w-[1180px] w-full mx-auto border-t border-[#DDD8CE] dark:border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="text-left max-w-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-white tracking-tight">
              Set up your organization in two minutes
            </h2>
            <p className="text-xs sm:text-sm text-[#52525B] dark:text-slate-400 mt-1.5 leading-relaxed">
              Create departments, assign roles, and invite your team with one shared code.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <Link
              href="/onboarding"
              className="px-5 py-2.5 min-h-[42px] rounded-lg bg-[#18181B] hover:bg-[#27272A] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#090B10] font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center cursor-pointer"
            >
              Create workspace
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 min-h-[42px] rounded-lg border border-[#DDD8CE] dark:border-white/[0.12] bg-white dark:bg-[#111318] text-[#18181B] dark:text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center cursor-pointer"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Minimal Footer */}
      <footer className="mt-auto border-t border-[#DDD8CE] dark:border-white/[0.08] py-6 px-3.5 sm:px-6">
        <div className="max-w-[1180px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A] dark:text-slate-500">
          <div className="flex items-center gap-3">
            <TaskPulseLogo size="sm" />
            <span>&copy; {new Date().getFullYear()} TaskPulse Inc.</span>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-[#18181B] dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#18181B] dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
