"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TaskPulseLogo } from "./TaskPulseLogo";
import { useTheme } from "@/context/ThemeContext";
import { GeminiTaskArchitectBar } from "./GeminiTaskArchitectBar";
import { PricingTiersSection } from "./PricingTiersSection";
import { InteractiveProductShowcase } from "./InteractiveProductShowcase";
import { HeroMotionGraphic } from "./HeroMotionGraphic";
import { ScrollMotionGraphics } from "./ScrollMotionGraphics";
import {
  ShieldCheck,
  Zap,
  Users,
  Layers,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Lock,
  Building2,
  BarChart3,
  Sun,
  Moon,
  Activity,
  FileCheck,
  Paperclip,
  Sparkles,
  ExternalLink,
  Check,
  Menu,
  X as CloseIcon,
} from "lucide-react";

interface LandingPageProps {
  onEnterDemo: () => void;
  onEnterMarcus: () => void;
  onEnterAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDemo,
  onEnterMarcus,
  onEnterAdmin,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFF] dark:bg-[#0B0F19] text-[#0F172A] dark:text-white flex flex-col transition-colors duration-200 selection:bg-[#756EF3]/20 selection:text-[#756EF3]">
      {/* 1. Global Floating Executive Navigation Bar */}
      <header className="sticky top-2 sm:top-3 z-50 max-w-[1360px] w-[96%] mx-auto rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-2xl shadow-xl shadow-black/5 dark:shadow-black/50 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 transition-all relative overflow-hidden">
        {/* Top Specular Sheen Line */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#756EF3]/60 dark:via-cyan-400/60 to-transparent pointer-events-none" />

        <div className="flex items-center gap-4 sm:gap-6">
          <TaskPulseLogo size="md" />

          {/* Live Status Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>v2.4 Live &bull; Sub-16ms</span>
          </div>

          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-[#334155] dark:text-slate-200">
            <a href="#features" className="hover:text-[#756EF3] dark:hover:text-[#818CF8] hover:bg-slate-100 dark:hover:bg-white/5 px-2.5 py-1 rounded-lg transition-all">
              Platform Overview
            </a>
            <a href="#pipeline" className="hover:text-[#756EF3] dark:hover:text-[#818CF8] hover:bg-slate-100 dark:hover:bg-white/5 px-2.5 py-1 rounded-lg transition-all">
              Sprint Pipeline
            </a>
            <a href="#workload" className="hover:text-[#756EF3] dark:hover:text-[#818CF8] hover:bg-slate-100 dark:hover:bg-white/5 px-2.5 py-1 rounded-lg transition-all">
              Capacity
            </a>
            <a href="#security" className="hover:text-[#756EF3] dark:hover:text-[#818CF8] hover:bg-slate-100 dark:hover:bg-white/5 px-2.5 py-1 rounded-lg transition-all">
              Security
            </a>
            <a href="#pricing" className="hover:text-[#756EF3] dark:hover:text-[#818CF8] hover:bg-slate-100 dark:hover:bg-white/5 px-2.5 py-1 rounded-lg transition-all">
              Pricing &amp; Variants
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Tactile Liquid Glass Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            data-testid="fluid-theme-toggle"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#151C2C]/80 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 text-[#0F172A] dark:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#756EF3]" />
            )}
          </button>

          {/* Dedicated Sign In Link */}
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#151C2C]/70 hover:border-[#756EF3] text-[#0F172A] dark:text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            Sign In
          </Link>

          {/* Dedicated Onboarding / Get Started Link */}
          <Link
            href="/onboarding"
            data-testid="nav-get-started-btn"
            className="px-3.5 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#756EF3] to-[#635BFF] hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-[#756EF3]/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151C2C] text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="w-4 h-4 text-[#756EF3]" />
            ) : (
              <Menu className="w-4 h-4 text-[#0F172A] dark:text-white" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer Sheet */}
      {isMobileMenuOpen && (
        <div className="lg:hidden sticky top-[57px] z-30 w-full bg-white/98 dark:bg-[#0B0F19]/98 border-b border-slate-200 dark:border-white/10 shadow-lg backdrop-blur-xl p-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2.5 text-xs font-semibold text-[#334155] dark:text-slate-200">
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#F0EFFF] dark:hover:bg-[#756EF3]/15 hover:text-[#756EF3] dark:hover:text-[#818CF8] transition-colors"
            >
              Platform Overview
            </a>
            <a
              href="#workload"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#F0EFFF] dark:hover:bg-[#756EF3]/15 hover:text-[#756EF3] dark:hover:text-[#818CF8] transition-colors"
            >
              Capacity Management
            </a>
            <a
              href="#dispatcher"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#F0EFFF] dark:hover:bg-[#756EF3]/15 hover:text-[#756EF3] dark:hover:text-[#818CF8] transition-colors"
            >
              Sprint Dispatcher
            </a>
            <a
              href="#mobile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#F0EFFF] dark:hover:bg-[#756EF3]/15 hover:text-[#756EF3] dark:hover:text-[#818CF8] transition-colors"
            >
              Mobile Synchronization (iOS &amp; Android)
            </a>
            <a
              href="#security"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#F0EFFF] dark:hover:bg-[#756EF3]/15 hover:text-[#756EF3] dark:hover:text-[#818CF8] transition-colors"
            >
              Security &amp; RBAC
            </a>
            <a
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#F0EFFF] dark:hover:bg-[#756EF3]/15 hover:text-[#756EF3] dark:hover:text-[#818CF8] transition-colors"
            >
              Pricing &amp; Variants
            </a>

            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151C2C] text-[#0F172A] dark:text-white font-semibold"
              >
                Sign In to Workspace
              </Link>
              <Link
                href="/onboarding"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white font-semibold flex items-center justify-center gap-1.5"
              >
                <span>Start Organization Onboarding</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={onEnterDemo}
                className="w-full py-2.5 text-center rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] dark:text-[#818CF8] font-semibold"
              >
                Launch Demo Sandbox (Mobile / Web)
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 max-w-[1400px] w-full mx-auto flex flex-col items-center text-center overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#756EF3]/10 dark:bg-[#756EF3]/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Enterprise Platform Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#F0EFFF] dark:bg-[#756EF3]/15 border border-[#756EF3]/30 text-[#756EF3] dark:text-[#818CF8] text-[11px] sm:text-xs font-semibold tracking-wide mb-5 sm:mb-6 shadow-xs">
          <Zap className="w-3.5 h-3.5 text-[#756EF3]" />
          <span>TaskPulse 2.0</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#756EF3]" />
          <span>High-Velocity Execution for Teams &amp; Solo Founders</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl text-[#0F172A] dark:text-white leading-[1.1] font-sans">
          Project tracking built for speed. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#756EF3] via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Not bureaucracy.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-[#334155] dark:text-slate-200 max-w-2xl leading-relaxed font-sans px-2">
          Experience zero-latency task workflows, interactive 60fps Gantt timelines, Gemini AI sprint synthesis, and offline-first mobile autonomy. No endless forms. No per-seat penalties.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 w-full max-w-2xl px-2">
          <Link
            href="/onboarding"
            data-testid="hero-onboarding-btn"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Start Organization Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 hover:border-[#756EF3] text-[#0F172A] dark:text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-[#756EF3]" />
            <span>Sign In to Workspace</span>
          </Link>

          <button
            onClick={onEnterDemo}
            data-testid="landing-sandbox-btn"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 hover:bg-[#E2E0FD] dark:hover:bg-[#756EF3]/25 border border-[#756EF3]/30 text-[#756EF3] dark:text-[#818CF8] text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>Open Mobile &amp; iOS Web App</span>
          </button>
        </div>

        {/* Key Metrics / Value Propositions */}
        <div className="mt-10 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-3xl px-1">
          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 shadow-xs text-left sm:text-center">
            <div className="text-lg sm:text-2xl font-bold text-[#756EF3]">Continuous</div>
            <div className="text-[11px] sm:text-xs text-[#334155] dark:text-slate-200 mt-0.5">Capacity Tracking</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 shadow-xs text-left sm:text-center">
            <div className="text-lg sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">&lt; 100ms</div>
            <div className="text-[11px] sm:text-xs text-[#334155] dark:text-slate-200 mt-0.5">Cloud Synchronization</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 shadow-xs text-left sm:text-center">
            <div className="text-lg sm:text-2xl font-bold text-[#0F172A] dark:text-white">Multi-Platform</div>
            <div className="text-[11px] sm:text-xs text-[#334155] dark:text-slate-200 mt-0.5">Desktop, iOS &amp; Android</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 shadow-xs text-left sm:text-center">
            <div className="text-lg sm:text-2xl font-bold text-[#756EF3]">Enterprise</div>
            <div className="text-[11px] sm:text-xs text-[#334155] dark:text-slate-200 mt-0.5">Workload Thresholds</div>
          </div>
        </div>

        {/* Central Luminous Motion Graphic Visualizer */}
        <HeroMotionGraphic />

        {/* Live Gemini AI Natural Language Task Engine */}
        <GeminiTaskArchitectBar />

        {/* 3. Dynamic Interactive Product Showcase */}
        <div className="mt-8 sm:mt-12 w-full">
          <InteractiveProductShowcase />
        </div>
      </section>

      {/* 4. Feature Showcase Section */}
      <section id="features" className="py-16 px-6 max-w-[1400px] w-full mx-auto border-t border-slate-200 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold text-[#756EF3] dark:text-[#818CF8] tracking-wider uppercase font-mono mb-2">
            CORE CAPABILITIES
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Designed for Modern Enterprise Engineering Teams
          </h2>
          <p className="text-sm sm:text-base text-[#334155] dark:text-slate-200 mt-3">
            Every layer of TaskPulse is built for high-throughput teams that need absolute transparency without micromanagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div id="workload" className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
              Continuous Capacity Tracking
            </h3>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-slate-200 mt-2 leading-relaxed">
              Real-time member bandwidth indicators automatically track assigned task load. Identify optimal, balanced, and capacity limits proactively before delivery timelines are impacted.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Workload Distribution Guardrails</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div id="dispatcher" className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
              Verified Change Logs &amp; Audit Records
            </h3>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-slate-200 mt-2 leading-relaxed">
              When completing tasks, assignees document specific code and implementation changes alongside optional screenshot attachments for manager verification.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8]">
              <Paperclip className="w-3.5 h-3.5" />
              <span>Screenshot Verification Attachments</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div id="mobile" className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
              Cross-Platform Client Parity
            </h3>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-slate-200 mt-2 leading-relaxed">
              Unified task execution across mobile and desktop. Access sprint boards, capacity metrics, and task approvals seamlessly on iOS Safari, Android, and desktop browsers.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8]">
              <Zap className="w-3.5 h-3.5" />
              <span>Instant Cloud Synchronization</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
              Structured Organization Onboarding
            </h3>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-slate-200 mt-2 leading-relaxed">
              Three-step setup wizard allows administrators to initialize company workspaces, configure engineering departments, and issue team invitation codes.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Team Invitation Codes</span>
            </div>
          </div>

          {/* Feature 5 */}
          <div id="security" className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
              Multi-Tier Role-Based Access Control
            </h3>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-slate-200 mt-2 leading-relaxed">
              Strict authorization boundaries between Administrators, Department Managers, and Team Members. Real-time security rules ensure secure data access.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Role-Based Access Governance</span>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
              Project-Scoped Sprint Dispatching
            </h3>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-slate-200 mt-2 leading-relaxed">
              Filter deliverables by specific initiatives, departments, or individual team members. Managers can distribute assignments, rebalance workloads, and adjust timelines directly.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8]">
              <Users className="w-3.5 h-3.5" />
              <span>Manager Dispatch Controls</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Scroll-Triggered Pipeline Motion Graphic */}
      <div id="pipeline">
        <ScrollMotionGraphics />
      </div>

      {/* 6. Pricing & Product Variants Section */}
      <PricingTiersSection />

      {/* 6. Clean Enterprise Conversion Callout (No In-Page Login Form) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-[1200px] w-full mx-auto border-t border-slate-200 dark:border-white/10">
        <div className="rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-[#151C2C] dark:to-[#0B0F19] border border-slate-200 dark:border-white/10 p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-sm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] dark:text-[#818CF8] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise Workspace Access</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Streamline your team&apos;s task execution
          </h2>
          <p className="text-xs sm:text-sm text-[#334155] dark:text-slate-200 mt-3 max-w-xl mx-auto leading-relaxed">
            Track team capacity, distribute sprint deliverables with clarity, and maintain verified audit records across every project.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151C2C] hover:border-[#756EF3] text-[#0F172A] dark:text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#756EF3]" />
              <span>Sign In to Workspace</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Enterprise Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B0F19] py-8 px-6 transition-colors">
        <div className="max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#334155] dark:text-slate-200">
          <div className="flex items-center gap-3">
            <TaskPulseLogo size="sm" />
            <span>&copy; {new Date().getFullYear()} TaskPulse Inc. Enterprise Workload Platform.</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Status: All Systems Operational
            </span>
            <span className="text-slate-400 dark:text-slate-600">&bull;</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              SOC 2 Type II Certified
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
