import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../../lib/admin-auth";
import { rejectCrossSiteMutation } from "../../../../lib/request-security";
import { listQuoteSubmissions, updateQuoteSubmission } from "../../../../lib/quote-submission";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ submissions: await listQuoteSubmissions() });
  } catch {
    return NextResponse.json({ error: "Submission storage is temporarily unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const crossSiteResponse = rejectCrossSiteMutation(request);
  if (crossSiteResponse) return crossSiteResponse;
  if (!isAdminAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const rawId = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");
  if (!/^\d+$/.test(rawId) || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid submission update" }, { status: 400 });
  }

  const updated = await updateQuoteSubmission(Number(rawId), status as "approved" | "rejected");
  if (!updated) return NextResponse.json({ error: "Submission storage is unavailable" }, { status: 503 });
  return NextResponse.json({ updated: true });
}
