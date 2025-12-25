import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, CartItem } from '../types';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  addOrder: (items: CartItem[], subtotal: number, tax: number, total: number, address: string) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
        try {
            const data = await api.get('/orders');
            setOrders(data);
        } catch (e) {
            console.error("Using local orders due to API error");
            const storedOrders = localStorage.getItem('yapee_orders');
            if (storedOrders) setOrders(JSON.parse(storedOrders));
        }
    };
    fetchOrders();
  }, []);

  const addOrder = async (items: CartItem[], subtotal: number, tax: number, total: number, address: string) => {
    const orderPayload = {
        userId: (user as any)?.id || null,
        items,
        subtotal,
        tax,
        total,
        shippingAddress: address
    };

    try {
        const newOrder = await api.post('/orders', orderPayload);
        
        // Transform the backend response to match frontend Order type if structure differs slightly
        // Here we assume backend returns a structure compatible with Order interface after format
        const formattedOrder: Order = {
            ...newOrder,
            date: new Date(newOrder.date).toLocaleDateString(),
            items: items // Keep items as is for immediate UI feedback
        };

        setOrders(prev => [formattedOrder, ...prev]);
        setCurrentOrder(formattedOrder);
        
        // Backup to local storage
        localStorage.setItem('yapee_orders', JSON.stringify([formattedOrder, ...orders]));
    } catch (e) {
        console.error("Failed to submit order", e);
        alert("Failed to submit order to server.");
    }
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      // In real app: await api.put(`/orders/${id}`, { status });
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