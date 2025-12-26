import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../config/redis';

interface CacheOptions {
  ttl?: number;
  keyPrefix?: string;
  skipCache?: (req: Request) => boolean;
}

export const cacheMiddleware = (options: CacheOptions = {}) => {
  const { ttl = 3600, keyPrefix = '', skipCache } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    if (skipCache?.(req)) {
      return next();
    }

    const cacheKey = `${keyPrefix}:${req.method}:${req.originalUrl}`;

    try {
      const cachedData = await cacheService.get(cacheKey);

      if (cachedData) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cachedData);
      }

      const originalJson = res.json.bind(res);
      const chunks: unknown[] = [];

      res.json = (data: unknown) => {
        chunks.push(data);
        return originalJson(data);
      };

      res.on('finish', async () => {
        if (res.statusCode === 200 && chunks.length > 0) {
          await cacheService.set(cacheKey, chunks[0], ttl);
          res.setHeader('X-Cache', 'MISS');
        }
      });

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

export const invalidateCache = async (pattern: string): Promise<void> => {
  await cacheService.delPattern(pattern);
};

export const clearCacheByPrefix = async (prefix: string): Promise<void> => {
  await cacheService.delPattern(`${prefix}:*`);
};
