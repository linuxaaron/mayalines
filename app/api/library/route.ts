import { NextResponse } from "next/server";
import { getDb, getOrCreateVisitorId, isValidQuoteId } from "../../../lib/db";

export const runtime = "nodejs";
function collectionName(value: unknown) {
  if (typeof value !== "string") return "";
  const name = value.trim().replace(/\s+/g, " ");
  return name.length > 0 && name.length <= 60 ? name : "";
}

function response(body: unknown, visitorId: string, status = 200) {
  const result = NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
  result.headers.set("set-cookie", `mayalines_visitor=${encodeURIComponent(visitorId)}; Path=/; Max-Age=63072000; HttpOnly; Secure; SameSite=Lax`);
  return result;
}

export async function GET(request: Request) {
  const visitorId = getOrCreateVisitorId(request);
  const db = getDb();
  if (!db) return response({ collections: [], persistent: false }, visitorId);
  try {
    const rows = await db`SELECT c.name, i.quote_id, i.created_at FROM quote_collections c JOIN quote_collection_items i ON i.collection_id = c.id WHERE c.visitor_id = ${visitorId}::uuid ORDER BY i.created_at DESC`;
    return response({ collections: rows, persistent: true }, visitorId);
  } catch { return response({ collections: [], persistent: false }, visitorId); }
}

export async function POST(request: Request) {
  const visitorId = getOrCreateVisitorId(request);
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; } catch { return response({ error: "Invalid JSON" }, visitorId, 400); }
  const quoteId = typeof body.quoteId === "string" ? body.quoteId : "";
  const name = collectionName(body.collection);
  const action = body.action;
  if (!isValidQuoteId(quoteId) || !name || (action !== "save" && action !== "remove")) return response({ error: "Invalid library request" }, visitorId, 400);
  const db = getDb();
  if (!db) return response({ error: "Library storage is not configured" }, visitorId, 503);
  try {
    if (action === "save") {
      await db`INSERT INTO quote_collections (visitor_id, name) VALUES (${visitorId}::uuid, ${name}) ON CONFLICT (visitor_id, name) DO NOTHING`;
      await db`INSERT INTO quote_collection_items (collection_id, quote_id) SELECT id, ${quoteId} FROM quote_collections WHERE visitor_id = ${visitorId}::uuid AND name = ${name} ON CONFLICT DO NOTHING`;
    } else {
      await db`DELETE FROM quote_collection_items WHERE quote_id = ${quoteId} AND collection_id IN (SELECT id FROM quote_collections WHERE visitor_id = ${visitorId}::uuid AND name = ${name})`;
    }
    return response({ saved: action === "save", collection: name, persistent: true }, visitorId);
  } catch { return response({ error: "Library storage is unavailable" }, visitorId, 503); }
}
