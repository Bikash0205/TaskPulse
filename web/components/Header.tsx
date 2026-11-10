"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { TaskPulseLogo } from "./TaskPulseLogo";
import { useAuth, PERMANENT_ADMIN_EMAIL } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useOrganization } from "@/context/OrganizationContext";
import { Project } from "@shared/types";
import {
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Crown,
  Users,
  Building2,
  CreditCard,
  Shield,
} from "lucide-react";
import GoogleSignInModal from "./GoogleSignInModal";
import RoleManagementModal from "./RoleManagementModal";
import { OrganizationOnboardingModal } from "./OrganizationOnboardingModal";
import { TaskPulseLiteModal } from "./TaskPulseLiteModal";
import { AdminSubscriptionModal } from "./AdminSubscriptionModal";
import { UserSubscriptionModal } from "./UserSubscriptionModal";

interface HeaderProps {
  projects?: Project[];
}

export const Header: React.FC<HeaderProps> = ({ projects }) => {
  const { user, signOutUser, signInWithGoogle } = useAuth();
  const { currentOrg } = useOrganization();
  const { theme, toggleTheme } = useTheme();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isRoleManagementOpen, setIsRoleManagementOpen] = useState(false);
  const [isLiteModalOpen, setIsLiteModalOpen] = useState(false);
  const [isAdminSubModalOpen, setIsAdminSubModalOpen] = useState(false);
  const [isUserSubModalOpen, setIsUserSubModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleGoogleDirectSignIn = async () => {
    try {
      const res = await signInWithGoogle();
      if (res.success && res.needsOnboarding) {
        window.location.href = "/onboarding?google=1";
        return;
      }
      if (!res.success && res.error && res.error !== "Sign-in popup was closed before completing.") {
        setIsLoginModalOpen(true);
      }
    } catch {
      setIsLoginModalOpen(true);
    }
  };

  const isPermanentAdmin =
    user?.email?.toLowerCase().trim() === PERMANENT_ADMIN_EMAIL.toLowerCase();
  const isAdmin = user?.role === "admin" || isPermanentAdmin;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#DDD8CE] dark:border-[#1E293B] bg-[#FAF8F4]/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 transition-colors duration-200">
        {/* Left: Brand Identity & Active Organization */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <TaskPulseLogo size="md" />
          {currentOrg && (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#DDD8CE] dark:border-[#1E293B] min-w-0">
              <span className="px-2.5 py-1 rounded-lg bg-[#EAE8F8] dark:bg-[#756EF3]/15 border border-[#D4D0F0] dark:border-[#756EF3]/30 text-xs font-semibold text-[#5D55D6] dark:text-[#818CF8] flex items-center gap-1.5 truncate max-w-[220px]">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{currentOrg.name}</span>
              </span>
            </div>
          )}
        </div>

        {/* Right: Cleanly Grouped Account Controls & Far-Right Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {!user && (
            <button
              onClick={handleGoogleDirectSignIn}
              data-testid="google-signin-btn"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F4F2ED] dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-[#1E293B] hover:border-[#5D55D6] text-xs font-semibold text-[#1E222D] dark:text-[#F8FAFC] transition-all cursor-pointer"
              aria-label="Sign in with Google"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}

          {user && (
            <div className="relative flex items-center gap-2" ref={menuRef}>
              {/* Account Avatar & Workspace Management Dropdown */}
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                data-testid="header-user-info"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#F4F2ED] dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-[#1E293B] hover:border-[#5D55D6]/60 transition-colors cursor-pointer"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className={`w-6 h-6 rounded-full object-cover border ${
                      isPermanentAdmin ? "border-[#5D55D6]" : "border-[#CFC9BD] dark:border-slate-700"
                    }`}
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#EAE8F8] dark:bg-slate-800 text-[#5D55D6] dark:text-white border border-[#D4D0F0] dark:border-slate-700 flex items-center justify-center text-[11px] font-bold">
                    {(user.displayName || "User").slice(0, 1).toUpperCase()}
                  </div>
                )}

                <div className="hidden md:flex flex-col text-left leading-tight">
                  <div className="flex items-center gap-1">
                    <span
                      className="text-xs font-semibold text-[#1E222D] dark:text-slate-200 max-w-[140px] truncate"
                      data-testid="header-user-name"
                    >
                      {user.displayName || "Colleague"}
                    </span>
                    {isAdmin && (
                      <Crown className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-[#6E7485] dark:text-slate-400 max-w-[160px] truncate">
                    {user.email || user.department}
                  </span>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-[#6E7485] dark:text-slate-400" />
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#FAF8F4] dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-[#1E293B] shadow-xl p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-[#E5E0D6] dark:border-[#1E293B] mb-1.5">
                    <div className="font-bold text-[#1E222D] dark:text-white truncate">
                      {user.displayName || "Workspace Account"}
                    </div>
                    <div className="text-[11px] text-[#6E7485] dark:text-slate-400 truncate">
                      {user.email}
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      type="button"
                      data-testid="manage-roles-btn"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        setIsRoleManagementOpen(true);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-[#1E222D] dark:text-slate-200 hover:bg-[#EDEAE2] dark:hover:bg-slate-800 font-medium cursor-pointer transition-colors"
                    >
                      <Users className="w-4 h-4 text-[#5D55D6]" />
                      <span>Manage Team &amp; Roles</span>
                    </button>
                  )}

                  <button
                    type="button"
                    data-testid="admin-subscriptions-btn"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      if (isAdmin) {
                        setIsAdminSubModalOpen(true);
                      } else {
                        setIsUserSubModalOpen(true);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-[#1E222D] dark:text-slate-200 hover:bg-[#EDEAE2] dark:hover:bg-slate-800 font-medium cursor-pointer transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-[#5D55D6]" />
                    <span>Workspace Billing &amp; Plan</span>
                  </button>

                  <Link
                    href="/privacy"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-[#1E222D] dark:text-slate-200 hover:bg-[#EDEAE2] dark:hover:bg-slate-800 font-medium transition-colors"
                  >
                    <Shield className="w-4 h-4 text-[#0F8C65]" />
                    <span>Privacy &amp; Data Policy</span>
                  </Link>

                  <div className="my-1 border-t border-[#E5E0D6] dark:border-[#1E293B]" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      signOutUser();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}

              {/* Quick Sign Out Button */}
              <button
                onClick={signOutUser}
                data-testid="sign-out-btn"
                title="Sign Out"
                aria-label="Sign Out"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-red-700 dark:text-red-400 bg-red-50/80 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200/80 dark:border-red-800/60 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}

          {/* Far-Right Edge: Light / Dark Theme Toggle */}
          <button
            onClick={toggleTheme}
            data-testid="fluid-theme-toggle"
            title={theme === "dark" ? "Switch to Soft Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl border border-[#DDD8CE] dark:border-[#1E293B] bg-[#F4F2ED] dark:bg-[#151C2C] hover:bg-[#EAE6DC] dark:hover:bg-slate-800 text-[#1E222D] dark:text-[#F8FAFC] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#5D55D6]" />
            )}
          </button>
        </div>
      </header>

      <GoogleSignInModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <RoleManagementModal
        isOpen={isRoleManagementOpen}
        onClose={() => setIsRoleManagementOpen(false)}
        projects={projects}
      />

      <OrganizationOnboardingModal />

      <TaskPulseLiteModal
        isOpen={isLiteModalOpen}
        onClose={() => setIsLiteModalOpen(false)}
      />

      <AdminSubscriptionModal
        isOpen={isAdminSubModalOpen}
        onClose={() => setIsAdminSubModalOpen(false)}
        currentUserEmail={user?.email}
      />

      <UserSubscriptionModal
        isOpen={isUserSubModalOpen}
        onClose={() => setIsUserSubModalOpen(false)}
        userEmail={user?.email}
      />
    </>
  );
};
