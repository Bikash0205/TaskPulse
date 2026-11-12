"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Terminal,
  Calendar,
  Activity,
  ShieldCheck,
  CheckCircle2,
  GitBranch,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface StageNode {
  id: string;
  step: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ReactNode;
  metric: string;
}

const STAGES: StageNode[] = [
  {
    id: "triage",
    step: "01",
    title: "Structured Intake & Triage",
    shortTitle: "Intake & Triage",
    description:
      "Plain deliverable briefs convert into priority-scored tasks with subtask checkpoints and owners.",
    icon: <Terminal className="w-4 h-4" />,
    metric: "Brief Parser",
  },
  {
    id: "gantt",
    step: "02",
    title: "Critical-Path Gantt Graph",
    shortTitle: "Gantt Graph",
    description:
      "Multi-lane dependency scheduling highlights slack, blockers, and release milestones automatically.",
    icon: <Calendar className="w-4 h-4" />,
    metric: "60fps",
  },
  {
    id: "sync",
    step: "03",
    title: "Hybrid Cross-Platform Sync",
    shortTitle: "Hybrid Sync",
    description:
      "Plan entitlements, tasks, and bandwidth heatmaps synchronize live across Desktop Web and Android.",
    icon: <Activity className="w-4 h-4" />,
    metric: "Sub-85ms",
  },
  {
    id: "audit",
    step: "04",
    title: "Manager Verification Gate",
    shortTitle: "Audit Gate",
    description:
      "Deliverables require evidence-backed review before closing, generating a clean compliance audit trail.",
    icon: <ShieldCheck className="w-4 h-4" />,
    metric: "100% Audit",
  },
];

export const ScrollMotionGraphics: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const spineFillRef = useRef<HTMLDivElement>(null);
  const previewStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".smg-heading", {
          y: 22,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: sectionRef.current, start: "top 86%", once: true },
        });

        gsap.from(".smg-step-btn", {
          x: -18,
          opacity: 0,
          stagger: 0.08,
          duration: 0.55,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".smg-container", start: "top 86%", once: true },
        });

        if (spineFillRef.current) {
          gsap.fromTo(
            spineFillRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".smg-container",
                start: "top 78%",
                end: "bottom 52%",
                scrub: 0.6,
              },
            }
          );
        }
      });
    },
    { scope: sectionRef }
  );

  // Animate internal diagram elements cleanly whenever activeStage changes
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".smg-anim-item",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.07, duration: 0.42, ease: "power3.out", clearProps: "transform,opacity" }
        );
        gsap.fromTo(
          ".smg-anim-bar",
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            stagger: 0.09,
            duration: 0.65,
            ease: "power3.out",
            clearProps: "transform",
          }
        );
        const paths = previewStageRef.current?.querySelectorAll(".smg-draw-path");
        paths?.forEach((p) => {
          const el = p as SVGPathElement;
          const len = el.getTotalLength();
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(el, { strokeDashoffset: 0, duration: 0.85, ease: "power2.out" });
        });
      });
    },
    { scope: previewStageRef, dependencies: [activeStage] }
  );

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-20 px-3.5 sm:px-6 max-w-[1280px] w-full mx-auto relative overflow-hidden border-t border-[#DDD8CE] dark:border-white/[0.08]"
    >
      <div className="smg-heading text-left max-w-2xl mb-6 sm:mb-10">
        <div className="text-[11px] font-mono font-semibold tracking-[0.14em] uppercase text-[#5D55D6] dark:text-[#818CF8] mb-2">
          WORKFLOW LIFECYCLE
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1E222D] dark:text-white tracking-tight">
          From initial brief to verified release sign-off.
        </h2>
        <p className="text-xs sm:text-sm text-[#4E5565] dark:text-slate-300 mt-2 leading-relaxed">
          Inspect each stage of how teams organize, track, and close sprint deliverables.
        </p>
      </div>

      {/* Asymmetric Split Enterprise Pipeline */}
      <div className="smg-container grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        {/* Left 5 Columns: Compact 2x2 Phase Grid on Mobile, Vertical Spine on Desktop */}
        <div className="lg:col-span-5 relative lg:pl-5 grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
          <div className="hidden lg:block absolute left-1.5 top-4 bottom-4 w-0.5 bg-[#E4DFD5] dark:bg-white/[0.08] rounded-full overflow-hidden">
            <div
              ref={spineFillRef}
              style={{ transform: "scaleY(0)" }}
              className="w-full h-full origin-top bg-gradient-to-b from-[#5D55D6] via-[#0284C7] to-[#0F8C65]"
            />
          </div>

          {STAGES.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={`smg-step-btn w-full text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-colors cursor-pointer relative min-h-[44px] ${
                  isActive
                    ? "bg-[#FAF8F4] dark:bg-[#141822] border-[#5D55D6] dark:border-[#818CF8] shadow-md"
                    : "bg-[#FAF8F4]/60 dark:bg-[#0D1017] border-[#E4DFD5] dark:border-white/[0.07] hover:border-[#5D55D6]/40"
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span
                      className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold ${
                        isActive
                          ? "bg-[#5D55D6] text-white"
                          : "bg-[#EAE6DC] dark:bg-white/[0.08] text-[#4E5565] dark:text-slate-300"
                      }`}
                    >
                      {stage.step}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#1E222D] dark:text-white truncate">
                      <span className="lg:hidden">{stage.shortTitle}</span>
                      <span className="hidden lg:inline">{stage.title}</span>
                    </span>
                  </div>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#EAE6DC] dark:bg-white/[0.06] text-[10px] font-mono font-bold text-[#4E5565] dark:text-slate-300 shrink-0">
                    {stage.metric}
                  </span>
                </div>
                <p className="hidden sm:block text-xs text-[#4E5565] dark:text-slate-400 leading-relaxed pl-8">
                  {stage.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right 7 Columns: Live Explanatory Diagram Canvas */}
        <div
          ref={previewStageRef}
          className="lg:col-span-7 rounded-xl bg-[#FAF8F4] dark:bg-[#0D1017] border border-[#DDD8CE] dark:border-white/[0.08] p-4 sm:p-6 flex flex-col justify-between text-left"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#E4DFD5] dark:border-white/[0.07]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#5D55D6] dark:text-[#818CF8]">
              {STAGES[activeStage].icon}
              <span>
                PHASE {STAGES[activeStage].step} // {STAGES[activeStage].title.toUpperCase()}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#6E7485] dark:text-slate-400">
              Live Telemetry Preview
            </span>
          </div>

          <div className="py-6 flex-1 flex flex-col justify-center">
            {activeStage === 0 && (
              <div className="space-y-4">
                <div className="smg-anim-item p-3.5 rounded-xl bg-[#F2EFE8] dark:bg-[#141822] border border-[#E4DFD5] dark:border-white/[0.07] font-mono text-xs text-[#1E222D] dark:text-slate-200">
                  <span className="text-[#5D55D6] dark:text-[#818CF8] font-bold">Prompt:</span>{" "}
                  &ldquo;Ship multi-tier billing gates with Marcus by Friday high priority&rdquo;
                </div>
                <svg viewBox="0 0 520 34" className="w-full h-7">
                  <path
                    d="M 260,0 L 260,16 L 90,16 L 90,34 M 260,16 L 260,34 M 260,16 L 430,16 L 430,34"
                    stroke="#5D55D6"
                    strokeWidth="1.5"
                    fill="none"
                    className="smg-draw-path"
                  />
                </svg>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Priority & SLA", val: "HIGH // Fri 18:00" },
                    { label: "Assigned Lead", val: "Marcus (60% load)" },
                    { label: "Checkpoints", val: "3 Subtasks Mapped" },
                  ].map((box) => (
                    <div
                      key={box.label}
                      className="smg-anim-item p-3 rounded-xl bg-[#F4F2ED] dark:bg-[#131720] border border-[#E4DFD5] dark:border-white/[0.07]"
                    >
                      <div className="text-[10px] font-mono uppercase text-[#6E7485] dark:text-slate-400">
                        {box.label}
                      </div>
                      <div className="text-xs font-bold text-[#1E222D] dark:text-white mt-1">
                        {box.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStage === 1 && (
              <div className="space-y-3">
                <svg viewBox="0 0 520 185" className="w-full h-44">
                  {[120, 240, 360, 480].map((x, i) => (
                    <g key={x}>
                      <line
                        x1={x}
                        y1="14"
                        x2={x}
                        y2="170"
                        stroke="currentColor"
                        className="text-[#E4DFD5] dark:text-white/[0.06]"
                        strokeWidth="1"
                      />
                      <text x={x - 16} y="12" className="fill-[#6E7485] text-[9px] font-mono">
                        {`WK 0${i + 1}`}
                      </text>
                    </g>
                  ))}
                  {/* Swimlane Gantt Bars + Attached Labels */}
                  <g className="smg-anim-bar">
                    <rect x="20" y="34" width="160" height="24" rx="5" fill="#5D55D6" />
                    <text x="30" y="50" className="fill-white text-[10px] font-mono font-bold">
                      Schema &amp; Quotas
                    </text>
                  </g>
                  <g className="smg-anim-bar">
                    <rect x="195" y="76" width="145" height="24" rx="5" fill="#0284C7" />
                    <text x="205" y="92" className="fill-white text-[10px] font-mono font-bold">
                      Hybrid Billing
                    </text>
                  </g>
                  <g className="smg-anim-bar">
                    <rect x="355" y="118" width="135" height="24" rx="5" fill="#0F8C65" />
                    <text x="365" y="134" className="fill-white text-[10px] font-mono font-bold">
                      Prod Release
                    </text>
                  </g>
                  {/* SVG Dependency Elbow Connectors */}
                  <path
                    d="M 180,46 L 210,46 L 210,74"
                    stroke="#5D55D6"
                    strokeWidth="1.8"
                    fill="none"
                    className="smg-draw-path"
                  />
                  <path
                    d="M 340,88 L 370,88 L 370,116"
                    stroke="#0284C7"
                    strokeWidth="1.8"
                    fill="none"
                    className="smg-draw-path"
                  />
                </svg>
              </div>
            )}

            {activeStage === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 items-center text-center">
                  <div className="smg-anim-item p-3.5 rounded-xl bg-[#F4F2ED] dark:bg-[#141822] border border-[#E4DFD5] dark:border-white/[0.07]">
                    <div className="text-xs font-bold text-[#1E222D] dark:text-white">Web App</div>
                    <div className="text-[10px] font-mono text-[#5D55D6] dark:text-[#818CF8] mt-0.5">
                      14-Day Trial / Quote
                    </div>
                  </div>
                  <div className="smg-anim-item p-3.5 rounded-xl bg-[#EAE8F8] dark:bg-[#5D55D6]/20 border border-[#5D55D6]/40">
                    <div className="text-xs font-bold text-[#5D55D6] dark:text-[#818CF8]">
                      Firestore Sync
                    </div>
                    <div className="text-[10px] font-mono text-[#0F8C65] dark:text-emerald-400 mt-0.5">
                      &lt; 85ms Live
                    </div>
                  </div>
                  <div className="smg-anim-item p-3.5 rounded-xl bg-[#F4F2ED] dark:bg-[#141822] border border-[#E4DFD5] dark:border-white/[0.07]">
                    <div className="text-xs font-bold text-[#1E222D] dark:text-white">Android Client</div>
                    <div className="text-[10px] font-mono text-[#0F8C65] dark:text-emerald-400 mt-0.5">
                      Google Play Verified
                    </div>
                  </div>
                </div>
                <svg viewBox="0 0 520 26" className="w-full h-6">
                  <path
                    d="M 85,13 L 435,13"
                    stroke="#0F8C65"
                    strokeWidth="2"
                    fill="none"
                    className="smg-draw-path"
                  />
                </svg>
              </div>
            )}

            {activeStage === 3 && (
              <div className="space-y-2.5">
                {[
                  "Deliverable evidence screenshot attached",
                  "Subtask checklist verified (3 / 3 passed)",
                  "Organization RBAC clearance validated",
                  "Audit entry sealed with timestamp",
                ].map((line) => (
                  <div
                    key={line}
                    className="smg-anim-item flex items-center justify-between p-3 rounded-xl bg-[#F4F2ED] dark:bg-[#141822] border border-[#E4DFD5] dark:border-white/[0.07] text-xs"
                  >
                    <span className="flex items-center gap-2 font-semibold text-[#1E222D] dark:text-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-[#0F8C65]" />
                      <span>{line}</span>
                    </span>
                    <span className="font-mono text-[10px] text-[#0F8C65] dark:text-emerald-400 font-bold">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3.5 sm:pt-4 border-t border-[#E4DFD5] dark:border-white/[0.07] flex items-center justify-between gap-3 text-[11px] text-[#6E7485] dark:text-slate-400 font-mono">
            <span className="whitespace-nowrap shrink-0">Phase {activeStage + 1} of 4</span>
            <span className="truncate text-right">
              <span className="sm:hidden">GSAP State Choreography</span>
              <span className="hidden sm:inline">Interactive GSAP Scroll &amp; State Choreography</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
