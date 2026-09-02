import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { saveQuoteSubmission } from "../../../lib/quote-submission";
import { rejectIfRateLimited } from "../../../lib/rate-limit";
import { rejectCrossSiteMutation } from "../../../lib/request-security";

export const runtime = "nodejs";

export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ submissions: [] });

  try {
    const submissions = await db`
      SELECT id, quote, author, source, category, created_at
      FROM quote_submissions
      WHERE status = 'approved'
      ORDER BY created_at DESC
      LIMIT 120
    `;

    return NextResponse.json({ submissions }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Submission storage is temporarily unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const crossSiteResponse = rejectCrossSiteMutation(request);
  if (crossSiteResponse) return crossSiteResponse;
  const rateLimitResponse = await rejectIfRateLimited(request, "submission", { max: 5, windowSeconds: 600 });
  if (rateLimitResponse) return rateLimitResponse;

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const result = await saveQuoteSubmission(body as Record<string, unknown>);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ received: true, persisted: result.persisted });
}
