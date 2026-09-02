"use server";

import { headers } from "next/headers";
import { saveQuoteSubmission } from "../../lib/quote-submission";
import { rejectIfRateLimited } from "../../lib/rate-limit";

export type SubmitState = { status: "idle" | "success" | "error"; message: string };

export async function submitQuote(_previous: SubmitState, formData: FormData): Promise<SubmitState> {
  const requestHeaders = await headers();
  const request = new Request(`${process.env.NEXT_PUBLIC_SITE_URL || "https://mayalines.com"}/submit`, {
    method: "POST",
    headers: requestHeaders,
  });
  const rateLimitResponse = await rejectIfRateLimited(request, "submission", { max: 5, windowSeconds: 600 });
  if (rateLimitResponse) return { status: "error", message: "Too many submissions. Please try again later." };

  const result = await saveQuoteSubmission(Object.fromEntries(formData.entries()));
  if (!result.ok) return { status: "error", message: result.error };
  return { status: "success", message: "Thank you. Your submission has been received for review." };
}
