
import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/order.controller.ts';
import { protect, admin } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.get('/', getOrders);
router.get('/my-orders', protect, getOrders);
router.post('/', protect, createOrder);
router.put('/:id/status', protect, updateOrderStatus);

export default router;
