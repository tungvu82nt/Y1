import { Request } from 'express';
import { authService } from '../services/auth.service.ts';

export interface GraphQLContext {
  user?: {
    id: string;
    role: string;
  };
}

export const context = async ({ req }: { req: Request }): Promise<GraphQLContext> => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return {};
  }

  try {
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      return {};
    }
    return {
      user: {
        id: decoded.id,
        role: decoded.role || 'customer',
      },
    };
  } catch {
    return {};
  }
};
