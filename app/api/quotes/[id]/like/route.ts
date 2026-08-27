import { NextResponse } from "next/server";
import { getDb, getOrCreateVisitorId, isValidQuoteId, setVisitorCookie } from "../../../../../lib/db";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidQuoteId(id)) return NextResponse.json({ error: "Invalid quote id" }, { status: 400 });

  const db = getDb();
  if (!db) return NextResponse.json({ likes: 0, liked: false, persistent: false }, { headers: { "Cache-Control": "no-store" } });

  const visitorId = getOrCreateVisitorId(request);
  const rows = await db`SELECT COUNT(*)::int AS likes, BOOL_OR(visitor_id = ${visitorId}::uuid) AS liked FROM quote_likes WHERE quote_id = ${id}`;
  const result = rows[0] as { likes: number; liked: boolean | null };
  const response = NextResponse.json({ likes: Number(result?.likes) || 0, liked: Boolean(result?.liked), persistent: true }, { headers: { "Cache-Control": "no-store" } });
  response.headers.set("set-cookie", `mayalines_visitor=${encodeURIComponent(visitorId)}; Path=/; Max-Age=63072000; HttpOnly; Secure; SameSite=Lax`);
  return response;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidQuoteId(id)) return NextResponse.json({ error: "Invalid quote id" }, { status: 400 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Like storage is not configured" }, { status: 503 });

  let body: { action?: string } = {};
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (body.action !== "like" && body.action !== "unlike") return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  const visitorId = getOrCreateVisitorId(request);
  if (body.action === "like") {
    await db`INSERT INTO quote_likes (quote_id, visitor_id) VALUES (${id}, ${visitorId}::uuid) ON CONFLICT (quote_id, visitor_id) DO NOTHING`;
  } else {
    await db`DELETE FROM quote_likes WHERE quote_id = ${id} AND visitor_id = ${visitorId}::uuid`;
  }

  const rows = await db`SELECT COUNT(*)::int AS likes, BOOL_OR(visitor_id = ${visitorId}::uuid) AS liked FROM quote_likes WHERE quote_id = ${id}`;
  const result = rows[0] as { likes: number; liked: boolean | null };
  const response = NextResponse.json({ likes: Number(result?.likes) || 0, liked: Boolean(result?.liked), persistent: true }, { headers: { "Cache-Control": "no-store" } });
  response.headers.set("set-cookie", `mayalines_visitor=${encodeURIComponent(visitorId)}; Path=/; Max-Age=63072000; HttpOnly; Secure; SameSite=Lax`);
  return response;
}
