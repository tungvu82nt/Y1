import { Request, Response } from 'express';
import { orderService } from '../services/order.service.ts';
import { ApiError } from '../middleware/error.middleware.ts';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const getOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const orders = await orderService.getOrders(userId);
    res.json(orders);
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
    console.error('Error fetching orders:', error);
    throw ApiError.internal('Failed to fetch orders');
  }
};

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    throw ApiError.unauthorized('NOT_AUTHENTICATED', 'User not authenticated');
  }

  try {
    const validatedInput = orderService.validateOrderInput(req.body);
    const order = await orderService.createOrder({
      userId,
      ...validatedInput,
    });

    res.status(201).json({
      success: true,
      data: order,
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
    console.error('Error creating order:', error);
    throw ApiError.internal('Order creation failed');
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await orderService.updateOrderStatus(id, status);

    if (!order) {
      throw ApiError.notFound('ORDER_NOT_FOUND', 'Order not found');
    }

    res.json({
      success: true,
      data: order,
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
    console.error('Error updating order status:', error);
    throw ApiError.internal('Failed to update order status');
  }
};
