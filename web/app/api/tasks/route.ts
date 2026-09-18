import { NextResponse } from "next/server";
import { getServerTasks, addOrUpdateServerTask, setServerTasks, CORS_HEADERS } from "@/lib/serverStore";

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
    const updated = addOrUpdateServerTask(body);
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
