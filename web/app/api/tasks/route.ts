import { NextResponse } from "next/server";
import { getServerTasks, addOrUpdateServerTask, setServerTasks, CORS_HEADERS } from "@/lib/serverStore";
import { checkPlanQuota, normalizePlanId } from "@shared/plans";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET() {
  const tasks = getServerTasks();
  return NextResponse.json(tasks, {
    headers: {
      ...CORS_HEADERS,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (Array.isArray(body)) {
      setServerTasks(body);
      return NextResponse.json(body, { headers: CORS_HEADERS });
    }
    const headerPlan = req.headers.get("x-taskpulse-plan") || body?.planId;
    if (headerPlan && typeof body?.currentTaskCount === "number") {
      const planId = normalizePlanId(headerPlan);
      const quota = checkPlanQuota({ planId }, "tasks", body.currentTaskCount, body?.userEmail);
      if (!quota.allowed) {
        return NextResponse.json(
          {
            error: quota.reason,
            code: "PLAN_LIMIT_REACHED",
            recommendedPlan: quota.recommendedPlan,
          },
          { status: 403, headers: CORS_HEADERS }
        );
      }
    }
    addOrUpdateServerTask(body);
    return NextResponse.json(body, { status: 201, headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Invalid payload" }, { status: 400, headers: CORS_HEADERS });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    addOrUpdateServerTask(body);
    return NextResponse.json(body, { headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Invalid payload" }, { status: 400, headers: CORS_HEADERS });
  }
}
