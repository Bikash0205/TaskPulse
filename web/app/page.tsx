"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BootSplash } from "@/components/BootSplash";
import { Header } from "@/components/Header";
import { ManagerDispatcher } from "@/components/ManagerDispatcher";
import { WorkloadMatrix } from "@/components/WorkloadMatrix";
import { LandingPage } from "@/components/LandingPage";
import { TaskPulseLogo } from "@/components/TaskPulseLogo";
import { useAuth, PERMANENT_ADMIN_EMAIL } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import { MobileDeviceFrame } from "@/components/MobileDeviceFrame";
import { LiveMultiplayerPresenceCanvas } from "@/components/LiveMultiplayerPresenceCanvas";
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
import { formatPlanStatusLabel, getEffectivePlan } from "@shared/plans";

export default function TaskPulseWorkspacePage() {
  const router = useRouter();
  const { user, loading, teamRoles, loginDemoUser, signInWithCustomUser } = useAuth();
  const {
    currentOrg,
    orgLoading,
    assignedProjectForCurrentLogin,
    setAssignedProjectForCurrentLogin,
  } = useOrganization();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<TaskPulseItem[]>([]);
  const [colleagues, setColleagues] = useState<ColleagueProfile[]>([]);
  const [pulseFeed, setPulseFeed] = useState<ColleaguePulseFeedItem[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>("all");
  const [assignedBannerProject, setAssignedBannerProject] = useState<{ id: string; name: string } | null>(null);
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile">("desktop");
  const [bootSplashComplete, setBootSplashComplete] = useState(false);

  const isCoreDemoAccount =
    Boolean(user) &&
    (user!.email?.toLowerCase().trim() === PERMANENT_ADMIN_EMAIL.toLowerCase() ||
      Boolean(user!.email?.toLowerCase().endsWith("@taskpulse.internal")) ||
      currentOrg?.id === "org-core");

  const orgScope =
    currentOrg?.id && currentOrg.id !== "org-core"
      ? currentOrg.id
      : !isCoreDemoAccount && user?.email
      ? user.email.toLowerCase().trim().replace(/[^a-z0-9]/g, "_")
      : null;

  const tasksStorageKey = orgScope ? `taskpulse_custom_tasks_${orgScope}` : "taskpulse_custom_tasks";
  const projectsStorageKey = orgScope ? `taskpulse_custom_projects_${orgScope}` : "taskpulse_custom_projects";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkViewport = () => {
        const isMobileUa =
          typeof navigator !== "undefined" &&
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const shouldUseMobile = window.innerWidth < 768 || (isMobileUa && window.innerWidth < 1024);
        setViewportMode(shouldUseMobile ? "mobile" : "desktop");
      };
      checkViewport();
      window.addEventListener("resize", checkViewport);
      return () => window.removeEventListener("resize", checkViewport);
    }
  }, []);

  useEffect(() => {
    if (!user || orgLoading) return;
    let cancelled = false;

    let initialTasks: TaskPulseItem[] = [];
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem(tasksStorageKey);
      if (savedTasks !== null) {
        try {
          initialTasks = JSON.parse(savedTasks);
          setTasks(initialTasks);
          syncColleagueCounts(initialTasks);
        } catch (e) {
          initialTasks = isCoreDemoAccount ? mockTasks : [];
          setTasks(initialTasks);
          syncColleagueCounts(initialTasks);
        }
      } else {
        initialTasks = isCoreDemoAccount ? mockTasks : [];
        setTasks(initialTasks);
        syncColleagueCounts(initialTasks);
      }

      const savedProjects = localStorage.getItem(projectsStorageKey);
      if (savedProjects !== null) {
        try {
          const parsed = JSON.parse(savedProjects);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProjects(parsed);
          } else {
            setProjects(isCoreDemoAccount ? mockProjects : []);
          }
        } catch (e) {
          setProjects(isCoreDemoAccount ? mockProjects : []);
        }
      } else {
        setProjects(isCoreDemoAccount ? mockProjects : []);
      }

      // Only pull global demo REST seed for Core Enterprise / Sandbox accounts
      if (isCoreDemoAccount) {
        fetch("/api/tasks")
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (cancelled) return;
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
            if (cancelled) return;
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
    }

    const unsubscribe = subscribeTasks(
      (remoteTasks) => {
        if (cancelled) return;
        setTasks(remoteTasks);
        syncColleagueCounts(remoteTasks);
      },
      initialTasks,
      orgScope || (isCoreDemoAccount ? "org-core" : "isolated-empty")
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [user?.email, currentOrg?.id, orgLoading, teamRoles]);

  // Handle direct jump to assigned project upon invited user login
  useEffect(() => {
    if (assignedProjectForCurrentLogin) {
      let currentProjects = projects;
      if (typeof window !== "undefined") {
        const savedProjects = localStorage.getItem(projectsStorageKey);
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
  }, [assignedProjectForCurrentLogin, projectsStorageKey]);

  const persistTasks = (newTasks: TaskPulseItem[]) => {
    setTasks(newTasks);
    syncColleagueCounts(newTasks);
    if (typeof window !== "undefined") {
      localStorage.setItem(tasksStorageKey, JSON.stringify(newTasks));
    }
  };

  const handleClearTasks = () => {
    persistTasks([]);
    setProjects([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(projectsStorageKey);
    }
  };

  const handleResetDemoTasks = () => {
    if (!isCoreDemoAccount) return;
    persistTasks(mockTasks);
    setProjects(mockProjects);
    if (typeof window !== "undefined") {
      localStorage.setItem(projectsStorageKey, JSON.stringify(mockProjects));
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
    const scopedTask = { ...updatedTask, orgId: (updatedTask as any).orgId || orgScope || "org-core" };
    const updated = tasks.map((t) => (t.id === scopedTask.id ? scopedTask : t));
    persistTasks(updated);
    await updateTaskDocument(scopedTask);
    if (isCoreDemoAccount) {
      fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scopedTask),
      }).catch(() => {});
    }
  };

  const handleAddTask = async (newTask: TaskPulseItem) => {
    const scopedTask = { ...newTask, orgId: (newTask as any).orgId || orgScope || "org-core" };
    const updated = [scopedTask, ...tasks];
    persistTasks(updated);
    await createTaskDocument(scopedTask);
    if (isCoreDemoAccount) {
      fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scopedTask),
      }).catch(() => {});
    }
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
    if (targetTask && isCoreDemoAccount) {
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
        localStorage.setItem(tasksStorageKey, JSON.stringify(updated));
      }
      return updated;
    });

    await updateTaskProgressDocument(taskId, computedProgress);
    if (modifiedTask && isCoreDemoAccount) {
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
        localStorage.setItem(tasksStorageKey, JSON.stringify(updated));
      }
      return updated;
    });
    if (modifiedTask && isCoreDemoAccount) {
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
        localStorage.setItem(projectsStorageKey, JSON.stringify(updated));
      }
      return updated;
    });
    if (isCoreDemoAccount) {
      fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      }).catch(() => {});
    }
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
        localStorage.setItem(tasksStorageKey, JSON.stringify(updated));
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
        localStorage.setItem(tasksStorageKey, JSON.stringify(updated));
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
      {!bootSplashComplete && (
        <BootSplash onComplete={() => setBootSplashComplete(true)} />
      )}
      {loading ? (
        <div className="min-h-screen w-full bg-[#F4F2ED] dark:bg-[#0B0F19]" />
      ) : !user ? (
        <LandingPage
          onEnterDemo={loginDemoUser}
          onEnterMarcus={() => signInWithCustomUser("Marcus Vance", "marcus.vance@taskpulse.internal")}
          onEnterAdmin={() => signInWithCustomUser("Zevon", PERMANENT_ADMIN_EMAIL)}
        />
      ) : (
        <div className="min-h-screen w-full bg-[#F4F2ED] dark:bg-[#0B0F19] text-[#1E222D] dark:text-[#F8FAFC] flex flex-col transition-colors duration-200 selection:bg-[#5D55D6]/20 selection:text-[#5D55D6]">
      {/* Real-Time Multiplayer Presence Cursors (Only real organization peers, no simulation) */}
      <LiveMultiplayerPresenceCanvas currentUser={user} orgId={currentOrg?.id} />

      {/* Top Header with Light/Dark toggle, Google Auth & Organization Switcher */}
      <Header projects={projects} />

      {/* Main Workspace Body */}
      <main className={`flex-1 ${viewportMode === "mobile" ? "p-0" : "p-3 sm:p-5 md:p-6"} flex flex-col gap-3 sm:gap-5 max-w-[1720px] w-full mx-auto`}>
        {/* Workspace Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 sm:px-0 py-2 sm:py-0 pb-2.5 border-b border-[#DDD8CE] dark:border-[#1E293B]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#4E5565] dark:text-[#94A3B8] font-sans">
            <Building2 className="w-4 h-4 text-[#5D55D6]" />
            <span>Workspace:</span>
            <span className="text-[#1E222D] dark:text-[#F8FAFC] font-semibold">{currentOrg?.name || "Workspace"}</span>
            {currentOrg?.inviteCode && (
              <span className="ml-1.5 px-2.5 py-0.5 rounded-full bg-[#EAE8F8] dark:bg-[#756EF3]/15 text-[#5D55D6] dark:text-[#818CF8] border border-[#D4D0F0] dark:border-[#756EF3]/30 text-[11px] font-mono font-semibold">
                Invite Code: {currentOrg.inviteCode}
              </span>
            )}
            <span
              data-testid="workspace-plan-badge"
              className="px-2.5 py-0.5 rounded-full bg-[#E4F2EC] dark:bg-emerald-950/50 text-[#0F7656] dark:text-emerald-300 border border-[#C5E3D5] dark:border-emerald-800/60 text-[11px] font-semibold"
            >
              {getEffectivePlan(currentOrg, user?.email).name} ({formatPlanStatusLabel(currentOrg?.planStatus, currentOrg?.trialEndsAt)})
            </span>
          </div>

          <div className="hidden md:block text-xs text-[#4E5565] dark:text-[#94A3B8] font-sans">
            {user && (
              <span>
                Signed in as <strong className="text-[#1E222D] dark:text-[#F8FAFC] font-semibold">{user.email}</strong>
              </span>
            )}
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
