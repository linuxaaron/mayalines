import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { isAdminAuthorized } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Submission storage is not configured" }, { status: 503 });

  const submissions = await db`
    SELECT id, quote, author, source, category, submitter_name, status, created_at
    FROM quote_submissions
    ORDER BY created_at DESC
    LIMIT 100
  `;

  return NextResponse.json({ submissions });
}

export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const rawId = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");

  if (!/^\d+$/.test(rawId) || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid submission update" }, { status: 400 });
  }

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Submission storage is not configured" }, { status: 503 });

  await db`UPDATE quote_submissions SET status = ${status} WHERE id = ${rawId}`;
  return NextResponse.json({ updated: true });
}
