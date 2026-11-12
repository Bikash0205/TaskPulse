"use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Kanban,
  Calendar,
  Terminal,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  MessageSquare,
} from "lucide-react";

gsap.registerPlugin(useGSAP);

type ShowcaseTab = "gantt" | "kanban" | "ai" | "capacity" | "governance" | "billing";

const TABS: { id: ShowcaseTab; label: string; icon: React.ReactNode }[] = [
  { id: "gantt", label: "Gantt & Milestones", icon: <Calendar className="w-3.5 h-3.5" /> },
  { id: "kanban", label: "Boards & Subtasks", icon: <Kanban className="w-3.5 h-3.5" /> },
  { id: "ai", label: "Brief Parser", icon: <Terminal className="w-3.5 h-3.5" /> },
  { id: "capacity", label: "Workload & Presence", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: "governance", label: "Verification & Audit", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { id: "billing", label: "Multi-Org & Sync", icon: <CreditCard className="w-3.5 h-3.5" /> },
];

export const InteractiveProductShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("gantt");
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".ips-anim",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, duration: 0.38, ease: "power3.out", clearProps: "transform,opacity" }
        );
        gsap.fromTo(
          ".ips-bar",
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            stagger: 0.08,
            duration: 0.65,
            ease: "power3.out",
            clearProps: "transform",
          }
        );
      });
    },
    { scope: panelRef, dependencies: [activeTab] }
  );

  return (
    <div className="w-full rounded-xl bg-[#FAF8F4] dark:bg-[#0D1017] border border-[#DDD8CE] dark:border-white/[0.08] overflow-hidden">
      {/* Interactive Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 bg-[#F2EFE8] dark:bg-[#12161F] border-b border-[#E4DFD5] dark:border-white/[0.07]">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 w-full">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-2.5 sm:px-3 py-2 min-h-[40px] rounded-lg text-[11px] sm:text-xs font-semibold transition-colors flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer ${
                activeTab === t.id
                  ? "bg-[#1E222D] dark:bg-white text-[#FAF8F4] dark:text-[#0B0F19]"
                  : "text-[#4E5565] dark:text-slate-300 bg-[#FAF8F4]/80 sm:bg-transparent dark:bg-white/[0.03] sm:dark:bg-transparent hover:text-[#1E222D] dark:hover:text-white hover:bg-[#E4E0D6]/70 dark:hover:bg-white/[0.06]"
              }`}
            >
              {t.icon}
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Panel */}
      <div ref={panelRef} className="p-4 sm:p-7 min-h-[250px] sm:min-h-[300px] flex flex-col justify-center bg-[#FAF8F4] dark:bg-[#0D1017] text-left">
        {activeTab === "gantt" && (
          <div className="space-y-4">
            <div className="ips-anim flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#1E222D] dark:text-white">
                  60fps Gantt Timeline &amp; Critical Path
                </h4>
                <p className="text-xs text-[#4E5565] dark:text-slate-400 mt-0.5">
                  Track cross-department dependencies, target dates, and milestone slippage across projects.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#E4F2EC] dark:bg-emerald-500/15 text-[#0F7656] dark:text-emerald-300 border border-[#C5E3D5] dark:border-emerald-500/25">
                On Track (88%)
              </span>
            </div>

            <div className="space-y-3 bg-[#F4F2ED] dark:bg-[#090C11] p-4 rounded-2xl border border-[#E4DFD5] dark:border-white/[0.07]">
              {[
                { name: "Multi-Tenant RBAC & Google Lock", window: "Week 1 – 2", pct: "100%", w: "w-full", color: "bg-[#5D55D6]", tag: "Verified" },
                { name: "Hybrid Entitlement & Quota Engine", window: "Week 2 – 3", pct: "84%", w: "w-[84%]", color: "bg-[#0284C7]", tag: "In Review" },
                { name: "Android Offline SQLite Reconciler", window: "Week 3 – 4", pct: "62%", w: "w-[62%]", color: "bg-[#0F8C65]", tag: "In Progress" },
              ].map((lane) => (
                <div key={lane.name} className="ips-anim">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-xs font-semibold mb-1 text-[#1E222D] dark:text-white">
                    <span>{lane.name}</span>
                    <span className="font-mono text-[11px] text-[#4E5565] dark:text-slate-400">
                      {lane.window} &bull; {lane.pct}
                    </span>
                  </div>
                  <div className="h-6 w-full bg-[#E5E0D6] dark:bg-white/[0.07] rounded-lg overflow-hidden">
                    <div className={`ips-bar h-full ${lane.w} ${lane.color} rounded-lg flex items-center px-3 text-[11px] text-white font-bold`}>
                      {lane.tag}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "kanban" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              { col: "IN PROGRESS (3)", badge: "HIGH", title: "Subtask Checklist Sync", owner: "Marcus Vance", status: "75% Done", tone: "text-[#5D55D6] dark:text-[#818CF8]" },
              { col: "IN REVIEW (2)", badge: "VERIFICATION", title: "Project Folder Hierarchy", owner: "Sarah Chen", status: "Awaiting Proof", tone: "text-[#0284C7] dark:text-sky-400" },
              { col: "COMPLETED (12)", badge: "VERIFIED", title: "Tabular Dispatcher View", owner: "Elena Rostova", status: "100% Sealed", tone: "text-[#0F8C65] dark:text-emerald-400" },
            ].map((card) => (
              <div key={card.col} className="ips-anim p-4 rounded-2xl bg-[#F4F2ED] dark:bg-[#131720] border border-[#E4DFD5] dark:border-white/[0.07]">
                <div className="text-[10px] font-mono font-bold text-[#6E7485] dark:text-slate-400 mb-2.5">
                  {card.col}
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF8F4] dark:bg-[#0D1017] border border-[#DDD8CE] dark:border-white/[0.08]">
                  <span className={`text-[10px] font-mono font-bold ${card.tone}`}>{card.badge}</span>
                  <h5 className="text-xs font-bold mt-1.5 text-[#1E222D] dark:text-white">{card.title}</h5>
                  <div className="mt-3 pt-2 border-t border-[#E4DFD5] dark:border-white/[0.06] flex justify-between text-[11px] text-[#4E5565] dark:text-slate-400">
                    <span>{card.owner}</span>
                    <span className="font-mono font-semibold">{card.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "ai" && (
          <div className="ips-anim p-5 rounded-xl bg-[#F4F2ED] dark:bg-[#131720] border border-[#E4DFD5] dark:border-white/[0.07] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E222D] dark:text-white">
              <Terminal className="w-4 h-4 text-[#5D55D6] dark:text-[#818CF8]" />
              <span>Brief-to-Task Extraction</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4E5565] dark:text-slate-300 leading-relaxed">
              Write a plain deliverable brief. TaskPulse maps priority, target due date, department routing, and actionable subtasks directly into your project ledger.
            </p>
            <div className="p-3.5 rounded-xl bg-[#FAF8F4] dark:bg-[#090C11] border border-[#DDD8CE] dark:border-white/[0.08] font-mono text-xs space-y-1">
              <div>
                <span className="text-[#0F8C65] font-bold">&gt; Input:</span>{" "}
                <span className="text-[#1E222D] dark:text-slate-200">&ldquo;Prepare SOC 2 export audit with Sarah by Friday critical priority&rdquo;</span>
              </div>
              <div>
                <span className="text-[#5D55D6] dark:text-[#818CF8] font-bold">&gt; Output:</span>{" "}
                <span className="text-[#4E5565] dark:text-slate-300">[SEC] Security | Priority: Critical | 3 Subtasks Auto-Mapped</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "capacity" && (
          <div className="space-y-4">
            <div className="ips-anim flex items-center justify-between text-xs font-bold text-[#1E222D] dark:text-white">
              <span>Live Department Bandwidth &amp; Peer Presence</span>
              <span className="font-mono text-[#0F8C65] dark:text-emerald-400">Rebalance Guardrails Active</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Sarah Chen", load: "3 / 5 tasks", pct: "60%", bar: "w-[60%] bg-[#0F8C65]" },
                { name: "Marcus Vance", load: "4 / 5 tasks", pct: "80%", bar: "w-[80%] bg-[#D97706]" },
                { name: "Elena Rostova", load: "2 / 5 tasks", pct: "40%", bar: "w-[40%] bg-[#0F8C65]" },
                { name: "David Kim", load: "3 / 5 tasks", pct: "60%", bar: "w-[60%] bg-[#5D55D6]" },
              ].map((m) => (
                <div key={m.name} className="ips-anim p-3.5 rounded-xl bg-[#F4F2ED] dark:bg-[#131720] border border-[#E4DFD5] dark:border-white/[0.07]">
                  <div className="text-xs font-bold text-[#1E222D] dark:text-white">{m.name}</div>
                  <div className="text-[11px] text-[#4E5565] dark:text-slate-400 mt-0.5">{m.load}</div>
                  <div className="mt-2.5 h-1.5 rounded-full bg-[#E2DED4] dark:bg-white/[0.08] overflow-hidden">
                    <div className={`ips-bar h-full ${m.bar} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "governance" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="ips-anim p-4 rounded-2xl bg-[#F4F2ED] dark:bg-[#131720] border border-[#E4DFD5] dark:border-white/[0.07] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E222D] dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-[#0F8C65]" />
                <span>Manager Evidence Verification</span>
              </div>
              <p className="text-xs text-[#4E5565] dark:text-slate-300 leading-relaxed">
                Assignees submit implementation notes and verification screenshots; leads approve or request changes with immutable audit timestamps and CSV/JSON exports.
              </p>
            </div>
            <div className="ips-anim p-4 rounded-2xl bg-[#F4F2ED] dark:bg-[#131720] border border-[#E4DFD5] dark:border-white/[0.07] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E222D] dark:text-white">
                <MessageSquare className="w-4 h-4 text-[#5D55D6]" />
                <span>Threaded Discussions &amp; RBAC</span>
              </div>
              <p className="text-xs text-[#4E5565] dark:text-slate-300 leading-relaxed">
                Role-locked permissions separate Super Admin, Manager, Member, and Viewer scopes with server-enforced Firestore &amp; API guardrails.
              </p>
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="ips-anim p-4 rounded-2xl bg-[#F4F2ED] dark:bg-[#131720] border border-[#E4DFD5] dark:border-white/[0.07] space-y-2">
              <div className="text-xs font-bold text-[#1E222D] dark:text-white">
                4-Tier Onboarding &amp; Quota Gates
              </div>
              <p className="text-xs text-[#4E5565] dark:text-slate-300 leading-relaxed">
                New companies choose Free, Growth, Pro, or custom-quoted Enterprise during onboarding; invited teammates join via cryptographic code and inherit host entitlements automatically.
              </p>
            </div>
            <div className="ips-anim p-4 rounded-2xl bg-[#F4F2ED] dark:bg-[#131720] border border-[#E4DFD5] dark:border-white/[0.07] space-y-2">
              <div className="text-xs font-bold text-[#1E222D] dark:text-white">
                Hybrid Play + Web Sync + Auto Client Detection
              </div>
              <p className="text-xs text-[#4E5565] dark:text-slate-300 leading-relaxed">
                14-day Web trials, UPI/invoice approvals, and Android Google Play purchases sync in real time via Firestore, while browsers automatically adapt between Desktop and Mobile layouts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
