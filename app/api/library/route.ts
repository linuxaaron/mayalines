import { NextRequest, NextResponse } from "next/server";
import quotesData from "../../../data/quotes";

const MAX_PAGE_SIZE = 48;

export const revalidate = 86400;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = (searchParams.get("q") ?? "").trim().toLowerCase().slice(0, 160);
  const category = (searchParams.get("category") ?? "All").trim().slice(0, 80);
  const offset = Math.max(0, Number.parseInt(searchParams.get("offset") ?? "0", 10) || 0);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number.parseInt(searchParams.get("limit") ?? String(MAX_PAGE_SIZE), 10) || MAX_PAGE_SIZE));

  const filtered = quotesData.filter((item) => {
    if (item.indexable === false) return false;
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
