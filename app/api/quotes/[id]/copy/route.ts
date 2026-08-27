import { NextResponse } from "next/server";
import { getDb, getOrCreateVisitorId, isValidQuoteId } from "../../../../../lib/db";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidQuoteId(id)) return NextResponse.json({ error: "Invalid quote id" }, { status: 400 });
  const db = getDb();
  if (!db) return NextResponse.json({ copies: 0, persistent: false });

  const visitorId = getOrCreateVisitorId(request);
  await db`INSERT INTO quote_copies (quote_id, visitor_id) VALUES (${id}, ${visitorId}::uuid)`;
  const rows = await db`SELECT COUNT(*)::int AS copies FROM quote_copies WHERE quote_id = ${id}`;
  return NextResponse.json({ copies: Number((rows[0] as { copies: number })?.copies) || 0, persistent: true }, { headers: { "Cache-Control": "no-store" } });
}
