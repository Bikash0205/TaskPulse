"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export const AmbientBackground: React.FC = () => {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          x: "random(-60, 60, 5)",
          y: "random(-40, 40, 5)",
          scale: "random(0.9, 1.25, 0.05)",
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          x: "random(-80, 80, 5)",
          y: "random(-60, 60, 5)",
          scale: "random(0.85, 1.2, 0.05)",
          duration: 16,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1,
        });
      }

      if (orb3Ref.current) {
        gsap.to(orb3Ref.current, {
          x: "random(-50, 50, 5)",
          y: "random(-50, 50, 5)",
          scale: "random(0.95, 1.15, 0.05)",
          duration: 14,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* SVG Micro-Dot Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="dot-grid"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>

      {/* Floating Glowing Aurora Orbs */}
      <div
        ref={orb1Ref}
        className="absolute -top-[15%] left-[10%] w-[550px] h-[550px] rounded-full bg-[#756EF3]/15 dark:bg-[#756EF3]/10 blur-[130px] transition-colors"
      />
      <div
        ref={orb2Ref}
        className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[#3B82F6]/10 dark:bg-[#6366F1]/10 blur-[150px] transition-colors"
      />
      <div
        ref={orb3Ref}
        className="absolute -bottom-[20%] left-[25%] w-[650px] h-[650px] rounded-full bg-[#8B5CF6]/10 dark:bg-[#756EF3]/8 blur-[160px] transition-colors"
      />

      {/* Top subtle ambient gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#756EF3]/40 dark:via-[#756EF3]/60 to-transparent" />
    </div>
  );
};
