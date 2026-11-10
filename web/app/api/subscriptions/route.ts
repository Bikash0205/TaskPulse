import { NextResponse } from "next/server";

export interface MemberSubscriptionRecord {
  userId: string;
  userName: string;
  userEmail: string;
  role: "admin" | "manager" | "member";
  planId: "free" | "pro" | "enterprise";
  planName: string;
  price: number;
  status: "active" | "trialing" | "past_due" | "cancelled";
  billingCycle: "monthly" | "annual";
  renewsAt: string;
  paymentMethod: string;
  googleBillingReady: boolean;
  orderId: string;
}

let activeSubscriptions: MemberSubscriptionRecord[] = [
  {
    userId: "u-admin",
    userName: "Bikash Kumar Yadav",
    userEmail: "zevonbcash@gmail.com",
    role: "admin",
    planId: "enterprise",
    planName: "Enterprise Suite",
    price: 49,
    status: "active",
    billingCycle: "monthly",
    renewsAt: "Dec 15, 2026",
    paymentMethod: "Google Play Billing",
    googleBillingReady: true,
    orderId: "GPA.3392-4102-8819-0129",
  },
  {
    userId: "u-marcus",
    userName: "Marcus Lee",
    userEmail: "marcus@taskpulse.io",
    role: "manager",
    planId: "pro",
    planName: "TaskPulse Pro",
    price: 19,
    status: "active",
    billingCycle: "monthly",
    renewsAt: "Nov 30, 2026",
    paymentMethod: "Google Play Billing",
    googleBillingReady: true,
    orderId: "GPA.8821-9943-1284-9041",
  },
  {
    userId: "u-sarah",
    userName: "Sarah Chen",
    userEmail: "sarah.chen@taskpulse.io",
    role: "manager",
    planId: "pro",
    planName: "TaskPulse Pro",
    price: 19,
    status: "active",
    billingCycle: "annual",
    renewsAt: "Oct 12, 2027",
    paymentMethod: "Google Play Billing",
    googleBillingReady: true,
    orderId: "GPA.1294-0012-7744-8832",
  },
  {
    userId: "u-alex",
    userName: "Alex Vance",
    userEmail: "alex@acmecorp.com",
    role: "member",
    planId: "free",
    planName: "Starter Free",
    price: 0,
    status: "trialing",
    billingCycle: "monthly",
    renewsAt: "Dec 01, 2026",
    paymentMethod: "Google Play Billing",
    googleBillingReady: true,
    orderId: "GPA.FREE-TRIAL-001",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (email) {
    const single = activeSubscriptions.find(
      (s) => s.userEmail.toLowerCase() === email.toLowerCase()
    );
    return NextResponse.json({ subscription: single || null });
  }

  // Calculate high-level summary KPIs
  let mrr = 0;
  let activeCount = 0;
  let entCount = 0;
  let proCount = 0;
  let freeCount = 0;

  activeSubscriptions.forEach((s) => {
    if (s.status === "active" || s.status === "trialing") {
      mrr += s.price;
      activeCount++;
    }
    if (s.planId === "enterprise") entCount++;
    else if (s.planId === "pro") proCount++;
    else freeCount++;
  });

  return NextResponse.json({
    metrics: {
      mrr,
      activeCount,
      entCount,
      proCount,
      freeCount,
      totalSeats: activeSubscriptions.length,
      gateway: "Google Play Billing",
    },
    subscriptions: activeSubscriptions,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, planId, status, renewsAt, daysExtension } = body;

    const targetIdx = activeSubscriptions.findIndex((s) => s.userId === userId);
    if (targetIdx === -1) {
      return NextResponse.json(
        { error: "User subscription record not found" },
        { status: 404 }
      );
    }

    if (planId) {
      activeSubscriptions[targetIdx].planId = planId;
      activeSubscriptions[targetIdx].planName =
        planId === "enterprise"
          ? "Enterprise Suite"
          : planId === "pro"
          ? "TaskPulse Pro"
          : "Starter Free";
      activeSubscriptions[targetIdx].price =
        planId === "enterprise" ? 49 : planId === "pro" ? 19 : 0;
      activeSubscriptions[targetIdx].status = "active";
    }

    if (status) {
      activeSubscriptions[targetIdx].status = status;
    }

    if (renewsAt) {
      activeSubscriptions[targetIdx].renewsAt = renewsAt;
    }

    if (daysExtension) {
      const d = new Date();
      d.setDate(d.getDate() + Number(daysExtension));
      activeSubscriptions[targetIdx].renewsAt = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      activeSubscriptions[targetIdx].status = "trialing";
    }

    return NextResponse.json({
      success: true,
      updated: activeSubscriptions[targetIdx],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update subscription" },
      { status: 500 }
    );
  }
}
