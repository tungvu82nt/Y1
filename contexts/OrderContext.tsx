import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, CartItem } from '../types';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  addOrder: (items: CartItem[], subtotal: number, tax: number, total: number, address: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Load orders from local storage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem('shoestore_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  // Save orders to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('shoestore_orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (items: CartItem[], subtotal: number, tax: number, total: number, address: string) => {
    const date = new Date();
    const deliveryDate = new Date(date);
    deliveryDate.setDate(date.getDate() + Math.floor(Math.random() * 3) + 3);
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      items: [...items],
      subtotal,
      tax,
      shippingCost: 0,
      total,
      status: 'Processing',
      shippingAddress: address,
      paymentMethod: 'VISA ending in 4242',
      estimatedDelivery: deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    };

    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const getOrderById = (id: string) => {
    return orders.find(o => o.id === id);
  };

  return (
    <OrderContext.Provider value={{ orders, currentOrder, addOrder, updateOrderStatus, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};