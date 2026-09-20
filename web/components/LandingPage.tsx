"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TaskPulseLogo } from "./TaskPulseLogo";
import { useTheme } from "@/context/ThemeContext";
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
    <div className="min-h-screen w-full bg-[#F8FAFF] dark:bg-[#0B0F19] text-[#002055] dark:text-[#F8FAFC] flex flex-col transition-colors duration-200 selection:bg-[#756EF3]/20 selection:text-[#756EF3]">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[#E9F1FF] dark:border-[#1E293B] bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-4 sm:gap-6">
          <TaskPulseLogo size="md" />
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#556070] dark:text-[#94A3B8]">
            <a href="#features" className="hover:text-[#756EF3] dark:hover:text-[#818CF8] transition-colors">
              Platform Overview
            </a>
            <a href="#workload" className="hover:text-[#756EF3] dark:hover:text-[#818CF8] transition-colors">
              Capacity Management
            </a>
            <a href="#dispatcher" className="hover:text-[#756EF3] dark:hover:text-[#818CF8] transition-colors">
              Sprint Dispatcher
            </a>
            <a href="#mobile" className="hover:text-[#756EF3] dark:hover:text-[#818CF8] transition-colors">
              Mobile Synchronization
            </a>
            <a href="#security" className="hover:text-[#756EF3] dark:hover:text-[#818CF8] transition-colors">
              Security &amp; RBAC
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl border border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#151C2C] hover:bg-slate-100 dark:hover:bg-slate-800 text-[#002055] dark:text-[#F8FAFC] transition-colors cursor-pointer"
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
            className="px-3.5 py-1.5 rounded-xl border border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#151C2C] hover:border-[#756EF3] text-[#002055] dark:text-[#F8FAFC] text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            Sign In
          </Link>

          {/* Dedicated Onboarding / Get Started Link */}
          <Link
            href="/onboarding"
            data-testid="nav-get-started-btn"
            className="px-3 sm:px-4 py-1.5 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#151C2C] text-[#002055] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="w-4 h-4 text-[#756EF3]" />
            ) : (
              <Menu className="w-4 h-4 text-[#002055] dark:text-[#F8FAFC]" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer Sheet */}
      {isMobileMenuOpen && (
        <div className="lg:hidden sticky top-[57px] z-30 w-full bg-white/98 dark:bg-[#0B0F19]/98 border-b border-[#E9F1FF] dark:border-[#1E293B] shadow-lg backdrop-blur-xl p-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2.5 text-xs font-semibold text-[#556070] dark:text-[#94A3B8]">
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

            <div className="pt-2 border-t border-[#E9F1FF] dark:border-[#1E293B] flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl border border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#151C2C] text-[#002055] dark:text-[#F8FAFC] font-semibold"
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
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-[#F0EFFF] dark:bg-[#756EF3]/15 border border-[#756EF3]/30 text-[#756EF3] dark:text-[#818CF8] text-[11px] sm:text-xs font-semibold tracking-wide mb-5 sm:mb-6 shadow-xs">
          <Activity className="w-3.5 h-3.5 text-[#756EF3]" />
          <span>TaskPulse Enterprise</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#756EF3]" />
          <span className="text-[#556070] dark:text-[#94A3B8] font-normal">Sprint Execution &amp; Capacity Intelligence</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl text-[#002055] dark:text-[#F8FAFC] leading-[1.15] font-sans">
          Synchronous Sprint Execution &amp; Team Workload Balancing
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base lg:text-lg text-[#556070] dark:text-[#94A3B8] max-w-2xl leading-relaxed font-sans px-2">
          Coordinate engineering deliverables, balance team capacity across active sprints, and record verified change logs with audit trails across desktop, iOS, and Android.
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
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] hover:border-[#756EF3] text-[#002055] dark:text-[#F8FAFC] text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
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
          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs text-left sm:text-center">
            <div className="text-lg sm:text-2xl font-bold text-[#756EF3]">Continuous</div>
            <div className="text-[11px] sm:text-xs text-[#556070] dark:text-[#94A3B8] mt-0.5">Capacity Tracking</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs text-left sm:text-center">
            <div className="text-lg sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">&lt; 100ms</div>
            <div className="text-[11px] sm:text-xs text-[#556070] dark:text-[#94A3B8] mt-0.5">Cloud Synchronization</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs text-left sm:text-center">
            <div className="text-lg sm:text-2xl font-bold text-[#002055] dark:text-[#F8FAFC]">Multi-Platform</div>
            <div className="text-[11px] sm:text-xs text-[#556070] dark:text-[#94A3B8] mt-0.5">Desktop, iOS &amp; Android</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs text-left sm:text-center">
            <div className="text-lg sm:text-2xl font-bold text-[#756EF3]">Enterprise</div>
            <div className="text-[11px] sm:text-xs text-[#556070] dark:text-[#94A3B8] mt-0.5">Workload Thresholds</div>
          </div>
        </div>

        {/* 3. Interactive Platform Board Showcase */}
        <div className="mt-10 sm:mt-14 w-full rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] p-4 sm:p-6 shadow-xl text-left">
          {/* Mock Board Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#E9F1FF] dark:border-[#1E293B]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#556070] dark:text-[#94A3B8] font-mono">WORKSPACE PREVIEW</div>
                <div className="text-xs sm:text-sm font-bold text-[#002055] dark:text-[#F8FAFC]">TaskPulse Core Workspace &bull; Sprint 42</div>
              </div>
            </div>

            {/* Capacity Status Pill indicators */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Sarah Chen &bull; 2 tasks (Optimal)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Marcus Vance &bull; 4 tasks (Balanced)</span>
              </span>
            </div>
          </div>

          {/* Mini Kanban Simulator Columns */}
          <div className="mt-5 flex md:grid md:grid-cols-4 gap-3.5 sm:gap-4 overflow-x-auto pb-2 no-scrollbar snap-x">
            {/* Column 1 */}
            <div className="min-w-[240px] md:min-w-0 flex-1 snap-start p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F19]/80 border border-[#E9F1FF] dark:border-[#1E293B]">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider font-mono text-slate-600 dark:text-slate-300 mb-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Backlog</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">1</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs">
                  <div className="font-semibold text-[#002055] dark:text-[#F8FAFC]">Audit Log Cryptographic Signatures</div>
                  <div className="text-[11px] text-[#556070] dark:text-[#94A3B8] mt-1">Due Oct 12 &bull; Security</div>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="min-w-[240px] md:min-w-0 flex-1 snap-start p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F19]/80 border border-[#E9F1FF] dark:border-[#1E293B]">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider font-mono text-slate-600 dark:text-slate-300 mb-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#756EF3]" />
                  <span>In Progress</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#F0EFFF] dark:bg-[#756EF3]/20 text-[#756EF3] text-[10px]">1</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-white dark:bg-[#151C2C] border border-[#756EF3]/30 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#756EF3] uppercase">High Priority</span>
                    <span className="text-[10px] text-emerald-500 font-mono">60%</span>
                  </div>
                  <div className="font-semibold text-[#002055] dark:text-[#F8FAFC] mt-1">Distributed Edge Cache &amp; Sync</div>
                  <div className="text-[11px] text-[#556070] dark:text-[#94A3B8] mt-1">Assignee: Marcus Vance</div>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="min-w-[240px] md:min-w-0 flex-1 snap-start p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F19]/80 border border-[#E9F1FF] dark:border-[#1E293B]">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider font-mono text-slate-600 dark:text-slate-300 mb-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>In Review</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-500 text-[10px]">1</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs">
                  <div className="font-semibold text-[#002055] dark:text-[#F8FAFC]">RBAC Permission Matrices</div>
                  <div className="text-[11px] text-[#556070] dark:text-[#94A3B8] mt-1">Manager &amp; Member scoping audit</div>
                </div>
              </div>
            </div>

            {/* Column 4 */}
            <div className="min-w-[240px] md:min-w-0 flex-1 snap-start p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F19]/80 border border-[#E9F1FF] dark:border-[#1E293B]">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider font-mono text-slate-600 dark:text-slate-300 mb-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Completed</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 text-[10px]">1</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-white dark:bg-[#151C2C] border border-emerald-500/20 shadow-xs">
                  <div className="font-semibold text-[#002055] dark:text-[#F8FAFC] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Change Audit Logging Flow</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Includes screenshot attachments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Showcase Section */}
      <section id="features" className="py-16 px-6 max-w-[1400px] w-full mx-auto border-t border-[#E9F1FF] dark:border-[#1E293B]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold text-[#756EF3] dark:text-[#818CF8] tracking-wider uppercase font-mono mb-2">
            CORE CAPABILITIES
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002055] dark:text-[#F8FAFC] tracking-tight">
            Designed for Modern Enterprise Engineering Teams
          </h2>
          <p className="text-sm sm:text-base text-[#556070] dark:text-[#94A3B8] mt-3">
            Every layer of TaskPulse is built for high-throughput teams that need absolute transparency without micromanagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div id="workload" className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#002055] dark:text-[#F8FAFC]">
              Continuous Capacity Tracking
            </h3>
            <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Real-time member bandwidth indicators automatically track assigned task load. Identify optimal, balanced, and capacity limits proactively before delivery timelines are impacted.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E9F1FF] dark:border-[#1E293B] flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Workload Distribution Guardrails</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div id="dispatcher" className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#002055] dark:text-[#F8FAFC]">
              Verified Change Logs &amp; Audit Records
            </h3>
            <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-2 leading-relaxed">
              When completing tasks, assignees document specific code and implementation changes alongside optional screenshot attachments for manager verification.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E9F1FF] dark:border-[#1E293B] flex items-center gap-2 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8]">
              <Paperclip className="w-3.5 h-3.5" />
              <span>Screenshot Verification Attachments</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div id="mobile" className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#002055] dark:text-[#F8FAFC]">
              Cross-Platform Client Parity
            </h3>
            <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Unified task execution across mobile and desktop. Access sprint boards, capacity metrics, and task approvals seamlessly on iOS Safari, Android, and desktop browsers.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E9F1FF] dark:border-[#1E293B] flex items-center gap-2 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8]">
              <Zap className="w-3.5 h-3.5" />
              <span>Instant Cloud Synchronization</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#002055] dark:text-[#F8FAFC]">
              Structured Organization Onboarding
            </h3>
            <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Three-step setup wizard allows administrators to initialize company workspaces, configure engineering departments, and issue team invitation codes.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E9F1FF] dark:border-[#1E293B] flex items-center gap-2 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Team Invitation Codes</span>
            </div>
          </div>

          {/* Feature 5 */}
          <div id="security" className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#002055] dark:text-[#F8FAFC]">
              Multi-Tier Role-Based Access Control
            </h3>
            <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Strict authorization boundaries between Administrators, Department Managers, and Team Members. Real-time security rules ensure secure data access.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E9F1FF] dark:border-[#1E293B] flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Role-Based Access Governance</span>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#002055] dark:text-[#F8FAFC]">
              Project-Scoped Sprint Dispatching
            </h3>
            <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Filter deliverables by specific initiatives, departments, or individual team members. Managers can distribute assignments, rebalance workloads, and adjust timelines directly.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E9F1FF] dark:border-[#1E293B] flex items-center gap-2 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8]">
              <Users className="w-3.5 h-3.5" />
              <span>Manager Dispatch Controls</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Clean Enterprise Conversion Callout (No In-Page Login Form) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-[1200px] w-full mx-auto border-t border-[#E9F1FF] dark:border-[#1E293B]">
        <div className="rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-[#151C2C] dark:to-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-sm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] dark:text-[#818CF8] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise Workspace Access</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002055] dark:text-[#F8FAFC] tracking-tight">
            Streamline your team&apos;s task execution
          </h2>
          <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-3 max-w-xl mx-auto leading-relaxed">
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
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#151C2C] hover:border-[#756EF3] text-[#002055] dark:text-[#F8FAFC] font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#756EF3]" />
              <span>Sign In to Workspace</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Enterprise Clean Footer */}
      <footer className="mt-auto border-t border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#0B0F19] py-8 px-6 transition-colors">
        <div className="max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#556070] dark:text-[#94A3B8]">
          <div className="flex items-center gap-3">
            <TaskPulseLogo size="sm" />
            <span>&copy; {new Date().getFullYear()} TaskPulse Inc. Enterprise Workload Platform.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Status: All Systems Operational
            </span>
            <a
              href="https://github.com/Bikash0205/TaskPulse"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#756EF3] transition-colors flex items-center gap-1"
            >
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
