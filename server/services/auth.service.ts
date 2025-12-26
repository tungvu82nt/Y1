import { prisma } from '../db.ts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  isVip: boolean;
}

interface LoginInput {
  email: string;
  password: string;
}

interface TokenPayload {
  id: string;
  role: string;
}

interface AuthTokens {
  token: string;
  expiresIn: string;
}

export const authService = {
  async login(input: LoginInput): Promise<UserResponse & AuthTokens | null> {
    const { email, password } = input;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVip: user.isVip,
      token,
      expiresIn: '30d',
    };
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'user',
        isVip: false,
        updatedAt: new Date(),
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVip: user.isVip,
    };
  },

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isVip: true,
      },
    });

    if (!user) {
      return null;
    }

    return user as UserResponse;
  },

  async updateProfile(userId: string, data: {
    name?: string;
    avatar?: string;
  }): Promise<UserResponse> {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isVip: true,
      },
    });

    return user as UserResponse;
  },

  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as TokenPayload;
      return decoded;
    } catch {
      return null;
    }
  },

  async validateUser(id: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVip: true,
      },
    });

    return user as UserResponse | null;
  },

  validateLoginInput(data: unknown): LoginInput {
    const loginSchema = z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
    });

    return loginSchema.parse(data);
  },

  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  },
};
