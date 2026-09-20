"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileCheck, Scale } from "lucide-react";
import { TaskPulseLogo } from "@/components/TaskPulseLogo";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFF] dark:bg-[#0B0F19] text-[#002055] dark:text-[#F8FAFC] flex flex-col font-sans transition-colors selection:bg-[#756EF3]/20 selection:text-[#756EF3]">
      <header className="border-b border-[#E9F1FF] dark:border-[#1E293B] bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl px-6 py-4 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl border border-[#E9F1FF] dark:border-[#1E293B] bg-white dark:bg-[#151C2C] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Return to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <TaskPulseLogo size="md" />
        </div>
        <div className="text-xs font-semibold text-slate-500">Terms &amp; Conditions</div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] dark:text-[#818CF8] text-xs font-semibold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Service Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#002055] dark:text-white">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-2">Last updated: September 21, 2026</p>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-sm text-[#556070] dark:text-[#94A3B8] leading-relaxed">
          <section className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#002055] dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#756EF3]" />
              1. Agreement to Terms
            </h2>
            <p>
              By accessing or using TaskPulse (&quot;Platform&quot;), provided by TaskPulse Inc., you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Platform.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#002055] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#756EF3]" />
              2. Acceptable Use &amp; Account Responsibility
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your workspace login credentials, cryptographic invitation keys, and administrator access tokens. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Violate any applicable national or international laws or corporate compliance regulations.</li>
              <li>Attempt to reverse-engineer, decompile, or compromise the integrity of the TaskPulse infrastructure.</li>
              <li>Use the Platform to transmit malware, unauthorized surveillance code, or unsolicited commercial broadcasts.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#002055] dark:text-white">
              3. Service Availability &amp; Modifications
            </h2>
            <p>
              We continually upgrade the Platform to deliver enhanced sprint management and workload analytics. We reserve the right to modify, suspend, or discontinue any feature with reasonable notice.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#002055] dark:text-white">
              4. Contact &amp; Inquiries
            </h2>
            <p>
              For legal inquiries, enterprise compliance questions, or licensing terms:
            </p>
            <p className="font-mono text-xs text-[#002055] dark:text-white">
              TaskPulse Legal Operations: <a href="mailto:zevonbcash@gmail.com" className="text-[#756EF3] underline">zevonbcash@gmail.com</a>
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-[#E9F1FF] dark:border-[#1E293B] py-6 px-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} TaskPulse Inc. All rights reserved.
      </footer>
    </div>
  );
}
