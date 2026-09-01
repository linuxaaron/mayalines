import { NextResponse } from "next/server";
import { getDb, getOrCreateVisitorId } from "../../../lib/db";

export const runtime = "nodejs";
const validTypes = new Set(["author", "topic"]);
function text(value: unknown) { return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, 160) : ""; }
function reply(body: unknown, visitorId: string, status = 200) { const result = NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } }); result.headers.set("set-cookie", `mayalines_visitor=${encodeURIComponent(visitorId)}; Path=/; Max-Age=63072000; HttpOnly; Secure; SameSite=Lax`); return result; }

export async function GET(request: Request) {
  const visitorId = getOrCreateVisitorId(request); const db = getDb();
  if (!db) return reply({ follows: [], persistent: false }, visitorId);
  try { return reply({ follows: await db`SELECT target_type, target FROM quote_follows WHERE visitor_id = ${visitorId}::uuid`, persistent: true }, visitorId); } catch { return reply({ follows: [], persistent: false }, visitorId); }
}
export async function POST(request: Request) {
  const visitorId = getOrCreateVisitorId(request); let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; } catch { return reply({ error: "Invalid JSON" }, visitorId, 400); }
  const targetType = text(body.targetType); const target = text(body.target); const action = body.action;
  if (!validTypes.has(targetType) || !target || (action !== "follow" && action !== "unfollow")) return reply({ error: "Invalid follow request" }, visitorId, 400);
  const db = getDb(); if (!db) return reply({ error: "Follow storage is not configured" }, visitorId, 503);
  try { if (action === "follow") await db`INSERT INTO quote_follows (visitor_id, target_type, target) VALUES (${visitorId}::uuid, ${targetType}, ${target}) ON CONFLICT DO NOTHING`; else await db`DELETE FROM quote_follows WHERE visitor_id = ${visitorId}::uuid AND target_type = ${targetType} AND target = ${target}`; return reply({ following: action === "follow", persistent: true }, visitorId); } catch { return reply({ error: "Follow storage is unavailable" }, visitorId, 503); }
}
