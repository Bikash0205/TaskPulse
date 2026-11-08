"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
} from "lucide-react";

interface StageNode {
  id: string;
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
  metric: string;
}

export const ScrollMotionGraphics: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-cycle through the stages for active motion
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const stages: StageNode[] = [
    {
      id: "ai",
      step: "STAGE 01",
      title: "Gemini AI Natural Triage",
      description: "Type requirements in plain English. Gemini Pro parses deadlines, priority, and subtasks instantly.",
      icon: <Sparkles className="w-5 h-5 text-violet-400" />,
      gradient: "from-[#756EF3] to-purple-600",
      glowColor: "rgba(117, 110, 243, 0.4)",
      metric: "< 800ms parsing",
    },
    {
      id: "gantt",
      step: "STAGE 02",
      title: "60fps Interactive Timeline",
      description: "Fluid multi-lane Gantt chart with automatic slack calculation and instant dependency snapping.",
      icon: <Calendar className="w-5 h-5 text-cyan-400" />,
      gradient: "from-cyan-500 to-blue-600",
      glowColor: "rgba(6, 182, 212, 0.4)",
      metric: "60fps GPU Canvas",
    },
    {
      id: "sync",
      step: "STAGE 03",
      title: "Real-time Team Dispatch",
      description: "Live bandwidth indicators ensure optimal balance. Zero overloads, zero missed handoffs.",
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      gradient: "from-emerald-500 to-teal-600",
      glowColor: "rgba(16, 185, 129, 0.4)",
      metric: "12ms WebSocket Sync",
    },
    {
      id: "verify",
      step: "STAGE 04",
      title: "Verified Delivery & Sign-Off",
      description: "Screenshot verification attachments and manager sign-off create an immutable enterprise audit trail.",
      icon: <ShieldCheck className="w-5 h-5 text-rose-400" />,
      gradient: "from-rose-500 to-pink-600",
      glowColor: "rgba(244, 63, 94, 0.4)",
      metric: "SOC 2 Type II Ready",
    },
  ];

  return (
    <div
      ref={sectionRef}
      className={`relative w-full max-w-6xl mx-auto my-16 sm:my-24 px-4 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {/* Radiant Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-violet-600/15 via-cyan-500/15 to-emerald-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0EFFF] dark:bg-[#756EF3]/15 border border-[#756EF3]/30 text-[#756EF3] dark:text-[#818CF8] text-xs font-mono font-semibold mb-3">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>CONTINUOUS DELIVERY PIPELINE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
          How Work Moves at 60 Frames Per Second
        </h2>
        <p className="text-xs sm:text-sm text-[#334155] dark:text-[#94A3B8] mt-2.5">
          Watch every sprint deliverable transition from idea to verified release with continuous motion and zero friction.
        </p>
      </div>

      {/* Dynamic Animated Pipeline Graphic (Solid Deep Dark Stage) */}
      <div className="relative rounded-3xl bg-[#0B0F19] dark:bg-[#070B14] border border-slate-800 dark:border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Animated Conduit Beams (SVG Motion Graphic) */}
        <div className="hidden lg:block absolute top-[112px] left-[12%] right-[12%] h-1 pointer-events-none z-0">
          <svg className="w-full h-8 -top-3.5 relative overflow-visible" fill="none">
            <defs>
              <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#756EF3" />
                <stop offset="35%" stopColor="#06B6D4" />
                <stop offset="70%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#F43F5E" />
              </linearGradient>
            </defs>
            {/* Base Conduit Path */}
            <line
              x1="0"
              y1="16"
              x2="100%"
              y2="16"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
              strokeDasharray="6 6"
            />
            {/* Animated Light Beam */}
            <line
              x1="0"
              y1="16"
              x2="100%"
              y2="16"
              stroke="url(#beamGrad)"
              strokeWidth="4"
              strokeDasharray="80 160"
              className="animate-pulse"
              style={{
                strokeDashoffset: isVisible ? "-400" : "0",
                transition: "stroke-dashoffset 4s linear infinite",
              }}
            />
          </svg>
        </div>

        {/* 4 Interactive Pipeline Stages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <div
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  isActive
                    ? "bg-[#1E293B] border-2 border-white/40 shadow-xl scale-[1.03]"
                    : "bg-[#131B2E] border border-slate-700/60 hover:border-slate-500 hover:bg-[#1A253E] opacity-90 hover:opacity-100"
                }`}
                style={{
                  boxShadow: isActive ? `0 10px 30px -10px ${stage.glowColor}` : "none",
                }}
              >
                {/* Stage Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-300 uppercase">
                      {stage.step}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/40"
                          : "text-slate-300 bg-white/5"
                      }`}
                    >
                      {stage.metric}
                    </span>
                  </div>

                  {/* Icon Orb */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 ${
                      isActive
                        ? "bg-gradient-to-tr " + stage.gradient + " shadow-lg scale-110"
                        : "bg-white/10 border border-white/15"
                    }`}
                  >
                    {stage.icon}
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                {/* Active Indicator Bar */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span className={isActive ? "text-cyan-300 font-bold" : ""}>
                    {isActive ? "Active Phase" : "Inspect Step"}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? "translate-x-1 text-cyan-300" : ""
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
