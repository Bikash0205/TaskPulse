"use client";

import React from "react";
import { UserRole, ColleagueProfile } from "@shared/types";
import { ShieldCheck, ShieldAlert, User, Check, Key } from "lucide-react";

interface RoleSwitcherProps {
  currentRole: UserRole;
  currentUser: ColleagueProfile;
  availableUsers: ColleagueProfile[];
  onSelectUser: (user: ColleagueProfile) => void;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  currentUser,
  availableUsers,
  onSelectUser,
  onRoleChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-xs">
      <div className="flex items-center gap-1.5 font-mono text-slate-400">
        <Key className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-semibold text-slate-200">Firebase RBAC:</span>
      </div>

      {/* Role Badges */}
      <div className="flex items-center gap-1 bg-slate-950/70 p-0.5 rounded-lg border border-white/5">
        {(["admin", "manager", "member", "viewer"] as UserRole[]).map((role) => (
          <button
            key={role}
            onClick={() => onRoleChange(role)}
            className={`px-2.5 py-1 rounded-md capitalize font-medium flex items-center gap-1 transition-colors ${
              currentRole === role
                ? role === "admin"
                  ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                  : role === "manager"
                  ? "bg-[#756EF3]/30 text-[#818CF8] border border-[#756EF3]/40"
                  : role === "viewer"
                  ? "bg-slate-700/40 text-slate-300 border border-slate-600/40"
                  : "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {currentRole === role && <Check className="w-3 h-3" />}
            {role}
          </button>
        ))}
      </div>

      {/* User Simulation Selector */}
      <div className="flex items-center gap-2 pl-2 border-l border-white/10">
        <span className="text-slate-400 font-mono">Simulating User:</span>
        <select
          value={currentUser.id}
          onChange={(e) => {
            const found = availableUsers.find((u) => u.id === e.target.value);
            if (found) onSelectUser(found);
          }}
          className="bg-slate-800 text-slate-200 border border-white/10 rounded-md px-2 py-1 text-xs outline-none focus:border-blue-500 cursor-pointer font-medium"
        >
          {availableUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.department} - {u.role})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RoleSwitcher;
