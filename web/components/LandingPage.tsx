"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TaskPulseLogo } from "./TaskPulseLogo";
import { useTheme } from "@/context/ThemeContext";
import { useViewportProfile } from "@/lib/useViewportProfile";
import { GeminiTaskArchitectBar } from "./GeminiTaskArchitectBar";
import { PricingTiersSection } from "./PricingTiersSection";
import { InteractiveProductShowcase } from "./InteractiveProductShowcase";
import { HeroMotionGraphic } from "./HeroMotionGraphic";
import { ScrollMotionGraphics } from "./ScrollMotionGraphics";
import { FeatureMatrixShowcase } from "./FeatureMatrixShowcase";
import {
  ShieldCheck,
  Zap,
  Users,
  Layers,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Lock,
  Building2,
  BarChart3,
  Sun,
  Moon,
  Activity,
  FileCheck,
  Paperclip,
  Sparkles,
  Menu,
  X as CloseIcon,
  Clock,
  GitBranch,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface LandingPageProps {
  onEnterDemo: () => void;
  onEnterMarcus: () => void;
  onEnterAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDemo,
}) => {
  const { theme, toggleTheme } = useTheme();
  const vp = useViewportProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  const heroStackRef = useRef<HTMLDivElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const marqueeTweenRef = useRef<gsap.core.Tween | null>(null);
  const latencyCountRef = useRef<HTMLSpanElement>(null);
  const uptimeCountRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Hero Kinetic Entrance Timeline
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

        heroTl
          .from(".lp-hero-pill", {
            y: 14,
            opacity: 0,
            duration: 0.45,
            clearProps: "transform,opacity",
          })
          .from(
            ".lp-hero-line",
            {
              yPercent: 100,
              opacity: 0,
              duration: 0.65,
              stagger: 0.1,
              clearProps: "transform,opacity",
            },
            "-=0.25"
          )
          .from(
            ".lp-hero-sub",
            {
              y: 14,
              opacity: 0,
              duration: 0.5,
              clearProps: "transform,opacity",
            },
            "-=0.35"
          )
          .fromTo(
            ".lp-hero-cta",
            { y: 12, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.45,
              clearProps: "transform,opacity",
            },
            "-=0.3"
          )
          .from(
            ".lp-hero-stat",
            {
              y: 12,
              opacity: 0,
              stagger: 0.08,
              duration: 0.45,
              clearProps: "transform,opacity",
            },
            "-=0.25"
          )
          .from(
            ".lp-stack-card",
            {
              y: 28,
              opacity: 0,
              scale: 0.97,
              stagger: 0.14,
              duration: 0.7,
              clearProps: "transform,opacity",
            },
            0.15
          );

        // Animate hero metric bars on load
        gsap.from(".lp-hero-bar", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.95,
          stagger: 0.12,
          delay: 0.45,
          ease: "power3.out",
          clearProps: "transform",
        });

        // Subtle continuous floating drift on floating sprint pill
        gsap.to(".lp-float-pill", {
          y: -8,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Numerical telemetry count-ups
        if (latencyCountRef.current) {
          const obj = { v: 180 };
          gsap.to(obj, {
            v: 85,
            duration: 1.35,
            delay: 0.3,
            ease: "power2.out",
            onUpdate: () => {
              if (latencyCountRef.current) {
                latencyCountRef.current.textContent = `< ${Math.round(obj.v)}ms`;
              }
            },
          });
        }

        if (uptimeCountRef.current) {
          const obj = { v: 94.0 };
          gsap.to(obj, {
            v: 99.98,
            duration: 1.45,
            delay: 0.35,
            ease: "power2.out",
            onUpdate: () => {
              if (uptimeCountRef.current) {
                uptimeCountRef.current.textContent = `${obj.v.toFixed(2)}%`;
              }
            },
          });
        }

        // 2. ScrollTrigger Bento Grid Reveal (animate transform + gentle opacity without trapping hidden elements)
        gsap.from(".lp-bento-card", {
          y: 34,
          opacity: 0,
          scale: 0.98,
          stagger: 0.1,
          duration: 0.65,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: ".lp-bento-grid",
            start: "top 88%",
            once: true,
          },
        });

        // ScrollTrigger Capacity Bars Inside Bento
        gsap.from(".lp-bento-bar", {
          scaleX: 0,
          transformOrigin: "left center",
          stagger: 0.14,
          duration: 1.0,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform",
          scrollTrigger: {
            trigger: ".lp-bento-grid",
            start: "top 85%",
            once: true,
          },
        });

        // 3. Showcase & Gemini Architect Section Reveal
        gsap.from(".lp-showcase-wrap", {
          y: 28,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: ".lp-showcase-wrap",
            start: "top 88%",
            once: true,
          },
        });

        // 4. Pricing Tier Cards Staggered ScrollTrigger Entrance
        gsap.from("#pricing .pricing-card", {
          y: 28,
          opacity: 0,
          scale: 0.97,
          stagger: 0.09,
          duration: 0.65,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: "#pricing",
            start: "top 85%",
            once: true,
          },
        });

        // 5. Scrubbed Reading Progress Indicator in Top Header
        if (scrollBarRef.current) {
          gsap.fromTo(
            scrollBarRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: pageRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.25,
              },
            }
          );
        }

        // 6. Infinite 60fps Capability Telemetry Marquee
        if (marqueeTrackRef.current) {
          marqueeTweenRef.current = gsap.to(marqueeTrackRef.current, {
            xPercent: -50,
            duration: 28,
            repeat: -1,
            ease: "none",
          });
        }

        // 7. Closing Conversion Callout Reveal
        gsap.from(".lp-callout-box", {
          y: 26,
          opacity: 0,
          scale: 0.985,
          duration: 0.65,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: ".lp-callout-box",
            start: "top 90%",
            once: true,
          },
        });

        setTimeout(() => ScrollTrigger.refresh(), 300);
      });
    },
    { scope: pageRef }
  );

  // Smooth GSAP 3D cursor tilt on hero workspace preview stack
  const handleStackMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroStackRef.current) return;
    const rect = heroStackRef.current.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width - 0.5;
    const ry = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(heroStackRef.current, {
      rotateY: rx * 7,
      rotateX: -ry * 7,
      transformPerspective: 1000,
      duration: 0.45,
      ease: "power2.out",
    });
  };

  const handleStackMouseLeave = () => {
    if (!heroStackRef.current) return;
    gsap.to(heroStackRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.65,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={pageRef}
      data-device={vp.deviceClass}
      data-orientation={vp.orientation}
      data-aspect={vp.aspectRatio}
      className="min-h-screen w-full bg-[#F4F2ED] dark:bg-[#0B0F19] text-[#1E222D] dark:text-white flex flex-col transition-colors duration-200 selection:bg-[#5D55D6]/20 selection:text-[#5D55D6] overflow-x-clip"
    >
      {/* 1. Floating Warm-Paper / Obsidian Navigation Bar */}
      <header className={`sticky top-2 sm:top-3 z-50 ${vp.containerClass} w-[96%] mx-auto rounded-2xl border border-[#DDD8CE] dark:border-white/10 bg-[#FAF8F4]/92 dark:bg-[#0B0F19]/88 backdrop-blur-2xl shadow-lg shadow-[#1E222D]/[0.04] dark:shadow-black/50 px-2.5 sm:px-6 py-2 flex items-center justify-between gap-1.5 sm:gap-3 transition-all relative overflow-hidden`}>
        <div
          ref={scrollBarRef}
          style={{ transform: "scaleX(0)" }}
          className="absolute top-0 left-0 right-0 h-[2.5px] origin-left bg-gradient-to-r from-[#5D55D6] via-[#0EA5E9] to-[#0F8C65] pointer-events-none"
        />
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#5D55D6]/40 dark:via-cyan-400/60 to-transparent pointer-events-none" />

        <div className="flex items-center gap-2 sm:gap-5 min-w-0 shrink-0">
          <TaskPulseLogo size={vp.isMobileViewport ? "sm" : "md"} />

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E4F2EC] dark:bg-emerald-500/10 border border-[#C5E3D5] dark:border-emerald-500/20 text-[10px] font-mono text-[#0F7656] dark:text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F8C65] animate-ping" />
            <span>v2.4 Live &bull; Sub-85ms</span>
          </div>

          <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-[#4E5565] dark:text-slate-200">
            <a
              href="#features"
              className="hover:text-[#5D55D6] dark:hover:text-[#818CF8] hover:bg-[#ECE8DF] dark:hover:bg-white/5 px-2.5 py-1 rounded-lg transition-all"
            >
              Capabilities
            </a>
            <a
              href="#showcase"
              className="hover:text-[#5D55D6] dark:hover:text-[#818CF8] hover:bg-[#ECE8DF] dark:hover:bg-white/5 px-2.5 py-1 rounded-lg transition-all"
            >
              Product Tour
            </a>
            <a
              href="#pipeline"
              className="hover:text-[#5D55D6] dark:hover:text-[#818CF8] hover:bg-[#ECE8DF] dark:hover:bg-white/5 px-2.5 py-1 rounded-lg transition-all"
            >
              Pipeline
            </a>
            <a
              href="#pricing"
              className="hover:text-[#5D55D6] dark:hover:text-[#818CF8] hover:bg-[#ECE8DF] dark:hover:bg-white/5 px-2.5 py-1 rounded-lg transition-all"
            >
              Pricing
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Tactile Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            data-testid="fluid-theme-toggle"
            title={theme === "dark" ? "Switch to Soft Light Mode" : "Switch to Dark Mode"}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-[#DDD8CE] dark:border-white/10 bg-[#F4F2ED] dark:bg-[#151C2C]/80 hover:bg-[#EAE6DC] dark:hover:bg-slate-800 text-[#1E222D] dark:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#5D55D6]" />
            )}
          </button>

          <Link
            href="/login"
            className="hidden sm:inline-flex whitespace-nowrap shrink-0 px-3.5 py-2 min-h-[40px] items-center rounded-xl border border-[#DDD8CE] dark:border-white/10 bg-[#FAF8F4] dark:bg-[#151C2C]/70 hover:border-[#5D55D6] text-[#1E222D] dark:text-white text-xs font-semibold shadow-2xs hover:shadow transition-all cursor-pointer"
          >
            Sign In
          </Link>

          <Link
            href="/onboarding"
            data-testid="nav-get-started-btn"
            className="whitespace-nowrap shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] rounded-xl bg-[#5D55D6] hover:bg-[#4F47C7] text-white text-xs font-semibold shadow-md shadow-[#5D55D6]/20 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>{vp.isMobileViewport ? "Start" : "Get Started"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-[#DDD8CE] dark:border-white/10 bg-[#FAF8F4] dark:bg-[#151C2C] text-[#1E222D] dark:text-white hover:bg-[#ECE8DF] dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="w-4 h-4 text-[#5D55D6]" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Sheet */}
      {isMobileMenuOpen && (
        <div className="lg:hidden sticky top-[57px] z-30 w-full bg-[#FAF8F4]/98 dark:bg-[#0B0F19]/98 border-b border-[#DDD8CE] dark:border-white/10 shadow-lg backdrop-blur-xl p-4">
          <nav className="flex flex-col gap-2 text-xs font-semibold text-[#4E5565] dark:text-slate-200">
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#EAE8F8] dark:hover:bg-[#756EF3]/15 hover:text-[#5D55D6] transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#showcase"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#EAE8F8] dark:hover:bg-[#756EF3]/15 hover:text-[#5D55D6] transition-colors"
            >
              Interactive Product Tour
            </a>
            <a
              href="#pipeline"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#EAE8F8] dark:hover:bg-[#756EF3]/15 hover:text-[#5D55D6] transition-colors"
            >
              Delivery Pipeline
            </a>
            <a
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#EAE8F8] dark:hover:bg-[#756EF3]/15 hover:text-[#5D55D6] transition-colors"
            >
              Pricing &amp; Variants
            </a>

            <div className="pt-2 border-t border-[#DDD8CE] dark:border-white/10 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl border border-[#DDD8CE] dark:border-white/10 bg-[#F4F2ED] dark:bg-[#151C2C] text-[#1E222D] dark:text-white font-semibold"
              >
                Sign In to Workspace
              </Link>
              <Link
                href="/onboarding"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl bg-[#5D55D6] hover:bg-[#4F47C7] text-white font-semibold flex items-center justify-center gap-1.5"
              >
                <span>Start Organization Onboarding</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* 2. Asymmetric Editorial Hero Section */}
      <section
        className={`relative ${
          vp.isMobileViewport ? "pt-4 pb-6" : "pt-10 sm:pt-16 pb-12 sm:pb-16"
        } ${vp.sectionPaddingClass} ${vp.containerClass} w-full mx-auto`}
      >
        {/* Soft warm atmospheric radial glow (no harsh neon glare) */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[min(560px,92vw)] h-[280px] sm:h-[340px] bg-[#5D55D6]/[0.06] dark:bg-[#756EF3]/15 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className={`grid grid-cols-1 ${vp.aspectRatio >= 1.15 ? "lg:grid-cols-12" : ""} gap-6 lg:gap-12 items-center`}>
          {/* Left 7 Columns: Kinetic Typography + Actions + Telemetry Strip */}
          <div className={`${vp.aspectRatio >= 1.15 ? "lg:col-span-7" : ""} text-left space-y-4 sm:space-y-6`}>
            <div className="lp-hero-pill inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAE8F8] dark:bg-[#756EF3]/15 border border-[#D4D0F0] dark:border-[#756EF3]/30 text-[#5D55D6] dark:text-[#818CF8] text-[11px] sm:text-xs font-semibold tracking-wide shadow-2xs">
              <Zap className="w-3.5 h-3.5" />
              <span>TaskPulse 2.0</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#5D55D6] dark:bg-[#818CF8]" />
              <span>
                {vp.isMobileViewport
                  ? "Mobile & Desktop Sync"
                  : "Calm, High-Velocity Execution"}
              </span>
            </div>

            {/* Masked Kinetic Lines */}
            <h1 className={`${vp.heroHeadingClass} font-black tracking-tight text-[#1E222D] dark:text-white leading-[1.18] sm:leading-[1.16] xl:leading-[1.16] font-sans`}>
              <span className="block overflow-hidden pb-1.5">
                <span className="lp-hero-line block leading-[1.16]">Project execution</span>
              </span>
              <span className="block overflow-hidden pb-1.5">
                <span className="lp-hero-line block leading-[1.16]">built for clarity.</span>
              </span>
              <span className="block overflow-hidden pb-2.5">
                <span className="lp-hero-line block leading-[1.18] pb-2 bg-gradient-to-r from-[#5D55D6] via-[#0284C7] to-[#0F8C65] bg-clip-text text-transparent">
                  Zero glare. Zero clutter.
                </span>
              </span>
            </h1>

            <p className="lp-hero-sub text-sm sm:text-base md:text-lg text-[#4E5565] dark:text-slate-200 max-w-xl leading-relaxed font-sans">
              Orchestrate sprint timelines, protect engineer bandwidth, and verify deliverables across desktop, Android, and iOS — powered by AI task synthesis without per-seat bloat.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
              <Link
                href="/onboarding"
                data-testid="hero-onboarding-btn"
                className="lp-hero-cta px-5 py-3.5 rounded-xl bg-[#5D55D6] hover:bg-[#4F47C7] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#5D55D6]/20 hover:shadow-lg transition-colors transition-shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Start Organization Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="lp-hero-cta px-5 py-3.5 rounded-xl bg-[#FAF8F4] dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-white/10 hover:border-[#5D55D6] text-[#1E222D] dark:text-white text-xs sm:text-sm font-semibold shadow-2xs hover:shadow transition-colors transition-shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#5D55D6]" />
                <span>Sign In to Workspace</span>
              </Link>
            </div>

            {/* Compact Live Telemetry Strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#DDD8CE] dark:border-white/10 max-w-xl">
              <div className="lp-hero-stat">
                <div className="text-lg sm:text-2xl font-black font-mono text-[#5D55D6] dark:text-[#818CF8]">
                  <span ref={latencyCountRef}>&lt; 85ms</span>
                </div>
                <div className="text-[11px] sm:text-xs text-[#4E5565] dark:text-slate-300 font-medium">
                  Edge Cloud Sync
                </div>
              </div>
              <div className="lp-hero-stat">
                <div className="text-lg sm:text-2xl font-black font-mono text-[#0F7656] dark:text-emerald-400">
                  <span ref={uptimeCountRef}>99.98%</span>
                </div>
                <div className="text-[11px] sm:text-xs text-[#4E5565] dark:text-slate-300 font-medium">
                  Sprint Availability
                </div>
              </div>
              <div className="lp-hero-stat">
                <div className="text-lg sm:text-2xl font-black font-mono text-[#1E222D] dark:text-white">
                  3-Tier
                </div>
                <div className="text-[11px] sm:text-xs text-[#4E5565] dark:text-slate-300 font-medium">
                  RBAC Audit Guard
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: GSAP 3D-Tilt Layered Live Workspace Preview Stack */}
          <div
            ref={heroStackRef}
            onMouseMove={handleStackMouseMove}
            onMouseLeave={handleStackMouseLeave}
            className={`${vp.aspectRatio >= 1.15 ? "lg:col-span-5" : ""} relative py-4 select-none`}
          >
            {/* Primary Matte Workspace Card */}
            <div className="lp-stack-card relative rounded-3xl bg-[#FAF8F4] dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-white/10 shadow-xl shadow-[#1E222D]/[0.06] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E0D6] dark:border-white/10 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#EAE8F8] dark:bg-[#756EF3]/20 text-[#5D55D6] dark:text-[#818CF8] flex items-center justify-center">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1E222D] dark:text-white">
                      Release Pipeline &bull; Q4
                    </div>
                    <div className="text-[10px] text-[#6E7485] dark:text-slate-400 font-mono">
                      3 Active Workstreams
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E4F2EC] dark:bg-emerald-950/60 text-[#0F7656] dark:text-emerald-300 text-[10px] font-bold border border-[#C5E3D5] dark:border-emerald-800">
                  Healthy Velocity
                </span>
              </div>

              {/* Animated Progress Lanes */}
              <div className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-[#1E222D] dark:text-white">Native Mobile SSO</span>
                    <span className="font-mono text-[#0F7656] dark:text-emerald-400">100%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E8E4DA] dark:bg-slate-800 overflow-hidden">
                    <div className="lp-hero-bar h-full w-full rounded-full bg-gradient-to-r from-[#0F8C65] to-[#10B981]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-[#1E222D] dark:text-white">AI Sprint Triage API</span>
                    <span className="font-mono text-[#5D55D6] dark:text-[#818CF8]">78%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E8E4DA] dark:bg-slate-800 overflow-hidden">
                    <div className="lp-hero-bar h-full w-[78%] rounded-full bg-gradient-to-r from-[#5D55D6] to-[#0284C7]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-[#1E222D] dark:text-white">Capacity Guardrail Matrix</span>
                    <span className="font-mono text-[#B45309] dark:text-amber-400">62%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E8E4DA] dark:bg-slate-800 overflow-hidden">
                    <div className="lp-hero-bar h-full w-[62%] rounded-full bg-gradient-to-r from-[#D97706] to-[#F59E0B]" />
                  </div>
                </div>
              </div>

              {/* Mini Task Proof Strip */}
              <div className="p-3 rounded-2xl bg-[#F1EEE7] dark:bg-[#0B0F19] border border-[#E5E0D6] dark:border-white/10 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-[#0F8C65] shrink-0" />
                  <span className="truncate font-semibold text-[#1E222D] dark:text-slate-100">
                    Google OAuth Workspace Lock
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#6E7485] dark:text-slate-400 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>

            {/* Floating Secondary Notification Pill */}
            <div className="lp-stack-card lp-float-pill mt-4 sm:mt-0 sm:absolute sm:-bottom-5 sm:-left-6 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B2438] border border-[#DDD8CE] dark:border-white/15 shadow-lg px-4 py-3 flex items-center gap-3 max-w-xs">
              <div className="w-9 h-9 rounded-xl bg-[#EAE8F8] dark:bg-[#756EF3]/25 text-[#5D55D6] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#1E222D] dark:text-white">
                  AI Task Synthesis Ready
                </div>
                <div className="text-[11px] text-[#4E5565] dark:text-slate-300">
                  3 subtasks auto-mapped to team capacity
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Telemetry Stage + AI Task Architect + Product Tour */}
      <section id="showcase" className={`${vp.sectionPaddingClass} ${vp.containerClass} w-full mx-auto`}>
        <HeroMotionGraphic />

        <div className="lp-showcase-wrap space-y-6 mt-4">
          <GeminiTaskArchitectBar />
          <InteractiveProductShowcase />
        </div>
      </section>

      {/* Continuous GSAP Telemetry Capability Ticker */}
      <section
        aria-label="Live Platform Capabilities"
        className="w-full overflow-hidden py-5 mt-12 border-y border-[#DDD8CE] dark:border-white/10 bg-[#FAF8F4]/70 dark:bg-[#0D1322]/70"
        onMouseEnter={() => marqueeTweenRef.current?.timeScale(0.35)}
        onMouseLeave={() => marqueeTweenRef.current?.timeScale(1)}
      >
        <div ref={marqueeTrackRef} className="flex w-max items-center gap-4 will-change-transform">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-4 pr-4">
              {[
                { label: "Sub-85ms Real-Time Sync", tag: "EDGE" },
                { label: "Hybrid Google Play + Web Trials", tag: "BILLING" },
                { label: "Role-Locked RBAC & Org Isolation", tag: "SECURITY" },
                { label: "60fps Gantt Critical Path", tag: "TIMELINE" },
                { label: "AI Sprint Task Synthesis", tag: "AUTOMATION" },
                { label: "Zero-Latency Android Offline Queue", tag: "MOBILE" },
              ].map((item) => (
                <div
                  key={`${dup}-${item.tag}`}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#F4F2ED] dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-white/10 text-xs font-semibold text-[#1E222D] dark:text-slate-100 whitespace-nowrap shadow-2xs"
                >
                  <span className="px-2 py-0.5 rounded-full bg-[#EAE8F8] dark:bg-[#5D55D6]/25 text-[#5D55D6] dark:text-[#818CF8] font-mono text-[10px] font-bold">
                    {item.tag}
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 4. Asymmetric Editorial Bento Capabilities Grid */}
      <section
        id="features"
        className={`py-10 sm:py-22 ${vp.sectionPaddingClass} ${vp.containerClass} w-full mx-auto mt-6 sm:mt-10 border-t border-[#DDD8CE] dark:border-white/10`}
      >
        <div className="max-w-2xl mb-6 sm:mb-12 text-left">
          <div className="text-xs font-bold text-[#5D55D6] dark:text-[#818CF8] tracking-wider uppercase font-mono mb-2">
            CORE CAPABILITIES
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1E222D] dark:text-white tracking-tight">
            Designed for Focused, High-Throughput Teams
          </h2>
          <p className="text-sm sm:text-base text-[#4E5565] dark:text-slate-300 mt-3 leading-relaxed">
            Every surface in TaskPulse prioritizes calm readability, clear workload boundaries, and verifiable delivery without status-meeting overhead.
          </p>
        </div>

        <div className="lp-bento-grid grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Bento Card 1 (Wide 7-col): Continuous Capacity Guardrails */}
          <div
            id="workload"
            className="lp-bento-card lg:col-span-7 p-4 sm:p-7 rounded-3xl bg-[#FAF8F4] dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-white/10 shadow-xs hover:border-[#5D55D6]/50 transition-colors flex flex-col justify-between gap-4 sm:gap-6"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#EAE8F8] dark:bg-[#756EF3]/15 text-[#5D55D6] dark:text-[#818CF8] flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#E4F2EC] dark:bg-emerald-950/60 text-[#0F7656] dark:text-emerald-300 text-[11px] font-semibold border border-[#C5E3D5] dark:border-emerald-800">
                  Real-Time Capacity Matrix
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#1E222D] dark:text-white">
                Continuous Capacity Guardrails
              </h3>
              <p className="text-xs sm:text-sm text-[#4E5565] dark:text-slate-300 mt-2 leading-relaxed max-w-xl">
                Bandwidth meters track active assignments per member so managers rebalance sprints before bottlenecks impact release milestones.
              </p>
            </div>

            {/* Embedded Live Capacity Strip */}
            <div className="p-4 rounded-2xl bg-[#F2EFE8] dark:bg-[#0B0F19] border border-[#E5E0D6] dark:border-white/10 space-y-3">
              {[
                { label: "Platform Engineering", pct: "72%", width: "w-[72%]", color: "bg-[#5D55D6]" },
                { label: "Mobile & Design Systems", pct: "48%", width: "w-[48%]", color: "bg-[#0F8C65]" },
              ].map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-[#1E222D] dark:text-slate-200">
                    <span>{row.label}</span>
                    <span className="font-mono">{row.pct} capacity</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E2DED4] dark:bg-slate-800 overflow-hidden">
                    <div className={`lp-bento-bar h-full ${row.width} ${row.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bento Card 2 (5-col): Verified Change Logs */}
          <div
            id="dispatcher"
            className="lp-bento-card lg:col-span-5 p-4 sm:p-7 rounded-3xl bg-[#FAF8F4] dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-white/10 shadow-xs hover:border-[#5D55D6]/50 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#E4F2EC] dark:bg-emerald-500/15 text-[#0F7656] dark:text-emerald-400 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1E222D] dark:text-white">
                Verified Change Logs &amp; Proof
              </h3>
              <p className="text-xs sm:text-sm text-[#4E5565] dark:text-slate-300 mt-2 leading-relaxed">
                Assignees attach implementation summaries and verification screenshots directly to completed tickets for instant lead approval.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E5E0D6] dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-[#5D55D6] dark:text-[#818CF8]">
              <Paperclip className="w-3.5 h-3.5" />
              <span>Screenshot &amp; Note Attachments Included</span>
            </div>
          </div>

          {/* Bento Card 3 (5-col): Role-Based Governance */}
          <div
            id="security"
            className="lp-bento-card lg:col-span-5 p-4 sm:p-7 rounded-3xl bg-[#FAF8F4] dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-white/10 shadow-xs hover:border-[#5D55D6]/50 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F5ECE1] dark:bg-amber-500/15 text-[#B45309] dark:text-amber-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1E222D] dark:text-white">
                Multi-Tier Role Governance
              </h3>
              <p className="text-xs sm:text-sm text-[#4E5565] dark:text-slate-300 mt-2 leading-relaxed">
                Clean permission boundaries across Administrators, Managers, Members, and Read-Only Viewers with isolated organization workspaces.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {["Super Admin", "Manager", "Member", "Viewer"].map((role) => (
                <span
                  key={role}
                  className="px-2.5 py-1 rounded-lg bg-[#EDEAE2] dark:bg-white/5 border border-[#DDD8CE] dark:border-white/10 text-[11px] font-semibold text-[#1E222D] dark:text-slate-200"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Bento Card 4 (Wide 7-col): Cross-Platform Client Parity & Onboarding */}
          <div
            id="mobile"
            className="lp-bento-card lg:col-span-7 p-4 sm:p-7 rounded-3xl bg-[#FAF8F4] dark:bg-[#151C2C] border border-[#DDD8CE] dark:border-white/10 shadow-xs hover:border-[#5D55D6]/50 transition-colors flex flex-col justify-between gap-4 sm:gap-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E3F1F7] dark:bg-cyan-500/15 text-[#0369A1] dark:text-cyan-400 flex items-center justify-center mb-4">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1E222D] dark:text-white">
                  Desktop, Android &amp; iOS Parity
                </h3>
                <p className="text-xs sm:text-sm text-[#4E5565] dark:text-slate-300 mt-2 leading-relaxed">
                  Google SSO automatically binds verified accounts to fresh organization workspaces across web browsers and native mobile clients.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2EFE8] dark:bg-[#0B0F19] border border-[#E5E0D6] dark:border-white/10 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E222D] dark:text-white">
                  <Building2 className="w-4 h-4 text-[#5D55D6]" />
                  <span>4-Step Enterprise Setup</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-[#4E5565] dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F8C65]" />
                    <span>Google-verified email locking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F8C65]" />
                    <span>Custom department &amp; role rosters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F8C65]" />
                    <span>Free, Growth, Pro &amp; Enterprise plans</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F8C65]" />
                    <span>Cryptographic team join codes</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E0D6] dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#5D55D6] dark:text-[#818CF8]">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Isolated Multi-Tenant Storage &amp; Cloud Sync</span>
              </span>
              <Link href="/onboarding" className="hover:underline inline-flex items-center gap-1">
                <span>Try Onboarding</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Complete Platform Capabilities Matrix with SVG & GSAP Motion Graphics */}
        <FeatureMatrixShowcase />
      </section>

      {/* 5. Scroll-Triggered Pipeline Motion Graphic */}
      <div id="pipeline">
        <ScrollMotionGraphics />
      </div>

      {/* 6. Pricing & Product Variants Section */}
      <PricingTiersSection />

      {/* 7. Clean Executive Conversion Callout */}
      <section className="py-10 sm:py-24 px-3.5 sm:px-6 max-w-[1200px] w-full mx-auto border-t border-[#DDD8CE] dark:border-white/10">
        <div className="lp-callout-box rounded-3xl bg-gradient-to-b from-[#FAF8F4] to-[#EFECE5] dark:from-[#151C2C] dark:to-[#0B0F19] border border-[#DDD8CE] dark:border-white/10 p-6 sm:p-14 text-center max-w-3xl mx-auto shadow-md shadow-[#1E222D]/[0.04]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE8F8] dark:bg-[#756EF3]/15 text-[#5D55D6] dark:text-[#818CF8] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise Workspace Access</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1E222D] dark:text-white tracking-tight">
            Streamline your team&apos;s task execution
          </h2>
          <p className="text-xs sm:text-sm text-[#4E5565] dark:text-slate-200 mt-3 max-w-xl mx-auto leading-relaxed">
            Track team capacity, distribute sprint deliverables with clarity, and maintain verified audit records across every project.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#5D55D6] hover:bg-[#4F47C7] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#DDD8CE] dark:border-white/10 bg-[#FAF8F4] dark:bg-[#151C2C] hover:border-[#5D55D6] text-[#1E222D] dark:text-white font-semibold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#5D55D6]" />
              <span>Sign In to Workspace</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Enterprise Footer with Privacy & Legal Links */}
      <footer className="mt-auto border-t border-[#DDD8CE] dark:border-white/10 bg-[#FAF8F4] dark:bg-[#0B0F19] py-8 px-6 transition-colors">
        <div className="max-w-[1360px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4E5565] dark:text-slate-300">
          <div className="flex items-center gap-3">
            <TaskPulseLogo size="sm" />
            <span>&copy; {new Date().getFullYear()} TaskPulse Inc. Enterprise Workload Platform.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link
              href="/privacy"
              className="text-[#4E5565] dark:text-slate-300 hover:text-[#5D55D6] dark:hover:text-[#818CF8] font-medium transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[#4E5565] dark:text-slate-300 hover:text-[#5D55D6] dark:hover:text-[#818CF8] font-medium transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-[#CFC9BD] dark:text-slate-600">&bull;</span>
            <span className="text-[#6E7485] dark:text-slate-400 font-medium">
              SOC 2 Type II Ready
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
