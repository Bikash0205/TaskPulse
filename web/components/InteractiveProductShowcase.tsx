"use client";

import React, { useState } from "react";
import {
  Kanban,
  Calendar,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  AlertCircle,
  TrendingUp,
  Layers,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react";

export const InteractiveProductShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"gantt" | "kanban" | "ai" | "capacity">("gantt");

  return (
    <div className="w-full rounded-3xl bg-white dark:bg-[#111726] border border-slate-300 dark:border-white/10 shadow-2xl overflow-hidden transition-all duration-300">
      {/* 1. Interactive Tab Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 bg-slate-100 dark:bg-[#0B0F19] border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab("gantt")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "gantt"
                ? "bg-[#756EF3] text-white shadow-md shadow-[#756EF3]/30"
                : "text-[#0F172A] dark:text-[#E2E8F0] hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Interactive Gantt</span>
          </button>

          <button
            onClick={() => setActiveTab("kanban")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "kanban"
                ? "bg-[#756EF3] text-white shadow-md shadow-[#756EF3]/30"
                : "text-[#0F172A] dark:text-[#E2E8F0] hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Fluid Kanban</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "ai"
                ? "bg-[#756EF3] text-white shadow-md shadow-[#756EF3]/30"
                : "text-[#0F172A] dark:text-[#E2E8F0] hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini AI Engine</span>
          </button>

          <button
            onClick={() => setActiveTab("capacity")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "capacity"
                ? "bg-[#756EF3] text-white shadow-md shadow-[#756EF3]/30"
                : "text-[#0F172A] dark:text-[#E2E8F0] hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Capacity &amp; Heatmap</span>
          </button>
        </div>

        {/* Live Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700/50 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" />
          <span>Realtime 60fps Pipeline</span>
        </div>
      </div>

      {/* 2. Tab Content Area */}
      <div className="p-4 sm:p-7 min-h-[360px] flex flex-col justify-center bg-white dark:bg-[#111726]">
        {/* TAB 1: GANTT TIMELINE */}
        {activeTab === "gantt" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-white">
                  Sprint 14: Mobile Release &amp; Core Infrastructure
                </h4>
                <p className="text-xs text-[#334155] dark:text-slate-300 font-medium mt-0.5">
                  Critical path dependencies automatically calculated with zero UI lag.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                On Track (88%)
              </span>
            </div>

            {/* Gantt Timeline Visualizer */}
            <div className="mt-3 space-y-3 bg-slate-50 dark:bg-[#070B14] p-4 rounded-2xl border border-slate-200 dark:border-white/10">
              {/* Task Row 1 */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-[#0F172A] dark:text-white">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#756EF3]" />
                    <span>Android Fluid Gesture Engine</span>
                  </span>
                  <span className="text-[11px] text-[#334155] dark:text-slate-300">Nov 2 - Nov 8 (100%)</span>
                </div>
                <div className="h-7 w-full bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                  <div className="h-full bg-gradient-to-r from-[#756EF3] to-[#9089FC] rounded-lg w-full flex items-center px-3 text-[11px] text-white font-bold">
                    Completed &bull; Verified by Lead
                  </div>
                </div>
              </div>

              {/* Task Row 2 */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-[#0F172A] dark:text-white">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                    <span>Edge API &amp; Gemini NLP Pipeline</span>
                  </span>
                  <span className="text-[11px] text-[#334155] dark:text-slate-300">Nov 6 - Nov 12 (75%)</span>
                </div>
                <div className="h-7 w-full bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg w-[75%] flex items-center px-3 text-[11px] text-white font-bold">
                    In Progress &bull; 14 Milestones Linked
                  </div>
                </div>
              </div>

              {/* Task Row 3 */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-[#0F172A] dark:text-white">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 dark:bg-amber-400" />
                    <span>Google Play &#8377;199 Subscription Hook</span>
                  </span>
                  <span className="text-[11px] text-[#334155] dark:text-slate-300">Nov 10 - Nov 16 (Upcoming)</span>
                </div>
                <div className="h-7 w-full bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg w-[35%] flex items-center px-3 text-[11px] text-slate-950 font-black">
                    Ready to Launch
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLUID KANBAN */}
        {activeTab === "kanban" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Column 1: In Progress */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F172A] dark:text-white mb-3">
                  <span>IN PROGRESS (3)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#151C2C] border border-slate-300 dark:border-white/10 shadow-sm hover:border-[#756EF3] transition-all">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300">
                    CRITICAL
                  </span>
                  <h5 className="text-xs font-bold mt-2 text-[#0F172A] dark:text-white">
                    Fluid Touch Bottom Sheet
                  </h5>
                  <p className="text-[11px] text-[#334155] dark:text-slate-200 mt-1 font-medium leading-relaxed">
                    Direct 1:1 finger tracking with crosshair drag dismissal.
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] font-semibold text-[#1E293B] dark:text-slate-300">
                    <span>Marcus Vance</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">95% Done</span>
                  </div>
                </div>
              </div>

              {/* Column 2: In Review */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F172A] dark:text-white mb-3">
                  <span>MANAGER REVIEW (1)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#151C2C] border-2 border-amber-400 dark:border-amber-600 shadow-sm">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300">
                    AWAITING SIGN-OFF
                  </span>
                  <h5 className="text-xs font-bold mt-2 text-[#0F172A] dark:text-white">
                    Vector Boot Animation
                  </h5>
                  <p className="text-[11px] text-[#334155] dark:text-slate-200 mt-1 font-medium leading-relaxed">
                    Centered SVG typography reveal with specular glow.
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] font-semibold text-[#1E293B] dark:text-slate-300">
                    <span>Bikash Lead</span>
                    <span className="text-amber-800 dark:text-amber-300 font-bold">Reviewing</span>
                  </div>
                </div>
              </div>

              {/* Column 3: Completed */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F172A] dark:text-white mb-3">
                  <span>VERIFIED (8)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#151C2C] border-2 border-emerald-400 dark:border-emerald-600 shadow-sm">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300">
                    VERIFIED IN PROD
                  </span>
                  <h5 className="text-xs font-bold mt-2 text-[#0F172A] dark:text-white">
                    Frosted Liquid Glass Dock
                  </h5>
                  <p className="text-[11px] text-[#334155] dark:text-slate-200 mt-1 font-medium leading-relaxed">
                    Multi-axis fluid squashing without RenderNode clipping.
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    <span>Audit Passed</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GEMINI AI ENGINE */}
        {activeTab === "ai" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-5 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/40">
              <div className="flex items-center gap-2 text-xs font-bold text-violet-900 dark:text-violet-300 mb-2">
                <Sparkles className="w-4 h-4 text-[#756EF3]" />
                <span>Zero-Friction Prompt to Action</span>
              </div>
              <p className="text-xs sm:text-sm text-[#0F172A] dark:text-white font-medium leading-relaxed">
                Type natural requirements into any view. Gemini Pro analyzes dependencies, estimates realistic timeframes, auto-populates subtask checklists, and assigns team leads based on active bandwidth.
              </p>
              <div className="mt-4 p-3.5 rounded-xl bg-white dark:bg-[#070B14] border border-slate-300 dark:border-white/10 text-xs font-mono text-[#0F172A] dark:text-slate-200 font-semibold shadow-xs">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">&gt; Input:</span> &ldquo;Launch summer promotion with Elena by Friday high priority&rdquo;<br />
                <span className="text-violet-700 dark:text-violet-400 font-bold">&gt; Output:</span> [PRJ-04] Marketing | Priority: High | Target: 2026-11-13 | 3 Checkpoints generated
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CAPACITY & HEATMAP */}
        {activeTab === "capacity" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#0F172A] dark:text-white">
                <span>Engineering Core (4 Members)</span>
                <span className="text-emerald-800 dark:text-emerald-300 font-extrabold">Optimal Bandwidth (68%)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/50 text-center">
                  <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Sarah C.</div>
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-1 font-semibold">3 / 5 Active Tasks</div>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/50 text-center">
                  <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Alex R.</div>
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-1 font-semibold">4 / 6 Active Tasks</div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 text-center">
                  <div className="text-xs font-bold text-amber-950 dark:text-amber-200">David L.</div>
                  <div className="text-[11px] text-amber-800 dark:text-amber-300 mt-1 font-semibold">Near Limit (85%)</div>
                </div>
                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-700/50 text-center">
                  <div className="text-xs font-bold text-blue-950 dark:text-blue-200">Bikash S.</div>
                  <div className="text-[11px] text-blue-800 dark:text-blue-300 mt-1 font-semibold">Lead Architect</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
