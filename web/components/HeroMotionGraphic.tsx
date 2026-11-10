"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  CheckCircle2,
  GitCommitHorizontal,
  Layers,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SprintItem {
  id: string;
  key: string;
  title: string;
  owner: string;
  dept: string;
  progress: number;
  status: "Verified" | "In Review" | "In Progress";
  eta: string;
  chartX: number;
  chartY: number;
  points: string;
}

const SPRINT_ITEMS: SprintItem[] = [
  {
    id: "tp-201",
    key: "TP-201",
    title: "Multi-tenant Auth & Email Lock",
    owner: "Sarah Chen",
    dept: "Security",
    progress: 100,
    status: "Verified",
    eta: "Completed",
    chartX: 165,
    chartY: 168,
    points: "18 / 18 pts",
  },
  {
    id: "tp-204",
    key: "TP-204",
    title: "4-Tier Plan Quotas & Hybrid Sync",
    owner: "Marcus Vance",
    dept: "Platform",
    progress: 100,
    status: "Verified",
    eta: "Completed",
    chartX: 300,
    chartY: 120,
    points: "24 / 24 pts",
  },
  {
    id: "tp-209",
    key: "TP-209",
    title: "Gantt Critical Path Engine",
    owner: "Elena Rostova",
    dept: "Core UI",
    progress: 86,
    status: "In Review",
    eta: "Due Thu",
    chartX: 430,
    chartY: 74,
    points: "26 / 30 pts",
  },
  {
    id: "tp-214",
    key: "TP-214",
    title: "Android Offline SQLite Reconciler",
    owner: "David Kim",
    dept: "Mobile",
    progress: 68,
    status: "In Progress",
    eta: "Due Fri",
    chartX: 545,
    chartY: 42,
    points: "19 / 28 pts",
  },
];

export const HeroMotionGraphic: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const actualCurveRef = useRef<SVGPathElement>(null);
  const areaFillRef = useRef<SVGPathElement>(null);
  const scopeLineRef = useRef<SVGPathElement>(null);
  const velocityNumRef = useRef<HTMLSpanElement>(null);
  const slaNumRef = useRef<HTMLSpanElement>(null);
  const [selectedIdx, setSelectedIdx] = useState<number>(2);
  const [activeMetricView, setActiveMetricView] = useState<"burnup" | "throughput">("burnup");

  const selectedItem = SPRINT_ITEMS[selectedIdx];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (actualCurveRef.current) {
          const len = actualCurveRef.current.getTotalLength();
          gsap.set(actualCurveRef.current, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(actualCurveRef.current, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: { trigger: containerRef.current, start: "top 86%", once: true },
          });
        }

        if (scopeLineRef.current) {
          const len = scopeLineRef.current.getTotalLength();
          gsap.set(scopeLineRef.current, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(scopeLineRef.current, {
            strokeDashoffset: 0,
            duration: 1.3,
            delay: 0.15,
            ease: "power2.out",
            scrollTrigger: { trigger: containerRef.current, start: "top 86%", once: true },
          });
        }

        if (areaFillRef.current) {
          gsap.fromTo(
            areaFillRef.current,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 1.1,
              delay: 0.35,
              ease: "power2.out",
              scrollTrigger: { trigger: containerRef.current, start: "top 86%", once: true },
            }
          );
        }

        gsap.from(".hmg-row", {
          y: 16,
          opacity: 0,
          stagger: 0.08,
          duration: 0.55,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: containerRef.current, start: "top 86%", once: true },
        });

        gsap.from(".hmg-bar-fill", {
          scaleX: 0,
          transformOrigin: "left center",
          stagger: 0.1,
          duration: 0.9,
          delay: 0.2,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform",
          scrollTrigger: { trigger: containerRef.current, start: "top 86%", once: true },
        });

        if (velocityNumRef.current) {
          const v = { val: 42 };
          gsap.to(v, {
            val: 87,
            duration: 1.3,
            ease: "power2.out",
            scrollTrigger: { trigger: containerRef.current, start: "top 86%", once: true },
            onUpdate: () => {
              if (velocityNumRef.current) {
                velocityNumRef.current.textContent = `${Math.round(v.val)} / 100 pts`;
              }
            },
          });
        }

        if (slaNumRef.current) {
          const s = { val: 91.5 };
          gsap.to(s, {
            val: 99.4,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: containerRef.current, start: "top 86%", once: true },
            onUpdate: () => {
              if (slaNumRef.current) {
                slaNumRef.current.textContent = `${s.val.toFixed(1)}%`;
              }
            },
          });
        }
      });
    },
    { scope: containerRef, dependencies: [activeMetricView] }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width - 0.5;
    const ry = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(stageRef.current, {
      rotateY: rx * 3,
      rotateX: -ry * 3,
      transformPerspective: 1200,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!stageRef.current) return;
    gsap.to(stageRef.current, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power2.out" });
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-6xl mx-auto mt-10 mb-6 select-none">
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-2xl sm:rounded-3xl bg-[#FAF8F4] dark:bg-[#0D1017] border border-[#DDD8CE] dark:border-white/[0.08] shadow-xl shadow-[#1E222D]/[0.05] dark:shadow-black/60 overflow-hidden"
      >
        {/* Cockpit Chrome Top Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-[#E4DFD5] dark:border-white/[0.07] bg-[#F2EFE8]/80 dark:bg-[#12161F] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F8C65]/80" />
            </div>
            <div className="h-4 w-px bg-[#DDD8CE] dark:bg-white/10" />
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1E222D] dark:text-slate-100">
              <GitCommitHorizontal className="w-3.5 h-3.5 text-[#5D55D6] dark:text-[#818CF8]" />
              <span>Q4 RELEASE // CYCLE 14</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E4F2EC] dark:bg-emerald-500/15 text-[#0F7656] dark:text-emerald-300 border border-[#C5E3D5] dark:border-emerald-500/25 text-[10px] font-mono font-bold">
              ON TRACK
            </span>
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#EAE6DC] dark:bg-[#090C11] border border-[#DDD8CE] dark:border-white/[0.07] text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveMetricView("burnup")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeMetricView === "burnup"
                  ? "bg-[#FAF8F4] dark:bg-[#1B202C] text-[#1E222D] dark:text-white shadow-2xs"
                  : "text-[#4E5565] dark:text-slate-400"
              }`}
            >
              Burnup Trajectory
            </button>
            <button
              type="button"
              onClick={() => setActiveMetricView("throughput")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeMetricView === "throughput"
                  ? "bg-[#FAF8F4] dark:bg-[#1B202C] text-[#1E222D] dark:text-white shadow-2xs"
                  : "text-[#4E5565] dark:text-slate-400"
              }`}
            >
              Weekly Throughput
            </button>
          </div>
        </div>

        {/* Main Split Cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 7 Columns: Real SVG Sprint Burnup / Throughput Chart */}
          <div className="lg:col-span-7 p-5 sm:p-7 border-b lg:border-b-0 lg:border-r border-[#E4DFD5] dark:border-white/[0.07] text-left flex flex-col justify-between">
            {/* Tabular KPI Strip */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-[#F4F2ED] dark:bg-[#131823] border border-[#E4DFD5] dark:border-white/[0.07]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#6E7485] dark:text-slate-400">
                  Completed Velocity
                </div>
                <div className="text-sm sm:text-base font-black font-mono tabular-nums text-[#1E222D] dark:text-white mt-0.5">
                  <span ref={velocityNumRef}>87 / 100 pts</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F4F2ED] dark:bg-[#131823] border border-[#E4DFD5] dark:border-white/[0.07]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#6E7485] dark:text-slate-400">
                  SLA Compliance
                </div>
                <div className="text-sm sm:text-base font-black font-mono tabular-nums text-[#0F8C65] dark:text-emerald-400 mt-0.5">
                  <span ref={slaNumRef}>99.4%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F4F2ED] dark:bg-[#131823] border border-[#E4DFD5] dark:border-white/[0.07]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#6E7485] dark:text-slate-400">
                  Focus Milestone
                </div>
                <div className="text-sm sm:text-base font-black font-mono tabular-nums text-[#5D55D6] dark:text-[#818CF8] mt-0.5 truncate">
                  {selectedItem.key}
                </div>
              </div>
            </div>

            {/* Data-Dense SVG Execution Chart */}
            <div className="relative rounded-xl bg-[#F4F2ED]/80 dark:bg-[#090C11] border border-[#E4DFD5] dark:border-white/[0.07] p-3 sm:p-4">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#6E7485] dark:text-slate-400 mb-2">
                <span className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-[#5D55D6] inline-block" />
                    <span>Actual Delivery</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 border-t border-dashed border-[#6E7485] inline-block" />
                    <span>Target Scope (100 pts)</span>
                  </span>
                </span>
                <span>Cycle Days 01 – 14</span>
              </div>

              <svg viewBox="0 0 600 220" className="w-full h-44 sm:h-52 overflow-visible">
                <defs>
                  <linearGradient id="cockpitAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5D55D6" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#5D55D6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Hairline Grid Lines */}
                {[40, 85, 130, 175].map((y, idx) => (
                  <g key={y}>
                    <line
                      x1="36"
                      y1={y}
                      x2="580"
                      y2={y}
                      stroke="currentColor"
                      className="text-[#DDD8CE] dark:text-white/[0.06]"
                      strokeWidth="1"
                    />
                    <text
                      x="4"
                      y={y + 3}
                      className="fill-[#6E7485] dark:fill-slate-500 text-[9px] font-mono"
                    >
                      {`${100 - idx * 25}%`}
                    </text>
                  </g>
                ))}

                {/* Dashed Ideal Target Trajectory */}
                <path
                  ref={scopeLineRef}
                  d="M 42,190 L 560,36"
                  stroke="#94A3B8"
                  strokeOpacity="0.55"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                  fill="none"
                />

                {/* Completed Area Fill */}
                <path
                  ref={areaFillRef}
                  d={
                    activeMetricView === "burnup"
                      ? "M 42,192 L 165,168 L 300,120 L 430,74 L 545,42 L 545,192 Z"
                      : "M 42,192 L 165,148 L 300,136 L 430,68 L 545,38 L 545,192 Z"
                  }
                  fill="url(#cockpitAreaGrad)"
                />

                {/* Actual Delivery Curve */}
                <path
                  ref={actualCurveRef}
                  d={
                    activeMetricView === "burnup"
                      ? "M 42,192 C 95,184 125,176 165,168 C 215,152 255,134 300,120 C 350,104 388,88 430,74 C 472,60 510,50 545,42"
                      : "M 42,192 L 165,148 L 300,136 L 430,68 L 545,38"
                  }
                  stroke="#5D55D6"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                {/* Active Scrubber Guide Line */}
                <line
                  x1={selectedItem.chartX}
                  y1="30"
                  x2={selectedItem.chartX}
                  y2="194"
                  stroke="#5D55D6"
                  strokeOpacity="0.4"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />

                {/* Interactive Deliverable Nodes */}
                {SPRINT_ITEMS.map((item, idx) => {
                  const isActive = idx === selectedIdx;
                  const yPos = activeMetricView === "burnup" ? item.chartY : item.chartY - (idx % 2 === 0 ? 12 : 4);
                  return (
                    <g
                      key={item.id}
                      transform={`translate(${item.chartX}, ${yPos})`}
                      onClick={() => setSelectedIdx(idx)}
                      className="cursor-pointer"
                    >
                      {isActive && (
                        <circle r="13" fill="#5D55D6" fillOpacity="0.16" />
                      )}
                      <circle
                        r={isActive ? "6" : "4.5"}
                        fill={item.status === "Verified" ? "#0F8C65" : "#5D55D6"}
                        stroke="#FAF8F4"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}

                {/* X-Axis Cycle Ticks */}
                {[
                  { x: 42, label: "D1" },
                  { x: 165, label: "D4" },
                  { x: 300, label: "D7" },
                  { x: 430, label: "D11" },
                  { x: 545, label: "D14" },
                ].map((tick) => (
                  <text
                    key={tick.label}
                    x={tick.x - 8}
                    y="210"
                    className="fill-[#6E7485] dark:fill-slate-500 text-[9px] font-mono"
                  >
                    {tick.label}
                  </text>
                ))}
              </svg>

              {/* Selected Deliverable Footnote */}
              <div className="mt-2 pt-2.5 border-t border-[#E4DFD5] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="font-semibold text-[#1E222D] dark:text-slate-100 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#5D55D6] dark:text-[#818CF8]" />
                  <span>
                    {selectedItem.key}: {selectedItem.title}
                  </span>
                </span>
                <span className="font-mono text-[#4E5565] dark:text-slate-400 tabular-nums">
                  {selectedItem.points} &bull; Owner: {selectedItem.owner}
                </span>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Live Deliverable Ledger */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-[#F6F3ED]/60 dark:bg-[#0B0E14] flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E222D] dark:text-white">
                  <Layers className="w-3.5 h-3.5 text-[#5D55D6] dark:text-[#818CF8]" />
                  <span>Active Sprint Deliverables</span>
                </div>
                <span className="text-[10px] font-mono text-[#6E7485] dark:text-slate-400">
                  Click row to inspect
                </span>
              </div>

              <div className="space-y-2.5">
                {SPRINT_ITEMS.map((item, idx) => {
                  const isActive = idx === selectedIdx;
                  const statusTone =
                    item.status === "Verified"
                      ? "bg-[#E4F2EC] dark:bg-emerald-500/15 text-[#0F7656] dark:text-emerald-300 border-[#C5E3D5] dark:border-emerald-500/25"
                      : item.status === "In Review"
                      ? "bg-[#E3F1F7] dark:bg-sky-500/15 text-[#0369A1] dark:text-sky-300 border-[#C6E3EE] dark:border-sky-500/25"
                      : "bg-[#EAE8F8] dark:bg-[#5D55D6]/20 text-[#5D55D6] dark:text-[#818CF8] border-[#D4D0F0] dark:border-[#5D55D6]/30";

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedIdx(idx)}
                      className={`hmg-row w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[#FAF8F4] dark:bg-[#151A26] border-[#5D55D6] dark:border-[#818CF8]/70 shadow-sm"
                          : "bg-[#FAF8F4]/70 dark:bg-[#11151E] border-[#E4DFD5] dark:border-white/[0.06] hover:border-[#5D55D6]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-mono font-bold text-[#6E7485] dark:text-slate-400 shrink-0">
                            {item.key}
                          </span>
                          <span className="text-xs font-bold text-[#1E222D] dark:text-slate-100 truncate">
                            {item.title}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold shrink-0 ${statusTone}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-[#E5E0D6] dark:bg-white/[0.08] overflow-hidden">
                          <div
                            style={{ width: `${item.progress}%` }}
                            className={`hmg-bar-fill h-full rounded-full ${
                              item.progress === 100
                                ? "bg-[#0F8C65]"
                                : "bg-gradient-to-r from-[#5D55D6] to-[#0284C7]"
                            }`}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-bold tabular-nums text-[#4E5565] dark:text-slate-300 w-8 text-right">
                          {item.progress}%
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-[#6E7485] dark:text-slate-400">
                        <span>
                          {item.dept} &bull; {item.owner}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          {item.eta}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E4DFD5] dark:border-white/[0.07] flex items-center justify-between text-[11px]">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#0F7656] dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Real-time Firestore &amp; Android entitlement sync</span>
              </span>
              <span className="inline-flex items-center gap-0.5 font-mono text-[#5D55D6] dark:text-[#818CF8] font-bold">
                <span>Live</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
