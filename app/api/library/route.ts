import { NextRequest, NextResponse } from "next/server";
import quotesData from "../../../data/quotes";
import { getDb, getOrCreateVisitorId, isValidQuoteId } from "../../../lib/db";
import { rejectIfRateLimited } from "../../../lib/rate-limit";
import { rejectCrossSiteMutation } from "../../../lib/request-security";
import { isPublicQuote } from "../../../lib/seo";

const MAX_PAGE_SIZE = 48;
const publicQuotesById = new Map(quotesData.filter(isPublicQuote).map((quote) => [quote.id, quote]));

export const revalidate = 86400;

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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const isQuoteSearch = ["q", "category", "offset", "limit"].some((key) => searchParams.has(key));
  if (!isQuoteSearch) {
    const visitorId = getOrCreateVisitorId(request);
    const db = getDb();
    if (!db) return response({ collections: [], persistent: false }, visitorId);
    try {
      const rows = await db`SELECT c.name, i.quote_id, i.created_at FROM quote_collections c JOIN quote_collection_items i ON i.collection_id = c.id WHERE c.visitor_id = ${visitorId}::uuid ORDER BY i.created_at DESC`;
      const collections = rows.flatMap((row) => {
        const item = row as { name: string; quote_id: string; created_at: unknown };
        const quote = publicQuotesById.get(item.quote_id);
        return quote ? [{ name: item.name, quote }] : [];
      });
      return response({ collections, persistent: true }, visitorId);
    } catch { return response({ collections: [], persistent: false }, visitorId); }
  }
  const query = (searchParams.get("q") ?? "").trim().toLowerCase().slice(0, 160);
  const category = (searchParams.get("category") ?? "All").trim().slice(0, 80);
  const offset = Math.max(0, Number.parseInt(searchParams.get("offset") ?? "0", 10) || 0);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number.parseInt(searchParams.get("limit") ?? String(MAX_PAGE_SIZE), 10) || MAX_PAGE_SIZE));

  const filtered = quotesData.filter((item) => {
    if (!isPublicQuote(item)) return false;
    if (category !== "All" && item.category !== category) return false;
    if (!query) return true;
    return `${item.quote} ${item.author} ${item.category} ${item.language ?? ""}`.toLowerCase().includes(query);
  });

  return NextResponse.json(
    {
      items: filtered.slice(offset, offset + limit),
      total: filtered.length,
      offset,
      limit,
      hasMore: offset + limit < filtered.length,
    },
    {
      headers: {
        "Cache-Control": query || category !== "All"
          ? "public, s-maxage=300, stale-while-revalidate=1800"
          : "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}

export async function POST(request: NextRequest) {
  const crossSiteResponse = rejectCrossSiteMutation(request);
  if (crossSiteResponse) return crossSiteResponse;
  const rateLimitResponse = await rejectIfRateLimited(request, "library", { max: 30, windowSeconds: 60 });
  if (rateLimitResponse) return rateLimitResponse;

  const visitorId = getOrCreateVisitorId(request);
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; } catch { return response({ error: "Invalid JSON" }, visitorId, 400); }
  const quoteId = typeof body.quoteId === "string" ? body.quoteId : "";
  const name = collectionName(body.collection);
  const action = body.action;
  if (!isValidQuoteId(quoteId) || !publicQuotesById.has(quoteId) || !name || (action !== "save" && action !== "remove")) return response({ error: "Invalid library request" }, visitorId, 400);
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
