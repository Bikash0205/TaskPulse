"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ManagerDispatcher } from "@/components/ManagerDispatcher";
import { WorkloadMatrix } from "@/components/WorkloadMatrix";
import { LandingPage } from "@/components/LandingPage";
import { TaskPulseLogo } from "@/components/TaskPulseLogo";
import { BootSplash } from "@/components/BootSplash";
import { useAuth, PERMANENT_ADMIN_EMAIL } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import { MobileDeviceFrame } from "@/components/MobileDeviceFrame";
import { Sparkles, ArrowRight, X, Building2, Smartphone, LayoutDashboard } from "lucide-react";
import {
  subscribeTasks,
  createTaskDocument,
  updateTaskStatusDocument,
  updateTaskProgressDocument,
  updateTaskDocument,
} from "@/lib/firestoreService";
import { mockColleagues, mockTasks, mockPulseFeed, mockProjects } from "@shared/mockData";
import { TaskPulseItem, ColleagueProfile, ColleaguePulseFeedItem, UserRole, Project, SubTask } from "@shared/types";

export default function TaskPulseWorkspacePage() {
  const { user, loading, teamRoles, loginDemoUser, signInWithCustomUser } = useAuth();
  const {
    currentOrg,
    assignedProjectForCurrentLogin,
    setAssignedProjectForCurrentLogin,
  } = useOrganization();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<TaskPulseItem[]>([]);
  const [colleagues, setColleagues] = useState<ColleagueProfile[]>([]);
  const [pulseFeed, setPulseFeed] = useState<ColleaguePulseFeedItem[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>("all");
  const [assignedBannerProject, setAssignedBannerProject] = useState<{ id: string; name: string } | null>(null);
  const [showBootSplash, setShowBootSplash] = useState(true);
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkViewport = () => {
        if (window.innerWidth < 768) {
          setViewportMode("mobile");
        }
      };
      checkViewport();
      window.addEventListener("resize", checkViewport);
      return () => window.removeEventListener("resize", checkViewport);
    }
  }, []);

  useEffect(() => {
    let initialTasks: TaskPulseItem[] = [];
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("taskpulse_custom_tasks");
      if (savedTasks) {
        try {
          initialTasks = JSON.parse(savedTasks);
          setTasks(initialTasks);
          syncColleagueCounts(initialTasks);
        } catch (e) {
          initialTasks = mockTasks;
          setTasks(mockTasks);
          syncColleagueCounts(mockTasks);
        }
      } else {
        initialTasks = mockTasks;
        setTasks(mockTasks);
        syncColleagueCounts(mockTasks);
      }

      const savedProjects = localStorage.getItem("taskpulse_custom_projects");
      if (savedProjects !== null) {
        try {
          const parsed = JSON.parse(savedProjects);
          setProjects(Array.isArray(parsed) && parsed.length > 0 ? parsed : mockProjects);
        } catch (e) {
          setProjects(mockProjects);
        }
      } else {
        setProjects(mockProjects);
      }

      // Initial cloud sync with backend REST API
      fetch("/api/tasks")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const list = Array.isArray(data) ? data : data?.tasks;
          if (list && list.length > 0) {
            setTasks((prev) => {
              const remoteIds = new Set(list.map((t: any) => t.id));
              const localOnly = prev.filter((t) => !remoteIds.has(t.id));
              const merged = [...list, ...localOnly];
              syncColleagueCounts(merged);
              return merged;
            });
          }
        })
        .catch(() => {});

      fetch("/api/projects")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const list = Array.isArray(data) ? data : data?.projects;
          if (list && list.length > 0) {
            setProjects((prev) => {
              const remoteIds = new Set(list.map((p: any) => p.id));
              const localOnly = prev.filter((p) => !remoteIds.has(p.id));
              return [...list, ...localOnly];
            });
          }
        })
        .catch(() => {});
    }

    const unsubscribe = subscribeTasks((remoteTasks) => {
      setTasks(remoteTasks);
      syncColleagueCounts(remoteTasks);
    }, initialTasks);

    return () => unsubscribe();
  }, [user, teamRoles]);

  // Handle direct jump to assigned project upon invited user login
  useEffect(() => {
    if (assignedProjectForCurrentLogin) {
      let currentProjects = projects;
      if (typeof window !== "undefined") {
        const savedProjects = localStorage.getItem("taskpulse_custom_projects");
        if (savedProjects) {
          try {
            const parsed = JSON.parse(savedProjects);
            if (Array.isArray(parsed) && parsed.length > 0) {
              currentProjects = parsed;
              setProjects(parsed);
            }
          } catch (e) {}
        }
      }

      const matchedProj = currentProjects.find((p) => p.id === assignedProjectForCurrentLogin);
      setActiveProjectId(assignedProjectForCurrentLogin);
      if (matchedProj) {
        setAssignedBannerProject({ id: matchedProj.id, name: matchedProj.name });
      }
    }
  }, [assignedProjectForCurrentLogin]);

  const persistTasks = (newTasks: TaskPulseItem[]) => {
    setTasks(newTasks);
    syncColleagueCounts(newTasks);
    if (typeof window !== "undefined") {
      localStorage.setItem("taskpulse_custom_tasks", JSON.stringify(newTasks));
    }
  };

  const handleClearTasks = () => {
    persistTasks([]);
    setProjects([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("taskpulse_custom_projects");
    }
  };

  const handleResetDemoTasks = () => {
    persistTasks(mockTasks);
    setProjects(mockProjects);
    if (typeof window !== "undefined") {
      localStorage.setItem("taskpulse_custom_projects", JSON.stringify(mockProjects));
    }
  };

  const syncColleagueCounts = (updatedTasks: TaskPulseItem[]) => {
    // 1. Current user profile as first active colleague
    const activeProfiles: ColleagueProfile[] = [];
    if (user) {
      activeProfiles.push({
        id: user.uid,
        name: user.displayName || "You",
        role: user.role,
        department: user.department,
        avatarUrl: user.photoURL || undefined,
        activeTaskCount: updatedTasks.filter((t) => t.assignee?.id === user.uid && t.status !== "completed").length,
        maxBandwidth: 5,
        isOnline: true,
      });
    }

    // 2. Any additional assignees present on tasks
    updatedTasks.forEach((t) => {
      if (t.assignee && !activeProfiles.some((p) => p.id === t.assignee!.id)) {
        const emailGuess = `${t.assignee.name.toLowerCase().replace(" ", ".")}@taskpulse.internal`;
        const assignedRole: UserRole =
          teamRoles[emailGuess] ||
          teamRoles[t.assignee.id.toLowerCase()] ||
          t.assignee.role;

        activeProfiles.push({
          ...t.assignee,
          role: assignedRole,
          activeTaskCount: updatedTasks.filter((x) => x.assignee?.id === t.assignee!.id && x.status !== "completed").length,
        });
      }
    });

    setColleagues(activeProfiles);

    // 3. Pulse feed for active in-progress work
    const activeFeed: ColleaguePulseFeedItem[] = updatedTasks
      .filter((t) => t.status === "in_progress" && t.assignee)
      .map((t) => ({
        userId: t.assignee!.id,
        displayName: t.assignee!.name,
        department: t.department,
        avatarUrl: t.assignee!.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
        currentTaskTitle: t.title,
        projectName: t.projectName,
        projectBadge: t.projectBadge,
        progressPercentage: t.progressPercentage,
        isBlocked: t.isBlocked,
        activeTaskCount: updatedTasks.filter((x) => x.assignee?.id === t.assignee!.id && x.status !== "completed").length,
        lastHeartbeat: "Just now",
      }));

    setPulseFeed(activeFeed);

    // 4. Update project progress
    setProjects((prevProjects) =>
      prevProjects.map((proj) => {
        const projTasks = updatedTasks.filter((t) => t.projectId === proj.id);
        if (projTasks.length === 0) return { ...proj, progressPercentage: 0 };
        const avg = Math.round(
          projTasks.reduce((acc, t) => acc + t.progressPercentage, 0) / projTasks.length
        );
        return { ...proj, progressPercentage: avg };
      })
    );
  };

  const handleUpdateTask = async (updatedTask: TaskPulseItem) => {
    const updated = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    persistTasks(updated);
    await updateTaskDocument(updatedTask);
    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    }).catch(() => {});
  };

  const handleAddTask = async (newTask: TaskPulseItem) => {
    const updated = [newTask, ...tasks];
    persistTasks(updated);
    await createTaskDocument(newTask);
    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    }).catch(() => {});
  };

  const handleUpdateTaskProgress = async (taskId: string, progress: number) => {
    let targetTask: TaskPulseItem | null = null;
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        targetTask = {
          ...t,
          progressPercentage: progress,
          status: progress === 100 ? ("in_review" as const) : t.status === "completed" && progress < 100 ? ("in_progress" as const) : t.status === "backlog" ? ("in_progress" as const) : t.status,
          updatedAt: new Date().toISOString(),
        };
        return targetTask;
      }
      return t;
    });
    persistTasks(updated);
    await updateTaskProgressDocument(taskId, progress);
    if (targetTask) {
      fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetTask),
      }).catch(() => {});
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    let computedProgress = 0;
    let modifiedTask: TaskPulseItem | null = null;
    setTasks((prevTasks) => {
      const updated = prevTasks.map((task) => {
        if (task.id !== taskId || !task.subtasks) return task;

        const newSubtasks = task.subtasks.map((sub) =>
          sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        );
        const completedCount = newSubtasks.filter((s) => s.completed).length;
        computedProgress = Math.round((completedCount / newSubtasks.length) * 100);

        const nextStatus =
          computedProgress === 100
            ? ("in_review" as const)
            : task.status === "completed" && computedProgress < 100
            ? ("in_progress" as const)
            : task.status === "backlog" && computedProgress > 0
            ? ("in_progress" as const)
            : task.status;

        modifiedTask = {
          ...task,
          subtasks: newSubtasks,
          progressPercentage: computedProgress,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
        return modifiedTask;
      });

      syncColleagueCounts(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("taskpulse_custom_tasks", JSON.stringify(updated));
      }
      return updated;
    });

    await updateTaskProgressDocument(taskId, computedProgress);
    if (modifiedTask) {
      fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modifiedTask),
      }).catch(() => {});
    }
  };

  const handleToggleTaskBlocked = (taskId: string) => {
    let modifiedTask: TaskPulseItem | null = null;
    setTasks((prevTasks) => {
      const updated: TaskPulseItem[] = prevTasks.map((t) => {
        if (t.id === taskId) {
          const nextBlocked = !t.isBlocked;
          const updatedItem: TaskPulseItem = {
            ...t,
            isBlocked: nextBlocked,
            blockReason: nextBlocked ? "Flagged via Mobile Client" : undefined,
            updatedAt: new Date().toISOString(),
          };
          modifiedTask = updatedItem;
          return updatedItem;
        }
        return t;
      });
      syncColleagueCounts(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("taskpulse_custom_tasks", JSON.stringify(updated));
      }
      return updated;
    });
    if (modifiedTask) {
      fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modifiedTask),
      }).catch(() => {});
    }
  };

  const handleAddProject = (newProject: Project) => {
    setProjects((prevProjects) => {
      const updated = [newProject, ...prevProjects];
      if (typeof window !== "undefined") {
        localStorage.setItem("taskpulse_custom_projects", JSON.stringify(updated));
      }
      return updated;
    });
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    }).catch(() => {});
  };

  const handleAddSubtask = async (taskId: string, subtaskTitle: string) => {
    if (!subtaskTitle.trim()) return;
    const newSub: SubTask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: subtaskTitle.trim(),
      completed: false,
    };

    let computedProgress = 0;
    setTasks((prevTasks) => {
      const updated = prevTasks.map((t) => {
        if (t.id === taskId) {
          const subtasks = [...(t.subtasks || []), newSub];
          const completedCount = subtasks.filter((s) => s.completed).length;
          computedProgress = Math.round((completedCount / subtasks.length) * 100);
          return {
            ...t,
            subtasks,
            progressPercentage: computedProgress,
            status: t.status === "completed" && computedProgress < 100 ? ("in_progress" as const) : t.status,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });

      syncColleagueCounts(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("taskpulse_custom_tasks", JSON.stringify(updated));
      }
      return updated;
    });

    await updateTaskProgressDocument(taskId, computedProgress);
  };

  const handleDeleteSubtask = async (taskId: string, subtaskId: string) => {
    setTasks((prevTasks) => {
      const updated = prevTasks.map((t) => {
        if (t.id === taskId && t.subtasks) {
          const subtasks = t.subtasks.filter((s) => s.id !== subtaskId);
          const completedCount = subtasks.filter((s) => s.completed).length;
          const computedProgress = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : t.progressPercentage;
          return {
            ...t,
            subtasks,
            progressPercentage: computedProgress,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });

      syncColleagueCounts(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("taskpulse_custom_tasks", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const currentRole: UserRole = user?.role || "member";
  const currentUserId = user?.uid || "";
  const currentColleagueProfile: ColleagueProfile = {
    id: currentUserId,
    name: user ? (user.displayName || "Authenticated User") : "Guest (Logged Out)",
    role: currentRole,
    department: user?.department || "Engineering",
    avatarUrl: user?.photoURL || undefined,
    activeTaskCount: user ? tasks.filter((t) => t.assignee?.id === currentUserId && t.status !== "completed").length : 0,
    maxBandwidth: 5,
    isOnline: !!user,
  };

  return (
    <>
      {showBootSplash && <BootSplash onComplete={() => setShowBootSplash(false)} />}
      {loading ? (
        <div className="min-h-screen w-full bg-[#F8FAFF] dark:bg-[#0B0F19]" />
      ) : !user ? (
        <LandingPage
          onEnterDemo={loginDemoUser}
          onEnterMarcus={() => signInWithCustomUser("Marcus Vance", "marcus.vance@taskpulse.internal")}
          onEnterAdmin={() => signInWithCustomUser("Zevon", PERMANENT_ADMIN_EMAIL)}
        />
      ) : (
        <div className="min-h-screen w-full bg-[#F8FAFF] dark:bg-[#0B0F19] text-[#002055] dark:text-[#F8FAFC] flex flex-col transition-colors duration-200 selection:bg-[#756EF3]/20 selection:text-[#756EF3]">
      {/* Top Header with Light/Dark toggle, Google Auth & Organization Switcher */}
      <Header projects={projects} />

      {/* Main Workspace Body */}
      <main className={`flex-1 ${viewportMode === "mobile" ? "p-0" : "p-3 sm:p-5 md:p-6"} flex flex-col gap-3 sm:gap-5 max-w-[1720px] w-full mx-auto`}>
        {/* Workspace Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 sm:px-0 py-2 sm:py-0 pb-2 border-b border-[#E9F1FF] dark:border-[#1E293B]">
          <div className="flex items-center gap-2 text-xs text-[#556070] dark:text-[#94A3B8] font-sans">
            <Building2 className="w-4 h-4 text-[#756EF3]" />
            <span>Workspace: </span>
            <span className="text-[#002055] dark:text-[#F8FAFC] font-semibold">{currentOrg?.name || "TaskPulse Enterprise"}</span>
            {currentOrg?.inviteCode && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] dark:text-[#818CF8] border border-[#756EF3]/30 text-[11px] font-mono">
                Code: {currentOrg.inviteCode}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Viewport Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setViewportMode("desktop")}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewportMode === "desktop"
                    ? "bg-white dark:bg-[#151C2C] text-[#002055] dark:text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop Suite</span>
              </button>
              <button
                onClick={() => setViewportMode("mobile")}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewportMode === "mobile"
                    ? "bg-[#756EF3] text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Client</span>
              </button>
            </div>

            <div className="hidden md:block text-xs text-[#556070] dark:text-[#94A3B8] font-sans">
              {user ? (
                <span>Authenticated as <strong className="text-[#002055] dark:text-[#F8FAFC] font-medium">{user.email}</strong> (<span className="capitalize text-[#756EF3] dark:text-[#818CF8] font-semibold">{user.role}</span>)</span>
              ) : (
                <span>Session: Guest (Read-Only)</span>
              )}
            </div>
          </div>
        </div>

        {viewportMode === "mobile" ? (
          <div className="w-full flex justify-center">
            <MobileDeviceFrame
              pulseFeed={pulseFeed}
              tasks={tasks}
              currentUser={currentColleagueProfile}
              onUpdateTaskProgress={handleUpdateTaskProgress}
              onToggleTaskBlocked={handleToggleTaskBlocked}
              onToggleSubtask={handleToggleSubtask}
              onAddTask={handleAddTask}
              isStandalone={true}
            />
          </div>
        ) : (
          <>
            {/* Assigned Project Welcome Alert Banner */}
            {assignedBannerProject && (
              <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl text-xs shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-600/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      Welcome back, {user?.displayName || user?.email}!
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      You have automatically jumped into your assigned project: <span className="font-bold text-indigo-600 dark:text-indigo-400">{assignedBannerProject.name}</span>.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveProjectId("all");
                      setAssignedBannerProject(null);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    View All Projects
                  </button>
                  <button
                    onClick={() => setAssignedBannerProject(null)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Real-time Workload Matrix */}
            <WorkloadMatrix colleagues={colleagues} />

            {/* Dedicated Full-Width Manager Dispatcher Grid */}
            <div className="w-full">
              <ManagerDispatcher
                tasks={tasks}
                projects={projects}
                colleagues={colleagues}
                currentRole={currentRole}
                currentUserId={currentUserId}
                assignedProjectIds={user?.assignedProjectIds || (assignedBannerProject ? [assignedBannerProject.id] : undefined)}
                activeProjectId={activeProjectId}
                onSelectProject={(projId) => setActiveProjectId(projId)}
                onUpdateTask={handleUpdateTask}
                onAddTask={handleAddTask}
                onAddProject={handleAddProject}
                onAddSubtask={handleAddSubtask}
                onDeleteSubtask={handleDeleteSubtask}
                onUpdateTaskProgress={handleUpdateTaskProgress}
                onToggleTaskBlocked={handleToggleTaskBlocked}
                onToggleSubtask={handleToggleSubtask}
                onClearTasks={handleClearTasks}
                onResetDemoTasks={handleResetDemoTasks}
              />
            </div>
          </>
        )}
      </main>
    </div>
      )}
    </>
  );
}
