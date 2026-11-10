"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Activity,
  CheckCircle2,
  Layers,
  Cpu,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const HeroMotionGraphic: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wavePathRef = useRef<SVGPathElement>(null);
  const secWaveRef = useRef<SVGPathElement>(null);
  const pulsePacketRef = useRef<SVGPathElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 100);
    }, 65);
    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (wavePathRef.current) {
          const length = wavePathRef.current.getTotalLength();
          gsap.set(wavePathRef.current, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
          gsap.to(wavePathRef.current, {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              once: true,
            },
          });
        }

        if (secWaveRef.current) {
          gsap.fromTo(
            secWaveRef.current,
            { opacity: 0 },
            {
              opacity: 0.55,
              duration: 1.6,
              delay: 0.25,
              ease: "power2.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                once: true,
              },
            }
          );
        }

        gsap.from(".hmg-node", {
          scale: 0,
          opacity: 0,
          transformOrigin: "center center",
          stagger: 0.16,
          duration: 0.55,
          delay: 0.5,
          ease: "back.out(1.8)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        });

        gsap.from(".hmg-float-card", {
          y: 26,
          opacity: 0,
          stagger: 0.18,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        });

        gsap.to(".hmg-badge-drift-1", {
          y: -8,
          duration: 3.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".hmg-badge-drift-2", {
          y: 8,
          duration: 4.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Traveling signal packets gliding smoothly across the primary sprint wave
        if (pulsePacketRef.current) {
          gsap.to(pulsePacketRef.current, {
            strokeDashoffset: -180,
            duration: 2.2,
            repeat: -1,
            ease: "none",
          });
        }

        // Concentric sonar ripples around milestone nodes
        gsap.fromTo(
          ".hmg-sonar",
          { scale: 1, opacity: 0.5 },
          {
            scale: 2.15,
            opacity: 0,
            transformOrigin: "center center",
            stagger: 0.45,
            duration: 2.4,
            repeat: -1,
            ease: "power2.out",
          }
        );

        // Ambient rotating telemetry orbit ring
        gsap.to(".hmg-orbit-ring", {
          rotation: 360,
          transformOrigin: "center center",
          duration: 36,
          repeat: -1,
          ease: "none",
        });

        if (counterRef.current) {
          const obj = { val: 12 };
          gsap.to(obj, {
            val: 42.8,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              once: true,
            },
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = `+${obj.val.toFixed(1)}%`;
              }
            },
          });
        }
      });
    },
    { scope: containerRef }
  );

  // Subtle interactive 3D tilt following cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(stageRef.current, {
      rotateY: relX * 4,
      rotateX: -relY * 4,
      transformPerspective: 1100,
      duration: 0.45,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!stageRef.current) return;
    gsap.to(stageRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-5xl mx-auto my-8 sm:my-12 px-2 select-none"
    >
      {/* Gentle atmospheric halos (low-glare in light mode, rich depth in dark mode) */}
      <div className="absolute -top-12 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#5D55D6]/[0.07] dark:bg-[#756EF3]/20 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#0F8C65]/[0.06] dark:bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Warm-Paper / Obsidian Telemetry Stage */}
      <div
        ref={stageRef}
        className="relative rounded-3xl bg-[#FAF8F4] dark:bg-[#0D1322] border border-[#DDD8CE] dark:border-white/10 shadow-xl shadow-[#1E222D]/[0.06] dark:shadow-black/50 p-4 sm:p-8 overflow-hidden transition-colors"
      >
        {/* Soft architectural dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.07] dark:opacity-[0.09] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #5D55D6 1px, transparent 0)`,
            backgroundSize: "26px 26px",
          }}
        />

        {/* Header HUD Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E5E0D6] dark:border-white/10 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 dark:bg-emerald-500"></span>
            </span>
            <span className="font-mono font-bold text-[#1E222D] dark:text-white tracking-wider">
              TASKPULSE TELEMETRY // LIVE VELOCITY
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded-lg bg-[#EDEAE2] dark:bg-white/10 border border-[#DDD8CE] dark:border-white/15 text-[#433CC0] dark:text-cyan-300 flex items-center gap-1.5 font-semibold">
              <Zap className="w-3 h-3" />
              <span>Sub-85ms Sync</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#E4F2EC] dark:bg-white/10 border border-[#C5E3D5] dark:border-white/15 text-[#0F7656] dark:text-emerald-300 flex items-center gap-1.5 font-semibold">
              <Activity className="w-3 h-3" />
              <span>AI Engine Online</span>
            </span>
          </div>
        </div>

        {/* Central GSAP-Animated Vector Wave Canvas */}
        <div className="relative py-8 sm:py-12 flex flex-col items-center justify-center">
          <svg
            className="w-full h-48 sm:h-64"
            viewBox="0 0 900 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="tpWavePrimary" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5D55D6" />
                <stop offset="40%" stopColor="#0EA5E9" />
                <stop offset="75%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <linearGradient id="tpWaveSecondary" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5D55D6" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#0F8C65" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#5D55D6" stopOpacity="0.25" />
              </linearGradient>

              <linearGradient id="tpWaveFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#5D55D6" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#5D55D6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area Fill */}
            <path
              d="M 50,220 Q 200,80 380,180 T 720,120 L 850,160 L 850,290 L 50,290 Z"
              fill="url(#tpWaveFill)"
            />

            {/* Secondary Reference Wave */}
            <path
              ref={secWaveRef}
              d="M 50,235 C 180,160 300,240 450,150 C 600,60 720,190 850,135"
              stroke="url(#tpWaveSecondary)"
              strokeWidth="3.5"
              strokeDasharray="8 6"
              fill="none"
            />

            {/* Subtle Orbital Telemetry Mesh */}
            <g className="hmg-orbit-ring" opacity="0.22">
              <circle cx="450" cy="160" r="128" stroke="#5D55D6" strokeWidth="1.2" strokeDasharray="6 10" fill="none" />
              <circle cx="450" cy="160" r="88" stroke="#0EA5E9" strokeWidth="1" strokeDasharray="4 8" fill="none" />
            </g>

            {/* Primary Sprint Pulse Wave */}
            <path
              ref={wavePathRef}
              d="M 50,220 Q 200,80 380,180 T 720,120 L 850,160"
              stroke="url(#tpWavePrimary)"
              strokeWidth="6.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Continuous Traveling Energy Packet Along Wave */}
            <path
              ref={pulsePacketRef}
              d="M 50,220 Q 200,80 380,180 T 720,120 L 850,160"
              stroke="#FFFFFF"
              strokeOpacity="0.85"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="24 156"
              fill="none"
            />

            {/* Milestone Nodes with Sonar Ripples */}
            <g className="hmg-node" transform="translate(200, 105)">
              <circle className="hmg-sonar" r="15" stroke="#5D55D6" strokeWidth="1.5" fill="none" />
              <circle r="15" fill="#5D55D6" fillOpacity="0.18" />
              <circle r="8.5" fill="#5D55D6" stroke="#FAF8F4" strokeWidth="2.5" />
            </g>

            <g className="hmg-node" transform="translate(380, 180)">
              <circle className="hmg-sonar" r="17" stroke="#0EA5E9" strokeWidth="1.5" fill="none" />
              <circle r="17" fill="#0EA5E9" fillOpacity="0.2" />
              <circle r="9.5" fill="#0EA5E9" stroke="#FAF8F4" strokeWidth="2.5" />
            </g>

            <g className="hmg-node" transform="translate(550, 150)">
              <circle className="hmg-sonar" r="18" stroke="#10B981" strokeWidth="1.5" fill="none" />
              <circle r="18" fill="#10B981" fillOpacity="0.22" />
              <circle r="10" fill="#10B981" stroke="#FAF8F4" strokeWidth="2.5" />
            </g>

            <g className="hmg-node" transform="translate(720, 120)">
              <circle className="hmg-sonar" r="20" stroke="#D97706" strokeWidth="1.5" fill="none" />
              <circle r="20" fill="#D97706" fillOpacity="0.2" />
              <circle r="11" fill="#D97706" stroke="#FAF8F4" strokeWidth="2.5" />
            </g>
          </svg>

          {/* Floating Warm-Paper / Obsidian Telemetry Badges */}
          <div className="hmg-float-card hmg-badge-drift-1 absolute top-2 left-2 sm:left-6 p-3.5 sm:p-4 rounded-2xl bg-[#F4F2ED]/95 dark:bg-[#151C2C]/95 border border-[#DDD8CE] dark:border-white/15 shadow-lg backdrop-blur-md text-left max-w-[210px]">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#0F7656] dark:text-emerald-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Sprint Acceleration</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#1E222D] dark:text-white font-mono">
              <span ref={counterRef}>+42.8%</span>
            </div>
            <p className="text-[11px] text-[#4E5565] dark:text-slate-300 mt-0.5">
              Zero-latency issue triage
            </p>
          </div>

          <div className="hmg-float-card hmg-badge-drift-2 absolute bottom-2 right-2 sm:right-6 p-3.5 sm:p-4 rounded-2xl bg-[#F4F2ED]/95 dark:bg-[#151C2C]/95 border border-[#DDD8CE] dark:border-white/15 shadow-lg backdrop-blur-md text-left max-w-[235px]">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#5D55D6] dark:text-cyan-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Synthesis Pipeline</span>
            </div>
            <div className="text-xs font-mono font-bold text-[#1E222D] dark:text-white truncate">
              Synthesizing Sprint Milestones
            </div>
            <div className="mt-2 w-full bg-[#E2DED4] dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#5D55D6] to-[#10B981] h-full rounded-full transition-all duration-300"
                style={{ width: `${58 + (pulsePhase % 40)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Feature Strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-[#E5E0D6] dark:border-white/10 text-left">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="p-2 rounded-xl bg-[#EAE8F8] dark:bg-violet-500/20 text-[#5D55D6] dark:text-violet-300 border border-[#D4D0F0] dark:border-violet-500/40">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-[#1E222D] dark:text-white">60fps Timeline</div>
              <div className="text-[11px] text-[#4E5565] dark:text-slate-300">Dynamic Critical Path</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <span className="p-2 rounded-xl bg-[#E3F1F7] dark:bg-cyan-500/20 text-[#0369A1] dark:text-cyan-300 border border-[#C6E3EE] dark:border-cyan-500/40">
              <Cpu className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-[#1E222D] dark:text-white">AI Task Engine</div>
              <div className="text-[11px] text-[#4E5565] dark:text-slate-300">Natural Language Sprint</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <span className="p-2 rounded-xl bg-[#E4F2EC] dark:bg-emerald-500/20 text-[#0F7656] dark:text-emerald-300 border border-[#C5E3D5] dark:border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-[#1E222D] dark:text-white">Verified Logs</div>
              <div className="text-[11px] text-[#4E5565] dark:text-slate-300">Screenshot Sign-Offs</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <span className="p-2 rounded-xl bg-[#F5ECE1] dark:bg-amber-500/20 text-[#B45309] dark:text-amber-300 border border-[#E6D4BC] dark:border-amber-500/40">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-[#1E222D] dark:text-white">Flat Team Pricing</div>
              <div className="text-[11px] text-[#4E5565] dark:text-slate-300">No Per-Seat Penalties</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
