
import express from 'express';
import { login, updateProfile } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);
router.put('/profile', updateProfile);

export default router;
