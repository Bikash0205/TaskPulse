import { NextResponse } from "next/server";
import {
  CORS_HEADERS,
  addServerQuote,
  getServerQuotes,
  updateServerQuote,
  upsertServerSubscription,
} from "@/lib/serverStore";
import { EnterpriseQuoteRequest } from "@shared/types";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    { quotes: getServerQuotes() },
    { headers: { ...CORS_HEADERS, "Cache-Control": "no-store, max-age=0" } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "update_status" && body.quoteId && body.status) {
      const updated = updateServerQuote(body.quoteId, body.status);
      if (!updated) {
        return NextResponse.json({ error: "Quote not found" }, { status: 404, headers: CORS_HEADERS });
      }
      if (body.status === "approved" && updated.contactEmail) {
        upsertServerSubscription({
          userEmail: updated.contactEmail,
          userName: updated.contactName,
          orgId: updated.orgId,
          orgName: updated.companyName,
          planId: "enterprise",
          status: "active",
          billingSource: "enterprise_quote",
          paymentMethod: "Enterprise Contract",
          renewsAt: "Annual Contract",
        });
      }
      return NextResponse.json({ success: true, quote: updated }, { headers: CORS_HEADERS });
    }

    const { companyName, contactName, contactEmail, teamSize, estimatedSeats, requirements, orgId } = body;
    if (!companyName || !contactEmail) {
      return NextResponse.json(
        { error: "companyName and contactEmail are required" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const quote: EnterpriseQuoteRequest = {
      id: `quote-${Date.now()}`,
      orgId,
      companyName: String(companyName).trim(),
      contactName: String(contactName || contactEmail.split("@")[0]).trim(),
      contactEmail: String(contactEmail).trim().toLowerCase(),
      teamSize: String(teamSize || "201-1000"),
      estimatedSeats: Number(estimatedSeats) > 0 ? Number(estimatedSeats) : 100,
      requirements: String(requirements || "Custom enterprise onboarding").trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    addServerQuote(quote);

    upsertServerSubscription({
      userEmail: quote.contactEmail,
      userName: quote.contactName,
      orgId: quote.orgId,
      orgName: quote.companyName,
      planId: "enterprise",
      status: "quote_pending",
      billingSource: "enterprise_quote",
      paymentMethod: "Custom Enterprise Quote",
      renewsAt: "Pending Sales Quote",
    });

    return NextResponse.json({ success: true, quote }, { status: 201, headers: CORS_HEADERS });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit enterprise quote";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS_HEADERS });
  }
}
