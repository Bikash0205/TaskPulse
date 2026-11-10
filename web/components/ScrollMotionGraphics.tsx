"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Sparkles,
  Calendar,
  Users,
  ArrowRight,
  Activity,
  ShieldCheck,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface StageNode {
  id: string;
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentGradient: string;
  metric: string;
}

export const ScrollMotionGraphics: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".smg-heading", {
          y: 22,
          opacity: 0,
          duration: 0.65,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
            once: true,
          },
        });

        gsap.from(".smg-card", {
          y: 28,
          opacity: 0,
          scale: 0.98,
          stagger: 0.1,
          duration: 0.65,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: ".smg-grid",
            start: "top 88%",
            once: true,
          },
        });

        if (beamRef.current) {
          gsap.fromTo(
            beamRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".smg-grid",
                start: "top 85%",
                end: "bottom 55%",
                scrub: 0.8,
              },
            }
          );
        }

        setTimeout(() => ScrollTrigger.refresh(), 300);
      });
    },
    { scope: sectionRef }
  );

  const stages: StageNode[] = [
    {
      id: "ai",
      step: "STAGE 01",
      title: "AI Natural Triage",
      description:
        "Type requirements in plain English. TaskPulse AI extracts deadlines, priority, and subtasks cleanly.",
      icon: <Sparkles className="w-5 h-5" />,
      accentGradient: "from-[#5D55D6] to-[#7C73E6]",
      metric: "< 800ms parsing",
    },
    {
      id: "gantt",
      step: "STAGE 02",
      title: "60fps Interactive Timeline",
      description:
        "Fluid multi-lane Gantt view with automatic slack calculation and dependency tracking.",
      icon: <Calendar className="w-5 h-5" />,
      accentGradient: "from-[#0284C7] to-[#0EA5E9]",
      metric: "60fps GPU Canvas",
    },
    {
      id: "sync",
      step: "STAGE 03",
      title: "Balanced Team Dispatch",
      description:
        "Real-time bandwidth indicators balance workloads across engineers with zero surprise overloads.",
      icon: <Users className="w-5 h-5" />,
      accentGradient: "from-[#0F8C65] to-[#10B981]",
      metric: "< 85ms Cloud Sync",
    },
    {
      id: "verify",
      step: "STAGE 04",
      title: "Verified Delivery & Sign-Off",
      description:
        "Completion notes, screenshot attachments, and manager sign-off maintain an auditable log.",
      icon: <ShieldCheck className="w-5 h-5" />,
      accentGradient: "from-[#B45309] to-[#D97706]",
      metric: "SOC 2 Type II Ready",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-6xl mx-auto my-14 sm:my-24 px-4"
    >
      {/* Section Header */}
      <div className="smg-heading text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE8F8] dark:bg-[#756EF3]/15 border border-[#D4D0F0] dark:border-[#756EF3]/30 text-[#5D55D6] dark:text-[#818CF8] text-xs font-mono font-semibold mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>CONTINUOUS DELIVERY PIPELINE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1E222D] dark:text-[#F8FAFC] tracking-tight">
          How Work Flows From Idea to Verified Sign-Off
        </h2>
        <p className="text-xs sm:text-sm text-[#4E5565] dark:text-[#94A3B8] mt-2.5">
          Scroll-choreographed workflow telemetry from natural language triage to manager verification.
        </p>
      </div>

      {/* Warm-Paper / Obsidian Pipeline Container */}
      <div className="smg-grid relative rounded-3xl bg-[#FAF8F4] dark:bg-[#0D1322] border border-[#DDD8CE] dark:border-white/10 p-5 sm:p-9 shadow-xl shadow-[#1E222D]/[0.04] dark:shadow-black/50 overflow-hidden">
        {/* Scroll-Scrubbed Conduit Progress Rail */}
        <div className="hidden lg:block relative h-1.5 mb-7 rounded-full bg-[#EAE6DC] dark:bg-white/10 overflow-hidden">
          <div
            ref={beamRef}
            className="h-full w-full origin-left bg-gradient-to-r from-[#5D55D6] via-[#0EA5E9] to-[#10B981] rounded-full"
          />
        </div>

        {/* 4 Interactive Pipeline Stages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
          {stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={`smg-card text-left p-5 rounded-2xl transition-colors transition-shadow duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  isActive
                    ? "bg-[#FAF8F4] dark:bg-[#1B2438] border-2 border-[#5D55D6] dark:border-[#818CF8] shadow-lg -translate-y-1"
                    : "bg-[#F2EFE8] dark:bg-[#131B2E] border border-[#DDD8CE] dark:border-slate-700/60 hover:border-[#5D55D6]/50 hover:bg-[#FAF8F4] dark:hover:bg-[#1A253E]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#6E7485] dark:text-slate-300 uppercase">
                      {stage.step}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? "bg-[#EAE8F8] dark:bg-emerald-400/20 text-[#5D55D6] dark:text-emerald-300 border border-[#D4D0F0] dark:border-emerald-400/40"
                          : "bg-[#E6E2D8] dark:bg-white/5 text-[#4E5565] dark:text-slate-300"
                      }`}
                    >
                      {stage.metric}
                    </span>
                  </div>

                  {/* Icon Badge */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 ${
                      isActive
                        ? `bg-gradient-to-tr ${stage.accentGradient} text-white shadow-md scale-105`
                        : "bg-[#EAE6DC] dark:bg-white/10 text-[#4E5565] dark:text-slate-200 border border-[#DDD8CE] dark:border-white/15"
                    }`}
                  >
                    {stage.icon}
                  </div>

                  <h3 className="text-sm font-bold text-[#1E222D] dark:text-white mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-[#4E5565] dark:text-slate-300 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5E0D6] dark:border-white/10 flex items-center justify-between text-[11px] font-semibold text-[#6E7485] dark:text-slate-300">
                  <span className={isActive ? "text-[#5D55D6] dark:text-[#818CF8] font-bold" : ""}>
                    {isActive ? "Active Phase" : "Inspect Step"}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? "translate-x-1 text-[#5D55D6] dark:text-[#818CF8]" : ""
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
