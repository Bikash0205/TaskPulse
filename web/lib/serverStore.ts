import {
  TaskPulseItem,
  Project,
  PlanTierId,
  PlanStatus,
  BillingSource,
  EnterpriseQuoteRequest,
} from "@shared/types";
import { PLAN_DEFINITIONS } from "@shared/plans";
import { mockTasks, mockProjects } from "@shared/mockData";

export interface MemberSubscriptionRecord {
  userId: string;
  userName: string;
  userEmail: string;
  orgId?: string;
  orgName?: string;
  role: "admin" | "manager" | "member" | "viewer";
  planId: PlanTierId;
  planName: string;
  price: number;
  status: PlanStatus;
  billingSource: BillingSource;
  billingCycle: "monthly" | "annual";
  renewsAt: string;
  trialEndsAt?: string;
  paymentMethod: string;
  googleBillingReady: boolean;
  invoiceRequested?: boolean;
  orderId: string;
  updatedAt?: string;
}

const INITIAL_SUBSCRIPTIONS: MemberSubscriptionRecord[] = [
  {
    userId: "u-admin",
    userName: "Bikash Kumar Yadav",
    userEmail: "zevonbcash@gmail.com",
    orgId: "org-core",
    orgName: "TaskPulse Core Workspace",
    role: "admin",
    planId: "enterprise",
    planName: PLAN_DEFINITIONS.enterprise.name,
    price: 0,
    status: "active",
    billingSource: "enterprise_quote",
    billingCycle: "annual",
    renewsAt: "Lifetime Super Admin",
    paymentMethod: "Super Admin Grant",
    googleBillingReady: true,
    orderId: "TP-CORE-SUPERADMIN",
  },
  {
    userId: "u-marcus",
    userName: "Marcus Vance",
    userEmail: "marcus.vance@taskpulse.internal",
    orgId: "org-core",
    orgName: "TaskPulse Core Workspace",
    role: "member",
    planId: "pro",
    planName: PLAN_DEFINITIONS.pro.name,
    price: 19,
    status: "active",
    billingSource: "google_play",
    billingCycle: "monthly",
    renewsAt: "Nov 30, 2026",
    paymentMethod: "Google Play Billing",
    googleBillingReady: true,
    orderId: "GPA.8821-9943-1284-9041",
  },
  {
    userId: "u-sarah",
    userName: "Sarah Chen",
    userEmail: "sarah.chen@taskpulse.internal",
    orgId: "org-core",
    orgName: "TaskPulse Core Workspace",
    role: "manager",
    planId: "pro",
    planName: PLAN_DEFINITIONS.pro.name,
    price: 19,
    status: "active",
    billingSource: "google_play",
    billingCycle: "annual",
    renewsAt: "Oct 12, 2027",
    paymentMethod: "Google Play Billing",
    googleBillingReady: true,
    orderId: "GPA.1294-0012-7744-8832",
  },
];

// Global persistent in-memory store across Next.js server invocations in development/runtime
declare global {
  // eslint-disable-next-line no-var
  var __taskPulseServerTasks: TaskPulseItem[] | undefined;
  // eslint-disable-next-line no-var
  var __taskPulseServerProjects: Project[] | undefined;
  // eslint-disable-next-line no-var
  var __taskPulseServerSubscriptions: MemberSubscriptionRecord[] | undefined;
  // eslint-disable-next-line no-var
  var __taskPulseServerQuotes: EnterpriseQuoteRequest[] | undefined;
}

export function getServerTasks(): TaskPulseItem[] {
  if (!global.__taskPulseServerTasks) {
    global.__taskPulseServerTasks = [...mockTasks];
  }
  return global.__taskPulseServerTasks;
}

export function setServerTasks(tasks: TaskPulseItem[]) {
  global.__taskPulseServerTasks = tasks;
}

export function addOrUpdateServerTask(task: TaskPulseItem) {
  const current = getServerTasks();
  const index = current.findIndex((t) => t.id === task.id);
  if (index >= 0) {
    current[index] = { ...current[index], ...task, updatedAt: new Date().toISOString() };
  } else {
    current.unshift({
      ...task,
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  global.__taskPulseServerTasks = current;
  return current;
}

export function getServerProjects(): Project[] {
  if (!global.__taskPulseServerProjects) {
    global.__taskPulseServerProjects = [...mockProjects];
  }
  return global.__taskPulseServerProjects;
}

export function addOrUpdateServerProject(project: Project) {
  const current = getServerProjects();
  const index = current.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    current[index] = { ...current[index], ...project };
  } else {
    current.unshift(project);
  }
  global.__taskPulseServerProjects = current;
  return current;
}

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-TaskPulse-Plan",
};

export function getServerSubscriptions(): MemberSubscriptionRecord[] {
  if (!global.__taskPulseServerSubscriptions) {
    global.__taskPulseServerSubscriptions = [...INITIAL_SUBSCRIPTIONS];
  }
  return global.__taskPulseServerSubscriptions;
}

export function upsertServerSubscription(
  payload: Partial<MemberSubscriptionRecord> & { userEmail?: string; orgId?: string; userId?: string }
): MemberSubscriptionRecord {
  const list = getServerSubscriptions();
  const normEmail = payload.userEmail?.toLowerCase().trim();
  const idx = list.findIndex(
    (s) =>
      (payload.userId && s.userId === payload.userId) ||
      (payload.orgId && s.orgId === payload.orgId && normEmail && s.userEmail.toLowerCase() === normEmail) ||
      (normEmail && s.userEmail.toLowerCase() === normEmail)
  );

  const resolvedPlanId = payload.planId || (idx >= 0 ? list[idx].planId : "free");
  const planDef = PLAN_DEFINITIONS[resolvedPlanId];
  const billingCycle = payload.billingCycle || (idx >= 0 ? list[idx].billingCycle : "monthly");
  const resolvedPrice =
    payload.price !== undefined
      ? payload.price
      : billingCycle === "annual"
      ? planDef.priceAnnualInr ?? planDef.priceAnnualUsd ?? 0
      : planDef.priceMonthlyInr ?? planDef.priceMonthlyUsd ?? 0;

  if (idx >= 0) {
    const merged: MemberSubscriptionRecord = {
      ...list[idx],
      ...payload,
      planId: resolvedPlanId,
      planName: payload.planName || planDef.name,
      price: resolvedPrice,
      billingCycle,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = merged;
    global.__taskPulseServerSubscriptions = list;
    return merged;
  }

  const created: MemberSubscriptionRecord = {
    userId: payload.userId || `sub-${Date.now()}`,
    userName: payload.userName || normEmail?.split("@")[0] || "Workspace Admin",
    userEmail: normEmail || "admin@workspace.internal",
    orgId: payload.orgId,
    orgName: payload.orgName,
    role: payload.role || "admin",
    planId: resolvedPlanId,
    planName: payload.planName || planDef.name,
    price: resolvedPrice,
    status: payload.status || "active",
    billingSource: payload.billingSource || (resolvedPlanId === "free" ? "free" : "web_trial"),
    billingCycle,
    renewsAt: payload.renewsAt || "Pending Billing",
    trialEndsAt: payload.trialEndsAt,
    paymentMethod:
      payload.paymentMethod ||
      (payload.billingSource === "google_play"
        ? "Google Play Billing"
        : payload.billingSource === "manual_invoice"
        ? "Invoice / UPI Request"
        : payload.billingSource === "enterprise_quote"
        ? "Enterprise Contract"
        : resolvedPlanId === "free"
        ? "Free Tier"
        : "14-Day Web Trial"),
    googleBillingReady: true,
    invoiceRequested: payload.invoiceRequested,
    orderId: payload.orderId || `TP-${Math.floor(100000 + Math.random() * 900000)}`,
    updatedAt: new Date().toISOString(),
  };
  list.unshift(created);
  global.__taskPulseServerSubscriptions = list;
  return created;
}

export function getServerQuotes(): EnterpriseQuoteRequest[] {
  if (!global.__taskPulseServerQuotes) {
    global.__taskPulseServerQuotes = [];
  }
  return global.__taskPulseServerQuotes;
}

export function addServerQuote(quote: EnterpriseQuoteRequest): EnterpriseQuoteRequest {
  const list = getServerQuotes();
  list.unshift(quote);
  global.__taskPulseServerQuotes = list;
  return quote;
}

export function updateServerQuote(
  quoteId: string,
  status: EnterpriseQuoteRequest["status"]
): EnterpriseQuoteRequest | null {
  const list = getServerQuotes();
  const idx = list.findIndex((q) => q.id === quoteId);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], status };
  global.__taskPulseServerQuotes = list;
  return list[idx];
}
