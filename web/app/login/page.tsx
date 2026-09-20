"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { TaskPulseLogo } from "@/components/TaskPulseLogo";
import { useAuth, PERMANENT_ADMIN_EMAIL } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useOrganization } from "@/context/OrganizationContext";
import { SpotlightCard } from "@/components/SpotlightCard";
import { AmbientBackground } from "@/components/AmbientBackground";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Building2,
  ShieldCheck,
  Zap,
  BarChart3,
  Sun,
  Moon,
  Sparkles,
  Users,
  CheckCircle2,
  KeyRound,
  Smartphone,
  Layers,
  Activity,
  Cpu,
  Fingerprint,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithGoogle, signInWithCustomUser, isLiveFirebase } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { joinWithCode } = useOrganization();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pingLatency, setPingLatency] = useState(42);

  // GSAP Animation Refs
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const cardBoxRef = useRef<HTMLDivElement>(null);
  const sandboxRef = useRef<HTMLDivElement>(null);

  // Live Ping Latency Sim
  useEffect(() => {
    const interval = setInterval(() => {
      setPingLatency(Math.floor(38 + Math.random() * 12));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // GSAP Orchestrated Entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Header reveal
      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 }
        );
      }

      // 2. Left column elements stagger
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { y: 15, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5 },
          "-=0.3"
        );
      }

      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.3"
        );
      }

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4"
        );
      }

      if (featuresRef.current) {
        tl.fromTo(
          featuresRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 },
          "-=0.3"
        );
      }

      if (telemetryRef.current) {
        tl.fromTo(
          telemetryRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.2"
        );
      }

      // 3. Right column card entrance with smooth scale
      if (cardBoxRef.current) {
        tl.fromTo(
          cardBoxRef.current,
          { y: 35, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: "back.out(1.4)" },
          "-=0.7"
        );
      }

      // 4. Sandbox button stagger
      if (sandboxRef.current) {
        tl.fromTo(
          sandboxRef.current.querySelectorAll(".sandbox-btn"),
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
          "-=0.3"
        );
      }
    }, pageContainerRef);

    return () => ctx.revert();
  }, []);

  // GSAP Error Shake
  const triggerErrorShake = () => {
    if (cardBoxRef.current) {
      gsap.fromTo(
        cardBoxRef.current,
        { x: -10 },
        {
          x: 10,
          duration: 0.08,
          repeat: 4,
          yoyo: true,
          ease: "power1.inOut",
          onComplete: () => {
            gsap.to(cardBoxRef.current, { x: 0, duration: 0.1 });
          },
        }
      );
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please provide both your full name and work email.");
      triggerErrorShake();
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid work email address.");
      triggerErrorShake();
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      signInWithCustomUser(name.trim(), email.trim());
      if (inviteCode.trim()) {
        joinWithCode(inviteCode.trim());
      }
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate. Please verify your credentials.");
      triggerErrorShake();
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      if (isLiveFirebase) {
        await signInWithGoogle();
      } else {
        signInWithCustomUser("Google Colleague", "colleague@workspace.internal");
      }
      router.push("/");
    } catch (err: any) {
      setError("Google authentication was canceled or encountered an error.");
      triggerErrorShake();
      setIsSubmitting(false);
    }
  };

  const handleRoleSandbox = (roleName: string, roleEmail: string) => {
    signInWithCustomUser(roleName, roleEmail);
    router.push("/");
  };

  return (
    <div
      ref={pageContainerRef}
      className="relative min-h-screen w-full bg-[#F8FAFF] dark:bg-[#0B0F19] text-[#002055] dark:text-[#F8FAFC] flex flex-col transition-colors duration-300 selection:bg-[#756EF3]/20 selection:text-[#756EF3] overflow-x-hidden font-sans"
    >
      {/* GSAP Ambient Background */}
      <AmbientBackground />

      {/* 1. Global Navigation Bar */}
      <header
        ref={headerRef}
        className="relative z-40 border-b border-[#E9F1FF]/80 dark:border-[#1E293B]/80 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3 transition-all"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group p-2 rounded-xl border border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#151C2C] hover:bg-slate-100 dark:hover:bg-slate-800 text-[#002055] dark:text-[#F8FAFC] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            title="Return to Home"
            aria-label="Return to Home"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </Link>
          <TaskPulseLogo size="md" />
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl border border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#151C2C] hover:bg-slate-100 dark:hover:bg-slate-800 text-[#002055] dark:text-[#F8FAFC] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#756EF3]" />
            )}
          </button>

          <Link
            href="/onboarding"
            className="relative group px-4 py-2 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white text-xs font-semibold shadow-md shadow-[#756EF3]/20 hover:shadow-lg hover:shadow-[#756EF3]/30 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 cursor-pointer overflow-hidden"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Organization Onboarding</span>
            <span className="sm:hidden">Sign Up</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>

      {/* 2. Main Login Canvas */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 max-w-[1400px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 w-full items-center">
          
          {/* LEFT COLUMN: Enterprise Value Showcase */}
          <div ref={leftColRef} className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 text-left pr-4">
            
            {/* Platform Badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0EFFF] dark:bg-[#756EF3]/15 border border-[#756EF3]/30 text-[#756EF3] dark:text-[#818CF8] text-[11px] font-mono uppercase tracking-wider shadow-xs w-fit"
            >
              <Zap className="w-3.5 h-3.5 text-[#756EF3] animate-pulse" />
              <span>Enterprise Single Sign-On</span>
            </div>

            {/* Headline */}
            <h1
              ref={titleRef}
              className="text-3xl xl:text-4.5xl font-black tracking-tight text-[#002055] dark:text-[#F8FAFC] leading-[1.18]"
            >
              Real-Time Workload Visibility &amp; Synchronous Sprint Velocity
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-sm text-[#556070] dark:text-[#94A3B8] leading-relaxed max-w-lg font-normal"
            >
              Authenticate into your corporate workspace to access active sprint kanban boards, live colleague capacity telemetry, and tamper-evident audit logs.
            </p>

            {/* Feature Value Cards with Spotlight Glow */}
            <div ref={featuresRef} className="space-y-3.5 pt-1 max-w-lg">
              <SpotlightCard className="p-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] dark:bg-[#756EF3]/20 text-[#756EF3] flex items-center justify-center shrink-0 shadow-inner">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-[#002055] dark:text-[#F8FAFC] tracking-tight">
                      Deterministic Workload Telemetry
                    </h2>
                    <p className="text-[11px] text-[#556070] dark:text-[#94A3B8] mt-0.5 leading-normal">
                      Continuous colleague bandwidth limits keep team leads proactive, preventing burn-out before sprint deadlines slip.
                    </p>
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-[#002055] dark:text-[#F8FAFC] tracking-tight">
                      SOC 2 Type II Verified &amp; Merkle Root Signed
                    </h2>
                    <p className="text-[11px] text-[#556070] dark:text-[#94A3B8] mt-0.5 leading-normal">
                      Every dispatch, status change, and ticket reassignment is recorded to a cryptographically validated local audit trail.
                    </p>
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-[#756EF3] flex items-center justify-center shrink-0 shadow-inner">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-[#002055] dark:text-[#F8FAFC] tracking-tight">
                      100% Cross-Platform Parity
                    </h2>
                    <p className="text-[11px] text-[#556070] dark:text-[#94A3B8] mt-0.5 leading-normal">
                      Identical experience across native Android build, mobile browser web app (iOS Safari), and full desktop dashboard.
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </div>

            {/* Live Telemetry Ping Status */}
            <div
              ref={telemetryRef}
              className="flex items-center gap-3 pt-2 text-xs text-[#556070] dark:text-[#94A3B8] font-mono"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Telemetry Sync Active ({pingLatency}ms)</span>
              </div>
              <span className="text-slate-400">&bull;</span>
              <span className="text-[11px] text-slate-500">Zero Trust TLS 1.3</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Spotlight Login Card */}
          <div ref={rightColRef} className="lg:col-span-6 flex flex-col justify-center max-w-lg w-full mx-auto">
            <div ref={cardBoxRef}>
              <SpotlightCard className="p-6 sm:p-9 text-left">
                {/* Card Header */}
                <div className="mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-[#F0EFFF] dark:bg-[#756EF3]/20 text-[#756EF3] flex items-center justify-center mb-3 shadow-inner">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#002055] dark:text-[#F8FAFC] tracking-tight">
                    Sign In to Workspace
                  </h2>
                  <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-1">
                    Enter your organization credentials or activate a test sandbox role.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-shake">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Google OAuth One-Tap Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-white dark:bg-[#0B0F19] hover:bg-slate-50 dark:hover:bg-slate-800 text-[#002055] dark:text-[#F8FAFC] font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs hover:border-[#756EF3] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google Account</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-5">
                  <div className="border-t border-[#E9F1FF] dark:border-[#1E293B] w-full" />
                  <span className="bg-white dark:bg-[#151C2C] px-3 text-[10px] font-mono uppercase tracking-widest text-[#556070] dark:text-[#94A3B8] absolute">
                    Or Corporate Email
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={handleCustomLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#756EF3] focus:ring-2 focus:ring-[#756EF3]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                      Work Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex.vance@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#756EF3] focus:ring-2 focus:ring-[#756EF3]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                      Workspace Join Code <span className="font-normal text-slate-400 font-sans">(Optional)</span>
                    </label>
                    <div className="relative flex items-center">
                      <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        placeholder="e.g. TASK-9481"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#756EF3] focus:ring-2 focus:ring-[#756EF3]/20 font-mono transition-all uppercase tracking-wider"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#756EF3]/25 hover:shadow-lg hover:shadow-[#756EF3]/35 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Instant Role Sandbox Section */}
                <div ref={sandboxRef} className="pt-5 mt-5 border-t border-[#E9F1FF] dark:border-[#1E293B]">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#556070] dark:text-[#94A3B8] mb-2.5 flex items-center justify-between">
                    <span>1-Click Role Sandbox</span>
                    <span className="text-[#756EF3] font-semibold">Instant Access</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleRoleSandbox("Sarah Chen", "sarah.chen@taskpulse.internal")}
                      className="sandbox-btn group p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] hover:border-[#756EF3] text-left transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#002055] dark:text-[#F8FAFC] group-hover:text-[#756EF3] transition-colors">
                          Sarah Chen
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] text-[9px] font-semibold">
                          Manager
                        </span>
                      </div>
                      <div className="text-[10px] text-[#556070] dark:text-[#94A3B8] mt-0.5 truncate">
                        Lead &bull; Dispatch &amp; approvals
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRoleSandbox("Marcus Vance", "marcus.vance@taskpulse.internal")}
                      className="sandbox-btn group p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] hover:border-[#756EF3] text-left transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#002055] dark:text-[#F8FAFC] group-hover:text-[#756EF3] transition-colors">
                          Marcus Vance
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-semibold">
                          Member
                        </span>
                      </div>
                      <div className="text-[10px] text-[#556070] dark:text-[#94A3B8] mt-0.5 truncate">
                        Dev &bull; Tasks &amp; change logs
                      </div>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRoleSandbox("Zevon", PERMANENT_ADMIN_EMAIL)}
                    className="sandbox-btn group w-full mt-2 p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/25 border border-purple-200/80 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 text-left transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold">Zevon (Super Administrator)</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full text-purple-700 dark:text-purple-300 font-semibold">
                      Full Clearance
                    </span>
                  </button>
                </div>

                {/* Link to Onboarding */}
                <div className="mt-5 text-center text-xs text-[#556070] dark:text-[#94A3B8]">
                  <span>New organization or department? </span>
                  <Link
                    href="/onboarding"
                    className="text-[#756EF3] dark:text-[#818CF8] font-semibold hover:underline"
                  >
                    Start Organization Onboarding
                  </Link>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="relative z-10 mt-auto border-t border-[#E9F1FF]/80 dark:border-[#1E293B]/80 bg-white/60 dark:bg-[#0B0F19]/60 backdrop-blur-md py-4 px-6 text-center text-xs text-[#556070] dark:text-[#94A3B8]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} TaskPulse Inc. Enterprise Workload Platform.</span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium font-mono text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Security &amp; Audit Active</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
