"use client";

import React from "react";
import { Zap, Check, Smartphone, Sparkles, Clock, X, ArrowRight, Database, ShieldCheck } from "lucide-react";

interface TaskPulseLiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysRemaining?: number;
}

export const TaskPulseLiteModal: React.FC<TaskPulseLiteModalProps> = ({
  isOpen,
  onClose,
  daysRemaining = 14,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 relative overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#756EF3] to-[#818CF8]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Zap className="w-4 h-4 fill-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-[#0F172A] dark:text-white">TaskPulse Lite</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                Soft Launch Pass
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Lightweight offline autonomy for solo founders & micro-teams</p>
          </div>
        </div>

        {/* Trial Status Card */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#756EF3]/10 to-transparent border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-sm">
              {daysRemaining}d
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F172A] dark:text-white">Active 14-Day Free Trial</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Zero per-seat penalty · No credit card required</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">₹199 / mo</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Google Play / Web</div>
          </div>
        </div>

        {/* Features list */}
        <div className="mt-5 space-y-2.5">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Included in Your Lite Subscription:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#0F172A] dark:text-white">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span><strong>100% Offline-First</strong> Local Storage</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Unlimited Daily Tasks & Subtasks</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>60 FPS Fluid Neumorphic Theme</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>1-Tap Floating Stopwatch</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>PDF & CSV Client Summary Export</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Direct Cloud Firestore Sync</span>
            </div>
          </div>
        </div>

        {/* Database Health Pill */}
        <div className="mt-4 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>Local Database Status:</span>
          </div>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Healthy & Synced
          </span>
        </div>

        {/* Enterprise Upgrade Teaser */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left w-full sm:w-auto">
            <div className="text-xs font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#756EF3]" />
              <span>Scaling to a Multi-Member Team?</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Upgrade to Enterprise for Flat $19/mo with Live War Room presence.
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#756EF3] hover:bg-[#5E56E8] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
          >
            <span>Continue on Lite</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
