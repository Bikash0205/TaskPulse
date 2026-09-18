"use client";

import React, { useState, useEffect } from "react";
import { MobileDeviceFrame } from "@/components/MobileDeviceFrame";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import {
  subscribeTasks,
  updateTaskProgressDocument,
} from "@/lib/firestoreService";
import { TaskPulseItem, ColleagueProfile, ColleaguePulseFeedItem, UserRole } from "@shared/types";
import { ArrowLeft } from "lucide-react";

export default function MobileAppDedicatedPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskPulseItem[]>([]);
  const [colleagues, setColleagues] = useState<ColleagueProfile[]>([]);
  const [pulseFeed, setPulseFeed] = useState<ColleaguePulseFeedItem[]>([]);

  useEffect(() => {
    let initialTasks: TaskPulseItem[] = [];
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("taskpulse_custom_tasks");
      if (savedTasks) {
        try {
          initialTasks = JSON.parse(savedTasks);
          setTasks(initialTasks);
          syncColleagueCounts(initialTasks);
        } catch (e) {}
      }
    }

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

    const unsubscribe = subscribeTasks((remoteTasks) => {
      setTasks(remoteTasks);
      syncColleagueCounts(remoteTasks);
    }, initialTasks);

    return () => unsubscribe();
  }, [user]);

  const persistTasks = (newTasks: TaskPulseItem[]) => {
    setTasks(newTasks);
    syncColleagueCounts(newTasks);
    if (typeof window !== "undefined") {
      localStorage.setItem("taskpulse_custom_tasks", JSON.stringify(newTasks));
    }
  };

  const syncColleagueCounts = (updatedTasks: TaskPulseItem[]) => {
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

    updatedTasks.forEach((t) => {
      if (t.assignee && !activeProfiles.some((p) => p.id === t.assignee!.id)) {
        activeProfiles.push({
          ...t.assignee,
          activeTaskCount: updatedTasks.filter((x) => x.assignee?.id === t.assignee!.id && x.status !== "completed").length,
        });
      }
    });

    setColleagues(activeProfiles);

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
  };

  const handleUpdateTaskProgress = async (taskId: string, progress: number) => {
    let targetTask: TaskPulseItem | null = null;
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextStatus =
          progress === 100
            ? ("in_review" as const)
            : t.status === "completed" && progress < 100
            ? ("in_progress" as const)
            : t.status === "backlog"
            ? ("in_progress" as const)
            : t.status;
        targetTask = {
          ...t,
          progressPercentage: progress,
          status: nextStatus,
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
    const updated = tasks.map((task) => {
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

    setTasks(updated);
    syncColleagueCounts(updated);
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
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextBlocked = !t.isBlocked;
        modifiedTask = {
          ...t,
          isBlocked: nextBlocked,
          blockReason: nextBlocked ? "Flagged via Mobile Client" : undefined,
          updatedAt: new Date().toISOString(),
        };
        return modifiedTask;
      }
      return t;
    });
    setTasks(updated);
    syncColleagueCounts(updated);
    if (modifiedTask) {
      fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modifiedTask),
      }).catch(() => {});
    }
  };

  const handleAddTask = (newTask: TaskPulseItem) => {
    const updated = [newTask, ...tasks];
    persistTasks(updated);
    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    }).catch(() => {});
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#070A13] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 selection:bg-blue-500/20 selection:text-blue-400">
      {/* Top Header */}
      <Header />

      {/* Mobile App Dedicated Container */}
      <main className="flex-1 p-4 md:p-6 flex flex-col items-center justify-start max-w-5xl w-full mx-auto">
        {/* Navigation Bar between Web and Mobile */}
        <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
          <a
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </a>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Mobile Client Route (/mobile)</span>
          </div>
        </div>

        {/* Centered Mobile Experience */}
        <div className="w-full flex justify-center py-2">
          <MobileDeviceFrame
            pulseFeed={pulseFeed}
            tasks={tasks}
            currentUser={currentColleagueProfile}
            onUpdateTaskProgress={handleUpdateTaskProgress}
            onToggleTaskBlocked={handleToggleTaskBlocked}
            onToggleSubtask={handleToggleSubtask}
            onAddTask={handleAddTask}
          />
        </div>
      </main>
    </div>
  );
}
