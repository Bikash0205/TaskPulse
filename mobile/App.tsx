import React, { useState, useMemo, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Image,
  Dimensions,
  Modal,
  Switch,
  Vibration,
} from "react-native";
import {
  HomeIcon,
  FolderIcon,
  PlusIcon,
  UserIcon,
  BellIcon,
  GridIcon,
  SearchIcon,
  ArrowLeftIcon,
  CheckIcon,
  CalendarIcon,
  ClockIcon,
  ChevronRightIcon,
  SendIcon,
  XIcon,
  NativeProgressDial,
  SunIcon,
  MoonIcon,
  ImageIcon,
  UploadIcon,
  MailIcon,
  UsersIcon,
  CopyIcon,
  BuildingIcon,
} from "./components/Icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
import { BIKASH_AVATAR_URI } from "./assets/bikashAvatarBase64";
import { SAMPLE_SCREENSHOT_URI } from "./assets/sampleScreenshotBase64";

const BIKASH_AVATAR = { uri: BIKASH_AVATAR_URI };

// Taskcy & TaskPulse Themes
const LIGHT_COLORS = {
  primary: "#756EF3",
  primaryLight: "#F0EFFF",
  primarySoft: "#C6C3FB",
  navy: "#002055",
  textSecondary: "#556070",
  muted: "#848A94",
  border: "#E9F1FF",
  background: "#F8FAFF",
  white: "#FFFFFF",
  card: "#FFFFFF",
  cardSecondary: "#F8FAFC",
  cardBorder: "#E9F1FF",
  accentGreen: "#10B981",
  accentYellow: "#F59E0B",
  accentBlue: "#3B82F6",
  accentPink: "#FEB5BD",
  tabBarBg: "#FFFFFF",
  tabBarBorder: "#E9F1FF",
  inputBg: "#F8FAFF",
  inputBorder: "#E2E8F0",
  reviewBoxBg: "#FFFBEB",
  reviewBoxBorder: "#FCD34D",
  reviewBoxText: "#92400E",
};

const DARK_COLORS = {
  primary: "#818CF8",
  primaryLight: "rgba(129, 140, 248, 0.18)",
  primarySoft: "#4F46E5",
  navy: "#F8FAFC",
  textSecondary: "#94A3B8",
  muted: "#64748B",
  border: "#1E293B",
  background: "#0B0F19",
  white: "#151C2C",
  card: "#151C2C",
  cardSecondary: "#1E293B",
  cardBorder: "#334155",
  accentGreen: "#34D399",
  accentYellow: "#FBBF24",
  accentBlue: "#60A5FA",
  accentPink: "#F472B6",
  tabBarBg: "#0F172A",
  tabBarBorder: "#1E293B",
  inputBg: "#0F172A",
  inputBorder: "#334155",
  reviewBoxBg: "#2D2415",
  reviewBoxBorder: "#78350F",
  reviewBoxText: "#FDE68A",
};

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "member" | "viewer";
  organization: string;
  assignedProjects: string[];
}

export interface OnboardingEmployee {
  id: string;
  name: string;
  email: string;
  role: "manager" | "member" | "viewer";
  assignedProject: string;
}

const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: "u-admin",
    name: "Bikash Kumar Yadav",
    email: "zevonbcash@gmail.com",
    role: "admin",
    organization: "TaskPulse Technologies",
    assignedProjects: ["Application Design", "Unity Dashboard", "Instagram Shots", "Cubbles Engine", "Ui8 Platform"],
  },
  {
    id: "u-marcus",
    name: "Marcus Lee",
    email: "marcus@taskpulse.io",
    role: "manager",
    organization: "TaskPulse Technologies",
    assignedProjects: ["Application Design", "Unity Dashboard"],
  },
  {
    id: "u-elena",
    name: "Elena Rostova",
    email: "elena@taskpulse.io",
    role: "member",
    organization: "TaskPulse Technologies",
    assignedProjects: ["Application Design", "Instagram Shots"],
  },
  {
    id: "u-david",
    name: "David Kim",
    email: "david@taskpulse.io",
    role: "viewer",
    organization: "TaskPulse Technologies",
    assignedProjects: ["Cubbles Engine"],
  },
];

const INITIAL_ONBOARDING_EMPLOYEES: OnboardingEmployee[] = [
  {
    id: "oe-1",
    name: "Marcus Lee",
    email: "marcus@taskpulse.io",
    role: "manager",
    assignedProject: "Application Design",
  },
  {
    id: "oe-2",
    name: "Elena Rostova",
    email: "elena@taskpulse.io",
    role: "member",
    assignedProject: "Application Design",
  },
  {
    id: "oe-3",
    name: "David Kim",
    email: "david@taskpulse.io",
    role: "viewer",
    assignedProject: "Unity Dashboard",
  },
];

interface MobileTask {
  id: string;
  title: string;
  project: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "in_progress" | "in_review" | "completed";
  progress: number;
  timeAgo: string;
  subtasks: { id: string; title: string; completed: boolean }[];
  completionNotes?: string;
  completionScreenshot?: string;
  submittedAt?: string;
  reviewedBy?: string;
  reviewDate?: string;
}

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
}

const INITIAL_PROJECTS: MobileProject[] = [
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

const INITIAL_TASKS: MobileTask[] = [
  {
    id: "t1",
    title: "Create Detail Booking Screens",
    project: "Application Design",
    category: "Design",
    priority: "high",
    status: "in_progress",
    progress: 60,
    timeAgo: "2 min ago",
    subtasks: [
      { id: "s1", title: "Review Figma component specs", completed: true },
      { id: "s2", title: "Build time-slot picker carousel", completed: true },
      { id: "s3", title: "Connect manager review dispatch", completed: false },
    ],
  },
  {
    id: "t2",
    title: "Revision Home Page & Analytics",
    project: "Unity Dashboard",
    category: "Engineering",
    priority: "critical",
    status: "in_review",
    progress: 90,
    timeAgo: "5 min ago",
    subtasks: [
      { id: "s4", title: "Update card shadow & glass blur", completed: true },
      { id: "s5", title: "Format currency decimal alignment", completed: true },
      { id: "s6", title: "Integrate biometrics auth trigger", completed: true },
    ],
    completionNotes: "Fixed bottom navigation touch diameter, added generous hitSlop, and verified responsive screen bounds.",
    completionScreenshot: SAMPLE_SCREENSHOT_URI,
    submittedAt: "5 min ago",
  },
  {
    id: "t3",
    title: "Creative Assets & Video Reel Launch",
    project: "Instagram Shots",
    category: "Marketing",
    priority: "medium",
    status: "in_progress",
    progress: 70,
    timeAgo: "7 min ago",
    subtasks: [
      { id: "s7", title: "Responsive header navigation bar", completed: true },
      { id: "s8", title: "Creator testimonial video reel embed", completed: true },
      { id: "s9", title: "Campaign tag validation", completed: false },
    ],
  },
  {
    id: "t4",
    title: "Core Architecture & Webhooks",
    project: "Cubbles Engine",
    category: "Engineering",
    priority: "high",
    status: "in_progress",
    progress: 80,
    timeAgo: "12 min ago",
    subtasks: [
      { id: "s10", title: "Setup WebSocket cluster sync", completed: true },
      { id: "s11", title: "Zero-copy message serialization", completed: true },
      { id: "s12", title: "Telemetry tracing buffer", completed: false },
    ],
  },
  {
    id: "t5",
    title: "Product Roadmap & Sprint Spec",
    project: "Ui8 Platform",
    category: "Product",
    priority: "medium",
    status: "completed",
    progress: 100,
    timeAgo: "1 hour ago",
    subtasks: [
      { id: "s13", title: "User feedback sprint prioritization", completed: true },
      { id: "s14", title: "Release changelog draft approval", completed: true },
    ],
  },
  {
    id: "t6",
    title: "Design System Dark Mode Tokens",
    project: "Application Design",
    category: "Design",
    priority: "medium",
    status: "completed",
    progress: 100,
    timeAgo: "2 hours ago",
    subtasks: [
      { id: "s15", title: "Export semantic color variables", completed: true },
      { id: "s16", title: "Verify high contrast ratios", completed: true },
    ],
  },
];

const DAYS = [
  { date: "19", day: "Sat" },
  { date: "20", day: "Sun" },
  { date: "21", day: "Mon", isToday: true },
  { date: "22", day: "Tue" },
  { date: "23", day: "Wed" },
  { date: "24", day: "Thu" },
  { date: "25", day: "Fri" },
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const COLORS = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  // Ultra-light, very responsive haptic tick
  const triggerHaptic = (style: "light" | "selection" | "success" = "light") => {
    try {
      if (style === "success") {
        Vibration.vibrate([0, 12, 35, 18]);
      } else if (style === "selection") {
        Vibration.vibrate(12);
      } else {
        Vibration.vibrate(8); // 8ms micro-pulse
      }
    } catch {
      // ignore
    }
  };

  // User Accounts & Authentication Gate State
  const [registeredAccounts, setRegisteredAccounts] = useState<UserAccount[]>(DEFAULT_ACCOUNTS);
  // Default to Super Admin so existing tests work, or user can tap Logout / Switch Account anytime
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(DEFAULT_ACCOUNTS[0]);

  // Auth Entrance Screen State
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [loginEmail, setLoginEmail] = useState("");
  const [uninvitedWarning, setUninvitedWarning] = useState<string | null>(null);

  // 3-Step Organization Onboarding Wizard State (Admin Flow)
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(1);
  const [onboardAdminName, setOnboardAdminName] = useState("Alex Vance");
  const [onboardAdminEmail, setOnboardAdminEmail] = useState("alex@acmecorp.com");
  const [onboardingOrgName, setOnboardingOrgName] = useState("Acme Innovations");
  const [onboardingSlug, setOnboardingSlug] = useState("acme-innovations");
  const [onboardingTeamSize, setOnboardingTeamSize] = useState("11-50");

  // Step 2 Employee Additions
  const [onboardingEmployees, setOnboardingEmployees] = useState<OnboardingEmployee[]>(INITIAL_ONBOARDING_EMPLOYEES);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState<"manager" | "member" | "viewer">("manager");
  const [newEmployeeProject, setNewEmployeeProject] = useState("Application Design");

  // Step 3 Copy Link State
  const [linkCopied, setLinkCopied] = useState(false);

  // General App Navigation & Data State
  const [currentTab, setCurrentTab] = useState<"home" | "projects" | "details" | "profile">("home");
  const [selectedDay, setSelectedDay] = useState("21");
  const [tasks, setTasks] = useState<MobileTask[]>(INITIAL_TASKS);
  const [projects, setProjects] = useState<MobileProject[]>(INITIAL_PROJECTS);
  const [selectedTask, setSelectedTask] = useState<MobileTask | null>(INITIAL_TASKS[0]);
  const [selectedProjectView, setSelectedProjectView] = useState<MobileProject | null>(null);
  const [projectFilter, setProjectFilter] = useState("All");
  const [projectTaskFilter, setProjectTaskFilter] = useState("All");
  const [taskStatusFilter, setTaskStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Live Cloud Synchronization with Web API
  useEffect(() => {
    let isMounted = true;
    const syncWithServer = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.allSettled([
          fetch("https://happy-fermi-kappa.vercel.app/api/tasks"),
          fetch("https://happy-fermi-kappa.vercel.app/api/projects"),
        ]);

        if (tasksRes.status === "fulfilled" && tasksRes.value.ok) {
          const remoteTasks = await tasksRes.value.json();
          if (isMounted && Array.isArray(remoteTasks) && remoteTasks.length > 0) {
            const mappedTasks: MobileTask[] = remoteTasks.map((rt: any) => ({
              id: rt.id,
              title: rt.title,
              project: rt.projectName || rt.projectBadge || "Application Design",
              category: rt.department || "Design",
              priority: rt.priority || "medium",
              status: rt.status === "completed" ? "completed" : rt.status === "in_review" ? "in_review" : "in_progress",
              progress: rt.progressPercentage ?? 0,
              timeAgo: "Live sync",
              subtasks: rt.subtasks?.map((st: any) => ({
                id: st.id,
                title: st.title,
                completed: !!st.completed,
              })) || [],
            }));
            setTasks((prev) => {
              const remoteIds = new Set(mappedTasks.map((t) => t.id));
              const localOnly = prev.filter((t) => !remoteIds.has(t.id));
              return [...mappedTasks, ...localOnly];
            });
          }
        }

        if (projectsRes.status === "fulfilled" && projectsRes.value.ok) {
          const remoteProjects = await projectsRes.value.json();
          if (isMounted && Array.isArray(remoteProjects) && remoteProjects.length > 0) {
            setProjects((prev) => {
              const mapped = remoteProjects.map((rp: any, idx: number) => ({
                id: rp.id || `rp-${idx}`,
                name: rp.name,
                category: rp.department || "General",
                department: rp.department || "General",
                completed: Math.round((rp.progressPercentage || 50) * 0.1),
                total: 10,
                progress: rp.progressPercentage || 50,
                color: idx % 2 === 0 ? "#756EF3" : "#10B981",
                code: rp.code || rp.name.slice(0, 3).toUpperCase(),
              }));
              const remoteNames = new Set(mapped.map((p: any) => p.name.toLowerCase()));
              const keepLocal = prev.filter((p) => !remoteNames.has(p.name.toLowerCase()));
              return [...mapped, ...keepLocal];
            });
          }
        }
      } catch {
        // Offline resilience: keep local state intact
      }
    };

    syncWithServer();
    return () => {
      isMounted = false;
    };
  }, []);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<"task" | "project">("task");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  // Task Completion Review Modal State
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewTaskTarget, setReviewTaskTarget] = useState<MobileTask | null>(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [attachedScreenshot, setAttachedScreenshot] = useState<string | null>(null);
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);

  // New Task Form
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("Application Design");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high" | "critical">("high");
  const [newTaskSteps, setNewTaskSteps] = useState<string[]>([
    "Review design specs",
    "Prepare component tokens",
  ]);
  const [stepDraft, setStepDraft] = useState("");

  // New Project Form
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectCategory, setNewProjectCategory] = useState("Design");

  // Task Details Subtasks & Comments
  const [newSubtaskInput, setNewSubtaskInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<Record<string, { id: string; user: string; text: string; time: string }[]>>({
    t1: [
      { id: "c1", user: "Elena", text: "Wireframes approved. Ready for visual design.", time: "10m ago" },
      { id: "c2", user: "Bikash", text: "Proceeding with calendar slot integration.", time: "2m ago" },
    ],
  });

  // Toggles
  const [pushEnabled, setPushEnabled] = useState(true);

  // Handle Login Flow
  const handleSignIn = (emailToTest?: string) => {
    triggerHaptic("selection");
    const targetEmail = (emailToTest || loginEmail).trim().toLowerCase();
    if (!targetEmail) return;

    const matched = registeredAccounts.find((a) => a.email.toLowerCase() === targetEmail);
    if (matched) {
      setUninvitedWarning(null);
      setCurrentUser(matched);
      setCurrentTab("home");
      triggerHaptic("success");
    } else {
      setUninvitedWarning(targetEmail);
      triggerHaptic("selection");
    }
  };

  // Add Employee in Step 2
  const handleAddEmployee = () => {
    if (!newEmployeeEmail.trim()) return;
    triggerHaptic("selection");
    const emp: OnboardingEmployee = {
      id: `oe-${Date.now()}`,
      name: newEmployeeName.trim() || newEmployeeEmail.split("@")[0],
      email: newEmployeeEmail.trim().toLowerCase(),
      role: newEmployeeRole,
      assignedProject: newEmployeeProject,
    };
    setOnboardingEmployees((prev) => [...prev, emp]);
    setNewEmployeeName("");
    setNewEmployeeEmail("");
  };

  // Finish Onboarding & Launch Workspace
  const handleLaunchWorkspace = () => {
    triggerHaptic("success");
    const newAdminAccount: UserAccount = {
      id: `u-${Date.now()}`,
      name: onboardAdminName.trim() || "Organization Admin",
      email: onboardAdminEmail.trim().toLowerCase(),
      role: "admin",
      organization: onboardingOrgName.trim() || "My Organization",
      assignedProjects: INITIAL_PROJECTS.map((p) => p.name),
    };

    // Register all invited employees as recognized user accounts
    const newTeamAccounts: UserAccount[] = onboardingEmployees.map((e) => ({
      id: `u-${e.id}`,
      name: e.name,
      email: e.email,
      role: e.role,
      organization: onboardingOrgName.trim(),
      assignedProjects: [e.assignedProject],
    }));

    setRegisteredAccounts((prev) => [...prev, newAdminAccount, ...newTeamAccounts]);
    setCurrentUser(newAdminAccount);
    setIsOnboardingModalOpen(false);
    setCurrentTab("home");
  };

  // Open review submission modal when user triggers completion
  const openReviewModal = (task: MobileTask) => {
    triggerHaptic("selection");
    setReviewTaskTarget(task);
    setCompletionNotes(task.completionNotes || "");
    setAttachedScreenshot(task.completionScreenshot || null);
    setReviewModalVisible(true);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    triggerHaptic("light");
    let targetTaskToReview: MobileTask | null = null;

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const newSubtasks = task.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const completedCount = newSubtasks.filter((s) => s.completed).length;
        const allCompleted = newSubtasks.length > 0 && completedCount === newSubtasks.length;
        const newProgress = Math.round((completedCount / newSubtasks.length) * 100);

        const updated: MobileTask = {
          ...task,
          subtasks: newSubtasks,
          progress: allCompleted ? 90 : newProgress,
          status: allCompleted ? "in_review" : "in_progress",
        };

        if (allCompleted && task.status !== "in_review" && task.status !== "completed") {
          targetTaskToReview = updated;
        }

        if (selectedTask?.id === taskId) {
          setSelectedTask(updated);
        }
        return updated;
      })
    );

    if (targetTaskToReview) {
      openReviewModal(targetTaskToReview);
    }
  };

  const handleFinalizeReviewSubmission = (includeDetails: boolean) => {
    if (!reviewTaskTarget) return;
    triggerHaptic("success");

    const notesToSave = includeDetails ? completionNotes.trim() : "";
    const screenshotToSave = includeDetails ? attachedScreenshot : null;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== reviewTaskTarget.id) return t;
        const updated: MobileTask = {
          ...t,
          status: "in_review",
          progress: 90,
          completionNotes: notesToSave || undefined,
          completionScreenshot: screenshotToSave || undefined,
          submittedAt: "Just now",
        };
        if (selectedTask?.id === t.id) setSelectedTask(updated);
        return updated;
      })
    );

    setReviewModalVisible(false);
    setReviewTaskTarget(null);
  };

  const handleManagerApprove = (taskId: string) => {
    triggerHaptic("success");
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const updated: MobileTask = {
          ...task,
          status: "completed",
          progress: 100,
          reviewedBy: `${currentUser?.name || "Manager"} (${currentUser?.role?.toUpperCase() || "PM"})`,
          reviewDate: "Just now",
        };
        if (selectedTask?.id === taskId) setSelectedTask(updated);
        return updated;
      })
    );
  };

  const handleManagerRequestChanges = (taskId: string) => {
    triggerHaptic("selection");
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const revisedSubtasks = task.subtasks.map((st, i, arr) =>
          i === arr.length - 1 ? { ...st, completed: false } : st
        );
        const comp = revisedSubtasks.filter((s) => s.completed).length;
        const newProg = Math.round((comp / revisedSubtasks.length) * 100);
        const updated: MobileTask = {
          ...task,
          subtasks: revisedSubtasks,
          progress: newProg,
          status: "in_progress",
        };
        if (selectedTask?.id === taskId) setSelectedTask(updated);
        return updated;
      })
    );
  };

  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim() || !selectedTask) return;
    triggerHaptic("light");
    const newStep = {
      id: `s-${Date.now()}`,
      title: newSubtaskInput.trim(),
      completed: false,
    };
    const updatedSubtasks = [...selectedTask.subtasks, newStep];
    const completedCount = updatedSubtasks.filter((s) => s.completed).length;
    const newProgress = Math.round((completedCount / updatedSubtasks.length) * 100);

    const updatedTask: MobileTask = {
      ...selectedTask,
      subtasks: updatedSubtasks,
      progress: newProgress,
      status: "in_progress",
    };

    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setSelectedTask(updatedTask);
    setNewSubtaskInput("");
  };

  const handlePostComment = () => {
    if (!commentInput.trim() || !selectedTask) return;
    triggerHaptic("light");
    const newComment = {
      id: `c-${Date.now()}`,
      user: currentUser ? `${currentUser.name} (${currentUser.role})` : "User",
      text: commentInput.trim(),
      time: "Just now",
    };
    setComments((prev) => ({
      ...prev,
      [selectedTask.id]: [...(prev[selectedTask.id] || []), newComment],
    }));
    setCommentInput("");
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    triggerHaptic("success");
    const newTask: MobileTask = {
      id: `t-${Date.now()}`,
      title: newTaskTitle.trim(),
      project: newTaskProject,
      category: "Design",
      priority: newTaskPriority,
      status: "in_progress",
      progress: 0,
      timeAgo: "Just now",
      subtasks: newTaskSteps.map((s, idx) => ({
        id: `ns-${Date.now()}-${idx}`,
        title: s,
        completed: false,
      })),
    };

    setTasks((prev) => [newTask, ...prev]);
    setProjects((prev) =>
      prev.map((p) =>
        p.name.toLowerCase() === newTaskProject.toLowerCase()
          ? { ...p, total: p.total + 1 }
          : p
      )
    );

    // Live Cloud Dispatch
    fetch("https://happy-fermi-kappa.vercel.app/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newTask.id,
        title: newTask.title,
        projectName: newTask.project,
        department: newTask.category,
        priority: newTask.priority,
        status: newTask.status,
        progressPercentage: newTask.progress,
        subtasks: newTask.subtasks,
      }),
    }).catch(() => {});

    setNewTaskTitle("");
    setNewTaskSteps(["Review design specs", "Prepare component tokens"]);
    setIsCreateOpen(false);
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    triggerHaptic("success");
    const newProj: MobileProject = {
      id: `p-${Date.now()}`,
      name: newProjectName.trim(),
      category: newProjectCategory,
      department: "General",
      completed: 0,
      total: 10,
      progress: 0,
      color: COLORS.primary,
      code: newProjectName.trim().slice(0, 3).toUpperCase(),
    };

    setProjects((prev) => [newProj, ...prev]);

    // Live Cloud Dispatch
    fetch("https://happy-fermi-kappa.vercel.app/api/projects", {
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

    setNewProjectName("");
    setIsCreateOpen(false);
  };

  const filteredTasks = tasks.filter((t) => {
    // If user is a member with assigned projects, filter tasks to their projects
    if (currentUser && currentUser.role !== "admin") {
      const isAssigned = currentUser.assignedProjects.some(
        (p) => p.toLowerCase() === t.project.toLowerCase()
      );
      if (!isAssigned) return false;
    }

    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (taskStatusFilter === "In Progress") return t.status === "in_progress";
    if (taskStatusFilter === "Under Review") return t.status === "in_review";
    if (taskStatusFilter === "Completed") return t.status === "completed";
    return true;
  });

  const styles = useMemo(() => getStyles(COLORS), [COLORS]);

  // RENDER STEPPER WIZARD CONTENT (Reusable for Auth Screen & In-App Modal)
  const renderOnboardingWizard = () => (
    <View style={styles.wizardContainer}>
      {/* 3-Step Header Bar */}
      <View style={styles.wizardStepperHeader}>
        <View style={[styles.wizardStepDot, onboardingStep >= 1 && styles.wizardStepDotActive]}>
          <Text style={[styles.wizardStepDotText, onboardingStep >= 1 && styles.wizardStepDotTextActive]}>1</Text>
        </View>
        <View style={[styles.wizardStepLine, onboardingStep >= 2 && styles.wizardStepLineActive]} />
        <View style={[styles.wizardStepDot, onboardingStep >= 2 && styles.wizardStepDotActive]}>
          <Text style={[styles.wizardStepDotText, onboardingStep >= 2 && styles.wizardStepDotTextActive]}>2</Text>
        </View>
        <View style={[styles.wizardStepLine, onboardingStep >= 3 && styles.wizardStepLineActive]} />
        <View style={[styles.wizardStepDot, onboardingStep >= 3 && styles.wizardStepDotActive]}>
          <Text style={[styles.wizardStepDotText, onboardingStep >= 3 && styles.wizardStepDotTextActive]}>3</Text>
        </View>
      </View>

      <View style={styles.wizardStepTitleRow}>
        <Text style={styles.wizardCurrentStepTitle}>
          {onboardingStep === 1 && "Step 1: Organization & Admin Profile"}
          {onboardingStep === 2 && "Step 2: Add Team Members & Roles"}
          {onboardingStep === 3 && "Step 3: Invitation Preview & Join Link"}
        </Text>
        <Text style={styles.wizardStepCounter}>Step {onboardingStep} of 3</Text>
      </View>

      {/* STEP 1: ADMIN & COMPANY PROFILE */}
      {onboardingStep === 1 && (
        <View style={styles.stepContentBox}>
          <Text style={styles.inputLabel}>ADMIN FULL NAME *</Text>
          <TextInput
            value={onboardAdminName}
            onChangeText={setOnboardAdminName}
            placeholder="e.g. Alex Vance"
            placeholderTextColor={COLORS.muted}
            style={styles.textInput}
          />

          <Text style={[styles.inputLabel, { marginTop: 10 }]}>ADMIN WORK EMAIL *</Text>
          <TextInput
            value={onboardAdminEmail}
            onChangeText={setOnboardAdminEmail}
            placeholder="e.g. alex@acmecorp.com"
            placeholderTextColor={COLORS.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
          />

          <Text style={[styles.inputLabel, { marginTop: 10 }]}>ORGANIZATION NAME *</Text>
          <TextInput
            value={onboardingOrgName}
            onChangeText={(val) => {
              setOnboardingOrgName(val);
              setOnboardingSlug(val.toLowerCase().replace(/[^a-z0-9]/g, "-"));
            }}
            placeholder="e.g. Acme Innovations"
            placeholderTextColor={COLORS.muted}
            style={styles.textInput}
          />

          <Text style={[styles.inputLabel, { marginTop: 10 }]}>WORKSPACE DOMAIN</Text>
          <View style={styles.slugInputRow}>
            <Text style={styles.slugPrefix}>taskpulse.io/</Text>
            <TextInput
              value={onboardingSlug}
              onChangeText={setOnboardingSlug}
              placeholder="company-slug"
              placeholderTextColor={COLORS.muted}
              autoCapitalize="none"
              style={styles.slugTextInput}
            />
          </View>

          <Text style={[styles.inputLabel, { marginTop: 10 }]}>TEAM SIZE</Text>
          <View style={styles.teamSizeRow}>
            {["1-10", "11-50", "50-250", "250+"].map((sz) => (
              <TouchableOpacity
                key={sz}
                onPress={() => {
                  triggerHaptic("selection");
                  setOnboardingTeamSize(sz);
                }}
                style={[styles.teamSizeChip, onboardingTeamSize === sz && styles.teamSizeChipActive]}
              >
                <Text style={[styles.teamSizeChipText, onboardingTeamSize === sz && styles.teamSizeChipTextActive]}>
                  {sz}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.inputLabel, { marginTop: 12 }]}>THEME PREFERENCE</Text>
          <View style={styles.themeSelectorRow}>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic("selection");
                setIsDarkMode(false);
              }}
              style={[styles.themeCard, !isDarkMode && styles.themeCardActive]}
            >
              <View style={[styles.themePreviewBox, { backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }]}>
                <SunIcon size={18} color="#F59E0B" />
                <Text style={{ fontSize: 9, color: "#002055", marginTop: 2, fontWeight: "bold" }}>Light</Text>
              </View>
              <Text style={[styles.themeCardTitle, !isDarkMode && { color: COLORS.primary, fontWeight: "bold" }]}>
                Light Mode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                triggerHaptic("selection");
                setIsDarkMode(true);
              }}
              style={[styles.themeCard, isDarkMode && styles.themeCardActive]}
            >
              <View style={[styles.themePreviewBox, { backgroundColor: "#0B0F19", borderColor: "#1E293B" }]}>
                <MoonIcon size={18} color="#818CF8" />
                <Text style={{ fontSize: 9, color: "#F8FAFC", marginTop: 2, fontWeight: "bold" }}>Dark</Text>
              </View>
              <Text style={[styles.themeCardTitle, isDarkMode && { color: COLORS.primary, fontWeight: "bold" }]}>
                Dark Mode
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              triggerHaptic("selection");
              setOnboardingStep(2);
            }}
            style={styles.wizardNextBtn}
          >
            <Text style={styles.wizardNextBtnText}>Proceed to Employee Roles →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 2: ADD EMPLOYEES ACCORDING TO ROLES */}
      {onboardingStep === 2 && (
        <View style={styles.stepContentBox}>
          <Text style={styles.stepSubtitle}>
            Add your team members and designate their role permissions:
          </Text>

          {/* Role Choice Selector */}
          <Text style={[styles.inputLabel, { marginTop: 6 }]}>SELECT ROLE</Text>
          <View style={styles.rolePickerRow}>
            {[
              { role: "manager", label: "Manager", desc: "Reviews & Approves" },
              { role: "member", label: "Member", desc: "Executes Tasks" },
              { role: "viewer", label: "Viewer", desc: "Read-only" },
            ].map((r) => (
              <TouchableOpacity
                key={r.role}
                onPress={() => {
                  triggerHaptic("selection");
                  setNewEmployeeRole(r.role as any);
                }}
                style={[styles.roleOptionCard, newEmployeeRole === r.role && styles.roleOptionCardActive]}
              >
                <Text style={[styles.roleOptionTitle, newEmployeeRole === r.role && styles.roleOptionTitleActive]}>
                  {r.label}
                </Text>
                <Text style={styles.roleOptionDesc}>{r.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Inputs for new employee */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.inputLabel}>EMPLOYEE NAME</Text>
            <TextInput
              value={newEmployeeName}
              onChangeText={setNewEmployeeName}
              placeholder="e.g. Marcus Lee"
              placeholderTextColor={COLORS.muted}
              style={styles.textInput}
            />

            <Text style={[styles.inputLabel, { marginTop: 8 }]}>WORK EMAIL *</Text>
            <TextInput
              value={newEmployeeEmail}
              onChangeText={setNewEmployeeEmail}
              placeholder="e.g. marcus@acmecorp.com"
              placeholderTextColor={COLORS.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.textInput}
            />

            <Text style={[styles.inputLabel, { marginTop: 8 }]}>INITIAL PROJECT ASSIGNMENT</Text>
            <View style={styles.projectPillRow}>
              {["Application Design", "Unity Dashboard", "Instagram Shots"].map((proj) => (
                <TouchableOpacity
                  key={proj}
                  onPress={() => {
                    triggerHaptic("selection");
                    setNewEmployeeProject(proj);
                  }}
                  style={[styles.projSelectChip, newEmployeeProject === proj && styles.projSelectChipActive]}
                >
                  <Text style={[styles.projSelectChipText, newEmployeeProject === proj && styles.projSelectChipTextActive]}>
                    {proj}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={handleAddEmployee} style={styles.addEmployeeBtn}>
              <UsersIcon size={14} color="#FFFFFF" />
              <Text style={styles.addEmployeeBtnText}>+ Add Employee to Workspace</Text>
            </TouchableOpacity>
          </View>

          {/* List of Configured Employees */}
          <Text style={[styles.inputLabel, { marginTop: 14 }]}>
            TEAM ROSTER ({onboardingEmployees.length} Added)
          </Text>
          <View style={styles.employeeListContainer}>
            {onboardingEmployees.map((emp) => (
              <View key={emp.id} style={styles.employeeCardRow}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.employeeCardName}>{emp.name}</Text>
                    <View
                      style={[
                        styles.employeeRoleTag,
                        emp.role === "manager" && { backgroundColor: "rgba(16, 185, 129, 0.15)" },
                        emp.role === "member" && { backgroundColor: "rgba(117, 110, 243, 0.15)" },
                        emp.role === "viewer" && { backgroundColor: "rgba(59, 130, 246, 0.15)" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.employeeRoleTagText,
                          emp.role === "manager" && { color: COLORS.accentGreen },
                          emp.role === "member" && { color: COLORS.primary },
                          emp.role === "viewer" && { color: COLORS.accentBlue },
                        ]}
                      >
                        {emp.role.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.employeeCardEmail}>{emp.email} • {emp.assignedProject}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic("light");
                    setOnboardingEmployees((prev) => prev.filter((e) => e.id !== emp.id));
                  }}
                  style={{ padding: 4 }}
                >
                  <XIcon size={14} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Stepper Nav Buttons */}
          <View style={styles.wizardActionRow}>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic("selection");
                setOnboardingStep(1);
              }}
              style={styles.wizardBackBtn}
            >
              <Text style={styles.wizardBackBtnText}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic("selection");
                setOnboardingStep(3);
              }}
              style={[styles.wizardNextBtn, { flex: 2 }]}
            >
              <Text style={styles.wizardNextBtnText}>Proceed to Invitations →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3: INVITATION PREVIEW & LINK SHARING */}
      {onboardingStep === 3 && (
        <View style={styles.stepContentBox}>
          {/* Realistic Email Preview Card */}
          <Text style={styles.inputLabel}>EMAIL INVITATION PREVIEW</Text>
          <View style={styles.emailPreviewCard}>
            <View style={styles.emailPreviewHeader}>
              <MailIcon size={14} color={COLORS.primary} />
              <Text style={styles.emailPreviewSender}>From: TaskPulse &lt;invites@taskpulse.io&gt;</Text>
            </View>
            <Text style={styles.emailPreviewSubject}>
              Subject: {onboardAdminName || "Admin"} has invited you to join {onboardingOrgName || "the organization"} on TaskPulse
            </Text>
            <View style={styles.emailPreviewDivider} />
            <Text style={styles.emailPreviewBody}>
              Hi there,{"\n\n"}
              You have been invited to collaborate with {onboardAdminName} on {onboardingOrgName}. Your workspace role has been assigned with personalized project access.
            </Text>

            <View style={styles.emailPreviewRosterBox}>
              <Text style={{ fontSize: 9, fontWeight: "bold", color: COLORS.muted, marginBottom: 4 }}>
                DISPATCHING TO {onboardingEmployees.length} MEMBERS:
              </Text>
              {onboardingEmployees.slice(0, 3).map((e) => (
                <Text key={e.id} style={{ fontSize: 10, color: COLORS.navy }}>
                  • {e.email} ({e.role.toUpperCase()})
                </Text>
              ))}
              {onboardingEmployees.length > 3 && (
                <Text style={{ fontSize: 9, color: COLORS.muted }}>+ {onboardingEmployees.length - 3} more</Text>
              )}
            </View>

            <View style={styles.emailMockButton}>
              <Text style={styles.emailMockButtonText}>Accept Invitation & Open App</Text>
            </View>
          </View>

          {/* Shareable Workspace Join Link */}
          <Text style={[styles.inputLabel, { marginTop: 14 }]}>SHAREABLE DIRECT JOIN LINK</Text>
          <View style={styles.shareableLinkBox}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.shareableLinkText} numberOfLines={1}>
                https://taskpulse.io/join/{onboardingSlug}?token=tk_{onboardingSlug.slice(0, 4)}_98a7
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic("success");
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2500);
              }}
              style={styles.copyLinkBtn}
            >
              <CopyIcon size={13} color="#FFFFFF" />
              <Text style={styles.copyLinkBtnText}>{linkCopied ? "Copied!" : "Copy Link"}</Text>
            </TouchableOpacity>
          </View>

          {/* Stepper Nav Buttons */}
          <View style={styles.wizardActionRow}>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic("selection");
                setOnboardingStep(2);
              }}
              style={styles.wizardBackBtn}
            >
              <Text style={styles.wizardBackBtnText}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLaunchWorkspace}
              style={[styles.launchWorkspaceBtn, { flex: 2 }]}
            >
              <Text style={styles.launchWorkspaceBtnText}>Launch Organization</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  // AUTHENTICATION & FIRST-TIME ENTRANCE VIEW (When user is not logged in)
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={COLORS.white} />
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
          {/* Header Branding */}
          <View style={styles.authHeaderBanner}>
            <View style={styles.authLogoBadge}>
              <Text style={styles.authLogoText}>TP</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.authBrandTitle}>TaskPulse</Text>
              <Text style={styles.authBrandSubtitle}>Task Synchronization & Workload Platform</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic("selection");
                setIsDarkMode((prev) => !prev);
              }}
              style={styles.authThemeToggle}
            >
              {isDarkMode ? <SunIcon size={16} color="#F59E0B" /> : <MoonIcon size={16} color={COLORS.primary} />}
            </TouchableOpacity>
          </View>

          {/* Segmented Tab: Sign In vs Sign Up (Onboarding) */}
          <View style={styles.authSegmentedRow}>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic("selection");
                setAuthTab("signin");
                setUninvitedWarning(null);
              }}
              style={[styles.authSegmentBtn, authTab === "signin" && styles.authSegmentBtnActive]}
            >
              <Text style={[styles.authSegmentText, authTab === "signin" && styles.authSegmentTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                triggerHaptic("selection");
                setAuthTab("signup");
                setOnboardingStep(1);
                setUninvitedWarning(null);
              }}
              style={[styles.authSegmentBtn, authTab === "signup" && styles.authSegmentBtnActive]}
            >
              <Text style={[styles.authSegmentText, authTab === "signup" && styles.authSegmentTextActive]}>
                Sign Up (Organization Onboarding)
              </Text>
            </TouchableOpacity>
          </View>

          {/* SIGN IN TAB */}
          {authTab === "signin" ? (
            <View style={styles.authCard}>
              <Text style={styles.authCardTitle}>Sign In to Workspace</Text>
              <Text style={styles.authCardDesc}>
                Enter your organization email to access your assigned projects and deliverables.
              </Text>

              {/* Uninvited Warning Banner */}
              {uninvitedWarning && (
                <View style={styles.uninvitedBanner}>
                  <Text style={styles.uninvitedBannerTitle}>Email Not Found in Workspace</Text>
                  <Text style={styles.uninvitedBannerBody}>
                    "{uninvitedWarning}" is not associated with an existing workspace. Would you like to set up a new organization?
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      triggerHaptic("selection");
                      setOnboardAdminEmail(uninvitedWarning);
                      setAuthTab("signup");
                      setOnboardingStep(1);
                      setUninvitedWarning(null);
                    }}
                    style={styles.uninvitedPromptBtn}
                  >
                    <Text style={styles.uninvitedPromptBtnText}>Start Organization Onboarding</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>WORK EMAIL</Text>
              <TextInput
                value={loginEmail}
                onChangeText={(t) => {
                  setLoginEmail(t);
                  if (uninvitedWarning) setUninvitedWarning(null);
                }}
                placeholder="e.g. marcus@taskpulse.io"
                placeholderTextColor={COLORS.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.textInput}
              />

              <TouchableOpacity onPress={() => handleSignIn()} style={styles.authSubmitBtn}>
                <Text style={styles.authSubmitBtnText}>Sign In</Text>
              </TouchableOpacity>

              {/* 1-Tap Quick Fill Demo Accounts */}
              <Text style={[styles.inputLabel, { marginTop: 20 }]}>QUICK DEMO ACCOUNTS (1-TAP TEST):</Text>
              <View style={styles.quickAccountsRow}>
                <TouchableOpacity
                  onPress={() => {
                    setLoginEmail("marcus@taskpulse.io");
                    handleSignIn("marcus@taskpulse.io");
                  }}
                  style={styles.quickAccountChip}
                >
                  <Text style={styles.quickAccountChipText}>Marcus (Manager)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setLoginEmail("elena@taskpulse.io");
                    handleSignIn("elena@taskpulse.io");
                  }}
                  style={styles.quickAccountChip}
                >
                  <Text style={styles.quickAccountChipText}>Elena (Member)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setLoginEmail("zevonbcash@gmail.com");
                    handleSignIn("zevonbcash@gmail.com");
                  }}
                  style={styles.quickAccountChip}
                >
                  <Text style={styles.quickAccountChipText}>Bikash (Admin)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setLoginEmail("someone.new@company.com");
                    handleSignIn("someone.new@company.com");
                  }}
                  style={[styles.quickAccountChip, { borderColor: "#EF4444" }]}
                >
                  <Text style={[styles.quickAccountChipText, { color: "#EF4444" }]}>Test Uninvited User</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* SIGN UP / ADMIN 3-STEP ONBOARDING WIZARD */
            <View style={styles.authCard}>
              {renderOnboardingWizard()}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // MAIN AUTHENTICATED APP SCREEN
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={COLORS.white} />

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            triggerHaptic("selection");
            setIsDrawerOpen(true);
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.iconCircleButton}
        >
          <GridIcon size={18} color={COLORS.navy} />
        </TouchableOpacity>

        <View style={styles.dateRow}>
          <View style={{ marginRight: 5 }}><CalendarIcon size={13} color={COLORS.primary} /></View>
          <Text style={styles.dateTitle}>Friday, 26 Sep</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {/* Dark / Light Mode Toggle Button */}
          <TouchableOpacity
            onPress={() => {
              triggerHaptic("selection");
              setIsDarkMode((prev) => !prev);
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.iconCircleButton}
            accessibilityLabel="Toggle Dark/Light Mode"
          >
            {isDarkMode ? (
              <SunIcon size={18} color="#F59E0B" />
            ) : (
              <MoonIcon size={18} color={COLORS.primary} />
            )}
          </TouchableOpacity>

          {/* Bell Notification Button */}
          <TouchableOpacity
            onPress={() => {
              triggerHaptic("selection");
              setIsNotificationsOpen(true);
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.iconCircleButton}
          >
            <BellIcon size={18} color={COLORS.navy} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HOME SCREEN */}
        {currentTab === "home" && (
          <>
            {/* Hero Greeting */}
            <View style={styles.heroSection}>
              <View>
                <View style={styles.welcomeRow}>
                  <Text style={styles.welcomeSubtitle}>Welcome back,</Text>
                  <Text style={styles.welcomeName}>{currentUser.name.split(" ")[0]}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                  <Text style={styles.heroTitle}>{currentUser.organization}</Text>
                  <View
                    style={[
                      styles.heroRoleBadge,
                      currentUser.role === "admin" && { backgroundColor: "rgba(245, 158, 11, 0.15)" },
                      currentUser.role === "manager" && { backgroundColor: "rgba(16, 185, 129, 0.15)" },
                      currentUser.role === "member" && { backgroundColor: "rgba(117, 110, 243, 0.15)" },
                      currentUser.role === "viewer" && { backgroundColor: "rgba(59, 130, 246, 0.15)" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.heroRoleBadgeText,
                        currentUser.role === "admin" && { color: "#D97706" },
                        currentUser.role === "manager" && { color: COLORS.accentGreen },
                        currentUser.role === "member" && { color: COLORS.primary },
                        currentUser.role === "viewer" && { color: COLORS.accentBlue },
                      ]}
                    >
                      {currentUser.role.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("selection");
                  setCurrentTab("profile");
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image source={BIKASH_AVATAR} style={styles.heroAvatar} />
              </TouchableOpacity>
            </View>

            {/* Quick Search */}
            <View style={styles.searchBar}>
              <View style={{ marginRight: 8 }}><SearchIcon size={16} color={COLORS.muted} /></View>
              <TextInput
                placeholder="Search tasks, workstreams..."
                placeholderTextColor={COLORS.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic("light");
                    setSearchQuery("");
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <XIcon size={16} color={COLORS.muted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Featured Hero Banner */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                triggerHaptic("selection");
                if (projects.length > 0) {
                  setSelectedProjectView(projects[0]);
                }
                setCurrentTab("projects");
              }}
              style={styles.bannerCard}
            >
              <View style={styles.bannerHeader}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(255, 255, 255, 0.2)", alignItems: "center", justifyContent: "center" }}>
                    <FolderIcon size={16} color="#FFFFFF" />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.bannerTitle}>{projects[0]?.name || "Application Design"}</Text>
                    <Text style={styles.bannerSubtitle}>UI Design Kit & Task Pulse</Text>
                  </View>
                </View>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>Featured</Text>
                </View>
              </View>

              <View style={styles.bannerFooter}>
                <View style={styles.avatarStack}>
                  <View style={[styles.miniAvatar, { backgroundColor: "#6366F1", zIndex: 4 }]}><Text style={styles.miniAvatarText}>M</Text></View>
                  <View style={[styles.miniAvatar, { backgroundColor: "#EC4899", zIndex: 3, marginLeft: -8 }]}><Text style={styles.miniAvatarText}>E</Text></View>
                  <View style={[styles.miniAvatar, { backgroundColor: "#10B981", zIndex: 2, marginLeft: -8 }]}><Text style={styles.miniAvatarText}>S</Text></View>
                  <View style={[styles.miniAvatarPlus, { zIndex: 1, marginLeft: -8 }]}><Text style={styles.miniAvatarPlusText}>+5</Text></View>
                </View>

                <View style={{ flex: 1, marginLeft: 20 }}>
                  <View style={styles.progressLabelRow}>
                    <Text style={styles.progressLabel}>Progress</Text>
                    <Text style={styles.progressRatio}>50/80</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: "62%" }]} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Interactive Calendar Date Strip */}
            <View style={styles.calendarSection}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarMonth}>September 2026</Text>
                <Text style={styles.calendarToday}>Today</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
                {DAYS.map((d) => {
                  const isSelected = selectedDay === d.date;
                  return (
                    <TouchableOpacity
                      key={d.date}
                      onPress={() => {
                        triggerHaptic("selection");
                        setSelectedDay(d.date);
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                      style={[
                        styles.dayCard,
                        isSelected ? styles.dayCardActive : styles.dayCardInactive,
                      ]}
                    >
                      <Text style={[styles.dayDate, isSelected && styles.dayDateActive]}>
                        {d.date}
                      </Text>
                      <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>
                        {d.day}
                      </Text>
                      {d.isToday && !isSelected && <View style={styles.todayDot} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Status Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {["All", "In Progress", "Under Review", "Completed"].map((filter) => {
                const isActive = taskStatusFilter === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => {
                      triggerHaptic("selection");
                      setTaskStatusFilter(filter);
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                    style={[styles.filterChip, isActive && styles.filterChipActive]}
                  >
                    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Task Section Header */}
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.sectionTitle}>Tasks</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{filteredTasks.length}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("selection");
                  setCreateType("task");
                  setIsCreateOpen(true);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <View style={{ marginRight: 2 }}><PlusIcon size={14} color={COLORS.primary} /></View>
                <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: "bold" }}>Add</Text>
              </TouchableOpacity>
            </View>

            {/* Task Cards */}
            {filteredTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => {
                  triggerHaptic("selection");
                  setSelectedTask(task);
                  setCurrentTab("details");
                }}
                activeOpacity={0.85}
                style={styles.taskCard}
              >
                <View style={styles.taskCardBody}>
                  <View style={styles.taskBadgeRow}>
                    <View style={styles.projectTagPill}>
                      <Text style={styles.projectTagText}>{task.project}</Text>
                    </View>
                    {task.status === "in_review" && (
                      <View style={styles.underReviewPill}>
                        <Text style={styles.underReviewPillText}>Under Review</Text>
                      </View>
                    )}
                    {task.priority === "critical" && <View style={[styles.priorityDot, { backgroundColor: "#EF4444" }]} />}
                    {task.priority === "high" && <View style={[styles.priorityDot, { backgroundColor: "#F59E0B" }]} />}
                  </View>

                  <Text style={styles.taskTitle}>{task.title}</Text>

                  {/* If task is Under Review with submitted notes */}
                  {task.status === "in_review" && task.completionNotes && (
                    <View style={styles.reviewSnippetBox}>
                      <Text style={styles.reviewSnippetLabel}>Changes Submitted:</Text>
                      <Text style={styles.reviewSnippetText} numberOfLines={2}>
                        "{task.completionNotes}"
                      </Text>
                    </View>
                  )}

                  {/* If task has attached screenshot */}
                  {task.status === "in_review" && task.completionScreenshot && (
                    <View style={styles.screenshotBadgeRow}>
                      <ImageIcon size={14} color={COLORS.primary} />
                      <Text style={styles.screenshotBadgeText}>1 Screenshot Attached</Text>
                    </View>
                  )}

                  <View style={styles.taskFooter}>
                    <View style={{ marginRight: 4 }}><ClockIcon size={12} color={COLORS.muted} /></View>
                    <Text style={styles.taskTime}>{task.timeAgo}</Text>
                    <Text style={styles.taskDot}>•</Text>
                    <Text style={styles.taskSubtaskCount}>
                      {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} steps
                    </Text>
                  </View>
                </View>

                {/* Progress / Completion / Review Action */}
                <View style={styles.circleProgressWrap}>
                  {task.status === "in_review" ? (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleManagerApprove(task.id);
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.quickApproveBtn}
                    >
                      <CheckIcon size={12} color="#FFFFFF" strokeWidth={3} />
                      <Text style={styles.quickApproveText}>Approve</Text>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={[
                        styles.circleProgressRing,
                        task.progress === 100 && { borderColor: "#10B981" },
                      ]}
                    >
                      <Text style={styles.circleProgressText}>{task.progress}%</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* PROJECTS SCREEN */}
        {currentTab === "projects" && selectedProjectView ? (
          <View style={styles.projectsContainer}>
            {/* Project Details Header */}
            <View style={styles.projectDetailTopBar}>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("selection");
                  setSelectedProjectView(null);
                }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.backButton}
              >
                <ArrowLeftIcon size={20} color={COLORS.navy} />
              </TouchableOpacity>
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text style={styles.detailsHeaderTitle} numberOfLines={1}>
                  {selectedProjectView.name}
                </Text>
                <Text style={styles.projectCategory}>
                  {selectedProjectView.department} • {selectedProjectView.category}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("selection");
                  setNewTaskProject(selectedProjectView.name);
                  setCreateType("task");
                  setIsCreateOpen(true);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.newProjectButton}
              >
                <View style={{ marginRight: 4 }}>
                  <PlusIcon size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.newProjectButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>

            {/* Project Progress Card */}
            <View style={styles.projectDetailHeroCard}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={[styles.projectCodeBadge, { backgroundColor: selectedProjectView.color + "25" }]}>
                    <Text style={[styles.projectCodeBadgeText, { color: selectedProjectView.color }]}>
                      {selectedProjectView.code}
                    </Text>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.projectName}>{selectedProjectView.name}</Text>
                    <Text style={styles.projectCategory}>{selectedProjectView.category}</Text>
                  </View>
                </View>
                <View style={styles.taskPillBadge}>
                  <Text style={styles.taskPillBadgeText}>
                    {tasks.filter((t) => t.project.toLowerCase() === selectedProjectView.name.toLowerCase() && t.status === "completed").length}/
                    {tasks.filter((t) => t.project.toLowerCase() === selectedProjectView.name.toLowerCase()).length} tasks
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 14 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={styles.progressRatio}>Project Completion</Text>
                  <Text style={[styles.projectProgressPercent, { marginLeft: 0 }]}>
                    {selectedProjectView.progress}%
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${selectedProjectView.progress}%`, backgroundColor: selectedProjectView.color },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Status Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {["All", "In Progress", "In Review", "Completed"].map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => {
                    triggerHaptic("selection");
                    setProjectTaskFilter(status);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                  style={[styles.filterChip, projectTaskFilter === status && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, projectTaskFilter === status && styles.filterChipTextActive]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Tasks inside this project */}
            {(() => {
              const projTasks = tasks.filter((t) => {
                const matchesProj = t.project.toLowerCase() === selectedProjectView.name.toLowerCase();
                if (!matchesProj) return false;
                if (projectTaskFilter === "In Progress") return t.status === "in_progress";
                if (projectTaskFilter === "In Review") return t.status === "in_review";
                if (projectTaskFilter === "Completed") return t.status === "completed";
                return true;
              });

              if (projTasks.length === 0) {
                return (
                  <View style={styles.emptyProjectContainer}>
                    <FolderIcon size={36} color={COLORS.muted} />
                    <Text style={styles.emptyProjectTitle}>No tasks found in this project</Text>
                    <Text style={styles.emptyProjectSubtitle}>
                      Get started by adding the first task to {selectedProjectView.name}.
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        triggerHaptic("selection");
                        setNewTaskProject(selectedProjectView.name);
                        setCreateType("task");
                        setIsCreateOpen(true);
                      }}
                      style={styles.emptyProjectBtn}
                    >
                      <PlusIcon size={14} color="#FFFFFF" />
                      <Text style={styles.emptyProjectBtnText}>Create Task</Text>
                    </TouchableOpacity>
                  </View>
                );
              }

              return projTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  activeOpacity={0.85}
                  onPress={() => {
                    triggerHaptic("selection");
                    setSelectedTask(task);
                    setCurrentTab("details");
                  }}
                  style={styles.taskCard}
                >
                  <View style={styles.taskCardBody}>
                    <View style={styles.taskBadgeRow}>
                      <View style={styles.projectTagPill}>
                        <Text style={styles.projectTagText}>{task.project}</Text>
                      </View>
                      {task.status === "in_review" && (
                        <View style={styles.underReviewPill}>
                          <Text style={styles.underReviewPillText}>Under Review</Text>
                        </View>
                      )}
                      {task.priority === "critical" && <View style={[styles.priorityDot, { backgroundColor: "#EF4444" }]} />}
                      {task.priority === "high" && <View style={[styles.priorityDot, { backgroundColor: "#F59E0B" }]} />}
                    </View>

                    <Text style={styles.taskTitle}>{task.title}</Text>

                    <View style={styles.taskFooter}>
                      <View style={{ marginRight: 4 }}><ClockIcon size={12} color={COLORS.muted} /></View>
                      <Text style={styles.taskTime}>{task.timeAgo}</Text>
                      <Text style={styles.taskDot}>•</Text>
                      <Text style={styles.taskSubtaskCount}>
                        {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} steps
                      </Text>
                    </View>
                  </View>

                  <View style={styles.circleProgressWrap}>
                    <View
                      style={[
                        styles.circleProgressRing,
                        task.status === "completed" && { borderColor: COLORS.accentGreen },
                        task.status === "in_review" && { borderColor: COLORS.accentYellow },
                      ]}
                    >
                      <Text style={styles.circleProgressText}>{task.progress}%</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ));
            })()}
          </View>
        ) : currentTab === "projects" && (
          <View style={styles.projectsContainer}>
            <View style={styles.projectsHeaderRow}>
              <View>
                <Text style={styles.projectsHeaderTitle}>Projects</Text>
                <Text style={styles.projectsHeaderSubtitle}>{projects.length} Active Workstreams</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("selection");
                  setCreateType("project");
                  setIsCreateOpen(true);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.newProjectButton}
              >
                <View style={{ marginRight: 4 }}><PlusIcon size={14} color="#FFFFFF" /></View>
                <Text style={styles.newProjectButtonText}>New</Text>
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchBar}>
              <View style={{ marginRight: 8 }}><SearchIcon size={16} color={COLORS.muted} /></View>
              <TextInput
                placeholder="Search projects..."
                placeholderTextColor={COLORS.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
            </View>

            {/* Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {["All", "Design", "Marketing", "Engineering", "Product"].map((dep) => (
                <TouchableOpacity
                  key={dep}
                  onPress={() => {
                    triggerHaptic("selection");
                    setProjectFilter(dep);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                  style={[styles.filterChip, projectFilter === dep && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, projectFilter === dep && styles.filterChipTextActive]}>
                    {dep}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Interactive Projects List */}
            {projects
              .filter((p) => {
                const matchesDept = projectFilter === "All" || p.department.toLowerCase() === projectFilter.toLowerCase();
                const matchesSearch =
                  p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.category.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesDept && matchesSearch;
              })
              .map((proj) => {
                const projTasks = tasks.filter((t) => t.project.toLowerCase() === proj.name.toLowerCase());
                const completedTasks = projTasks.filter((t) => t.status === "completed");
                const taskCountText =
                  projTasks.length > 0
                    ? `${completedTasks.length}/${projTasks.length} tasks`
                    : `${proj.completed}/${proj.total} tasks`;

                return (
                  <TouchableOpacity
                    key={proj.id}
                    activeOpacity={0.8}
                    onPress={() => {
                      triggerHaptic("selection");
                      setSelectedProjectView(proj);
                    }}
                    style={styles.projectCard}
                  >
                    <View style={styles.projectCardHeader}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={[styles.projectCodeBadge, { backgroundColor: proj.color + "25" }]}>
                          <Text style={[styles.projectCodeBadgeText, { color: proj.color }]}>{proj.code}</Text>
                        </View>
                        <View style={{ marginLeft: 10 }}>
                          <Text style={styles.projectName}>{proj.name}</Text>
                          <Text style={styles.projectCategory}>{proj.category}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={styles.taskPillBadge}>
                          <Text style={styles.taskPillBadgeText}>{taskCountText}</Text>
                        </View>
                        <View style={{ marginLeft: 6 }}>
                          <ChevronRightIcon size={14} color={COLORS.muted} />
                        </View>
                      </View>
                    </View>

                    <View style={styles.projectProgressWrap}>
                      <View style={styles.avatarStack}>
                        <View style={[styles.miniAvatar, { backgroundColor: "#6366F1", zIndex: 2 }]}>
                          <Text style={styles.miniAvatarText}>B</Text>
                        </View>
                        <View style={[styles.miniAvatar, { backgroundColor: "#EC4899", zIndex: 1, marginLeft: -8 }]}>
                          <Text style={styles.miniAvatarText}>E</Text>
                        </View>
                      </View>
                      <View style={{ flex: 1, marginLeft: 14 }}>
                        <View style={styles.progressBarBg}>
                          <View
                            style={[
                              styles.progressBarFill,
                              { width: `${proj.progress}%`, backgroundColor: proj.color },
                            ]}
                          />
                        </View>
                      </View>
                      <Text style={styles.projectProgressPercent}>{proj.progress}%</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        )}

        {/* TASK DETAILS SCREEN */}
        {currentTab === "details" && selectedTask && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailsHeaderRow}>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("selection");
                  setCurrentTab("home");
                }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.backButton}
              >
                <ArrowLeftIcon size={16} color={COLORS.navy} />
              </TouchableOpacity>
              <Text style={styles.detailsHeaderTitle}>Task Details</Text>
              <TouchableOpacity
                onPress={() => openReviewModal(selectedTask)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.submitReviewHeaderBtn}
              >
                <Text style={styles.submitReviewHeaderBtnText}>Review</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailsCard}>
              <View style={styles.detailsBadgeRow}>
                <View style={styles.projectTagPill}><Text style={styles.projectTagText}>{selectedTask.project}</Text></View>
                <View style={[styles.priorityPill, { backgroundColor: selectedTask.priority === "critical" ? "#FEE2E2" : "#FEF3C7" }]}>
                  <Text style={[styles.priorityPillText, { color: selectedTask.priority === "critical" ? "#DC2626" : "#D97706" }]}>
                    {selectedTask.priority.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.detailsTaskTitle}>{selectedTask.title}</Text>

              {/* Status Banner */}
              {selectedTask.status === "in_review" && (
                <View style={styles.underReviewBanner}>
                  <View style={styles.reviewBannerTop}>
                    <Text style={styles.reviewBannerTitle}>⏳ Submitted for Project Manager Review</Text>
                    <Text style={styles.reviewBannerTime}>{selectedTask.submittedAt || "Recently"}</Text>
                  </View>

                  {/* Changes Logged */}
                  <View style={styles.reviewNotesBox}>
                    <Text style={styles.reviewNotesTitle}>Changes Made by Assignee:</Text>
                    <Text style={styles.reviewNotesContent}>
                      {selectedTask.completionNotes || "All steps completed. Ready for manager sign-off."}
                    </Text>
                  </View>

                  {/* Attached Screenshot */}
                  {selectedTask.completionScreenshot && (
                    <View style={styles.screenshotSection}>
                      <Text style={styles.screenshotSectionTitle}>Attached Verification Screenshot:</Text>
                      <TouchableOpacity
                        onPress={() => setViewingScreenshot(selectedTask.completionScreenshot || null)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={styles.screenshotThumbnailWrap}
                      >
                        <Image source={{ uri: selectedTask.completionScreenshot }} style={styles.screenshotThumbnail} />
                        <View style={styles.screenshotZoomBadge}>
                          <Text style={styles.screenshotZoomBadgeText}>Tap to Enlarge</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Project Manager Action Buttons */}
                  <View style={styles.managerActionRow}>
                    <TouchableOpacity
                      onPress={() => handleManagerApprove(selectedTask.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.managerApproveBtn}
                    >
                      <CheckIcon size={14} color="#FFFFFF" strokeWidth={3} />
                      <Text style={styles.managerApproveBtnText}>Approve & Complete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleManagerRequestChanges(selectedTask.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.managerRejectBtn}
                    >
                      <Text style={styles.managerRejectBtnText}>Request Changes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {selectedTask.status === "completed" && (
                <View style={styles.completedBanner}>
                  <View style={styles.completedCheckCircle}>
                    <CheckIcon size={14} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <View>
                    <Text style={styles.completedBannerTitle}>Verified & Completed</Text>
                    <Text style={styles.completedBannerSubtitle}>
                      Approved by {selectedTask.reviewedBy || "Project Manager"}
                    </Text>
                  </View>
                </View>
              )}

              {/* Progress Dial & Ratio */}
              <View style={styles.detailsProgressCard}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={styles.detailsProgressLabel}>Progress</Text>
                  <Text style={styles.detailsProgressPercent}>{selectedTask.progress}%</Text>
                </View>
                <View style={styles.detailsProgressBarBg}>
                  <View style={[styles.detailsProgressBarFill, { width: `${selectedTask.progress}%` }]} />
                </View>
              </View>

              {/* Checklist / Subtasks */}
              <View style={{ marginTop: 16 }}>
                <Text style={styles.checklistTitle}>Task Steps ({selectedTask.subtasks.filter((s) => s.completed).length}/{selectedTask.subtasks.length})</Text>
                <View style={styles.checklistCard}>
                  {selectedTask.subtasks.map((step) => (
                    <TouchableOpacity
                      key={step.id}
                      onPress={() => toggleSubtask(selectedTask.id, step.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
                      style={styles.checklistItem}
                    >
                      <View style={[styles.checkbox, step.completed && styles.checkboxActive]}>
                        {step.completed && <CheckIcon size={11} color="#FFFFFF" strokeWidth={3} />}
                      </View>
                      <Text style={[styles.checklistItemText, step.completed && styles.checklistItemTextDone]}>
                        {step.title}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* Add Step Input */}
                  <View style={styles.addStepRow}>
                    <TextInput
                      placeholder="Add another step..."
                      placeholderTextColor={COLORS.muted}
                      value={newSubtaskInput}
                      onChangeText={setNewSubtaskInput}
                      style={styles.addStepInput}
                    />
                    <TouchableOpacity onPress={handleAddSubtask} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.addStepBtn}>
                      <Text style={styles.addStepBtnText}>+ Step</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Submit for Review Action Button if In Progress */}
              {selectedTask.status === "in_progress" && (
                <TouchableOpacity
                  onPress={() => openReviewModal(selectedTask)}
                  style={styles.submitReviewBigBtn}
                >
                  <Text style={styles.submitReviewBigBtnText}>Submit Task for Manager Review</Text>
                </TouchableOpacity>
              )}

              {/* Comments & Activity Stream */}
              <View style={{ marginTop: 18 }}>
                <Text style={styles.checklistTitle}>Activity & Discussion</Text>
                {(comments[selectedTask.id] || []).map((c) => (
                  <View key={c.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentUser}>{c.user}</Text>
                      <Text style={styles.commentTime}>{c.time}</Text>
                    </View>
                    <Text style={styles.commentBody}>{c.text}</Text>
                  </View>
                ))}

                <View style={styles.commentInputRow}>
                  <TextInput
                    placeholder="Write a message or update..."
                    placeholderTextColor={COLORS.muted}
                    value={commentInput}
                    onChangeText={setCommentInput}
                    style={styles.commentTextInput}
                  />
                  <TouchableOpacity onPress={handlePostComment} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.sendCommentBtn}>
                    <SendIcon size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* PROFILE SCREEN */}
        {currentTab === "profile" && (
          <View style={styles.profileContainer}>
            {/* User Profile Card */}
            <View style={styles.profileHeroCard}>
              <View style={styles.profileAvatarWrap}>
                <Image source={BIKASH_AVATAR} style={styles.profileAvatar} />
                <View style={styles.profileOnlineDot} />
              </View>

              <Text style={styles.profileName}>{currentUser.name}</Text>
              <View style={styles.profileRoleBadge}>
                <Text style={styles.profileRoleBadgeText}>
                  {currentUser.role === "admin" && "Permanent Super Admin"}
                  {currentUser.role === "manager" && "Project Manager"}
                  {currentUser.role === "member" && "Team Member / Contributor"}
                  {currentUser.role === "viewer" && "Stakeholder / Viewer"}
                </Text>
              </View>
              <Text style={styles.profileEmail}>{currentUser.email}</Text>

              <View style={styles.profileStatsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>18</Text>
                  <Text style={styles.statLabel}>Done</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{currentUser.assignedProjects.length}</Text>
                  <Text style={styles.statLabel}>Projects</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={[styles.statNumber, { color: COLORS.primary }]}>98%</Text>
                  <Text style={styles.statLabel}>Velocity</Text>
                </View>
              </View>
            </View>

            {/* Quick Action: Workspace Settings & Team Management (Admin Only) */}
            {currentUser.role === "admin" && (
              <View style={styles.quickActionCard}>
                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic("selection");
                    setOnboardingStep(2);
                    setIsOnboardingModalOpen(true);
                  }}
                  style={styles.onboardingBannerBtn}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={styles.onboardingIconBox}>
                      <BuildingIcon size={16} color="#FFFFFF" />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.onboardingBannerTitle}>Workspace Settings</Text>
                      <Text style={styles.onboardingBannerSub}>Manage roles, team members & join link</Text>
                    </View>
                  </View>
                  <ChevronRightIcon size={16} color={COLORS.muted} />
                </TouchableOpacity>
              </View>
            )}

            {/* Weekly Output Chart */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Weekly Output</Text>
                <Text style={styles.chartBadge}>32 tasks</Text>
              </View>
              <View style={styles.barChartRow}>
                {[
                  { d: "M", v: 60 },
                  { d: "T", v: 75 },
                  { d: "W", v: 45 },
                  { d: "T", v: 80 },
                  { d: "F", v: 100, active: true },
                  { d: "S", v: 30 },
                  { d: "S", v: 50 },
                ].map((bar, idx) => (
                  <View key={idx} style={styles.barCol}>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { height: `${bar.v}%`, backgroundColor: bar.active ? COLORS.primary : COLORS.primaryLight }]} />
                    </View>
                    <Text style={[styles.barDayText, bar.active && { fontWeight: "bold", color: COLORS.primary }]}>{bar.d}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Appearance & System Settings */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsHeaderTitle}>Preferences & System</Text>
              <View style={styles.settingRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ marginRight: 8 }}>
                    {isDarkMode ? <SunIcon size={18} color="#F59E0B" /> : <MoonIcon size={18} color={COLORS.primary} />}
                  </View>
                  <Text style={styles.settingLabel}>Dark Theme Mode</Text>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={(v) => {
                    triggerHaptic("selection");
                    setIsDarkMode(v);
                  }}
                  trackColor={{ false: "#CBD5E1", true: COLORS.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Responsive Haptic Feedback</Text>
                <Switch
                  value={true}
                  onValueChange={() => triggerHaptic("light")}
                  trackColor={{ false: "#CBD5E1", true: COLORS.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Switch
                  value={pushEnabled}
                  onValueChange={(v) => {
                    triggerHaptic("light");
                    setPushEnabled(v);
                  }}
                  trackColor={{ false: "#CBD5E1", true: COLORS.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Log Out / Switch Account Button */}
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("selection");
                  setCurrentUser(null);
                  setAuthTab("signin");
                }}
                style={styles.logoutBtn}
              >
                <Text style={styles.logoutBtnText}>Switch Account / Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Taskcy Bottom Navigation Dock with Generous Touch Diameter */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => {
            triggerHaptic("selection");
            setCurrentTab("home");
          }}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={[styles.navItem, currentTab === "home" && styles.navItemActive]}
        >
          <HomeIcon size={22} color={currentTab === "home" ? COLORS.primary : COLORS.muted} />
          <Text style={[styles.navText, currentTab === "home" && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            triggerHaptic("selection");
            setCurrentTab("projects");
          }}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={[styles.navItem, currentTab === "projects" && styles.navItemActive]}
        >
          <FolderIcon size={22} color={currentTab === "projects" ? COLORS.primary : COLORS.muted} />
          <Text style={[styles.navText, currentTab === "projects" && styles.navTextActive]}>Projects</Text>
        </TouchableOpacity>

        {/* Center Floating + Button */}
        <View style={styles.centerAddButtonContainer}>
          <TouchableOpacity
            onPress={() => {
              triggerHaptic("selection");
              setCreateType("task");
              setIsCreateOpen(true);
            }}
            hitSlop={{ top: 18, bottom: 18, left: 18, right: 18 }}
            style={styles.centerAddButton}
          >
            <PlusIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            triggerHaptic("selection");
            setCurrentTab("profile");
          }}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={[styles.navItem, currentTab === "profile" && styles.navItemActive]}
        >
          <UserIcon size={22} color={currentTab === "profile" ? COLORS.primary : COLORS.muted} />
          <Text style={[styles.navText, currentTab === "profile" && styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL 1: TASK REVIEW SUBMISSION (Notes + Optional Screenshot) */}
      <Modal visible={reviewModalVisible} animationType="slide" transparent onRequestClose={() => setReviewModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalSheetTitle}>Submit Task for Review</Text>
                <Text style={styles.modalSheetSubtitle}>Share updates & proof for the project manager</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("light");
                  setReviewModalVisible(false);
                }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.modalCloseBtn}
              >
                <XIcon size={18} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            {reviewTaskTarget && (
              <View style={styles.reviewTargetBanner}>
                <Text style={styles.reviewTargetProject}>{reviewTaskTarget.project}</Text>
                <Text style={styles.reviewTargetTitle}>{reviewTaskTarget.title}</Text>
              </View>
            )}

            {/* Changes Made Text Area */}
            <View style={{ marginTop: 12 }}>
              <Text style={styles.inputLabel}>WHAT CHANGES DID YOU MAKE? (OPTIONAL)</Text>
              <TextInput
                placeholder="e.g. Completed layout styling, verified responsive breakpoints, attached device verification."
                placeholderTextColor={COLORS.muted}
                value={completionNotes}
                onChangeText={setCompletionNotes}
                multiline
                numberOfLines={3}
                style={styles.reviewTextInput}
              />
            </View>

            {/* Screenshot Attachment */}
            <View style={{ marginTop: 12 }}>
              <Text style={styles.inputLabel}>ATTACH SCREENSHOT / PROOF (OPTIONAL)</Text>
              {attachedScreenshot ? (
                <View style={styles.attachedScreenshotCard}>
                  <Image source={{ uri: attachedScreenshot }} style={styles.attachedThumbnail} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.attachedTitle}>Verification Screenshot</Text>
                    <Text style={styles.attachedSub}>Ready to send with task</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      triggerHaptic("light");
                      setAttachedScreenshot(null);
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={styles.removeScreenshotBtn}
                  >
                    <XIcon size={14} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic("selection");
                    setAttachedScreenshot(SAMPLE_SCREENSHOT_URI);
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.attachScreenshotBtn}
                >
                  <UploadIcon size={16} color={COLORS.primary} />
                  <Text style={styles.attachScreenshotBtnText}>Attach Device Screenshot</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.reviewModalActions}>
              <TouchableOpacity
                onPress={() => handleFinalizeReviewSubmission(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.skipSubmitBtn}
              >
                <Text style={styles.skipSubmitBtnText}>Skip & Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleFinalizeReviewSubmission(true)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.submitReviewConfirmBtn}
              >
                <Text style={styles.submitReviewConfirmBtnText}>Submit for Verification</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: FULL-SCREEN SCREENSHOT VIEWER */}
      <Modal visible={!!viewingScreenshot} animationType="fade" transparent onRequestClose={() => setViewingScreenshot(null)}>
        <View style={styles.fullScreenImageViewer}>
          <View style={styles.fullScreenImageHeader}>
            <Text style={styles.fullScreenImageTitle}>Task Verification Screenshot</Text>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic("light");
                setViewingScreenshot(null);
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.fullScreenCloseBtn}
            >
              <XIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {viewingScreenshot && (
            <Image source={{ uri: viewingScreenshot }} style={styles.fullScreenImage} resizeMode="contain" />
          )}
        </View>
      </Modal>

      {/* MODAL 3: IN-APP ORGANIZATION ONBOARDING WIZARD */}
      <Modal visible={isOnboardingModalOpen} animationType="slide" transparent onRequestClose={() => setIsOnboardingModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: "90%" }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalSheetTitle}>
                  {currentUser?.role === "admin" ? "Workspace Settings" : "Organization Onboarding"}
                </Text>
                <Text style={styles.modalSheetSubtitle}>
                  {currentUser?.role === "admin" ? "Team roles, member access & share link" : "Workspace setup, roles & team links"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("light");
                  setIsOnboardingModalOpen(false);
                }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.modalCloseBtn}
              >
                <XIcon size={18} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 6 }}>
              {renderOnboardingWizard()}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* CREATE MODAL (New Task / New Project) */}
      <Modal visible={isCreateOpen} animationType="slide" transparent onRequestClose={() => setIsCreateOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic("selection");
                    setCreateType("task");
                  }}
                  style={[styles.modalTab, createType === "task" && styles.modalTabActive]}
                >
                  <Text style={[styles.modalTabText, createType === "task" && styles.modalTabTextActive]}>
                    New Task
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic("selection");
                    setCreateType("project");
                  }}
                  style={[styles.modalTab, createType === "project" && styles.modalTabActive]}
                >
                  <Text style={[styles.modalTabText, createType === "project" && styles.modalTabTextActive]}>
                    New Project
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("light");
                  setIsCreateOpen(false);
                }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.modalCloseBtn}
              >
                <XIcon size={18} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            {createType === "task" ? (
              <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>TASK TITLE</Text>
                <TextInput
                  placeholder="e.g. Design Onboarding Screens"
                  placeholderTextColor={COLORS.muted}
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  style={styles.textInput}
                />

                <Text style={[styles.inputLabel, { marginTop: 10 }]}>ASSIGN TO PROJECT</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row", gap: 6, marginVertical: 6 }}>
                  {projects.map((p) => {
                    const isSelected = newTaskProject.toLowerCase() === p.name.toLowerCase();
                    return (
                      <TouchableOpacity
                        key={p.id}
                        onPress={() => {
                          triggerHaptic("selection");
                          setNewTaskProject(p.name);
                        }}
                        style={[
                          styles.filterChip,
                          isSelected && styles.filterChipActive,
                          { paddingHorizontal: 12, paddingVertical: 6 },
                        ]}
                      >
                        <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                          {p.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <Text style={[styles.inputLabel, { marginTop: 10 }]}>SUBTASKS / CHECKLIST</Text>
                {newTaskSteps.map((step, idx) => (
                  <View key={idx} style={styles.stepItemRow}>
                    <Text style={styles.stepItemText}>{step}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        triggerHaptic("light");
                        setNewTaskSteps((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <XIcon size={14} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}

                <View style={styles.stepInputRow}>
                  <TextInput
                    placeholder="Add step..."
                    placeholderTextColor={COLORS.muted}
                    value={stepDraft}
                    onChangeText={setStepDraft}
                    style={styles.stepTextInput}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (!stepDraft.trim()) return;
                      triggerHaptic("light");
                      setNewTaskSteps((prev) => [...prev, stepDraft.trim()]);
                      setStepDraft("");
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.addStepButton}
                  >
                    <Text style={styles.addStepButtonText}>+ Step</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleCreateTask} style={styles.createTaskButton}>
                  <Text style={styles.createTaskButtonText}>Create Task</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>PROJECT NAME</Text>
                <TextInput
                  placeholder="e.g. Marketing Revamp"
                  placeholderTextColor={COLORS.muted}
                  value={newProjectName}
                  onChangeText={setNewProjectName}
                  style={styles.textInput}
                />
                <TouchableOpacity onPress={handleCreateProject} style={styles.createTaskButton}>
                  <Text style={styles.createTaskButtonText}>Create Project</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* NOTIFICATIONS MODAL */}
      <Modal visible={isNotificationsOpen} animationType="fade" transparent onRequestClose={() => setIsNotificationsOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.notifSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.notifHeaderTitle}>Notifications</Text>
              <TouchableOpacity
                onPress={() => setIsNotificationsOpen(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <XIcon size={18} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
            <View style={styles.notifCard}>
              <Text style={styles.notifTitle}>Task Ready for Review</Text>
              <Text style={styles.notifTime}>Revision Home Page was submitted for approval.</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* DRAWER MENU MODAL */}
      <Modal visible={isDrawerOpen} animationType="slide" transparent onRequestClose={() => setIsDrawerOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.drawerSheet}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.orgLogo}><Text style={styles.orgLogoText}>TP</Text></View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold", color: COLORS.navy }}>{currentUser.organization}</Text>
                  <Text style={{ fontSize: 10, color: COLORS.muted }}>{currentUser.email}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setIsDrawerOpen(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <XIcon size={18} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            {/* Workspace Settings (Admin Only) */}
            {currentUser.role === "admin" && (
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("selection");
                  setIsDrawerOpen(false);
                  setOnboardingStep(2);
                  setIsOnboardingModalOpen(true);
                }}
                style={styles.drawerLink}
              >
                <BuildingIcon size={16} color={COLORS.primary} />
                <Text style={styles.drawerLinkText}>Workspace Settings</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                setIsDrawerOpen(false);
                setIsDarkMode((prev) => !prev);
              }}
              style={styles.drawerLink}
            >
              {isDarkMode ? <SunIcon size={16} color="#F59E0B" /> : <MoonIcon size={16} color={COLORS.primary} />}
              <Text style={styles.drawerLinkText}>Toggle Theme ({isDarkMode ? "Dark" : "Light"})</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsDrawerOpen(false);
                setCurrentUser(null);
                setAuthTab("signin");
              }}
              style={styles.drawerLink}
            >
              <Text style={[styles.drawerLinkText, { color: "#EF4444", marginLeft: 0 }]}>Log Out / Switch User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (COLORS: typeof LIGHT_COLORS) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    scrollContent: {
      paddingBottom: 110,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: COLORS.white,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    iconCircleButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.card,
    },
    notificationDot: {
      position: "absolute",
      top: 6,
      right: 8,
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: COLORS.accentPink,
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    dateTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    heroSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 10,
    },
    welcomeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    welcomeSubtitle: {
      fontSize: 12,
      color: COLORS.muted,
    },
    welcomeName: {
      fontSize: 12,
      fontWeight: "bold",
      color: COLORS.primary,
      marginLeft: 4,
    },
    heroTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: COLORS.navy,
      letterSpacing: -0.3,
    },
    heroRoleBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      marginLeft: 8,
    },
    heroRoleBadgeText: {
      fontSize: 9,
      fontWeight: "bold",
    },
    heroAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: COLORS.primary,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 20,
      marginTop: 10,
      paddingHorizontal: 12,
      height: 42,
      backgroundColor: COLORS.white,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    searchInput: {
      flex: 1,
      fontSize: 13,
      color: COLORS.navy,
    },
    bannerCard: {
      marginHorizontal: 20,
      marginTop: 14,
      padding: 16,
      borderRadius: 20,
      backgroundColor: COLORS.primary,
    },
    bannerHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    bannerIcon: {
      fontSize: 20,
    },
    bannerTitle: {
      fontSize: 15,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    bannerSubtitle: {
      fontSize: 11,
      color: "rgba(255, 255, 255, 0.8)",
      marginTop: 1,
    },
    featuredBadge: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
    },
    featuredBadgeText: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    bannerFooter: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16,
    },
    avatarStack: {
      flexDirection: "row",
      alignItems: "center",
    },
    miniAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: "#FFFFFF",
    },
    miniAvatarText: {
      fontSize: 9,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    miniAvatarPlus: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: "#FFFFFF",
    },
    miniAvatarPlusText: {
      fontSize: 9,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    progressLabelRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    progressLabel: {
      fontSize: 10,
      color: "rgba(255, 255, 255, 0.8)",
    },
    progressRatio: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    progressBarBg: {
      height: 6,
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      borderRadius: 3,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 3,
    },
    calendarSection: {
      marginTop: 16,
      paddingHorizontal: 20,
    },
    calendarHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    calendarMonth: {
      fontSize: 14,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    calendarToday: {
      fontSize: 12,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    daysScroll: {
      gap: 10,
    },
    dayCard: {
      width: 44,
      height: 62,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    dayCardActive: {
      backgroundColor: COLORS.primary,
    },
    dayCardInactive: {
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    dayDate: {
      fontSize: 14,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    dayDateActive: {
      color: "#FFFFFF",
    },
    dayName: {
      fontSize: 10,
      color: COLORS.muted,
      marginTop: 2,
    },
    dayNameActive: {
      color: "rgba(255, 255, 255, 0.8)",
    },
    todayDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: COLORS.primary,
      marginTop: 3,
    },
    filterScroll: {
      paddingHorizontal: 20,
      marginTop: 16,
      gap: 8,
    },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 12,
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    filterChipActive: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    filterChipText: {
      fontSize: 11,
      color: COLORS.textSecondary,
      fontWeight: "600",
    },
    filterChipTextActive: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginTop: 18,
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    countBadge: {
      backgroundColor: COLORS.primaryLight,
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 10,
      marginLeft: 6,
    },
    countBadgeText: {
      fontSize: 10,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    taskCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: COLORS.card,
      marginHorizontal: 20,
      marginBottom: 10,
      padding: 14,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    taskCardBody: {
      flex: 1,
      marginRight: 10,
    },
    taskBadgeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 4,
    },
    projectTagPill: {
      backgroundColor: COLORS.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    projectTagText: {
      fontSize: 9,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    underReviewPill: {
      backgroundColor: "rgba(245, 158, 11, 0.15)",
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 6,
    },
    underReviewPillText: {
      fontSize: 9,
      fontWeight: "bold",
      color: COLORS.accentYellow,
    },
    priorityDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    taskTitle: {
      fontSize: 13,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    reviewSnippetBox: {
      backgroundColor: COLORS.reviewBoxBg,
      borderWidth: 1,
      borderColor: COLORS.reviewBoxBorder,
      borderRadius: 8,
      padding: 6,
      marginTop: 6,
    },
    reviewSnippetLabel: {
      fontSize: 9,
      fontWeight: "bold",
      color: COLORS.reviewBoxText,
    },
    reviewSnippetText: {
      fontSize: 10,
      color: COLORS.navy,
      fontStyle: "italic",
      marginTop: 1,
    },
    screenshotBadgeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 5,
    },
    screenshotBadgeText: {
      fontSize: 10,
      color: COLORS.primary,
      fontWeight: "600",
    },
    taskFooter: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
    },
    taskTime: {
      fontSize: 10,
      color: COLORS.muted,
    },
    taskDot: {
      marginHorizontal: 4,
      color: COLORS.muted,
      fontSize: 10,
    },
    taskSubtaskCount: {
      fontSize: 10,
      color: COLORS.muted,
    },
    circleProgressWrap: {
      alignItems: "center",
      justifyContent: "center",
    },
    circleProgressRing: {
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 3,
      borderColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.cardSecondary,
    },
    circleProgressText: {
      fontSize: 10,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    quickApproveBtn: {
      backgroundColor: COLORS.accentGreen,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 10,
    },
    quickApproveText: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    projectsContainer: {
      paddingHorizontal: 20,
    },
    projectsHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 16,
      marginBottom: 10,
    },
    projectsHeaderTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    projectsHeaderSubtitle: {
      fontSize: 11,
      color: COLORS.muted,
    },
    newProjectButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.primary,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 12,
    },
    newProjectButtonText: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    projectCard: {
      backgroundColor: COLORS.card,
      padding: 16,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginTop: 12,
    },
    projectCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    projectCodeBadge: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    projectCodeBadgeText: {
      fontSize: 11,
      fontWeight: "bold",
    },
    projectDetailTopBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 14,
      marginBottom: 12,
    },
    projectDetailHeroCard: {
      backgroundColor: COLORS.card,
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginBottom: 12,
    },
    emptyProjectContainer: {
      backgroundColor: COLORS.card,
      padding: 24,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: "center",
      marginTop: 18,
    },
    emptyProjectTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: COLORS.navy,
      marginTop: 12,
      marginBottom: 4,
    },
    emptyProjectSubtitle: {
      fontSize: 11,
      color: COLORS.muted,
      textAlign: "center",
      marginBottom: 14,
      maxWidth: 240,
    },
    emptyProjectBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: COLORS.primary,
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 12,
    },
    emptyProjectBtnText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "bold",
    },
    projectEmoji: {
      fontSize: 22,
    },
    projectName: {
      fontSize: 14,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    projectCategory: {
      fontSize: 10,
      color: COLORS.muted,
    },
    taskPillBadge: {
      backgroundColor: COLORS.cardSecondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    taskPillBadgeText: {
      fontSize: 10,
      color: COLORS.navy,
      fontWeight: "600",
    },
    projectProgressWrap: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 14,
    },
    projectProgressPercent: {
      fontSize: 11,
      fontWeight: "bold",
      color: COLORS.navy,
      marginLeft: 10,
    },
    detailsContainer: {
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    detailsHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    backButton: {
      padding: 6,
    },
    detailsHeaderTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    submitReviewHeaderBtn: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
    },
    submitReviewHeaderBtnText: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    detailsCard: {
      backgroundColor: COLORS.card,
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    detailsBadgeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    priorityPill: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    priorityPillText: {
      fontSize: 9,
      fontWeight: "bold",
    },
    detailsTaskTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: COLORS.navy,
      marginBottom: 10,
    },
    underReviewBanner: {
      backgroundColor: COLORS.reviewBoxBg,
      borderWidth: 1,
      borderColor: COLORS.reviewBoxBorder,
      borderRadius: 14,
      padding: 12,
      marginBottom: 12,
    },
    reviewBannerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    reviewBannerTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: COLORS.reviewBoxText,
    },
    reviewBannerTime: {
      fontSize: 9,
      color: COLORS.muted,
    },
    reviewNotesBox: {
      backgroundColor: COLORS.white,
      padding: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginBottom: 8,
    },
    reviewNotesTitle: {
      fontSize: 9,
      fontWeight: "bold",
      color: COLORS.muted,
      marginBottom: 2,
    },
    reviewNotesContent: {
      fontSize: 11,
      color: COLORS.navy,
    },
    screenshotSection: {
      marginBottom: 10,
    },
    screenshotSectionTitle: {
      fontSize: 9,
      fontWeight: "bold",
      color: COLORS.muted,
      marginBottom: 4,
    },
    screenshotThumbnailWrap: {
      position: "relative",
      borderRadius: 8,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: COLORS.border,
      alignSelf: "flex-start",
    },
    screenshotThumbnail: {
      width: 140,
      height: 80,
      borderRadius: 8,
    },
    screenshotZoomBadge: {
      position: "absolute",
      bottom: 4,
      right: 4,
      backgroundColor: "rgba(0,0,0,0.65)",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    screenshotZoomBadgeText: {
      fontSize: 9,
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    managerActionRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 4,
    },
    managerApproveBtn: {
      flex: 1,
      backgroundColor: COLORS.accentGreen,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      paddingVertical: 9,
      borderRadius: 10,
    },
    managerApproveBtnText: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    managerRejectBtn: {
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.border,
      paddingVertical: 9,
      paddingHorizontal: 12,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    managerRejectBtnText: {
      fontSize: 11,
      fontWeight: "600",
      color: COLORS.navy,
    },
    completedBanner: {
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      borderWidth: 1,
      borderColor: "rgba(16, 185, 129, 0.3)",
      borderRadius: 12,
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    completedCheckCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: COLORS.accentGreen,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },
    completedBannerTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    completedBannerSubtitle: {
      fontSize: 10,
      color: COLORS.muted,
    },
    detailsProgressCard: {
      backgroundColor: COLORS.cardSecondary,
      padding: 12,
      borderRadius: 14,
      marginBottom: 12,
    },
    detailsProgressLabel: {
      fontSize: 11,
      color: COLORS.muted,
      fontWeight: "bold",
    },
    detailsProgressPercent: {
      fontSize: 12,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    detailsProgressBarBg: {
      height: 6,
      backgroundColor: COLORS.border,
      borderRadius: 3,
      overflow: "hidden",
      marginTop: 6,
    },
    detailsProgressBarFill: {
      height: "100%",
      backgroundColor: COLORS.primary,
      borderRadius: 3,
    },
    checklistTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: COLORS.navy,
      textTransform: "uppercase",
      marginBottom: 6,
    },
    checklistCard: {
      backgroundColor: COLORS.cardSecondary,
      padding: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    checklistItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 7,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    checkbox: {
      width: 18,
      height: 18,
      borderRadius: 5,
      borderWidth: 1.5,
      borderColor: COLORS.muted,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
    },
    checkboxActive: {
      backgroundColor: COLORS.accentGreen,
      borderColor: COLORS.accentGreen,
    },
    checklistItemText: {
      fontSize: 11,
      color: COLORS.navy,
      flex: 1,
    },
    checklistItemTextDone: {
      textDecorationLine: "line-through",
      color: COLORS.muted,
    },
    addStepRow: {
      flexDirection: "row",
      marginTop: 8,
    },
    addStepInput: {
      flex: 1,
      height: 34,
      fontSize: 11,
      color: COLORS.navy,
      backgroundColor: COLORS.white,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
      paddingHorizontal: 8,
    },
    addStepBtn: {
      marginLeft: 6,
      backgroundColor: COLORS.primary,
      paddingHorizontal: 10,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    addStepBtnText: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    submitReviewBigBtn: {
      marginTop: 14,
      backgroundColor: COLORS.primary,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: "center",
    },
    submitReviewBigBtnText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "bold",
    },
    commentItem: {
      backgroundColor: COLORS.cardSecondary,
      padding: 8,
      borderRadius: 8,
      marginBottom: 6,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    commentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    commentUser: {
      fontSize: 10,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    commentTime: {
      fontSize: 9,
      color: COLORS.muted,
    },
    commentBody: {
      fontSize: 11,
      color: COLORS.navy,
    },
    commentInputRow: {
      flexDirection: "row",
      marginTop: 8,
    },
    commentTextInput: {
      flex: 1,
      height: 36,
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 10,
      paddingHorizontal: 10,
      fontSize: 11,
      color: COLORS.navy,
    },
    sendCommentBtn: {
      marginLeft: 6,
      backgroundColor: COLORS.primary,
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    profileContainer: {
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    profileHeroCard: {
      backgroundColor: COLORS.white,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 20,
      alignItems: "center",
    },
    profileAvatarWrap: {
      position: "relative",
      marginBottom: 10,
    },
    profileAvatar: {
      width: 76,
      height: 76,
      borderRadius: 38,
      borderWidth: 3,
      borderColor: COLORS.primary,
    },
    profileOnlineDot: {
      position: "absolute",
      bottom: 2,
      right: 4,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: COLORS.accentGreen,
      borderWidth: 2,
      borderColor: COLORS.white,
    },
    profileName: {
      fontSize: 16,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    profileRoleBadge: {
      backgroundColor: COLORS.primaryLight,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 8,
      marginTop: 4,
    },
    profileRoleBadgeText: {
      fontSize: 10,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    profileEmail: {
      fontSize: 11,
      color: COLORS.muted,
      marginTop: 4,
    },
    profileStatsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      width: "100%",
      marginTop: 16,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },
    statBox: {
      alignItems: "center",
    },
    statNumber: {
      fontSize: 16,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    statLabel: {
      fontSize: 10,
      color: COLORS.muted,
      marginTop: 1,
    },
    statDivider: {
      width: 1,
      height: 20,
      backgroundColor: COLORS.border,
    },
    quickActionCard: {
      marginTop: 12,
    },
    onboardingBannerBtn: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    onboardingIconBox: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    onboardingBannerTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    onboardingBannerSub: {
      fontSize: 10,
      color: COLORS.muted,
      marginTop: 1,
    },
    chartCard: {
      backgroundColor: COLORS.white,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 16,
      marginTop: 12,
    },
    chartHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    chartTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    chartBadge: {
      fontSize: 10,
      color: COLORS.primary,
      fontWeight: "bold",
      backgroundColor: COLORS.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    barChartRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      height: 90,
      paddingHorizontal: 6,
    },
    barCol: {
      alignItems: "center",
      flex: 1,
    },
    barTrack: {
      width: 12,
      height: 70,
      backgroundColor: COLORS.cardSecondary,
      borderRadius: 6,
      justifyContent: "flex-end",
      overflow: "hidden",
    },
    barFill: {
      width: "100%",
      borderRadius: 6,
    },
    barDayText: {
      fontSize: 9,
      color: COLORS.muted,
      marginTop: 4,
    },
    settingsSection: {
      backgroundColor: COLORS.white,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 16,
      marginTop: 12,
    },
    settingsHeaderTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: COLORS.navy,
      marginBottom: 10,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    settingLabel: {
      fontSize: 12,
      color: COLORS.navy,
      fontWeight: "500",
    },
    logoutBtn: {
      marginTop: 14,
      backgroundColor: "rgba(239, 68, 68, 0.08)",
      borderWidth: 1,
      borderColor: "rgba(239, 68, 68, 0.2)",
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: "center",
    },
    logoutBtnText: {
      color: "#EF4444",
      fontSize: 11,
      fontWeight: "bold",
    },

    /* BOTTOM NAV DOCK - Generous Click Area */
    bottomNav: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 72,
      backgroundColor: COLORS.tabBarBg,
      borderTopWidth: 1,
      borderTopColor: COLORS.tabBarBorder,
      flexDirection: "row",
      alignItems: "stretch",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
    },
    navItem: {
      flex: 1,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 6,
    },
    navItemActive: {},
    navText: {
      fontSize: 10,
      color: COLORS.muted,
      marginTop: 3,
    },
    navTextActive: {
      color: COLORS.primary,
      fontWeight: "bold",
    },
    centerAddButtonContainer: {
      width: 64,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    centerAddButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      marginTop: -22,
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },

    /* MODAL SHEETS & OVERLAYS */
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: COLORS.white,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      padding: 20,
      maxHeight: "88%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    modalSheetTitle: {
      fontSize: 15,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    modalSheetSubtitle: {
      fontSize: 10,
      color: COLORS.muted,
      marginTop: 1,
    },
    modalCloseBtn: {
      padding: 6,
    },
    modalTab: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 8,
      marginRight: 6,
      backgroundColor: COLORS.cardSecondary,
    },
    modalTabActive: {
      backgroundColor: COLORS.primary,
    },
    modalTabText: {
      fontSize: 11,
      fontWeight: "bold",
      color: COLORS.muted,
    },
    modalTabTextActive: {
      color: "#FFFFFF",
    },
    reviewTargetBanner: {
      backgroundColor: COLORS.cardSecondary,
      padding: 10,
      borderRadius: 12,
      marginTop: 10,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    reviewTargetProject: {
      fontSize: 9,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    reviewTargetTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: COLORS.navy,
      marginTop: 1,
    },
    reviewTextInput: {
      minHeight: 64,
      backgroundColor: COLORS.cardSecondary,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 12,
      padding: 10,
      fontSize: 11,
      color: COLORS.navy,
      textAlignVertical: "top",
    },
    attachedScreenshotCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.cardSecondary,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 12,
      padding: 8,
    },
    attachedThumbnail: {
      width: 44,
      height: 44,
      borderRadius: 6,
    },
    attachedTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    attachedSub: {
      fontSize: 9,
      color: COLORS.muted,
    },
    removeScreenshotBtn: {
      padding: 6,
    },
    attachScreenshotBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: COLORS.primary,
      backgroundColor: COLORS.primaryLight,
    },
    attachScreenshotBtnText: {
      fontSize: 11,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    reviewModalActions: {
      flexDirection: "row",
      gap: 8,
      marginTop: 16,
    },
    skipSubmitBtn: {
      flex: 1,
      backgroundColor: COLORS.cardSecondary,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    skipSubmitBtnText: {
      fontSize: 11,
      fontWeight: "600",
      color: COLORS.navy,
    },
    submitReviewConfirmBtn: {
      flex: 1.6,
      backgroundColor: COLORS.primary,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
    },
    submitReviewConfirmBtnText: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    fullScreenImageViewer: {
      flex: 1,
      backgroundColor: "#000000",
      justifyContent: "center",
    },
    fullScreenImageHeader: {
      position: "absolute",
      top: 40,
      left: 20,
      right: 20,
      zIndex: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    fullScreenImageTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    fullScreenCloseBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    fullScreenImage: {
      width: SCREEN_WIDTH,
      height: "80%",
    },

    /* AUTH ENTRANCE STYLES */
    authHeaderBanner: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      paddingTop: 10,
    },
    authLogoBadge: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
    authLogoText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    authBrandTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    authBrandSubtitle: {
      fontSize: 10,
      color: COLORS.muted,
    },
    authThemeToggle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.card,
    },
    authSegmentedRow: {
      flexDirection: "row",
      backgroundColor: COLORS.cardSecondary,
      borderRadius: 14,
      padding: 4,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    authSegmentBtn: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
      borderRadius: 10,
    },
    authSegmentBtnActive: {
      backgroundColor: COLORS.white,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    authSegmentText: {
      fontSize: 11,
      fontWeight: "600",
      color: COLORS.muted,
    },
    authSegmentTextActive: {
      color: COLORS.primary,
      fontWeight: "bold",
    },
    authCard: {
      backgroundColor: COLORS.white,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 18,
    },
    authCardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    authCardDesc: {
      fontSize: 11,
      color: COLORS.muted,
      marginTop: 2,
      marginBottom: 12,
    },
    authSubmitBtn: {
      backgroundColor: COLORS.primary,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 14,
    },
    authSubmitBtnText: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    uninvitedBanner: {
      backgroundColor: "#FEF2F2",
      borderWidth: 1,
      borderColor: "#FCA5A5",
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
    },
    uninvitedBannerTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#DC2626",
    },
    uninvitedBannerBody: {
      fontSize: 10,
      color: "#991B1B",
      marginTop: 2,
    },
    uninvitedPromptBtn: {
      backgroundColor: COLORS.primary,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    uninvitedPromptBtnText: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    quickAccountsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      marginTop: 4,
    },
    quickAccountChip: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: COLORS.cardSecondary,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    quickAccountChipText: {
      fontSize: 10,
      color: COLORS.navy,
      fontWeight: "600",
    },

    /* 3-STEP ONBOARDING WIZARD STYLES */
    wizardContainer: {
      width: "100%",
    },
    wizardStepperHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    wizardStepDot: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: COLORS.cardSecondary,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      alignItems: "center",
      justifyContent: "center",
    },
    wizardStepDotActive: {
      borderColor: COLORS.primary,
      backgroundColor: COLORS.primaryLight,
    },
    wizardStepDotText: {
      fontSize: 11,
      fontWeight: "bold",
      color: COLORS.muted,
    },
    wizardStepDotTextActive: {
      color: COLORS.primary,
    },
    wizardStepLine: {
      width: 40,
      height: 2,
      backgroundColor: COLORS.border,
      marginHorizontal: 4,
    },
    wizardStepLineActive: {
      backgroundColor: COLORS.primary,
    },
    wizardStepTitleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    wizardCurrentStepTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: COLORS.navy,
      flex: 1,
    },
    wizardStepCounter: {
      fontSize: 10,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    stepContentBox: {
      width: "100%",
    },
    stepSubtitle: {
      fontSize: 11,
      color: COLORS.muted,
      marginBottom: 10,
    },
    rolePickerRow: {
      flexDirection: "row",
      gap: 6,
      marginTop: 4,
    },
    roleOptionCard: {
      flex: 1,
      padding: 8,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      backgroundColor: COLORS.cardSecondary,
      alignItems: "center",
    },
    roleOptionCardActive: {
      borderColor: COLORS.primary,
      backgroundColor: COLORS.primaryLight,
    },
    roleOptionTitle: {
      fontSize: 10,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    roleOptionTitleActive: {
      color: COLORS.primary,
    },
    roleOptionDesc: {
      fontSize: 8,
      color: COLORS.muted,
      marginTop: 2,
    },
    projectPillRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
      marginTop: 4,
      marginBottom: 8,
    },
    projSelectChip: {
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 6,
      backgroundColor: COLORS.cardSecondary,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    projSelectChipActive: {
      backgroundColor: COLORS.primaryLight,
      borderColor: COLORS.primary,
    },
    projSelectChipText: {
      fontSize: 9,
      color: COLORS.navy,
    },
    projSelectChipTextActive: {
      color: COLORS.primary,
      fontWeight: "bold",
    },
    addEmployeeBtn: {
      backgroundColor: COLORS.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 9,
      borderRadius: 10,
      marginTop: 4,
    },
    addEmployeeBtnText: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    employeeListContainer: {
      gap: 6,
      marginTop: 4,
    },
    employeeCardRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: COLORS.cardSecondary,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    employeeCardName: {
      fontSize: 11,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    employeeRoleTag: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginLeft: 6,
    },
    employeeRoleTagText: {
      fontSize: 8,
      fontWeight: "bold",
    },
    employeeCardEmail: {
      fontSize: 9,
      color: COLORS.muted,
      marginTop: 2,
    },
    wizardActionRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 16,
    },
    wizardBackBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.border,
      backgroundColor: COLORS.cardSecondary,
      alignItems: "center",
    },
    wizardBackBtnText: {
      fontSize: 11,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    wizardNextBtn: {
      backgroundColor: COLORS.primary,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 14,
    },
    wizardNextBtnText: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    emailPreviewCard: {
      backgroundColor: COLORS.cardSecondary,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 12,
      marginTop: 4,
    },
    emailPreviewHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    emailPreviewSender: {
      fontSize: 9,
      color: COLORS.muted,
    },
    emailPreviewSubject: {
      fontSize: 11,
      fontWeight: "bold",
      color: COLORS.navy,
      marginTop: 4,
    },
    emailPreviewDivider: {
      height: 1,
      backgroundColor: COLORS.border,
      marginVertical: 8,
    },
    emailPreviewBody: {
      fontSize: 10,
      color: COLORS.textSecondary,
      lineHeight: 14,
    },
    emailPreviewRosterBox: {
      backgroundColor: COLORS.white,
      padding: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginTop: 8,
    },
    emailMockButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
    },
    emailMockButtonText: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    shareableLinkBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.cardSecondary,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 12,
      padding: 8,
      marginTop: 4,
    },
    shareableLinkText: {
      fontSize: 10,
      color: COLORS.navy,
      fontFamily: "monospace",
    },
    copyLinkBtn: {
      backgroundColor: COLORS.primary,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
    },
    copyLinkBtnText: {
      fontSize: 9,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    launchWorkspaceBtn: {
      backgroundColor: COLORS.accentGreen,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    launchWorkspaceBtnText: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#FFFFFF",
    },

    /* General Form & Drawer Items */
    slugInputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.cardSecondary,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 10,
      paddingHorizontal: 10,
    },
    slugPrefix: {
      fontSize: 11,
      color: COLORS.muted,
      fontWeight: "bold",
    },
    slugTextInput: {
      flex: 1,
      height: 38,
      fontSize: 11,
      color: COLORS.navy,
    },
    teamSizeRow: {
      flexDirection: "row",
      gap: 6,
    },
    teamSizeChip: {
      flex: 1,
      paddingVertical: 7,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
      backgroundColor: COLORS.cardSecondary,
      alignItems: "center",
    },
    teamSizeChipActive: {
      borderColor: COLORS.primary,
      backgroundColor: COLORS.primaryLight,
    },
    teamSizeChipText: {
      fontSize: 10,
      fontWeight: "600",
      color: COLORS.navy,
    },
    teamSizeChipTextActive: {
      color: COLORS.primary,
      fontWeight: "bold",
    },
    themeSelectorRow: {
      flexDirection: "row",
      gap: 10,
    },
    themeCard: {
      flex: 1,
      padding: 10,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: COLORS.border,
      backgroundColor: COLORS.cardSecondary,
      alignItems: "center",
    },
    themeCardActive: {
      borderColor: COLORS.primary,
    },
    themePreviewBox: {
      width: 44,
      height: 44,
      borderRadius: 10,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 6,
    },
    themeCardTitle: {
      fontSize: 11,
      color: COLORS.navy,
    },
    formContainer: {
      marginTop: 10,
    },
    inputLabel: {
      fontSize: 10,
      fontWeight: "bold",
      color: COLORS.muted,
      marginBottom: 4,
    },
    textInput: {
      height: 38,
      backgroundColor: COLORS.cardSecondary,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: COLORS.border,
      paddingHorizontal: 10,
      fontSize: 12,
      color: COLORS.navy,
    },
    stepItemRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: COLORS.cardSecondary,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      marginBottom: 4,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    stepItemText: {
      fontSize: 11,
      color: COLORS.navy,
    },
    stepInputRow: {
      flexDirection: "row",
      marginTop: 6,
      gap: 6,
    },
    stepTextInput: {
      flex: 1,
      height: 36,
      backgroundColor: COLORS.cardSecondary,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
      paddingHorizontal: 10,
      fontSize: 11,
      color: COLORS.navy,
    },
    addStepButton: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    addStepButtonText: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    createTaskButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 16,
    },
    createTaskButtonText: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    notifSheet: {
      backgroundColor: COLORS.white,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      minHeight: 220,
    },
    notifHeaderTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    notifCard: {
      padding: 10,
      borderRadius: 12,
      backgroundColor: COLORS.cardSecondary,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginTop: 10,
    },
    notifTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    notifTime: {
      fontSize: 10,
      color: COLORS.muted,
      marginTop: 2,
    },
    drawerSheet: {
      backgroundColor: COLORS.white,
      width: "75%",
      height: "100%",
      padding: 20,
    },
    orgLogo: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    orgLogoText: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    drawerLink: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    drawerLinkText: {
      fontSize: 12,
      color: COLORS.navy,
      marginLeft: 10,
      fontWeight: "600",
    },
  });
