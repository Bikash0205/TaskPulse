import { NextResponse } from "next/server";
import { getServerProjects, addOrUpdateServerProject, CORS_HEADERS } from "@/lib/serverStore";

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
    addOrUpdateServerProject(body);
    return NextResponse.json(body, { status: 201, headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Invalid payload" }, { status: 400, headers: CORS_HEADERS });
  }
}
