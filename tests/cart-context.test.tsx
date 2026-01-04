import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '../utils/testUtils';
import { CartProvider, useCart } from '../contexts/CartContext';
import { createMockProduct, createMockUser } from '../utils/testUtils';

// Mock AuthContext
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: createMockUser(),
  }),
}));

// Mock WebSocketContext
vi.mock('../contexts/WebSocketContext', () => ({
  useWebSocket: () => ({
    subscribe: vi.fn(() => vi.fn()),
  }),
}));

// Mock API
vi.mock('../utils/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('CartContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderCartHook = () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    
    return renderHook(() => useCart(), { wrapper });
  };

  it('should initialize with empty cart', () => {
    const { result } = renderCartHook();
    
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should load cart from localStorage', () => {
    const mockCart = [
      { ...createMockProduct(), quantity: 2, selectedSize: '42', selectedColor: 'Red' }
    ];
    localStorage.setItem('yapee_cart', JSON.stringify(mockCart));
    
    const { result } = renderCartHook();
    
    expect(result.current.cartItems).toEqual(mockCart);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.subtotal).toBeGreaterThan(0);
  });

  it('should add item to cart', async () => {
    const mockProduct = createMockProduct();
    const { result } = renderCartHook();
    
    await act(async () => {
      await result.current.addToCart(mockProduct, '42', 'Red');
    });
    
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0]).toEqual({
      ...mockProduct,
      quantity: 1,
      selectedSize: '42',
      selectedColor: 'Red',
    });
    expect(result.current.totalItems).toBe(1);
    expect(result.current.subtotal).toBe(mockProduct.price);
  });

  it('should increment quantity when adding same item', async () => {
    const mockProduct = createMockProduct();
    const { result } = renderCartHook();
    
    await act(async () => {
      await result.current.addToCart(mockProduct, '42', 'Red');
    });
    
    await act(async () => {
      await result.current.addToCart(mockProduct, '42', 'Red');
    });
    
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.subtotal).toBe(mockProduct.price * 2);
  });

  it('should add different items separately', async () => {
    const product1 = createMockProduct({ id: '1', name: 'Product 1' });
    const product2 = createMockProduct({ id: '2', name: 'Product 2' });
    const { result } = renderCartHook();
    
    await act(async () => {
      await result.current.addToCart(product1, '42', 'Red');
    });
    
    await act(async () => {
      await result.current.addToCart(product2, '43', 'Blue');
    });
    
    expect(result.current.cartItems).toHaveLength(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.subtotal).toBe(product1.price + product2.price);
  });

  it('should remove item from cart', async () => {
    const product1 = createMockProduct({ id: '1', name: 'Product 1' });
    const product2 = createMockProduct({ id: '2', name: 'Product 2' });
    const { result } = renderCartHook();
    
    await act(async () => {
      await result.current.addToCart(product1, '42', 'Red');
      await result.current.addToCart(product2, '43', 'Blue');
    });
    
    expect(result.current.cartItems).toHaveLength(2);
    
    await act(async () => {
      await result.current.removeFromCart(0); // Remove first item
    });
    
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].id).toBe('2');
    expect(result.current.totalItems).toBe(1);
  });

  it('should update item quantity', async () => {
    const mockProduct = createMockProduct();
    const { result } = renderCartHook();
    
    await act(async () => {
      await result.current.addToCart(mockProduct, '42', 'Red');
    });
    
    expect(result.current.cartItems[0].quantity).toBe(1);
    
    await act(async () => {
      await result.current.updateQuantity(0, 2); // Add 2 more
    });
    
    expect(result.current.cartItems[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.subtotal).toBe(mockProduct.price * 3);
  });

  it('should not update quantity below 1', async () => {
    const mockProduct = createMockProduct();
    const { result } = renderCartHook();
    
    await act(async () => {
      await result.current.addToCart(mockProduct, '42', 'Red');
    });
    
    const originalQuantity = result.current.cartItems[0].quantity;
    
    await act(async () => {
      await result.current.updateQuantity(0, -5); // Try to go below 1
    });
    
    expect(result.current.cartItems[0].quantity).toBe(originalQuantity);
    expect(result.current.totalItems).toBe(originalQuantity);
  });

  it('should clear cart', async () => {
    const product1 = createMockProduct({ id: '1', name: 'Product 1' });
    const product2 = createMockProduct({ id: '2', name: 'Product 2' });
    const { result } = renderCartHook();
    
    await act(async () => {
      await result.current.addToCart(product1, '42', 'Red');
      await result.current.addToCart(product2, '43', 'Blue');
    });
    
    expect(result.current.cartItems).toHaveLength(2);
    
    await act(async () => {
      await result.current.clearCart();
    });
    
    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('should sync with server on user change', async () => {
    const { result } = renderCartHook();
    
    // Mock successful server sync
    const { api } = await import('../utils/api');
    (api.get as any).mockResolvedValue({
      success: true,
      data: {
        items: [
          {
            id: 'cart-item-1',
            productId: '1',
            quantity: 2,
            selectedSize: '42',
            selectedColor: 'Red',
            product: createMockProduct({ id: '1' }),
          },
        ],
      },
    });
    
    // Trigger re-render
    await act(async () => {
      await result.current.syncWithServer();
    });
    
    expect(api.get).toHaveBeenCalledWith('/cart');
  });

  it('should handle server sync errors gracefully', async () => {
    const { result } = renderCartHook();
    
    // Mock server error
    const { api } = await import('../utils/api');
    (api.get as any).mockRejectedValue(new Error('Server error'));
    
    await act(async () => {
      await result.current.syncWithServer();
    });
    
    expect(result.current.error).toBe('Server error');
    expect(result.current.isLoading).toBe(false);
  });

  it('should clear errors', async () => {
    const { result } = renderCartHook();
    
    // Mock server error to create error state
    const { api } = await import('../utils/api');
    (api.get as any).mockRejectedValue(new Error('Test error'));
    
    await act(async () => {
      await result.current.syncWithServer();
    });
    
    expect(result.current.error).toBe('Test error');
    
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });

  it('should throw error when useCart is used outside provider', () => {
    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart must be used within a CartProvider');
  });
});