
import { Request, Response } from 'express';
import { prisma } from '../db.js';

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { date: 'desc' }
        });
        
        // Format for frontend
        const formattedOrders = orders.map(order => ({
            ...order,
            date: order.date.toLocaleDateString(), // Convert Date object to string
            items: order.items.map(item => ({
                ...item.product,
                quantity: item.quantity,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor
            }))
        }));
        res.json(formattedOrders);
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};

export const createOrder = async (req: Request, res: Response) => {
  const { userId, items, subtotal, tax, total, shippingAddress } = req.body;
  
  try {
    const order = await prisma.order.create({
      data: {
        userId, 
        subtotal,
        tax,
        total,
        shippingAddress,
        paymentMethod: 'VISA ending in 4242',
        // Simulate 3 day delivery
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString(),
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            priceAtTime: item.price
          }))
        }
      }
    });
    res.status(201).json(order);
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Order creation failed', error: error.message });
  }
};
