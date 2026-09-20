"use client";

import React, { useState } from "react";
import { ShieldCheck, Clock, CheckCircle2, Check, Key, UserCheck, AlertTriangle } from "lucide-react";

export interface ApprovalGate {
  id: string;
  discipline: string;
  title: string;
  requiredRole: string;
  signedBy?: string;
  signedAt?: string;
  authStamp?: string;
  avatarUrl?: string;
  isSigned: boolean;
}

const DEFAULT_GATES: ApprovalGate[] = [
  {
    id: "gate-1",
    discipline: "Design QA",
    title: "Framer / UI Layout Audit & Consistency",
    requiredRole: "Tech Lead / Design Lead",
    signedBy: "Elena Rostova",
    signedAt: "Today, 10:14 AM",
    authStamp: "AUTH-SIG#AA30",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    isSigned: true,
  },
  {
    id: "gate-2",
    discipline: "Security QA",
    title: "SOC 2 Clearance & Auth Token Audit",
    requiredRole: "Compliance Officer",
    isSigned: false,
  },
  {
    id: "gate-3",
    discipline: "Executive Sign-Off",
    title: "Quarterly Workstream Release Gate",
    requiredRole: "Super Admin",
    isSigned: false,
  },
];

interface GovernanceGatesSectionProps {
  taskId?: string;
  priority?: "low" | "medium" | "high" | "critical";
  gates?: ApprovalGate[];
  isDarkMode?: boolean;
  onSignGate?: (gateId: string) => void;
}

export const GovernanceGatesSection: React.FC<GovernanceGatesSectionProps> = ({
  taskId,
  priority = "high",
  gates: initialGates = DEFAULT_GATES,
  onSignGate,
}) => {
  const [gates, setGates] = useState<ApprovalGate[]>(initialGates);

  React.useEffect(() => {
    if (initialGates && initialGates.length > 0) {
      setGates(initialGates);
    }
  }, [initialGates, taskId]);

  const getSlaDetails = () => {
    switch (priority) {
      case "critical":
        return { totalHours: 4, remainingStr: "1h 42m remaining", percentElapsed: 58, isWarning: true };
      case "high":
        return { totalHours: 24, remainingStr: "16h 20m remaining", percentElapsed: 32, isWarning: false };
      case "medium":
        return { totalHours: 72, remainingStr: "52h remaining", percentElapsed: 28, isWarning: false };
      default:
        return { totalHours: 120, remainingStr: "98h remaining", percentElapsed: 18, isWarning: false };
    }
  };

  const sla = getSlaDetails();
  const signedCount = gates.filter((g) => g.isSigned).length;
  const allSigned = signedCount === gates.length;

  const handleSign = (gateId: string) => {
    const updated = gates.map((g) => {
      if (g.id === gateId) {
        return {
          ...g,
          isSigned: true,
          signedBy: "Bikash Kumar Yadav (Super Admin)",
          signedAt: "Just now",
          authStamp: `AUTH-SIG#${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        };
      }
      return g;
    });
    setGates(updated);
    onSignGate?.(gateId);
  };

  return (
    <div className="w-full flex flex-col gap-3 font-sans select-none">
      {/* SLA Policy Monitor */}
      <div className="p-3.5 bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] rounded-2xl shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#002055] dark:text-[#F8FAFC]">
            <Clock className={`w-3.5 h-3.5 ${sla.isWarning ? "text-[#F59E0B]" : "text-[#756EF3]"}`} />
            <span>Resolution SLA ({sla.totalHours}h Target)</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              sla.isWarning
                ? "bg-[#FEF3C7] dark:bg-[#78350F]/20 border-[#F59E0B] text-[#D97706]"
                : "bg-[#D1FAE5] dark:bg-[#064E3B]/20 border-[#10B981] text-[#059669]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                sla.isWarning ? "bg-[#F59E0B] animate-pulse" : "bg-[#10B981]"
              }`}
            />
            <span>{sla.remainingStr}</span>
          </div>
        </div>

        {/* SLA Progress Bar */}
        <div className="w-full h-1.5 bg-[#F8FAFF] dark:bg-[#0B0F19] rounded-full overflow-hidden border border-[#E9F1FF] dark:border-[#1E293B]">
          <div
            style={{ width: `${sla.percentElapsed}%` }}
            className={`h-full rounded-full transition-all ${
              sla.isWarning ? "bg-[#F59E0B]" : "bg-[#10B981]"
            }`}
          />
        </div>

        <div className="flex items-center justify-between text-[9px] text-[#848A94] mt-1.5">
          <span>Target: P{priority === "critical" ? 0 : priority === "high" ? 1 : 2} Enterprise Resolution</span>
          <span>{sla.percentElapsed}% of SLA Window Elapsed</span>
        </div>
      </div>

      {/* Governance Gates Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#002055] dark:text-[#F8FAFC]">
          <ShieldCheck className="w-4 h-4 text-[#756EF3]" />
          <span>Governance Sign-Off Gates ({signedCount}/{gates.length})</span>
        </div>

        {allSigned && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D1FAE5] dark:bg-[#064E3B]/30 border border-[#10B981] text-[#059669] text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Compliant</span>
          </div>
        )}
      </div>

      {/* Gates Cards List */}
      <div className="space-y-2">
        {gates.map((gate, index) => {
          return (
            <div
              key={gate.id}
              className={`p-3 rounded-2xl border transition-all ${
                gate.isSigned
                  ? "bg-white dark:bg-[#151C2C] border-[#10B981]/50 shadow-xs"
                  : "bg-white dark:bg-[#151C2C] border-[#E9F1FF] dark:border-[#1E293B]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#756EF3]">
                      Gate {index + 1} • {gate.discipline}
                    </span>
                    <span className="text-[9px] text-[#848A94]">• Req: {gate.requiredRole}</span>
                  </div>
                  <div className="text-xs font-bold text-[#002055] dark:text-[#F8FAFC] mt-0.5">
                    {gate.title}
                  </div>
                </div>

                {gate.isSigned ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#D1FAE5] dark:bg-[#064E3B]/20 text-[#059669] border border-[#10B981]/40 text-[9px] font-bold shrink-0">
                    Approved
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] dark:bg-[#78350F]/20 text-[#D97706] border border-[#F59E0B]/40 text-[9px] font-bold shrink-0">
                    Pending
                  </span>
                )}
              </div>

              {/* Status and Action Row */}
              <div className="mt-2.5 pt-2 border-t border-[#E9F1FF] dark:border-[#1E293B] flex items-center justify-between gap-2">
                {gate.isSigned ? (
                  <div className="flex items-center gap-2 text-[10px] text-[#848A94]">
                    <Key className="w-3 h-3 text-[#10B981]" />
                    <span className="font-mono text-[#10B981] font-bold">{gate.authStamp}</span>
                    <span>• {gate.signedBy}</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-[#848A94]">
                    Sign-off authorization required
                  </div>
                )}

                {!gate.isSigned && (
                  <button
                    onClick={() => handleSign(gate.id)}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#756EF3] text-white text-[11px] font-bold hover:bg-[#5B52E0] transition-colors cursor-pointer shrink-0"
                  >
                    <Check className="w-3 h-3" />
                    <span>Sign Off Gate</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
