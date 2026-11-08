"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface FluidNeumorphicThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const FluidNeumorphicThemeToggle: React.FC<FluidNeumorphicThemeToggleProps> = ({
  className = "",
  size = "md",
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Dimensions based on size
  const dimensions = {
    sm: { trackW: "w-14", trackH: "h-7", thumbSize: 22, offsetRight: 28 },
    md: { trackW: "w-20 sm:w-22", trackH: "h-10 sm:h-11", thumbSize: 34, offsetRight: 40 },
    lg: { trackW: "w-28", trackH: "h-14", thumbSize: 44, offsetRight: 56 },
  }[size];

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`group relative select-none rounded-full transition-all duration-500 cursor-pointer p-1 outline-none focus-visible:ring-2 focus-visible:ring-[#756EF3] ${className}`}
    >
      {/* 1. Track Outer Chassis with Neumorphic Bevel */}
      <div
        className={`relative ${dimensions.trackW} ${dimensions.trackH} rounded-full transition-colors duration-500 overflow-hidden flex items-center ${
          isDark
            ? "bg-[#0B0F19] border border-white/10 shadow-[inset_0_3px_8px_rgba(0,0,0,0.8),0_1px_2px_rgba(255,255,255,0.05)]"
            : "bg-[#E2E8F0] border border-slate-300 shadow-[inset_0_2px_6px_rgba(0,0,0,0.15),0_1px_3px_rgba(255,255,255,0.8)]"
        }`}
      >
        {/* Ambient Glow Diffusion on Track */}
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
            isDark ? "opacity-40" : "opacity-30"
          }`}
          style={{
            background: isDark
              ? "radial-gradient(ellipse at 25% 50%, rgba(99, 102, 241, 0.35), transparent 70%)"
              : "radial-gradient(ellipse at 75% 50%, rgba(245, 158, 11, 0.4), transparent 70%)",
          }}
        />

        {/* 2. Fluid Sliding Thumb (Squircle Knob) */}
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 32,
            mass: 0.8,
          }}
          animate={{
            x: isDark ? 2 : dimensions.offsetRight,
          }}
          className={`relative rounded-2xl flex items-center justify-center transition-all duration-500 ${
            isDark
              ? "bg-[#1E2538] shadow-[0_4px_12px_rgba(0,0,0,0.6),0_1px_1px_rgba(255,255,255,0.15)]"
              : "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.08)]"
          }`}
          style={{
            width: dimensions.thumbSize,
            height: dimensions.thumbSize,
          }}
        >
          {/* Neon Specular Rim Light Arc (Exact replica of video) */}
          <div
            className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-all duration-500 ${
              isDark
                ? "border-t-2 border-l-2 border-indigo-400 shadow-[inset_2px_2px_6px_rgba(129,140,248,0.7),0_0_12px_rgba(99,102,241,0.6)]"
                : "border-t-2 border-l-2 border-amber-400 shadow-[inset_2px_2px_6px_rgba(251,191,36,0.8),0_0_14px_rgba(245,158,11,0.65)]"
            }`}
          />

          {/* 3. Pixel Matrix Glyphs (Moon Matrix in Dark Mode / Sun Burst in Light Mode) */}
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="moon-matrix"
                initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: 25 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative w-4 h-4 flex items-center justify-center"
              >
                {/* SVG Crescent Moon Particle Cluster */}
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
                  {/* Digital Pixel Blocks forming Crescent Moon */}
                  <rect x="7" y="2" width="2" height="2" fill="#FFFFFF" className="animate-pulse" />
                  <rect x="5" y="3" width="2" height="2" fill="#E2E8F0" />
                  <rect x="4" y="5" width="2" height="2" fill="#C7D2FE" />
                  <rect x="3" y="7" width="2" height="2" fill="#818CF8" />
                  <rect x="4" y="9" width="2" height="2" fill="#C7D2FE" />
                  <rect x="5" y="11" width="2" height="2" fill="#E2E8F0" />
                  <rect x="7" y="12" width="2" height="2" fill="#FFFFFF" />
                  {/* Subtle scattered star pixels */}
                  <rect x="10" y="4" width="1.5" height="1.5" fill="#93C5FD" opacity="0.9" />
                  <rect x="12" y="8" width="1.5" height="1.5" fill="#A5B4FC" opacity="0.8" />
                  <rect x="9" y="10" width="1.5" height="1.5" fill="#C4B5FD" opacity="0.7" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="sun-matrix"
                initial={{ opacity: 0, scale: 0.6, rotate: 25 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: -25 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative w-4 h-4 flex items-center justify-center"
              >
                {/* SVG Radiant Sun Matrix Cluster */}
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
                  {/* Center Sun Core Matrix */}
                  <rect x="6" y="6" width="4" height="4" fill="#0F172A" rx="1" />
                  {/* Sun Rays Blocks */}
                  <rect x="7" y="2" width="2" height="2" fill="#D97706" />
                  <rect x="7" y="12" width="2" height="2" fill="#D97706" />
                  <rect x="2" y="7" width="2" height="2" fill="#D97706" />
                  <rect x="12" y="7" width="2" height="2" fill="#D97706" />
                  {/* Diagonal Ray Pixels */}
                  <rect x="3.5" y="3.5" width="1.5" height="1.5" fill="#B45309" />
                  <rect x="11" y="3.5" width="1.5" height="1.5" fill="#B45309" />
                  <rect x="3.5" y="11" width="1.5" height="1.5" fill="#B45309" />
                  <rect x="11" y="11" width="1.5" height="1.5" fill="#B45309" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </button>
  );
};
