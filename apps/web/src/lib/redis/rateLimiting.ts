import { redis } from "./redis";

export async function rateLimit(
  key: string,
  limit: number,
  window: number
) {
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, window);
  }

  if (count > limit) {
    return false;
  }

  return true;
}