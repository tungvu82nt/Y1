import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Test providers wrapper
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ErrorBoundary>
  );
};

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: RenderOptions
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders>
        {children}
      </AllTheProviders>
    ),
    ...options,
  });
};

// Mock data generators for testing
export const createMockProduct = (overrides = {}) => ({
  id: '1',
  name: 'Test Sneaker',
  brand: 'Test Brand',
  price: 99.99,
  originalPrice: 149.99,
  image: 'https://example.com/image.jpg',
  category: 'Running',
  rating: 4.5,
  reviews: 128,
  tags: ['new', 'best-seller'],
  discount: '33%',
  ...overrides,
});

export const createMockCartItem = (overrides = {}) => ({
  ...createMockProduct(),
  quantity: 1,
  selectedSize: '42',
  selectedColor: 'Black',
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg',
  memberSince: '2023-01-01',
  location: 'New York, NY',
  isVip: false,
  role: 'customer' as const,
  phone: '+1234567890',
  ...overrides,
});

export const createMockOrder = (overrides = {}) => ({
  id: 'order-1',
  date: '2024-01-01',
  items: [createMockCartItem()],
  subtotal: 99.99,
  tax: 8.00,
  shippingCost: 5.00,
  total: 112.99,
  status: 'Processing' as const,
  shippingAddress: '123 Test St, New York, NY 10001',
  paymentMethod: 'Credit Card',
  estimatedDelivery: '2024-01-05',
  userId: 'user-1',
  ...overrides,
});

// API Mock helpers
export const mockApiResponse = (data: any, success = true) => ({
  success,
  data,
  ...(success ? {} : { error: 'Test error message' }),
});

// LocalStorage helpers for testing
export const createMockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    store,
  };
};

// WebSocket mock for testing
export const createMockWebSocket = () => {
  const callbacks: Record<string, Function[]> = {};
  
  return {
    onopen: null as ((event: Event) => void) | null,
    onclose: null as ((event: CloseEvent) => void) | null,
    onerror: null as ((event: Event) => void) | null,
    onmessage: null as ((event: MessageEvent) => void) | null,
    readyState: 1 as const, // WebSocket.OPEN
    
    addEventListener: vi.fn((event: string, callback: Function) => {
      if (!callbacks[event]) callbacks[event] = [];
      callbacks[event].push(callback);
    }),
    
    removeEventListener: vi.fn((event: string, callback: Function) => {
      if (callbacks[event]) {
        callbacks[event] = callbacks[event].filter(cb => cb !== callback);
      }
    }),
    
    send: vi.fn(),
    close: vi.fn(),
    
    // Helper methods for testing
    triggerOpen: vi.fn(() => {
      if (callbacks.open) {
        callbacks.open.forEach(cb => cb({ type: 'open' }));
      }
      if (mockWebSocket.onopen) {
        mockWebSocket.onopen({ type: 'open' } as Event);
      }
    }),
    
    triggerClose: vi.fn((code = 1000, reason = '') => {
      if (callbacks.close) {
        callbacks.close.forEach(cb => cb({ code, reason, type: 'close' } as CloseEvent));
      }
      if (mockWebSocket.onclose) {
        mockWebSocket.onclose({ code, reason, type: 'close' } as CloseEvent);
      }
    }),
    
    triggerError: vi.fn((error = new Error('Test error')) => {
      if (callbacks.error) {
        callbacks.error.forEach(cb => cb(error));
      }
      if (mockWebSocket.onerror) {
        mockWebSocket.onerror(error as Event);
      }
    }),
    
    triggerMessage: vi.fn((data: any) => {
      const message = { type: 'message', data: JSON.stringify(data) };
      if (callbacks.message) {
        callbacks.message.forEach(cb => cb(message));
      }
      if (mockWebSocket.onmessage) {
        mockWebSocket.onmessage(message as MessageEvent);
      }
    }),
  };
};

// Global mock for WebSocket
export const mockWebSocket = createMockWebSocket();

// Setup function for tests
export const setupTest = () => {
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: createMockLocalStorage(),
    writable: true,
  });

  // Mock WebSocket
  global.WebSocket = vi.fn(() => mockWebSocket) as any;

  // Mock crypto.randomUUID if not available
  if (!global.crypto?.randomUUID) {
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: () => `test-uuid-${Date.now()}-${Math.random()}`,
      },
      writable: true,
    });
  }

  return {
    mockWebSocket,
  };
};

// Cleanup function for tests
export const cleanupTest = () => {
  vi.clearAllMocks();
  localStorage.clear();
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { customRender as render };