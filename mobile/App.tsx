import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
  Animated,
  Easing,
  BackHandler,
  AppRegistry,
  Appearance,
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
  PulseIcon,
  AnimatedAddButton,
  AnimatedThemeToggle,
  BoardIcon,
  ListIcon,
  TimelineIcon,
  ChatBubbleIcon,
  CheckCircleFilledIcon,
  ActivityPulseIcon,
  LayersIcon,
  ShieldCheckIcon,
  SlidersIcon,
  InfoIcon,
  BarChartIcon,
} from "./components/Icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

import { BIKASH_AVATAR_URI } from "./assets/bikashAvatarBase64";
import { SAMPLE_SCREENSHOT_URI } from "./assets/sampleScreenshotBase64";
import { MobileBootSplash } from "./components/MobileBootSplash";
import { ThemeToggleBar } from "./components/ThemeToggleBar";
import { AnimatedTabItem } from "./components/AnimatedTabItem";
import { AnimatedBellButton } from "./components/AnimatedBellButton";
import { AnimatedToggleSwitch } from "./components/AnimatedToggleSwitch";
import { GanttTimelineView } from "./components/GanttTimelineView";
import { GovernanceGatesSection, ApprovalGate } from "./components/GovernanceGatesSection";
import { EnterpriseAuditAndRbacModal } from "./components/EnterpriseAuditAndRbacModal";
import { CorporateAnalyticsExportModal } from "./components/CorporateAnalyticsExportModal";
import { EnterpriseThreadedDiscussionSection } from "./components/EnterpriseThreadedDiscussionSection";

export type ProjectTabMode = "list" | "board" | "timeline";

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

export interface TaskComment {
  id: string;
  author: string;
  avatarRole?: string;
  text: string;
  time: string;
}

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
  description?: string;
  assignee?: string;
  comments?: TaskComment[];
  completionNotes?: string;
  completionScreenshot?: string;
  submittedAt?: string;
  reviewedBy?: string;
  reviewDate?: string;
  approvalGates?: ApprovalGate[];
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

const INITIAL_TASKS: MobileTask[] = [
  {
    id: "task-web-1",
    title: "Backend: Database Schema & Auth APIs",
    project: "Website Building",
    category: "Engineering",
    priority: "high",
    status: "in_review",
    progress: 80,
    timeAgo: "10 min ago",
    assignee: "Bikash Kumar Yadav",
    description: "Production Postgres schema with full JWT session middleware, role claims, and automated migration scripts.",
    comments: [
      { id: "c-1", author: "Bikash", avatarRole: "Admin", text: "Postgres schema and JWT middleware verified. Ready for sign-off.", time: "10m ago" },
      { id: "c-2", author: "Marcus", avatarRole: "PM", text: "Reviewing the automated migration scripts now.", time: "4m ago" },
    ],
    subtasks: [
      { id: "sub-w1", title: "Design PostgreSQL relational schema", completed: true },
      { id: "sub-w2", title: "Setup JWT & Session middleware", completed: true },
      { id: "sub-w3", title: "Write automated migration scripts", completed: true },
      { id: "sub-w4", title: "Security audit on user role claims", completed: false },
    ],
  },
  {
    id: "task-web-4",
    title: "Frontend: Interactive Landing Page & Features",
    project: "Website Building",
    category: "Engineering",
    priority: "critical",
    status: "in_progress",
    progress: 66,
    timeAgo: "15 min ago",
    assignee: "Elena Rostova",
    description: "Responsive hero animation with pricing calculator and open-graph SEO meta tag support.",
    comments: [
      { id: "c-3", author: "Elena", avatarRole: "Member", text: "Hero animation and conversion flow is complete! Just polishing the meta tags.", time: "15m ago" },
    ],
    subtasks: [
      { id: "sub-w5", title: "Hero animation and CTA conversion flow", completed: true },
      { id: "sub-w6", title: "Interactive feature pricing calculator", completed: true },
      { id: "sub-w7", title: "SEO meta tags & OpenGraph card preview", completed: false },
    ],
  },
  {
    id: "task-mktg-1",
    title: "Facebook Ads: Campaign Setup & Targeting",
    project: "Digital Marketing",
    category: "Marketing",
    priority: "high",
    status: "in_progress",
    progress: 66,
    timeAgo: "20 min ago",
    assignee: "Marcus Lee",
    description: "Meta Conversions API setup with high-converting carousel assets and lookalike audience segmentation.",
    comments: [
      { id: "c-4", author: "Marcus", avatarRole: "Manager", text: "CAPI installed and verified. Creative assets uploaded.", time: "20m ago" },
    ],
    subtasks: [
      { id: "sub-m1", title: "Install Meta Conversions API (CAPI)", completed: true },
      { id: "sub-m2", title: "Upload video & carousel creative assets", completed: true },
      { id: "sub-m3", title: "Configure A/B lookalike audience split", completed: false },
    ],
  },
  {
    id: "task-mktg-4",
    title: "Ideas: Creative Hooks & Copywriting Concepts",
    project: "Digital Marketing",
    category: "Design",
    priority: "high",
    status: "in_progress",
    progress: 50,
    timeAgo: "25 min ago",
    subtasks: [
      { id: "sub-m4", title: "Brainstorm 10 high-converting ad hooks", completed: true },
      { id: "sub-m5", title: "Design 5 static banner visual concepts", completed: false },
    ],
  },
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return Appearance.getColorScheme() === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === "dark");
    });
    return () => sub.remove();
  }, []);

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
  const [isBooting, setIsBooting] = useState(true);

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

  // Premium Features State
  const [projectTabMode, setProjectTabMode] = useState<ProjectTabMode>("list");
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<MobileTask | null>(null);
  const [detailCommentInput, setDetailCommentInput] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [activityEvents, setActivityEvents] = useState([
    { id: "act-1", user: "Bikash", role: "Admin", action: "approved", target: "Database Schema & Auth APIs", time: "5m ago", color: "#10B981" },
    { id: "act-2", user: "Elena", role: "Member", action: "completed subtask on", target: "Landing Page & Features", time: "18m ago", color: "#3B82F6" },
    { id: "act-3", user: "Marcus", role: "Manager", action: "submitted for review", target: "Facebook Ads Campaign", time: "42m ago", color: "#F59E0B" },
    { id: "act-4", user: "David", role: "Viewer", action: "synced workstream", target: "Cubbles Engine", time: "1h ago", color: "#8B5CF6" },
  ]);

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
    const interval = setInterval(syncWithServer, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const dispatchTaskSync = (task: MobileTask) => {
    fetch("https://happy-fermi-kappa.vercel.app/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: task.id,
        title: task.title,
        projectName: task.project,
        department: task.category,
        priority: task.priority,
        status: task.status,
        progressPercentage: task.progress,
        subtasks: task.subtasks,
      }),
    }).catch(() => {});
  };

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<"task" | "project">("task");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isEnterpriseAuditModalOpen, setIsEnterpriseAuditModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

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
  const [newTaskAssignee, setNewTaskAssignee] = useState("Bikash Sharma");
  const [isInvitingViaEmail, setIsInvitingViaEmail] = useState(false);
  const [newTaskInviteEmail, setNewTaskInviteEmail] = useState("");
  const [inviteNotice, setInviteNotice] = useState<string | null>(null);
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

  // Navigation History Stack & Native Slide Transition
  const [navHistory, setNavHistory] = useState<
    {
      tab: "home" | "projects" | "details" | "profile";
      project?: MobileProject | null;
      task?: MobileTask | null;
    }[]
  >([]);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Drawer Animation Physics
  const drawerSlideAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.85)).current;
  const drawerFadeAnim = useRef(new Animated.Value(0)).current;
  const gridSpinAnim = useRef(new Animated.Value(0)).current;

  const openDrawer = useCallback(() => {
    triggerHaptic("selection");
    setIsDrawerOpen(true);

    Animated.sequence([
      Animated.timing(gridSpinAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(gridSpinAnim, {
        toValue: 0,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    drawerSlideAnim.setValue(-SCREEN_WIDTH * 0.85);
    drawerFadeAnim.setValue(0);
    Animated.parallel([
      Animated.spring(drawerSlideAnim, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(drawerFadeAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [drawerSlideAnim, drawerFadeAnim, gridSpinAnim]);

  const closeDrawer = useCallback(() => {
    triggerHaptic("light");
    Animated.parallel([
      Animated.timing(drawerSlideAnim, {
        toValue: -SCREEN_WIDTH * 0.85,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(drawerFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsDrawerOpen(false);
      gridSpinAnim.setValue(0);
    });
  }, [drawerSlideAnim, drawerFadeAnim, gridSpinAnim]);

  const navigateForward = useCallback(
    (
      newTab: "home" | "projects" | "details" | "profile",
      options?: { project?: MobileProject | null; task?: MobileTask | null; replace?: boolean }
    ) => {
      if (
        !options?.replace &&
        currentTab === newTab &&
        (options?.project === undefined || options?.project?.id === selectedProjectView?.id) &&
        (options?.task === undefined || options?.task?.id === selectedTask?.id)
      ) {
        return;
      }

      if (!options?.replace) {
        setNavHistory((prev) => [
          ...prev,
          {
            tab: currentTab,
            project: selectedProjectView,
            task: selectedTask,
          },
        ]);
      }

      slideAnim.stopAnimation();
      fadeAnim.stopAnimation();

      // Forward Slide Animation: enters from right (+35px -> 0)
      slideAnim.setValue(35);
      fadeAnim.setValue(0.7);

      if (options?.project !== undefined) setSelectedProjectView(options.project);
      if (options?.task !== undefined) setSelectedTask(options.task);
      setCurrentTab(newTab);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [currentTab, selectedProjectView, selectedTask, slideAnim, fadeAnim]
  );

  const handleGoBack = useCallback((): boolean => {
    // 1. Dismiss any open modals first
    if (viewingScreenshot) {
      setViewingScreenshot(null);
      return true;
    }
    if (reviewModalVisible) {
      setReviewModalVisible(false);
      return true;
    }
    if (isOnboardingModalOpen) {
      setIsOnboardingModalOpen(false);
      return true;
    }
    if (isCreateOpen) {
      setIsCreateOpen(false);
      return true;
    }
    if (isNotificationsOpen) {
      setIsNotificationsOpen(false);
      return true;
    }
    if (isDrawerOpen) {
      closeDrawer();
      return true;
    }

    // 2. Unauthenticated auth flow
    if (!currentUser) {
      if (authTab === "signup") {
        if (onboardingStep > 1) {
          setOnboardingStep((prev) => (prev - 1) as 1 | 2 | 3);
          return true;
        }
        setAuthTab("signin");
        return true;
      }
      return false;
    }

    // 3. Crisp, Single-Phase Slide-Back Transition (instant 160ms deceleration from left)
    const executeBackTransition = (updateState: () => void) => {
      slideAnim.stopAnimation();
      fadeAnim.stopAnimation();

      slideAnim.setValue(-35);
      fadeAnim.setValue(0.7);
      updateState();

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // 4. Pop from Navigation History Stack if present
    if (navHistory.length > 0) {
      const prevEntry = navHistory[navHistory.length - 1];
      setNavHistory((prev) => prev.slice(0, -1));
      triggerHaptic("selection");
      executeBackTransition(() => {
        setCurrentTab(prevEntry.tab);
        setSelectedProjectView(prevEntry.project ?? null);
        if (prevEntry.task) setSelectedTask(prevEntry.task);
      });
      return true;
    }

    // 5. Logical Hierarchical Fallbacks if History is Empty
    if (currentTab === "details") {
      triggerHaptic("selection");
      executeBackTransition(() => {
        if (selectedProjectView) {
          setCurrentTab("projects");
        } else {
          setCurrentTab("home");
        }
      });
      return true;
    }

    if (currentTab === "projects" && selectedProjectView) {
      triggerHaptic("selection");
      executeBackTransition(() => {
        setSelectedProjectView(null);
      });
      return true;
    }

    if (currentTab !== "home") {
      triggerHaptic("selection");
      executeBackTransition(() => {
        setCurrentTab("home");
        setSelectedProjectView(null);
      });
      return true;
    }

    // At root Home with zero history -> allow Android to exit app naturally
    return false;
  }, [
    viewingScreenshot,
    reviewModalVisible,
    isOnboardingModalOpen,
    isCreateOpen,
    isNotificationsOpen,
    isDrawerOpen,
    currentUser,
    authTab,
    onboardingStep,
    navHistory,
    currentTab,
    selectedProjectView,
    slideAnim,
    fadeAnim,
  ]);

  const handleGoBackRef = useRef(handleGoBack);
  handleGoBackRef.current = handleGoBack;

  useEffect(() => {
    const onBackPress = () => {
      return handleGoBackRef.current();
    };
    const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => subscription.remove();
  }, []);

  // Handle Login Flow
  const handleSignIn = (emailToTest?: string) => {
    triggerHaptic("selection");
    const targetEmail = (emailToTest || loginEmail).trim().toLowerCase();
    if (!targetEmail) return;

    const matched = registeredAccounts.find((a) => a.email.toLowerCase() === targetEmail);
    if (matched) {
      setUninvitedWarning(null);
      setCurrentUser(matched);
      setNavHistory([]);
      setSelectedProjectView(null);
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
    setNavHistory([]);
    setSelectedProjectView(null);
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

        dispatchTaskSync(updated);

        if (allCompleted && task.status !== "in_review" && task.status !== "completed") {
          targetTaskToReview = updated;
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 2200);
        }

        if (selectedTask?.id === taskId) {
          setSelectedTask(updated);
        }
        if (selectedTaskDetail?.id === taskId) {
          setSelectedTaskDetail(updated);
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
        dispatchTaskSync(updated);
        if (selectedTask?.id === t.id) setSelectedTask(updated);
        if (selectedTaskDetail?.id === t.id) setSelectedTaskDetail(updated);
        return updated;
      })
    );

    setActivityEvents((prev) => [
      {
        id: `act-${Date.now()}`,
        user: currentUser?.name.split(" ")[0] || "Member",
        role: currentUser?.role || "Member",
        action: "submitted for review",
        target: reviewTaskTarget.title,
        time: "Just now",
        color: "#F59E0B",
      },
      ...prev.slice(0, 5),
    ]);

    setReviewModalVisible(false);
    setReviewTaskTarget(null);
  };

  const handleManagerApprove = (taskId: string) => {
    triggerHaptic("success");
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2200);

    const approvedTask = tasks.find((t) => t.id === taskId);
    if (approvedTask) {
      setActivityEvents((prev) => [
        {
          id: `act-${Date.now()}`,
          user: currentUser?.name.split(" ")[0] || "Admin",
          role: currentUser?.role || "Admin",
          action: "approved & completed",
          target: approvedTask.title,
          time: "Just now",
          color: "#10B981",
        },
        ...prev.slice(0, 5),
      ]);
    }

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
        dispatchTaskSync(updated);
        if (selectedTask?.id === taskId) setSelectedTask(updated);
        if (selectedTaskDetail?.id === taskId) setSelectedTaskDetail(updated);
        return updated;
      })
    );
  };

  const handleAddCommentToDetailTask = (taskId: string) => {
    if (!detailCommentInput.trim()) return;
    triggerHaptic("selection");
    const newComment: TaskComment = {
      id: `c-${Date.now()}`,
      author: currentUser?.name || "Bikash",
      avatarRole: currentUser?.role?.toUpperCase() || "ADMIN",
      text: detailCommentInput.trim(),
      time: "Just now",
    };
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updated = {
          ...t,
          comments: [...(t.comments || []), newComment],
        };
        dispatchTaskSync(updated);
        if (selectedTask?.id === taskId) setSelectedTask(updated);
        if (selectedTaskDetail?.id === taskId) setSelectedTaskDetail(updated);
        return updated;
      })
    );
    setDetailCommentInput("");
  };

  const handleStatusChangeInDetail = (taskId: string, newStatus: "in_progress" | "in_review" | "completed") => {
    triggerHaptic("selection");
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newProgress = newStatus === "completed" ? 100 : newStatus === "in_review" ? 90 : Math.max(30, t.progress);
        const updated: MobileTask = {
          ...t,
          status: newStatus,
          progress: newProgress,
          ...(newStatus === "completed" ? { reviewedBy: currentUser?.name || "Manager", reviewDate: "Just now" } : {}),
        };
        dispatchTaskSync(updated);
        if (selectedTask?.id === taskId) setSelectedTask(updated);
        if (selectedTaskDetail?.id === taskId) setSelectedTaskDetail(updated);
        if (newStatus === "completed") {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 2200);
        }
        return updated;
      })
    );
  };

  const getDefaultGatesForTask = (task: MobileTask): ApprovalGate[] => {
    if (task.approvalGates && task.approvalGates.length > 0) {
      return task.approvalGates;
    }
    const isCompleted = task.status === "completed";
    const isInReview = task.status === "in_review";
    return [
      {
        id: "gate-ux",
        discipline: "Design QA",
        title: "Design System & Responsive Audit",
        requiredRole: "Staff Product Designer",
        signedBy: isCompleted || isInReview ? "David Kim" : undefined,
        signedAt: isCompleted || isInReview ? "Sep 19, 10:30 PM" : undefined,
        authStamp: isCompleted || isInReview ? "AUTH-UX#882A" : undefined,
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
        isSigned: isCompleted || isInReview,
      },
      {
        id: "gate-eng",
        discipline: "Engineering",
        title: "Architecture & Security Verification",
        requiredRole: "Tech Lead",
        signedBy: isCompleted ? "Sarah Chen" : undefined,
        signedAt: isCompleted ? "Sep 19, 11:15 PM" : undefined,
        authStamp: isCompleted ? "AUTH-ENG#441F" : undefined,
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
        isSigned: isCompleted,
      },
      {
        id: "gate-sec",
        discipline: "Compliance",
        title: "SOC 2 Type II & Executive Sign-Off",
        requiredRole: "Super Admin",
        signedBy: isCompleted ? "Bikash Kumar Yadav" : undefined,
        signedAt: isCompleted ? "Sep 19, 11:45 PM" : undefined,
        authStamp: isCompleted ? "AUTH-SEC#109E" : undefined,
        avatarUrl: BIKASH_AVATAR_URI,
        isSigned: isCompleted,
      },
    ];
  };

  const handleSignApprovalGate = (taskId: string, gateId: string) => {
    triggerHaptic("success");
    const nowStr = "Sep 20, 12:28 AM";
    const authStamp = "AUTH-SIG#" + Math.random().toString(16).substring(2, 6).toUpperCase();

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentGates = getDefaultGatesForTask(t);
        const updatedGates = currentGates.map((g) => {
          if (g.id === gateId) {
            return {
              ...g,
              isSigned: true,
              signedBy: "Bikash Kumar Yadav",
              signedAt: nowStr,
              authStamp: authStamp,
              avatarUrl: BIKASH_AVATAR_URI,
            };
          }
          return g;
        });

        const targetGate = currentGates.find((g) => g.id === gateId);
        const auditComment: TaskComment = {
          id: "cmt-sig-" + Date.now(),
          author: "Bikash Kumar Yadav",
          avatarRole: "Super Admin",
          text: `Officially signed off governance gate: ${targetGate?.title || gateId} (${authStamp})`,
          time: "Just now",
        };
        const updatedComments = [auditComment, ...(t.comments || [])];

        const updatedTask = {
          ...t,
          approvalGates: updatedGates,
          comments: updatedComments,
        };

        if (selectedTaskDetail?.id === taskId) {
          setSelectedTaskDetail(updatedTask);
        }
        return updatedTask;
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
        dispatchTaskSync(updated);
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
    dispatchTaskSync(updatedTask);
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

    const finalAssignee = isInvitingViaEmail && newTaskInviteEmail.trim()
      ? `${newTaskInviteEmail.trim().split("@")[0]} (Invited)`
      : newTaskAssignee;

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

    if (isInvitingViaEmail && newTaskInviteEmail.trim()) {
      setInviteNotice(`Invited ${newTaskInviteEmail.trim()} to project folder!`);
      setTimeout(() => setInviteNotice(null), 4000);
    }

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
    setIsInvitingViaEmail(false);
    setNewTaskInviteEmail("");
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

  const teamPulseData = [
    {
      name: "Bikash Kumar Yadav",
      initials: "B",
      role: "Lead Architect",
      tasksCount: 4,
      loadPercentage: 85,
      statusLabel: "Optimal",
      statusColor: "#10B981",
      avatarBg: "#6366F1",
    },
    {
      name: "Elena Rostova",
      initials: "E",
      role: "Frontend Engineer",
      tasksCount: 5,
      loadPercentage: 92,
      statusLabel: "High Load",
      statusColor: "#F59E0B",
      avatarBg: "#EC4899",
    },
    {
      name: "Marcus Lee",
      initials: "M",
      role: "Product Manager",
      tasksCount: 2,
      loadPercentage: 60,
      statusLabel: "Available",
      statusColor: "#3B82F6",
      avatarBg: "#10B981",
    },
    {
      name: "David Kim",
      initials: "D",
      role: "QA / Systems",
      tasksCount: 1,
      loadPercentage: 40,
      statusLabel: "Available",
      statusColor: "#10B981",
      avatarBg: "#8B5CF6",
    },
  ];

  const renderTeamPulseMeter = () => (
    <View style={styles.pulseCard}>
      <View style={styles.pulseCardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={[styles.pulseIconBadge, { backgroundColor: "rgba(117, 110, 243, 0.15)" }]}>
            <ActivityPulseIcon size={16} color={COLORS.primary} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.pulseCardTitle}>Team Workload Pulse</Text>
            <Text style={styles.pulseCardSubtitle}>Active capacity & bandwidth monitor</Text>
          </View>
        </View>
        <View style={styles.pulseCountBadge}>
          <Text style={styles.pulseCountBadgeText}>{teamPulseData.length} Team</Text>
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        {teamPulseData.map((member) => (
          <View key={member.name} style={styles.pulseMemberRow}>
            <View style={[styles.pulseMemberAvatar, { backgroundColor: member.avatarBg }]}>
              <Text style={styles.pulseMemberAvatarText}>{member.initials}</Text>
              <View style={[styles.pulseOnlineStatusDot, { backgroundColor: member.statusColor }]} />
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={styles.pulseMemberName}>{member.name}</Text>
                  <Text style={styles.pulseMemberRole}>{member.role} • {member.tasksCount} active tasks</Text>
                </View>
                <View style={[styles.pulseLoadPill, { backgroundColor: member.statusColor + "1A" }]}>
                  <Text style={[styles.pulseLoadPillText, { color: member.statusColor }]}>
                    {member.statusLabel} ({member.loadPercentage}%)
                  </Text>
                </View>
              </View>

              <View style={styles.pulseProgressBarBg}>
                <View
                  style={[
                    styles.pulseProgressBarFill,
                    {
                      width: `${member.loadPercentage}%`,
                      backgroundColor: member.statusColor,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderLiveActivityStream = () => (
    <View style={styles.pulseCard}>
      <View style={styles.pulseCardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={[styles.pulseIconBadge, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
            <ClockIcon size={14} color="#3B82F6" />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.pulseCardTitle}>Live Activity Audit</Text>
            <Text style={styles.pulseCardSubtitle}>Cloud synchronization event trail</Text>
          </View>
        </View>
        <View style={styles.pulseLiveIndicator}>
          <View style={styles.pulseLiveDot} />
          <Text style={styles.pulseLiveText}>Live Sync</Text>
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        {activityEvents.map((evt, idx) => (
          <View key={evt.id} style={[styles.activityEventRow, idx === activityEvents.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={[styles.activityAvatarBadge, { backgroundColor: evt.color }]}>
              <Text style={styles.activityAvatarText}>{evt.user.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.activityDescription}>
                <Text style={styles.activityUserText}>{evt.user}</Text>
                <Text style={styles.activityActionText}> {evt.action} </Text>
                <Text style={styles.activityTargetText}>{evt.target}</Text>
              </Text>
              <Text style={styles.activityTimeText}>{evt.time} • {evt.role}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderKanbanBoard = () => {
    const columns = [
      {
        id: "backlog",
        title: "Backlog",
        color: "#64748B",
        tasks: tasks.filter((t) => t.status === "in_progress" && t.progress <= 50),
      },
      {
        id: "in_progress",
        title: "In Progress",
        color: "#3B82F6",
        tasks: tasks.filter((t) => t.status === "in_progress" && t.progress > 50),
      },
      {
        id: "in_review",
        title: "Under Review",
        color: "#F59E0B",
        tasks: tasks.filter((t) => t.status === "in_review"),
      },
      {
        id: "done",
        title: "Completed",
        color: "#10B981",
        tasks: tasks.filter((t) => t.status === "completed"),
      },
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.kanbanScrollContainer}
      >
        {columns.map((col) => (
          <View key={col.id} style={styles.kanbanColumn}>
            <View style={styles.kanbanColumnHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={[styles.kanbanColumnDot, { backgroundColor: col.color }]} />
                <Text style={styles.kanbanColumnTitle}>{col.title}</Text>
              </View>
              <View style={[styles.kanbanCounterBadge, { backgroundColor: col.color + "20" }]}>
                <Text style={[styles.kanbanCounterText, { color: col.color }]}>
                  {col.tasks.length}
                </Text>
              </View>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              nestedScrollEnabled={true}
              overScrollMode="never"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 130 }}
            >
              {col.tasks.length === 0 ? (
                <View style={styles.kanbanEmptyColumn}>
                  <Text style={styles.kanbanEmptyText}>No tasks in {col.title.toLowerCase()}</Text>
                </View>
              ) : (
                col.tasks.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    activeOpacity={0.85}
                    onPress={() => {
                      triggerHaptic("selection");
                      setSelectedTaskDetail(task);
                      setSelectedTask(task);
                    }}
                    style={styles.kanbanCard}
                  >
                    <View style={styles.kanbanCardHeader}>
                      <View style={styles.kanbanProjectPill}>
                        <Text style={styles.kanbanProjectText}>{task.project}</Text>
                      </View>
                      {task.priority === "critical" && (
                        <View style={[styles.priorityDot, { backgroundColor: "#EF4444" }]} />
                      )}
                      {task.priority === "high" && (
                        <View style={[styles.priorityDot, { backgroundColor: "#F59E0B" }]} />
                      )}
                    </View>

                    <Text style={styles.kanbanCardTitle} numberOfLines={2}>
                      {task.title}
                    </Text>

                    <View style={{ marginTop: 8 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                        <Text style={styles.kanbanProgressLabel}>Progress</Text>
                        <Text style={styles.kanbanProgressPercent}>{task.progress}%</Text>
                      </View>
                      <View style={styles.kanbanProgressBarBg}>
                        <View
                          style={[
                            styles.kanbanProgressBarFill,
                            {
                              width: `${task.progress}%`,
                              backgroundColor: col.color,
                            },
                          ]}
                        />
                      </View>
                    </View>

                    <View style={styles.kanbanCardFooter}>
                      <Text style={styles.kanbanStepCount}>
                        {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} steps
                      </Text>
                      <View style={[styles.kanbanAssigneeBadge, { backgroundColor: COLORS.primaryLight }]}>
                        <Text style={[styles.kanbanAssigneeText, { color: COLORS.primary }]}>
                          {(task.assignee || "Bikash").split(" ")[0]}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderTaskDetailModal = () => {
    if (!selectedTaskDetail) return null;

    const completedCount = selectedTaskDetail.subtasks.filter((s) => s.completed).length;
    const totalCount = selectedTaskDetail.subtasks.length;
    const taskComments = selectedTaskDetail.comments || [];

    return (
      <Modal
        visible={!!selectedTaskDetail}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedTaskDetail(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              {
                height: SCREEN_HEIGHT * 0.88,
                maxHeight: SCREEN_HEIGHT * 0.88,
                padding: 0,
                paddingHorizontal: 0,
                overflow: "hidden",
                backgroundColor: isDarkMode ? "#131C2E" : "#FFFFFF",
              },
            ]}
          >
            <View style={[styles.sheetHandleBar, { alignSelf: "center", marginTop: 10 }]} />

            <View style={[styles.modalHeader, { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 10 }]}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1, marginRight: 10 }}>
                <View style={styles.projectTagPill}>
                  <Text style={styles.projectTagText}>{selectedTaskDetail.project}</Text>
                </View>
                <View
                  style={[
                    styles.detailPriorityPill,
                    selectedTaskDetail.priority === "critical" && { backgroundColor: "rgba(239, 68, 68, 0.15)" },
                    selectedTaskDetail.priority === "high" && { backgroundColor: "rgba(245, 158, 11, 0.15)" },
                    selectedTaskDetail.priority === "medium" && { backgroundColor: "rgba(59, 130, 246, 0.15)" },
                  ]}
                >
                  <Text
                    style={[
                      styles.detailPriorityPillText,
                      selectedTaskDetail.priority === "critical" && { color: "#EF4444" },
                      selectedTaskDetail.priority === "high" && { color: "#F59E0B" },
                      selectedTaskDetail.priority === "medium" && { color: "#3B82F6" },
                    ]}
                  >
                    {selectedTaskDetail.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("light");
                  setSelectedTaskDetail(null);
                }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.modalCloseBtn}
              >
                <XIcon size={18} color={COLORS.navy} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
            >
              <Text style={styles.taskDetailSheetTitle}>{selectedTaskDetail.title}</Text>

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>LIFECYCLE STATUS</Text>
              <View style={styles.detailStatusSegmentRow}>
                {[
                  { key: "in_progress", label: "In Progress", color: "#3B82F6" },
                  { key: "in_review", label: "Under Review", color: "#F59E0B" },
                  { key: "completed", label: "Completed", color: "#10B981" },
                ].map((st) => {
                  const isActive = selectedTaskDetail.status === st.key;
                  return (
                    <TouchableOpacity
                      key={st.key}
                      onPress={() =>
                        handleStatusChangeInDetail(
                          selectedTaskDetail.id,
                          st.key as "in_progress" | "in_review" | "completed"
                        )
                      }
                      style={[
                        styles.detailStatusSegmentBtn,
                        isActive && { backgroundColor: st.color, borderColor: st.color },
                      ]}
                    >
                      <Text
                        style={[
                          styles.detailStatusSegmentText,
                          isActive && { color: "#FFFFFF", fontWeight: "bold" },
                        ]}
                      >
                        {st.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {selectedTaskDetail.description && (
                <View style={{ marginTop: 14 }}>
                  <Text style={styles.inputLabel}>TASK SCOPE & SPECIFICATION</Text>
                  <View style={styles.taskDescriptionBox}>
                    <Text style={styles.taskDescriptionText}>{selectedTaskDetail.description}</Text>
                  </View>
                </View>
              )}

              <View style={{ marginTop: 16 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <Text style={styles.inputLabel}>
                    CHECKLIST ({completedCount}/{totalCount}) - TAP TO TOGGLE
                  </Text>
                  <Text style={styles.checklistProgressText}>{selectedTaskDetail.progress}% Complete</Text>
                </View>

                {selectedTaskDetail.subtasks.map((step) => (
                  <TouchableOpacity
                    key={step.id}
                    activeOpacity={0.7}
                    onPress={() => toggleSubtask(selectedTaskDetail.id, step.id)}
                    style={styles.detailChecklistRow}
                  >
                    <View style={{ marginRight: 10 }}>
                      {step.completed ? (
                        <CheckCircleFilledIcon size={20} color={COLORS.accentGreen} />
                      ) : (
                        <View style={styles.uncheckedCircle} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.detailChecklistText,
                        step.completed && styles.detailChecklistTextCompleted,
                      ]}
                    >
                      {step.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ marginTop: 16 }}>
                <Text style={styles.inputLabel}>ASSIGNED SPECIALIST</Text>
                <View style={styles.detailAssigneeCard}>
                  <View style={[styles.pulseMemberAvatar, { backgroundColor: "#6366F1" }]}>
                    <Text style={styles.pulseMemberAvatarText}>
                      {(selectedTaskDetail.assignee || "Bikash").charAt(0)}
                    </Text>
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.pulseMemberName}>
                      {selectedTaskDetail.assignee || "Bikash Kumar Yadav"}
                    </Text>
                    <Text style={styles.pulseMemberRole}>Project Specialist • TaskPulse Core</Text>
                  </View>
                  <View style={styles.detailVerifiedTag}>
                    <Text style={styles.detailVerifiedTagText}>Assigned</Text>
                  </View>
                </View>
              </View>

              {/* Enterprise Governance Sign-Off Gates & SLA */}
              <GovernanceGatesSection
                priority={selectedTaskDetail.priority}
                gates={getDefaultGatesForTask(selectedTaskDetail)}
                isDarkMode={isDarkMode}
                onSignGate={(gateId) => handleSignApprovalGate(selectedTaskDetail.id, gateId)}
                triggerHaptic={triggerHaptic}
              />

              {/* Enterprise Threaded Discussions & Client/Guest Portal Safe View */}
              <EnterpriseThreadedDiscussionSection
                taskId={selectedTaskDetail.id}
                taskTitle={selectedTaskDetail.title}
                isDarkMode={isDarkMode}
                currentUserRole={currentUser?.role === "admin" ? "Super Admin" : "Tech Lead"}
                currentUserName={currentUser?.name || "Bikash Kumar Yadav"}
                triggerHaptic={triggerHaptic}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCelebrationModal = () => {
    if (!showCelebration) return null;
    return (
      <View style={styles.celebrationToast}>
        <View style={styles.celebrationIconWrap}>
          <CheckCircleFilledIcon size={22} color="#10B981" />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.celebrationTitle}>Deliverable Completed</Text>
          <Text style={styles.celebrationSubtitle}>
            Synchronized with team audit stream & metrics updated
          </Text>
        </View>
      </View>
    );
  };

  // AUTHENTICATION & FIRST-TIME ENTRANCE VIEW (When user is not logged in)
  if (!currentUser) {
    return (
      <View style={{ flex: 1, backgroundColor: isDarkMode ? "#0B0F19" : COLORS.white }}>
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
              <View style={[styles.authThemeToggle, isDarkMode ? styles.themeToggleDark : styles.themeToggleLight]}>
                <AnimatedThemeToggle
                  isDarkMode={isDarkMode}
                  size={16}
                  onPress={() => {
                    triggerHaptic("selection");
                    setIsDarkMode((prev) => !prev);
                  }}
                />
              </View>
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

              {/* Fast Switch Demo Profiles */}
              <Text style={[styles.inputLabel, { marginTop: 20 }]}>DEMO PROFILES (FAST LOGIN):</Text>
              <View style={styles.quickAccountsRow}>
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
                  <Text style={styles.quickAccountChipText}>Elena (Specialist)</Text>
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
        {isBooting && (
          <MobileBootSplash
            isDarkMode={isDarkMode}
            durationMs={2600}
            onBootComplete={() => setIsBooting(false)}
          />
        )}
      </View>
    );
  }

  // MAIN AUTHENTICATED APP SCREEN
  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? "#0B0F19" : COLORS.white }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={COLORS.white} />

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={openDrawer}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.iconCircleButton}
        >
          <Animated.View
            style={{
              transform: [
                {
                  rotate: gridSpinAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "90deg"],
                  }),
                },
              ],
            }}
          >
            <GridIcon size={18} color={COLORS.navy} />
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.dateRow}>
          <View style={{ marginRight: 5 }}><CalendarIcon size={13} color={COLORS.primary} /></View>
          <Text style={styles.dateTitle}>Friday, 26 Sep</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {/* Dark / Light Mode Toggle Buttons (Always on Top) */}
          <ThemeToggleBar
            isDarkMode={isDarkMode}
            onToggle={() => {
              triggerHaptic("selection");
              setIsDarkMode((prev) => !prev);
            }}
            onSelectLight={() => {
              triggerHaptic("selection");
              setIsDarkMode(false);
            }}
            onSelectDark={() => {
              triggerHaptic("selection");
              setIsDarkMode(true);
            }}
          />

          {/* Animated Notification Bell Button */}
          <AnimatedBellButton
            isDarkMode={isDarkMode}
            hasUnread={true}
            onPress={() => {
              triggerHaptic("selection");
              setIsNotificationsOpen(true);
            }}
          />
        </View>
      </View>

      {/* Main Content Area */}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!(currentTab === "projects" && projectTabMode === "board" && !selectedProjectView)}
        >
        {/* Email Invitation Notice Banner */}
        {inviteNotice && (
          <View style={{ marginHorizontal: 20, marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: "#10B981", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <MailIcon size={16} color="#FFFFFF" />
              <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "bold", marginLeft: 8 }}>{inviteNotice}</Text>
            </View>
            <TouchableOpacity onPress={() => setInviteNotice(null)}>
              <XIcon size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

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
                  navigateForward("profile");
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
                navigateForward("projects", { project: projects.length > 0 ? projects[0] : null });
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

            {/* Team Workload Pulse Meter */}
            {renderTeamPulseMeter()}

            {/* Live Sync Activity Stream */}
            {renderLiveActivityStream()}

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
                  setSelectedTaskDetail(task);
                  setSelectedTask(task);
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
                  handleGoBack();
                }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.backButton}
              >
                <ArrowLeftIcon size={20} color={COLORS.navy} />
              </TouchableOpacity>
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text style={styles.detailsHeaderTitle} numberOfLines={1}>
                  {selectedProjectView.name} Folder
                </Text>
                <Text style={styles.projectCategory}>
                  {selectedProjectView.department} • {selectedProjectView.code} Dossier
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
                    setSelectedTaskDetail(task);
                    setSelectedTask(task);
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

            {/* View Mode Switcher Segment Bar */}
            <View style={{ marginBottom: 12, paddingHorizontal: 2 }}>
              <View style={[styles.viewModeToggleWrap, { width: "100%" }]}>
                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic("selection");
                    setProjectTabMode("list");
                  }}
                  style={[styles.viewModeToggleBtn, { flex: 1, justifyContent: "center" }, projectTabMode === "list" && styles.viewModeToggleBtnActive]}
                >
                  <ListIcon size={14} color={projectTabMode === "list" ? "#FFFFFF" : COLORS.navy} />
                  <Text style={[styles.viewModeToggleText, projectTabMode === "list" && styles.viewModeToggleTextActive]}>List</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic("selection");
                    setProjectTabMode("board");
                  }}
                  style={[styles.viewModeToggleBtn, { flex: 1, justifyContent: "center" }, projectTabMode === "board" && styles.viewModeToggleBtnActive]}
                >
                  <BoardIcon size={14} color={projectTabMode === "board" ? "#FFFFFF" : COLORS.navy} />
                  <Text style={[styles.viewModeToggleText, projectTabMode === "board" && styles.viewModeToggleTextActive]}>Board</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic("selection");
                    setProjectTabMode("timeline");
                  }}
                  style={[styles.viewModeToggleBtn, { flex: 1, justifyContent: "center" }, projectTabMode === "timeline" && styles.viewModeToggleBtnActive]}
                >
                  <TimelineIcon size={14} color={projectTabMode === "timeline" ? "#FFFFFF" : COLORS.navy} />
                  <Text style={[styles.viewModeToggleText, projectTabMode === "timeline" && styles.viewModeToggleTextActive]}>Timeline</Text>
                </TouchableOpacity>
              </View>
            </View>

            {projectTabMode === "timeline" ? (
              <GanttTimelineView
                isDark={isDarkMode}
                onSelectProject={(projId) => {
                  const found = projects.find((p) => p.id === projId);
                  if (found) {
                    setSelectedProjectView(found);
                  }
                }}
                triggerHaptic={triggerHaptic}
              />
            ) : projectTabMode === "board" ? (
              renderKanbanBoard()
            ) : (
              <>
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
                      <View key={proj.id} style={{ marginTop: 14 }}>
                        {/* Visual Project Folder Tab */}
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <View style={[styles.folderTabHeader, { backgroundColor: proj.color }]}>
                            <FolderIcon size={12} color="#FFFFFF" />
                            <Text style={styles.folderTabHeaderText}>{proj.code} FOLDER</Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            triggerHaptic("selection");
                            navigateForward("projects", { project: proj });
                          }}
                          style={[styles.projectCard, { marginTop: 0, borderTopLeftRadius: 0 }]}
                        >
                          <View style={styles.projectCardHeader}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                              <View style={[styles.projectCodeBadge, { backgroundColor: proj.color + "25" }]}>
                                <Text style={[styles.projectCodeBadgeText, { color: proj.color }]}>{proj.code}</Text>
                              </View>
                              <View style={{ marginLeft: 10 }}>
                                <Text style={styles.projectName}>{proj.name}</Text>
                                <Text style={styles.projectCategory}>{proj.category} • {proj.department}</Text>
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
                      </View>
                    );
                  })}
              </>
            )}
          </View>
        )}

        {/* TASK DETAILS SCREEN */}
        {currentTab === "details" && selectedTask && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailsHeaderRow}>
              <TouchableOpacity
                onPress={() => {
                  handleGoBack();
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
                    <Text style={styles.reviewBannerTitle}>Submitted for Project Manager Review</Text>
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

              {/* Enterprise Governance Sign-Off Gates & SLA */}
              <GovernanceGatesSection
                priority={selectedTask.priority}
                gates={getDefaultGatesForTask(selectedTask)}
                isDarkMode={isDarkMode}
                onSignGate={(gateId) => handleSignApprovalGate(selectedTask.id, gateId)}
                triggerHaptic={triggerHaptic}
              />

              {/* Enterprise Threaded Discussions & Client/Guest Portal Safe View */}
              <EnterpriseThreadedDiscussionSection
                taskId={selectedTask.id}
                taskTitle={selectedTask.title}
                isDarkMode={isDarkMode}
                currentUserRole={currentUser?.role === "admin" ? "Super Admin" : "Tech Lead"}
                currentUserName={currentUser?.name || "Bikash Kumar Yadav"}
                triggerHaptic={triggerHaptic}
              />
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

            {/* Enterprise Suite & Governance */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsHeaderTitle}>Enterprise Suite & Governance</Text>

              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("selection");
                  setProjectTabMode("timeline");
                  setCurrentTab("projects");
                }}
                style={styles.settingRow}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ marginRight: 8 }}>
                    <TimelineIcon size={18} color={COLORS.primary} />
                  </View>
                  <Text style={styles.settingLabel}>Executive Portfolio Timeline</Text>
                </View>
                <ChevronRightIcon size={16} color={COLORS.muted} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("selection");
                  setIsEnterpriseAuditModalOpen(true);
                }}
                style={styles.settingRow}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ marginRight: 8 }}>
                    <ShieldCheckIcon size={18} color="#10B981" />
                  </View>
                  <Text style={styles.settingLabel}>SOC 2 Immutable Audit & RBAC</Text>
                </View>
                <ChevronRightIcon size={16} color={COLORS.muted} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("selection");
                  setIsAnalyticsModalOpen(true);
                }}
                style={styles.settingRow}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ marginRight: 8 }}>
                    <BarChartIcon size={18} color="#6366F1" />
                  </View>
                  <Text style={styles.settingLabel}>Corporate Analytics & Board Briefing</Text>
                </View>
                <ChevronRightIcon size={16} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            {/* Appearance & System Preferences */}
            <View style={[styles.settingsSection, { marginTop: 14 }]}>
              <Text style={styles.settingsHeaderTitle}>Preferences & Controls</Text>

              <View style={styles.settingRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={[styles.drawerIconBadge, isDarkMode ? styles.themeToggleDark : styles.themeToggleLight, { marginRight: 8 }]}>
                    {isDarkMode ? <SunIcon size={16} color="#F59E0B" /> : <MoonIcon size={16} color="#4338CA" />}
                  </View>
                  <Text style={styles.settingLabel}>Dark Theme Mode</Text>
                </View>
                <AnimatedToggleSwitch
                  value={isDarkMode}
                  onValueChange={(v) => {
                    triggerHaptic("selection");
                    setIsDarkMode(v);
                  }}
                  isDarkMode={isDarkMode}
                  activeColor={COLORS.primary}
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Responsive Haptic Feedback</Text>
                <AnimatedToggleSwitch
                  value={true}
                  onValueChange={() => triggerHaptic("light")}
                  isDarkMode={isDarkMode}
                  activeColor="#10B981"
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <AnimatedToggleSwitch
                  value={pushEnabled}
                  onValueChange={(v) => {
                    triggerHaptic("light");
                    setPushEnabled(v);
                  }}
                  isDarkMode={isDarkMode}
                  activeColor="#10B981"
                />
              </View>

              {/* Log Out / Switch Account Button */}
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("selection");
                  setCurrentUser(null);
                  setAuthTab("signin");
                  setNavHistory([]);
                  setSelectedProjectView(null);
                }}
                style={styles.logoutBtn}
              >
                <Text style={styles.logoutBtnText}>Switch Account / Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </Animated.View>

      {/* Taskcy Bottom Navigation Dock with Animated Spring Tabs */}
      <View style={styles.bottomNav}>
        <AnimatedTabItem
          label="Home"
          isActive={currentTab === "home"}
          COLORS={COLORS}
          onPress={() => {
            triggerHaptic("selection");
            navigateForward("home", { project: null });
          }}
          renderIcon={(color) => <HomeIcon size={22} color={color} />}
        />

        <AnimatedTabItem
          label="Projects"
          isActive={currentTab === "projects"}
          COLORS={COLORS}
          onPress={() => {
            triggerHaptic("selection");
            navigateForward("projects", { project: null });
          }}
          renderIcon={(color) => <FolderIcon size={22} color={color} />}
        />

        {/* Center Floating + Button */}
        <View style={styles.centerAddButtonContainer}>
          <AnimatedAddButton
            size={50}
            color="#FFFFFF"
            bg={COLORS.primary}
            onPress={() => {
              triggerHaptic("selection");
              setCreateType("task");
              setIsCreateOpen(true);
            }}
          />
        </View>

        <AnimatedTabItem
          label="Profile"
          isActive={currentTab === "profile"}
          COLORS={COLORS}
          onPress={() => {
            triggerHaptic("selection");
            navigateForward("profile");
          }}
          renderIcon={(color) => <UserIcon size={22} color={color} />}
        />
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

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>ASSIGN TO / INVITE VIA EMAIL</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row", gap: 6, marginVertical: 6 }}>
                  {["Bikash Sharma", "Elena Rostova", "Marcus Vance", "Sarah Chen"].map((member) => {
                    const isSelected = !isInvitingViaEmail && newTaskAssignee === member;
                    return (
                      <TouchableOpacity
                        key={member}
                        onPress={() => {
                          triggerHaptic("selection");
                          setIsInvitingViaEmail(false);
                          setNewTaskAssignee(member);
                        }}
                        style={[
                          styles.filterChip,
                          isSelected && styles.filterChipActive,
                          { paddingHorizontal: 12, paddingVertical: 6 },
                        ]}
                      >
                        <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                          {member}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity
                    onPress={() => {
                      triggerHaptic("selection");
                      setIsInvitingViaEmail(true);
                    }}
                    style={[
                      styles.filterChip,
                      isInvitingViaEmail && styles.filterChipActive,
                      { paddingHorizontal: 12, paddingVertical: 6, borderColor: COLORS.primary },
                    ]}
                  >
                    <Text style={[styles.filterChipText, isInvitingViaEmail && styles.filterChipTextActive]}>
                      + Invite via Email
                    </Text>
                  </TouchableOpacity>
                </ScrollView>

                {isInvitingViaEmail && (
                  <View style={{ marginVertical: 6, padding: 12, backgroundColor: COLORS.primaryLight, borderRadius: 12, borderWidth: 1, borderColor: COLORS.primary + "40" }}>
                    <Text style={[styles.inputLabel, { color: COLORS.primary, marginBottom: 4 }]}>COLLEAGUE EMAIL ADDRESS</Text>
                    <TextInput
                      placeholder="e.g. alex.morgan@taskpulse.io"
                      placeholderTextColor={COLORS.muted}
                      value={newTaskInviteEmail}
                      onChangeText={setNewTaskInviteEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[styles.textInput, { backgroundColor: COLORS.white, height: 40, color: COLORS.navy }]}
                    />
                    <Text style={{ fontSize: 10, color: COLORS.primary, marginTop: 4 }}>
                      An invitation will be dispatched with direct project folder access.
                    </Text>
                  </View>
                )}

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

      {/* DRAWER MENU MODAL WITH PHYSICS SLIDE-IN */}
      <Modal
        visible={isDrawerOpen}
        animationType="none"
        transparent
        onRequestClose={closeDrawer}
      >
        <Animated.View style={[styles.drawerModalOverlay, { opacity: drawerFadeAnim }]}>
          <Animated.View
            style={[
              styles.drawerSheetContainer,
              {
                transform: [{ translateX: drawerSlideAnim }],
              },
            ]}
          >
            <ScrollView
              style={styles.drawerScrollView}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              bounces={true}
              overScrollMode="always"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.drawerScrollContent}
            >
              {/* Executive Header */}
              <View style={styles.drawerHeader}>
                <View style={styles.drawerUserRow}>
                  <View style={{ position: "relative" }}>
                    <Image source={BIKASH_AVATAR} style={styles.drawerAvatar} />
                    <View style={styles.drawerOnlineDot} />
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.drawerUserName} numberOfLines={1}>
                      {currentUser.name}
                    </Text>
                    <Text style={styles.drawerUserEmail} numberOfLines={1}>
                      {currentUser.email}
                    </Text>
                    <View style={styles.drawerRolePill}>
                      <ShieldCheckIcon size={12} color="#10B981" />
                      <Text style={styles.drawerRolePillText}>
                        {currentUser.role.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={closeDrawer}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    style={styles.drawerCloseButton}
                  >
                    <XIcon size={16} color={COLORS.navy} />
                  </TouchableOpacity>
                </View>

                {/* Organization Dossier Badge */}
                <View style={styles.drawerOrgCard}>
                  <View style={styles.drawerOrgIconWrap}>
                    <BuildingIcon size={16} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.drawerOrgTitle} numberOfLines={1}>
                      {currentUser.organization}
                    </Text>
                    <Text style={styles.drawerOrgSub}>
                      Workspace: tp-core-enterprise
                    </Text>
                  </View>
                </View>
              </View>

              {/* Sprint Health & Pulse Overview */}
              <View style={styles.drawerSection}>
                <Text style={styles.drawerSectionLabel}>SPRINT HEALTH PULSE</Text>
                <View style={styles.drawerMetricsRow}>
                  <View style={styles.drawerMetricItem}>
                    <Text style={[styles.drawerMetricNum, { color: COLORS.accentBlue }]}>
                      {tasks.filter((t) => t.status === "in_progress").length}
                    </Text>
                    <Text style={styles.drawerMetricLabel}>Active</Text>
                  </View>
                  <View style={styles.drawerMetricDivider} />
                  <View style={styles.drawerMetricItem}>
                    <Text style={[styles.drawerMetricNum, { color: "#F59E0B" }]}>
                      {tasks.filter((t) => t.status === "in_review").length}
                    </Text>
                    <Text style={styles.drawerMetricLabel}>Review</Text>
                  </View>
                  <View style={styles.drawerMetricDivider} />
                  <View style={styles.drawerMetricItem}>
                    <Text style={[styles.drawerMetricNum, { color: "#10B981" }]}>
                      {tasks.filter((t) => t.status === "completed").length}
                    </Text>
                    <Text style={styles.drawerMetricLabel}>Done</Text>
                  </View>
                </View>
              </View>

              {/* Enterprise Governance & Operations */}
              <View style={styles.drawerSection}>
                <Text style={styles.drawerSectionLabel}>ENTERPRISE SUITE</Text>

                {/* Executive Portfolio Timeline */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => {
                    triggerHaptic("selection");
                    closeDrawer();
                    setProjectTabMode("timeline");
                    setCurrentTab("projects");
                  }}
                  style={styles.drawerActionCard}
                >
                  <View style={[styles.drawerActionIconWrap, { backgroundColor: "rgba(117, 110, 243, 0.12)" }]}>
                    <TimelineIcon size={18} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.drawerActionTitle}>Executive Timeline</Text>
                    <Text style={styles.drawerActionSub}>Gantt roadmap & milestones</Text>
                  </View>
                  <View style={styles.drawerBadgePill}>
                    <Text style={styles.drawerBadgePillText}>Gantt</Text>
                  </View>
                </TouchableOpacity>

                {/* Enterprise RBAC & SOC 2 Audit */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => {
                    triggerHaptic("selection");
                    closeDrawer();
                    setIsEnterpriseAuditModalOpen(true);
                  }}
                  style={styles.drawerActionCard}
                >
                  <View style={[styles.drawerActionIconWrap, { backgroundColor: "rgba(16, 185, 129, 0.12)" }]}>
                    <ShieldCheckIcon size={18} color="#10B981" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.drawerActionTitle}>Enterprise Governance</Text>
                    <Text style={styles.drawerActionSub}>SOC 2 ledger & RBAC matrix</Text>
                  </View>
                  <View style={[styles.drawerBadgePill, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
                    <Text style={[styles.drawerBadgePillText, { color: "#10B981" }]}>SOC 2</Text>
                  </View>
                </TouchableOpacity>

                {/* Corporate Analytics & Board Export */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => {
                    triggerHaptic("selection");
                    closeDrawer();
                    setIsAnalyticsModalOpen(true);
                  }}
                  style={styles.drawerActionCard}
                >
                  <View style={[styles.drawerActionIconWrap, { backgroundColor: "rgba(99, 102, 241, 0.12)" }]}>
                    <BarChartIcon size={18} color="#6366F1" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.drawerActionTitle}>Executive Analytics</Text>
                    <Text style={styles.drawerActionSub}>Velocity, SLA & Board export</Text>
                  </View>
                  <View style={[styles.drawerBadgePill, { backgroundColor: "rgba(99, 102, 241, 0.15)" }]}>
                    <Text style={[styles.drawerBadgePillText, { color: "#6366F1" }]}>Board PDF</Text>
                  </View>
                </TouchableOpacity>

                {/* Workspace Settings */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => {
                    triggerHaptic("selection");
                    closeDrawer();
                    setOnboardingStep(2);
                    setIsOnboardingModalOpen(true);
                  }}
                  style={styles.drawerActionCard}
                >
                  <View style={[styles.drawerActionIconWrap, { backgroundColor: "rgba(59, 130, 246, 0.12)" }]}>
                    <SlidersIcon size={18} color="#3B82F6" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.drawerActionTitle}>Workspace Settings</Text>
                    <Text style={styles.drawerActionSub}>Manage team, roles & workstreams</Text>
                  </View>
                  <View style={[styles.drawerBadgePill, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
                    <Text style={[styles.drawerBadgePillText, { color: "#3B82F6" }]}>Admin</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Quick Jump Workstreams */}
              <View style={styles.drawerSection}>
                <Text style={styles.drawerSectionLabel}>QUICK WORKSTREAMS</Text>
                {[
                  { name: "All Projects", count: `${projects.length} streams`, dep: "All" },
                  { name: "Engineering Core", count: "3 projects", dep: "Engineering" },
                  { name: "Design & UX Systems", count: "2 projects", dep: "Design" },
                  { name: "Growth & Marketing", count: "2 projects", dep: "Marketing" },
                ].map((ws) => (
                  <TouchableOpacity
                    key={ws.name}
                    activeOpacity={0.7}
                    onPress={() => {
                      triggerHaptic("selection");
                      closeDrawer();
                      setProjectFilter(ws.dep);
                      setCurrentTab("projects");
                    }}
                    style={styles.drawerWorkstreamRow}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <LayersIcon size={15} color={COLORS.muted} />
                      <Text style={styles.drawerWorkstreamName}>{ws.name}</Text>
                    </View>
                    <Text style={styles.drawerWorkstreamCount}>{ws.count}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Footer & Cloud Sync Status */}
              <View style={styles.drawerFooter}>
                <View style={styles.drawerSyncRow}>
                  <View style={styles.drawerSyncDot} />
                  <Text style={styles.drawerSyncText}>Cloud Sync: Connected (Real-time)</Text>
                </View>
                <Text style={styles.drawerVersionText}>TaskPulse Mobile v2.4.0 • Enterprise Edition</Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    triggerHaptic("selection");
                    closeDrawer();
                    setCurrentUser(null);
                    setAuthTab("signin");
                    setNavHistory([]);
                    setSelectedProjectView(null);
                  }}
                  style={styles.drawerLogoutButton}
                >
                  <UsersIcon size={16} color="#EF4444" />
                  <Text style={styles.drawerLogoutText}>Switch Account / Sign Out</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeDrawer}
            style={styles.drawerBackdropTap}
          />
        </Animated.View>
      </Modal>

      {/* INTERACTIVE TASK DETAIL BOTTOM SHEET */}
      {renderTaskDetailModal()}

      {/* CELEBRATION TOAST FEEDBACK */}
      {renderCelebrationModal()}

      {/* ENTERPRISE AUDIT & RBAC MODAL */}
      <EnterpriseAuditAndRbacModal
        visible={isEnterpriseAuditModalOpen}
        isDarkMode={isDarkMode}
        onClose={() => setIsEnterpriseAuditModalOpen(false)}
        triggerHaptic={triggerHaptic}
      />

      {/* CORPORATE ANALYTICS & BOARD EXPORT MODAL */}
      <CorporateAnalyticsExportModal
        visible={isAnalyticsModalOpen}
        isDarkMode={isDarkMode}
        onClose={() => setIsAnalyticsModalOpen(false)}
        triggerHaptic={triggerHaptic}
      />
      </SafeAreaView>
      {isBooting && (
        <MobileBootSplash
          isDarkMode={isDarkMode}
          durationMs={2600}
          onBootComplete={() => setIsBooting(false)}
        />
      )}
    </View>
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
      borderColor: COLORS.cardBorder,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.cardSecondary,
    },
    themeToggleLight: {
      backgroundColor: "#F1F5F9",
      borderColor: "#CBD5E1",
      borderWidth: 1.2,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 2,
    },
    themeToggleDark: {
      backgroundColor: "#1E293B",
      borderColor: "#334155",
      borderWidth: 1.2,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    drawerIconBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
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
    folderTabHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      alignSelf: "flex-start",
      marginBottom: -1,
      zIndex: 2,
    },
    folderTabHeaderText: {
      fontSize: 10,
      fontFamily: "monospace",
      fontWeight: "700",
      color: "#FFFFFF",
      marginLeft: 4,
      letterSpacing: 0.5,
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
    drawerModalOverlay: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      flexDirection: "row",
    },
    drawerBackdropTap: {
      width: SCREEN_WIDTH * 0.18,
      height: SCREEN_HEIGHT,
    },
    drawerSheetContainer: {
      width: SCREEN_WIDTH * 0.82,
      height: SCREEN_HEIGHT,
      maxHeight: SCREEN_HEIGHT,
      backgroundColor: COLORS.card,
      borderTopRightRadius: 24,
      borderBottomRightRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
      elevation: 16,
      shadowColor: "#000",
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      overflow: "hidden",
    },
    drawerScrollView: {
      flex: 1,
      height: SCREEN_HEIGHT,
      maxHeight: SCREEN_HEIGHT,
    },
    drawerScrollContent: {
      paddingHorizontal: 18,
      paddingTop: 44,
      paddingBottom: 140,
    },
    drawerHeader: {
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.cardBorder,
    },
    drawerUserRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    drawerAvatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
      borderWidth: 1.5,
      borderColor: COLORS.primary,
    },
    drawerOnlineDot: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: "#10B981",
      borderWidth: 2,
      borderColor: COLORS.card,
    },
    drawerUserName: {
      fontSize: 15,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    drawerUserEmail: {
      fontSize: 10,
      color: COLORS.muted,
      marginTop: 1,
    },
    drawerRolePill: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: "rgba(16, 185, 129, 0.12)",
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 6,
      marginTop: 4,
      gap: 4,
    },
    drawerRolePillText: {
      fontSize: 9,
      fontWeight: "bold",
      color: "#10B981",
    },
    drawerCloseButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: COLORS.cardSecondary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    drawerOrgCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.cardSecondary,
      borderRadius: 12,
      padding: 10,
      marginTop: 12,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    drawerOrgIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: "rgba(117, 110, 243, 0.15)",
      alignItems: "center",
      justifyContent: "center",
    },
    drawerOrgTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    drawerOrgSub: {
      fontSize: 10,
      color: COLORS.muted,
      marginTop: 1,
    },
    drawerSection: {
      marginTop: 18,
    },
    drawerSectionLabel: {
      fontSize: 10,
      fontWeight: "700",
      color: COLORS.muted,
      letterSpacing: 0.8,
      marginBottom: 8,
    },
    drawerMetricsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: COLORS.cardSecondary,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    drawerMetricItem: {
      alignItems: "center",
      flex: 1,
    },
    drawerMetricNum: {
      fontSize: 16,
      fontWeight: "bold",
    },
    drawerMetricLabel: {
      fontSize: 10,
      color: COLORS.muted,
      marginTop: 2,
      fontWeight: "600",
    },
    drawerMetricDivider: {
      width: 1,
      height: 24,
      backgroundColor: COLORS.cardBorder,
    },
    drawerActionCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.cardSecondary,
      borderRadius: 12,
      padding: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    drawerActionIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
    },
    drawerActionTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    drawerActionSub: {
      fontSize: 10,
      color: COLORS.muted,
      marginTop: 1,
    },
    drawerBadgePill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: "rgba(117, 110, 243, 0.15)",
    },
    drawerBadgePillText: {
      fontSize: 9,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    drawerThemeStatusPill: {
      paddingHorizontal: 9,
      paddingVertical: 3,
      borderRadius: 8,
    },
    drawerThemeStatusText: {
      fontSize: 10,
      fontWeight: "bold",
    },
    drawerWorkstreamRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.cardBorder,
    },
    drawerWorkstreamName: {
      fontSize: 12,
      color: COLORS.navy,
      marginLeft: 8,
      fontWeight: "500",
    },
    drawerWorkstreamCount: {
      fontSize: 10,
      color: COLORS.muted,
    },
    drawerFooter: {
      marginTop: 20,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: COLORS.cardBorder,
    },
    drawerSyncRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    drawerSyncDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: "#10B981",
      marginRight: 6,
    },
    drawerSyncText: {
      fontSize: 10,
      color: "#10B981",
      fontWeight: "600",
    },
    drawerVersionText: {
      fontSize: 9,
      color: COLORS.muted,
      marginBottom: 12,
    },
    drawerLogoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(239, 68, 68, 0.08)",
      borderRadius: 10,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: "rgba(239, 68, 68, 0.2)",
      gap: 6,
    },
    drawerLogoutText: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#EF4444",
    },

    // Team Pulse Meter & Activity Feed Styles
    pulseCard: {
      marginHorizontal: 20,
      marginTop: 14,
      padding: 16,
      borderRadius: 16,
      backgroundColor: COLORS.card,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    pulseCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    pulseIconBadge: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    pulseCardTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    pulseCardSubtitle: {
      fontSize: 11,
      color: COLORS.textSecondary,
      marginTop: 1,
    },
    pulseCountBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: COLORS.primaryLight,
    },
    pulseCountBadgeText: {
      fontSize: 10,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    pulseLiveIndicator: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: "rgba(16, 185, 129, 0.12)",
    },
    pulseLiveDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: "#10B981",
      marginRight: 4,
    },
    pulseLiveText: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#10B981",
    },
    pulseMemberRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
    },
    pulseMemberAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    pulseMemberAvatarText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 13,
    },
    pulseOnlineStatusDot: {
      position: "absolute",
      right: 0,
      bottom: 0,
      width: 9,
      height: 9,
      borderRadius: 4.5,
      borderWidth: 1.5,
      borderColor: COLORS.white,
    },
    pulseMemberName: {
      fontSize: 12,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    pulseMemberRole: {
      fontSize: 10,
      color: COLORS.textSecondary,
      marginTop: 1,
    },
    pulseLoadPill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
    },
    pulseLoadPillText: {
      fontSize: 10,
      fontWeight: "bold",
    },
    pulseProgressBarBg: {
      height: 6,
      backgroundColor: COLORS.inputBg,
      borderRadius: 3,
      marginTop: 6,
      overflow: "hidden",
    },
    pulseProgressBarFill: {
      height: "100%",
      borderRadius: 3,
    },
    activityEventRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    activityAvatarBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    activityAvatarText: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "bold",
    },
    activityDescription: {
      fontSize: 11,
      color: COLORS.navy,
      lineHeight: 16,
    },
    activityUserText: {
      fontWeight: "bold",
      color: COLORS.navy,
    },
    activityActionText: {
      color: COLORS.textSecondary,
    },
    activityTargetText: {
      fontWeight: "bold",
      color: COLORS.primary,
    },
    activityTimeText: {
      fontSize: 10,
      color: COLORS.muted,
      marginTop: 2,
    },

    // Kanban Board Styles
    viewModeToggleWrap: {
      flexDirection: "row",
      backgroundColor: COLORS.inputBg,
      borderRadius: 10,
      padding: 3,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    viewModeToggleBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 7,
      gap: 4,
    },
    viewModeToggleBtnActive: {
      backgroundColor: COLORS.primary,
    },
    viewModeToggleText: {
      fontSize: 11,
      fontWeight: "600",
      color: COLORS.navy,
    },
    viewModeToggleTextActive: {
      color: "#FFFFFF",
    },
    kanbanScrollContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    kanbanColumn: {
      width: SCREEN_WIDTH * 0.78,
      height: SCREEN_HEIGHT - 235,
      backgroundColor: COLORS.cardSecondary,
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    kanbanColumnHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    kanbanColumnDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    kanbanColumnTitle: {
      fontSize: 13,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    kanbanCounterBadge: {
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 8,
    },
    kanbanCounterText: {
      fontSize: 11,
      fontWeight: "bold",
    },
    kanbanEmptyColumn: {
      paddingVertical: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    kanbanEmptyText: {
      fontSize: 11,
      color: COLORS.muted,
      fontStyle: "italic",
    },
    kanbanCard: {
      backgroundColor: COLORS.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    kanbanCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    kanbanProjectPill: {
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 6,
      backgroundColor: COLORS.primaryLight,
    },
    kanbanProjectText: {
      fontSize: 9,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    kanbanCardTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: COLORS.navy,
      marginTop: 6,
      lineHeight: 16,
    },
    kanbanProgressLabel: {
      fontSize: 9,
      color: COLORS.muted,
    },
    kanbanProgressPercent: {
      fontSize: 9,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    kanbanProgressBarBg: {
      height: 4,
      backgroundColor: COLORS.inputBg,
      borderRadius: 2,
      overflow: "hidden",
    },
    kanbanProgressBarFill: {
      height: "100%",
      borderRadius: 2,
    },
    kanbanCardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },
    kanbanStepCount: {
      fontSize: 10,
      color: COLORS.textSecondary,
    },
    kanbanAssigneeBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    kanbanAssigneeText: {
      fontSize: 9,
      fontWeight: "bold",
    },

    // Task Detail Sheet Styles
    sheetHandleBar: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: COLORS.border,
      alignSelf: "center",
      marginBottom: 12,
    },
    detailPriorityPill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      marginLeft: 8,
    },
    detailPriorityPillText: {
      fontSize: 9,
      fontWeight: "bold",
    },
    taskDetailSheetTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: COLORS.navy,
      marginTop: 10,
      lineHeight: 24,
    },
    detailStatusSegmentRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 6,
    },
    detailStatusSegmentBtn: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
      backgroundColor: COLORS.inputBg,
    },
    detailStatusSegmentText: {
      fontSize: 11,
      fontWeight: "600",
      color: COLORS.textSecondary,
    },
    taskDescriptionBox: {
      backgroundColor: COLORS.cardSecondary,
      padding: 12,
      borderRadius: 10,
      marginTop: 6,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    taskDescriptionText: {
      fontSize: 12,
      color: COLORS.navy,
      lineHeight: 18,
    },
    checklistProgressText: {
      fontSize: 10,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    detailChecklistRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 9,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    uncheckedCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: COLORS.muted,
    },
    detailChecklistText: {
      fontSize: 13,
      color: COLORS.navy,
      flex: 1,
    },
    detailChecklistTextCompleted: {
      textDecorationLine: "line-through",
      color: COLORS.muted,
    },
    detailAssigneeCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.cardSecondary,
      padding: 10,
      borderRadius: 10,
      marginTop: 6,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    detailVerifiedTag: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: COLORS.primaryLight,
    },
    detailVerifiedTagText: {
      fontSize: 10,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    emptyCommentsBox: {
      padding: 16,
      backgroundColor: COLORS.cardSecondary,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 6,
    },
    emptyCommentsText: {
      fontSize: 11,
      color: COLORS.muted,
      fontStyle: "italic",
    },
    detailCommentCard: {
      backgroundColor: COLORS.cardSecondary,
      padding: 10,
      borderRadius: 10,
      marginTop: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    commentAuthor: {
      fontSize: 11,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    commentRoleTag: {
      marginLeft: 6,
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: 4,
      backgroundColor: COLORS.primaryLight,
    },
    commentRoleTagText: {
      fontSize: 8,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    detailCommentTime: {
      fontSize: 9,
      color: COLORS.muted,
    },
    detailCommentBody: {
      fontSize: 11,
      color: COLORS.navy,
      marginTop: 4,
      lineHeight: 16,
    },
    detailCommentInputRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
      gap: 8,
    },
    detailCommentInput: {
      flex: 1,
      height: 38,
      backgroundColor: COLORS.inputBg,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
      paddingHorizontal: 12,
      fontSize: 11,
      color: COLORS.navy,
    },
    detailCommentSendBtn: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: 14,
      height: 38,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    detailCommentSendBtnText: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "bold",
    },

    // Celebration Toast Banner
    celebrationToast: {
      position: "absolute",
      top: 48,
      left: 16,
      right: 16,
      backgroundColor: COLORS.card,
      borderRadius: 14,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: "#10B981",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
      zIndex: 99999,
    },
    celebrationIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(16, 185, 129, 0.15)",
      alignItems: "center",
      justifyContent: "center",
    },
    celebrationTitle: {
      fontSize: 13,
      fontWeight: "bold",
      color: COLORS.navy,
    },
    celebrationSubtitle: {
      fontSize: 10,
      color: COLORS.textSecondary,
      marginTop: 1,
    },
  });

AppRegistry.registerComponent("main", () => App);

