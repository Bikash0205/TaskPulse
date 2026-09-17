"use client";

import React, { useState } from "react";
import { TaskPulseLogo } from "./TaskPulseLogo";
import { useAuth, PERMANENT_ADMIN_EMAIL } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useOrganization } from "@/context/OrganizationContext";
import { UserRole, Project } from "@shared/types";
import {
  LogOut,
  LogIn,
  Check,
  ChevronDown,
  Sun,
  Moon,
  Crown,
  Shield,
  Users,
  Building2,
} from "lucide-react";
import GoogleSignInModal from "./GoogleSignInModal";
import RoleManagementModal from "./RoleManagementModal";
import { OrganizationOnboardingModal } from "./OrganizationOnboardingModal";

interface HeaderProps {
  projects?: Project[];
}

export const Header: React.FC<HeaderProps> = ({ projects }) => {
  const { user, isLiveFirebase, signOutUser, switchRole, loginDemoUser } = useAuth();
  const { currentOrg, setIsOnboardingOpen } = useOrganization();
  const { theme, toggleTheme } = useTheme();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isRoleManagementOpen, setIsRoleManagementOpen] = useState(false);

  const roles: UserRole[] = ["admin", "manager", "member"];

  const isPermanentAdmin = user?.email?.toLowerCase().trim() === PERMANENT_ADMIN_EMAIL.toLowerCase();
  const isAdmin = user?.role === "admin" || isPermanentAdmin;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E9F1FF] dark:border-[#1E293B] bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl px-6 py-3 flex items-center justify-between gap-4 transition-colors duration-200">
        {/* Left: Brand Identity & Active Organization */}
        <div className="flex items-center gap-3">
          <TaskPulseLogo size="md" />
          {currentOrg && (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#E9F1FF] dark:border-[#1E293B]">
              <span className="px-2.5 py-1 rounded-lg bg-[#F0EFFF] dark:bg-[#756EF3]/15 border border-[#756EF3]/30 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8] flex items-center gap-1.5 shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-[#756EF3]" />
                <span>{currentOrg.name}</span>
              </span>
            </div>
          )}
        </div>

        {/* Right: User & Role Controls & Theme Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Prominent Sign in with Google button */}
          {(!user || user.email?.endsWith("@taskpulse.internal")) && (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              data-testid="google-signin-btn"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] hover:border-[#756EF3] shadow-sm text-xs font-medium text-[#002055] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="Sign in with Google"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}

          {/* Light / Dark Mode Toggle Button */}
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

          {user ? (
            <>
              {/* If user is Admin, show Manage Roles Button */}
              {isAdmin && (
                <button
                  onClick={() => setIsRoleManagementOpen(true)}
                  data-testid="manage-roles-btn"
                  title="Workspace Role Management: Manage team roles and project access"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F0EFFF] dark:bg-[#756EF3]/15 hover:bg-[#E2E0FD] dark:hover:bg-[#756EF3]/25 border border-[#756EF3]/30 text-[#756EF3] dark:text-[#818CF8] text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Manage Roles</span>
                </button>
              )}

              {/* Role Display or Switcher */}
              {isPermanentAdmin ? (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0EFFF] dark:bg-[#756EF3]/15 border border-[#756EF3]/30 text-xs font-bold text-[#756EF3] dark:text-[#818CF8] shadow-sm"
                  title="Primary Workspace Administrator"
                  data-testid="permanent-admin-pill"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Primary Admin</span>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                    data-testid="role-switcher-btn"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <span className="text-slate-500 dark:text-slate-400">Role:</span>
                    <span
                      className={`font-semibold capitalize ${
                        user.role === "admin"
                          ? "text-purple-600 dark:text-purple-400"
                          : user.role === "manager"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {user.role}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                  </button>

                  {isRoleMenuOpen && (
                    <div className="absolute right-0 mt-1 w-36 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 text-xs">
                      {roles.map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setIsRoleMenuOpen(false);
                          }}
                          className="w-full px-3 py-1.5 text-left capitalize flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                        >
                          <span>{r}</span>
                          {user.role === r && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* User Profile Avatar & Name */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className={`w-7 h-7 rounded-full object-cover border ${
                      isPermanentAdmin ? "border-purple-500 ring-1 ring-purple-400" : "border-slate-300 dark:border-slate-700"
                    }`}
                  />
                ) : (
                  <div className={`w-7 h-7 rounded-full ${isPermanentAdmin ? "bg-purple-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white"} border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-semibold`}>
                    {(user.displayName || "User").slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="hidden md:flex flex-col text-left" data-testid="header-user-info">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight" data-testid="header-user-name">
                      {user.displayName || "Colleague"}
                    </span>
                    {isPermanentAdmin && (
                      <span title="Permanent Super Admin">
                        <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                    {user.email || user.department}
                  </span>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={signOutUser}
                  data-testid="sign-out-btn"
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800/60 transition-colors ml-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={loginDemoUser}
                data-testid="demo-login-btn"
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                title="Use demo manager account"
              >
                Demo Login
              </button>
            </div>
          )}
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
    </>
  );
};

export default Header;
