
import { Request, Response } from 'express';
import { prisma } from '../db.js';

export const login = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    
    res.json(user);
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Login failed' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
    const { id, ...data } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: data
        });
        res.json(updatedUser);
    } catch (error: any) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};
