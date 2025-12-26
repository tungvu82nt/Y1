import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
  enableOfflineQueue: false,
} as any);

let redisAvailable = false;

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
  redisAvailable = true;
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
  redisAvailable = false;
});

redis.on('close', () => {
  console.log('⚠️ Redis connection closed');
  redisAvailable = false;
});

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    if (!redisAvailable) return null;
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  async set(key: string, value: unknown, ttl: number = 3600): Promise<void> {
    if (!redisAvailable) return;
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  async del(key: string): Promise<void> {
    if (!redisAvailable) return;
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  },

  async delPattern(pattern: string): Promise<void> {
    if (!redisAvailable) return;
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error);
    }
  },

  async exists(key: string): Promise<boolean> {
    if (!redisAvailable) return false;
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  },

  async flushAll(): Promise<void> {
    if (!redisAvailable) return;
    try {
      await redis.flushall();
    } catch (error) {
      console.error('Cache flush error:', error);
    }
  },

  isAvailable(): boolean {
    return redisAvailable;
  },

  getClient(): Redis {
    return redis;
  },

  async disconnect(): Promise<void> {
    await redis.disconnect();
  },
};

export default redis;
