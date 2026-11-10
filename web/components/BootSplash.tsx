"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface BootSplashProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const BootSplash: React.FC<BootSplashProps> = ({
  onComplete,
  minDurationMs = 2200,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const themeContext = useTheme();
  const isDark = themeContext ? themeContext.theme === "dark" : true;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsMounted(false);
        onComplete?.();
      }, 420); // fade out & glide duration
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [minDurationMs, onComplete]);

  if (!isMounted) return null;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#0B0F19] transition-all duration-500 ease-out select-none ${
        isFadingOut ? "opacity-0 -translate-y-8 pointer-events-none scale-98" : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      <div className="relative w-full h-full max-w-2xl max-h-[90vh] flex items-center justify-center p-4 sm:p-8">
        <img
          src={isDark ? `${basePath}/taskpulse_animated_dark.svg` : `${basePath}/taskpulse_animated.svg`}
          alt="TaskPulse Vector Boot Animation"
          className="w-full h-auto max-h-full object-contain filter drop-shadow-2xl"
          loading="eager"
        />
      </div>
    </div>
  );
};

