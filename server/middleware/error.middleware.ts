
import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  console.error(`[Error] ${err.message}`);
  if (!isProduction) {
    console.error(err.stack);
  }

  const errorCode = err.code || 'INTERNAL_ERROR';

  const errorResponse = {
    success: false,
    error: {
      code: errorCode,
      message: err.message || 'An unexpected error occurred',
    },
  };

  if (!isProduction && err.stack) {
    (errorResponse as any).error.stack = err.stack;
  }

  if (err.details) {
    (errorResponse as any).error.details = err.details;
  }

  res.status(statusCode).json(errorResponse);
};

export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(code: string, message: string, details?: unknown): ApiError {
    return new ApiError(400, code, message, details);
  }

  static unauthorized(code: string = 'UNAUTHORIZED', message: string = 'Unauthorized'): ApiError {
    return new ApiError(401, code, message);
  }

  static forbidden(code: string = 'FORBIDDEN', message: string = 'Forbidden'): ApiError {
    return new ApiError(403, code, message);
  }

  static notFound(code: string = 'NOT_FOUND', message: string = 'Resource not found'): ApiError {
    return new ApiError(404, code, message);
  }

  static conflict(code: string, message: string, details?: unknown): ApiError {
    return new ApiError(409, code, message, details);
  }

  static internal(message: string = 'Internal server error'): ApiError {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }

  static tooManyRequests(code: string = 'RATE_LIMIT_EXCEEDED', message: string = 'Too many requests'): ApiError {
    return new ApiError(429, code, message);
  }
}
