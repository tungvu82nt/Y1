import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, User } from '../types';
import { Order, OrderCreateMessage, OrderUpdateMessage } from '../types/order';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';
import { useWebSocket } from './WebSocketContext';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  addOrder: (items: CartItem[], subtotal: number, tax: number, total: number, address: string) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
  clearError: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { subscribe } = useWebSocket();

  const loadOrdersFromStorage = (): Order[] => {
    try {
      const storedOrders = localStorage.getItem('yapee_orders');
      return storedOrders ? JSON.parse(storedOrders) : [];
    } catch (error) {
      console.error('Error loading orders from localStorage:', error);
      return [];
    }
  };

  const saveOrdersToStorage = (ordersData: Order[]): void => {
    try {
      localStorage.setItem('yapee_orders', JSON.stringify(ordersData));
    } catch (error) {
      console.error('Error saving orders to localStorage:', error);
    }
  };

  useEffect(() => {
    const unsubscribeUpdated = subscribe<OrderUpdateMessage>('order_status', (data) => {
      console.log("🔔 Real-time Order Status Update:", data);
      setOrders(prev => prev.map(o =>
        o.id === data.id ? {
          ...o,
          status: data.status,
          ...(data.estimatedDelivery && { estimatedDelivery: data.estimatedDelivery })
        } : o
      ));
    });

    const unsubscribeCreated = subscribe<OrderCreateMessage>('order_created', (data) => {
      console.log("🔔 Real-time New Order:", data);
      setOrders(prev => [data, ...prev]);
    });

    return () => {
      unsubscribeUpdated();
      unsubscribeCreated();
    };
  }, [subscribe]);

  const fetchOrders = async (): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Order[]>('/orders');
      if (response.success && response.data) {
        setOrders(response.data);
        saveOrdersToStorage(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error("API error, using local storage:", error);
      setError(error instanceof Error ? error.message : 'Failed to fetch orders');
      const storedOrders = loadOrdersFromStorage();
      setOrders(storedOrders);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  const addOrder = async (
    items: CartItem[],
    subtotal: number,
    tax: number,
    total: number,
    address: string
  ): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in to create an order');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<Order, any>('/orders', { /* ... payload ... */ });

      if (response.success && response.data) {
        const formattedOrder: Order = {
          ...response.data,
          date: new Date(response.data.date).toLocaleDateString(),
          items: items
        };

        setOrders(prev => {
          const updated = [formattedOrder, ...prev];
          saveOrdersToStorage(updated);
          return updated;
        });

        setCurrentOrder(formattedOrder);
      } else {
        throw new Error(response.error || 'Failed to create order');
      }
    } catch (error) {
      console.error("API not available, using local storage:", error);
      setError(error instanceof Error ? error.message : 'Failed to create order');

      const localOrder: Order = {
        id: Date.now().toString(),
        userId: user.id,
        items: items,
        subtotal,
        tax,
        total,
        shippingCost: 0,
        shippingAddress: address,
        status: 'PROCESSING',
        date: new Date().toLocaleDateString(),
        paymentMethod: 'Credit Card',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      };

      setOrders(prev => {
        const updated = [localOrder, ...prev];
        saveOrdersToStorage(updated);
        return updated;
      });

      setCurrentOrder(localOrder);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.put<Order, any>(`/orders/${id}/status`, { status });

      if (response.success) {
        setOrders(prev => {
          const updated = prev.map(o =>
            o.id === id ? { ...o, status } : o
          );
          saveOrdersToStorage(updated);
          return updated;
        });
      } else {
        throw new Error(response.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error("API not available, updating local storage:", error);
      setError(error instanceof Error ? error.message : 'Failed to update order status');

      setOrders(prev => {
        const updated = prev.map(o =>
          o.id === id ? { ...o, status } : o
        );
        saveOrdersToStorage(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderById = (id: string): Order | undefined => {
    return orders.find(o => o.id === id);
  };

  const refreshOrders = async (): Promise<void> => {
    await fetchOrders();
  };

  const clearError = (): void => {
    setError(null);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      currentOrder,
      isLoading,
      error,
      addOrder,
      updateOrderStatus,
      getOrderById,
      refreshOrders,
      clearError
    }}>
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