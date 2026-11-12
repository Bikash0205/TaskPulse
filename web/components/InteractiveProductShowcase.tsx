"use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Check,
  FolderKanban,
  Calendar,
  BarChart3,
  Terminal,
  Loader2,
  ArrowRight,
  Paperclip,
} from "lucide-react";

gsap.registerPlugin(useGSAP);

type WorkspaceView = "tasks" | "timeline" | "workload" | "intake";

interface PreviewSubtask {
  id: string;
  label: string;
  done: boolean;
}

interface PreviewTask {
  id: string;
  key: string;
  projectId: "core" | "mobile" | "sec";
  title: string;
  owner: string;
  dept: string;
  due: string;
  status: "Verified" | "In Review" | "In Progress";
  hasProof?: boolean;
  subtasks: PreviewSubtask[];
}

const PROJECTS = [
  { id: "core" as const, code: "CORE", name: "Core Platform", openCount: 3 },
  { id: "mobile" as const, code: "MOB", name: "Android Client", openCount: 2 },
  { id: "sec" as const, code: "SEC", name: "Access & Quotas", openCount: 2 },
];

const INITIAL_TASKS: PreviewTask[] = [
  {
    id: "t1",
    key: "TP-104",
    projectId: "core",
    title: "Tenant organization isolation and invite code lookup",
    owner: "Hannah Park",
    dept: "Platform",
    due: "Nov 14",
    status: "Verified",
    hasProof: true,
    subtasks: [
      { id: "s1", label: "Validate domain slug uniqueness", done: true },
      { id: "s2", label: "Scope project reads by orgId", done: true },
      { id: "s3", label: "Verify invite code redemption flow", done: true },
    ],
  },
  {
    id: "t2",
    key: "TP-108",
    projectId: "core",
    title: "Manager evidence sign-off drawer and audit log timestamps",
    owner: "Devon Brooks",
    dept: "Product",
    due: "Nov 16",
    status: "In Review",
    hasProof: true,
    subtasks: [
      { id: "s4", label: "Attach implementation note & screenshot", done: true },
      { id: "s5", label: "Record reviewer approval state", done: true },
      { id: "s6", label: "Expose CSV & JSON audit export", done: false },
    ],
  },
  {
    id: "t3",
    key: "TP-112",
    projectId: "core",
    title: "Rebalance per-member active task capacity threshold alerts",
    owner: "Priya Nair",
    dept: "Engineering",
    due: "Nov 19",
    status: "In Progress",
    subtasks: [
      { id: "s7", label: "Calculate active non-completed count", done: true },
      { id: "s8", label: "Highlight queue above 80% load", done: false },
    ],
  },
  {
    id: "t4",
    key: "TP-203",
    projectId: "mobile",
    title: "Offline SQLite mutation queue reconciliation on reconnect",
    owner: "Devon Brooks",
    dept: "Mobile",
    due: "Nov 17",
    status: "In Progress",
    subtasks: [
      { id: "s9", label: "Flush pending checklist updates", done: true },
      { id: "s10", label: "Resolve server timestamp order", done: false },
    ],
  },
  {
    id: "t5",
    key: "TP-207",
    projectId: "mobile",
    title: "Google Play billing verification synced to web tier state",
    owner: "Hannah Park",
    dept: "Mobile",
    due: "Nov 20",
    status: "In Review",
    hasProof: true,
    subtasks: [
      { id: "s11", label: "Verify purchase token server-side", done: true },
      { id: "s12", label: "Propagate quota limits to teammates", done: true },
    ],
  },
  {
    id: "t6",
    key: "TP-301",
    projectId: "sec",
    title: "Enforce locked Google email on workspace onboarding step 1",
    owner: "Priya Nair",
    dept: "Security",
    due: "Nov 15",
    status: "Verified",
    hasProof: true,
    subtasks: [
      { id: "s13", label: "Bind verified Firebase UID claims", done: true },
      { id: "s14", label: "Clear unprovisioned cached sessions", done: true },
    ],
  },
  {
    id: "t7",
    key: "TP-305",
    projectId: "sec",
    title: "Read-only Viewer scoping for external client stakeholders",
    owner: "Leo Weber",
    dept: "Security",
    due: "Nov 21",
    status: "In Progress",
    subtasks: [
      { id: "s15", label: "Restrict write mutations in dispatcher", done: true },
      { id: "s16", label: "Hide billing & team invite controls", done: false },
    ],
  },
];

const TEAM_WORKLOAD = [
  { name: "Hannah Park", role: "Platform Lead", active: 3, max: 5, focus: "Core Isolation & Billing" },
  { name: "Devon Brooks", role: "Mobile Engineer", active: 4, max: 5, focus: "Offline Queue & Sign-Off" },
  { name: "Priya Nair", role: "Systems & Security", active: 3, max: 5, focus: "Auth Claims & Capacity" },
  { name: "Leo Weber", role: "Product Operations", active: 2, max: 5, focus: "Viewer Scoping & Exports" },
];

export const InteractiveProductShowcase: React.FC = () => {
  const [activeView, setActiveView] = useState<WorkspaceView>("tasks");
  const [selectedProject, setSelectedProject] = useState<"all" | "core" | "mobile" | "sec">("core");
  const [tasks, setTasks] = useState<PreviewTask[]>(INITIAL_TASKS);
  const [brief, setBrief] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseFeedback, setParseFeedback] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".ws-anim",
          { y: 8, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.04, duration: 0.28, ease: "power2.out", clearProps: "transform,opacity" }
        );
      });
    },
    { scope: panelRef, dependencies: [activeView, selectedProject] }
  );

  const visibleTasks =
    selectedProject === "all" ? tasks : tasks.filter((t) => t.projectId === selectedProject);

  const totalSubtasks = visibleTasks.reduce((acc, t) => acc + t.subtasks.length, 0);
  const completedSubtasks = visibleTasks.reduce(
    (acc, t) => acc + t.subtasks.filter((s) => s.done).length,
    0
  );

  const toggleSubtask = (taskId: string, subId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const nextSubs = task.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s));
        const allDone = nextSubs.every((s) => s.done);
        return {
          ...task,
          subtasks: nextSubs,
          status: allDone ? "Verified" : "In Progress",
        };
      })
    );
  };

  const handleParseBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.trim() || isParsing) return;
    setIsParsing(true);
    setParseFeedback(null);
    try {
      const res = await fetch("/api/ai/parse-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: brief.trim() }),
      });
      const data = await res.json();
      if (data?.task) {
        const newTask: PreviewTask = {
          id: `t-${Date.now()}`,
          key: `TP-${310 + tasks.length}`,
          projectId: selectedProject === "all" ? "core" : selectedProject,
          title: data.task.title,
          owner: "Hannah Park",
          dept: data.task.department || "Engineering",
          due: data.task.dueDate || "Nov 22",
          status: "In Progress",
          subtasks: (data.task.subtasks || ["Review scope", "Verify output"]).slice(0, 3).map((label: string, i: number) => ({
            id: `sub-${Date.now()}-${i}`,
            label,
            done: false,
          })),
        };
        setTasks((prev) => [newTask, ...prev]);
        setBrief("");
        setParseFeedback(`Added ${newTask.key} to workspace`);
        setActiveView("tasks");
      }
    } catch {
      setParseFeedback("Could not parse brief right now.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="w-full rounded-xl bg-white dark:bg-[#111318] border border-[#DDD8CE] dark:border-white/[0.1] overflow-hidden shadow-xs text-left">
      {/* Window Header Bar */}
      <div className="px-3 sm:px-5 py-2.5 border-b border-[#E7E3DA] dark:border-white/[0.08] bg-[#FAF8F4] dark:bg-[#151820] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-[#18181B] dark:text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
          <span className="font-semibold">Acme Product Workspace</span>
          <span className="text-[#71717A] dark:text-slate-500 hidden sm:inline">/</span>
          <span className="text-[#52525B] dark:text-slate-400 font-mono text-[11px] tabular-nums hidden sm:inline">
            {completedSubtasks}/{totalSubtasks} steps done
          </span>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-1 w-full sm:w-auto">
          {[
            { id: "tasks" as const, label: "Tasks", icon: <FolderKanban className="w-3.5 h-3.5" /> },
            { id: "timeline" as const, label: "Timeline", icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: "workload" as const, label: "Workload", icon: <BarChart3 className="w-3.5 h-3.5" /> },
            { id: "intake" as const, label: "Brief Intake", icon: <Terminal className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveView(tab.id)}
              className={`px-2.5 py-1.5 min-h-[36px] rounded-md text-[11px] font-medium flex items-center justify-center sm:justify-start gap-1.5 transition-colors cursor-pointer ${
                activeView === tab.id
                  ? "bg-[#18181B] text-white dark:bg-white dark:text-[#090B10]"
                  : "text-[#52525B] dark:text-slate-400 hover:text-[#18181B] dark:hover:text-white hover:bg-[#ECE8DF]/70 dark:hover:bg-white/[0.06]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* App Shell Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[360px]">
        {/* Project Navigation Sidebar (Horizontal chips on mobile, left rail on desktop) */}
        <aside className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[#E7E3DA] dark:border-white/[0.08] bg-[#FAF8F4]/60 dark:bg-[#0D0F14] p-3 sm:p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] dark:text-slate-500 mb-2 hidden lg:block">
            Projects
          </div>
          <div className="flex lg:flex-col gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setSelectedProject("all")}
              className={`px-2.5 py-1.5 min-h-[36px] rounded-md text-xs font-medium flex items-center justify-between gap-2 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                selectedProject === "all"
                  ? "bg-[#ECE8DF] dark:bg-white/[0.08] text-[#18181B] dark:text-white font-semibold"
                  : "text-[#52525B] dark:text-slate-400 hover:bg-[#ECE8DF]/50 dark:hover:bg-white/[0.04]"
              }`}
            >
              <span>All Projects</span>
              <span className="text-[10px] font-mono tabular-nums text-[#71717A]">{tasks.length}</span>
            </button>

            {PROJECTS.map((proj) => {
              const count = tasks.filter((t) => t.projectId === proj.id).length;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setSelectedProject(proj.id)}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-md text-xs font-medium flex items-center justify-between gap-2 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    selectedProject === proj.id
                      ? "bg-[#ECE8DF] dark:bg-white/[0.08] text-[#18181B] dark:text-white font-semibold"
                      : "text-[#52525B] dark:text-slate-400 hover:bg-[#ECE8DF]/50 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#71717A]">{proj.code}</span>
                    <span>{proj.name}</span>
                  </span>
                  <span className="text-[10px] font-mono tabular-nums text-[#71717A]">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:block mt-6 pt-4 border-t border-[#E7E3DA] dark:border-white/[0.08]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] dark:text-slate-500 mb-2">
              Active Members
            </div>
            <div className="space-y-1.5">
              {TEAM_WORKLOAD.map((member) => (
                <div key={member.name} className="flex items-center justify-between text-[11px] text-[#52525B] dark:text-slate-300">
                  <span className="truncate">{member.name}</span>
                  <span className="font-mono tabular-nums text-[#71717A]">
                    {member.active}/{member.max}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Workspace Canvas */}
        <div ref={panelRef} className="lg:col-span-9 p-3.5 sm:p-5 bg-white dark:bg-[#111318]">
          {parseFeedback && (
            <div className="mb-3 px-3 py-1.5 rounded-md bg-[#F4F2ED] dark:bg-white/[0.05] border border-[#DDD8CE] dark:border-white/[0.08] text-[11px] font-mono text-[#18181B] dark:text-slate-200 flex items-center justify-between">
              <span>{parseFeedback}</span>
              <button
                type="button"
                onClick={() => setParseFeedback(null)}
                className="text-[#71717A] hover:text-[#18181B] dark:hover:text-white cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {activeView === "tasks" && (
            <div className="divide-y divide-[#EDE9E0] dark:divide-white/[0.07]">
              {visibleTasks.map((task) => {
                const doneCount = task.subtasks.filter((s) => s.done).length;
                return (
                  <div key={task.id} className="ws-anim py-3 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[11px] font-mono text-[#71717A] dark:text-slate-500 shrink-0">
                          {task.key}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-[#18181B] dark:text-white">
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-[11px]">
                        {task.hasProof && (
                          <span className="inline-flex items-center gap-1 text-[#52525B] dark:text-slate-400">
                            <Paperclip className="w-3 h-3" />
                            <span className="hidden sm:inline">Proof</span>
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[10px] font-medium ${
                            task.status === "Verified"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60"
                              : task.status === "In Review"
                              ? "bg-[#F4F2ED] text-[#18181B] border border-[#DDD8CE] dark:bg-white/[0.08] dark:text-slate-200 dark:border-white/10"
                              : "bg-transparent text-[#52525B] border border-[#DDD8CE] dark:text-slate-400 dark:border-white/10"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#71717A] dark:text-slate-400">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {task.subtasks.map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => toggleSubtask(task.id, st.id)}
                            className="inline-flex items-center gap-1.5 py-0.5 text-left hover:text-[#18181B] dark:hover:text-white transition-colors cursor-pointer"
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                                st.done
                                  ? "bg-[#18181B] border-[#18181B] text-white dark:bg-white dark:border-white dark:text-[#090B10]"
                                  : "border-[#C9C3B8] dark:border-white/25"
                              }`}
                            >
                              {st.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </span>
                            <span className={st.done ? "line-through text-[#8E8E93] dark:text-slate-500" : ""}>
                              {st.label}
                            </span>
                          </button>
                        ))}
                      </div>

                      <span className="font-mono tabular-nums shrink-0">
                        {task.owner} &middot; {task.due} &middot; {doneCount}/{task.subtasks.length}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeView === "timeline" && (
            <div className="space-y-3">
              <div className="grid grid-cols-12 text-[10px] font-mono uppercase tracking-wider text-[#71717A] pb-2 border-b border-[#EDE9E0] dark:border-white/[0.07]">
                <div className="col-span-5">Deliverable</div>
                <div className="col-span-7 grid grid-cols-4 text-center">
                  <span>Wk 1</span>
                  <span>Wk 2</span>
                  <span>Wk 3</span>
                  <span>Wk 4</span>
                </div>
              </div>
              {visibleTasks.map((task, idx) => {
                const doneCount = task.subtasks.filter((s) => s.done).length;
                const pct = Math.round((doneCount / Math.max(task.subtasks.length, 1)) * 100);
                const startOffset = idx % 3 === 0 ? "col-start-1 col-span-2" : idx % 3 === 1 ? "col-start-2 col-span-2" : "col-start-3 col-span-2";
                return (
                  <div key={task.id} className="ws-anim grid grid-cols-12 items-center gap-2 py-1.5 text-xs">
                    <div className="col-span-5 pr-2 truncate font-medium text-[#18181B] dark:text-slate-100">
                      <span className="font-mono text-[10px] text-[#71717A] mr-1.5">{task.key}</span>
                      {task.title}
                    </div>
                    <div className="col-span-7 grid grid-cols-4 gap-1 items-center">
                      <div
                        className={`${startOffset} h-6 rounded border border-[#DDD8CE] dark:border-white/15 bg-[#F4F2ED] dark:bg-white/[0.06] overflow-hidden relative flex items-center px-2`}
                      >
                        <div
                          style={{ width: `${pct}%` }}
                          className="absolute inset-y-0 left-0 bg-[#18181B]/12 dark:bg-white/[0.12] transition-all"
                        />
                        <span className="relative text-[10px] font-mono text-[#18181B] dark:text-slate-200 truncate">
                          {task.due} &bull; {pct}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeView === "workload" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEAM_WORKLOAD.map((member) => {
                const ratio = Math.round((member.active / member.max) * 100);
                return (
                  <div
                    key={member.name}
                    className="ws-anim p-3.5 rounded-lg border border-[#E7E3DA] dark:border-white/[0.08] bg-[#FAF8F4]/70 dark:bg-[#0D0F14]"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#18181B] dark:text-white">{member.name}</span>
                      <span className="font-mono tabular-nums text-[11px] text-[#52525B] dark:text-slate-300">
                        {member.active} / {member.max} tasks
                      </span>
                    </div>
                    <div className="text-[11px] text-[#71717A] dark:text-slate-400 mt-0.5">
                      {member.role} &mdash; {member.focus}
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-[#E5E0D6] dark:bg-white/[0.08] overflow-hidden">
                      <div
                        style={{ width: `${ratio}%` }}
                        className={`h-full rounded-full ${
                          ratio >= 80 ? "bg-amber-600" : "bg-[#18181B] dark:bg-slate-200"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeView === "intake" && (
            <div className="ws-anim space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#18181B] dark:text-white">
                  Create task from plain deliverable brief
                </h3>
                <p className="text-xs text-[#52525B] dark:text-slate-400 mt-0.5">
                  Try entering a short description. The parser maps priority, target due date, and subtasks right into this preview list.
                </p>
              </div>

              <form onSubmit={handleParseBrief} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="e.g. Audit Android Play billing webhook with Priya by Friday"
                  className="flex-1 px-3.5 py-2.5 min-h-[42px] rounded-lg bg-[#FAF8F4] dark:bg-[#0D0F14] border border-[#DDD8CE] dark:border-white/10 text-xs sm:text-sm text-[#18181B] dark:text-white placeholder-[#71717A] focus:outline-none focus:ring-2 focus:ring-[#18181B]/20"
                />
                <button
                  type="submit"
                  disabled={isParsing || !brief.trim()}
                  className="px-4 py-2.5 min-h-[42px] rounded-lg bg-[#18181B] dark:bg-white text-white dark:text-[#090B10] text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-45 cursor-pointer"
                >
                  {isParsing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Add to preview</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5">
                {[
                  "Deploy store inventory audit by Friday high priority",
                  "Fix mobile checkout timeout with 3 QA checks",
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setBrief(sample)}
                    className="px-2.5 py-1.5 rounded-md bg-[#F4F2ED] dark:bg-white/[0.05] border border-[#E7E3DA] dark:border-white/[0.08] text-[11px] text-[#52525B] dark:text-slate-300 hover:text-[#18181B] dark:hover:text-white cursor-pointer"
                  >
                    &ldquo;{sample}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
