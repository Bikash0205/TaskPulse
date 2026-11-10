import { NextResponse } from "next/server";
import { getServerProjects, addOrUpdateServerProject, CORS_HEADERS } from "@/lib/serverStore";
import { checkPlanQuota, normalizePlanId } from "@shared/plans";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET() {
  const projects = getServerProjects();
  return NextResponse.json(projects, {
    headers: {
      ...CORS_HEADERS,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const headerPlan = req.headers.get("x-taskpulse-plan") || body?.planId;
    if (headerPlan) {
      const planId = normalizePlanId(headerPlan);
      const currentCount = typeof body?.currentProjectCount === "number" ? body.currentProjectCount : 0;
      const quota = checkPlanQuota({ planId }, "projects", currentCount, body?.userEmail);
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
    addOrUpdateServerProject(body);
    return NextResponse.json(body, { status: 201, headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Invalid payload" }, { status: 400, headers: CORS_HEADERS });
  }
}
