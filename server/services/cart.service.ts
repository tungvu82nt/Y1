
import { prisma } from '../db.ts';
import { Cart, CartItem, Product, Prisma } from '@prisma/client';

interface AddToCartInput {
  userId: string;
  productId: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export const cartService = {
  async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
             include: {
               product: true
             }
          }
        }
      });
    }

    return cart;
  },

  async addToCart({ userId, productId, quantity, selectedSize, selectedColor }: AddToCartInput) {
    const cart = await this.getCart(userId);

    // Check if item exists
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        selectedSize,
        selectedColor
      }
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity
        }
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        selectedSize,
        selectedColor
      }
    });
  },

  async updateItemQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return prisma.cartItem.delete({
        where: { id: itemId }
      });
    }
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
  },

  async removeItem(itemId: string) {
    return prisma.cartItem.delete({
      where: { id: itemId }
    });
  },

  async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }
  }
};
