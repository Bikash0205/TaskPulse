"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderGlowColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(117, 110, 243, 0.12)",
  borderGlowColor = "rgba(117, 110, 243, 0.4)",
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x,
          y,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        });
      }

      if (borderRef.current) {
        gsap.to(borderRef.current, {
          x,
          y,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = () => {
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }
      if (borderRef.current) {
        gsap.to(borderRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#151C2C]/90 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-[#756EF3]/5 ${className}`}
      {...props}
    >
      {/* Interactive Radial Border Glow Follower */}
      <div
        ref={borderRef}
        className="pointer-events-none absolute -inset-px opacity-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at 0px 0px, ${borderGlowColor}, transparent 70%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* Interactive Radial Surface Spotlight */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px opacity-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(350px circle at 0px 0px, ${spotlightColor}, transparent 80%)`,
        }}
      />

      {/* Inset Specular Highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/[0.03] dark:ring-white/[0.06]" />

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
