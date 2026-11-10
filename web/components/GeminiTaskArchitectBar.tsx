"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2, Clock, Calendar, Tag, ShieldCheck, Loader2 } from "lucide-react";

interface ParsedTask {
  title: string;
  priority: "low" | "medium" | "high" | "critical";
  department: string;
  dueDate: string;
  estimatedMinutes: number;
  subtasks: string[];
}

export const GeminiTaskArchitectBar: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parsedTask, setParsedTask] = useState<ParsedTask | null>(null);
  const [source, setSource] = useState<string>("");

  const handleParse = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/parse-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (data.task) {
        setParsedTask(data.task);
        setSource(data.source === "gemini-pro" ? "Gemini Pro" : "Neural Heuristic Engine");
      }
    } catch (err) {
      console.error("AI parse error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    "Deploy store inventory audit with Marcus by Friday high priority",
    "Prepare client quarterly review presentation with 3 review stages",
    "Fix mobile checkout payment gateway timeout bug critical priority",
  ];

  return (
    <div className="w-full max-w-3xl mx-auto my-6 p-4 sm:p-5 rounded-2xl bg-[#FAF8F4]/95 dark:bg-[#151C2C]/85 border border-[#DDD8CE] dark:border-white/15 shadow-lg shadow-[#1E222D]/[0.05] backdrop-blur-xl transition-all">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5D55D6] dark:text-[#818CF8]">
          <Sparkles className="w-4 h-4 text-[#5D55D6] dark:text-[#818CF8]" />
          <span>Gemini Pro Task Architect</span>
        </div>
        <span className="text-[10px] text-[#4E5565] dark:text-slate-200 font-mono bg-[#EDEAE2] dark:bg-[#756EF3]/15 px-2.5 py-0.5 rounded-full border border-[#DDD8CE] dark:border-transparent">
          Natural Language Engine
        </span>
      </div>

      <form onSubmit={handleParse} className="relative flex items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Try: 'Launch seasonal discount campaign by Thursday with 3 check points'..."
          className="w-full pl-4 pr-28 py-3 text-xs sm:text-sm rounded-xl bg-[#F4F2ED] dark:bg-[#0B0F19] border border-[#DDD8CE] dark:border-white/10 text-[#1E222D] dark:text-white placeholder-[#7B8291] focus:outline-none focus:ring-2 focus:ring-[#5D55D6]/35 transition-all font-sans"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 sm:px-4 rounded-lg bg-[#5D55D6] hover:bg-[#4F47C7] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <span>Parse</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Quick Prompts */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-[#4E5565] dark:text-slate-200">
        <span className="font-medium mr-1">Examples:</span>
        {samplePrompts.map((sp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setPrompt(sp);
            }}
            className="px-2.5 py-0.5 rounded-md bg-[#ECE8DF] dark:bg-[#1E293B] hover:bg-[#E1DCEB] hover:text-[#5D55D6] dark:hover:text-[#818CF8] transition-colors truncate max-w-[280px] text-left cursor-pointer"
          >
            &ldquo;{sp}&rdquo;
          </button>
        ))}
      </div>

      {/* Render Parsed Card */}
      {parsedTask && (
        <div className="mt-4 p-4 rounded-xl bg-[#F4F2ED] dark:bg-[#0B0F19] border border-emerald-600/30 dark:border-emerald-500/20 text-left animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Structured Task Blueprint Ready ({source})
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              parsedTask.priority === "critical"
                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                : parsedTask.priority === "high"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400"
            }`}>
              {parsedTask.priority}
            </span>
          </div>

          <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">
            {parsedTask.title}
          </h4>

          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-[#334155] dark:text-slate-200">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#756EF3]" />
              Due: <strong className="text-[#0F172A] dark:text-white">{parsedTask.dueDate}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#756EF3]" />
              Department: <strong className="text-[#0F172A] dark:text-white">{parsedTask.department}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#756EF3]" />
              Est: <strong className="text-[#0F172A] dark:text-white">{parsedTask.estimatedMinutes} mins</strong>
            </span>
          </div>

          {parsedTask.subtasks && parsedTask.subtasks.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10">
              <span className="text-[11px] font-semibold text-[#334155] dark:text-slate-200">
                Auto-Generated Execution Checklist:
              </span>
              <ul className="mt-1.5 space-y-1">
                {parsedTask.subtasks.map((st, i) => (
                  <li key={i} className="text-xs text-[#0F172A] dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#756EF3]" />
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
