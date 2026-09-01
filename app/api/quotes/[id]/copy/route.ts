import { NextResponse } from "next/server";
import { getDb, getOrCreateVisitorId, isValidQuoteId } from "../../../../../lib/db";
import { rejectIfRateLimited } from "../../../../../lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const rateLimitResponse = await rejectIfRateLimited(request, "copy", { max: 30, windowSeconds: 60 });
  if (rateLimitResponse) return rateLimitResponse;

  const { id } = await params;
  if (!isValidQuoteId(id)) return NextResponse.json({ error: "Invalid quote id" }, { status: 400 });
  const db = getDb();
  if (!db) return NextResponse.json({ copies: 0, persistent: false });

  const visitorId = getOrCreateVisitorId(request);
  try {
    await db`INSERT INTO quote_copies (quote_id, visitor_id) VALUES (${id}, ${visitorId}::uuid)`;
    const rows = await db`SELECT COUNT(*)::int AS copies FROM quote_copies WHERE quote_id = ${id}`;
    return NextResponse.json({ copies: Number((rows[0] as { copies: number })?.copies) || 0, persistent: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Copy storage is temporarily unavailable" }, { status: 503 });
  }
}
