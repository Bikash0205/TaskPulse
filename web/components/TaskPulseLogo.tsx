import React from "react";

interface TaskPulseLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  animated?: boolean;
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
 * - Canvas: ViewBox "0 0 200 60", fill="none"
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
  animated = false,
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
        {animated && (
          <style>{`
            @keyframes ecgLineDraw {
              0% {
                stroke-dashoffset: 200;
                opacity: 0.3;
              }
              50% {
                opacity: 1;
              }
              100% {
                stroke-dashoffset: 0;
                opacity: 1;
              }
            }
            @keyframes ecgArrowSurge {
              0%, 40% {
                stroke-dashoffset: 35;
                opacity: 0;
              }
              75% {
                stroke-dashoffset: 0;
                opacity: 1;
              }
              100% {
                stroke-dashoffset: 0;
                opacity: 1;
              }
            }
            @keyframes apexBlink {
              0%, 50% {
                opacity: 0;
              }
              75% {
                opacity: 1;
              }
              100% {
                opacity: 1;
              }
            }
            @keyframes glowRadiate {
              0%, 100% {
                opacity: 0.25;
              }
              50% {
                opacity: 0.85;
              }
            }
            @keyframes logoTextReveal {
              0%, 30% {
                opacity: 0;
              }
              100% {
                opacity: 1;
              }
            }
          `}</style>
        )}
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

        <filter id="pulse-blue-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="arrow-grad" x1="95" y1="25" x2="105" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        <linearGradient id="pulse-grad" x1="10" y1="35" x2="105" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="60%" stopColor="#756EF3" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      <g id="pulse-mark">
        <path
          d="M 10 35 L 30 35 L 40 48 L 55 18 L 68 42 L 80 28 L 92 35 L 105 15"
          stroke="#756EF3"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.25"
          filter="url(#pulse-blue-glow)"
          strokeDasharray="200"
          strokeDashoffset={animated ? 200 : 0}
          style={
            animated
              ? {
                  animation:
                    "glowRadiate 2s infinite ease-in-out, ecgLineDraw 1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                }
              : undefined
          }
        />

        <path
          d="M 10 35 L 30 35 L 40 48 L 55 18 L 68 42 L 80 28 L 92 35 L 105 15"
          stroke="url(#pulse-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="200"
          strokeDashoffset={animated ? 200 : 0}
          style={
            animated
              ? {
                  animation:
                    "ecgLineDraw 1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                }
              : undefined
          }
        />

        <path
          d="M 95 15 L 105 15 L 105 25"
          stroke="url(#arrow-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#emerald-glow)"
          strokeDasharray="35"
          strokeDashoffset={animated ? 35 : 0}
          style={
            animated
              ? {
                  animation:
                    "ecgArrowSurge 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                }
              : undefined
          }
        />

        <circle
          cx="105"
          cy="15"
          r="3"
          fill="#FFFFFF"
          filter="url(#emerald-glow)"
          style={
            animated
              ? {
                  animation: "apexBlink 1.1s ease-out forwards",
                }
              : undefined
          }
        />
      </g>

      {showText && (
        <text
          x="122"
          y={currentSize.textY}
          fill="currentColor"
          fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize={currentSize.fontSize}
          letterSpacing="-0.03em"
          style={
            animated
              ? {
                  animation: "logoTextReveal 0.9s ease-out forwards",
                  textRendering: "geometricPrecision",
                }
              : { textRendering: "geometricPrecision" }
          }
        >
          Task<tspan fill="#10B981">Pulse</tspan>
        </text>
      )}
    </svg>
  );
};

export default TaskPulseLogo;
