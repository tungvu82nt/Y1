import { prisma } from '../db.ts';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { cacheService } from '../config/redis.ts';
import { wsService } from '../config/websocket.ts';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CreateOrderInput {
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
}

interface OrderResponse {
  id: string;
  userId: string;
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  estimatedDelivery: string;
  status: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
  }>;
}

interface RawOrderResponse {
  id: string;
  userId: string;
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  estimatedDelivery: string;
  status: string;
  date: Date;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
    selectedSize: string;
    selectedColor: string;
  }>;
}

function formatOrderForFrontend(order: RawOrderResponse): OrderResponse {
  return {
    id: order.id,
    userId: order.userId,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    shippingAddress: JSON.parse(order.shippingAddress) as ShippingAddress,
    paymentMethod: order.paymentMethod,
    estimatedDelivery: order.estimatedDelivery,
    status: order.status,
    date: order.date.toLocaleDateString(),
    items: order.items.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    })),
  };
}

export const orderService = {
  async getOrders(userId?: string): Promise<OrderResponse[]> {
    const cacheKey = `orders:${userId || 'all'}`;
    
    const cached = await cacheService.get<OrderResponse[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const orders = await prisma.order.findMany({
      where: userId ? { userId } : undefined,
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    const result = orders.map(formatOrderForFrontend);
    await cacheService.set(cacheKey, result, 600);

    return result;
  },

  async getOrderById(id: string, userId?: string): Promise<OrderResponse | null> {
    const order = await prisma.order.findFirst({
      where: {
        id,
        ...(userId && { userId }),
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return null;
    }

    return formatOrderForFrontend(order);
  },

  async createOrder(input: CreateOrderInput): Promise<OrderResponse> {
    const { userId, items, subtotal, tax, total, shippingAddress } = input;

    const order = await prisma.order.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        subtotal,
        tax,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod: 'VISA ending in 4242',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString(),
        updatedAt: new Date(),
        items: {
          create: items.map((item: CartItem) => ({
            productId: item.id,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            priceAtTime: item.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    await cacheService.delPattern('orders:*');

    const orderResponse = formatOrderForFrontend(order as unknown as RawOrderResponse);

    wsService.sendToUser(userId, {
      type: 'order_created',
      data: orderResponse,
    });

    return orderResponse;
  },

  async updateOrderStatus(id: string, status: string): Promise<OrderResponse | null> {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    await cacheService.delPattern('orders:*');

    const orderResponse = formatOrderForFrontend(order);

    wsService.sendToUser(order.userId, {
      type: 'order_updated',
      data: orderResponse,
    });

    return orderResponse;
  },

  async getOrdersByUser(userId: string): Promise<OrderResponse[]> {
    return this.getOrders(userId);
  },

  validateOrderInput(data: unknown): CreateOrderInput {
    const orderInputSchema = z.object({
      userId: z.string(),
      items: z.array(z.object({
        id: z.string(),
        name: z.string(),
        price: z.number().positive(),
        image: z.string().url(),
        selectedSize: z.string(),
        selectedColor: z.string(),
        quantity: z.number().int().positive(),
      })),
      subtotal: z.number().nonnegative(),
      tax: z.number().nonnegative(),
      total: z.number().positive(),
      shippingAddress: z.object({
        street: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        zipCode: z.string().min(1),
        country: z.string().min(1),
      }),
    });

    return orderInputSchema.parse(data);
  },
};
