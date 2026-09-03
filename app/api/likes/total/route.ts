import { NextResponse } from "next/server";
import { getTotalUpstashLikes } from "../../../../lib/upstash-likes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const likes = await getTotalUpstashLikes();
    return NextResponse.json(
      { likes, persistent: likes !== null },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { likes: null, persistent: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
