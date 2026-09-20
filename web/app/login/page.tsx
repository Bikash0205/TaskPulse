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
  KeyRound,
  Smartphone,
  Fingerprint,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signInWithCustomUser, isLiveFirebase } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { joinWithCode } = useOrganization();

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      window.location.href = "/";
    }
  }, [user, loading]);

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
          "-=0.4"
        );
      }
    }, pageContainerRef);

    return () => ctx.revert();
  }, []);

  const triggerErrorShake = () => {
    if (cardBoxRef.current) {
      gsap.fromTo(
        cardBoxRef.current,
        { x: -10 },
        {
          x: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
          clearProps: "x",
        }
      );
    }
  };

  const handleManualAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid work email address.");
      triggerErrorShake();
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      triggerErrorShake();
      return;
    }

    if (authMode === "register" && !name.trim()) {
      setError("Please provide your full name to register.");
      triggerErrorShake();
      return;
    }

    setIsSubmitting(true);

    try {
      if (authMode === "login") {
        const res = await signInWithEmail(email.trim(), password);
        if (!res.success) {
          setError(res.error || "Authentication failed.");
          triggerErrorShake();
          setIsSubmitting(false);
          return;
        }
      } else {
        const res = await signUpWithEmail(name.trim(), email.trim(), password);
        if (!res.success) {
          setError(res.error || "Registration failed.");
          triggerErrorShake();
          setIsSubmitting(false);
          return;
        }
        if (inviteCode.trim()) {
          await joinWithCode(inviteCode.trim());
        }
      }

      window.location.href = "/";
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
      const res = await signInWithGoogle();
      if (res.success) {
        window.location.href = "/";
      } else {
        if (res.error && res.error !== "Sign-in popup was closed before completing.") {
          setError(res.error);
          triggerErrorShake();
        }
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err?.message || "Google authentication encountered an error.");
      triggerErrorShake();
      setIsSubmitting(false);
    }
  };

  const handleRoleSandbox = (roleName: string, roleEmail: string) => {
    signInWithCustomUser(roleName, roleEmail);
    window.location.href = "/";
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

      {/* 2. Main Login Stage */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="max-w-[1240px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Enterprise Value Showcase */}
          <div ref={leftColRef} className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 text-left pr-4">
            
            {/* Platform Badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0EFFF] dark:bg-[#756EF3]/15 border border-[#756EF3]/30 text-[#756EF3] dark:text-[#818CF8] text-[11px] font-mono uppercase tracking-wider shadow-xs w-fit"
            >
              <Zap className="w-3.5 h-3.5 text-[#756EF3]" />
              <span>Enterprise Single Sign-On</span>
            </div>

            {/* Headline */}
            <h1
              ref={titleRef}
              className="text-3xl xl:text-4.5xl font-black tracking-tight text-[#002055] dark:text-[#F8FAFC] leading-[1.18]"
            >
              Enterprise Workload Intelligence &amp; Sprint Execution
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-sm text-[#556070] dark:text-[#94A3B8] leading-relaxed max-w-lg font-normal"
            >
              Sign in to your corporate workspace to access sprint boards, monitor team capacity distribution, and review verified task completion logs.
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
                      Continuous Capacity Tracking
                    </h2>
                    <p className="text-[11px] text-[#556070] dark:text-[#94A3B8] mt-0.5 leading-normal">
                      Clear team bandwidth indicators keep managers proactive, balancing assignments effectively across active sprints.
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
                      Enterprise Security &amp; Audit Logging
                    </h2>
                    <p className="text-[11px] text-[#556070] dark:text-[#94A3B8] mt-0.5 leading-normal">
                      Every task assignment, status update, and completion sign-off is preserved in the workspace audit record.
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
                      Cross-Platform Client Parity
                    </h2>
                    <p className="text-[11px] text-[#556070] dark:text-[#94A3B8] mt-0.5 leading-normal">
                      Consistent workflow experience across desktop browsers, native Android, and iOS mobile web.
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </div>

            {/* Enterprise Security & Compliance Badges */}
            <div
              ref={telemetryRef}
              className="flex flex-wrap items-center gap-2 pt-2 text-xs text-[#556070] dark:text-[#94A3B8]"
            >
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] text-slate-700 dark:text-slate-300 text-[11px] font-medium shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>SOC 2 Type II Certified</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] text-slate-700 dark:text-slate-300 text-[11px] font-medium shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-[#756EF3]" />
                <span>End-to-End TLS 1.3</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] text-slate-700 dark:text-slate-300 text-[11px] font-medium shadow-2xs">
                <span>AES-256 Encryption</span>
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Login / Register Card */}
          <div ref={rightColRef} className="lg:col-span-6 flex flex-col justify-center max-w-lg w-full mx-auto">
            <div ref={cardBoxRef}>
              <SpotlightCard className="p-6 sm:p-9 text-left">
                {/* Card Header */}
                <div className="mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-[#F0EFFF] dark:bg-[#756EF3]/20 text-[#756EF3] flex items-center justify-center mb-3 shadow-inner">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#002055] dark:text-[#F8FAFC] tracking-tight">
                    {authMode === "login" ? "Sign In to Workspace" : "Create Workspace Account"}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-1">
                    {authMode === "login"
                      ? "Enter your workspace credentials or authenticate via Google SSO."
                      : "Register your corporate account to join your team's active workspace."}
                  </p>
                </div>

                {/* Auth Mode Toggle Pill */}
                <div className="flex rounded-xl bg-slate-100 dark:bg-[#0B0F19] p-1 mb-5 border border-[#E9F1FF] dark:border-[#1E293B] text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setError("");
                    }}
                    className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                      authMode === "login"
                        ? "bg-white dark:bg-[#151C2C] text-[#756EF3] dark:text-[#818CF8] shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setError("");
                    }}
                    className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                      authMode === "register"
                        ? "bg-white dark:bg-[#151C2C] text-[#756EF3] dark:text-[#818CF8] shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-shake">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Google OAuth Button */}
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
                <form onSubmit={handleManualAuth} className="space-y-3.5">
                  {authMode === "register" && (
                    <div>
                      <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                        Full Name <span className="text-red-500">*</span>
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
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                      Work Email Address <span className="text-red-500">*</span>
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8]">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-normal">Min. 6 characters</span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#756EF3] focus:ring-2 focus:ring-[#756EF3]/20 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {authMode === "register" && (
                    <div>
                      <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                        Workspace Join Code <span className="font-normal text-slate-400 font-sans">(Optional)</span>
                      </label>
                      <div className="relative flex items-center">
                        <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                          placeholder="e.g. TASK-9481"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#756EF3] focus:ring-2 focus:ring-[#756EF3]/20 font-mono transition-all uppercase tracking-wider"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="login-submit-btn"
                    className="w-full py-3 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#756EF3]/25 hover:shadow-lg hover:shadow-[#756EF3]/35 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>{authMode === "login" ? "Sign In to Workspace" : "Create Workspace Account"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode(authMode === "login" ? "register" : "login");
                        setError("");
                      }}
                      className="text-xs text-[#756EF3] dark:text-[#818CF8] hover:underline font-medium cursor-pointer"
                    >
                      {authMode === "login"
                        ? "Need a workspace account? Create one"
                        : "Already have an account? Sign In"}
                    </button>
                  </div>
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
                    className="sandbox-btn w-full mt-2 p-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 border border-purple-500/30 text-left transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-bold text-[#002055] dark:text-[#F8FAFC]">
                        Zevon (Super Administrator)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[9px] font-bold uppercase tracking-wider font-mono">
                      Full Clearance
                    </span>
                  </button>
                </div>

                {/* Footer Link to Onboarding */}
                <div className="pt-4 mt-4 border-t border-[#E9F1FF] dark:border-[#1E293B] text-center text-xs text-[#556070] dark:text-[#94A3B8]">
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
          <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
            Status: All Systems Operational
          </span>
        </div>
      </footer>
    </div>
  );
}
