import React from "react";

interface TaskPulseLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeMap = {
  sm: { width: 140, height: 42, fontSize: 18, textY: 34 },
  md: { width: 200, height: 60, fontSize: 24, textY: 38 },
  lg: { width: 260, height: 78, fontSize: 32, textY: 42 },
};

/**
 * TaskPulse Concept C Visual Identity Mark
 * 
 * Vector Specifications:
 * - ViewBox: "0 0 200 60"
 * - Mark Geometry: ECG-style heartbeat polyline transitioning into an upward-surging 45° arrow.
 * - Path 1 (Pulse Line): #2563EB (Electric Royal Blue), strokeWidth="4", round caps/joins.
 * - Path 2 (Ascending Arrow Head): #10B981 (Emerald Green), strokeWidth="4".
 * - Dynamic SVG Glow Filter: stdDeviation="2.5" with feMerge ambient backlight.
 * - Typography: Inter / Plus Jakarta Sans weight 700, #FFFFFF, letter-spacing -0.03em.
 */
export const TaskPulseLogo: React.FC<TaskPulseLogoProps> = ({
  className = "",
  size = "md",
  showText = true,
}) => {
  const currentSize = sizeMap[size];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={showText ? "0 0 270 60" : "0 0 120 60"}
      width={showText ? currentSize.width * 1.25 : currentSize.height * 2}
      height={currentSize.height}
      fill="none"
      className={`select-none ${className}`}
      role="img"
      aria-label="TaskPulse Logo"
    >
      <defs>
        {/* Dynamic Glow Filter for Emerald Arrow Head & Pulse Apex */}
        <filter id="emerald-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              0 0 0 0 0.062
              0 0 0 0 0.725
              0 0 0 0 0.505
              0 0 0 0.85 0"
            result="coloredBlur"
          />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Ambient Electric Blue Glow for ECG Base */}
        <filter id="pulse-blue-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Emerald Gradient for Arrowhead */}
        <linearGradient id="arrow-grad" x1="95" y1="25" x2="105" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Electric Royal Blue Linear Gradient */}
        <linearGradient id="pulse-grad" x1="10" y1="35" x2="105" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="60%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      {/* Group: Mark Geometry */}
      <g id="pulse-mark">
        {/* Ambient Shadow/Glow Underlayer */}
        <polyline
          points="10,35 30,35 40,48 55,18 68,42 80,28 92,35 105,15"
          stroke="#2563EB"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.25"
          filter="url(#pulse-blue-glow)"
        />

        {/* Path 1: Core Pulse Line (ECG Heartbeat) */}
        <polyline
          points="10,35 30,35 40,48 55,18 68,42 80,28 92,35 105,15"
          stroke="url(#pulse-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Path 2: Ascending Arrow Head (Emerald Surge) with Dynamic Glow */}
        <polyline
          points="95,15 105,15 105,25"
          stroke="url(#arrow-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#emerald-glow)"
        />

        {/* Dynamic Pulse Apex Indicator */}
        <circle
          cx="105"
          cy="15"
          r="3"
          fill="#FFFFFF"
          filter="url(#emerald-glow)"
        />
      </g>

      {/* Group: Typography */}
      {showText && (
        <text
          x="122"
          y={currentSize.textY}
          fill="#FFFFFF"
          fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize={currentSize.fontSize}
          letterSpacing="-0.03em"
          style={{ textRendering: "geometricPrecision" }}
        >
          Task<tspan fill="#34D399">Pulse</tspan>
        </text>
      )}
    </svg>
  );
};

export default TaskPulseLogo;
