/**
 * TaskPulse Design System Tokens
 * Engineered for Tier-3 Glassmorphic Surfaces and 120Hz Framer Motion pipelines.
 */

export const TaskPulseTokens = {
  colors: {
    canvas: {
      base: "#070A13", // Obsidian Navy
      surface: "rgba(15, 23, 42, 0.55)", // Tier 3 Glass Fill
      elevated: "rgba(30, 41, 59, 0.65)",
      border: "rgba(255, 255, 255, 0.09)",
      borderHighlight: "rgba(255, 255, 255, 0.18)",
    },
    brand: {
      blue: "#2563EB", // Electric Royal Blue (Pulse Wave)
      blueGlow: "rgba(37, 99, 235, 0.4)",
      emerald: "#10B981", // Emerald Surge (Velocity Arrow)
      emeraldGlow: "rgba(16, 185, 129, 0.45)",
    },
    capacity: {
      normal: {
        hex: "#10B981",
        label: "Optimal Bandwidth",
        glow: "rgba(16, 185, 129, 0.25)",
        border: "rgba(16, 185, 129, 0.35)",
        badgeBg: "rgba(16, 185, 129, 0.12)",
      },
      warning: {
        hex: "#F59E0B",
        label: "High Capacity (>4 Tasks)",
        glow: "rgba(245, 158, 11, 0.25)",
        border: "rgba(245, 158, 11, 0.4)",
        badgeBg: "rgba(245, 158, 11, 0.12)",
      },
      overload: {
        hex: "#EF4444",
        label: "Overloaded / Blocked",
        glow: "rgba(239, 68, 68, 0.3)",
        border: "rgba(239, 68, 68, 0.45)",
        badgeBg: "rgba(239, 68, 68, 0.14)",
      },
    },
  },
  glass: {
    tier3: {
      background: "rgba(15, 23, 42, 0.55)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      border: "1px solid rgba(255, 255, 255, 0.09)",
      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    },
    tier3Active: {
      background: "rgba(30, 41, 59, 0.7)",
      backdropFilter: "blur(28px)",
      WebkitBackdropFilter: "blur(28px)",
      border: "1px solid rgba(255, 255, 255, 0.18)",
      boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.5)",
    },
  },
  // 120Hz Certified Physics (Spring config under 8.33ms budget, zero layout thrashing)
  motion: {
    springFast: {
      type: "spring" as const,
      stiffness: 420,
      damping: 28,
      mass: 0.8,
    },
    springSmooth: {
      type: "spring" as const,
      stiffness: 350,
      damping: 32,
      mass: 1.0,
    },
    springDrag: {
      type: "spring" as const,
      stiffness: 500,
      damping: 25,
      mass: 0.6,
    },
  },
};

export default TaskPulseTokens;
