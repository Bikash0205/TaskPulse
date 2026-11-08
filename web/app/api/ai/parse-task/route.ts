import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/serverStore";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    const { prompt, apiKey: clientKey } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt string is required" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const apiKey = clientKey || process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const systemPrompt = `You are an AI task architect for TaskPulse. Given an informal natural language task request, parse it into a clean JSON object with this exact structure:
{
  "title": "Clear action-oriented title",
  "priority": "low" | "medium" | "high" | "critical",
  "department": "Engineering" | "Design" | "Marketing" | "Operations" | "Product",
  "dueDate": "YYYY-MM-DD" (calculate relative to current date if given relative days like tomorrow, Friday, etc.),
  "estimatedMinutes": 30 | 60 | 120 | 240,
  "subtasks": ["subtask item 1", "subtask item 2"]
}
Return ONLY pure JSON. Do not enclose in markdown code blocks.`;

        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: systemPrompt },
                  { text: `Task input: "${prompt}"` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const candidateText =
            result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            const parsed = JSON.parse(candidateText);
            return NextResponse.json(
              { task: parsed, source: "gemini-pro" },
              { headers: CORS_HEADERS }
            );
          }
        }
      } catch (geminiError) {
        console.error("Gemini API call error:", geminiError);
      }
    }

    // High-performance intelligent heuristic parser (used as fallback or when API key is pending)
    const lower = prompt.toLowerCase();
    let priority: "low" | "medium" | "high" | "critical" = "medium";
    if (lower.includes("critical") || lower.includes("urgent") || lower.includes("asap") || lower.includes("blocker")) {
      priority = "critical";
    } else if (lower.includes("high") || lower.includes("important") || lower.includes("priority")) {
      priority = "high";
    } else if (lower.includes("low") || lower.includes("minor")) {
      priority = "low";
    }

    let department = "Engineering";
    if (lower.includes("design") || lower.includes("ui") || lower.includes("figma") || lower.includes("css")) {
      department = "Design";
    } else if (lower.includes("marketing") || lower.includes("campaign") || lower.includes("social") || lower.includes("ad")) {
      department = "Marketing";
    } else if (lower.includes("store") || lower.includes("inventory") || lower.includes("order") || lower.includes("stock")) {
      department = "Operations";
    } else if (lower.includes("client") || lower.includes("sales") || lower.includes("contract") || lower.includes("deal")) {
      department = "Product";
    }

    // Calculate due date
    const targetDate = new Date();
    if (lower.includes("tomorrow")) {
      targetDate.setDate(targetDate.getDate() + 1);
    } else if (lower.includes("next week")) {
      targetDate.setDate(targetDate.getDate() + 7);
    } else if (lower.includes("friday")) {
      const day = targetDate.getDay();
      const diff = (5 - day + 7) % 7 || 7;
      targetDate.setDate(targetDate.getDate() + diff);
    } else {
      targetDate.setDate(targetDate.getDate() + 3);
    }

    const dueDateStr = targetDate.toISOString().split("T")[0];

    // Subtask generation
    const subtasks = [
      `Initial setup & requirements for ${prompt.slice(0, 30)}...`,
      "Draft review & validation",
      "Final verification and sign-off",
    ];

    return NextResponse.json(
      {
        task: {
          title: prompt.charAt(0).toUpperCase() + prompt.slice(1).trim(),
          priority,
          department,
          dueDate: dueDateStr,
          estimatedMinutes: 60,
          subtasks,
        },
        source: "heuristic",
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to process task prompt" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
