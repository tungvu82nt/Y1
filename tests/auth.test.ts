import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

vi.mock('../server/db.ts', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

vi.mock('../server/services/auth.service.ts', () => ({
  authService: {
    login: vi.fn(),
    validateLoginInput: vi.fn().mockImplementation((data) => data),
    updateProfile: vi.fn(),
  },
}));

import { prisma } from '../server/db.ts';
import { login, updateProfile } from '../server/controllers/auth.controller.ts';
import { authService } from '../server/services/auth.service.ts';
import { protect, admin } from '../server/middleware/auth.middleware.ts';

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockReq = {
      body: {},
    };
    
    mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
  });

  describe('login', () => {
    it('should return user data and token on successful login', async () => {
      const mockResult = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        avatar: null,
        token: 'mock-jwt-token',
        expiresIn: '30d',
      };

      mockReq.body = { email: 'test@example.com', password: 'password123' };
      (authService.login as any).mockResolvedValue(mockResult);

      await login(mockReq as Request, mockRes as Response);

      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
      });
    });

    it('should return 401 when user not found', async () => {
      mockReq.body = { email: 'nonexistent@example.com', password: 'password123' };
      (authService.login as any).mockResolvedValue(null);

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('should handle database errors', async () => {
      mockReq.body = { email: 'test@example.com', password: 'password123' };
      (authService.login as any).mockRejectedValue(new Error('Database error'));

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database error',
      });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const mockUpdatedUser = {
        id: 'user-123',
        name: 'Updated Name',
        email: 'test@example.com',
        role: 'user',
        avatar: 'https://example.com/avatar.jpg',
      };

      mockReq.body = {
        name: 'Updated Name',
        location: 'New York',
      };
      (mockReq as any).user = { id: 'user-123', role: 'user' };
      (authService.updateProfile as any).mockResolvedValue(mockUpdatedUser);

      await updateProfile(mockReq as Request, mockRes as Response);

      expect(authService.updateProfile).toHaveBeenCalledWith('user-123', {
        name: 'Updated Name',
        location: 'New York',
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedUser,
      });
    });

    it('should handle update errors', async () => {
      mockReq.body = { name: 'Updated Name' };
      (mockReq as any).user = { id: 'user-123', role: 'user' };
      (authService.updateProfile as any).mockRejectedValue(new Error('Update failed'));

      await updateProfile(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Update failed',
      });
    });

    it('should return 401 when user not authenticated', async () => {
      mockReq.body = { name: 'Updated Name' };
      (mockReq as any).user = undefined;

      await updateProfile(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not authenticated',
      });
    });
  });
});

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockReq = {
      headers: {},
    };
    
    mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
    
    mockNext = vi.fn();
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('protect', () => {
    it('should call next() with valid token', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        isVip: false,
      };

      mockReq.headers = {
        authorization: 'Bearer valid-token-here',
      };

      (jwt.verify as any).mockReturnValue({ id: 'user-123', role: 'user' });
      (prisma.user.findUnique as any).mockResolvedValue(mockUser);

      await protect(mockReq as Request, mockRes as Response, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(
        'valid-token-here',
        expect.any(String)
      );
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        select: { id: true, name: true, email: true, role: true, isVip: true },
      });
      expect((mockReq as any).user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 401 when no token provided', async () => {
      mockReq.headers = {};

      await protect(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', async () => {
      mockReq.headers = {
        authorization: 'Bearer invalid-token',
      };

      (jwt.verify as any).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await protect(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when user not found', async () => {
      mockReq.headers = {
        authorization: 'Bearer valid-token',
      };

      (jwt.verify as any).mockReturnValue({ id: 'deleted-user', role: 'user' });
      (prisma.user.findUnique as any).mockResolvedValue(null);

      await protect(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not authorized, user not found' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header does not start with Bearer', async () => {
      mockReq.headers = {
        authorization: 'Basic some-token',
      };

      await protect(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('admin', () => {
    it('should call next() when user is admin', () => {
      (mockReq as any).user = { id: 'admin-123', role: 'admin' };

      admin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should return 403 when user is not admin', () => {
      (mockReq as any).user = { id: 'user-123', role: 'user' };

      admin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not authorized as an admin' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when user is VIP but not admin', () => {
      (mockReq as any).user = { id: 'vip-123', role: 'vip' };

      admin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not authorized as an admin' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when no user attached to request', () => {
      (mockReq as any).user = undefined;

      admin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not authorized as an admin' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
