import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 100;

const cleanExpiredEntries = (): void => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
};

setInterval(cleanExpiredEntries, WINDOW_MS);

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const key = ip;
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
  } else {
    store[key].count++;
  }

  const current = store[key];
  const remaining = Math.max(0, MAX_REQUESTS - current.count);
  const resetTime = new Date(current.resetTime).toISOString();

  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Reset', resetTime);

  if (current.count > MAX_REQUESTS) {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later.',
        retryAfter: Math.ceil((current.resetTime - now) / 1000),
      },
    });
    return;
  }

  next();
};

export const strictRateLimitMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const key = `${ip}:strict`;
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
  } else {
    store[key].count++;
  }

  const current = store[key];
  const remaining = Math.max(0, 20 - current.count);
  const resetTime = new Date(current.resetTime).toISOString();

  res.setHeader('X-RateLimit-Limit', 20);
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Reset', resetTime);

  if (current.count > 20) {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later.',
        retryAfter: Math.ceil((current.resetTime - now) / 1000),
      },
    });
    return;
  }

  next();
};

export const authRateLimitMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const key = `${ip}:auth`;
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
  } else {
    store[key].count++;
  }

  const current = store[key];
  const remaining = Math.max(0, 5 - current.count);
  const resetTime = new Date(current.resetTime).toISOString();

  res.setHeader('X-RateLimit-Limit', 5);
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Reset', resetTime);

  if (current.count > 5) {
    res.status(429).json({
      success: false,
      error: {
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        message: 'Too many authentication attempts, please try again later.',
        retryAfter: Math.ceil((current.resetTime - now) / 1000),
      },
    });
    return;
  }

  next();
};
