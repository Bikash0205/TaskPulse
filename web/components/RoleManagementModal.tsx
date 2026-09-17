"use client";

import React, { useState, useEffect } from "react";
import { useAuth, PERMANENT_ADMIN_EMAIL } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import { UserRole, Department, Project } from "@shared/types";
import { mockColleagues, mockProjects } from "@shared/mockData";
import {
  ShieldCheck,
  Crown,
  Users,
  X,
  Check,
  UserPlus,
  Lock,
  Sparkles,
  Building2,
  Copy,
  FolderGit2,
  Briefcase,
} from "lucide-react";

interface RoleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects?: Project[];
}

interface ManagedMember {
  email: string;
  name: string;
  department?: string;
  avatarUrl?: string;
  assignedProjectNames?: string[];
  status?: "active" | "pending";
}

export const RoleManagementModal: React.FC<RoleManagementModalProps> = ({
  isOpen,
  onClose,
  projects: propProjects,
}) => {
  const { user, teamRoles, assignUserRole } = useAuth();
  const { currentOrg, invites, inviteTeammate } = useOrganization();

  // State for new teammate email assignment
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("member");
  const [newDept, setNewDept] = useState<Department>("Engineering");
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Available projects list (props or saved custom projects or mock projects)
  const [availableProjects, setAvailableProjects] = useState<Project[]>(mockProjects);

  useEffect(() => {
    if (propProjects && propProjects.length > 0) {
      setAvailableProjects(propProjects);
      if (selectedProjectIds.length === 0 && propProjects[0]) {
        setSelectedProjectIds([propProjects[0].id]);
      }
    } else if (typeof window !== "undefined") {
      const saved = localStorage.getItem("taskpulse_custom_projects");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAvailableProjects([...parsed, ...mockProjects.filter(m => !parsed.some((p: Project) => p.id === m.id))]);
            if (selectedProjectIds.length === 0 && parsed[0]) {
              setSelectedProjectIds([parsed[0].id]);
            }
          }
        } catch (e) {}
      }
    }
  }, [propProjects, isOpen]);

  if (!isOpen) return null;

  // Toggle project assignment checkbox
  const toggleProjectSelection = (projId: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(projId) ? prev.filter((id) => id !== projId) : [...prev, projId]
    );
  };

  // Build full list of members: known mockColleagues + invites + teamRoles
  const baseMembers: ManagedMember[] = [
    {
      email: PERMANENT_ADMIN_EMAIL,
      name: "Bikash Kumar Yadav (Super Admin)",
      department: "Executive & Engineering",
      avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocJ02GC3NU0YwmcOo4pea0jeD3b47N67gelmy-9WXqa6oOEeGOVibg=s96-c",
      assignedProjectNames: ["All Workstreams & Projects"],
      status: "active",
    },
    ...mockColleagues.map((c) => {
      const email = `${c.name.toLowerCase().replace(" ", ".")}@taskpulse.internal`;
      const inv = invites.find((i) => i.email.toLowerCase() === email);
      const projNames = inv?.assignedProjectIds.map(
        (pid) => availableProjects.find((p) => p.id === pid)?.name || pid
      ) || ["Website Building"];

      return {
        email,
        name: c.name,
        department: c.department,
        avatarUrl: c.avatarUrl,
        assignedProjectNames: projNames,
        status: "active" as const,
      };
    }),
  ];

  // Include custom invites not already present
  const allKnownEmails = new Set(baseMembers.map((m) => m.email.toLowerCase()));
  invites.forEach((inv) => {
    const normalized = inv.email.toLowerCase();
    if (!allKnownEmails.has(normalized)) {
      const projNames = inv.assignedProjectIds.map(
        (pid) => availableProjects.find((p) => p.id === pid)?.name || pid
      );
      baseMembers.push({
        email: normalized,
        name: inv.name || normalized.split("@")[0].replace(".", " "),
        department: inv.department,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          inv.name || normalized.split("@")[0]
        )}&background=3B82F6&color=fff`,
        assignedProjectNames: projNames.length > 0 ? projNames : ["General"],
        status: inv.status === "accepted" ? "active" : "pending",
      });
      allKnownEmails.add(normalized);
    }
  });

  const handleRoleChange = (email: string, role: UserRole) => {
    const success = assignUserRole(email, role);
    if (success) {
      setFeedback(`Successfully updated ${email} role to ${role.toUpperCase()}`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const email = newEmail.trim().toLowerCase();
    const name = newName.trim() || email.split("@")[0].replace(".", " ");

    inviteTeammate(email, name, newRole, newDept, selectedProjectIds);

    const assignedNames = selectedProjectIds.map(
      (pid) => availableProjects.find((p) => p.id === pid)?.name || pid
    );

    setFeedback(
      `Invited ${email} as ${newRole.toUpperCase()} assigned to: ${assignedNames.join(", ") || "General"}`
    );
    setNewEmail("");
    setNewName("");
    setTimeout(() => setFeedback(null), 4000);
  };

  const copyInviteCode = () => {
    if (currentOrg?.inviteCode) {
      navigator.clipboard.writeText(currentOrg.inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const isAdmin = user?.role === "admin" || user?.isPermanentAdmin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-2xl relative text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Team Members & Project Assignments
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                  {currentOrg?.name || "TaskPulse Core"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Invite teammates with specific IDs and assign them directly to projects.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Organization Info & Quick Invite Code */}
        {currentOrg && (
          <div className="px-5 py-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300">
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Org Invite Code:</span>
              <span className="font-mono font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                {currentOrg.inviteCode}
              </span>
            </div>
            <button
              onClick={copyInviteCode}
              className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>
        )}

        {/* Feedback Alert */}
        {feedback && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Admin Invite Form */}
          {isAdmin ? (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                <UserPlus className="w-4 h-4 text-purple-500" />
                <span>Invite Teammate with Project Assignment</span>
              </div>

              <form onSubmit={handleAddNewMember} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <input
                    type="email"
                    required
                    placeholder="Teammate Email (e.g. dev@company.com)"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Full Name (optional)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Role Privilege
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as UserRole)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    >
                      <option value="member">Member (Task Worker)</option>
                      <option value="manager">Manager (Project Reviewer)</option>
                      <option value="admin">Admin (Company Admin)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Department (Custom)
                    </label>
                    <input
                      type="text"
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      placeholder="e.g. Engineering, Platform, Product..."
                      list="role-dept-options"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                    <datalist id="role-dept-options">
                      <option value="Engineering" />
                      <option value="Product" />
                      <option value="Design" />
                      <option value="Marketing" />
                      <option value="Operations" />
                      <option value="Security" />
                    </datalist>
                  </div>
                </div>

                {/* Assigned Projects Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Assign to Projects (User will directly jump to selected projects on login):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-28 overflow-y-auto">
                    {availableProjects.map((proj) => {
                      const isSelected = selectedProjectIds.includes(proj.id);
                      return (
                        <div
                          key={proj.id}
                          onClick={() => toggleProjectSelection(proj.id)}
                          className={`flex items-center gap-1.5 p-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 pointer-events-none"
                          />
                          <span className="truncate text-[11px]">{proj.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Send Invite & Assign Projects</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 text-xs flex items-center gap-2.5">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Only Company Administrators can invite teammates and modify project assignments.</span>
            </div>
          )}

          {/* Members & Assigned Projects Roster */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Team Members ({baseMembers.length})</span>
            </h4>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/30">
              {baseMembers.map((member) => {
                const isPerm = member.email.toLowerCase() === PERMANENT_ADMIN_EMAIL.toLowerCase();
                const currentMemberRole = isPerm ? "admin" : teamRoles[member.email.toLowerCase()] || "member";

                return (
                  <div
                    key={member.email}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {member.name}
                          </span>
                          {isPerm && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                              SUPER ADMIN
                            </span>
                          )}
                          {member.status === "pending" && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              INVITE PENDING
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                          {member.email}
                        </div>
                        {member.assignedProjectNames && member.assignedProjectNames.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {member.assignedProjectNames.map((pname, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-[10px] font-medium text-indigo-700 dark:text-indigo-300"
                              >
                                {pname}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Role Dropdown */}
                    <div className="shrink-0">
                      {isPerm ? (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span>Admin</span>
                        </span>
                      ) : isAdmin ? (
                        <select
                          value={currentMemberRole}
                          onChange={(e) => handleRoleChange(member.email, e.target.value as UserRole)}
                          className="px-2 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        >
                          <option value="member">Member</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                          {currentMemberRole}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
          <span>Enterprise Access Protocol: Role updates apply across cloud & mobile.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleManagementModal;
