import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../../lib/admin-auth";
import { rejectIfRateLimited } from "../../../../lib/rate-limit";
import { rejectCrossSiteMutation } from "../../../../lib/request-security";
import { listQuoteSubmissions, updateQuoteSubmission } from "../../../../lib/quote-submission";

export const runtime = "nodejs";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };
const ADMIN_AUTH_LIMIT = { max: 10, windowSeconds: 15 * 60 };

function json(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE_HEADERS });
}

async function rejectUnauthorized(request: Request) {
  if (isAdminAuthorized(request)) return null;
  const rateLimitResponse = await rejectIfRateLimited(request, "admin-auth", ADMIN_AUTH_LIMIT);
  return rateLimitResponse ?? json({ error: "Unauthorized" }, 401);
}

export async function GET(request: Request) {
  const unauthorized = await rejectUnauthorized(request);
  if (unauthorized) return unauthorized;

  try {
    return json({ submissions: await listQuoteSubmissions() });
  } catch {
    return json({ error: "Submission storage is temporarily unavailable" }, 503);
  }
}

export async function POST(request: Request) {
  const crossSiteResponse = rejectCrossSiteMutation(request);
  if (crossSiteResponse) return crossSiteResponse;

  const unauthorized = await rejectUnauthorized(request);
  if (unauthorized) return unauthorized;

  const form = await request.formData();
  const rawId = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");
  if (!/^\d+$/.test(rawId) || !["approved", "rejected"].includes(status)) {
    return json({ error: "Invalid submission update" }, 400);
  }

  const updated = await updateQuoteSubmission(Number(rawId), status as "approved" | "rejected");
  if (!updated) return json({ error: "Submission storage is unavailable" }, 503);
  return json({ updated: true });
}
