"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import { LogIn, UserCheck, X, Building2, Sparkles, ArrowRight } from "lucide-react";
import { TaskPulseLogo } from "./TaskPulseLogo";

export const GoogleSignInModal: React.FC<{ isOpen: boolean; onClose?: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { signInWithGoogle, signInWithCustomUser, loginDemoUser, isLiveFirebase } = useAuth();
  const { setIsOnboardingOpen } = useOrganization();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and work email.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    signInWithCustomUser(name.trim(), email.trim());
    onClose?.();
  };

  const handleGoogleClick = async () => {
    setError("");
    try {
      const res = await signInWithGoogle();
      if (res.success) {
        onClose?.();
      } else if (res.error && res.error !== "Sign-in popup was closed before completing.") {
        setError(res.error);
      }
    } catch (err: any) {
      setError(err?.message || "Google authentication encountered an error.");
    }
  };

  const handleOpenOnboarding = () => {
    onClose?.();
    setIsOnboardingOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-2xl relative text-[#002055] dark:text-[#F8FAFC] transition-colors">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Branding Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <TaskPulseLogo size="md" />
          <h2 className="text-base font-bold text-[#002055] dark:text-[#F8FAFC] mt-3">
            Sign In to Workspace
          </h2>
          <p className="text-xs text-[#556070] dark:text-[#94A3B8] mt-1">
            Enter your details below to access your projects and workload telemetry.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs">
              {error}
            </div>
          )}

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
              className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#756EF3]"
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
              className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] text-xs text-[#002055] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#756EF3]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-[#756EF3] hover:bg-[#635BFF] text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          >
            Sign In to Workspace
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-[#E9F1FF] dark:border-[#1E293B] w-full" />
          <span className="bg-white dark:bg-[#151C2C] px-3 text-[11px] font-mono uppercase text-[#556070] dark:text-[#94A3B8] absolute">
            Or Continue With
          </span>
        </div>

        {/* Google OAuth Direct Button */}
        <button
          onClick={handleGoogleClick}
          type="button"
          className="w-full py-2.5 px-4 rounded-lg bg-white dark:bg-[#0B0F19] hover:bg-slate-50 dark:hover:bg-slate-800 text-[#002055] dark:text-[#F8FAFC] font-semibold text-xs flex items-center justify-center gap-2.5 border border-[#E9F1FF] dark:border-[#1E293B] hover:border-[#756EF3] transition-all cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Demo Fast Logins */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            type="button"
            onClick={() => {
              loginDemoUser();
              onClose?.();
            }}
            className="p-2 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] hover:border-[#756EF3] text-left transition-all cursor-pointer"
          >
            <div className="text-[11px] font-bold text-[#002055] dark:text-[#F8FAFC]">Sarah Chen</div>
            <div className="text-[10px] text-[#756EF3] font-semibold">Manager Demo</div>
          </button>

          <button
            type="button"
            onClick={() => {
              signInWithCustomUser("Marcus Vance", "marcus.vance@taskpulse.internal");
              onClose?.();
            }}
            className="p-2 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] hover:border-[#756EF3] text-left transition-all cursor-pointer"
          >
            <div className="text-[11px] font-bold text-[#002055] dark:text-[#F8FAFC]">Marcus Vance</div>
            <div className="text-[10px] text-slate-500 font-semibold">Member Demo</div>
          </button>
        </div>

        {/* Footer: Switch to Organization Onboarding */}
        <div className="mt-5 pt-4 border-t border-[#E9F1FF] dark:border-[#1E293B] text-center">
          <p className="text-xs text-[#556070] dark:text-[#94A3B8]">
            Need to set up a new company workspace?
          </p>
          <button
            type="button"
            onClick={handleOpenOnboarding}
            className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8] hover:underline cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Start Organization Onboarding</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleSignInModal;
