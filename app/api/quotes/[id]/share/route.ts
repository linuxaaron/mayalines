import { NextResponse } from "next/server";
import { getDb, getOrCreateVisitorId, isValidQuoteId } from "../../../../../lib/db";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidQuoteId(id)) return NextResponse.json({ error: "Invalid quote id" }, { status: 400 });
  const db = getDb();
  if (!db) return NextResponse.json({ shares: 0, persistent: false });

  const visitorId = getOrCreateVisitorId(request);
  let channel = "native";
  try {
    const body = await request.json();
    if (typeof body?.channel === "string" && /^[a-z0-9_-]{1,32}$/i.test(body.channel)) channel = body.channel;
  } catch { /* Native share can legitimately have an empty body. */ }

  await db`INSERT INTO quote_shares (quote_id, visitor_id, channel) VALUES (${id}, ${visitorId}::uuid, ${channel})`;
  const rows = await db`SELECT COUNT(*)::int AS shares FROM quote_shares WHERE quote_id = ${id}`;
  return NextResponse.json({ shares: Number((rows[0] as { shares: number })?.shares) || 0, persistent: true }, { headers: { "Cache-Control": "no-store" } });
}
