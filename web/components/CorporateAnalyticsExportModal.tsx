"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  ShieldCheck,
  BarChart3,
  FileText,
  Download,
  TrendingUp,
  Share2,
  Printer,
  Calendar,
  Layers,
  ArrowUpRight,
  Clock,
} from "lucide-react";

interface CorporateAnalyticsExportModalProps {
  isOpen: boolean;
  isDarkMode: boolean;
  onClose: () => void;
}

export const CorporateAnalyticsExportModal: React.FC<CorporateAnalyticsExportModalProps> = ({
  isOpen,
  isDarkMode,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "export">("dashboard");
  const [selectedQuarter, setSelectedQuarter] = useState<"Q3-2026" | "YTD-2026" | "ALL">("Q3-2026");
  const [includeConfidentialWatermark, setIncludeConfidentialWatermark] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState<"pdf" | "csv" | "xlsx">("pdf");

  // Export generation progress state
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [generatedReport, setGeneratedReport] = useState<{
    fileName: string;
    size: string;
    checksum: string;
    timestamp: string;
  } | null>(null);

  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsExporting(false);
      setProgressPercent(0);
      setGeneratedReport(null);
      setNotificationBanner(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartExport = () => {
    if (isExporting) return;
    setIsExporting(true);
    setGeneratedReport(null);
    setProgressPercent(10);
    setExportStep("Compiling workstream telemetry & milestones...");

    setTimeout(() => {
      setProgressPercent(45);
      setExportStep("Evaluating SLA adherence & governance logs...");

      setTimeout(() => {
        setProgressPercent(80);
        setExportStep("Generating SHA-256 cryptographic stamp...");

        setTimeout(() => {
          setProgressPercent(100);
          setIsExporting(false);

          const now = new Date();
          const dateStr = now.toISOString().slice(0, 10);
          const ext = selectedReportType === "pdf" ? "pdf" : selectedReportType === "csv" ? "csv" : "xlsx";
          const extName =
            selectedReportType === "pdf"
              ? "Board_Briefing"
              : selectedReportType === "csv"
              ? "Audit_Ledger"
              : "Resource_Plan";

          setGeneratedReport({
            fileName: `TaskPulse_${selectedQuarter}_${extName}_${dateStr}.${ext}`,
            size: selectedReportType === "pdf" ? "4.2 MB" : selectedReportType === "csv" ? "820 KB" : "1.6 MB",
            checksum: "sha256:7a94b2" + Math.floor(100000 + Math.random() * 900000) + "8c41d0",
            timestamp: "Today, " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          });
        }, 600);
      }, 700);
    }, 600);
  };

  const handleAction = (actionName: string) => {
    setNotificationBanner(`${actionName} triggered for: ${generatedReport?.fileName || "Executive Briefing"}`);
    setTimeout(() => setNotificationBanner(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDarkMode ? "bg-[#0B101D] text-slate-100 border-[#253554]" : "bg-white text-slate-900 border-slate-200"
        }`}
      >
        {/* Top Handle for mobile aesthetic */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className={`w-12 h-1.5 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-slate-300"}`} />
        </div>

        {/* Modal Header */}
        <div className={`px-5 py-4 flex items-center justify-between border-b ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-500">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Executive Analytics</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500">
                  Board Engine
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Portfolio Velocity, SLA Adherence & Formal Briefings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode ? "bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner notification if active */}
        {notificationBanner && (
          <div className="px-5 py-2.5 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationBanner}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className={`px-5 pt-3 pb-2 flex gap-2 border-b ${isDarkMode ? "border-slate-800/80 bg-[#0E1526]" : "border-slate-100 bg-slate-50/70"}`}>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-sm"
                : isDarkMode
                ? "text-slate-400 hover:bg-slate-800/60"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>KPI Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "export"
                ? "bg-indigo-600 text-white shadow-sm"
                : isDarkMode
                ? "text-slate-400 hover:bg-slate-800/60"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Board Export Engine</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === "dashboard" ? (
            /* TAB 1: EXECUTIVE KPI DASHBOARD */
            <div className="space-y-4">
              {/* 2x2 Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Metric 1 */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDarkMode ? "bg-[#131C2E] border-[#253554]" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    SLA ADHERENCE
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xl font-black text-emerald-500">98.4%</span>
                    <span className={`text-[11px] ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>/ 95.0% tgt</span>
                  </div>
                  <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                    Optimal Performance
                  </div>
                </div>

                {/* Metric 2 */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDarkMode ? "bg-[#131C2E] border-[#253554]" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    VELOCITY (PTS)
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xl font-black text-indigo-500">48.5</span>
                    <span className={`text-[11px] ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>pts/cycle</span>
                  </div>
                  <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold">
                    +12% vs Prev Qtr
                  </div>
                </div>

                {/* Metric 3 */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDarkMode ? "bg-[#131C2E] border-[#253554]" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    ON-TIME DELIVERY
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className={`text-xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>94.2%</span>
                    <span className={`text-[11px] ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>29 / 31</span>
                  </div>
                  <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                    On Schedule
                  </div>
                </div>

                {/* Metric 4 */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDarkMode ? "bg-[#131C2E] border-[#253554]" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    AVG RESOLUTION
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className={`text-xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>4.2h</span>
                    <span className={`text-[11px] ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>turnaround</span>
                  </div>
                  <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-semibold">
                    Fast Response
                  </div>
                </div>
              </div>

              {/* Velocity Histogram */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDarkMode ? "bg-[#131C2E] border-[#253554]" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">Throughput Velocity Trends</h3>
                    <p className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Story points executed across recent enterprise sprints
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-600"}`}>
                    Target: 40 pts
                  </span>
                </div>

                {/* Bar chart items */}
                <div className="flex items-end justify-between gap-3 h-32 pt-4 px-2">
                  {[
                    { label: "Sprint 21", pts: 36, heightPct: 60, active: false },
                    { label: "Sprint 22", pts: 42, heightPct: 70, active: false },
                    { label: "Sprint 23", pts: 45, heightPct: 75, active: false },
                    { label: "Sprint 24 (Active)", pts: 52, heightPct: 87, active: true },
                  ].map((item) => (
                    <div key={item.label} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <span className={`text-[11px] font-bold mb-1.5 ${item.active ? "text-indigo-400" : isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {item.pts}
                      </span>
                      <div className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 ${
                        isDarkMode ? "bg-slate-800/80" : "bg-slate-200"
                      } h-24 flex items-end overflow-hidden`}>
                        <div
                          style={{ height: `${item.heightPct}%` }}
                          className={`w-full rounded-t-md transition-all duration-500 ${
                            item.active ? "bg-indigo-600 group-hover:bg-indigo-500" : isDarkMode ? "bg-slate-600 group-hover:bg-slate-500" : "bg-slate-400"
                          }`}
                        />
                      </div>
                      <span className={`text-[10px] font-medium mt-1.5 text-center truncate w-full ${
                        item.active ? "text-indigo-400 font-bold" : isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Departmental Capital & Resource Allocation */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDarkMode ? "bg-[#131C2E] border-[#253554]" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider">Departmental Capital & Resource Allocation</h3>
                <p className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"} mb-3`}>
                  Committed budget utilization for fiscal period
                </p>

                <div className="space-y-3">
                  {[
                    { dep: "Engineering Core", allocated: "$180,000", used: "$142,500", pct: 79, color: "bg-indigo-600" },
                    { dep: "Design & UX Systems", allocated: "$80,000", used: "$64,200", pct: 80, color: "bg-emerald-500" },
                    { dep: "Growth & Marketing", allocated: "$70,000", used: "$48,000", pct: 68, color: "bg-amber-500" },
                    { dep: "Compliance & Security", allocated: "$35,000", used: "$22,000", pct: 63, color: "bg-purple-600" },
                  ].map((row) => (
                    <div
                      key={row.dep}
                      className={`p-3 rounded-xl border ${
                        isDarkMode ? "bg-[#1A263D] border-[#253554]" : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-semibold">{row.dep}</span>
                        <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
                          {row.used} / {row.allocated} ({row.pct}%)
                        </span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-[#0B101D]" : "bg-slate-200"}`}>
                        <div style={{ width: `${row.pct}%` }} className={`h-full rounded-full ${row.color}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Risk Distribution */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDarkMode ? "bg-[#131C2E] border-[#253554]" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider">Portfolio Risk Index Distribution</h3>
                <p className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"} mb-3`}>
                  Algorithmic risk evaluation across 31 active workstreams
                </p>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-base font-black text-emerald-500 block">68%</span>
                    <span className="text-[11px] font-bold text-emerald-400 block">Low Risk</span>
                    <span className={`text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>21 Workstreams</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-base font-black text-amber-500 block">22%</span>
                    <span className="text-[11px] font-bold text-amber-400 block">Moderate</span>
                    <span className={`text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>7 Workstreams</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <span className="text-base font-black text-rose-500 block">10%</span>
                    <span className="text-[11px] font-bold text-rose-400 block">Elevated</span>
                    <span className={`text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>3 Workstreams</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: BOARD EXPORT ENGINE */
            <div className="space-y-4">
              {/* Select Period */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDarkMode ? "bg-[#131C2E] border-[#253554]" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider">Select Reporting Period</h3>
                <p className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"} mb-3`}>
                  Data window captured in generated executive briefs
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "Q3-2026", label: "Q3 2026 (Current)" },
                    { id: "YTD-2026", label: "Year-to-Date" },
                    { id: "ALL", label: "All Active" },
                  ].map((p) => {
                    const isSelected = selectedQuarter === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedQuarter(p.id as any)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : isDarkMode
                            ? "bg-[#1A263D] border-[#253554] text-slate-300 hover:bg-slate-800"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Format selection */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDarkMode ? "bg-[#131C2E] border-[#253554]" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider">Select Briefing Package</h3>
                <p className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"} mb-3`}>
                  Format tailored for board presentations or automated compliance ingest
                </p>

                <div className="space-y-2.5">
                  {/* PDF option */}
                  <div
                    onClick={() => setSelectedReportType("pdf")}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedReportType === "pdf"
                        ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5"
                        : isDarkMode
                        ? "bg-[#1A263D] border-[#253554] hover:border-slate-600"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-500 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Executive Board Briefing (PDF)</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
                          Formal PDF
                        </span>
                      </div>
                      <p className={`text-[11px] mt-0.5 truncate ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        Complete visual deck: Gantt milestones, SLA health, capital burn & cryptographic seal.
                      </p>
                    </div>
                  </div>

                  {/* CSV option */}
                  <div
                    onClick={() => setSelectedReportType("csv")}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedReportType === "csv"
                        ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5"
                        : isDarkMode
                        ? "bg-[#1A263D] border-[#253554] hover:border-slate-600"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">SOC 2 Audit Ledger Stream (CSV)</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                          Immutable CSV
                        </span>
                      </div>
                      <p className={`text-[11px] mt-0.5 truncate ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        Raw cryptographically hashed audit records with Merkle root, actor ID, and IP origin.
                      </p>
                    </div>
                  </div>

                  {/* XLSX option */}
                  <div
                    onClick={() => setSelectedReportType("xlsx")}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedReportType === "xlsx"
                        ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5"
                        : isDarkMode
                        ? "bg-[#1A263D] border-[#253554] hover:border-slate-600"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 shrink-0">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Resource & Cost Accounting (XLSX)</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400">
                          Spreadsheet
                        </span>
                      </div>
                      <p className={`text-[11px] mt-0.5 truncate ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        Workstream line-item financials, team allocation hours, and completion variances.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Watermark toggle */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isDarkMode ? "bg-[#131C2E] border-[#253554]" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="pr-4">
                  <span className="text-xs font-bold block">Confidential Board Watermark</span>
                  <span className={`text-[11px] block ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Embeds &quot;CONFIDENTIAL - BOARD OF DIRECTORS&quot; diagonally across all pages.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeConfidentialWatermark(!includeConfidentialWatermark)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    includeConfidentialWatermark ? "bg-indigo-600" : isDarkMode ? "bg-slate-700" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      includeConfidentialWatermark ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Start Export Button */}
              <button
                disabled={isExporting}
                onClick={handleStartExport}
                className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isExporting
                    ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? "Compiling Report..." : "Generate & Compile Executive Briefing"}</span>
              </button>

              {/* Animated Compilation Progress */}
              {isExporting && (
                <div
                  className={`p-4 rounded-2xl border space-y-2 ${
                    isDarkMode ? "bg-[#131C2E] border-[#253554]" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-indigo-400">{exportStep}</span>
                    <span className="font-bold">{progressPercent}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}>
                    <div
                      style={{ width: `${progressPercent}%` }}
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Ready Generated Document Card */}
              {generatedReport && (
                <div
                  className={`p-4 rounded-2xl border space-y-3 ${
                    isDarkMode ? "bg-[#1A263D] border-emerald-500/40" : "bg-emerald-50/40 border-emerald-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-emerald-500">Report Compiled & Digitally Signed</span>
                    </div>
                    <span className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {generatedReport.timestamp}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl ${isDarkMode ? "bg-[#0B101D]" : "bg-white"} space-y-1`}>
                    <p className="text-xs font-bold font-mono truncate">{generatedReport.fileName}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-slate-400">
                      <span>Size: {generatedReport.size}</span>
                      <span>Checksum: {generatedReport.checksum}</span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => handleAction("Direct Download")}
                      className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => handleAction("Secure Share")}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
                          : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => handleAction("Print Preview")}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
                          : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
