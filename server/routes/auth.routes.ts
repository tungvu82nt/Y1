
import express from 'express';
import { login, updateProfile } from '../controllers/auth.controller.ts';
import { authRateLimitMiddleware } from '../middleware/rateLimit.middleware.ts';

const router = express.Router();

router.post('/login', authRateLimitMiddleware, login);
router.put('/profile', updateProfile);

export default router;
