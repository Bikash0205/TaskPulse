"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface BootSplashProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const BootSplash: React.FC<BootSplashProps> = ({
  onComplete,
  minDurationMs = 2180,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsMounted(false);
        onComplete?.();
      }, 400); // fade out & glide duration
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [minDurationMs, onComplete]);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#EAEBED] dark:bg-[#0B0F19] transition-all duration-400 select-none ${
        isFadingOut ? "opacity-0 -translate-y-12 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="relative w-full h-full max-w-lg max-h-[85vh] flex items-center justify-center">
        <picture className="w-full h-full flex items-center justify-center">
          <source media="(prefers-color-scheme: dark)" srcSet="/taskpulse_boot_dark.gif" />
          <img
            src="/taskpulse_boot_light.gif"
            alt="TaskPulse Boot Animation"
            className="w-full h-full object-contain"
          />
        </picture>
      </div>
    </div>
  );
};
