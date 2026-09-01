import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function nonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const value = nonce();
  requestHeaders.set("x-nonce", value);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${value}' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.googleadservices.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.googlesyndication.com https://*.googleadservices.com",
    "frame-src 'self' https://*.googlesyndication.com https://*.doubleclick.net",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", policy);
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
