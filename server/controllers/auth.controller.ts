import { Request, Response } from 'express';
import { authService } from '../services/auth.service.ts';
import { z } from 'zod';
import { ApiError } from '../middleware/error.middleware.ts';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedInput = authService.validateLoginInput(req.body);
    const result = await authService.login(validatedInput);

    if (!result) {
      throw ApiError.unauthorized('INVALID_CREDENTIALS', 'Invalid email or password');
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
      return;
    }
    if (error instanceof z.ZodError) {
      throw ApiError.badRequest('VALIDATION_ERROR', 'Validation failed', error.issues);
    }
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: errorMessage,
      },
    });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw ApiError.unauthorized('NOT_AUTHENTICATED', 'User not authenticated');
    }

    const { id, ...data } = req.body;
    const updatedUser = await authService.updateProfile(userId, data);

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
      return;
    }
    const errorMessage = error instanceof Error ? error.message : 'Update failed';
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message: errorMessage,
      },
    });
  }
};
