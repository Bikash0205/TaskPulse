"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { TaskPulseLogo } from "@/components/TaskPulseLogo";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useOrganization } from "@/context/OrganizationContext";
import { Department, UserRole } from "@shared/types";
import { SpotlightCard } from "@/components/SpotlightCard";
import { AmbientBackground } from "@/components/AmbientBackground";
import {
  Building2,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  Users,
  Plus,
  Trash2,
  Copy,
  Sun,
  Moon,
  Sparkles,
  ExternalLink,
  Laptop,
  CheckCircle2,
  Layers,
  Briefcase,
  Sliders,
  Cpu,
} from "lucide-react";

interface EmployeeEntry {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

const DEFAULT_POPULAR_DEPTS = [
  "Platform Engineering",
  "Design Systems",
  "Product Management",
  "Customer Success",
  "Growth Marketing",
  "Operations",
  "Security & Compliance",
  "Data Science",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, signInWithCustomUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { onboardCompany, joinWithCode, inviteTeammate } = useOrganization();

  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Company Profile
  const [adminName, setAdminName] = useState(user?.displayName || "Alex Vance");
  const [adminEmail, setAdminEmail] = useState(user?.email || "alex.vance@company.com");
  const [companyName, setCompanyName] = useState("");
  const [teamSize, setTeamSize] = useState("11-50");
  const [slug, setSlug] = useState("");

  // Step 2: Employee Roles & Departments
  const [employees, setEmployees] = useState<EmployeeEntry[]>([
    {
      id: "e1",
      name: "Marcus Lee",
      email: "marcus@company.com",
      role: "manager",
      department: "Platform Engineering",
    },
    {
      id: "e2",
      name: "Elena Rostova",
      email: "elena@company.com",
      role: "member",
      department: "Design Systems",
    },
  ]);

  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpEmail, setNewEmpEmail] = useState("");
  const [newEmpRole, setNewEmpRole] = useState<UserRole>("member");
  const [newEmpDept, setNewEmpDept] = useState<string>("");

  // Step 3: Success state
  const [linkCopied, setLinkCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrgData, setCreatedOrgData] = useState<{ code: string; name: string } | null>(null);

  // Join Flow
  const [joinCode, setJoinCode] = useState("");
  const [joinName, setJoinName] = useState(user?.displayName || "");
  const [joinEmail, setJoinEmail] = useState(user?.email || "");
  const [joinError, setJoinError] = useState<string | null>(null);

  // GSAP Animation Refs
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const wizardCardRef = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const suggestedChips = useMemo(() => {
    const existing = employees.map((e) => e.department.trim()).filter(Boolean);
    return Array.from(new Set([...existing, ...DEFAULT_POPULAR_DEPTS]));
  }, [employees]);

  // Initial Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (wizardCardRef.current) {
        gsap.fromTo(
          wizardCardRef.current,
          { y: 30, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }
        );
      }
    }, pageContainerRef);
    return () => ctx.revert();
  }, []);

  // Animate Step Progress Bar
  useEffect(() => {
    if (progressBarRef.current) {
      const percentage = step === 1 ? 33 : step === 2 ? 66 : 100;
      gsap.to(progressBarRef.current, {
        width: `${percentage}%`,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [step]);

  // Directional Step Switch Animation
  const changeStep = (targetStep: 1 | 2 | 3, direction: "next" | "back") => {
    if (!stepContentRef.current) {
      setStep(targetStep);
      return;
    }

    const xOut = direction === "next" ? -25 : 25;
    const xIn = direction === "next" ? 25 : -25;

    gsap.to(stepContentRef.current, {
      x: xOut,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setStep(targetStep);
        gsap.fromTo(
          stepContentRef.current,
          { x: xIn, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" }
        );
      },
    });
  };

  const handleAddEmployee = () => {
    if (!newEmpEmail.trim()) return;
    const resolvedDept = newEmpDept.trim() || "Platform Engineering";
    const entry: EmployeeEntry = {
      id: `emp-${Date.now()}`,
      name: newEmpName.trim() || newEmpEmail.split("@")[0],
      email: newEmpEmail.trim().toLowerCase(),
      role: newEmpRole,
      department: resolvedDept,
    };
    setEmployees((prev) => [...prev, entry]);
    setNewEmpName("");
    setNewEmpEmail("");
    setNewEmpDept("");
  };

  const handleRemoveEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const handleCreateWorkspace = () => {
    if (!companyName.trim()) return;
    setIsSubmitting(true);

    if (!user) {
      signInWithCustomUser(adminName.trim() || "Administrator", adminEmail.trim() || "admin@company.com");
    }

    const customDepts = Array.from(new Set(employees.map((emp) => emp.department.trim()).filter(Boolean)));
    if (customDepts.length === 0) {
      customDepts.push("Platform Engineering", "Design Systems", "Product Management");
    }

    const { org, initialProject: proj } = onboardCompany(
      companyName.trim(),
      customDepts,
      `${companyName.trim()} Core Roadmap`
    );

    employees.forEach((emp) => {
      inviteTeammate(emp.email, emp.name, emp.role, emp.department as Department, [proj.id]);
    });

    setCreatedOrgData({ code: org.inviteCode, name: org.name });
    setIsSubmitting(false);
    changeStep(3, "next");
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setJoinError(null);
    setIsSubmitting(true);

    if (!user && joinName.trim() && joinEmail.trim()) {
      signInWithCustomUser(joinName.trim(), joinEmail.trim());
    }

    const result = joinWithCode(joinCode.trim());
    setIsSubmitting(false);

    if (result.success) {
      router.push("/");
    } else {
      setJoinError(result.message);
    }
  };

  const generatedSlug = slug || companyName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "acme-corp";

  return (
    <div
      ref={pageContainerRef}
      className="relative min-h-screen w-full bg-[#F8FAFF] dark:bg-[#0B0F19] text-[#002055] dark:text-[#F8FAFC] flex flex-col transition-colors duration-300 selection:bg-[#756EF3]/20 selection:text-[#756EF3] overflow-x-hidden font-sans"
    >
      {/* GSAP Ambient Background Mesh */}
      <AmbientBackground />

      {/* Global Navigation Header */}
      <header className="relative z-40 border-b border-[#E9F1FF]/80 dark:border-[#1E293B]/80 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3 transition-all">
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
            href="/login"
            className="px-4 py-2 rounded-xl border border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#151C2C] hover:border-[#756EF3] text-[#002055] dark:text-[#F8FAFC] text-xs font-semibold shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="hidden sm:inline">Already have a workspace?</span>
            <span className="text-[#756EF3] dark:text-[#818CF8]">Sign In</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-3xl w-full mx-auto my-4">
        <div ref={wizardCardRef} className="w-full">
          <SpotlightCard className="overflow-hidden shadow-2xl">
            {/* Top Banner & Mode Switcher */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-[#756EF3]/12 via-indigo-500/5 to-transparent border-b border-[#E9F1FF] dark:border-[#1E293B]">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#756EF3] text-white flex items-center justify-center shadow-lg shadow-[#756EF3]/30">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0EFFF] dark:bg-[#756EF3]/15 border border-[#756EF3]/30 text-[#756EF3] dark:text-[#818CF8] text-[11px] font-mono uppercase tracking-wider font-semibold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Workspace Setup</span>
                </div>
              </div>

              <div className="mt-4 text-left">
                <h1 className="text-xl sm:text-2xl font-black text-[#002055] dark:text-[#F8FAFC] tracking-tight">
                  Workspace Setup &amp; Onboarding
                </h1>
                <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-1 font-normal">
                  Initialize an enterprise workspace or join an existing organization using your team invitation code.
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-[#0B0F19] p-1 mt-5 border border-[#E9F1FF] dark:border-[#1E293B] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("create");
                    setStep(1);
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === "create"
                      ? "bg-white dark:bg-[#151C2C] text-[#756EF3] dark:text-[#818CF8] shadow-sm font-bold"
                      : "text-[#556070] dark:text-[#94A3B8] hover:text-[#002055] dark:hover:text-white"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#756EF3]" />
                  <span>Create New Organization</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("join")}
                  className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === "join"
                      ? "bg-white dark:bg-[#151C2C] text-[#756EF3] dark:text-[#818CF8] shadow-sm font-bold"
                      : "text-[#556070] dark:text-[#94A3B8] hover:text-[#002055] dark:hover:text-white"
                  }`}
                >
                  <KeyRound className="w-4 h-4 text-[#756EF3]" />
                  <span>Join with Team Code</span>
                </button>
              </div>
            </div>

            {/* CREATE WORKSPACE FLOW */}
            {activeTab === "create" && (
              <div>
                {/* Stepper Progress Bar */}
                <div className="relative w-full h-1 bg-slate-100 dark:bg-[#0B0F19] overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-gradient-to-r from-[#756EF3] to-[#818CF8] transition-all shadow-sm"
                    style={{ width: "33%" }}
                  />
                </div>

                {/* Stepper Header */}
                <div className="px-6 py-4 border-b border-[#E9F1FF] dark:border-[#1E293B] flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        step >= 1
                          ? "bg-[#756EF3] text-white shadow-xs"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {step > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
                    </span>
                    <span
                      className={`font-semibold tracking-tight ${
                        step === 1 ? "text-[#756EF3] dark:text-[#818CF8]" : "text-slate-500"
                      }`}
                    >
                      Company Profile
                    </span>
                  </div>

                  <div className="w-8 sm:w-16 h-0.5 bg-slate-200 dark:bg-slate-800" />

                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        step >= 2
                          ? "bg-[#756EF3] text-white shadow-xs"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {step > 2 ? <Check className="w-3.5 h-3.5" /> : "2"}
                    </span>
                    <span
                      className={`font-semibold tracking-tight ${
                        step === 2 ? "text-[#756EF3] dark:text-[#818CF8]" : "text-slate-500"
                      }`}
                    >
                      Teams &amp; Roles
                    </span>
                  </div>

                  <div className="w-8 sm:w-16 h-0.5 bg-slate-200 dark:bg-slate-800" />

                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        step >= 3
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      3
                    </span>
                    <span
                      className={`font-semibold tracking-tight ${
                        step === 3 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"
                      }`}
                    >
                      Keys &amp; Launch
                    </span>
                  </div>
                </div>

                {/* Animated Step Container */}
                <div ref={stepContentRef}>
                  {/* STEP 1: Company Profile Form */}
                  {step === 1 && (
                    <div className="p-6 sm:p-8 space-y-5 text-left">
                      <div>
                        <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1.5">
                          Company / Organization Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Acme Technologies Inc."
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs sm:text-sm text-[#002055] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#756EF3] focus:ring-2 focus:ring-[#756EF3]/20 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1.5">
                            Workspace URL Slug
                          </label>
                          <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs font-mono">
                            <span className="text-slate-400">taskpulse.internal/</span>
                            <input
                              type="text"
                              value={slug}
                              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                              placeholder={generatedSlug}
                              className="flex-1 bg-transparent text-[#002055] dark:text-[#F8FAFC] focus:outline-none ml-0.5 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1.5">
                            Organization Size
                          </label>
                          <select
                            value={teamSize}
                            onChange={(e) => setTeamSize(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] focus:outline-none focus:border-[#756EF3] focus:ring-2 focus:ring-[#756EF3]/20 transition-all"
                          >
                            <option value="1-10">1 - 10 Colleagues</option>
                            <option value="11-50">11 - 50 Colleagues</option>
                            <option value="51-200">51 - 200 Colleagues</option>
                            <option value="201-1000">201 - 1,000 Enterprise</option>
                            <option value="1000+">1,000+ Global Workforce</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E9F1FF] dark:border-[#1E293B]">
                        <div>
                          <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1.5">
                            Primary Administrator Name
                          </label>
                          <input
                            type="text"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            placeholder="Alex Vance"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] focus:outline-none focus:border-[#756EF3] focus:ring-2 focus:ring-[#756EF3]/20 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1.5">
                            Administrator Work Email
                          </label>
                          <input
                            type="email"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            placeholder="alex.vance@company.com"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] focus:outline-none focus:border-[#756EF3] focus:ring-2 focus:ring-[#756EF3]/20 transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          disabled={!companyName.trim()}
                          onClick={() => changeStep(2, "next")}
                          className="px-6 py-3 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#756EF3]/20 hover:shadow-lg hover:shadow-[#756EF3]/30 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
                        >
                          <span>Configure Departments &amp; Roles</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Teams & Roles Form */}
                  {step === 2 && (
                    <div className="p-6 sm:p-8 space-y-6 text-left">
                      <div>
                        <h2 className="text-sm font-bold text-[#002055] dark:text-[#F8FAFC] tracking-tight">
                          Add Team Members &amp; Assign Role Clearances
                        </h2>
                        <p className="text-xs text-[#556070] dark:text-[#94A3B8] mt-0.5 font-normal">
                          Configure your colleagues with specific department affiliations and permission tiers.
                        </p>
                      </div>

                      {/* Add Member Box */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                              Colleague Name
                            </label>
                            <input
                              type="text"
                              value={newEmpName}
                              onChange={(e) => setNewEmpName(e.target.value)}
                              placeholder="e.g. Sarah Connor"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] focus:outline-none focus:border-[#756EF3] focus:ring-1 focus:ring-[#756EF3]/20"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                              Work Email Address
                            </label>
                            <input
                              type="email"
                              value={newEmpEmail}
                              onChange={(e) => setNewEmpEmail(e.target.value)}
                              placeholder="e.g. sarah@company.com"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] focus:outline-none focus:border-[#756EF3] focus:ring-1 focus:ring-[#756EF3]/20"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                              Role Clearance
                            </label>
                            <select
                              value={newEmpRole}
                              onChange={(e) => setNewEmpRole(e.target.value as UserRole)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] focus:outline-none focus:border-[#756EF3]"
                            >
                              <option value="manager">Manager (Dispatch &amp; Verification)</option>
                              <option value="member">Member (Execution &amp; Audit Logs)</option>
                              <option value="viewer">Viewer (Read-Only Roadmaps)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                              Department
                            </label>
                            <input
                              type="text"
                              value={newEmpDept}
                              onChange={(e) => setNewEmpDept(e.target.value)}
                              placeholder="e.g. Platform Engineering"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] focus:outline-none focus:border-[#756EF3]"
                            />
                          </div>
                        </div>

                        {/* Department Suggestions */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-400 font-mono">Popular:</span>
                          {suggestedChips.slice(0, 5).map((dept) => (
                            <button
                              key={dept}
                              type="button"
                              onClick={() => setNewEmpDept(dept)}
                              className="px-2 py-0.5 rounded-md bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] text-[10px] text-[#556070] dark:text-[#94A3B8] hover:text-[#756EF3] hover:border-[#756EF3] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                            >
                              {dept}
                            </button>
                          ))}
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={handleAddEmployee}
                            disabled={!newEmpEmail.trim()}
                            className="px-3.5 py-1.5 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] disabled:opacity-50 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Team Member</span>
                          </button>
                        </div>
                      </div>

                      {/* Configured Roster List */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#556070] dark:text-[#94A3B8]">
                          <span>Configured Roster ({employees.length} Colleagues)</span>
                        </div>

                        <div className="divide-y divide-[#E9F1FF] dark:divide-[#1E293B] rounded-2xl bg-white dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] overflow-hidden">
                          {employees.map((emp) => (
                            <div key={emp.id} className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] flex items-center justify-center font-bold text-[11px]">
                                  {emp.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-[#002055] dark:text-[#F8FAFC]">{emp.name}</div>
                                  <div className="text-[10px] text-[#556070] dark:text-[#94A3B8]">{emp.email}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-[#556070] dark:text-[#94A3B8]">
                                  {emp.department}
                                </span>
                                <span className="capitalize text-[10px] font-semibold text-[#756EF3] dark:text-[#818CF8]">
                                  {emp.role}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEmployee(emp.id)}
                                  className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                  title="Remove"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#E9F1FF] dark:border-[#1E293B]">
                        <button
                          type="button"
                          onClick={() => changeStep(1, "back")}
                          className="px-4 py-2.5 rounded-xl border border-[#E9F1FF] dark:border-[#1E293B] text-xs font-semibold text-[#556070] dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={handleCreateWorkspace}
                          className="px-6 py-3 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#756EF3]/20 hover:shadow-lg hover:shadow-[#756EF3]/30 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
                        >
                          <span>Generate Keys &amp; Activate Workspace</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Activation & Access Keys */}
                  {step === 3 && createdOrgData && (
                    <div className="p-6 sm:p-8 space-y-6 text-center">
                      <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>

                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#002055] dark:text-[#F8FAFC] tracking-tight">
                          Workspace Activated Successfully
                        </h2>
                        <p className="text-xs sm:text-sm text-[#556070] dark:text-[#94A3B8] mt-1">
                          Your organization <strong className="text-[#002055] dark:text-white font-semibold">{createdOrgData.name}</strong> is live. Distribute this cryptographic join code to your team.
                        </p>
                      </div>

                      {/* Join Code Card with High-Tech Glow */}
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-[#756EF3]/30 dark:border-[#756EF3]/40 max-w-md mx-auto text-center space-y-3 shadow-md shadow-[#756EF3]/10">
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                          CRYPTOGRAPHIC WORKSPACE JOIN CODE
                        </span>
                        <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-[#756EF3] dark:text-[#818CF8]">
                          {createdOrgData.code}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(createdOrgData.code);
                            setLinkCopied(true);
                            setTimeout(() => setLinkCopied(false), 2000);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] text-xs font-semibold text-[#002055] dark:text-[#F8FAFC] hover:border-[#756EF3] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                        >
                          {linkCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Code Copied to Clipboard</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Join Code</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Direct Launch Button */}
                      <div className="pt-4 max-w-md mx-auto">
                        <button
                          type="button"
                          onClick={() => router.push("/")}
                          className="w-full py-3.5 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white font-bold text-sm shadow-md shadow-[#756EF3]/25 hover:shadow-lg hover:shadow-[#756EF3]/35 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Launch Executive Dashboard Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* JOIN EXISTING ORGANIZATION FLOW */}
            {activeTab === "join" && (
              <div className="p-6 sm:p-8 space-y-5 text-left max-w-lg mx-auto">
                <div>
                  <h2 className="text-base font-bold text-[#002055] dark:text-[#F8FAFC] tracking-tight">
                    Join Existing Organization
                  </h2>
                  <p className="text-xs text-[#556070] dark:text-[#94A3B8] mt-0.5">
                    Enter the cryptographic invitation code provided by your organization administrator.
                  </p>
                </div>

                {joinError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs">
                    {joinError}
                  </div>
                )}

                <form onSubmit={handleJoinSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                      Organization Join Code <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        placeholder="e.g. TASK-9481"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs sm:text-sm font-mono tracking-wider uppercase text-[#002055] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#756EF3] focus:ring-2 focus:ring-[#756EF3]/20"
                      />
                    </div>
                  </div>

                  {!user && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                          Your Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={joinName}
                          onChange={(e) => setJoinName(e.target.value)}
                          placeholder="e.g. Sarah Connor"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] focus:outline-none focus:border-[#756EF3]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#556070] dark:text-[#94A3B8] mb-1">
                          Your Work Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={joinEmail}
                          onChange={(e) => setJoinEmail(e.target.value)}
                          placeholder="e.g. sarah@company.com"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] focus:outline-none focus:border-[#756EF3]"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !joinCode.trim()}
                    className="w-full py-3 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#756EF3]/20 hover:shadow-lg hover:shadow-[#756EF3]/30 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer mt-3"
                  >
                    <span>Connect to Organization</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </SpotlightCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto border-t border-[#E9F1FF]/80 dark:border-[#1E293B]/80 bg-white/60 dark:bg-[#0B0F19]/60 backdrop-blur-md py-4 px-6 text-center text-xs text-[#556070] dark:text-[#94A3B8]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} TaskPulse Inc. Enterprise Workload Platform.</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
            Enterprise Setup &bull; SOC 2 Type II Certified
          </span>
        </div>
      </footer>
    </div>
  );
}
