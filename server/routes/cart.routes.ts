
import express from 'express';
import { addToCart, clearCart, getCart, removeItem, updateItem } from '../controllers/cart.controller.ts';
import { protect } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.use(protect); // All cart routes require auth

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/items/:id', updateItem);
router.delete('/items/:id', removeItem);
router.delete('/', clearCart);

export default router;
