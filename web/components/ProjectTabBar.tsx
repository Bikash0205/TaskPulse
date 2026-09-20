"use client";

import React from "react";
import { Project, TaskPulseItem, Department } from "@shared/types";
import {
  FolderPlus,
  Plus,
  Search,
  Layers,
  Columns3,
  TableProperties,
  Filter,
  FolderGit2,
} from "lucide-react";

interface ProjectTabBarProps {
  projects: Project[];
  tasks: TaskPulseItem[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onOpenNewProjectModal: () => void;
  onOpenNewTaskModal: () => void;
  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
  departments: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "sections" | "kanban" | "table";
  onViewModeChange: (mode: "sections" | "kanban" | "table") => void;
  canDispatch: boolean;
  assignedProjectIds?: string[];
}

export const ProjectTabBar: React.FC<ProjectTabBarProps> = ({
  projects,
  tasks,
  activeProjectId,
  onSelectProject,
  onOpenNewProjectModal,
  onOpenNewTaskModal,
  selectedDepartment,
  onSelectDepartment,
  departments,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  canDispatch,
  assignedProjectIds,
}) => {
  return (
    <div className="flex flex-col gap-3.5 bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] rounded-2xl p-4 shadow-sm transition-colors">
      {/* 1. TOP HORIZONTAL PROJECT TABS */}
      <div className="flex items-center justify-between gap-3 border-b border-[#E9F1FF] dark:border-[#1E293B] pb-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          {/* "ALL PROJECTS" TAB */}
          <button
            onClick={() => onSelectProject("all")}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeProjectId === "all"
                ? "bg-[#756EF3] text-white shadow-sm shadow-[#756EF3]/30"
                : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <FolderGit2 className={`w-4 h-4 ${activeProjectId === "all" ? "text-white" : "text-[#756EF3]"}`} />
            <span>All Projects</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                activeProjectId === "all"
                  ? "bg-white/25 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {projects.length}
            </span>
          </button>

          {/* INDIVIDUAL PROJECT TABS */}
          {projects.map((proj) => {
            const isActive = activeProjectId === proj.id;
            const projTasks = tasks.filter(
              (t) =>
                t.projectId === proj.id ||
                (t.projectName && t.projectName.toLowerCase() === proj.name.toLowerCase())
            );
            const projDone = projTasks.filter((t) => t.status === "completed").length;
            const isAssigned = assignedProjectIds?.includes(proj.id);

            return (
              <button
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                  isActive
                    ? "bg-[#756EF3] text-white border-[#756EF3] shadow-sm shadow-[#756EF3]/30"
                    : "bg-slate-50 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
                }`}
              >
                {/* Project Code Pill */}
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#756EF3]/10 dark:bg-[#756EF3]/20 text-[#756EF3] dark:text-[#818CF8]"
                  }`}
                >
                  {proj.code}
                </span>

                <span className="truncate max-w-[140px]">{proj.name}</span>

                {/* Progress & Task Fraction */}
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-normal transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800"
                  }`}
                >
                  {projDone}/{projTasks.length}
                </span>

                {isAssigned && (
                  <span
                    className={`w-2 h-2 rounded-full ${isActive ? "bg-amber-300" : "bg-indigo-500"}`}
                    title="Assigned to you"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button: + New Project */}
        {canDispatch && (
          <button
            onClick={onOpenNewProjectModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#756EF3] dark:text-[#818CF8] bg-[#756EF3]/10 dark:bg-[#756EF3]/15 hover:bg-[#756EF3]/20 border border-[#756EF3]/30 transition-all cursor-pointer shrink-0"
            title="Create a new Project"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Project</span>
          </button>
        )}
      </div>

      {/* 2. SUB-BAR: DEPARTMENT FILTER, SEARCH & VIEW MODE SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Department Pills & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Chips */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <Filter className="w-3 h-3 text-slate-400 ml-1.5 mr-0.5" />
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => onSelectDepartment(dept)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedDepartment === dept
                    ? "bg-[#756EF3] text-white shadow-xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex items-center w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks, categories..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#756EF3] w-full sm:w-48 md:w-60 transition-colors"
            />
          </div>
        </div>

        {/* Right: View Switcher & + New Task CTA */}
        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => onViewModeChange("sections")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === "sections"
                  ? "bg-white dark:bg-slate-800 text-[#756EF3] dark:text-[#818CF8] shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              title="Category & Section View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sections</span>
            </button>

            <button
              onClick={() => onViewModeChange("kanban")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-white dark:bg-slate-800 text-[#756EF3] dark:text-[#818CF8] shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              title="Kanban Board View"
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Board</span>
            </button>

            <button
              onClick={() => onViewModeChange("table")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-800 text-[#756EF3] dark:text-[#818CF8] shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              title="Structured Table View"
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>
          </div>

          {/* + New Task Primary CTA */}
          {canDispatch && (
            <button
              onClick={onOpenNewTaskModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
