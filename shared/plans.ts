import { Organization, PlanStatus, PlanTierId } from "./types";

export const SUPER_ADMIN_EMAIL = "zevonbcash@gmail.com";

export type PlanFeatureKey =
  | "gantt_timeline"
  | "verification_audit"
  | "analytics_export"
  | "ai_unlimited"
  | "sso_domain_lock";

export type QuotaMetric = "seats" | "projects" | "departments" | "tasks";

export interface PlanDefinition {
  id: PlanTierId;
  name: string;
  shortName: string;
  badge: string;
  tagline: string;
  priceMonthlyUsd: number | null;
  priceAnnualUsd: number | null;
  priceMonthlyInr: number | null;
  priceAnnualInr?: number | null;
  maxSeats: number | null; // null = unlimited / custom contracted
  maxProjects: number | null;
  maxDepartments: number | null;
  maxActiveTasks: number | null;
  aiParseMonthlyLimit: number | null;
  features: {
    gantt_timeline: boolean;
    verification_audit: boolean;
    analytics_export: boolean;
    ai_unlimited: boolean;
    sso_domain_lock: boolean;
  };
  bullets: string[];
  googlePlaySku?: string;
  supportLabel: string;
}

export const PLAN_ORDER: PlanTierId[] = ["free", "growth", "pro", "enterprise"];

export const PLAN_DEFINITIONS: Record<PlanTierId, PlanDefinition> = {
  free: {
    id: "free",
    name: "TaskPulse Free",
    shortName: "Free",
    badge: "Starter Evaluation",
    tagline: "Essential tracking for solo founders and tiny pilot teams.",
    priceMonthlyUsd: 0,
    priceAnnualUsd: 0,
    priceMonthlyInr: 0,
    priceAnnualInr: 0,
    maxSeats: 4, // 1 admin + 3 members
    maxProjects: 1,
    maxDepartments: 1,
    maxActiveTasks: 25,
    aiParseMonthlyLimit: 5,
    features: {
      gantt_timeline: false,
      verification_audit: false,
      analytics_export: false,
      ai_unlimited: false,
      sso_domain_lock: false,
    },
    bullets: [
      "1 Admin + up to 3 Members (4 seats)",
      "1 Project & 1 Department",
      "Up to 25 Active Tasks",
      "Basic AI Task Parsing (5/month)",
      "Community Support",
    ],
    supportLabel: "Community Support",
  },
  growth: {
    id: "growth",
    name: "TaskPulse Lite",
    shortName: "Lite",
    badge: "Solo & Teams",
    tagline: "Structured multi-department workflows for small enterprises and agile teams.",
    priceMonthlyUsd: 3,
    priceAnnualUsd: 2,
    priceMonthlyInr: 199,
    priceAnnualInr: 159,
    maxSeats: 15,
    maxProjects: 5,
    maxDepartments: 3,
    maxActiveTasks: 250,
    aiParseMonthlyLimit: 50,
    features: {
      gantt_timeline: false,
      verification_audit: true,
      analytics_export: false,
      ai_unlimited: false,
      sso_domain_lock: false,
    },
    bullets: [
      "Up to 15 Workspace Seats",
      "Up to 5 Projects & 3 Departments",
      "Up to 250 Active Tasks",
      "Team Invite Codes & Verification Logs",
      "Android Offline-First Sync + 50 AI Parses/mo",
    ],
    googlePlaySku: "taskpulse_lite_monthly_199",
    supportLabel: "Priority Email Support",
  },
  pro: {
    id: "pro",
    name: "TaskPulse Full",
    shortName: "Full",
    badge: "Most Popular",
    tagline: "Full execution suite with 60fps Gantt timelines, unlimited projects, and AI synthesis.",
    priceMonthlyUsd: 5,
    priceAnnualUsd: 4,
    priceMonthlyInr: 399,
    priceAnnualInr: 319,
    maxSeats: 50,
    maxProjects: null,
    maxDepartments: null,
    maxActiveTasks: null,
    aiParseMonthlyLimit: null,
    features: {
      gantt_timeline: true,
      verification_audit: true,
      analytics_export: true,
      ai_unlimited: true,
      sso_domain_lock: false,
    },
    bullets: [
      "50 Included Workspace Seats",
      "Unlimited Projects & Departments",
      "Unlimited Active Tasks & Subtasks",
      "Interactive Gantt Timeline & Exports",
      "Unlimited AI Task Parsing",
    ],
    googlePlaySku: "taskpulse_full_monthly_399",
    supportLabel: "24/7 Priority Support",
  },
  enterprise: {
    id: "enterprise",
    name: "TaskPulse Enterprise",
    shortName: "Enterprise",
    badge: "Custom Quote",
    tagline: "Custom contracted capacity, domain SSO enforcement, SLA compliance, and onboarding.",
    priceMonthlyUsd: null,
    priceAnnualUsd: null,
    priceMonthlyInr: null,
    priceAnnualInr: null,
    maxSeats: null,
    maxProjects: null,
    maxDepartments: null,
    maxActiveTasks: null,
    aiParseMonthlyLimit: null,
    features: {
      gantt_timeline: true,
      verification_audit: true,
      analytics_export: true,
      ai_unlimited: true,
      sso_domain_lock: true,
    },
    bullets: [
      "Custom Contracted Seat Capacity (50+ / Unlimited)",
      "Custom Procurement, PO & Invoicing",
      "Google Workspace SSO & Domain Lock",
      "Dedicated Account Manager & SLA",
      "Immutable Compliance Audit Trail",
    ],
    supportLabel: "Dedicated SLA & Account Manager",
  },
};

export interface QuotaCheckResult {
  allowed: boolean;
  limit: number | null;
  current: number;
  remaining: number | null;
  reason?: string;
  recommendedPlan?: PlanTierId;
}

export function normalizePlanId(rawPlan?: string | null): PlanTierId {
  const val = (rawPlan || "").toLowerCase().trim();
  if (val === "growth" || val === "lite") return "growth";
  if (val === "pro" || val === "business" || val === "full") return "pro";
  if (val === "enterprise") return "enterprise";
  return "free";
}

export function isSuperAdminEmail(email?: string | null): boolean {
  return (email || "").toLowerCase().trim() === SUPER_ADMIN_EMAIL.toLowerCase();
}

/**
 * Resolves the effective plan for an organization.
 * Super Admin (zevonbcash@gmail.com) and the core showcase workspace (org-core)
 * always retain unrestricted Enterprise clearance.
 */
export function getEffectivePlan(
  org?: Partial<Organization> | null,
  userEmail?: string | null
): PlanDefinition {
  if (isSuperAdminEmail(userEmail) || org?.id === "org-core") {
    return PLAN_DEFINITIONS.enterprise;
  }

  const planId = normalizePlanId(org?.planId);
  const base = PLAN_DEFINITIONS[planId];

  // If a custom seat/project limit was persisted on the org (e.g. contracted Enterprise), honor it
  return {
    ...base,
    maxSeats: org?.seatLimit !== undefined ? org.seatLimit : base.maxSeats,
    maxProjects: org?.projectLimit !== undefined ? org.projectLimit : base.maxProjects,
    maxDepartments: org?.departmentLimit !== undefined ? org.departmentLimit : base.maxDepartments,
    maxActiveTasks: org?.taskLimit !== undefined ? org.taskLimit : base.maxActiveTasks,
  };
}

export function getTrialDaysRemaining(org?: Partial<Organization> | null): number {
  if (!org?.trialEndsAt) return 0;
  const endMs = new Date(org.trialEndsAt).getTime();
  if (Number.isNaN(endMs)) return 0;
  const diff = Math.ceil((endMs - Date.now()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export function isTrialExpired(org?: Partial<Organization> | null): boolean {
  if (!org || org.planStatus !== "trialing" || !org.trialEndsAt) return false;
  return new Date(org.trialEndsAt).getTime() < Date.now();
}

export function getNextRecommendedPlan(current: PlanTierId): PlanTierId {
  if (current === "free") return "growth";
  if (current === "growth") return "pro";
  return "enterprise";
}

export function checkPlanQuota(
  org: Partial<Organization> | null | undefined,
  metric: QuotaMetric,
  currentCount: number,
  userEmail?: string | null
): QuotaCheckResult {
  const effective = getEffectivePlan(org, userEmail);
  const fallbackFree = PLAN_DEFINITIONS.free;
  const trialExpired = !isSuperAdminEmail(userEmail) && org?.id !== "org-core" && isTrialExpired(org);
  const activePlan = trialExpired ? fallbackFree : effective;

  const limitMap: Record<QuotaMetric, number | null> = {
    seats: activePlan.maxSeats,
    projects: activePlan.maxProjects,
    departments: activePlan.maxDepartments,
    tasks: activePlan.maxActiveTasks,
  };

  const limit = limitMap[metric];
  if (limit === null) {
    return { allowed: true, limit: null, current: currentCount, remaining: null };
  }

  const allowed = currentCount < limit;
  const remaining = Math.max(0, limit - currentCount);
  const metricLabel =
    metric === "seats"
      ? "team seats"
      : metric === "projects"
      ? "projects"
      : metric === "departments"
      ? "departments"
      : "active tasks";

  return {
    allowed,
    limit,
    current: currentCount,
    remaining,
    reason: allowed
      ? undefined
      : `${activePlan.name} allows up to ${limit} ${metricLabel}. Upgrade to unlock higher capacity.`,
    recommendedPlan: getNextRecommendedPlan(activePlan.id),
  };
}

export function isFeatureEnabled(
  org: Partial<Organization> | null | undefined,
  feature: PlanFeatureKey,
  userEmail?: string | null
): boolean {
  if (isSuperAdminEmail(userEmail) || org?.id === "org-core") return true;
  if (isTrialExpired(org)) return PLAN_DEFINITIONS.free.features[feature];
  const plan = getEffectivePlan(org, userEmail);
  return plan.features[feature];
}

export function formatPlanStatusLabel(
  status?: PlanStatus | string | null,
  trialEndsAt?: string
): string {
  switch (status) {
    case "trialing": {
      const days = getTrialDaysRemaining({ trialEndsAt });
      return days > 0 ? `14-Day Trial (${days}d left)` : "Trial Expired";
    }
    case "quote_pending":
      return "Enterprise Quote Pending";
    case "past_due":
      return "Payment Action Required";
    case "cancelled":
      return "Cancelled";
    default:
      return "Active";
  }
}
