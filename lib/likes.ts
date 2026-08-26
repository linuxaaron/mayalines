import { Redis } from "@upstash/redis";

export function getLikesRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function quoteLikeKey(id: string) {
  return `quote:likes:${id}`;
}
