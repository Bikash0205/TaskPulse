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
  CheckCircle2,
  ArrowRight,
  Lock,
  Building2,
  Sun,
  Moon,
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

export const LandingPage: React.FC<LandingPageProps> = () => {
  const { theme, toggleTheme } = useTheme();
  const vp = useViewportProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

        heroTl
          .from(".lp-hero-line", {
            y: 18,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            clearProps: "transform,opacity",
          })
          .from(
            ".lp-hero-sub",
            {
              y: 12,
              opacity: 0,
              duration: 0.42,
              clearProps: "transform,opacity",
            },
            "-=0.25"
          )
          .fromTo(
            ".lp-hero-cta",
            { y: 10, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.06,
              duration: 0.38,
              clearProps: "transform,opacity",
            },
            "-=0.22"
          )
          .from(
            ".lp-stack-card",
            {
              y: 18,
              opacity: 0,
              duration: 0.5,
              clearProps: "transform,opacity",
            },
            0.12
          );

        gsap.from(".lp-hero-bar", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.8,
          stagger: 0.1,
          delay: 0.35,
          ease: "power3.out",
          clearProps: "transform",
        });

        gsap.from(".lp-showcase-wrap", {
          y: 20,
          opacity: 0,
          duration: 0.55,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: ".lp-showcase-wrap",
            start: "top 88%",
            once: true,
          },
        });

        gsap.from("#pricing .pricing-card", {
          y: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.55,
          ease: "power3.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: "#pricing",
            start: "top 86%",
            once: true,
          },
        });

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

        setTimeout(() => ScrollTrigger.refresh(), 250);
      });
    },
    { scope: pageRef }
  );

  return (
    <div
      ref={pageRef}
      data-device={vp.deviceClass}
      data-orientation={vp.orientation}
      data-aspect={vp.aspectRatio}
      className="min-h-screen w-full bg-[#F4F2ED] dark:bg-[#0B0F19] text-[#1E222D] dark:text-white flex flex-col transition-colors duration-200 selection:bg-[#5D55D6]/20 selection:text-[#5D55D6] overflow-x-clip"
    >
      {/* 1. Architectural Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-[#DDD8CE] dark:border-white/[0.08] bg-[#F4F2ED]/92 dark:bg-[#0B0F19]/90 backdrop-blur-md relative">
        <div
          ref={scrollBarRef}
          style={{ transform: "scaleX(0)" }}
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-[#5D55D6] pointer-events-none"
        />
        <div className="max-w-[1280px] w-full mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-6 min-w-0">
            <TaskPulseLogo size={vp.isMobileViewport ? "sm" : "md"} />

            <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-[#4E5565] dark:text-slate-300">
              <a
                href="#showcase"
                className="px-3 py-1.5 rounded-lg hover:text-[#1E222D] dark:hover:text-white hover:bg-[#EAE6DC]/70 dark:hover:bg-white/[0.06] transition-colors"
              >
                Product
              </a>
              <a
                href="#features"
                className="px-3 py-1.5 rounded-lg hover:text-[#1E222D] dark:hover:text-white hover:bg-[#EAE6DC]/70 dark:hover:bg-white/[0.06] transition-colors"
              >
                Capabilities
              </a>
              <a
                href="#pipeline"
                className="px-3 py-1.5 rounded-lg hover:text-[#1E222D] dark:hover:text-white hover:bg-[#EAE6DC]/70 dark:hover:bg-white/[0.06] transition-colors"
              >
                Workflow
              </a>
              <a
                href="#pricing"
                className="px-3 py-1.5 rounded-lg hover:text-[#1E222D] dark:hover:text-white hover:bg-[#EAE6DC]/70 dark:hover:bg-white/[0.06] transition-colors"
              >
                Pricing
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={toggleTheme}
              data-testid="fluid-theme-toggle"
              title={theme === "dark" ? "Switch to Soft Light Mode" : "Switch to Dark Mode"}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#DDD8CE] dark:border-white/10 bg-[#FAF8F4] dark:bg-[#131823] hover:bg-[#EAE6DC] dark:hover:bg-slate-800 text-[#1E222D] dark:text-white transition-colors cursor-pointer"
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
              className="hidden sm:inline-flex whitespace-nowrap shrink-0 px-3.5 h-9 items-center rounded-lg border border-[#DDD8CE] dark:border-white/10 bg-[#FAF8F4] dark:bg-[#131823] hover:border-[#1E222D]/30 dark:hover:border-white/25 text-[#1E222D] dark:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Sign in
            </Link>

            <Link
              href="/onboarding"
              data-testid="nav-get-started-btn"
              className="whitespace-nowrap shrink-0 px-3 sm:px-4 h-9 rounded-lg bg-[#5D55D6] hover:bg-[#4F47C7] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>{vp.isMobileViewport ? "Start" : "Get started"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[#DDD8CE] dark:border-white/10 bg-[#FAF8F4] dark:bg-[#131823] text-[#1E222D] dark:text-white hover:bg-[#ECE8DF] dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="w-4 h-4 text-[#5D55D6]" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden sticky top-14 z-40 w-full bg-[#FAF8F4] dark:bg-[#0B0F19] border-b border-[#DDD8CE] dark:border-white/10 p-4">
          <nav className="flex flex-col gap-1 text-xs font-semibold text-[#4E5565] dark:text-slate-200">
            <a
              href="#showcase"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#EAE6DC]/70 dark:hover:bg-white/[0.06] hover:text-[#1E222D] dark:hover:text-white"
            >
              Product Workbench
            </a>
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#EAE6DC]/70 dark:hover:bg-white/[0.06] hover:text-[#1E222D] dark:hover:text-white"
            >
              Capabilities
            </a>
            <a
              href="#pipeline"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#EAE6DC]/70 dark:hover:bg-white/[0.06] hover:text-[#1E222D] dark:hover:text-white"
            >
              Workflow
            </a>
            <a
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#EAE6DC]/70 dark:hover:bg-white/[0.06] hover:text-[#1E222D] dark:hover:text-white"
            >
              Pricing
            </a>

            <div className="pt-2 mt-1 border-t border-[#DDD8CE] dark:border-white/10 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-lg border border-[#DDD8CE] dark:border-white/10 bg-[#F4F2ED] dark:bg-[#131823] text-[#1E222D] dark:text-white font-semibold"
              >
                Sign in to Workspace
              </Link>
              <Link
                href="/onboarding"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-lg bg-[#5D55D6] hover:bg-[#4F47C7] text-white font-semibold flex items-center justify-center gap-1.5"
              >
                <span>Start Organization</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* 2. Clean Editorial Split Hero */}
      <section
        className={`relative ${
          vp.isMobileViewport ? "pt-6 pb-8" : "pt-12 sm:pt-16 pb-12 sm:pb-16"
        } px-3.5 sm:px-6 max-w-[1280px] w-full mx-auto`}
      >
        <div className={`grid grid-cols-1 ${vp.aspectRatio >= 1.15 ? "lg:grid-cols-12" : ""} gap-8 lg:gap-12 items-center`}>
          {/* Left 7 Columns */}
          <div className={`${vp.aspectRatio >= 1.15 ? "lg:col-span-7" : ""} text-left space-y-5`}>
            <div className="lp-hero-line text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-[#5D55D6] dark:text-[#818CF8]">
              TASKPULSE WORKSPACE OS
            </div>

            <h1 className={`${vp.heroHeadingClass} font-bold tracking-[-0.025em] text-[#1E222D] dark:text-white leading-[1.12] font-sans`}>
              <span className="lp-hero-line block">Plan sprint delivery.</span>
              <span className="lp-hero-line block text-[#4E5565] dark:text-slate-400">
                Protect team bandwidth.
              </span>
            </h1>

            <p className="lp-hero-sub text-sm sm:text-base text-[#4E5565] dark:text-slate-300 max-w-xl leading-relaxed font-sans">
              Break deliverables into verifiable subtasks, keep individual workload balanced across departments, and sign off releases across desktop web and Android.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 pt-1">
              <Link
                href="/onboarding"
                data-testid="hero-onboarding-btn"
                className="lp-hero-cta px-5 py-3 min-h-[44px] rounded-lg bg-[#1E222D] hover:bg-[#11141B] dark:bg-[#5D55D6] dark:hover:bg-[#4F47C7] text-[#FAF8F4] dark:text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Create Organization</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="lp-hero-cta px-5 py-3 min-h-[44px] rounded-lg bg-[#FAF8F4] dark:bg-[#131823] border border-[#DDD8CE] dark:border-white/10 hover:border-[#1E222D]/35 dark:hover:border-white/25 text-[#1E222D] dark:text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#5D55D6] dark:text-[#818CF8]" />
                <span>Sign in to Workspace</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-5 pt-5 border-t border-[#DDD8CE] dark:border-white/10 max-w-xl">
              <div>
                <div className="text-xs sm:text-sm font-semibold text-[#1E222D] dark:text-white">
                  Multi-View
                </div>
                <div className="text-[11px] text-[#4E5565] dark:text-slate-400">
                  Gantt, Kanban &amp; Table
                </div>
              </div>
              <div className="border-l border-[#DDD8CE] dark:border-white/10 pl-3 sm:pl-5">
                <div className="text-xs sm:text-sm font-semibold text-[#1E222D] dark:text-white">
                  Capacity Caps
                </div>
                <div className="text-[11px] text-[#4E5565] dark:text-slate-400">
                  Per-member load limits
                </div>
              </div>
              <div className="border-l border-[#DDD8CE] dark:border-white/10 pl-3 sm:pl-5">
                <div className="text-xs sm:text-sm font-semibold text-[#1E222D] dark:text-white">
                  Web &amp; Android
                </div>
                <div className="text-[11px] text-[#4E5565] dark:text-slate-400">
                  Shared org state
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Flat Architectural Release Snapshot (No floating stickers) */}
          <div className={`${vp.aspectRatio >= 1.15 ? "lg:col-span-5" : ""}`}>
            <div className="lp-stack-card rounded-xl bg-[#FAF8F4] dark:bg-[#0D1017] border border-[#DDD8CE] dark:border-white/[0.08] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E0D6] dark:border-white/[0.07] pb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#EAE8F8] dark:bg-[#5D55D6]/15 text-[#5D55D6] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-xs font-bold text-[#1E222D] dark:text-white truncate">
                      Release Pipeline &bull; Cycle 14
                    </div>
                    <div className="text-[10px] text-[#6E7485] dark:text-slate-400 font-mono">
                      3 Active Workstreams
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#E4F2EC] dark:bg-emerald-950/60 text-[#0F7656] dark:text-emerald-300 border border-[#C5E3D5] dark:border-emerald-800 text-[10px] font-mono font-semibold shrink-0">
                  ON TRACK
                </span>
              </div>

              <div className="space-y-3.5 text-left">
                <div>
                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <span className="text-[#1E222D] dark:text-white">Multi-Tenant SSO &amp; RBAC</span>
                    <span className="font-mono tabular-nums text-[#0F7656] dark:text-emerald-400">100%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#E8E4DA] dark:bg-slate-800 overflow-hidden">
                    <div className="lp-hero-bar h-full w-full rounded-full bg-[#0F8C65]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <span className="text-[#1E222D] dark:text-white">Plan Quotas &amp; Play Sync</span>
                    <span className="font-mono tabular-nums text-[#5D55D6] dark:text-[#818CF8]">78%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#E8E4DA] dark:bg-slate-800 overflow-hidden">
                    <div className="lp-hero-bar h-full w-[78%] rounded-full bg-[#5D55D6]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <span className="text-[#1E222D] dark:text-white">Android Offline Reconciler</span>
                    <span className="font-mono tabular-nums text-[#B45309] dark:text-amber-400">62%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#E8E4DA] dark:bg-slate-800 overflow-hidden">
                    <div className="lp-hero-bar h-full w-[62%] rounded-full bg-[#D97706]" />
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F1EEE7] dark:bg-[#131823] border border-[#E5E0D6] dark:border-white/[0.06] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F8C65] shrink-0" />
                  <span className="truncate font-medium text-[#1E222D] dark:text-slate-100">
                    Google OAuth Workspace Lock
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#6E7485] dark:text-slate-400 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Sprint Ledger + Product Workbench + Brief Parser */}
      <section
        id="showcase"
        className="px-3.5 sm:px-6 max-w-[1280px] w-full mx-auto pt-4 pb-10 sm:pb-16 border-t border-[#DDD8CE] dark:border-white/[0.08]"
      >
        <div className="max-w-2xl text-left py-6 sm:py-8">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-[#5D55D6] dark:text-[#818CF8] mb-2">
            PRODUCT WORKBENCH
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E222D] dark:text-white tracking-tight">
            One workspace for planning, capacity, and review.
          </h2>
          <p className="text-xs sm:text-sm text-[#4E5565] dark:text-slate-300 mt-2 leading-relaxed">
            Inspect active sprint progress, try structured brief-to-task parsing, and switch between core modules below.
          </p>
        </div>

        <HeroMotionGraphic />

        <div className="lp-showcase-wrap space-y-5 mt-5">
          <InteractiveProductShowcase />
          <GeminiTaskArchitectBar />
        </div>
      </section>

      {/* 4. Capabilities Grid with Vector Schematics */}
      <section
        id="features"
        className="py-10 sm:py-16 px-3.5 sm:px-6 max-w-[1280px] w-full mx-auto border-t border-[#DDD8CE] dark:border-white/[0.08]"
      >
        <div className="max-w-2xl mb-6 sm:mb-8 text-left">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-[#5D55D6] dark:text-[#818CF8] mb-2">
            CORE CAPABILITIES
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E222D] dark:text-white tracking-tight">
            Built for teams that ship on schedule.
          </h2>
          <p className="text-xs sm:text-sm text-[#4E5565] dark:text-slate-300 mt-2 leading-relaxed">
            Clear workload boundaries, role permissions, and verifiable deliverable proof without status-meeting overhead.
          </p>
        </div>

        <FeatureMatrixShowcase />
      </section>

      {/* 5. Execution Lifecycle Walkthrough */}
      <div id="pipeline">
        <ScrollMotionGraphics />
      </div>

      {/* 6. Pricing Plans */}
      <PricingTiersSection />

      {/* 7. Clean Split Conversion Row */}
      <section className="py-10 sm:py-16 px-3.5 sm:px-6 max-w-[1280px] w-full mx-auto border-t border-[#DDD8CE] dark:border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-left max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E222D] dark:text-white tracking-tight">
              Set up your organization workspace in two minutes.
            </h2>
            <p className="text-xs sm:text-sm text-[#4E5565] dark:text-slate-300 mt-1.5 leading-relaxed">
              Provision your company, configure department roles, and invite colleagues with one workspace code.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <Link
              href="/onboarding"
              className="px-5 py-3 min-h-[42px] rounded-lg bg-[#5D55D6] hover:bg-[#4F47C7] text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create Organization</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="px-5 py-3 min-h-[42px] rounded-lg border border-[#DDD8CE] dark:border-white/10 bg-[#FAF8F4] dark:bg-[#131823] hover:border-[#1E222D]/35 dark:hover:border-white/25 text-[#1E222D] dark:text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign in</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Minimal Editorial Footer */}
      <footer className="mt-auto border-t border-[#DDD8CE] dark:border-white/[0.08] bg-[#F4F2ED] dark:bg-[#0B0F19] py-6 px-3.5 sm:px-6">
        <div className="max-w-[1280px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4E5565] dark:text-slate-400">
          <div className="flex items-center gap-3">
            <TaskPulseLogo size="sm" />
            <span>&copy; {new Date().getFullYear()} TaskPulse Inc.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
            <Link
              href="/privacy"
              className="hover:text-[#1E222D] dark:hover:text-white font-medium transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#1E222D] dark:hover:text-white font-medium transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
