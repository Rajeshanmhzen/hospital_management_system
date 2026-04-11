import Redis from "ioredis";

type CacheValue = string;

const memoryStore = new Map<string, { value: CacheValue; expiresAt?: number }>();

let redisClient: Redis | null = null;
const redisUrl = process.env.REDIS_URL;

if (redisUrl) {
  redisClient = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });
  redisClient.connect().catch(() => {
    redisClient = null;
  });
}

export const cache = {
  async get(key: string): Promise<string | null> {
    if (redisClient) {
      try {
        return await redisClient.get(key);
      } catch {
        // Fallback to memory cache
      }
    }

    const entry = memoryStore.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      memoryStore.delete(key);
      return null;
    }
    return entry.value;
  },

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (redisClient) {
      try {
        if (ttlSeconds) {
          await redisClient.set(key, value, "EX", ttlSeconds);
          return;
        }
        await redisClient.set(key, value);
        return;
      } catch {
        // fallback
      }
    }

    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    memoryStore.set(key, { value, expiresAt });
  },

  async del(key: string): Promise<void> {
    if (redisClient) {
      try {
        await redisClient.del(key);
      } catch {
        // fallback
      }
    }
    memoryStore.delete(key);
  },
};
