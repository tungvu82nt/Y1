import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '../utils/testUtils';
import { OrderProvider, useOrder } from '../contexts/OrderContext';
import { createMockCartItem, createMockUser, createMockOrder } from '../utils/testUtils';

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

describe('OrderContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderOrderHook = () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OrderProvider>{children}</OrderProvider>
    );
    
    return renderHook(() => useOrder(), { wrapper });
  };

  it('should initialize with empty orders', () => {
    const { result } = renderOrderHook();
    
    expect(result.current.orders).toEqual([]);
    expect(result.current.currentOrder).toBeNull();
    expect(result.current.isLoading).toBe(true); // Loading during fetch
    expect(result.current.error).toBeNull();
  });

  it('should load orders from localStorage', async () => {
    const mockOrders = [createMockOrder()];
    localStorage.setItem('yapee_orders', JSON.stringify(mockOrders));
    
    const { result } = renderOrderHook();
    
    // Wait for loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.orders).toEqual(mockOrders);
    expect(result.current.isLoading).toBe(false);
  });

  it('should create order successfully', async () => {
    const mockItems = [createMockCartItem()];
    const subtotal = 100;
    const tax = 8;
    const total = 108;
    const address = '123 Test St';
    
    const { result } = renderOrderHook();
    
    // Mock successful API response
    const { api } = await import('../utils/api');
    (api.post as any).mockResolvedValue({
      success: true,
      data: {
        id: 'order-1',
        date: new Date().toISOString(),
        status: 'Processing',
      },
    });
    
    await act(async () => {
      await result.current.addOrder(mockItems, subtotal, tax, total, address);
    });
    
    expect(result.current.orders).toHaveLength(1);
    expect(result.current.currentOrder).toBeTruthy();
    expect(result.current.currentOrder?.status).toBe('Processing');
    expect(api.post).toHaveBeenCalledWith('/orders', expect.any(Object));
  });

  it('should handle order creation error', async () => {
    const mockItems = [createMockCartItem()];
    const { result } = renderOrderHook();
    
    // Mock API error
    const { api } = await import('../utils/api');
    (api.post as any).mockRejectedValue(new Error('Order creation failed'));
    
    await act(async () => {
      await result.current.addOrder(mockItems, 100, 8, 108, '123 Test St');
    });
    
    expect(result.current.error).toBe('Order creation failed');
    expect(result.current.isLoading).toBe(false);
  });

  it('should create fallback order when API fails', async () => {
    const mockItems = [createMockCartItem()];
    const { result } = renderOrderHook();
    
    // Mock API error
    const { api } = await import('../utils/api');
    (api.post as any).mockRejectedValue(new Error('API error'));
    
    await act(async () => {
      await result.current.addOrder(mockItems, 100, 8, 108, '123 Test St');
    });
    
    expect(result.current.orders).toHaveLength(1);
    expect(result.current.orders[0]).toMatchObject({
      items: mockItems,
      subtotal: 100,
      tax: 8,
      total: 108,
      shippingAddress: '123 Test St',
      status: 'Processing',
    });
  });

  it('should update order status', async () => {
    const mockOrder = createMockOrder({ id: 'order-1', status: 'Processing' });
    const { result } = renderOrderHook();
    
    // Start with existing order
    await act(async () => {
      await result.current.addOrder([mockOrder.items[0]], 100, 8, 108, '123 Test St');
    });
    
    expect(result.current.orders[0].status).toBe('Processing');
    
    // Mock successful status update
    const { api } = await import('../utils/api');
    (api.put as any).mockResolvedValue({
      success: true,
    });
    
    await act(async () => {
      await result.current.updateOrderStatus('order-1', 'Shipped');
    });
    
    expect(result.current.orders[0].status).toBe('Shipped');
    expect(api.put).toHaveBeenCalledWith('/orders/order-1/status', { status: 'Shipped' });
  });

  it('should handle status update error', async () => {
    const mockOrder = createMockOrder();
    const { result } = renderOrderHook();
    
    await act(async () => {
      await result.current.addOrder([mockOrder.items[0]], 100, 8, 108, '123 Test St');
    });
    
    // Mock API error
    const { api } = await import('../utils/api');
    (api.put as any).mockRejectedValue(new Error('Update failed'));
    
    await act(async () => {
      await result.current.updateOrderStatus('order-1', 'Delivered');
    });
    
    expect(result.current.error).toBe('Update failed');
    // Should still update locally despite API error
    expect(result.current.orders[0].status).toBe('Delivered');
  });

  it('should find order by ID', () => {
    const mockOrder1 = createMockOrder({ id: 'order-1' });
    const mockOrder2 = createMockOrder({ id: 'order-2' });
    const { result } = renderOrderHook();
    
    // Mock localStorage with orders
    localStorage.setItem('yapee_orders', JSON.stringify([mockOrder1, mockOrder2]));
    
    expect(result.current.getOrderById('order-1')).toEqual(mockOrder1);
    expect(result.current.getOrderById('order-2')).toEqual(mockOrder2);
    expect(result.current.getOrderById('order-3')).toBeUndefined();
  });

  it('should refresh orders', async () => {
    const { result } = renderOrderHook();
    
    // Mock successful API response
    const { api } = await import('../utils/api');
    (api.get as any).mockResolvedValue({
      success: true,
      data: [createMockOrder()],
    });
    
    await act(async () => {
      await result.current.refreshOrders();
    });
    
    expect(api.get).toHaveBeenCalledWith('/orders');
    expect(result.current.orders).toHaveLength(1);
  });

  it('should handle refresh error', async () => {
    const { result } = renderOrderHook();
    
    // Mock API error
    const { api } = await import('../utils/api');
    (api.get as any).mockRejectedValue(new Error('Refresh failed'));
    
    await act(async () => {
      await result.current.refreshOrders();
    });
    
    expect(result.current.error).toBe('Refresh failed');
    expect(result.current.isLoading).toBe(false);
  });

  it('should clear errors', async () => {
    const { result } = renderOrderHook();
    
    // Create an error state
    const { api } = await import('../utils/api');
    (api.get as any).mockRejectedValue(new Error('Test error'));
    
    await act(async () => {
      await result.current.refreshOrders();
    });
    
    expect(result.current.error).toBe('Test error');
    
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });

  it('should sync orders from localStorage on mount', () => {
    const mockOrders = [createMockOrder({ id: 'order-1' })];
    localStorage.setItem('yapee_orders', JSON.stringify(mockOrders));
    
    const { result } = renderOrderHook();
    
    expect(result.current.orders).toEqual(mockOrders);
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw error
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = vi.fn(() => {
      throw new Error('Storage error');
    });
    
    const { result } = renderOrderHook();
    
    expect(result.current.orders).toEqual([]);
    
    // Restore
    localStorage.getItem = originalGetItem;
  });

  it('should throw error when useOrder is used outside provider', () => {
    expect(() => {
      renderHook(() => useOrder());
    }).toThrow('useOrder must be used within an OrderProvider');
  });

  it('should require user login for order creation', async () => {
    // Mock no user
    vi.doMock('../contexts/AuthContext', () => ({
      useAuth: () => ({ user: null }),
    }));
    
    const { result } = renderOrderHook();
    
    await expect(
      result.current.addOrder([createMockCartItem()], 100, 8, 108, '123 Test St')
    ).rejects.toThrow('User must be logged in to create an order');
  });
});