import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";

export const runtime = "nodejs";

// The admin API is intentionally available only on a protected Vercel
// Preview deployment. Production never exposes submission data/actions.
function isAdminEnvironment() {
  return process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development";
}

function unavailable() {
  return NextResponse.json(
    { error: "Admin review is available only on the protected preview deployment." },
    { status: 404 },
  );
}

export async function GET() {
  if (!isAdminEnvironment()) return unavailable();

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Submission storage is not configured" }, { status: 503 });

  const submissions = await db`
    SELECT id, quote, author, source, category, submitter_name, status, created_at
    FROM quote_submissions
    ORDER BY created_at DESC
    LIMIT 100
  `;

  return NextResponse.json({ submissions }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isAdminEnvironment()) return unavailable();

  const form = await request.formData();
  const rawId = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");

  if (!/^\d+$/.test(rawId) || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid submission update" }, { status: 400 });
  }

  const id = BigInt(rawId);
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Submission storage is not configured" }, { status: 503 });

  await db`UPDATE quote_submissions SET status = ${status} WHERE id = ${id}`;
  return NextResponse.json({ updated: true });
}
