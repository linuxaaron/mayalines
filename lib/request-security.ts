import { NextResponse } from "next/server";

function allowedOrigins(request: Request) {
  const origins = new Set<string>();
  try { origins.add(new URL(request.url).origin); } catch { /* Invalid URLs are rejected by the runtime. */ }
  const configuredSite = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredSite) {
    try { origins.add(new URL(configuredSite).origin); } catch { /* Ignore invalid optional configuration. */ }
  }
  return origins;
}

/** Reject browser-initiated cross-site mutations while keeping same-origin and non-browser API clients usable. */
export function rejectCrossSiteMutation(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") {
    return NextResponse.json({ error: "Cross-site request rejected" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }

  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins(request).has(origin)) {
    return NextResponse.json({ error: "Origin rejected" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }

  return null;
}
