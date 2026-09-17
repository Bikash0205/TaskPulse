"use client";

import React, { useState } from "react";
import { useAuth, PERMANENT_ADMIN_EMAIL } from "@/context/AuthContext";
import { ShieldCheck, LogIn, KeyRound, UserCheck, X, AlertCircle, ExternalLink, Sparkles, Crown } from "lucide-react";
import { TaskPulseLogo } from "./TaskPulseLogo";

export const GoogleSignInModal: React.FC<{ isOpen: boolean; onClose?: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { signInWithGoogle, signInWithCustomUser, connectFirebaseConfig, isLiveFirebase } = useAuth();
  const [activeTab, setActiveTab] = useState<"google" | "custom" | "firebase">("google");

  // Custom User fields
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");

  // Firebase Config fields
  const [rawSnippet, setRawSnippet] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [authDomain, setAuthDomain] = useState("");
  const [projectId, setProjectId] = useState("");

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;
    signInWithCustomUser(customName.trim(), customEmail.trim());
    onClose?.();
  };

  const handleSnippetChange = (text: string) => {
    setRawSnippet(text);
    // Auto-extract config fields from JS or JSON snippet
    const extract = (field: string) => {
      const regex = new RegExp(`["']?${field}["']?\\s*:\\s*["']([^"']+)["']`, "i");
      const match = text.match(regex);
      return match ? match[1] : "";
    };

    const parsedKey = extract("apiKey");
    const parsedProject = extract("projectId");
    const parsedDomain = extract("authDomain");

    if (parsedKey) setApiKey(parsedKey);
    if (parsedProject) setProjectId(parsedProject);
    if (parsedDomain) setAuthDomain(parsedDomain);
  };

  const handleFirebaseConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || !projectId.trim()) {
      alert("Please provide at least the Firebase API Key and Project ID.");
      return;
    }
    connectFirebaseConfig({
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      projectId: projectId.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-2xl relative text-slate-900 dark:text-slate-100 transition-colors">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex flex-col items-center text-center mb-6">
          <TaskPulseLogo size="md" />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5">
            Sign in with your Google account to track personal tasks & manage project progress
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 mb-6 border border-[#E9F1FF] dark:border-[#1E293B] text-xs font-semibold">
          <button
            onClick={() => setActiveTab("google")}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "google"
                ? "bg-white dark:bg-slate-800 text-[#756EF3] dark:text-[#818CF8] shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Google Sign In
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "custom"
                ? "bg-white dark:bg-slate-800 text-[#756EF3] dark:text-[#818CF8] shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Custom Account
          </button>
          <button
            onClick={() => setActiveTab("firebase")}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "firebase"
                ? "bg-white dark:bg-slate-800 text-[#756EF3] dark:text-[#818CF8] shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Cloud Config
          </button>
        </div>

        {/* TAB 1: Google OAuth Direct */}
        {activeTab === "google" && (
          <div className="space-y-4">
            {isLiveFirebase ? (
              <>
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-left text-xs">
                  <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Live Firebase Credentials Active</span>
                  </div>
                  <p className="text-emerald-700 dark:text-emerald-400 text-[11px] leading-relaxed">
                    Click the button below to open the official Google OAuth consent window and sign in with your real Google account.
                  </p>
                </div>

                <button
                  onClick={async () => {
                    await signInWithGoogle();
                    onClose?.();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-100 dark:hover:bg-white text-slate-900 font-semibold text-sm flex items-center justify-center gap-3 transition-all border border-slate-300 dark:border-slate-700 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google (Live OAuth Popup)</span>
                </button>
              </>
            ) : (
              <>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-left text-xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-200">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    <span>Real Google Account Sign-In Setup</span>
                  </div>
                  <p className="text-blue-800 dark:text-blue-300 text-[11px] leading-relaxed">
                    To trigger Google&apos;s official OAuth popup (<code>accounts.google.com</code>), connect your free Firebase project credentials in the <strong>Firebase Setup</strong> tab.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    Alternatively, to test your actual Google email and name right now without cloud configuration, use the <strong>Enter Identity</strong> tab.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => setActiveTab("firebase")}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Connect Firebase Setup</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("custom")}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Test Google Identity</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: Custom Google User Profile */}
        {activeTab === "custom" && (
          <form onSubmit={handleCustomSubmit} className="space-y-3.5 text-left">
            {/* Quick Super Admin Button */}
            <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-900 dark:text-purple-200 text-xs flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  Permanent Super Admin Fast-Track
                </span>
                <span className="text-[10px] font-mono bg-purple-200 dark:bg-purple-900/80 text-purple-800 dark:text-purple-300 px-1.5 py-0.5 rounded">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-purple-700 dark:text-purple-300">
                Log in as <strong>{PERMANENT_ADMIN_EMAIL}</strong> to manage company projects, dispatch tasks, and assign roles for all team members.
              </p>
              <button
                type="button"
                data-testid="signin-permanent-admin-btn"
                onClick={() => {
                  signInWithCustomUser("Zevon Cash", PERMANENT_ADMIN_EMAIL);
                  onClose?.();
                }}
                className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>Sign in as {PERMANENT_ADMIN_EMAIL}</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              Or enter any custom teammate name and Google email address:
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Your Real Google Email Address
              </label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="e.g. alex.johnson@gmail.com"
                className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              Sign in with this Profile
            </button>
          </form>
        )}

        {/* TAB 3: Connect Live Firebase Keys */}
        {activeTab === "firebase" && (
          <form onSubmit={handleFirebaseConfigSubmit} className="space-y-3 text-left">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Connect Live Firebase Project:
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Paste your Web App config snippet from <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-blue-500 underline">Firebase Console</a> (Project Settings &rarr; Your apps &rarr; Web app).
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                Paste Full Firebase Config Snippet (Auto-populates fields)
              </label>
              <textarea
                rows={3}
                value={rawSnippet}
                onChange={(e) => handleSnippetChange(e.target.value)}
                placeholder={'const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  projectId: "my-project-id",\n  authDomain: "my-project.firebaseapp.com"\n};'}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-mono text-slate-600 dark:text-slate-400 mb-0.5">
                  apiKey *
                </label>
                <input
                  type="text"
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-600 dark:text-slate-400 mb-0.5">
                  projectId *
                </label>
                <input
                  type="text"
                  required
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="my-project-id"
                  className="w-full px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-600 dark:text-slate-400 mb-0.5">
                authDomain (Optional)
              </label>
              <input
                type="text"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                placeholder="my-project-id.firebaseapp.com"
                className="w-full px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              Save & Activate Live Google OAuth
            </button>
          </form>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="mt-5 w-full text-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default GoogleSignInModal;
