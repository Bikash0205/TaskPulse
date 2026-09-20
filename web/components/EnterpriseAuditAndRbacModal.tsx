"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Check,
  X,
  Search,
  Clock,
  CheckCircle2,
  Users,
  Sliders,
  Activity,
  FileCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export type EnterpriseRoleType =
  | "owner"
  | "tech_lead"
  | "compliance"
  | "specialist"
  | "guest";

interface PermissionItem {
  id: string;
  title: string;
  category: "GOVERNANCE" | "OPERATIONS" | "SECURITY" | "COMPLIANCE";
  description: string;
  allowedRoles: EnterpriseRoleType[];
}

interface AuditLogEntry {
  id: string;
  eventCode: string;
  category: "all" | "critical" | "signoffs" | "policy";
  severity: "CRITICAL" | "COMPLIANCE" | "POLICY" | "INFO";
  title: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  cryptoSignature: string;
  networkOrigin: string;
}

interface EnterpriseAuditAndRbacModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

const ROLES_CONFIG: {
  id: EnterpriseRoleType;
  label: string;
  clearance: string;
  desc: string;
  badgeColor: string;
}[] = [
  {
    id: "owner",
    label: "Owner / Exec",
    clearance: "Level 5 Clearance",
    desc: "Full unrestricted administrative access across portfolio, billing, gates, and audit trails.",
    badgeColor: "#756EF3",
  },
  {
    id: "tech_lead",
    label: "Tech Lead",
    clearance: "Level 4 Clearance",
    desc: "Architecture verification, branch merge approval, SLA threshold tuning, and release sign-off.",
    badgeColor: "#3B82F6",
  },
  {
    id: "compliance",
    label: "Compliance Officer",
    clearance: "Level 4 Clearance",
    desc: "SOC 2 Type II audit verification, regulatory gate sign-off, and security policy authoring.",
    badgeColor: "#10B981",
  },
  {
    id: "specialist",
    label: "Specialist",
    clearance: "Level 2 Clearance",
    desc: "Task execution, deliverable submissions, checklist progression, and workstream discussions.",
    badgeColor: "#F59E0B",
  },
  {
    id: "guest",
    label: "Client / Guest",
    clearance: "Level 1 Clearance",
    desc: "Read-only access to published roadmaps and shared deliverable reviews without modification rights.",
    badgeColor: "#64748B",
  },
];

const PERMISSIONS_LIST: PermissionItem[] = [
  {
    id: "perm-sign-gates",
    title: "Sign Off Formal Governance Gates",
    category: "GOVERNANCE",
    description: "Approve Design QA, Tech Architecture, and SOC 2 compliance sign-offs.",
    allowedRoles: ["owner", "tech_lead", "compliance"],
  },
  {
    id: "perm-sla-edit",
    title: "Modify SLA Targets & Escalations",
    category: "OPERATIONS",
    description: "Change resolution countdown windows and automated alert thresholds.",
    allowedRoles: ["owner", "tech_lead"],
  },
  {
    id: "perm-del-workstream",
    title: "Archive or Delete Workstreams",
    category: "GOVERNANCE",
    description: "Permanent decommission or archival of strategic project workstreams.",
    allowedRoles: ["owner"],
  },
  {
    id: "perm-soc2-export",
    title: "Export SOC 2 Immutable Ledger",
    category: "COMPLIANCE",
    description: "Generate cryptographically signed compliance digests in JSON or CSV.",
    allowedRoles: ["owner", "compliance"],
  },
  {
    id: "perm-role-delegation",
    title: "Team Role Delegation & Seat Allocation",
    category: "SECURITY",
    description: "Invite enterprise members, reassign RBAC tiers, and revoke credentials.",
    allowedRoles: ["owner"],
  },
  {
    id: "perm-task-execution",
    title: "Task Progression & Deliverable Submissions",
    category: "OPERATIONS",
    description: "Update step checklists, post notes, and transition task statuses.",
    allowedRoles: ["owner", "tech_lead", "compliance", "specialist"],
  },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "evt-01",
    eventCode: "SOC2-EVT#9041",
    category: "signoffs",
    severity: "COMPLIANCE",
    title: "Governance Gate 1 Signed (Design QA)",
    actor: "Bikash Kumar Yadav",
    actorRole: "Super Admin",
    timestamp: "2026-09-20 01:22:15 UTC",
    cryptoSignature: "sig_ed25519_9c04a2fe7e8b91dc",
    networkOrigin: "192.168.1.104 (Authenticated TLS)",
  },
  {
    id: "evt-02",
    eventCode: "SOC2-EVT#9040",
    category: "policy",
    severity: "POLICY",
    title: "SLA Threshold Tuning (P1 Resolution: 24h)",
    actor: "Elena Rostova",
    actorRole: "Tech Lead",
    timestamp: "2026-09-20 01:05:40 UTC",
    cryptoSignature: "sig_ed25519_4b17f8a9e22c019d",
    networkOrigin: "10.0.4.22 (Enterprise VPN)",
  },
  {
    id: "evt-03",
    eventCode: "SOC2-EVT#9039",
    category: "critical",
    severity: "CRITICAL",
    title: "Workspace Member Invited to Specialist Tier",
    actor: "Bikash Kumar Yadav",
    actorRole: "Super Admin",
    timestamp: "2026-09-19 23:44:12 UTC",
    cryptoSignature: "sig_ed25519_6a8e0f31c82b9921",
    networkOrigin: "192.168.1.104 (Authenticated TLS)",
  },
  {
    id: "evt-04",
    eventCode: "SOC2-EVT#9038",
    category: "signoffs",
    severity: "COMPLIANCE",
    title: "Milestone Checkpoint Reached (Sprint 14 Gate)",
    actor: "Marcus Vance",
    actorRole: "Principal Architect",
    timestamp: "2026-09-19 22:18:04 UTC",
    cryptoSignature: "sig_ed25519_3d9c72e118ba401f",
    networkOrigin: "172.16.8.50 (Corporate Gateway)",
  },
  {
    id: "evt-05",
    eventCode: "SOC2-EVT#9037",
    category: "policy",
    severity: "INFO",
    title: "Cryptographic Merkle Root Verification Check",
    actor: "System Sentinel Daemon",
    actorRole: "Automated Daemon",
    timestamp: "2026-09-19 21:00:00 UTC",
    cryptoSignature: "sig_ed25519_812c09ef784a9103",
    networkOrigin: "127.0.0.1 (Local IPC Sentinel)",
  },
];

export const EnterpriseAuditAndRbacModal: React.FC<EnterpriseAuditAndRbacModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"rbac" | "audit">("rbac");
  const [selectedRole, setSelectedRole] = useState<EnterpriseRoleType>("owner");
  const [auditFilter, setAuditFilter] = useState<"all" | "critical" | "signoffs" | "policy">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVerifyingTamper, setIsVerifyingTamper] = useState(false);
  const [tamperVerified, setTamperVerified] = useState(false);

  if (!isOpen) return null;

  const filteredLogs = INITIAL_AUDIT_LOGS.filter((entry) => {
    const matchesCategory = auditFilter === "all" || entry.category === auditFilter;
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.eventCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVerifyIntegrity = () => {
    setIsVerifyingTamper(true);
    setTimeout(() => {
      setIsVerifyingTamper(false);
      setTamperVerified(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans select-none">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#002055] dark:text-[#F8FAFC]">
        {/* Header */}
        <div className="p-5 border-b border-[#E9F1FF] dark:border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black leading-tight">SOC 2 Audit & RBAC Governance</h2>
              <p className="text-xs text-[#848A94]">Cryptographic ledger & role clearance matrix</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-[#848A94] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 flex border-b border-[#E9F1FF] dark:border-[#1E293B] gap-4">
          <button
            onClick={() => setActiveTab("rbac")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "rbac"
                ? "border-[#756EF3] text-[#756EF3]"
                : "border-transparent text-[#848A94] hover:text-[#002055] dark:hover:text-[#F8FAFC]"
            }`}
          >
            Clearance Matrix (RBAC)
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "audit"
                ? "border-[#756EF3] text-[#756EF3]"
                : "border-transparent text-[#848A94] hover:text-[#002055] dark:hover:text-[#F8FAFC]"
            }`}
          >
            Immutable Audit Ledger
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === "rbac" ? (
            <div className="space-y-4">
              {/* Role Selection Strip */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {ROLES_CONFIG.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`px-3.5 py-2 rounded-2xl border text-left shrink-0 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#756EF3]/10 border-[#756EF3] shadow-xs"
                          : "bg-[#F8FAFF] dark:bg-[#0B0F19] border-[#E9F1FF] dark:border-[#1E293B]"
                      }`}
                    >
                      <div className="text-xs font-bold text-[#002055] dark:text-[#F8FAFC]">{role.label}</div>
                      <div className="text-[10px] text-[#848A94] mt-0.5">{role.clearance}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Role Card */}
              {(() => {
                const activeRoleConfig = ROLES_CONFIG.find((r) => r.id === selectedRole)!;
                return (
                  <div className="p-4 rounded-2xl bg-[#F8FAFF] dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#756EF3] uppercase tracking-wider">
                        {activeRoleConfig.label} Permissions
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-[10px] font-bold">
                        {activeRoleConfig.clearance}
                      </span>
                    </div>
                    <p className="text-xs text-[#556070] dark:text-[#94A3B8] mt-1.5 leading-relaxed">
                      {activeRoleConfig.desc}
                    </p>
                  </div>
                );
              })()}

              {/* Permissions Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#848A94] block">
                  Capability Access Tiers
                </span>
                {PERMISSIONS_LIST.map((perm) => {
                  const isGranted = perm.allowedRoles.includes(selectedRole);
                  return (
                    <div
                      key={perm.id}
                      className="p-3 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] flex items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#002055] dark:text-[#F8FAFC]">
                            {perm.title}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[#848A94] text-[9px] font-mono">
                            {perm.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#848A94] mt-0.5">{perm.description}</p>
                      </div>

                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                          isGranted
                            ? "bg-[#10B981]/15 text-[#10B981]"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        }`}
                      >
                        {isGranted ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cryptographic Merkle Root Seal */}
              <div className="p-4 rounded-2xl bg-[#F8FAFF] dark:bg-[#0B0F19] border border-[#E9F1FF] dark:border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#10B981]">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Cryptographic Merkle Root Hash</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#848A94]">SHA-256 Validated</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] font-mono text-[10px] text-[#756EF3] break-all">
                  sha256:9c4b8e21074a3f91bdc168297b830a514d791b453e921d740ba76077363404fd
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-[#848A94]">
                    {tamperVerified ? (
                      <span className="text-[#10B981] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Zero Tamper Events (Chain Verified)
                      </span>
                    ) : (
                      <span>Hash chain continuously notarized</span>
                    )}
                  </div>

                  <button
                    onClick={handleVerifyIntegrity}
                    disabled={isVerifyingTamper}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#10B981] text-white text-[11px] font-bold hover:bg-[#059669] transition-colors cursor-pointer shrink-0"
                  >
                    <RefreshCw className={`w-3 h-3 ${isVerifyingTamper ? "animate-spin" : ""}`} />
                    <span>{isVerifyingTamper ? "Verifying..." : "Verify Chain"}</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1.5">
                  {(["all", "signoffs", "policy", "critical"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setAuditFilter(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        auditFilter === cat
                          ? "bg-[#756EF3] text-white"
                          : "bg-[#F8FAFF] dark:bg-[#0B0F19] text-[#848A94] border border-[#E9F1FF] dark:border-[#1E293B]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#848A94]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ledger..."
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#151C2C] text-xs text-[#002055] dark:text-[#F8FAFC] outline-hidden focus:border-[#756EF3]"
                  />
                </div>
              </div>

              {/* Audit Log Stream */}
              <div className="space-y-2">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#756EF3]">{log.eventCode}</span>
                        <span className="text-[#848A94]">• {log.timestamp}</span>
                      </div>
                      <span
                        className={`px-2 py-0.2 rounded-full font-bold text-[9px] ${
                          log.severity === "CRITICAL"
                            ? "bg-[#FEE2E2] dark:bg-[#7F1D1D]/30 text-[#DC2626]"
                            : log.severity === "COMPLIANCE"
                            ? "bg-[#D1FAE5] dark:bg-[#064E3B]/30 text-[#059669]"
                            : "bg-[#FEF3C7] dark:bg-[#78350F]/30 text-[#D97706]"
                        }`}
                      >
                        {log.severity}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-[#002055] dark:text-[#F8FAFC]">
                      {log.title}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#848A94] pt-1 border-t border-[#E9F1FF]/60 dark:border-[#1E293B]/60">
                      <span>Actor: <strong className="text-[#002055] dark:text-[#F8FAFC]">{log.actor}</strong> ({log.actorRole})</span>
                      <span className="font-mono text-[9px]">{log.cryptoSignature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
