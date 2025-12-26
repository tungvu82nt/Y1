import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }

    req.body = result.data;
    next();
  };
};

export const validateQuery = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }

    Object.assign(req.query, result.data);
    next();
  };
};

export const validateParams = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }

    Object.assign(req.params, result.data);
    next();
  };
};
