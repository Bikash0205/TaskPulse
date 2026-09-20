"use client";

import React from "react";
import { Project, TaskPulseItem } from "@shared/types";
import {
  Folder,
  FolderOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  User,
  Users,
  Calendar,
  Sparkles,
} from "lucide-react";

interface ProjectFolderCardProps {
  project: Project;
  tasks: TaskPulseItem[];
  isOpen?: boolean;
  onOpenFolder: (projectId: string) => void;
  folderColor?: string;
}

const DEFAULT_FOLDER_COLORS: Record<string, { bg: string; tabBg: string; border: string; accent: string; glow: string }> = {
  Engineering: {
    bg: "from-indigo-900/15 to-blue-900/10 dark:from-indigo-950/40 dark:to-slate-900/60",
    tabBg: "bg-indigo-600 dark:bg-indigo-500",
    border: "border-indigo-200 dark:border-indigo-800/60",
    accent: "text-indigo-600 dark:text-indigo-400",
    glow: "shadow-indigo-500/10",
  },
  Design: {
    bg: "from-purple-900/15 to-pink-900/10 dark:from-purple-950/40 dark:to-slate-900/60",
    tabBg: "bg-purple-600 dark:bg-purple-500",
    border: "border-purple-200 dark:border-purple-800/60",
    accent: "text-purple-600 dark:text-purple-400",
    glow: "shadow-purple-500/10",
  },
  Marketing: {
    bg: "from-amber-900/15 to-orange-900/10 dark:from-amber-950/40 dark:to-slate-900/60",
    tabBg: "bg-amber-600 dark:bg-amber-500",
    border: "border-amber-200 dark:border-amber-800/60",
    accent: "text-amber-600 dark:text-amber-400",
    glow: "shadow-amber-500/10",
  },
  Product: {
    bg: "from-emerald-900/15 to-teal-900/10 dark:from-emerald-950/40 dark:to-slate-900/60",
    tabBg: "bg-emerald-600 dark:bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-800/60",
    accent: "text-emerald-600 dark:text-emerald-400",
    glow: "shadow-emerald-500/10",
  },
};

export const ProjectFolderCard: React.FC<ProjectFolderCardProps> = ({
  project,
  tasks,
  isOpen = false,
  onOpenFolder,
  folderColor,
}) => {
  const projectTasks = tasks.filter(
    (t) =>
      t.projectId === project.id ||
      (t.projectName && t.projectName.toLowerCase() === project.name.toLowerCase())
  );

  const completedTasks = projectTasks.filter((t) => t.status === "completed");
  const inProgressTasks = projectTasks.filter((t) => t.status === "in_progress");
  const inReviewTasks = projectTasks.filter((t) => t.status === "in_review");
  const backlogTasks = projectTasks.filter((t) => t.status === "backlog");

  const progressPercentage =
    projectTasks.length > 0
      ? Math.round((completedTasks.length / projectTasks.length) * 100)
      : project.progressPercentage || 0;

  // Extract team members working inside this folder
  const assignees = React.useMemo(() => {
    const map = new Map<string, { name: string; avatarUrl?: string; isInvited?: boolean }>();
    projectTasks.forEach((t) => {
      if (t.assignee) {
        map.set(t.assignee.id, {
          name: t.assignee.name,
          avatarUrl: t.assignee.avatarUrl,
          isInvited: t.assignee.isInvited,
        });
      }
    });
    return Array.from(map.values());
  }, [projectTasks]);

  const colorTheme =
    DEFAULT_FOLDER_COLORS[project.department] || DEFAULT_FOLDER_COLORS["Engineering"];

  return (
    <div
      onClick={() => onOpenFolder(project.id)}
      className={`group relative rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${colorTheme.glow}`}
    >
      {/* Visual Folder Tab */}
      <div className="flex items-center">
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-t-xl text-white text-xs font-mono font-bold tracking-wider shadow-xs transition-transform group-hover:scale-102 ${colorTheme.tabBg}`}
        >
          {isOpen ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />}
          <span>{project.code}</span>
          <span className="text-[10px] opacity-80 uppercase tracking-normal">FOLDER</span>
        </div>
        <div className="h-4 flex-1 border-b border-[#E2E8F0] dark:border-slate-800" />
      </div>

      {/* Main Folder Body / Cover */}
      <div
        className={`p-5 rounded-b-2xl rounded-tr-2xl bg-gradient-to-br ${colorTheme.bg} bg-white dark:bg-[#111827] border ${colorTheme.border} shadow-md flex flex-col justify-between min-h-[220px] transition-colors`}
      >
        {/* Top Header Row */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {project.department}
                </span>
                {project.targetDate && (
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {project.targetDate}
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#756EF3] dark:group-hover:text-[#818CF8] transition-colors">
                {project.name}
              </h3>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-500"
                  strokeDasharray={`${progressPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-slate-800 dark:text-slate-200 font-mono">
                {progressPercentage}%
              </span>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Task Breakdown Pills */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            <div className="p-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/50">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-mono">Total</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">{projectTasks.length}</div>
            </div>
            <div className="p-1.5 rounded-lg bg-blue-50/80 dark:bg-blue-950/30">
              <div className="text-blue-500 text-[10px] uppercase font-mono">Active</div>
              <div className="font-bold text-blue-600 dark:text-blue-400">{inProgressTasks.length}</div>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/30">
              <div className="text-amber-500 text-[10px] uppercase font-mono">Review</div>
              <div className="font-bold text-amber-600 dark:text-amber-400">{inReviewTasks.length}</div>
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30">
              <div className="text-emerald-500 text-[10px] uppercase font-mono">Done</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400">{completedTasks.length}</div>
            </div>
          </div>

          {/* Footer: Team Avatars & Open Folder CTA */}
          <div className="mt-3.5 flex items-center justify-between">
            {/* Collaborators Stack */}
            <div className="flex items-center">
              {assignees.length > 0 ? (
                <div className="flex items-center -space-x-2 overflow-hidden">
                  {assignees.slice(0, 4).map((m, idx) => (
                    <div
                      key={idx}
                      title={m.name + (m.isInvited ? " (Invited via Email)" : "")}
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-[#756EF3] text-white text-[10px] font-bold flex items-center justify-center overflow-hidden"
                    >
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} alt={m.name} className="h-full w-full object-cover" />
                      ) : (
                        m.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  ))}
                  {assignees.length > 4 && (
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[9px] font-bold flex items-center justify-center">
                      +{assignees.length - 4}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">No tasks assigned yet</span>
              )}
            </div>

            {/* Open Folder Action */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8] group-hover:translate-x-0.5 transition-transform">
              <span>Open Folder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
