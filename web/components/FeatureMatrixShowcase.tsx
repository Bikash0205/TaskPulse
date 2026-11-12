"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type FeatureGraphicId =
  | "dispatcher"
  | "gantt"
  | "presence"
  | "exports"
  | "discussions"
  | "rbac"
  | "billing"
  | "responsive";

interface FeatureTile {
  id: FeatureGraphicId;
  tag: string;
  title: string;
  desc: string;
}

const FEATURES: FeatureTile[] = [
  {
    id: "dispatcher",
    tag: "DISPATCHER",
    title: "Sections, Kanban & Table",
    desc: "Switch views per project with nested subtask checklists and priority filters.",
  },
  {
    id: "gantt",
    tag: "TIMELINE",
    title: "Gantt & Critical Path",
    desc: "Visualize sprint durations, dependencies, and target delivery dates cleanly.",
  },
  {
    id: "presence",
    tag: "PRESENCE",
    title: "Live Peer Telemetry",
    desc: "See real active teammates in your organization workspace without mock noise.",
  },
  {
    id: "exports",
    tag: "EXPORTS",
    title: "Corporate Audit Exports",
    desc: "Generate structured CSV, JSON, and executive summary printouts on demand.",
  },
  {
    id: "discussions",
    tag: "DISCUSSIONS",
    title: "Threaded Task Reviews",
    desc: "Resolve blockers and manager feedback directly inside each project thread.",
  },
  {
    id: "rbac",
    tag: "RBAC",
    title: "Role & Project Scoping",
    desc: "Assign Managers, Members, and Viewers to scoped projects and departments.",
  },
  {
    id: "billing",
    tag: "BILLING",
    title: "Hybrid Plan Quotas",
    desc: "Combine 14-day Web trials, UPI/invoices, and Google Play purchases in real time.",
  },
  {
    id: "responsive",
    tag: "RESPONSIVE",
    title: "Auto Desktop & Mobile UI",
    desc: "Browsers detect device form factor automatically alongside native Android sync.",
  },
];

const FeatureVectorGraphic: React.FC<{ id: FeatureGraphicId }> = ({ id }) => {
  switch (id) {
    case "dispatcher":
      return (
        <svg viewBox="0 0 240 84" className="w-full h-20">
          {[10, 86, 162].map((x) => (
            <rect
              key={x}
              x={x}
              y="8"
              width="68"
              height="68"
              rx="8"
              fill="currentColor"
              className="text-[#EAE6DC]/75 dark:text-white/[0.04]"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
          <rect x="16" y="16" width="56" height="16" rx="4" fill="#0F8C65" fillOpacity="0.22" stroke="#0F8C65" strokeWidth="1" />
          <rect x="92" y="16" width="56" height="16" rx="4" fill="#0284C7" fillOpacity="0.22" stroke="#0284C7" strokeWidth="1" />
          <rect
            className="fm-kanban-card"
            x="16"
            y="40"
            width="56"
            height="22"
            rx="5"
            fill="#5D55D6"
          />
          <line x1="23" y1="48" x2="54" y2="48" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" className="fm-kanban-card" />
          <line x1="23" y1="55" x2="44" y2="55" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" className="fm-kanban-card" />
        </svg>
      );

    case "gantt":
      return (
        <svg viewBox="0 0 240 84" className="w-full h-20">
          {[58, 120, 182].map((x) => (
            <line key={x} x1={x} y1="8" x2={x} y2="76" stroke="currentColor" className="text-[#DDD8CE] dark:text-white/[0.07]" strokeWidth="1" />
          ))}
          <rect className="fm-gantt-bar" x="14" y="14" width="84" height="14" rx="4" fill="#5D55D6" />
          <rect className="fm-gantt-bar" x="88" y="36" width="78" height="14" rx="4" fill="#0284C7" />
          <rect className="fm-gantt-bar" x="152" y="58" width="74" height="14" rx="4" fill="#0F8C65" />
          <path className="fm-stroke-draw" d="M 98,21 L 108,21 L 108,35" stroke="#5D55D6" strokeWidth="1.5" fill="none" />
          <path className="fm-stroke-draw" d="M 166,43 L 176,43 L 176,57" stroke="#0284C7" strokeWidth="1.5" fill="none" />
        </svg>
      );

    case "presence":
      return (
        <svg viewBox="0 0 240 84" className="w-full h-20">
          <rect x="14" y="12" width="212" height="60" rx="10" fill="none" stroke="currentColor" className="text-[#DDD8CE] dark:text-white/[0.08]" strokeDasharray="3 3" />
          <circle cx="62" cy="42" r="5" fill="#0F8C65" fillOpacity="0.25" />
          <circle cx="178" cy="34" r="5" fill="#5D55D6" fillOpacity="0.25" />
          <g className="fm-cursor-a" transform="translate(52, 32)">
            <path d="M0 0 L12 6 L7 8 L5 13 Z" fill="#5D55D6" />
            <rect x="12" y="8" width="38" height="13" rx="6" fill="#5D55D6" />
            <text x="17" y="17" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" fontWeight="700">Sarah</text>
          </g>
          <g className="fm-cursor-b" transform="translate(152, 42)">
            <path d="M0 0 L12 6 L7 8 L5 13 Z" fill="#0F8C65" />
            <rect x="12" y="8" width="44" height="13" rx="6" fill="#0F8C65" />
            <text x="17" y="17" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" fontWeight="700">Marcus</text>
          </g>
        </svg>
      );

    case "exports":
      return (
        <svg viewBox="0 0 240 84" className="w-full h-20">
          <rect x="20" y="12" width="112" height="60" rx="8" fill="none" stroke="currentColor" className="text-[#DDD8CE] dark:text-white/[0.1]" />
          <line className="fm-export-line" x1="32" y1="26" x2="116" y2="26" stroke="#5D55D6" strokeWidth="3" strokeLinecap="round" />
          <line className="fm-export-line" x1="32" y1="40" x2="98" y2="40" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          <line className="fm-export-line" x1="32" y1="54" x2="110" y2="54" stroke="#0F8C65" strokeWidth="3" strokeLinecap="round" />
          <g className="fm-export-badge">
            <rect x="150" y="20" width="70" height="44" rx="8" fill="#0F8C65" fillOpacity="0.14" stroke="#0F8C65" strokeWidth="1.2" />
            <text x="185" y="40" textAnchor="middle" fill="#0F8C65" fontSize="9" fontFamily="monospace" fontWeight="800">CSV / PDF</text>
            <path d="M 185,46 L 185,56 M 180,52 L 185,57 L 190,52" stroke="#0F8C65" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        </svg>
      );

    case "discussions":
      return (
        <svg viewBox="0 0 240 84" className="w-full h-20">
          <path className="fm-stroke-draw" d="M 30,22 L 30,64 L 46,64" stroke="#5D55D6" strokeWidth="1.6" fill="none" />
          <g className="fm-thread-msg">
            <rect x="20" y="12" width="160" height="22" rx="7" fill="#EAE8F8" stroke="#5D55D6" strokeOpacity="0.45" />
            <circle cx="32" cy="23" r="4" fill="#5D55D6" />
            <line x1="42" y1="23" x2="156" y2="23" stroke="#5D55D6" strokeOpacity="0.65" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g className="fm-thread-msg">
            <rect x="46" y="48" width="174" height="24" rx="7" fill="#E4F2EC" stroke="#0F8C65" strokeOpacity="0.5" />
            <path d="M 56,60 L 60,64 L 67,56" stroke="#0F8C65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="76" y1="60" x2="200" y2="60" stroke="#0F8C65" strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "rbac":
      return (
        <svg viewBox="0 0 240 84" className="w-full h-20">
          <path className="fm-stroke-draw" d="M 120,26 L 46,56 M 120,26 L 120,56 M 120,26 L 194,56" stroke="#5D55D6" strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
          <rect x="86" y="8" width="68" height="20" rx="10" fill="#5D55D6" />
          <text x="120" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="700">ORG ADMIN</text>
          {[
            { x: 18, label: "MGR", color: "#0284C7" },
            { x: 92, label: "MEM", color: "#0F8C65" },
            { x: 166, label: "VIEW", color: "#D97706" },
          ].map((node) => (
            <g key={node.label} className="fm-rbac-node">
              <rect x={node.x} y="54" width="56" height="20" rx="6" fill={node.color} fillOpacity="0.18" stroke={node.color} strokeWidth="1.2" />
              <text x={node.x + 28} y="67" textAnchor="middle" fill={node.color} fontSize="8" fontFamily="monospace" fontWeight="800">
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      );

    case "billing":
      return (
        <svg viewBox="0 0 240 84" className="w-full h-20">
          <rect x="14" y="24" width="62" height="36" rx="8" fill="#EAE8F8" stroke="#5D55D6" strokeWidth="1.2" />
          <text x="45" y="45" textAnchor="middle" fill="#5D55D6" fontSize="8.5" fontFamily="monospace" fontWeight="800">WEB 14d</text>
          <rect x="164" y="24" width="62" height="36" rx="8" fill="#E4F2EC" stroke="#0F8C65" strokeWidth="1.2" />
          <text x="195" y="45" textAnchor="middle" fill="#0F8C65" fontSize="8.5" fontFamily="monospace" fontWeight="800">PLAY</text>
          <line x1="80" y1="42" x2="160" y2="42" stroke="#5D55D6" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="4 4" />
          <circle className="fm-billing-dot" cx="84" cy="42" r="5" fill="#5D55D6" />
        </svg>
      );

    case "responsive":
      return (
        <svg viewBox="0 0 240 84" className="w-full h-20">
          <g className="fm-device-desktop">
            <rect x="22" y="14" width="112" height="56" rx="7" fill="none" stroke="#5D55D6" strokeWidth="1.5" />
            <rect x="30" y="22" width="32" height="40" rx="4" fill="#5D55D6" fillOpacity="0.16" />
            <rect x="68" y="22" width="58" height="16" rx="4" fill="#0284C7" fillOpacity="0.24" />
            <rect x="68" y="44" width="58" height="18" rx="4" fill="#0F8C65" fillOpacity="0.22" />
          </g>
          <path className="fm-stroke-draw" d="M 140,42 L 166,42" stroke="#0F8C65" strokeWidth="1.6" strokeDasharray="3 3" />
          <g className="fm-device-mobile">
            <rect x="172" y="12" width="42" height="62" rx="8" fill="none" stroke="#0F8C65" strokeWidth="1.6" />
            <rect x="179" y="22" width="28" height="14" rx="3" fill="#5D55D6" fillOpacity="0.28" />
            <rect x="179" y="40" width="28" height="22" rx="3" fill="#0F8C65" fillOpacity="0.25" />
          </g>
        </svg>
      );
  }
};

export const FeatureMatrixShowcase: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".lp-matrix-tile", {
          y: 24,
          opacity: 0,
          scale: 0.97,
          stagger: 0.06,
          duration: 0.55,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: gridRef.current, start: "top 86%", once: true },
        });

        // Continuous subtle micro-motion loops inside SVG graphics
        gsap.to(".fm-kanban-card", {
          x: 76,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          repeatDelay: 0.8,
          ease: "power2.inOut",
        });

        gsap.from(".fm-gantt-bar", {
          scaleX: 0.25,
          transformOrigin: "left center",
          stagger: 0.14,
          duration: 1.1,
          repeat: -1,
          yoyo: true,
          repeatDelay: 1.6,
          ease: "power2.inOut",
        });

        gsap.to(".fm-cursor-a", {
          x: 34,
          y: -10,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".fm-cursor-b", {
          x: -28,
          y: -14,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".fm-billing-dot", {
          x: 72,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });

        gsap.from(".fm-export-line", {
          scaleX: 0.35,
          transformOrigin: "left center",
          stagger: 0.15,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".fm-export-badge", {
          y: -3,
          duration: 1.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.from(".fm-thread-msg", {
          y: 6,
          opacity: 0.65,
          stagger: 0.3,
          duration: 1.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".fm-rbac-node", {
          y: -3,
          stagger: 0.2,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".fm-device-mobile", {
          y: -3,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: gridRef }
  );

  return (
    <div ref={gridRef} className="mt-5 sm:mt-6">
      <div className="sm:hidden flex items-center justify-between text-[11px] font-mono text-[#5D55D6] mb-2">
        <span>8 Core Modules</span>
        <span>Swipe &rarr;</span>
      </div>
      <div className="lp-matrix-grid flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 text-left [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FEATURES.map((feat) => (
          <div
            key={feat.id}
            className="lp-matrix-tile group shrink-0 w-[76vw] max-w-[286px] sm:w-auto sm:max-w-none snap-start p-4 rounded-xl bg-[#FAF8F4] dark:bg-[#0D1017] border border-[#DDD8CE] dark:border-white/[0.08] hover:border-[#5D55D6]/60 transition-colors flex flex-col justify-between gap-2.5 sm:gap-3"
          >
            <div className="rounded-lg bg-[#F2EFE8]/85 dark:bg-[#131720] border border-[#E4DFD5] dark:border-white/[0.06] p-2 overflow-hidden">
              <FeatureVectorGraphic id={feat.id} />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#5D55D6] dark:text-[#818CF8]">
                {feat.tag}
              </span>
              <h4 className="text-sm font-bold text-[#1E222D] dark:text-white mt-0.5">{feat.title}</h4>
              <p className="text-xs text-[#4E5565] dark:text-slate-400 mt-1 leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
