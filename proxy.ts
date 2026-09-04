import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "mayalines.com";
const WWW_HOST = "www.mayalines.com";

export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();

  if (hostname === WWW_HOST) {
    const url = request.nextUrl.clone();
    url.hostname = CANONICAL_HOST;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
