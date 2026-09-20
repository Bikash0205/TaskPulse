"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TaskPulseItem,
  ColleagueProfile,
  Department,
  TaskStatus,
} from "@shared/types";
import {
  Grid,
  Bell,
  Search,
  ChevronRight,
  Clock,
  Check,
  Plus,
  ArrowLeft,
  Home,
  Folder,
  User,
  Wifi,
  Battery,
  Calendar,
  AlertCircle,
  X,
  Send,
  CheckCircle2,
  Sliders,
  Settings,
  Shield,
  Briefcase,
  Users,
  ChevronDown,
  Trash2,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";
import { GanttTimelineView } from "./GanttTimelineView";
import { GovernanceGatesSection } from "./GovernanceGatesSection";
import { EnterpriseAuditAndRbacModal } from "./EnterpriseAuditAndRbacModal";
import { CorporateAnalyticsExportModal } from "./CorporateAnalyticsExportModal";
import { EnterpriseThreadedDiscussionSection } from "./EnterpriseThreadedDiscussionSection";

interface MobileDeviceFrameProps {
  pulseFeed?: any[];
  tasks: TaskPulseItem[];
  currentUser: ColleagueProfile;
  onUpdateTaskProgress: (taskId: string, progress: number) => void;
  onToggleTaskBlocked: (taskId: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onAddTask?: (task: TaskPulseItem) => void;
  isStandalone?: boolean;
}

// Taskcy Design Tokens from Figma (K8Kc3Vs6ikYNPdNFsKZoIS)
const TASKCY = {
  primary: "#756EF3",
  primaryLight: "#F0EFFF",
  primarySoft: "#C6C3FB",
  navy: "#002055",
  muted: "#848A94",
  border: "#E9F1FF",
  cardBg: "#FFFFFF",
  background: "#F8FAFF",
  accentYellow: "#FFE1AC",
  accentGreen: "#B0D97F",
  accentBlue: "#96C2FF",
  accentPink: "#FEB5BD",
};

const DAYS = [
  { date: "19", day: "Sat" },
  { date: "20", day: "Sun" },
  { date: "21", day: "Mon", isToday: true },
  { date: "22", day: "Tue" },
  { date: "23", day: "Wed" },
  { date: "24", day: "Thu" },
  { date: "25", day: "Fri" },
];

interface MobileProject {
  id: string;
  name: string;
  category: string;
  department: string;
  completed: number;
  total: number;
  progress: number;
  color: string;
  code: string;
  emoji?: string;
}

const INITIAL_PROJECTS: MobileProject[] = [
  {
    id: "proj-web",
    name: "Website Building",
    category: "Fullstack Web App",
    department: "Engineering",
    completed: 2,
    total: 4,
    progress: 62,
    color: "#3B82F6",
    code: "WEB",
  },
  {
    id: "proj-mktg",
    name: "Digital Marketing",
    category: "Growth & Ads",
    department: "Marketing",
    completed: 2,
    total: 4,
    progress: 54,
    color: "#EC4899",
    code: "MKTG",
  },
  {
    id: "p1",
    name: "Application Design",
    category: "UI Design Kit",
    department: "Design",
    completed: 5,
    total: 8,
    progress: 62,
    color: "#756EF3",
    code: "APP",
  },
  {
    id: "p2",
    name: "Unity Dashboard",
    category: "Design System",
    department: "Engineering",
    completed: 3,
    total: 6,
    progress: 50,
    color: "#10B981",
    code: "UNT",
  },
  {
    id: "p3",
    name: "Instagram Shots",
    category: "Marketing Campaign",
    department: "Marketing",
    completed: 7,
    total: 10,
    progress: 70,
    color: "#F59E0B",
    code: "MKT",
  },
  {
    id: "p4",
    name: "Cubbles Engine",
    category: "Architecture",
    department: "Engineering",
    completed: 8,
    total: 10,
    progress: 80,
    color: "#3B82F6",
    code: "ENG",
  },
  {
    id: "p5",
    name: "Ui8 Platform",
    category: "Product Management",
    department: "Product",
    completed: 9,
    total: 10,
    progress: 90,
    color: "#8B5CF6",
    code: "PRD",
  },
];

const DEFAULT_TASKS: TaskPulseItem[] = [
  {
    id: "demo-t1",
    title: "Create Detail Booking Screens",
    projectId: "p1",
    projectName: "Application Design",
    projectBadge: "APP",
    department: "Design" as Department,
    status: "in_progress" as const,
    priority: "high" as const,
    progressPercentage: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: "s1", title: "Implement booking flow wireframes", completed: true },
      { id: "s2", title: "Add calendar date slot selector", completed: true },
      { id: "s3", title: "Validate passenger identity tokens", completed: false },
    ],
  },
  {
    id: "demo-t2",
    title: "Revision Home Page & Analytics",
    projectId: "p2",
    projectName: "Unity Dashboard",
    projectBadge: "UNT",
    department: "Engineering" as Department,
    status: "in_review" as const,
    priority: "critical" as const,
    progressPercentage: 90,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: "s4", title: "Update card shadow & glass blur", completed: true },
      { id: "s5", title: "Format currency decimal alignment", completed: true },
      { id: "s6", title: "Integrate biometrics auth trigger", completed: true },
    ],
  },
  {
    id: "demo-t3",
    title: "Creative Assets & Video Reel Launch",
    projectId: "p3",
    projectName: "Instagram Shots",
    projectBadge: "MKT",
    department: "Marketing" as Department,
    status: "in_progress" as const,
    priority: "medium" as const,
    progressPercentage: 70,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: "s7", title: "Responsive header navigation bar", completed: true },
      { id: "s8", title: "Tutor testimonial video embed", completed: true },
      { id: "s9", title: "Campaign tag validation", completed: false },
    ],
  },
  {
    id: "demo-t4",
    title: "Core Architecture & Webhooks",
    projectId: "p4",
    projectName: "Cubbles Engine",
    projectBadge: "ENG",
    department: "Engineering" as Department,
    status: "in_progress" as const,
    priority: "high" as const,
    progressPercentage: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: "s10", title: "Setup WebSocket cluster sync", completed: true },
      { id: "s11", title: "Zero-copy message serialization", completed: true },
    ],
  },
  {
    id: "demo-t5",
    title: "Product Roadmap & Sprint Spec",
    projectId: "p5",
    projectName: "Ui8 Platform",
    projectBadge: "PRD",
    department: "Product" as Department,
    status: "completed" as const,
    priority: "medium" as const,
    progressPercentage: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: "s12", title: "User feedback sprint prioritization", completed: true },
      { id: "s13", title: "Release changelog draft approval", completed: true },
    ],
  },
];

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  tasks: propTasks,
  currentUser,
  onUpdateTaskProgress,
  onToggleTaskBlocked,
  onToggleSubtask,
  onAddTask,
  isStandalone = false,
}) => {
  const [internalTasks, setInternalTasks] = useState<TaskPulseItem[]>(
    propTasks.length > 0 ? propTasks : DEFAULT_TASKS
  );

  React.useEffect(() => {
    if (propTasks && propTasks.length > 0) {
      setInternalTasks(propTasks);
    }
  }, [propTasks]);

  const activeTasks = internalTasks.length > 0 ? internalTasks : DEFAULT_TASKS;

  const [currentTab, setCurrentTab] = useState<"home" | "projects" | "details" | "profile">("home");
  const [selectedDay, setSelectedDay] = useState("21");
  const [selectedTask, setSelectedTask] = useState<TaskPulseItem | null>(activeTasks[0] || null);
  const [selectedProject, setSelectedProject] = useState<MobileProject | null>(null);
  const [projectsList, setProjectsList] = useState<MobileProject[]>(INITIAL_PROJECTS);
  const [projectFilter, setProjectFilter] = useState<string>("All");
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Enterprise Suite States
  const [isAuditRbacModalOpen, setIsAuditRbacModalOpen] = useState(false);
  const [isCorporateAnalyticsOpen, setIsCorporateAnalyticsOpen] = useState(false);
  const [projectViewMode, setProjectViewMode] = useState<"grid" | "timeline">("grid");

  // Modals & Drawers
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<"task" | "project">("task");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Viewport Responsiveness
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const check = () => setIsMobileScreen(window.innerWidth < 768);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }
  }, []);

  const renderStandalone = isStandalone || isMobileScreen;

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("Application Design");
  const [newTaskDept, setNewTaskDept] = useState<Department>("Design");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high" | "critical">("high");
  const [newTaskSteps, setNewTaskSteps] = useState<string[]>([
    "Review design specs",
    "Prepare component tokens",
  ]);
  const [stepDraft, setStepDraft] = useState("");

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectCategory, setNewProjectCategory] = useState("Design");

  // Task Details Subtask Input & Comment
  const [newSubtaskInput, setNewSubtaskInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<Record<string, { id: string; user: string; text: string; time: string }[]>>({
    "demo-t1": [
      { id: "c1", user: "Elena", text: "Wireframes approved. Ready for visual design.", time: "10m ago" },
      { id: "c2", user: "Bikash", text: "Proceeding with calendar slot integration.", time: "2m ago" },
    ],
  });

  // Settings toggles in profile
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(true);

  const activeTaskObj = selectedTask || activeTasks[0];

  // Handler for adding a subtask to the selected task
  const handleAddSubtaskToCurrent = () => {
    if (!newSubtaskInput.trim() || !activeTaskObj) return;
    const newStep = {
      id: `s-${Date.now()}`,
      title: newSubtaskInput.trim(),
      completed: false,
    };
    const updatedSubtasks = [...(activeTaskObj.subtasks || []), newStep];
    const completedCount = updatedSubtasks.filter((s) => s.completed).length;
    const newProgress = Math.round((completedCount / updatedSubtasks.length) * 100);

    const updatedTask: TaskPulseItem = {
      ...activeTaskObj,
      subtasks: updatedSubtasks,
      progressPercentage: newProgress,
      updatedAt: new Date().toISOString(),
    };

    const newTasks = activeTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setInternalTasks(newTasks);
    setSelectedTask(updatedTask);
    setNewSubtaskInput("");
    onUpdateTaskProgress(updatedTask.id, newProgress);
  };

  // Handler for posting a comment in Task Details
  const handlePostComment = () => {
    if (!commentInput.trim() || !activeTaskObj) return;
    const newComment = {
      id: `c-${Date.now()}`,
      user: currentUser.name || "Bikash",
      text: commentInput.trim(),
      time: "Just now",
    };
    setComments((prev) => ({
      ...prev,
      [activeTaskObj.id]: [...(prev[activeTaskObj.id] || []), newComment],
    }));
    setCommentInput("");
  };

  // Handler for toggling subtask checkmark
  const handleToggleSubtaskInternal = (taskId: string, subtaskId: string) => {
    const updated = activeTasks.map((task) => {
      if (task.id !== taskId || !task.subtasks) return task;
      const newSubtasks = task.subtasks.map((sub) =>
        sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
      );
      const completedCount = newSubtasks.filter((s) => s.completed).length;
      const progress = Math.round((completedCount / newSubtasks.length) * 100);
      const isFullyDone = progress === 100;
      const nextStatus = isFullyDone
        ? "in_review"
        : task.status === "completed" && progress < 100
        ? "in_progress"
        : task.status === "backlog"
        ? "in_progress"
        : task.status;

      const updatedTask = {
        ...task,
        subtasks: newSubtasks,
        progressPercentage: progress,
        status: nextStatus as TaskStatus,
      };
      if (selectedTask?.id === taskId) {
        setSelectedTask(updatedTask);
      }
      onUpdateTaskProgress(taskId, progress);
      return updatedTask;
    });
    setInternalTasks(updated);
    onToggleSubtask?.(taskId, subtaskId);
  };

  // Manager Approval: Verified & Completed
  const handleManagerApprove = (taskId: string) => {
    const updated = activeTasks.map((task) => {
      if (task.id !== taskId) return task;
      const approvedTask: TaskPulseItem = {
        ...task,
        status: "completed",
        progressPercentage: 100,
        verifiedByManager: true,
        reviewerName: currentUser.name || "Bikash Kumar Yadav (Project Manager)",
        verifiedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      if (selectedTask?.id === taskId) {
        setSelectedTask(approvedTask);
      }
      return approvedTask;
    });
    setInternalTasks(updated);
    onUpdateTaskProgress(taskId, 100);
  };

  // Manager Request Changes: Return to in_progress
  const handleManagerRequestChanges = (taskId: string) => {
    const updated = activeTasks.map((task) => {
      if (task.id !== taskId) return task;
      const revisedSubtasks = task.subtasks?.map((st, idx, arr) =>
        idx === arr.length - 1 ? { ...st, completed: false } : st
      );
      const completedCount = revisedSubtasks?.filter((s) => s.completed).length || 0;
      const revisedProgress = revisedSubtasks && revisedSubtasks.length > 0 ? Math.round((completedCount / revisedSubtasks.length) * 100) : 80;
      const rejectedTask: TaskPulseItem = {
        ...task,
        status: "in_progress",
        progressPercentage: revisedProgress,
        subtasks: revisedSubtasks,
        reviewFeedback: "Revision requested by Project Manager. Please check remarks.",
      };
      if (selectedTask?.id === taskId) {
        setSelectedTask(rejectedTask);
      }
      return rejectedTask;
    });
    setInternalTasks(updated);
  };

  // Handler for creating a new task from the modal
  const handleCreateTaskSubmit = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: TaskPulseItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      projectName: newTaskProject,
      projectBadge: newTaskProject.slice(0, 4).toUpperCase(),
      department: newTaskDept,
      status: "in_progress",
      priority: newTaskPriority,
      progressPercentage: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: newTaskSteps.map((s, idx) => ({
        id: `s-${Date.now()}-${idx}`,
        title: s,
        completed: false,
      })),
    };

    setInternalTasks([newTask, ...activeTasks]);
    setSelectedTask(newTask);
    onAddTask?.(newTask);
    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    }).catch(() => {});
    setIsCreateOpen(false);
    setNewTaskTitle("");
    setNewTaskSteps(["Review requirements", "Implement changes"]);
    setCurrentTab("details");
  };

  // Handler for creating a new project
  const handleCreateProjectSubmit = () => {
    if (!newProjectName.trim()) return;
    const newProj: MobileProject = {
      id: `p-${Date.now()}`,
      name: newProjectName.trim(),
      category: newProjectCategory,
      department: newProjectCategory,
      completed: 0,
      total: 10,
      progress: 0,
      color: TASKCY.primary,
      code: newProjectName.trim().slice(0, 3).toUpperCase(),
    };
    setProjectsList([newProj, ...projectsList]);
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newProj.id,
        name: newProj.name,
        code: newProj.code,
        department: newProj.department,
        progressPercentage: 0,
      }),
    }).catch(() => {});
    setIsCreateOpen(false);
    setNewProjectName("");
  };

  // Filtering tasks on Home
  const filteredHomeTasks = activeTasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.projectName && t.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (taskStatusFilter === "In Progress") return t.status === "in_progress";
    if (taskStatusFilter === "Under Review") return t.status === "in_review";
    if (taskStatusFilter === "Completed") return t.status === "completed";
    return true;
  });

  const screenContent = (
    <div className={`flex-1 ${renderStandalone ? "w-full min-h-[calc(100dvh-70px)] sm:min-h-[820px] bg-[#F8FAFF]" : "rounded-[40px]"} bg-[#F8FAFF] flex flex-col overflow-hidden relative border border-slate-100 text-[#002055]`}>
          
          {/* Top Header Bar */}
          <div className="pt-3 px-5 pb-3 flex items-center justify-between bg-white border-b border-[#E9F1FF] shrink-0 z-20">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-9 h-9 rounded-xl border border-[#E9F1FF] flex items-center justify-center text-[#002055] hover:bg-[#F0EFFF] hover:border-[#756EF3]/30 transition-colors cursor-pointer"
              title="Open Workspace Menu"
            >
              <Grid className="w-4 h-4 text-[#002055]" />
            </button>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#756EF3]" />
              <span className="font-bold text-xs tracking-tight text-[#002055]">
                Friday, 26 Sep
              </span>
            </div>

            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="w-9 h-9 rounded-xl border border-[#E9F1FF] flex items-center justify-center text-[#002055] hover:bg-[#F0EFFF] hover:border-[#756EF3]/30 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-[#002055]" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#FE7182] ring-2 ring-white" />
            </button>
          </div>

          {/* Main Scrollable Canvas */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4 no-scrollbar pb-8">
            <AnimatePresence mode="wait">
              {/* HOME SCREEN */}
              {currentTab === "home" && (
                <motion.div
                  key="home-screen"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {/* Hero Greeting with Avatar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#848A94]">Welcome back,</span>
                        <span className="text-xs font-bold text-[#756EF3]">Bikash</span>
                      </div>
                      <h2 className="text-lg font-bold leading-tight text-[#002055] tracking-tight mt-0.5">
                        Let's make habits together
                      </h2>
                    </div>
                    <img
                      src={currentUser.avatarUrl || "/bikash_avatar.png"}
                      alt="Profile"
                      onClick={() => setCurrentTab("profile")}
                      className="w-10 h-10 rounded-full border-2 border-[#756EF3] object-cover shadow-sm cursor-pointer hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Search Bar on Home */}
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E9F1FF] shadow-xs text-xs">
                    <Search className="w-3.5 h-3.5 text-[#848A94]" />
                    <input
                      type="text"
                      placeholder="Search tasks, workstreams..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs text-[#002055] placeholder-[#848A94] focus:outline-none"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="text-[#848A94] hover:text-[#002055]">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Featured Project Card - Figma Node #2:6211 */}
                  <div
                    onClick={() => {
                      setSelectedProject(projectsList[0]);
                      setCurrentTab("projects");
                    }}
                    className="p-4 rounded-3xl bg-[#756EF3] text-white shadow-lg shadow-[#756EF3]/25 relative overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform"
                  >
                    {/* Background Graphic Accent */}
                    <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />

                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Folder className="w-5 h-5 text-white" />
                          <h3 className="font-bold text-base text-white leading-tight">
                            Application Design
                          </h3>
                        </div>
                        <p className="text-xs text-[#C5DAFD] mt-0.5 ml-7">UI Design Kit & Task Pulse</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm border border-white/20">
                        Featured
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Avatar Stack */}
                      <div className="flex items-center -space-x-2">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                          alt="Sarah"
                          className="w-7 h-7 rounded-full border-2 border-white object-cover"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                          alt="Marcus"
                          className="w-7 h-7 rounded-full border-2 border-white object-cover"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                          alt="Elena"
                          className="w-7 h-7 rounded-full border-2 border-white object-cover"
                        />
                        <div className="w-7 h-7 rounded-full border-2 border-white bg-white/30 flex items-center justify-center text-[9px] font-bold text-white">
                          +5
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-28 text-right">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-[#C5DAFD]">Progress</span>
                          <span className="font-bold text-white">50/80</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/25 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: "62%" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calendar Date Strip - Figma Node #2:33993 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#002055]">September 2026</span>
                      <span className="text-[10px] font-semibold text-[#756EF3] cursor-pointer">Today</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                      {DAYS.map((d) => {
                        const isSelected = selectedDay === d.date;
                        return (
                          <button
                            key={d.date}
                            onClick={() => setSelectedDay(d.date)}
                            className={`flex flex-col items-center justify-center w-12 h-17 rounded-2xl transition-all cursor-pointer shrink-0 ${
                              isSelected
                                ? "bg-[#756EF3] text-white shadow-md shadow-[#756EF3]/30 scale-105"
                                : "bg-white border border-[#E9F1FF] text-[#002055] hover:border-[#756EF3]/50"
                            }`}
                          >
                            <span className="text-sm font-bold leading-tight">{d.date}</span>
                            <span
                              className={`text-[10px] mt-0.5 ${
                                isSelected ? "text-white/90" : "text-[#848A94]"
                              }`}
                            >
                              {d.day}
                            </span>
                            {d.isToday && !isSelected && (
                              <span className="w-1 h-1 rounded-full bg-[#756EF3] mt-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Filter Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                    {(["All", "In Progress", "Under Review", "Completed"] as const).map((filter) => {
                      const isActive = taskStatusFilter === filter;
                      return (
                        <button
                          key={filter}
                          onClick={() => setTaskStatusFilter(filter)}
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                            isActive
                              ? "bg-[#002055] text-white shadow-xs"
                              : "bg-white text-[#848A94] border border-[#E9F1FF] hover:text-[#002055]"
                          }`}
                        >
                          {filter}
                        </button>
                      );
                    })}
                  </div>

                  {/* Task List Section */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-[#002055]">Tasks</h4>
                        <span className="px-1.5 py-0.2 rounded-md bg-[#F0EFFF] text-[10px] font-bold text-[#756EF3]">
                          {filteredHomeTasks.length}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setCreateType("task");
                          setIsCreateOpen(true);
                        }}
                        className="text-xs font-semibold text-[#756EF3] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {filteredHomeTasks.map((task) => {
                        const radius = 16;
                        const circumference = 2 * Math.PI * radius;
                        const offset = circumference - (task.progressPercentage / 100) * circumference;

                        return (
                          <div
                            key={task.id}
                            onClick={() => {
                              setSelectedTask(task);
                              setCurrentTab("details");
                            }}
                            className="p-3.5 rounded-2xl bg-white border border-[#E9F1FF] hover:border-[#756EF3]/50 shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all hover:translate-y-[-1px] group"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#F0EFFF] text-[#756EF3]">
                                  {task.projectName || "Design System"}
                                </span>
                                {task.priority === "critical" && (
                                  <span className="w-2 h-2 rounded-full bg-red-500" title="Critical" />
                                )}
                                {task.priority === "high" && (
                                  <span className="w-2 h-2 rounded-full bg-amber-500" title="High Priority" />
                                )}
                              </div>

                              <h5 className="font-bold text-xs text-[#002055] group-hover:text-[#756EF3] transition-colors truncate mt-1">
                                {task.title}
                              </h5>

                              <div className="flex items-center gap-2 mt-2 text-[10px] text-[#848A94]">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-[#848A94]" />
                                  2 min ago
                                </span>
                                <span>&bull;</span>
                                <span className="text-[#756EF3] font-semibold">
                                  {task.subtasks?.filter((s) => s.completed).length || 0}/
                                  {task.subtasks?.length || 0} steps
                                </span>
                              </div>
                            </div>

                            {/* Circular SVG Meter */}
                            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                              <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 40 40">
                                <circle
                                  cx="20"
                                  cy="20"
                                  r={radius}
                                  stroke="#E9F1FF"
                                  strokeWidth="3.5"
                                  fill="transparent"
                                />
                                <circle
                                  cx="20"
                                  cy="20"
                                  r={radius}
                                  stroke={task.progressPercentage === 100 ? "#10B981" : "#756EF3"}
                                  strokeWidth="3.5"
                                  strokeDasharray={circumference}
                                  strokeDashoffset={offset}
                                  strokeLinecap="round"
                                  fill="transparent"
                                  className="transition-all duration-500"
                                />
                              </svg>
                              <span className="absolute text-[10px] font-bold text-[#002055]">
                                {task.progressPercentage}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PROJECTS SCREEN */}
              {currentTab === "projects" && (
                <motion.div
                  key="projects-screen"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#002055]">Projects</h3>
                      <p className="text-[11px] text-[#848A94]">{projectsList.length} Active Workstreams</p>
                    </div>
                    <button
                      onClick={() => {
                        setCreateType("project");
                        setIsCreateOpen(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#756EF3] text-white text-xs font-bold shadow-xs hover:bg-[#635BEE] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New</span>
                    </button>
                  </div>

                  {/* 2-Way View Switcher: Projects Grid vs Gantt Roadmap */}
                  <div className="flex items-center p-1 rounded-xl bg-[#F0EFFF] border border-[#756EF3]/20 text-xs">
                    <button
                      onClick={() => setProjectViewMode("grid")}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all cursor-pointer ${
                        projectViewMode === "grid"
                          ? "bg-[#756EF3] text-white shadow-xs"
                          : "text-[#848A94] hover:text-[#002055]"
                      }`}
                    >
                      Projects Grid
                    </button>
                    <button
                      onClick={() => setProjectViewMode("timeline")}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        projectViewMode === "timeline"
                          ? "bg-[#756EF3] text-white shadow-xs"
                          : "text-[#848A94] hover:text-[#002055]"
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Timeline Roadmap</span>
                    </button>
                  </div>

                  {projectViewMode === "timeline" ? (
                    <div className="pt-1">
                      <GanttTimelineView isDarkMode={false} />
                    </div>
                  ) : (
                    <>
                      {/* Search Bar */}
                      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E9F1FF] text-xs">
                        <Search className="w-3.5 h-3.5 text-[#848A94]" />
                        <input
                          type="text"
                          placeholder="Search projects..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-transparent text-xs text-[#002055] placeholder-[#848A94] focus:outline-none"
                        />
                      </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {["All", "Design", "Marketing", "Engineering", "Product"].map((cat) => {
                      const isActive = projectFilter === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setProjectFilter(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                            isActive
                              ? "bg-[#756EF3] text-white shadow-xs"
                              : "bg-white text-[#848A94] border border-[#E9F1FF]"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Project Cards List */}
                  <div className="space-y-2.5 pt-1">
                    {projectsList
                      .filter((p) => {
                        const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase());
                        if (!matchQuery) return false;
                        if (projectFilter !== "All") return p.department === projectFilter;
                        return true;
                      })
                      .map((p) => {
                        const pTasks = activeTasks.filter(
                          (t) =>
                            (t.projectName && t.projectName.toLowerCase() === p.name.toLowerCase()) ||
                            (t.projectId && t.projectId === p.id)
                        );
                        const done = pTasks.filter((t) => t.status === "completed").length;
                        const countText = pTasks.length > 0 ? `${done}/${pTasks.length} tasks` : `${p.completed}/${p.total} tasks`;

                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedProject(p)}
                            className="p-3.5 rounded-2xl bg-white border border-[#E9F1FF] hover:border-[#756EF3]/50 shadow-xs space-y-3 cursor-pointer transition-all hover:translate-y-[-1px]"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                                  style={{ backgroundColor: `${p.color}20`, color: p.color }}
                                >
                                  {p.code}
                                </div>
                                <div>
                                  <h5 className="font-bold text-xs text-[#002055]">{p.name}</h5>
                                  <span className="text-[10px] text-[#848A94]">{p.category}</span>
                                </div>
                              </div>
                              <span
                                className="px-2 py-0.5 rounded-lg text-[10px] font-bold border"
                                style={{ borderColor: p.color, color: "#002055" }}
                              >
                                {countText}
                              </span>
                            </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center -space-x-1.5 shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                                alt="User"
                                className="w-5 h-5 rounded-full border border-white object-cover"
                              />
                              <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                                alt="User"
                                className="w-5 h-5 rounded-full border border-white object-cover"
                              />
                            </div>
                            <div className="h-1.5 flex-1 bg-[#EDF4FF] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${p.progress}%`, backgroundColor: p.color }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-[#848A94] shrink-0">
                              {p.progress}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* TASK DETAILS SCREEN */}
              {currentTab === "details" && activeTaskObj && (
                <motion.div
                  key="details-screen"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCurrentTab("home")}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#002055] hover:text-[#756EF3] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Tasks</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F0EFFF] text-[#756EF3]">
                        {activeTaskObj.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Header Title */}
                  <div>
                    <span className="text-[11px] font-bold text-[#756EF3]">
                      {activeTaskObj.projectName || "Enterprise Workstream"}
                    </span>
                    <h3 className="text-base font-bold text-[#002055] mt-0.5 leading-snug">
                      {activeTaskObj.title}
                    </h3>
                  </div>

                  {/* Assignee & Due Date Pill */}
                  <div className="p-3 rounded-2xl bg-white border border-[#E9F1FF] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                        alt="Bikash"
                        className="w-7 h-7 rounded-full object-cover border border-[#756EF3]"
                      />
                      <div>
                        <div className="font-bold text-[#002055] text-[11px]">Bikash Kumar Yadav</div>
                        <div className="text-[9px] text-[#848A94]">Super Admin Assignee</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-[#756EF3]">Due Today</div>
                      <div className="text-[9px] text-[#848A94]">6:00 PM EST</div>
                    </div>
                  </div>

                  {/* Progress Velocity Card */}
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E9F1FF] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#848A94] font-medium">Completion Velocity</span>
                      <span className="font-bold text-[#756EF3]">
                        {activeTaskObj.progressPercentage}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#EDF4FF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#756EF3] rounded-full transition-all duration-300"
                        style={{ width: `${activeTaskObj.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Manager Review & Approval Section */}
                  {activeTaskObj.status === "in_review" && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-2.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                          <span>Manager Verification Required</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-amber-200/60 text-[9px] font-bold text-amber-800 uppercase tracking-wider">
                          Review
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800/90 leading-relaxed">
                        Task marked 100% done by assignee. The project manager must review and verify all checklist steps before this task is marked completed.
                      </p>
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => handleManagerApprove(activeTaskObj.id)}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Complete</span>
                        </button>
                        <button
                          onClick={() => handleManagerRequestChanges(activeTaskObj.id)}
                          className="py-2 px-3 rounded-xl bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-800 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Request Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTaskObj.status === "completed" && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-900 text-xs shadow-xs">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[11px] text-emerald-900">Verified & Approved by Project Manager</div>
                        <div className="text-[10px] text-emerald-700 font-medium">
                          Approved by {activeTaskObj.reviewerName || "Bikash Kumar Yadav (Super Admin)"}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTaskObj.reviewFeedback && activeTaskObj.status === "in_progress" && (
                    <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs space-y-1">
                      <span className="font-bold text-amber-800 text-[10px] uppercase tracking-wider">Manager Revision Remarks:</span>
                      <p className="text-amber-900 text-[11px]">{activeTaskObj.reviewFeedback}</p>
                    </div>
                  )}

                  {/* Checklist Items with Add Step */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#002055]">
                        Checklist Steps ({activeTaskObj.subtasks?.length || 0})
                      </h5>
                      <span className="text-[10px] text-[#848A94]">
                        {activeTaskObj.subtasks?.filter((s) => s.completed).length || 0} completed
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white border border-[#E9F1FF] divide-y divide-slate-100">
                      {(activeTaskObj.subtasks || []).map((step) => (
                        <div
                          key={step.id}
                          onClick={() => handleToggleSubtaskInternal(activeTaskObj.id, step.id)}
                          className="py-2.5 flex items-center gap-2.5 cursor-pointer group"
                        >
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              step.completed
                                ? "bg-[#756EF3] border-[#756EF3] text-white"
                                : "border-slate-300 bg-white group-hover:border-[#756EF3]"
                            }`}
                          >
                            {step.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span
                            className={`text-xs flex-1 ${
                              step.completed
                                ? "line-through text-[#848A94]"
                                : "font-medium text-[#002055]"
                            }`}
                          >
                            {step.title}
                          </span>
                        </div>
                      ))}

                      {/* Add Step Input Form */}
                      <div className="pt-2.5 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add new step..."
                          value={newSubtaskInput}
                          onChange={(e) => setNewSubtaskInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddSubtaskToCurrent()}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#F8FAFF] border border-[#E9F1FF] text-xs text-[#002055] placeholder-[#848A94] focus:outline-none focus:border-[#756EF3]"
                        />
                        <button
                          onClick={handleAddSubtaskToCurrent}
                          className="px-2.5 py-1.5 rounded-lg bg-[#756EF3] text-white text-xs font-bold hover:bg-[#635BEE] cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2: Structured Governance, Multi-Stage Sign-Off Gates & SLA */}
                  <GovernanceGatesSection taskId={activeTaskObj.id} isDarkMode={false} />

                  {/* Phase 5: Threaded Discussions & Client/Guest Portal Safe Modes */}
                  <EnterpriseThreadedDiscussionSection
                    taskId={activeTaskObj.id}
                    taskTitle={activeTaskObj.title}
                    isDarkMode={false}
                  />
                </motion.div>
              )}

              {/* PROFILE SCREEN */}
              {currentTab === "profile" && (
                <motion.div
                  key="profile-screen"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4 pt-1"
                >
                  {/* User Profile Banner */}
                  <div className="p-4 rounded-3xl bg-white border border-[#E9F1FF] text-center space-y-2 shadow-xs">
                    <div className="relative inline-block mx-auto">
                      <img
                        src={currentUser.avatarUrl || "/bikash_avatar.png"}
                        alt={currentUser.name || "Bikash"}
                        className="w-18 h-18 rounded-full border-4 border-[#756EF3] object-cover mx-auto shadow-md"
                      />
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-[#002055]">Bikash Kumar Yadav</h4>
                      <div className="flex items-center justify-center gap-1.5 mt-0.5">
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-700 flex items-center gap-1">
                          Permanent Super Admin
                        </span>
                      </div>
                      <p className="text-[11px] text-[#848A94] mt-1 font-mono">zevonbcash@gmail.com</p>
                    </div>

                    {/* 4 Performance Stat Cards */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                      <div className="p-2 rounded-xl bg-[#F8FAFF]">
                        <div className="font-bold text-sm text-[#002055]">18</div>
                        <div className="text-[9px] text-[#848A94]">Done</div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#F8FAFF]">
                        <div className="font-bold text-sm text-[#002055]">5</div>
                        <div className="text-[9px] text-[#848A94]">Projects</div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#F8FAFF]">
                        <div className="font-bold text-sm text-[#756EF3]">98%</div>
                        <div className="text-[9px] text-[#848A94]">Velocity</div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Completion Bar Chart */}
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E9F1FF] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#002055]">Weekly Output</span>
                      <span className="text-[10px] text-[#848A94]">32 tasks</span>
                    </div>

                    <div className="flex items-end justify-between gap-1.5 h-20 pt-2 px-1">
                      {[
                        { day: "M", val: 65 },
                        { day: "T", val: 80 },
                        { day: "W", val: 45 },
                        { day: "T", val: 90 },
                        { day: "F", val: 100, active: true },
                        { day: "S", val: 30 },
                        { day: "S", val: 50 },
                      ].map((bar, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-[#F0EFFF] rounded-md h-14 flex items-end overflow-hidden">
                            <div
                              className={`w-full rounded-md transition-all duration-500 ${
                                bar.active ? "bg-[#756EF3]" : "bg-[#C6C3FB]"
                              }`}
                              style={{ height: `${bar.val}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-bold text-[#848A94]">{bar.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Members Roster */}
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E9F1FF] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#002055]">Active Team</span>
                      <span className="text-[10px] font-bold text-[#756EF3]">Manage Roles</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { name: "Marcus Vance", role: "Frontend Lead", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", online: true },
                        { name: "Elena Rostova", role: "UX Designer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", online: true },
                        { name: "Sarah Chen", role: "Backend Architect", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", online: false },
                      ].map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                              <span
                                className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${
                                  m.online ? "bg-emerald-500" : "bg-slate-300"
                                }`}
                              />
                            </div>
                            <div>
                              <div className="font-bold text-[11px] text-[#002055]">{m.name}</div>
                              <div className="text-[9px] text-[#848A94]">{m.role}</div>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#F8FAFF] border border-[#E9F1FF] text-[#002055]">
                            {m.online ? "Online" : "Away"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enterprise Suite & Compliance */}
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E9F1FF] space-y-2.5 shadow-xs">
                    <span className="font-bold text-xs text-[#002055] block">Enterprise Suite & Compliance</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setIsCorporateAnalyticsOpen(true)}
                        className="p-2.5 rounded-xl bg-[#F8FAFF] border border-[#E9F1FF] hover:border-[#756EF3]/40 text-left transition-all cursor-pointer group"
                      >
                        <BarChart3 className="w-4 h-4 text-[#756EF3] mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-[11px] text-[#002055] block">Executive Brief</span>
                        <span className="text-[9px] text-[#848A94]">Board PDF/CSV Export</span>
                      </button>
                      <button
                        onClick={() => setIsAuditRbacModalOpen(true)}
                        className="p-2.5 rounded-xl bg-[#F8FAFF] border border-[#E9F1FF] hover:border-emerald-500/40 text-left transition-all cursor-pointer group"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-[11px] text-[#002055] block">SOC 2 Audit</span>
                        <span className="text-[9px] text-[#848A94]">RBAC & Merkle Root</span>
                      </button>
                    </div>
                  </div>

                  {/* App Preferences & Settings */}
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E9F1FF] space-y-3">
                    <span className="font-bold text-xs text-[#002055] block">App Preferences</span>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#002055]">Push Notifications</span>
                      <button
                        onClick={() => setPushEnabled(!pushEnabled)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          pushEnabled ? "bg-[#756EF3]" : "bg-slate-200"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            pushEnabled ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#002055]">Audio Feedback</span>
                      <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          soundEnabled ? "bg-[#756EF3]" : "bg-slate-200"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            soundEnabled ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#002055]">Live Cloud Sync</span>
                      <button
                        onClick={() => setSyncEnabled(!syncEnabled)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          syncEnabled ? "bg-[#756EF3]" : "bg-slate-200"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            syncEnabled ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Project Details Modal (Drilldown) */}
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="absolute inset-x-0 bottom-0 top-14 bg-white rounded-t-3xl border-t border-[#E9F1FF] z-40 p-4 shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                      style={{ backgroundColor: `${selectedProject.color}20`, color: selectedProject.color }}
                    >
                      {selectedProject.code}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#002055]">{selectedProject.name}</h4>
                      <p className="text-[10px] text-[#848A94]">{selectedProject.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-[#848A94] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-3">
                  <div className="flex justify-between text-xs mb-1 font-bold">
                    <span className="text-[#848A94]">Project Velocity</span>
                    <span className="text-[#756EF3]">{selectedProject.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#EDF4FF] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${selectedProject.progress}%`, backgroundColor: selectedProject.color }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 text-xs font-bold text-[#002055]">
                  <span>Tasks in Project</span>
                  <button
                    onClick={() => {
                      setNewTaskProject(selectedProject.name);
                      setCreateType("task");
                      setSelectedProject(null);
                      setIsCreateOpen(true);
                    }}
                    className="text-[11px] text-[#756EF3] flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar pb-6">
                  {(() => {
                    const projectTasks = activeTasks.filter(
                      (t) =>
                        (t.projectName && t.projectName.toLowerCase() === selectedProject.name.toLowerCase()) ||
                        (t.projectId && t.projectId === selectedProject.id)
                    );

                    if (projectTasks.length === 0) {
                      return (
                        <div className="text-center py-8 px-4 space-y-2 bg-[#F8FAFF] rounded-2xl border border-dashed border-[#E9F1FF] mt-2">
                          <p className="text-xs font-semibold text-[#002055]">No tasks in this project yet</p>
                          <p className="text-[10px] text-[#848A94]">Click "Add Task" above to create your first task in {selectedProject.name}.</p>
                        </div>
                      );
                    }

                    return projectTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => {
                          setSelectedTask(task);
                          setSelectedProject(null);
                          setCurrentTab("details");
                        }}
                        className="p-3 rounded-xl border border-[#E9F1FF] hover:border-[#756EF3]/50 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-[#002055]">{task.title}</div>
                          <div className="text-[10px] text-[#848A94]">
                            {task.subtasks?.filter((s) => s.completed).length || 0}/{task.subtasks?.length || 0} completed
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#756EF3]">{task.progressPercentage}%</span>
                      </div>
                    ));
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create Task / Project Bottom Sheet Modal */}
          <AnimatePresence>
            {isCreateOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 z-50 flex items-end justify-center backdrop-blur-xs"
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 280 }}
                  className="w-full bg-white rounded-t-[32px] p-5 border-t border-[#E9F1FF] shadow-2xl max-h-[85%] overflow-y-auto no-scrollbar space-y-4"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCreateType("task")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          createType === "task"
                            ? "bg-[#756EF3] text-white"
                            : "text-[#848A94] hover:text-[#002055]"
                        }`}
                      >
                        New Task
                      </button>
                      <button
                        onClick={() => setCreateType("project")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          createType === "project"
                            ? "bg-[#756EF3] text-white"
                            : "text-[#848A94] hover:text-[#002055]"
                        }`}
                      >
                        New Project
                      </button>
                    </div>
                    <button
                      onClick={() => setIsCreateOpen(false)}
                      className="p-1 rounded-full hover:bg-slate-100 text-[#848A94] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {createType === "task" ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#848A94] block mb-1">
                          Task Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Design Onboarding Screens"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#F8FAFF] border border-[#E9F1FF] text-xs text-[#002055] focus:outline-none focus:border-[#756EF3]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#848A94] block mb-1">
                            Project
                          </label>
                          <select
                            value={newTaskProject}
                            onChange={(e) => setNewTaskProject(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-xl bg-[#F8FAFF] border border-[#E9F1FF] text-xs text-[#002055] focus:outline-none"
                          >
                            {projectsList.map((p) => (
                              <option key={p.id} value={p.name}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#848A94] block mb-1">
                            Priority
                          </label>
                          <select
                            value={newTaskPriority}
                            onChange={(e) => setNewTaskPriority(e.target.value as "low" | "medium" | "high" | "critical")}
                            className="w-full px-2.5 py-2 rounded-xl bg-[#F8FAFF] border border-[#E9F1FF] text-xs text-[#002055] focus:outline-none"
                          >
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Normal</option>
                          </select>
                        </div>
                      </div>

                      {/* Initial Steps Checklist */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#848A94] block mb-1">
                          Subtasks / Checklist Steps
                        </label>
                        <div className="space-y-1.5 mb-2">
                          {newTaskSteps.map((step, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs bg-[#F8FAFF] p-2 rounded-lg border border-[#E9F1FF]">
                              <span className="text-[#002055] truncate">{step}</span>
                              <button
                                onClick={() => setNewTaskSteps(newTaskSteps.filter((_, i) => i !== idx))}
                                className="text-red-400 hover:text-red-600 p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Add subtask step..."
                            value={stepDraft}
                            onChange={(e) => setStepDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && stepDraft.trim()) {
                                setNewTaskSteps([...newTaskSteps, stepDraft.trim()]);
                                setStepDraft("");
                              }
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-[#F8FAFF] border border-[#E9F1FF] text-xs text-[#002055] focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              if (stepDraft.trim()) {
                                setNewTaskSteps([...newTaskSteps, stepDraft.trim()]);
                                setStepDraft("");
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#756EF3] text-white text-xs font-bold cursor-pointer"
                          >
                            + Step
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleCreateTaskSubmit}
                        disabled={!newTaskTitle.trim()}
                        className="w-full py-2.5 rounded-xl bg-[#756EF3] hover:bg-[#635BEE] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-[#756EF3]/30 cursor-pointer transition-all"
                      >
                        Create Task
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#848A94] block mb-1">
                          Project Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Design Tokens Revamp"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#F8FAFF] border border-[#E9F1FF] text-xs text-[#002055] focus:outline-none focus:border-[#756EF3]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#848A94] block mb-1">
                            Department
                          </label>
                          <select
                            value={newProjectCategory}
                            onChange={(e) => setNewProjectCategory(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-xl bg-[#F8FAFF] border border-[#E9F1FF] text-xs text-[#002055] focus:outline-none"
                          >
                            <option value="Design">Design</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Product">Product</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#848A94] block mb-1">
                            Project Code
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. PRJ"
                            maxLength={4}
                            defaultValue={newProjectName ? newProjectName.slice(0, 3).toUpperCase() : ""}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFF] border border-[#E9F1FF] text-xs text-center font-mono font-bold text-[#002055] uppercase focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleCreateProjectSubmit}
                        disabled={!newProjectName.trim()}
                        className="w-full py-2.5 rounded-xl bg-[#756EF3] hover:bg-[#635BEE] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-[#756EF3]/30 cursor-pointer transition-all"
                      >
                        Create Project
                      </button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notifications Slide-Over Drawer */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 z-50 flex items-start justify-end backdrop-blur-xs"
              >
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 280 }}
                  className="w-4/5 h-full bg-white p-4 shadow-2xl space-y-3 overflow-y-auto no-scrollbar"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-[#756EF3]" />
                      <h4 className="font-bold text-xs text-[#002055]">Notifications</h4>
                    </div>
                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="p-1 rounded-full hover:bg-slate-100 text-[#848A94] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { title: "Elena marked wireframes complete", time: "5m ago", badge: "DONE", color: "#10B981" },
                      { title: "Marcus assigned you to Banking App", time: "25m ago", badge: "TASK", color: "#756EF3" },
                      { title: "Velocity milestone: 90% reached!", time: "1h ago", badge: "GOAL", color: "#F59E0B" },
                      { title: "New build ready: TaskPulse.apk", time: "2h ago", badge: "APK", color: "#6366F1" },
                    ].map((n, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-[#F8FAFF] border border-[#E9F1FF] text-xs space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white font-mono"
                            style={{ backgroundColor: n.color }}
                          >
                            {n.badge}
                          </span>
                          <span className="font-bold text-[11px] text-[#002055]">{n.title}</span>
                        </div>
                        <span className="text-[9px] text-[#848A94] ml-11 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Workspace Drawer */}
          <AnimatePresence>
            {isDrawerOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 z-50 flex items-start justify-start backdrop-blur-xs"
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 280 }}
                  className="w-4/5 h-full bg-white p-4 shadow-2xl space-y-4 overflow-y-auto no-scrollbar"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#756EF3] text-white flex items-center justify-center font-bold text-xs">
                        TP
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#002055]">TaskPulse</h4>
                        <p className="text-[9px] text-[#848A94]">Enterprise Mobile</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-1 rounded-full hover:bg-slate-100 text-[#848A94] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div
                      onClick={() => {
                        setCurrentTab("home");
                        setIsDrawerOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-[#F0EFFF] text-[#756EF3] font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <Home className="w-4 h-4" />
                      <span>Task Dashboard</span>
                    </div>

                    <div
                      onClick={() => {
                        setCurrentTab("projects");
                        setIsDrawerOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 text-[#002055] font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <Folder className="w-4 h-4 text-[#848A94]" />
                      <span>Projects & Sprints</span>
                    </div>

                    <div
                      onClick={() => {
                        setCurrentTab("profile");
                        setIsDrawerOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 text-[#002055] font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#848A94]" />
                      <span>My Profile & Team</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#848A94] block mb-2">
                      Enterprise Suite
                    </span>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsCorporateAnalyticsOpen(true);
                          setIsDrawerOpen(false);
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-[#002055] font-semibold flex items-center justify-between text-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-[#756EF3]" />
                          <span>Executive Analytics & Export</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#F0EFFF] text-[#756EF3]">
                          PDF/CSV
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setIsAuditRbacModalOpen(true);
                          setIsDrawerOpen(false);
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-[#002055] font-semibold flex items-center justify-between text-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>SOC 2 Audit & RBAC Ledger</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600">
                          SOC 2
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentTab("projects");
                          setProjectViewMode("timeline");
                          setIsDrawerOpen(false);
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-[#002055] font-semibold flex items-center justify-between text-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span>Portfolio Gantt Roadmap</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-600">
                          Roadmap
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#848A94] block mb-2">
                      Workspaces
                    </span>
                    <div className="p-2 rounded-xl border border-[#E9F1FF] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-[#002055] text-[11px]">Default Org</div>
                        <div className="text-[9px] text-emerald-600 font-semibold">● Connected</div>
                      </div>
                      <Shield className="w-3.5 h-3.5 text-[#756EF3]" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Taskcy Bottom Navigation Dock - Figma Node #2:17246 */}
          <div className="sticky bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#E9F1FF] flex items-center justify-around px-4 z-30 shadow-lg shrink-0">
            <button
              onClick={() => setCurrentTab("home")}
              className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                currentTab === "home" ? "text-[#756EF3]" : "text-[#848A94] hover:text-[#002055]"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[9px] font-bold">Home</span>
            </button>

            <button
              onClick={() => setCurrentTab("projects")}
              className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                currentTab === "projects" ? "text-[#756EF3]" : "text-[#848A94] hover:text-[#002055]"
              }`}
            >
              <Folder className="w-5 h-5" />
              <span className="text-[9px] font-bold">Projects</span>
            </button>

            {/* Center + Action Button */}
            <button
              onClick={() => {
                setCreateType("task");
                setIsCreateOpen(true);
              }}
              className="w-12 h-12 -mt-6 rounded-full bg-[#756EF3] text-white flex items-center justify-center shadow-lg shadow-[#756EF3]/40 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="Create New Task or Project"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>

            <button
              onClick={() => setCurrentTab("profile")}
              className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                currentTab === "profile" ? "text-[#756EF3]" : "text-[#848A94] hover:text-[#002055]"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[9px] font-bold">Profile</span>
            </button>
          </div>
        </div>
  );

  return (
    <>
      {renderStandalone ? (
        <div className="w-full min-h-[calc(100dvh-70px)] bg-[#F8FAFF] flex flex-col items-center justify-start select-none font-sans">
          <div className="w-full max-w-md min-h-[calc(100dvh-70px)] flex flex-col relative bg-[#F8FAFF] shadow-xs sm:border-x sm:border-[#E9F1FF]">
            {screenContent}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center select-none font-sans">
          {/* Realistic Mobile Device Frame */}
          <div className="relative w-[385px] h-[810px] bg-slate-900 rounded-[54px] p-3.5 shadow-2xl border-4 border-slate-700/70 ring-1 ring-white/10 overflow-hidden flex flex-col">
            {/* Dynamic Island Pill */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 h-5 w-28 bg-black rounded-full z-50 flex items-center justify-between px-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-mono text-slate-400">PULSE</span>
              </div>
            </div>

            {/* Device Status Bar */}
            <div className="pt-2 px-6 pb-2 flex items-center justify-between text-[11px] font-semibold text-slate-800 dark:text-slate-200 z-40">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
              </div>
            </div>

            {screenContent}
          </div>
        </div>
      )}

      {/* Enterprise Suite Modals */}
      <CorporateAnalyticsExportModal
        isOpen={isCorporateAnalyticsOpen}
        isDarkMode={false}
        onClose={() => setIsCorporateAnalyticsOpen(false)}
      />

      <EnterpriseAuditAndRbacModal
        isOpen={isAuditRbacModalOpen}
        isDarkMode={false}
        onClose={() => setIsAuditRbacModalOpen(false)}
      />
    </>
  );
};

export default MobileDeviceFrame;
