import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../contexts/CartContext';
import { Product } from '../types';

const mockProduct: Product = {
  id: 'prod-123',
  name: 'Running Shoes',
  brand: 'Nike',
  category: 'Running',
  price: 99.99,
  originalPrice: 129.99,
  image: 'https://example.com/shoes.jpg',
  rating: 4.5,
  reviews: 100,
  tags: ['new', 'sale'],
};

const mockProduct2: Product = {
  id: 'prod-456',
  name: 'Basketball Shoes',
  brand: 'Adidas',
  category: 'Basketball',
  price: 129.99,
  originalPrice: 159.99,
  image: 'https://example.com/basketball.jpg',
  rating: 4.8,
  reviews: 50,
  tags: ['new'],
};

describe('CartContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
    (window.localStorage as any).clear();
  });

  describe('CartProvider', () => {
    it('should provide cart context to children', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      expect(result.current).toBeDefined();
      expect(result.current.cartItems).toEqual([]);
      expect(result.current.addToCart).toBeInstanceOf(Function);
      expect(result.current.removeFromCart).toBeInstanceOf(Function);
      expect(result.current.updateQuantity).toBeInstanceOf(Function);
      expect(result.current.clearCart).toBeInstanceOf(Function);
    });

    it('should add a new item to cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addToCart(mockProduct, '42', 'Black');
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0]).toMatchObject({
        id: mockProduct.id,
        name: mockProduct.name,
        price: mockProduct.price,
        selectedSize: '42',
        selectedColor: 'Black',
        quantity: 1,
      });
    });

    it('should increase quantity when adding same item with same size and color', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addToCart(mockProduct, '42', 'Black');
        result.current.addToCart(mockProduct, '42', 'Black');
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(2);
    });

    it('should add separate items when size or color differs', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addToCart(mockProduct, '42', 'Black');
        result.current.addToCart(mockProduct, '43', 'Black');
        result.current.addToCart(mockProduct, '42', 'White');
      });

      expect(result.current.cartItems).toHaveLength(3);
    });

    it('should add different products as separate items', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addToCart(mockProduct, '42', 'Black');
        result.current.addToCart(mockProduct2, '44', 'Red');
      });

      expect(result.current.cartItems).toHaveLength(2);
      expect(result.current.cartItems[0].id).toBe(mockProduct.id);
      expect(result.current.cartItems[1].id).toBe(mockProduct2.id);
    });

    it('should remove item by index', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addToCart(mockProduct, '42', 'Black');
        result.current.addToCart(mockProduct2, '44', 'Red');
        result.current.removeFromCart(0);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].id).toBe(mockProduct2.id);
    });

    it('should update quantity with positive delta', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addToCart(mockProduct, '42', 'Black');
        result.current.updateQuantity(0, 2);
      });

      expect(result.current.cartItems[0].quantity).toBe(3);
    });

    it('should update quantity with negative delta but not below 1', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addToCart(mockProduct, '42', 'Black');
        result.current.updateQuantity(0, -5);
      });

      expect(result.current.cartItems[0].quantity).toBe(1);
    });

    it('should clear all items from cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addToCart(mockProduct, '42', 'Black');
        result.current.addToCart(mockProduct2, '44', 'Red');
        result.current.clearCart();
      });

      expect(result.current.cartItems).toEqual([]);
    });

    it('should calculate totalItems correctly', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addToCart(mockProduct, '42', 'Black');
        result.current.addToCart(mockProduct, '43', 'Black');
        result.current.addToCart(mockProduct2, '44', 'Red');
      });

      expect(result.current.totalItems).toBe(3);
    });

    it('should calculate subtotal correctly', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addToCart(mockProduct, '42', 'Black');
        result.current.addToCart(mockProduct, '43', 'Black');
        result.current.addToCart(mockProduct2, '44', 'Red');
      });

      expect(result.current.subtotal).toBe(99.99 * 2 + 129.99);
    });

    it('should save cart to localStorage on changes', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addToCart(mockProduct, '42', 'Black');
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'yapee_cart',
        expect.any(String)
      );
    });

    it('should load cart from localStorage on mount', () => {
      const storedCart = JSON.stringify([
        { ...mockProduct, quantity: 2, selectedSize: '42', selectedColor: 'Black' },
      ]);
      (localStorage.getItem as any).mockReturnValue(storedCart);

      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(2);
    });
  });

  describe('useCart Hook', () => {
    it('should throw error when used outside CartProvider', () => {
      expect(() => renderHook(() => useCart())).toThrow(
        'useCart must be used within a CartProvider'
      );
    });
  });
});
