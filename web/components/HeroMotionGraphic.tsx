"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  Layers,
  Cpu,
  ArrowUpRight,
} from "lucide-react";

export const HeroMotionGraphic: React.FC = () => {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto my-8 sm:my-12 px-2 select-none">
      {/* 1. Dynamic Radiant Neon Gradient Orbs (Background Motion) */}
      <div className="absolute -top-16 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-[#756EF3]/30 via-indigo-500/25 to-pink-500/20 rounded-full blur-[100px] pointer-events-none anim-mesh-1 -z-10" />
      <div className="absolute top-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-br from-cyan-400/25 via-teal-500/20 to-emerald-500/25 rounded-full blur-[110px] pointer-events-none anim-mesh-2 -z-10" />
      <div className="absolute -bottom-10 left-1/3 w-64 sm:w-80 h-64 sm:h-80 bg-gradient-to-r from-violet-600/20 via-fuchsia-500/20 to-rose-500/20 rounded-full blur-[90px] pointer-events-none anim-mesh-3 -z-10" />

      {/* 2. Main Luminous Solid Dark Obsidian Stage */}
      <div className="relative rounded-3xl bg-[#0B0F19] dark:bg-[#070B14] border border-slate-800 dark:border-white/10 shadow-2xl p-4 sm:p-8 overflow-hidden">
        {/* Subtle Cyber Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #756EF3 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Header HUD Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="font-mono font-bold text-white tracking-wider">
              TASKPULSE HUD // LIVE TELEMETRY
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-200 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-cyan-300 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>16ms Sub-Frame Engine</span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-emerald-300 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Gemini AI Pro Online</span>
            </span>
          </div>
        </div>

        {/* 3. Central Motion Graphic Vector Canvas */}
        <div className="relative py-6 sm:py-10 flex flex-col items-center justify-center">
          <svg
            className="w-full h-48 sm:h-64 filter drop-shadow-2xl"
            viewBox="0 0 900 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="neonWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#756EF3" />
                <stop offset="35%" stopColor="#06B6D4" />
                <stop offset="70%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#F43F5E" />
              </linearGradient>

              <linearGradient id="neonWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.5" />
              </linearGradient>

              <linearGradient id="pulseGlowGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#756EF3" stopOpacity="0" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.25" />
              </linearGradient>

              <filter id="vectorGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Area Fill */}
            <path
              d="M 50,220 Q 200,80 380,180 T 720,120 L 850,160 L 850,290 L 50,290 Z"
              fill="url(#pulseGlowGrad)"
            />

            {/* Background Secondary Wave */}
            <path
              d="M 50,235 C 180,160 300,240 450,150 C 600,60 720,190 850,135"
              stroke="url(#neonWaveGrad2)"
              strokeWidth="4"
              strokeDasharray="8 6"
              fill="none"
              opacity="0.7"
            />

            {/* Main Primary High-Energy Neon Wave */}
            <path
              d="M 50,220 Q 200,80 380,180 T 720,120 L 850,160"
              stroke="url(#neonWaveGrad1)"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
              filter="url(#vectorGlow)"
            />

            {/* Active Milestone Pulse Nodes */}
            <g transform="translate(200, 105)">
              <circle r="16" fill="#756EF3" fillOpacity="0.25" className="animate-ping" />
              <circle r="9" fill="#756EF3" stroke="#FFFFFF" strokeWidth="2.5" />
            </g>

            <g transform="translate(380, 180)">
              <circle r="18" fill="#06B6D4" fillOpacity="0.3" className="animate-ping" />
              <circle r="10" fill="#06B6D4" stroke="#FFFFFF" strokeWidth="3" />
            </g>

            <g transform="translate(550, 150)">
              <circle r="20" fill="#10B981" fillOpacity="0.35" className="animate-ping" />
              <circle r="11" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" />
            </g>

            <g transform="translate(720, 120)">
              <circle r="22" fill="#F43F5E" fillOpacity="0.3" className="animate-ping" />
              <circle r="12" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="3" />
            </g>
          </svg>

          {/* 4. Floating Glass Telemetry Badges (High Contrast Solid Panels) */}
          <div className="absolute top-2 left-2 sm:left-6 p-3 sm:p-4 rounded-2xl bg-[#111827]/95 border border-white/20 shadow-2xl backdrop-blur-xl anim-float-1 text-left max-w-[210px]">
            <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Sprint Acceleration</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              +42.8%
            </div>
            <p className="text-[11px] text-slate-200 mt-0.5">
              Zero-latency issue triage
            </p>
          </div>

          <div className="absolute bottom-2 right-2 sm:right-6 p-3 sm:p-4 rounded-2xl bg-[#111827]/95 border border-white/20 shadow-2xl backdrop-blur-xl anim-float-2 text-left max-w-[230px]">
            <div className="flex items-center gap-2 text-[11px] font-bold text-cyan-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini Pro Pipeline</span>
            </div>
            <div className="text-xs font-mono font-bold text-white truncate">
              Auto-Synthesizing Sprint 15
            </div>
            <div className="mt-2 w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-cyan-400 to-[#756EF3] h-full rounded-full transition-all duration-300"
                style={{ width: `${60 + (pulsePhase % 40)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-white/10 text-left">
          <div className="flex items-center gap-2.5 text-xs text-white">
            <span className="p-2 rounded-xl bg-violet-500/25 text-violet-300 border border-violet-500/40">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-white">60fps Timeline</div>
              <div className="text-[11px] text-slate-300">Dynamic Critical Path</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-white">
            <span className="p-2 rounded-xl bg-cyan-500/25 text-cyan-300 border border-cyan-500/40">
              <Cpu className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-white">Gemini Pro AI</div>
              <div className="text-[11px] text-slate-300">Natural Language Sprint</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-white">
            <span className="p-2 rounded-xl bg-emerald-500/25 text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-white">Verified Logs</div>
              <div className="text-[11px] text-slate-300">Screenshot Sign-Offs</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-white">
            <span className="p-2 rounded-xl bg-rose-500/25 text-rose-300 border border-rose-500/40">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-white">Flat $19 Pricing</div>
              <div className="text-[11px] text-slate-300">Unlimited Workspace Seats</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
