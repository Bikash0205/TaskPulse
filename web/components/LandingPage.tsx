"use client";

import React, { useState } from "react";
import { TaskPulseLogo } from "./TaskPulseLogo";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useOrganization } from "@/context/OrganizationContext";
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
  const { signInWithGoogle, signInWithCustomUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { setIsOnboardingOpen } = useOrganization();

  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [customError, setCustomError] = useState("");

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) {
      setCustomError("Please provide both full name and a work email.");
      return;
    }
    if (!customEmail.includes("@")) {
      setCustomError("Please enter a valid email address.");
      return;
    }
    setCustomError("");
    signInWithCustomUser(customName.trim(), customEmail.trim());
  };

  const scrollToAuth = (mode: "signin" | "signup") => {
    setAuthTab(mode);
    const element = document.getElementById("auth-portal");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFF] dark:bg-[#0B0F19] text-[#002055] dark:text-[#F8FAFC] flex flex-col transition-colors duration-200 selection:bg-[#756EF3]/20 selection:text-[#756EF3]">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[#E9F1FF] dark:border-[#1E293B] bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-6">
          <TaskPulseLogo size="md" />
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#556070] dark:text-[#94A3B8]">
            <a href="#features" className="hover:text-[#756EF3] dark:hover:text-[#818CF8] transition-colors">
              Platform Overview
            </a>
            <a href="#workload" className="hover:text-[#756EF3] dark:hover:text-[#818CF8] transition-colors">
              Workload Telemetry
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

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-lg border border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#151C2C] hover:bg-slate-100 dark:hover:bg-slate-800 text-[#002055] dark:text-[#F8FAFC] transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#756EF3]" />
            )}
          </button>

          {/* Sign In Button */}
          <button
            onClick={() => scrollToAuth("signin")}
            className="px-3.5 py-1.5 rounded-lg border border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#151C2C] hover:border-[#756EF3] text-[#002055] dark:text-[#F8FAFC] text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            Sign In
          </button>

          {/* Sign Up / Organization Onboarding Button */}
          <button
            onClick={() => scrollToAuth("signup")}
            className="px-4 py-1.5 rounded-lg bg-[#756EF3] hover:bg-[#635BFF] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-[1400px] w-full mx-auto flex flex-col items-center text-center overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#756EF3]/10 dark:bg-[#756EF3]/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Enterprise Platform Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0EFFF] dark:bg-[#756EF3]/15 border border-[#756EF3]/30 text-[#756EF3] dark:text-[#818CF8] text-xs font-semibold tracking-wide mb-6 shadow-xs">
          <Activity className="w-3.5 h-3.5 text-[#756EF3]" />
          <span>TaskPulse Enterprise Velocity Engine</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#756EF3]" />
          <span className="text-[#556070] dark:text-[#94A3B8] font-normal">v2.4 Production</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl text-[#002055] dark:text-[#F8FAFC] leading-[1.15] font-sans">
          Synchronous Task Execution &amp; Real-Time Workload Intelligence
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base lg:text-lg text-[#556070] dark:text-[#94A3B8] max-w-2xl leading-relaxed font-sans">
          Coordinate engineering and product sprints, prevent burnout through real-time colleague capacity telemetry, and capture granular change logs upon task completion across desktop and mobile.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => scrollToAuth("signup")}
            className="px-6 py-3 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Start Organization Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollToAuth("signin")}
            className="px-6 py-3 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] hover:border-[#756EF3] text-[#002055] dark:text-[#F8FAFC] text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-[#756EF3]" />
            <span>Sign In to Workspace</span>
          </button>

          <button
            onClick={onEnterDemo}
            data-testid="landing-sandbox-btn"
            className="px-5 py-3 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 hover:bg-[#E2E0FD] dark:hover:bg-[#756EF3]/25 border border-[#756EF3]/30 text-[#756EF3] dark:text-[#818CF8] text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Demo Sandbox</span>
          </button>
        </div>

        {/* Key Metrics / Value Propositions */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
          <div className="p-4 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs">
            <div className="text-xl sm:text-2xl font-bold text-[#756EF3]">Real-Time</div>
            <div className="text-xs text-[#556070] dark:text-[#94A3B8] mt-0.5">Capacity Telemetry</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs">
            <div className="text-xl sm:text-2xl font-bold text-emerald-500">Sub-100ms</div>
            <div className="text-xs text-[#556070] dark:text-[#94A3B8] mt-0.5">State Synchronization</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs">
            <div className="text-xl sm:text-2xl font-bold text-[#002055] dark:text-[#F8FAFC]">100% Parity</div>
            <div className="text-xs text-[#556070] dark:text-[#94A3B8] mt-0.5">Mobile &amp; Web Engine</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs">
            <div className="text-xl sm:text-2xl font-bold text-amber-500">Zero Burnout</div>
            <div className="text-xs text-[#556070] dark:text-[#94A3B8] mt-0.5">Threshold Guardrails</div>
          </div>
        </div>

        {/* 3. Interactive Platform Board Showcase */}
        <div className="mt-14 w-full rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] p-5 sm:p-6 shadow-xl text-left">
          {/* Mock Board Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9F1FF] dark:border-[#1E293B]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#556070] dark:text-[#94A3B8] font-mono">WORKSPACE PREVIEW</div>
                <div className="text-sm font-bold text-[#002055] dark:text-[#F8FAFC]">TaskPulse Core Workspace &bull; Sprint 42</div>
              </div>
            </div>

            {/* Capacity Status Pill indicators */}
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Sarah Chen (Optimal &bull; 2 tasks)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Marcus Vance (Moderate &bull; 4 tasks)</span>
              </span>
            </div>
          </div>

          {/* Mini Kanban Simulator Columns */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Column 1 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F19]/80 border border-[#E9F1FF] dark:border-[#1E293B]">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider font-mono text-slate-600 dark:text-slate-300 mb-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Backlog</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px]">2</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs">
                  <div className="font-semibold text-[#002055] dark:text-[#F8FAFC]">Telemetry Pipeline Indexing</div>
                  <div className="text-[11px] text-[#556070] dark:text-[#94A3B8] mt-1">Implement real-time socket channels</div>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs">
                  <div className="font-semibold text-[#002055] dark:text-[#F8FAFC]">SLA Alert Routing</div>
                  <div className="text-[11px] text-[#556070] dark:text-[#94A3B8] mt-1">Configure manager email webhooks</div>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F19]/80 border border-[#E9F1FF] dark:border-[#1E293B]">
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
                  <div className="font-semibold text-[#002055] dark:text-[#F8FAFC] mt-1">Mobile Haptic Feedback &amp; Cache</div>
                  <div className="text-[11px] text-[#556070] dark:text-[#94A3B8] mt-1">Assignee: Marcus Vance</div>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F19]/80 border border-[#E9F1FF] dark:border-[#1E293B]">
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
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F19]/80 border border-[#E9F1FF] dark:border-[#1E293B]">
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
              Synchronous Workload Telemetry
            </h3>
            <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Real-time member capacity indicators automatically track assigned task density. Identify optimal, moderate, and overload thresholds instantly before sprint deliverables are impacted.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E9F1FF] dark:border-[#1E293B] flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Automated Burnout Prevention</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div id="dispatcher" className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#002055] dark:text-[#F8FAFC]">
              Task Completion Change Logs &amp; Audit
            </h3>
            <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Whenever a team member completes a task, they can record exact code or design changes made alongside screenshot attachments for instant manager verification.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E9F1FF] dark:border-[#1E293B] flex items-center gap-2 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8]">
              <Paperclip className="w-3.5 h-3.5" />
              <span>Optional Screenshot Proof Attachments</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div id="mobile" className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#002055] dark:text-[#F8FAFC]">
              Cross-Platform Mobile Application
            </h3>
            <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Native Android and iOS mobile app with React Native and Hermes. Features responsive 72px touch targets, light haptic feedback on completion, and seamless drawer navigation.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E9F1FF] dark:border-[#1E293B] flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Light Haptic Touch Feedback</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs hover:border-[#756EF3]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#002055] dark:text-[#F8FAFC]">
              Enterprise Organization Onboarding
            </h3>
            <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Three-step initialization wizard allows workspace administrators to set up company parameters, configure engineering/product departments, and distribute shareable team join codes.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E9F1FF] dark:border-[#1E293B] flex items-center gap-2 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Instant Workspace Join Codes</span>
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
              Strict separation between Primary Administrators, Department Managers, and Team Members. Real-time Firebase custom token claims enforce secure Firestore read/write boundaries.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E9F1FF] dark:border-[#1E293B] flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Firebase Security Rules Verification</span>
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
              Filter tasks by specific initiatives, departments, or individual team members. Managers can assign tasks, adjust deadlines, and re-balance team workloads in a single click.
            </p>
            <div className="mt-4 pt-4 border-t border-[#E9F1FF] dark:border-[#1E293B] flex items-center gap-2 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8]">
              <Users className="w-3.5 h-3.5" />
              <span>Direct Manager Dispatch Controls</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. In-Page Authentication & Onboarding Portal */}
      <section id="auth-portal" className="py-20 px-6 max-w-[1200px] w-full mx-auto border-t border-[#E9F1FF] dark:border-[#1E293B]">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="text-xs font-bold text-[#756EF3] dark:text-[#818CF8] tracking-wider uppercase font-mono mb-2">
            WORKSPACE ACCESS PORTAL
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002055] dark:text-[#F8FAFC]">
            Access Your Workspace
          </h2>
          <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-2">
            Sign in to your existing team workspace or initialize organization onboarding.
          </p>
        </div>

        {/* Portal Container */}
        <div className="max-w-xl mx-auto rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xl p-6 sm:p-8">
          {/* Tab Selector: Sign In vs Sign Up */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-[#0B0F19] p-1 mb-6 border border-[#E9F1FF] dark:border-[#1E293B] text-xs font-semibold">
            <button
              onClick={() => setAuthTab("signin")}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                authTab === "signin"
                  ? "bg-white dark:bg-[#151C2C] text-[#756EF3] dark:text-[#818CF8] shadow-xs"
                  : "text-[#556070] dark:text-[#94A3B8] hover:text-[#002055] dark:hover:text-white"
              }`}
            >
              Sign In to Workspace
            </button>
            <button
              onClick={() => setAuthTab("signup")}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                authTab === "signup"
                  ? "bg-white dark:bg-[#151C2C] text-[#756EF3] dark:text-[#818CF8] shadow-xs"
                  : "text-[#556070] dark:text-[#94A3B8] hover:text-[#002055] dark:hover:text-white"
              }`}
            >
              Sign Up (Organization Onboarding)
            </button>
          </div>

          {/* TAB CONTENT: SIGN IN */}
          {authTab === "signin" && (
            <div className="space-y-6">
              {/* Google OAuth Button */}
              <div>
                <button
                  onClick={async () => {
                    await signInWithGoogle();
                  }}
                  data-testid="landing-google-signin"
                  className="w-full py-3 px-4 rounded-xl bg-white dark:bg-[#0B0F19] hover:bg-slate-50 dark:hover:bg-slate-800 text-[#002055] dark:text-[#F8FAFC] font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs hover:border-[#756EF3] cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google Account</span>
                </button>
              </div>

              {/* Separator */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#E9F1FF] dark:border-[#1E293B] w-full" />
                <span className="bg-white dark:bg-[#151C2C] px-3 text-[11px] font-mono uppercase text-[#556070] dark:text-[#94A3B8] absolute">
                  Or Custom Account
                </span>
              </div>

              {/* Custom Account Form */}
              <form onSubmit={handleCustomLogin} className="space-y-3.5">
                {customError && (
                  <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs">
                    {customError}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#756EF3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="e.g. alex.vance@company.com"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#756EF3]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#756EF3] hover:bg-[#635BFF] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Sign In with Work Email
                </button>
              </form>

              {/* Separator for Quick Demo Sandbox Access */}
              <div className="relative flex items-center justify-center pt-2">
                <div className="border-t border-[#E9F1FF] dark:border-[#1E293B] w-full" />
                <span className="bg-white dark:bg-[#151C2C] px-3 text-[11px] font-mono uppercase text-[#556070] dark:text-[#94A3B8] absolute">
                  1-Click Role Sandbox
                </span>
              </div>

              {/* Instant Role Login Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={onEnterDemo}
                  data-testid="demo-manager-login-btn"
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] hover:border-[#756EF3] text-left transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#002055] dark:text-[#F8FAFC]">Sarah Chen</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] text-[10px] font-semibold">
                      Manager
                    </span>
                  </div>
                  <div className="text-[11px] text-[#556070] dark:text-[#94A3B8] mt-1">
                    Engineering Lead &bull; Full dispatch &amp; approval access
                  </div>
                </button>

                <button
                  onClick={onEnterMarcus}
                  data-testid="demo-member-login-btn"
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] hover:border-[#756EF3] text-left transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#002055] dark:text-[#F8FAFC]">Marcus Vance</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                      Member
                    </span>
                  </div>
                  <div className="text-[11px] text-[#556070] dark:text-[#94A3B8] mt-1">
                    Senior Developer &bull; Task execution &amp; change logging
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* TAB CONTENT: SIGN UP (ORGANIZATION ONBOARDING) */}
          {authTab === "signup" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/15 border border-[#756EF3]/30 text-left">
                <div className="flex items-center gap-2 font-bold text-xs text-[#756EF3] dark:text-[#818CF8]">
                  <Building2 className="w-4 h-4" />
                  <span>3-Step Organization Onboarding</span>
                </div>
                <p className="text-xs text-[#556070] dark:text-[#94A3B8] mt-1.5 leading-relaxed">
                  Initialize a new company workspace, register team roles, and distribute instant invitation links:
                </p>
                <div className="mt-3 space-y-2 text-xs text-[#002055] dark:text-[#F8FAFC]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#756EF3] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    <span>Organization Profile &amp; Department Setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#756EF3] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    <span>Employee Invitations &amp; Role Assignments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#756EF3] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                    <span>Workspace Access Keys &amp; Mobile Links</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOnboardingOpen(true)}
                data-testid="landing-start-onboarding-btn"
                className="w-full py-3.5 px-4 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Launch Organization Onboarding Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-[11px] text-[#556070] dark:text-[#94A3B8]">
                Already received an invitation link or join code? Switch to{" "}
                <button
                  onClick={() => setAuthTab("signin")}
                  className="text-[#756EF3] dark:text-[#818CF8] font-semibold underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 6. Enterprise Clean Footer */}
      <footer className="mt-auto border-t border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#0B0F19] py-8 px-6 transition-colors">
        <div className="max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#556070] dark:text-[#94A3B8]">
          <div className="flex items-center gap-3">
            <TaskPulseLogo size="sm" />
            <span>&copy; {new Date().getFullYear()} TaskPulse Inc. Enterprise Task Velocity Engine.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Production Systems Operational</span>
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
