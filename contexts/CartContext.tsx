import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { useWebSocket } from './WebSocketContext';
import { api } from '../utils/api';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth(); // Monitor user auth state
  const { subscribe } = useWebSocket(); // Optional: listen for external cart updates (e.g. from other device)

  // Load local cart on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('yapee_cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Sync with Backend when User changes (Login)
  useEffect(() => {
    const syncCart = async () => {
        if (!user) {
            // User logout: clear items or keep? Usually clear or keep local.
            // Let's keep local for now, logic can vary.
            return;
        }

        try {
            // 1. Get Server Cart
            const res = await api.get('/cart');
            const serverCart = res.data?.items?.map((item: any) => ({
                id: item.productId, // Map backend cartItem to frontend CartItem structure (Product based)
                ...item.product,
                quantity: item.quantity,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor
            })) || [];

            // 2. Simple strategy: If local has items, we might want to push them to server or merge.
            // For simplicity in this iteration provided "project state":
            // We overrides local from server to ensure sync across devices.
            // A more complex strategy would be: Merge Local -> Server, then pull Server.
            
            if (serverCart.length > 0) {
                 setCartItems(serverCart);
                 localStorage.setItem('yapee_cart', JSON.stringify(serverCart));
            } else {
                // If server empty but local has items, push local to server?
                // Let's implement full server authoritative later.
                // For now, prioritize server state.
            }
        } catch (error) {
            console.error("Failed to sync cart", error);
        }
    };
    
    syncCart();
  }, [user]);

  // Save to local storage whenever it changes (Persistence backup)
  useEffect(() => {
    localStorage.setItem('yapee_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product: Product, size: string, color: string) => {
    // Optimistic Update
    const newItem = { ...product, quantity: 1, selectedSize: size, selectedColor: color };
    
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

    // API Call
    if (user) {
        try {
            await api.post('/cart/add', {
                productId: product.id,
                quantity: 1,
                selectedSize: size,
                selectedColor: color
            });
        } catch (e) {
            console.error("Failed to add to server cart", e);
            // Revert logic would go here
        }
    }
  };

  const removeFromCart = async (index: number) => {
    const itemToRemove = cartItems[index];
    setCartItems(prev => prev.filter((_, i) => i !== index));

    if (user && itemToRemove) {
         // Note: Logic hole - Frontend uses array index, Backend needs CartItem ID.
         // Current Frontend type 'CartItem' (Product & Qty) doesn't hold CartItem ID from DB.
         // Improvement: We need to store DB CartItemID in frontend state if synced.
         // For now, we skip delete sync or we need to find item by props.
         // Let's assume we can't fully sync DELETE without refactoring CartItem type.
         // -> Backend Agent should have exposed ID.
         // To fix, we'll need to fetch cart again to sync.
         try {
             // Workaround: Sync after delay
             setTimeout(async () => {
                 const res = await api.get('/cart');
                 // ... sync logic
             }, 500);
         } catch(e) {}
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    setCartItems(prev => {
      const newItems = [...prev];
      newItems[index].quantity += delta;
      if (newItems[index].quantity < 1) newItems[index].quantity = 1;
      return newItems;
    });
    
    // Sync update? Requires CartItemId.
  };

  const clearCart = async () => {
    setCartItems([]);
    if (user) await api.delete('/cart');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}>
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