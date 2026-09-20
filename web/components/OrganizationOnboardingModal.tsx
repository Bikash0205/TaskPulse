"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import { Department, UserRole } from "@shared/types";
import {
  Building2,
  KeyRound,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  LogOut,
  HelpCircle,
  Briefcase,
  Layers,
  Copy,
  Mail,
  Users,
  Trash2,
  ExternalLink,
  Shield,
  Laptop,
  Eye,
  X,
  Plus,
} from "lucide-react";

interface EmployeeEntry {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
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

export const OrganizationOnboardingModal: React.FC = () => {
  const { user, signOutUser, signInWithCustomUser } = useAuth();
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    onboardCompany,
    joinWithCode,
    inviteTeammate,
  } = useOrganization();

  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Admin & Organization Profile (Basic Company Information Only - No department)
  const [adminName, setAdminName] = useState(user?.displayName || "Alex Vance");
  const [adminEmail, setAdminEmail] = useState(user?.email || "");
  const [companyName, setCompanyName] = useState("");
  const [teamSize, setTeamSize] = useState("11-50");
  const [slug, setSlug] = useState("");

  // Step 2: Employee Roles & Custom Departments
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
      department: "Product Design",
    },
    {
      id: "e3",
      name: "David Kim",
      email: "david@company.com",
      role: "viewer",
      department: "Customer Operations",
    },
  ]);

  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpEmail, setNewEmpEmail] = useState("");
  const [newEmpRole, setNewEmpRole] = useState<UserRole>("member");
  // Department name can be custom, and it's NOT preselected
  const [newEmpDept, setNewEmpDept] = useState<string>("");

  // Step 3: Link copy feedback
  const [linkCopied, setLinkCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Join Form
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);

  // Dynamic suggestions combining existing departments + standard suggestions
  const suggestedChips = useMemo(() => {
    const existing = employees.map((e) => e.department.trim()).filter(Boolean);
    return Array.from(new Set([...existing, ...DEFAULT_POPULAR_DEPTS]));
  }, [employees]);

  if (!isOnboardingOpen) return null;

  const handleAddEmployee = () => {
    if (!newEmpEmail.trim()) return;
    const resolvedDept = newEmpDept.trim() || "Operations";
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
    // Reset back to unselected/blank so the next user can type or choose their custom department
    setNewEmpDept("");
  };

  const handleLaunchWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setIsSubmitting(true);
    if (!user) {
      signInWithCustomUser(
        adminName.trim() || "Administrator",
        adminEmail.trim() || "admin@company.com"
      );
    }

    // Extract all unique custom departments entered for employees
    const customDepts = Array.from(
      new Set(employees.map((emp) => emp.department.trim()).filter(Boolean))
    );
    if (customDepts.length === 0) {
      customDepts.push("Operations", "Platform", "Product");
    }

    try {
      const { org, initialProject: proj } = await onboardCompany(
        companyName.trim(),
        customDepts,
        `${companyName.trim()} Core Roadmap`
      );

      // Register all invited teammates
      for (const emp of employees) {
        await inviteTeammate(emp.email, emp.name, emp.role, emp.department, [proj.id]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;

    setJoinError(null);
    setIsSubmitting(true);
    try {
      const result = await joinWithCode(inviteCodeInput.trim());
      if (!result.success) {
        setJoinError(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatedSlug =
    slug || companyName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "acme-workspace";

  // Compute unique departments for summary
  const configuredDepartments = Array.from(
    new Set(employees.map((e) => e.department.trim()).filter(Boolean))
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          className="relative w-full max-w-xl bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100"
        >
          {/* Header Banner with Gradient */}
          <div className="p-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#756EF3] text-white flex items-center justify-center shadow-md shadow-[#756EF3]/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                {user && (
                  <button
                    onClick={() => signOutUser()}
                    title="Sign out and try another email"
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Switch Account</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOnboardingOpen(false)}
                  data-testid="onboarding-close-btn"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Organization Onboarding
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {user ? (
                  <>
                    Logged in as <span className="font-semibold text-[#756EF3] dark:text-[#818CF8]">{user.email}</span>. Setup your company and add your team roles.
                  </>
                ) : (
                  <>Setup your company workspace, configure department teams, and invite members.</>
                )}
              </p>
            </div>

            {/* Mode Tabs */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900/80 p-1 mt-4 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("create");
                  setStep(1);
                }}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "create"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>3-Step Organization Setup</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("join")}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "join"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Join with Code</span>
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar (for Create Flow) */}
          {activeTab === "create" && (
            <div className="px-6 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    step >= 1
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  1
                </span>
                <span
                  className={`font-semibold ${
                    step === 1 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"
                  }`}
                >
                  Company Profile
                </span>
                <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-800" />
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    step >= 2
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  2
                </span>
                <span
                  className={`font-semibold ${
                    step === 2 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"
                  }`}
                >
                  Team & Departments
                </span>
                <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-800" />
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    step >= 3
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  3
                </span>
                <span
                  className={`font-semibold ${
                    step === 3 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"
                  }`}
                >
                  Invitations
                </span>
              </div>
              <span className="text-slate-400 font-mono">Step {step}/3</span>
            </div>
          )}

          {/* Form Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === "create" ? (
              <div>
                {/* STEP 1: BASIC COMPANY INFORMATION ONLY (NO PRESELECTED OR FIXED DEPARTMENT) */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Company / Organization Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => {
                          setCompanyName(e.target.value);
                          if (!slug) {
                            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                          }
                        }}
                        placeholder="e.g. Acme Corporation, Stripe, Vercel"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Admin Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="e.g. Alex Vance"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      />
                    </div>

                    {!user && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Admin Work Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          placeholder="e.g. alex.vance@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Workspace Domain
                      </label>
                      <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 px-3 bg-slate-50 dark:bg-slate-900">
                        <span className="text-xs text-slate-400 font-mono">taskpulse.io/</span>
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) =>
                            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"))
                          }
                          placeholder="company-slug"
                          className="flex-1 py-2 text-xs bg-transparent outline-none font-mono text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Organization Size
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {["1-10", "11-50", "50-250", "250+"].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setTeamSize(sz)}
                            className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              teamSize === sz
                                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold"
                                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Enterprise Guidance Note */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          Next step:
                        </span>{" "}
                        You will add team members under their custom departments with tailored role permissions.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!companyName.trim()}
                      onClick={() => setStep(2)}
                      className="w-full mt-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                    >
                      <span>Proceed to Team & Departments</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* STEP 2: ADD USERS UNDER CUSTOM DEPARTMENTS (NOT PRESELECTED) */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Add Members Under Custom Departments
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Each user is added under their department. Department names are fully customizable to match your team structure.
                      </p>
                    </div>

                    {/* Role Picker */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Access Role
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewEmpRole("manager")}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            newEmpRole === "manager"
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300"
                              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold text-xs">
                            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Manager</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">Review & approve</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setNewEmpRole("member")}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            newEmpRole === "member"
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-300"
                              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold text-xs">
                            <Laptop className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Member</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">Work & submit</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setNewEmpRole("viewer")}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            newEmpRole === "viewer"
                              ? "border-sky-500 bg-sky-50 dark:bg-sky-950/30 text-sky-900 dark:text-sky-300"
                              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold text-xs">
                            <Eye className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                            <span>Viewer</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">Read-only</p>
                        </button>
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Colleague Name
                        </label>
                        <input
                          type="text"
                          value={newEmpName}
                          onChange={(e) => setNewEmpName(e.target.value)}
                          placeholder="e.g. Marcus Vance"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Work Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={newEmpEmail}
                          onChange={(e) => setNewEmpEmail(e.target.value)}
                          placeholder="e.g. marcus@company.com"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Custom Department Name (NOT PRESELECTED) */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Department Name (Custom) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newEmpDept}
                        onChange={(e) => setNewEmpDept(e.target.value)}
                        placeholder="Type any custom department (e.g. Infrastructure, Brand, Success, AI Ops)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-indigo-500"
                      />

                      {/* Quick Department Suggestion Chips */}
                      <div className="mt-2">
                        <span className="text-[10px] text-slate-400 font-medium">Quick suggestions:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {suggestedChips.map((deptChip) => (
                            <button
                              key={deptChip}
                              type="button"
                              onClick={() => setNewEmpDept(deptChip)}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-colors cursor-pointer ${
                                newEmpDept === deptChip
                                  ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold"
                                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                              }`}
                            >
                              + {deptChip}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!newEmpEmail.trim()}
                      onClick={handleAddEmployee}
                      className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Member to Department</span>
                    </button>

                    {/* Configured Roster */}
                    <div className="space-y-1.5 mt-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-500">
                          Configured Members ({employees.length})
                        </p>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {configuredDepartments.length} unique department{configuredDepartments.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                        {employees.map((emp) => (
                          <div
                            key={emp.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                  {emp.name}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                    emp.role === "manager"
                                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                                      : emp.role === "member"
                                      ? "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                                      : "bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300"
                                  }`}
                                >
                                  {emp.role}
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
                                  {emp.department}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                                {emp.email}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setEmployees((prev) => prev.filter((e) => e.id !== emp.id))
                              }
                              className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer shrink-0"
                              title="Remove member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                      >
                        <span>Proceed to Invitations</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: DISPATCHED INVITATION EMAIL & SHAREABLE LINK */}
                {step === 3 && (
                  <form onSubmit={handleLaunchWorkspace} className="space-y-4">
                    {/* Dispatched Email Preview */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        <Mail className="w-4 h-4" />
                        <span>Dispatched Email Invitation Preview</span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <p className="text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            From:
                          </span>{" "}
                          TaskPulse &lt;invites@taskpulse.io&gt;
                        </p>
                        <p className="text-slate-900 dark:text-white font-semibold">
                          Subject: {adminName} has invited you to join {companyName} on TaskPulse
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                        <p>
                          Hi there, {adminName} invited you to collaborate in the{" "}
                          <strong>{companyName}</strong> workspace. Your role permissions and department access are pre-configured.
                        </p>
                        <div className="py-1">
                          <p className="text-[10px] uppercase font-bold text-slate-400">
                            Invited Team Members ({employees.length}) across {configuredDepartments.length} Departments:
                          </p>
                          <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 mt-1 space-y-0.5">
                            {employees.map((e) => (
                              <li key={e.id}>
                                {e.name} ({e.email}) - <strong className="uppercase">{e.role}</strong> under <em>{e.department}</em>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2">
                          <div className="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-sm">
                            Accept Invitation & Open Workspace
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shareable Link Box */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Shareable Join Link (Direct Access)
                      </label>
                      <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 px-3 bg-slate-50 dark:bg-slate-900">
                        <span className="flex-1 py-2.5 text-xs font-mono text-slate-700 dark:text-slate-300 truncate">
                          https://taskpulse.io/join/{generatedSlug}?token=tk_invite_98a7
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `https://taskpulse.io/join/${generatedSlug}?token=tk_invite_98a7`
                            );
                            setLinkCopied(true);
                            setTimeout(() => setLinkCopied(false), 2500);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          {linkCopied ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{linkCopied ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        Back to Roles
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                      >
                        <span>Launch Organization Workspace</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* JOIN WITH CODE TAB */
              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Invite Code or Organization ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteCodeInput}
                    onChange={(e) => setInviteCodeInput(e.target.value)}
                    placeholder="e.g. TASK-CORE-2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                  {joinError && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">{joinError}</p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Contact your company administrator or manager for the invite code. If you were invited by email, your login should have automatically matched your assigned project.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !inviteCodeInput.trim()}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Connect to Organization</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
