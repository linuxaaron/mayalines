import { timingSafeEqual } from "node:crypto";

function safeEqual(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(received, "utf8");
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function isAdminAuthorized(request: Request) {
  const configuredToken = process.env.ADMIN_REVIEW_TOKEN;
  if (!configuredToken) return false;

  const authorization = request.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return false;

  const suppliedToken = authorization.slice("Bearer ".length).trim();
  return suppliedToken.length > 0 && safeEqual(configuredToken, suppliedToken);
}
