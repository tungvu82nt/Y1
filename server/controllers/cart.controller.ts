
import { Request, Response } from 'express';
import { cartService } from '../services/cart.service.ts';
import { ApiError } from '../middleware/error.middleware.ts';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw ApiError.unauthorized('NOT_AUTHENTICATED', 'User not authenticated');

  const cart = await cartService.getCart(userId);
  res.json({ success: true, data: cart });
};

export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw ApiError.unauthorized('NOT_AUTHENTICATED', 'User not authenticated');

  const { productId, quantity, selectedSize, selectedColor } = req.body;
  
  if (!productId || !quantity) {
      throw ApiError.badRequest('INVALID_INPUT', 'ProductId and quantity are required');
  }

  const item = await cartService.addToCart({
    userId,
    productId,
    quantity,
    selectedSize: selectedSize || '',
    selectedColor: selectedColor || ''
  });

  res.json({ success: true, data: item });
};

export const updateItem = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;

    const updated = await cartService.updateItemQuantity(id, quantity);
    res.json({ success: true, data: updated });
};

export const removeItem = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    await cartService.removeItem(id);
    res.json({ success: true, message: 'Item removed' });
};

export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw ApiError.unauthorized('NOT_AUTHENTICATED', 'User not authenticated');

    await cartService.clearCart(userId);
    res.json({ success: true, message: 'Cart cleared' });
};
