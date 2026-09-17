export type TaskStatus = "backlog" | "in_progress" | "in_review" | "completed" | "blocked";
export type CapacityLevel = "normal" | "warning" | "overload";
export type UserRole = "admin" | "manager" | "member" | "viewer";
export type Department = string;

export interface ColleagueProfile {
  id: string;
  name: string;
  role: UserRole;
  department: Department;
  avatarUrl?: string;
  activeTaskCount: number;
  maxBandwidth: number;
  isOnline?: boolean;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  department: Department;
  description?: string;
  progressPercentage: number;
  targetDate?: string;
}

export interface TaskPulseItem {
  id: string;
  projectId?: string;
  projectName?: string;
  title: string;
  department: Department;
  projectBadge: string;
  status: TaskStatus;
  progressPercentage: number;
  priority: "low" | "medium" | "high" | "critical";
  assignee?: ColleagueProfile;
  subtasks?: SubTask[];
  isBlocked?: boolean;
  blockReason?: string;
  reviewerName?: string;
  verifiedByManager?: boolean;
  verifiedAt?: string;
  reviewFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ColleaguePulseFeedItem {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  department: Department;
  currentTaskTitle: string;
  projectName?: string;
  projectBadge: string;
  progressPercentage: number;
  activeTaskCount: number;
  isBlocked?: boolean;
  lastHeartbeat: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  adminEmail: string;
  createdAt: string;
  departments: Department[];
  inviteCode: string;
}

export interface OrganizationInvite {
  id: string;
  orgId: string;
  email: string;
  name: string;
  role: UserRole;
  department: Department;
  assignedProjectIds: string[];
  invitedBy: string;
  invitedAt: string;
  status: "pending" | "accepted";
}

