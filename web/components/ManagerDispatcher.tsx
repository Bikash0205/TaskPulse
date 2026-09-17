"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskPulseItem, ColleagueProfile, TaskStatus, UserRole, Department, Project } from "@shared/types";
import { TaskPulseCard } from "./TaskPulseCard";
import { Plus, Search, Filter, Layers, X, FolderGit2, FolderPlus, Trash2, RotateCcw, Check, Sparkles } from "lucide-react";

interface ManagerDispatcherProps {
  tasks: TaskPulseItem[];
  projects: Project[];
  colleagues: ColleagueProfile[];
  currentRole: UserRole;
  currentUserId: string;
  assignedProjectIds?: string[];
  activeProjectId?: string;
  initialProjectId?: string;
  onSelectProject?: (projectId: string) => void;
  onUpdateTask: (task: TaskPulseItem) => void;
  onAddTask: (task: TaskPulseItem) => void;
  onAddProject?: (project: Project) => void;
  onAddSubtask?: (taskId: string, subtaskTitle: string) => void;
  onDeleteSubtask?: (taskId: string, subtaskId: string) => void;
  onUpdateTaskProgress: (taskId: string, progress: number) => void;
  onToggleTaskBlocked: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onClearTasks?: () => void;
  onResetDemoTasks?: () => void;
}

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "in_progress", label: "In Progress" },
  { id: "in_review", label: "In Review" },
  { id: "completed", label: "Completed" },
];

export const ManagerDispatcher: React.FC<ManagerDispatcherProps> = ({
  tasks,
  projects,
  colleagues,
  currentRole,
  currentUserId,
  assignedProjectIds,
  activeProjectId,
  initialProjectId,
  onSelectProject,
  onUpdateTask,
  onAddTask,
  onAddProject,
  onAddSubtask,
  onDeleteSubtask,
  onUpdateTaskProgress,
  onToggleTaskBlocked,
  onToggleSubtask,
  onClearTasks,
  onResetDemoTasks,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(activeProjectId || initialProjectId || "all");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    if (activeProjectId) {
      setSelectedProjectId(activeProjectId);
    } else if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
    }
  }, [activeProjectId, initialProjectId]);

  const handleSelectProject = (projId: string) => {
    setSelectedProjectId(projId);
    if (onSelectProject) {
      onSelectProject(projId);
    }
  };

  // New project modal state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjCode, setNewProjCode] = useState("");
  const [newProjDept, setNewProjDept] = useState<Department>("Engineering");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjDate, setNewProjDate] = useState("");

  // New task form fields
  const [newTitle, setNewTitle] = useState("");
  const [newProjectId, setNewProjectId] = useState(projects[0]?.id || "");
  const [newDept, setNewDept] = useState<Department>("Engineering");
  const [newBadge, setNewBadge] = useState("WEB-BACKEND");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [newAssigneeId, setNewAssigneeId] = useState(colleagues[0]?.id || "");
  const [rawSubtasks, setRawSubtasks] = useState("");

  const departments = ["All", "Engineering", "Marketing", "Product", "Design"];

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesProject = selectedProjectId === "all" || task.projectId === selectedProjectId;
      const matchesDept = selectedDept === "All" || task.department === selectedDept;
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.projectBadge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.projectName && task.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesProject && matchesDept && matchesSearch;
    });
  }, [tasks, selectedProjectId, selectedDept, searchQuery]);

  const activeProject = useMemo(() => {
    if (selectedProjectId === "all") return null;
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [selectedProjectId, projects]);

  const activeProjectProgress = useMemo(() => {
    if (!activeProject) return 0;
    const projectTasks = tasks.filter((t) => t.projectId === activeProject.id);
    if (projectTasks.length === 0) return 0;
    const sum = projectTasks.reduce((acc, t) => acc + t.progressPercentage, 0);
    return Math.round(sum / projectTasks.length);
  }, [activeProject, tasks]);

  const canDispatch = currentRole === "admin" || currentRole === "manager" || !currentUserId;

  const handleMoveColumn = (task: TaskPulseItem, nextStatus: TaskStatus) => {
    if (task.status === nextStatus) return;

    if (currentRole === "member" && task.assignee?.id !== currentUserId) {
      alert("Permission restricted: Members can only move tasks assigned to them.");
      return;
    }

    onUpdateTask({
      ...task,
      status: nextStatus,
      progressPercentage: nextStatus === "completed" ? 100 : task.progressPercentage,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const assignee = colleagues.find((c) => c.id === newAssigneeId);
    const parentProj = projects.find((p) => p.id === newProjectId);

    const subtaskItems = rawSubtasks
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((title, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        title,
        completed: false,
      }));

    const newTask: TaskPulseItem = {
      id: `task-${Date.now()}`,
      projectId: parentProj?.id || (newProjectId ? `proj-${Date.now()}` : undefined),
      projectName: parentProj?.name || (newProjectId ? newProjectId : undefined),
      title: newTitle.trim(),
      department: newDept,
      projectBadge: newBadge.toUpperCase(),
      status: "backlog",
      progressPercentage: 0,
      priority: newPriority,
      assignee,
      subtasks: subtaskItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setNewTitle("");
    setRawSubtasks("");
    setIsModalOpen(false);
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim() || !newProjCode.trim()) return;

    const code = newProjCode.trim().toUpperCase();
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: newProjName.trim(),
      code,
      department: newProjDept,
      description: newProjDesc.trim() || undefined,
      progressPercentage: 0,
      targetDate: newProjDate.trim() || undefined,
    };

    if (onAddProject) {
      onAddProject(newProj);
    }
    setSelectedProjectId(newProj.id);
    setNewProjectId(newProj.id);
    setNewDept(newProj.department);
    setNewBadge(`${code}-TASK`);

    setNewProjName("");
    setNewProjCode("");
    setNewProjDesc("");
    setNewProjDate("");
    setIsProjectModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Project Selector & Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-sm transition-colors duration-200">
        <div className="flex flex-wrap items-center gap-2">
          {/* Project Switcher Dropdown */}
          <div className="flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-slate-800">
            <FolderGit2 className="w-4 h-4 text-[#756EF3] dark:text-[#818CF8]" />
            <select
              value={selectedProjectId}
              onChange={(e) => handleSelectProject(e.target.value)}
              className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#756EF3] cursor-pointer"
            >
              <option value="all">All Projects ({projects.length})</option>
              {projects.map((proj) => {
                const isAssigned = assignedProjectIds?.includes(proj.id);
                return (
                  <option key={proj.id} value={proj.id}>
                    [{proj.code}] {proj.name} {isAssigned ? "★ (Assigned)" : ""}
                  </option>
                );
              })}
            </select>

            {assignedProjectIds && assignedProjectIds.length > 0 && selectedProjectId === "all" && (
              <button
                onClick={() => handleSelectProject(assignedProjectIds[0])}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                title="Directly jump to your assigned project"
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>My Assigned Project</span>
              </button>
            )}
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1 mr-0.5" />
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedDept === dept
                    ? "bg-[#756EF3] text-white shadow-sm font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, to-do items..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#756EF3] w-44 sm:w-56"
            />
          </div>
        </div>

        {/* Dispatch & Board Actions */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          {tasks.length > 0 && onClearTasks ? (
            <button
              onClick={onClearTasks}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 font-medium text-xs transition-colors cursor-pointer"
              title="Clear demo data and start with an empty board"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Demo Tasks</span>
            </button>
          ) : onResetDemoTasks ? (
            <button
              onClick={onResetDemoTasks}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#756EF3]/30 bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] dark:text-[#818CF8] font-medium text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Sample Tasks</span>
            </button>
          ) : null}

          {canDispatch && onAddProject && (
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#756EF3]/30 bg-[#F0EFFF] dark:bg-[#756EF3]/15 hover:bg-[#E2E0FD] text-[#756EF3] dark:text-[#818CF8] font-semibold text-xs transition-colors shadow-xs cursor-pointer"
              title="Create a new Project"
            >
              <FolderPlus className="w-4 h-4 text-[#756EF3] dark:text-[#818CF8]" />
              <span>New Project</span>
            </button>
          )}

          {canDispatch && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#756EF3] hover:bg-[#635BFF] text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          )}
        </div>
      </div>

      {/* Active Project Header (When a project is selected) */}
      {activeProject && (
        <div className="p-4 rounded-xl bg-[#F0EFFF]/50 dark:bg-[#151C2C] border border-[#756EF3]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 text-xs font-bold font-mono rounded bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] dark:text-[#818CF8] border border-[#756EF3]/30">
                {activeProject.code}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{activeProject.name}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">({activeProject.department})</span>
              {assignedProjectIds?.includes(activeProject.id) && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <Check className="w-3 h-3" />
                  <span>Assigned to You</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{activeProject.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={() => {
                setNewProjectId(activeProject.id);
                setNewDept(activeProject.department);
                setNewBadge(`${activeProject.code}-TASK`);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#756EF3] hover:bg-[#635BFF] text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task to {activeProject.code}</span>
            </button>

            {/* Project Overall Progress Meter */}
            <div className="w-full sm:w-56 space-y-1.5 bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">Project Progress:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{activeProjectProgress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${activeProjectProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((column) => {
          const colTasks = filteredTasks.filter((t) => t.status === column.id);

          return (
            <div
              key={column.id}
              className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-[#0B0F19]/90 border border-slate-200 dark:border-slate-800 flex flex-col min-h-[580px] transition-colors"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      column.id === "backlog"
                        ? "bg-slate-400"
                        : column.id === "in_progress"
                        ? "bg-[#F0EFFF]0"
                        : column.id === "in_review"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase font-mono">
                    {column.label}
                  </h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto no-scrollbar">
                <AnimatePresence mode="popLayout">
                  {colTasks.map((task) => (
                    <div key={task.id} className="relative">
                      <TaskPulseCard
                        task={task}
                        currentRole={currentRole}
                        currentUserId={currentUserId}
                        isDraggable={true}
                        onUpdateProgress={onUpdateTaskProgress}
                        onToggleBlocked={onToggleTaskBlocked}
                        onToggleSubtask={onToggleSubtask}
                        onAddSubtask={onAddSubtask}
                        onDeleteSubtask={onDeleteSubtask}
                      />

                      {/* Manager Review Action Box */}
                      {column.id === "in_review" && (
                        <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs shadow-xs space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                              Manager Verification Required
                            </span>
                            <span className="text-[10px] font-mono opacity-80">100% Done</span>
                          </div>
                          <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80 leading-snug">
                            Assignee completed all work. Project Manager review required to approve completion.
                          </p>
                          <div className="flex items-center gap-2 pt-0.5">
                            <button
                              onClick={() => {
                                onUpdateTask({
                                  ...task,
                                  status: "completed",
                                  progressPercentage: 100,
                                  verifiedByManager: true,
                                  reviewerName: "Project Manager",
                                  verifiedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                  updatedAt: new Date().toISOString(),
                                });
                              }}
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve & Complete</span>
                            </button>
                            <button
                              onClick={() => {
                                onUpdateTask({
                                  ...task,
                                  status: "in_progress",
                                  progressPercentage: 80,
                                  reviewFeedback: "Revision requested by Project Manager",
                                  updatedAt: new Date().toISOString(),
                                });
                              }}
                              className="py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 font-medium text-[11px] transition-colors cursor-pointer"
                            >
                              Request Changes
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Fast Move Trigger */}
                      <div className="mt-1 flex items-center justify-end gap-1 px-1 text-[9px] font-mono text-slate-500">
                        <span>Move:</span>
                        {COLUMNS.filter((c) => c.id !== column.id).map((c) => (
                          <button
                            key={c.id}
                            onClick={() => handleMoveColumn(task, c.id)}
                            className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 transition-colors"
                          >
                            {c.label.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </AnimatePresence>

                {colTasks.length === 0 && (
                  <div className="h-32 flex flex-col items-center justify-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg p-4 text-center">
                    <Layers className="w-4 h-4 mb-1.5 opacity-40" />
                    No tasks in {column.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">Create New Workstream Task</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Parent Project</label>
                {projects.length > 0 ? (
                  <select
                    value={newProjectId}
                    onChange={(e) => {
                      setNewProjectId(e.target.value);
                      const selected = projects.find((p) => p.id === e.target.value);
                      if (selected) {
                        setNewDept(selected.department);
                        setNewBadge(`${selected.code}-TASK`);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3]"
                  >
                    <option value="">No Project (General)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.code}] {p.name} ({p.department})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={newProjectId}
                    onChange={(e) => setNewProjectId(e.target.value)}
                    placeholder="e.g. Core System or General (Optional)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#756EF3]"
                  />
                )}
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Backend: Payment Webhooks & Stripe Integration"
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#756EF3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Track Badge</label>
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    placeholder="e.g. WEB-BACKEND"
                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3] capitalize"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Assign Colleague</label>
                <select
                  value={newAssigneeId}
                  onChange={(e) => setNewAssigneeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3]"
                >
                  <option value="">Unassigned</option>
                  {colleagues.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.department} &bull; {c.activeTaskCount} active tasks)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Subtask Checklist <span className="text-slate-500">(1 per line)</span>
                </label>
                <textarea
                  rows={3}
                  value={rawSubtasks}
                  onChange={(e) => setRawSubtasks(e.target.value)}
                  placeholder="Design PostgreSQL relational schema&#10;Implement JWT authorization&#10;Run automated migration tests"
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#756EF3] font-mono text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-[#756EF3] hover:bg-[#635BFF] text-white font-semibold shadow-sm"
                >
                  Dispatch Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Creation Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#756EF3] dark:text-[#818CF8]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Create New Project</h3>
              </div>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newProjName}
                  onChange={(e) => {
                    setNewProjName(e.target.value);
                    if (!newProjCode && e.target.value.length >= 3) {
                      setNewProjCode(e.target.value.substring(0, 4).toUpperCase());
                    }
                  }}
                  placeholder="e.g. Mobile Banking Application"
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#756EF3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Project Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjCode}
                    onChange={(e) => setNewProjCode(e.target.value.toUpperCase())}
                    placeholder="e.g. BANK"
                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3] font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Department</label>
                  <select
                    value={newProjDept}
                    onChange={(e) => setNewProjDept(e.target.value as Department)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3]"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                    <option value="Security">Security</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Target Deadline</label>
                <input
                  type="text"
                  value={newProjDate}
                  onChange={(e) => setNewProjDate(e.target.value)}
                  placeholder="e.g. Dec 15, 2026"
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#756EF3]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Summarize project objectives, scope, and key deliverables..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#756EF3] text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#756EF3] hover:bg-[#635BFF] text-white font-semibold shadow-sm cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDispatcher;
