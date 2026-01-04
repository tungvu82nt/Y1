import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, CartItemRequest, CartItemUpdateRequest } from '../types';
import { useAuth } from './AuthContext';
import { useWebSocket } from './WebSocketContext';
import { api } from '../utils/api';
import { CartResponse, CartItemResponse, CartUpdateMessage } from '../types/cart';
import { withRetry } from '../utils/retry';

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  error: string | null;
  notification: string | null;
  addToCart: (product: Product, size: string, color: string) => Promise<void>;
  removeFromCart: (index: number) => Promise<void>;
  updateQuantity: (index: number, delta: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncWithServer: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const { user } = useAuth();
  const { subscribe } = useWebSocket();

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const loadCartFromStorage = (): CartItem[] => {
    try {
      const storedCart = localStorage.getItem('yapee_cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  };

  const saveCartToStorage = (items: CartItem[]): void => {
    try {
      localStorage.setItem('yapee_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  const transformServerCartItems = (serverItems: CartItemResponse[]): CartItem[] => {
    return serverItems.map(item => ({
      ...item.product,
      id: item.product.id,
      cartItemId: item.id,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor
    }));
  };

  useEffect(() => {
    const storedCart = loadCartFromStorage();
    setCartItems(storedCart);
  }, []);

  const syncWithServer = async (): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await withRetry(() => api.get<CartResponse>('/cart'));
      
      if (response.success && response.data?.items) {
        const serverCart = transformServerCartItems(response.data.items);
        setCartItems(serverCart);
        saveCartToStorage(serverCart);
      } else {
        throw new Error(response.error || 'Failed to sync cart');
      }
    } catch (error) {
      console.error("Failed to sync cart with server:", error);
      setError(error instanceof Error ? error.message : 'Failed to sync cart');
      showNotification('Could not sync cart with the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    syncWithServer();
  }, [user?.id]);

  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  useEffect(() => {
    const unsubscribeCartUpdate = subscribe<CartUpdateMessage>('cart_update', (data) => {
      console.log("🛒 Real-time Cart Update:", data);
      
      switch (data.action) {
        case 'add':
          if (data.item) {
            setCartItems(prev => {
              const existingIndex = prev.findIndex(
                item => item.id === data.item!.id && 
                       item.selectedSize === data.item!.selectedSize && 
                       item.selectedColor === data.item!.selectedColor
              );
              
              if (existingIndex > -1) {
                const newItems = [...prev];
                newItems[existingIndex].quantity += data.item!.quantity;
                return newItems;
              } else {
                return [...prev, data.item!];
              }
            });
          }
          break;
          
        case 'remove':
          if (data.item) {
            setCartItems(prev => prev.filter(
              item => !(item.id === data.item!.id && 
                       item.selectedSize === data.item!.selectedSize && 
                       item.selectedColor === data.item!.selectedColor)
            ));
          }
          break;
          
        case 'clear':
          setCartItems([]);
          break;
          
        case 'update':
          if (data.items) {
            setCartItems(data.items);
          }
          break;
      }
    });

    return unsubscribeCartUpdate;
  }, [subscribe]);

  const addToCart = async (product: Product, size: string, color: string): Promise<void> => {
    setError(null);
    
    const newItem: CartItem = { 
      ...product, 
      quantity: 1, 
      selectedSize: size, 
      selectedColor: color 
    };
    
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingIndex > -1) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += 1;
        return newItems;
      } else {
        return [...prev, newItem];
      }
    });

    if (user) {
      try {
        const request: CartItemRequest = {
          productId: product.id,
          quantity: 1,
          selectedSize: size,
          selectedColor: color
        };
        
        const response = await api.post<CartItemResponse, CartItemRequest>('/cart/add', request);
        
        if (response.success && response.data) {
          setCartItems(prev => prev.map(item => 
            (item.id === product.id && item.selectedSize === size && item.selectedColor === color && !item.cartItemId)
              ? { ...item, cartItemId: response.data!.id }
              : item
          ));
        }
      } catch (error) {
        console.error("Failed to add to server cart:", error);
        setError(error instanceof Error ? error.message : 'Failed to add item to cart');
      }
    }
  };

  const removeFromCart = async (index: number): Promise<void> => {
    const itemToRemove = cartItems[index];
    
    setCartItems(prev => prev.filter((_, i) => i !== index));

    if (user && itemToRemove.cartItemId) {
      try {
        await api.delete(`/cart/items/${itemToRemove.cartItemId}`);
      } catch (error) {
        console.error("Failed to remove item from server:", error);
        setError(error instanceof Error ? error.message : 'Failed to remove item');
      }
    }
  };

  const updateQuantity = async (index: number, delta: number): Promise<void> => {
    const itemToUpdate = cartItems[index];
    const newQuantity = itemToUpdate.quantity + delta;
    
    if (newQuantity < 1) return;

    setCartItems(prev => {
      const newItems = [...prev];
      newItems[index].quantity = newQuantity;
      return newItems;
    });
    
    if (user && itemToUpdate.cartItemId) {
      try {
        const request: CartItemUpdateRequest = {
          quantity: newQuantity
        };
        
        await api.put(`/cart/items/${itemToUpdate.cartItemId}`, request);
      } catch (error) {
        console.error("Failed to update item quantity on server:", error);
        setError(error instanceof Error ? error.message : 'Failed to update quantity');
      }
    }
  };

  const clearCart = async (): Promise<void> => {
    setError(null);
    
    setCartItems([]);
    
    if (user) {
      try {
        await api.delete('/cart');
      } catch (error) {
        console.error("Failed to clear cart on server:", error);
        setError(error instanceof Error ? error.message : 'Failed to clear cart');
      }
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const clearError = (): void => {
    setError(null);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      isLoading,
      error,
      notification,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      syncWithServer,
      totalItems, 
      subtotal,
      clearError
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};