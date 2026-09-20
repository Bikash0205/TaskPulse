"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskPulseItem, ColleagueProfile, TaskStatus, UserRole, Department, Project } from "@shared/types";
import { TaskPulseCard } from "./TaskPulseCard";
import { ProjectTabBar } from "./ProjectTabBar";
import { TaskDetailModal } from "./TaskDetailModal";
import { ProjectFolderCard } from "./ProjectFolderCard";
import {
  Plus,
  Layers,
  X,
  FolderGit2,
  FolderPlus,
  Trash2,
  RotateCcw,
  Check,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Calendar,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  User,
  Folder,
  FolderOpen,
  Mail,
  UserPlus,
  ArrowLeft,
} from "lucide-react";

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
  activeProjectId: propActiveProjectId,
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
  const [selectedProjectId, setSelectedProjectId] = useState<string>(propActiveProjectId || initialProjectId || "all");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"sections" | "kanban" | "table">("sections");

  // Task Detail Modal State
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<TaskPulseItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // New Task Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newProjectId, setNewProjectId] = useState(projects[0]?.id || "");
  const [newDept, setNewDept] = useState<Department>("Engineering");
  const [newCategory, setNewCategory] = useState("");
  const [newBadge, setNewBadge] = useState("WEB-BACKEND");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [newAssigneeId, setNewAssigneeId] = useState(colleagues[0]?.id || "");
  const [rawSubtasks, setRawSubtasks] = useState("");

  // New Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjCode, setNewProjCode] = useState("");
  const [newProjDept, setNewProjDept] = useState<Department>("Engineering");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjDate, setNewProjDate] = useState("");

  // Collapsed sections tracking
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // View style for All Projects: "folders" (Executive Folder Dossiers) vs "expanded" (all workstream cards)
  const [allProjectsViewStyle, setAllProjectsViewStyle] = useState<"folders" | "expanded">("folders");

  // Email Invitation State
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteSuccessToast, setInviteSuccessToast] = useState<string | null>(null);

  React.useEffect(() => {
    if (propActiveProjectId) {
      setSelectedProjectId(propActiveProjectId);
    } else if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
    }
  }, [propActiveProjectId, initialProjectId]);

  const handleSelectProject = (projId: string) => {
    setSelectedProjectId(projId);
    if (onSelectProject) {
      onSelectProject(projId);
    }
  };

  const departments = useMemo(() => {
    const taskDepts = tasks.map((t) => t.department).filter(Boolean);
    const colleagueDepts = colleagues.map((c) => c.department).filter(Boolean);
    const projectDepts = projects.map((p) => p.department).filter(Boolean);
    const combined = Array.from(new Set([...taskDepts, ...colleagueDepts, ...projectDepts]));
    return ["All", ...(combined.length > 0 ? combined : ["Engineering", "Marketing", "Design", "Product"])];
  }, [tasks, colleagues, projects]);

  const activeProject = useMemo(() => {
    if (selectedProjectId === "all") return null;
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [selectedProjectId, projects]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesProject =
        selectedProjectId === "all" ||
        task.projectId === selectedProjectId ||
        (activeProject && task.projectName && task.projectName.toLowerCase() === activeProject.name.toLowerCase());
      const matchesDept = selectedDept === "All" || task.department.toLowerCase() === selectedDept.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.projectBadge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.category && task.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.projectName && task.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesProject && matchesDept && matchesSearch;
    });
  }, [tasks, selectedProjectId, activeProject, selectedDept, searchQuery]);

  // Tasks grouped by Project (for "all" view)
  const tasksByProject = useMemo(() => {
    const map = new Map<string, TaskPulseItem[]>();
    projects.forEach((p) => map.set(p.id, []));

    filteredTasks.forEach((t) => {
      const matchProj = projects.find(
        (p) => p.id === t.projectId || (t.projectName && p.name.toLowerCase() === t.projectName.toLowerCase())
      );
      if (matchProj) {
        const list = map.get(matchProj.id) || [];
        list.push(t);
        map.set(matchProj.id, list);
      } else {
        const generalList = map.get("general") || [];
        generalList.push(t);
        map.set("general", generalList);
      }
    });

    return map;
  }, [filteredTasks, projects]);

  // Tasks grouped by Category/Section (for single project view)
  const tasksByCategory = useMemo(() => {
    const map = new Map<string, TaskPulseItem[]>();
    filteredTasks.forEach((t) => {
      const cat = t.category || "General Workstream";
      const list = map.get(cat) || [];
      list.push(t);
      map.set(cat, list);
    });
    return map;
  }, [filteredTasks]);

  const activeProjectProgress = useMemo(() => {
    if (!activeProject) return 0;
    const projectTasks = tasks.filter(
      (t) =>
        t.projectId === activeProject.id ||
        (activeProject.name && t.projectName && t.projectName.toLowerCase() === activeProject.name.toLowerCase())
    );
    if (projectTasks.length === 0) return 0;
    const sum = projectTasks.reduce((acc, t) => acc + t.progressPercentage, 0);
    return Math.round(sum / projectTasks.length);
  }, [activeProject, tasks]);

  const canDispatch = currentRole === "admin" || currentRole === "manager" || !currentUserId;

  const handleOpenTaskDetail = (task: TaskPulseItem) => {
    setSelectedTaskForDetail(task);
    setIsDetailModalOpen(true);
  };

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

    let assignee = colleagues.find((c) => c.id === newAssigneeId);

    // If manager chose to invite a new person via email
    if (newAssigneeId === "INVITE_NEW" && inviteEmail.trim()) {
      const email = inviteEmail.trim();
      const name = inviteName.trim() || email.split("@")[0];
      assignee = {
        id: `invite-${Date.now()}`,
        name,
        role: "member",
        department: newDept,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        activeTaskCount: 1,
        maxBandwidth: 5,
        isOnline: false,
        isInvited: true,
        invitedEmail: email,
      };

      setInviteSuccessToast(`Invitation dispatched to ${email} with folder access!`);
      setTimeout(() => setInviteSuccessToast(null), 4500);
    }

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
      category: newCategory.trim() || undefined,
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
    setNewCategory("");
    setRawSubtasks("");
    setInviteEmail("");
    setInviteName("");
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
    <div className="flex flex-col gap-5">
      {/* 1. PROJECT TAB BAR (TAB-WISE NAVIGATION) */}
      <ProjectTabBar
        projects={projects}
        tasks={tasks}
        activeProjectId={selectedProjectId}
        onSelectProject={handleSelectProject}
        onOpenNewProjectModal={() => setIsProjectModalOpen(true)}
        onOpenNewTaskModal={() => {
          if (activeProject) {
            setNewProjectId(activeProject.id);
            setNewDept(activeProject.department);
            setNewBadge(`${activeProject.code}-TASK`);
          }
          setIsModalOpen(true);
        }}
        selectedDepartment={selectedDept}
        onSelectDepartment={setSelectedDept}
        departments={departments}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        canDispatch={canDispatch}
        assignedProjectIds={assignedProjectIds}
      />

      {/* 2. ACTIVE PROJECT HERO BANNER (When viewing a specific project tab) */}
      {activeProject && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectProject("all")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#151C2C] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#756EF3] dark:hover:text-[#818CF8] hover:border-[#756EF3]/40 shadow-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Project Folders</span>
            </button>
            <span className="text-slate-400 dark:text-slate-600 font-mono text-xs">/</span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-300">
              <FolderOpen className="w-3.5 h-3.5 text-[#756EF3]" />
              <span className="font-semibold text-slate-900 dark:text-slate-100">{activeProject.name}</span>
              <span className="text-[11px] text-slate-400">({activeProject.code} Dossier)</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-blue-50/50 dark:from-[#151C2C] dark:to-[#111827] border border-[#756EF3]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 text-xs font-bold font-mono rounded-lg bg-[#756EF3] text-white shadow-xs">
                  {activeProject.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{activeProject.name}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">({activeProject.department})</span>
                {activeProject.targetDate && (
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-[#756EF3]" />
                    <span>Target: {activeProject.targetDate}</span>
                  </span>
                )}
                {assignedProjectIds?.includes(activeProject.id) && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <Check className="w-3 h-3" />
                    <span>Assigned Workstream</span>
                  </span>
                )}
              </div>
              {activeProject.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  {activeProject.description}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {canDispatch && (
                <button
                  onClick={() => {
                    setNewProjectId(activeProject.id);
                    setNewDept(activeProject.department);
                    setNewBadge(`${activeProject.code}-TASK`);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task to {activeProject.code}</span>
                </button>
              )}

              {/* Project Overall Progress Meter */}
              <div className="w-full sm:w-56 space-y-1.5 bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Folder Velocity:</span>
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
        </div>
      )}

      {/* 3. SECTION-WISE & CATEGORY-WISE LAYOUT */}

      {/* VIEW A: SECTIONS / CATEGORY VIEW */}
      {viewMode === "sections" && (
        <div className="space-y-6">
          {/* If viewing ALL PROJECTS: Manager Project Folders Hub */}
          {selectedProjectId === "all" ? (
            <div className="space-y-5">
              {/* Folder Workspace Control Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <Folder className="w-5 h-5 text-[#756EF3]" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Manager Project Folders
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#756EF3]/10 text-[#756EF3] dark:text-[#818CF8] border border-[#756EF3]/20">
                      {projects.length} Active Dossiers
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Click any folder to inspect task velocity inside, review deliverables, and assign or invite team members.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => setAllProjectsViewStyle("folders")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        allProjectsViewStyle === "folders"
                          ? "bg-white dark:bg-slate-800 text-[#756EF3] dark:text-[#818CF8] shadow-xs"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5" />
                      <span>Folder Dossiers</span>
                    </button>
                    <button
                      onClick={() => setAllProjectsViewStyle("expanded")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        allProjectsViewStyle === "expanded"
                          ? "bg-white dark:bg-slate-800 text-[#756EF3] dark:text-[#818CF8] shadow-xs"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Expanded Workstreams</span>
                    </button>
                  </div>

                  {canDispatch && (
                    <button
                      onClick={() => setIsProjectModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>New Folder</span>
                    </button>
                  )}
                </div>
              </div>

              {allProjectsViewStyle === "folders" ? (
                /* Interactive Executive Folder Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {projects
                    .filter(
                      (p) => selectedDept === "All" || p.department.toLowerCase() === selectedDept.toLowerCase()
                    )
                    .map((proj) => (
                      <ProjectFolderCard
                        key={proj.id}
                        project={proj}
                        tasks={tasks}
                        isOpen={false}
                        onOpenFolder={(projId) => handleSelectProject(projId)}
                      />
                    ))}
                </div>
              ) : (
                /* Expanded Project Sections */
                <div className="space-y-6">
                  {projects.map((proj) => {
                    const projTasks = tasksByProject.get(proj.id) || [];
                    if (selectedDept !== "All" && proj.department.toLowerCase() !== selectedDept.toLowerCase()) {
                      return null;
                    }
                    const isCollapsed = !!collapsedCategories[proj.id];
                    const completedCount = projTasks.filter((t) => t.status === "completed").length;
                    const percent = projTasks.length > 0 ? Math.round((completedCount / projTasks.length) * 100) : 0;

                    return (
                      <div
                        key={proj.id}
                        className="rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs overflow-hidden transition-all"
                      >
                        {/* Project Section Header */}
                        <div className="p-4 border-b border-[#E9F1FF] dark:border-[#1E293B] flex items-center justify-between gap-4 bg-slate-50/60 dark:bg-slate-900/40">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                setCollapsedCategories((prev) => ({ ...prev, [proj.id]: !prev[proj.id] }))
                              }
                              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition-colors"
                            >
                              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-md bg-[#756EF3]/10 dark:bg-[#756EF3]/20 text-[#756EF3] dark:text-[#818CF8]">
                              {proj.code}
                            </span>

                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{proj.name}</h3>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">({proj.department})</span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{proj.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Mini Progress */}
                            <div className="hidden sm:flex items-center gap-2.5 text-xs font-mono">
                              <span className="text-slate-500">
                                {completedCount}/{projTasks.length} Done
                              </span>
                              <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">{percent}%</span>
                            </div>

                            {/* Jump to Project Tab */}
                            <button
                              onClick={() => handleSelectProject(proj.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#756EF3] dark:text-[#818CF8] bg-[#756EF3]/10 hover:bg-[#756EF3]/20 transition-colors cursor-pointer"
                            >
                              <span>Open Folder</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Project Tasks Cards Grid */}
                        {!isCollapsed && (
                          <div className="p-4">
                            {projTasks.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                                {projTasks.map((task) => (
                                  <div key={task.id} onClick={() => handleOpenTaskDetail(task)}>
                                    <TaskPulseCard
                                      task={task}
                                      currentRole={currentRole}
                                      currentUserId={currentUserId}
                                      isDraggable={false}
                                      onSelect={() => handleOpenTaskDetail(task)}
                                      onUpdateProgress={onUpdateTaskProgress}
                                      onToggleBlocked={onToggleTaskBlocked}
                                      onToggleSubtask={onToggleSubtask}
                                      onAddSubtask={onAddSubtask}
                                      onDeleteSubtask={onDeleteSubtask}
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                No tasks recorded under this project yet.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* If viewing a SINGLE PROJECT: Arrange by Functional Category / Section */
            <div className="space-y-6">
                {Array.from(tasksByCategory.entries()).map(([category, catTasks]) => {
                  const isCollapsed = !!collapsedCategories[category];
                  const completedCount = catTasks.filter((t) => t.status === "completed").length;
                  const percent = catTasks.length > 0 ? Math.round((completedCount / catTasks.length) * 100) : 0;

                  return (
                    <div
                      key={category}
                      className="rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs overflow-hidden transition-all"
                    >
                      {/* Category Section Header */}
                      <div className="p-3.5 border-b border-[#E9F1FF] dark:border-[#1E293B] flex items-center justify-between gap-4 bg-slate-50/60 dark:bg-slate-900/40">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() =>
                              setCollapsedCategories((prev) => ({ ...prev, [category]: !prev[category] }))
                            }
                            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition-colors"
                          >
                            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          <Layers className="w-4 h-4 text-[#756EF3]" />
                          <h4 className="font-bold text-xs uppercase tracking-wider font-mono text-slate-900 dark:text-slate-100">
                            {category}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {catTasks.length} {catTasks.length === 1 ? "task" : "tasks"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="text-slate-500">{completedCount}/{catTasks.length} Done</span>
                          <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{percent}%</span>
                        </div>
                      </div>

                      {/* Tasks in Category Grid */}
                      {!isCollapsed && (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                          {catTasks.map((task) => (
                            <div key={task.id} onClick={() => handleOpenTaskDetail(task)}>
                              <TaskPulseCard
                                task={task}
                                currentRole={currentRole}
                                currentUserId={currentUserId}
                                isDraggable={false}
                                onSelect={() => handleOpenTaskDetail(task)}
                                onUpdateProgress={onUpdateTaskProgress}
                                onToggleBlocked={onToggleTaskBlocked}
                                onToggleSubtask={onToggleSubtask}
                                onAddSubtask={onAddSubtask}
                                onDeleteSubtask={onDeleteSubtask}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          {/* Empty State when no tasks match */}
          {filteredTasks.length === 0 && (
            <div className="p-10 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#756EF3]/10 text-[#756EF3] mx-auto flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">No work items found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No tasks match your active filters or project selection. Create a new task or adjust your filters.
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW B: KANBAN 4-COLUMN BOARD */}
      {viewMode === "kanban" && (
        <div className="flex xl:grid xl:grid-cols-4 gap-4 items-start overflow-x-auto pb-4 no-scrollbar">
          {COLUMNS.map((column) => {
            const colTasks = filteredTasks.filter((t) => t.status === column.id);

            return (
              <div
                key={column.id}
                className="w-[285px] sm:w-[320px] xl:w-auto shrink-0 xl:shrink p-3.5 rounded-2xl bg-slate-100/70 dark:bg-[#0B0F19]/90 border border-slate-200 dark:border-slate-800 flex flex-col min-h-[580px] transition-colors"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        column.id === "backlog"
                          ? "bg-slate-400"
                          : column.id === "in_progress"
                          ? "bg-[#756EF3]"
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
                          onSelect={() => handleOpenTaskDetail(task)}
                          onUpdateProgress={onUpdateTaskProgress}
                          onToggleBlocked={onToggleTaskBlocked}
                          onToggleSubtask={onToggleSubtask}
                          onAddSubtask={onAddSubtask}
                          onDeleteSubtask={onDeleteSubtask}
                        />

                        {/* Fast Move Trigger */}
                        <div className="mt-1 flex items-center justify-end gap-1 px-1 text-[9px] font-mono text-slate-500">
                          <span>Move:</span>
                          {COLUMNS.filter((c) => c.id !== column.id).map((c) => (
                            <button
                              key={c.id}
                              onClick={() => handleMoveColumn(task, c.id)}
                              className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                            >
                              {c.label.split(" ")[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </AnimatePresence>

                  {colTasks.length === 0 && (
                    <div className="h-32 flex flex-col items-center justify-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-4 text-center">
                      <Layers className="w-4 h-4 mb-1.5 opacity-40" />
                      No tasks in {column.label}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW C: STRUCTURED ENTERPRISE TABLE VIEW */}
      {viewMode === "table" && (
        <div className="rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 font-mono text-[11px] text-slate-500 uppercase">
                  <th className="py-3 px-4">Task & Badge</th>
                  <th className="py-3 px-4">Project / Section</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => handleOpenTaskDetail(task)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Title & Badge */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-[#756EF3]/10 text-[#756EF3]">
                          {task.projectBadge}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#756EF3] transition-colors">
                          {task.title}
                        </span>
                      </div>
                    </td>

                    {/* Project & Category */}
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      <div>{task.projectName || "General"}</div>
                      {task.category && (
                        <div className="text-[10px] font-mono text-slate-400">{task.category}</div>
                      )}
                    </td>

                    {/* Assignee */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {task.assignee?.avatarUrl ? (
                          <img
                            src={task.assignee.avatarUrl}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[9px] flex items-center justify-center font-bold">
                            {task.assignee?.name?.slice(0, 2).toUpperCase() || <User className="w-3 h-3" />}
                          </div>
                        )}
                        <span>{task.assignee?.name || "Unassigned"}</span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono capitalize ${
                          task.priority === "critical"
                            ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300"
                            : task.priority === "high"
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    {/* Progress Bar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                            style={{ width: `${task.progressPercentage}%` }}
                          />
                        </div>
                        <span>{task.progressPercentage}%</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold capitalize ${
                          task.status === "completed"
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                            : task.status === "in_review"
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                            : task.status === "in_progress"
                            ? "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                        }`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                    </td>

                    {/* Quick Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenTaskDetail(task);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#756EF3] hover:bg-[#756EF3]/10 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TASK DETAIL MODAL & DRAWER (FULL MOBILE FEATURE PARITY) */}
      <TaskDetailModal
        task={selectedTaskForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        currentRole={currentRole}
        currentUserId={currentUserId}
        onUpdateTask={(updated) => {
          onUpdateTask(updated);
          setSelectedTaskForDetail(updated);
        }}
        onToggleSubtask={onToggleSubtask}
        onAddSubtask={onAddSubtask || (() => {})}
        onDeleteSubtask={onDeleteSubtask || (() => {})}
      />

      {/* 5. NEW TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">Create Workstream Task</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Parent Project</label>
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.code}] {p.name} ({p.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Backend: Payment Webhooks & Stripe Integration"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Functional Category / Section</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Backend Architecture"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Assignee</label>
                <select
                  value={newAssigneeId}
                  onChange={(e) => setNewAssigneeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3]"
                >
                  <optgroup label="Workspace Team Members">
                    {colleagues.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.department}){c.isInvited ? " - Invited" : ""}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Direct Collaboration">
                    <option value="INVITE_NEW">+ Invite New Person via Email...</option>
                  </optgroup>
                </select>
              </div>

              {/* Inline Direct Email Invitation Box */}
              {newAssigneeId === "INVITE_NEW" && (
                <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/80 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    <Mail className="w-4 h-4" />
                    <span>Direct Colleague Email Invitation</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required={newAssigneeId === "INVITE_NEW"}
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="e.g. alex.morgan@taskpulse.io"
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                        Colleague Name (optional)
                      </label>
                      <input
                        type="text"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3]"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-400">
                    An email invitation will be dispatched with direct access to this project folder, and they will be assigned to this task.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Subtask Checklist (1 per line)
                </label>
                <textarea
                  rows={3}
                  value={rawSubtasks}
                  onChange={(e) => setRawSubtasks(e.target.value)}
                  placeholder="Design PostgreSQL relational schema&#10;Setup JWT validation middleware&#10;Write automated migration scripts"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white font-semibold transition-colors shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. NEW PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">Create New Project</h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={newProjName}
                  onChange={(e) => {
                    setNewProjName(e.target.value);
                    if (!newProjCode) {
                      const words = e.target.value.trim().split(" ");
                      const code = words.length > 1 ? words.map((w) => w[0]).join("") : e.target.value.slice(0, 3);
                      setNewProjCode(code.toUpperCase());
                    }
                  }}
                  placeholder="e.g. Payment Gateway V2"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Code Badge *</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={newProjCode}
                    onChange={(e) => setNewProjCode(e.target.value.toUpperCase())}
                    placeholder="e.g. PAY"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 uppercase font-mono focus:outline-none focus:border-[#756EF3]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Department</label>
                  <select
                    value={newProjDept}
                    onChange={(e) => setNewProjDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3]"
                  >
                    {departments.filter((d) => d !== "All").map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Brief description of goals, milestones, and deliverable targets..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white font-semibold transition-colors shadow-sm"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Floating Email Invitation Success Notification */}
      {inviteSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-xs">{inviteSuccessToast}</p>
            <p className="text-[10px] text-emerald-100">Team member assigned with provisional folder access.</p>
          </div>
          <button
            onClick={() => setInviteSuccessToast(null)}
            className="p-1 hover:bg-emerald-700 rounded-lg text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerDispatcher;
