"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, FileText, CheckCircle2 } from "lucide-react";
import { TaskPulseLogo } from "@/components/TaskPulseLogo";

export default function PrivacyPolicyPage() {
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
        <div className="text-xs font-semibold text-slate-500">Legal Documentation</div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] dark:text-[#818CF8] text-xs font-semibold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Enterprise Privacy Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#002055] dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-2">Last updated: September 21, 2026</p>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-sm text-[#556070] dark:text-[#94A3B8] leading-relaxed">
          <section className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#002055] dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#756EF3]" />
              1. Information We Collect
            </h2>
            <p>
              TaskPulse (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects information necessary to provide sprint tracking, workload intelligence, and workspace orchestration. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Account Credentials</strong>: Work email, full name, profile picture, and role preferences.</li>
              <li><strong>Google OAuth Data</strong>: When authenticating via Google Sign-In, we receive your basic profile information (display name, email address, and avatar URL) via standard OAuth 2.0 scopes (<code className="text-[#756EF3]">openid</code>, <code className="text-[#756EF3]">email</code>, <code className="text-[#756EF3]">profile</code>).</li>
              <li><strong>Workspace Telemetry</strong>: Sprint logs, task assignments, board updates, and department designations created within your corporate workspace.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#002055] dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#756EF3]" />
              2. Google User Data Policy Compliance
            </h2>
            <p>
              TaskPulse complies strictly with the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer" className="text-[#756EF3] underline">Google API Services User Data Policy</a>, including Limited Use requirements:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>We only request access to basic profile info needed to authenticate your identity and provision your team member profile.</li>
              <li>We do <strong>not</strong> sell, rent, or transfer your Google user data to third parties.</li>
              <li>We do <strong>not</strong> use Google user data for advertising, machine learning model training, or data broker operations.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#002055] dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              3. Data Security &amp; Retention
            </h2>
            <p>
              All personal and workspace telemetry data is encrypted in transit using <strong>TLS 1.3</strong> and at rest using <strong>AES-256</strong> via Google Cloud Platform and Firebase infrastructure. We retain your information only as long as your workspace account is active or needed to provide services.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#002055] dark:text-white">
              4. Contact Information &amp; Data Deletion
            </h2>
            <p>
              To request deletion of your account data or for questions regarding this Privacy Policy, please contact our administrative data officer:
            </p>
            <p className="font-mono text-xs text-[#002055] dark:text-white">
              TaskPulse Privacy Officer: <a href="mailto:zevonbcash@gmail.com" className="text-[#756EF3] underline">zevonbcash@gmail.com</a>
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
