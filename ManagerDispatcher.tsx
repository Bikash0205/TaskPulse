"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskPulseLogo } from "./TaskPulseLogo";
import { TaskPulseCard, TaskPulseItem, TaskStatus } from "./TaskPulseCard";
import { TaskPulseTokens } from "./taskpulse.tokens";

interface ColleagueWorkload {
  id: string;
  name: string;
  avatarUrl?: string;
  department: string;
  activeTasks: number;
  maxBandwidth: number;
}

const mockColleagues: ColleagueWorkload[] = [
  { id: "u1", name: "Sarah Chen", department: "Engineering", activeTasks: 3, maxBandwidth: 5 },
  { id: "u2", name: "Marcus Vance", department: "Engineering", activeTasks: 5, maxBandwidth: 5 },
  { id: "u3", name: "Elena Rostova", department: "Product", activeTasks: 2, maxBandwidth: 5 },
  { id: "u4", name: "David Kim", department: "Design", activeTasks: 6, maxBandwidth: 5 },
];

const mockInitialTasks: TaskPulseItem[] = [
  {
    id: "task-101",
    title: "Deploy Edge Compute Ingestion for Telemetry Stream",
    department: "Engineering",
    projectBadge: "INFRA",
    status: "in_progress",
    progressPercentage: 65,
    priority: "high",
    assignee: { id: "u1", name: "Sarah Chen", activeTaskCount: 3, department: "Engineering" },
  },
  {
    id: "task-102",
    title: "Refactor WebGL Shaders for Tier-3 Glassmorphic Reflection",
    department: "Design",
    projectBadge: "UI/UX",
    status: "in_progress",
    progressPercentage: 40,
    priority: "critical",
    isBlocked: true,
    assignee: { id: "u4", name: "David Kim", activeTaskCount: 6, department: "Design" },
  },
  {
    id: "task-103",
    title: "RBAC Token Invalidation on Custom Claim Escalation",
    department: "Engineering",
    projectBadge: "SECURITY",
    status: "in_review",
    progressPercentage: 90,
    priority: "high",
    assignee: { id: "u2", name: "Marcus Vance", activeTaskCount: 5, department: "Engineering" },
  },
  {
    id: "task-104",
    title: "Automated FlashList Layout Virtualization in Expo SDK 52",
    department: "Product",
    projectBadge: "MOBILE",
    status: "backlog",
    progressPercentage: 0,
    priority: "medium",
    assignee: { id: "u3", name: "Elena Rostova", activeTaskCount: 2, department: "Product" },
  },
];

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "in_progress", label: "In Flight" },
  { id: "in_review", label: "Review & Quality" },
  { id: "completed", label: "Completed" },
];

export const ManagerDispatcher: React.FC = () => {
  const [tasks, setTasks] = useState<TaskPulseItem[]>(mockInitialTasks);
  const [selectedDept, setSelectedDept] = useState<string>("All");

  const filteredTasks = useMemo(() => {
    if (selectedDept === "All") return tasks;
    return tasks.filter((t) => t.department === selectedDept);
  }, [tasks, selectedDept]);

  const departments = ["All", "Engineering", "Product", "Design"];

  return (
    <div
      className="min-h-screen w-full text-slate-100 p-6 flex flex-col gap-6"
      style={{ backgroundColor: TaskPulseTokens.colors.canvas.base }}
    >
      {/* Header Bar */}
      <header
        className="flex items-center justify-between px-6 py-4 rounded-2xl"
        style={TaskPulseTokens.glass.tier3}
      >
        <div className="flex items-center gap-6">
          <TaskPulseLogo size="md" />
          <div className="h-6 w-px bg-white/10" />
          <span className="text-xs tracking-widest uppercase text-slate-400 font-semibold font-mono">
            Manager Dispatcher // Tier 3 Glass
          </span>
        </div>

        {/* Department Filters */}
        <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-xl border border-white/10">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                selectedDept === dept
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </header>

      {/* Real-time Workload Matrix (Colleague Bandwidth Meter) */}
      <section
        className="p-5 rounded-2xl"
        style={TaskPulseTokens.glass.tier3}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold tracking-wide text-slate-300 uppercase font-mono">
            Bandwidth Matrix & Real-time Colleague Allocation
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> &lt;= 3 Tasks (Optimal)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> 4-5 Tasks (High Load)
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500" /> &gt; 5 / Blocked (Overload)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {mockColleagues.map((colleague) => {
            const isOverload = colleague.activeTasks > 5;
            const isWarning = colleague.activeTasks >= 4 && colleague.activeTasks <= 5;
            const accentColor = isOverload ? "#EF4444" : isWarning ? "#F59E0B" : "#10B981";
            const ratio = Math.min(100, (colleague.activeTasks / colleague.maxBandwidth) * 100);

            return (
              <div
                key={colleague.id}
                className="p-3 rounded-xl border border-white/5 bg-slate-900/40 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs">
                      {colleague.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{colleague.name}</div>
                      <div className="text-[10px] text-slate-400">{colleague.department}</div>
                    </div>
                  </div>
                  <span
                    className="text-xs font-mono font-bold px-1.5 py-0.5 rounded"
                    style={{
                      color: accentColor,
                      backgroundColor: `${accentColor}1A`,
                    }}
                  >
                    {colleague.activeTasks} Load
                  </span>
                </div>

                {/* Micro Bandwidth Gauge (scaleX 120Hz GPU animation) */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full origin-left"
                    style={{ backgroundColor: accentColor, willChange: "transform" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: ratio / 100 }}
                    transition={TaskPulseTokens.motion.springSmooth}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Kanban Dispatcher Grid */}
      <main className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 items-start">
        {COLUMNS.map((column) => {
          const columnTasks = filteredTasks.filter((t) => t.status === column.id);

          return (
            <div
              key={column.id}
              className="p-4 rounded-2xl flex flex-col gap-3 min-h-[600px]"
              style={TaskPulseTokens.glass.tier3}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h2 className="text-sm font-bold text-slate-300 tracking-wide">
                  {column.label}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {columnTasks.length}
                </span>
              </div>

              <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
                <AnimatePresence mode="popLayout">
                  {columnTasks.map((task) => (
                    <TaskPulseCard
                      key={task.id}
                      task={task}
                      isDraggable={true}
                      onSelect={(selected) => console.log("Selected task", selected.id)}
                    />
                  ))}
                </AnimatePresence>

                {columnTasks.length === 0 && (
                  <div className="h-32 flex items-center justify-center text-xs text-slate-500 border border-dashed border-white/10 rounded-xl">
                    No active tasks in column
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default ManagerDispatcher;
