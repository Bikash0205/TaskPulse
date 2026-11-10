import { NextResponse } from "next/server";
import {
  CORS_HEADERS,
  MemberSubscriptionRecord,
  getServerSubscriptions,
  upsertServerSubscription,
} from "@/lib/serverStore";
import { normalizePlanId } from "@shared/plans";
import { BillingSource, PlanStatus } from "@shared/types";

export type { MemberSubscriptionRecord };

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const orgId = searchParams.get("orgId");
  const all = getServerSubscriptions();

  if (email || orgId) {
    const single = all.find(
      (s) =>
        (orgId && s.orgId === orgId) ||
        (email && s.userEmail.toLowerCase() === email.toLowerCase().trim())
    );
    return NextResponse.json(
      { subscription: single || null },
      { headers: { ...CORS_HEADERS, "Cache-Control": "no-store, max-age=0" } }
    );
  }

  let mrr = 0;
  let activeCount = 0;
  let entCount = 0;
  let proCount = 0;
  let growthCount = 0;
  let freeCount = 0;
  let pendingInvoices = 0;

  all.forEach((s) => {
    if (s.status === "active" || s.status === "trialing") {
      mrr += s.price;
      activeCount++;
    }
    if (s.invoiceRequested && s.status !== "active") {
      pendingInvoices++;
    }
    if (s.planId === "enterprise") entCount++;
    else if (s.planId === "pro") proCount++;
    else if (s.planId === "growth") growthCount++;
    else freeCount++;
  });

  const summary = {
    mrr,
    activeCount,
    entCount,
    proCount,
    growthCount,
    freeCount,
    pendingInvoices,
    totalUsers: all.length,
    totalSeats: all.length,
    gateway: "Hybrid (Google Play Billing + Web Trial/Invoice)",
  };

  return NextResponse.json(
    {
      metrics: summary,
      kpis: summary,
      subscriptions: all,
    },
    { headers: { ...CORS_HEADERS, "Cache-Control": "no-store, max-age=0" } }
  );
}

const futureDate = (daysFromNow: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d;
};

const formatDateLabel = (d: Date): string =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      action,
      userId,
      userEmail,
      userName,
      orgId,
      orgName,
      planId,
      status,
      billingSource,
      billingCycle,
      renewsAt,
      days,
      daysExtension,
      orderId,
    } = body;

    const normalizedPlan = planId ? normalizePlanId(planId) : undefined;
    const extraDays = Number(days ?? daysExtension ?? 0);

    let resolvedStatus: PlanStatus | undefined = status;
    let resolvedSource: BillingSource | undefined = billingSource;
    let resolvedTrialEnd: string | undefined;
    let resolvedRenewsAt: string | undefined = renewsAt;
    let invoiceRequested: boolean | undefined;
    let paymentMethod: string | undefined;

    if (action === "start_trial" || action === "extend_trial" || extraDays > 0) {
      const target = futureDate(extraDays > 0 ? extraDays : 14);
      resolvedStatus = "trialing";
      resolvedSource = action === "start_trial" ? "web_trial" : billingSource;
      resolvedTrialEnd = target.toISOString();
      resolvedRenewsAt = formatDateLabel(target);
      paymentMethod = "14-Day Web Trial";
    } else if (action === "request_invoice") {
      resolvedStatus = "past_due";
      resolvedSource = "manual_invoice";
      invoiceRequested = true;
      paymentMethod = "Invoice / UPI Pending";
      resolvedRenewsAt = "Awaiting Payment Confirmation";
    } else if (action === "approve_invoice") {
      resolvedStatus = "active";
      resolvedSource = "manual_invoice";
      invoiceRequested = false;
      paymentMethod = "Verified Invoice / UPI";
      resolvedRenewsAt = formatDateLabel(futureDate(30));
    } else if (action === "activate_google_play") {
      resolvedStatus = "active";
      resolvedSource = "google_play";
      paymentMethod = "Google Play Billing";
      resolvedRenewsAt = formatDateLabel(futureDate(30));
    } else if (normalizedPlan === "free" && !resolvedStatus) {
      resolvedStatus = "active";
      resolvedSource = "free";
      paymentMethod = "Free Tier";
      resolvedRenewsAt = "Free Forever";
    } else if (normalizedPlan === "enterprise" && !resolvedStatus) {
      resolvedStatus = "quote_pending";
      resolvedSource = "enterprise_quote";
      paymentMethod = "Custom Enterprise Quote";
      resolvedRenewsAt = "Custom Contract";
    }

    const updated = upsertServerSubscription({
      userId,
      userEmail,
      userName,
      orgId,
      orgName,
      planId: normalizedPlan,
      status: resolvedStatus,
      billingSource: resolvedSource,
      billingCycle,
      trialEndsAt: resolvedTrialEnd,
      renewsAt: resolvedRenewsAt,
      invoiceRequested,
      paymentMethod,
      orderId,
    });

    return NextResponse.json(
      {
        success: true,
        updated,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update subscription";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS_HEADERS });
  }
}
