import { Redis } from "@upstash/redis";

const LIKE_KEY_PATTERN = "quote:likes:*";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

/** Sum every per-quote like counter stored in Upstash Redis. */
export async function getTotalUpstashLikes() {
  const redis = getRedis();
  if (!redis) return null;

  let cursor = "0";
  let total = 0;

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: LIKE_KEY_PATTERN,
      count: 500,
    });

    if (keys.length > 0) {
      const values = await Promise.all(keys.map((key) => redis.get<number>(key)));
      total += values.reduce<number>((sum, value) => sum + Math.max(0, Number(value) || 0), 0);
    }

    cursor = String(nextCursor);
  } while (cursor !== "0");

  return total;
}
