import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { WebSocketProvider, useWebSocket, WebSocketMessageType } from '../contexts/WebSocketContext';
import { setupTest, cleanupTest, mockWebSocket } from '../utils/testUtils';

// Mock auth context
const mockAuthUser = { id: 'user-1', name: 'Test User' };
const mockUseAuth = vi.fn();

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('WebSocket Context', () => {
  beforeEach(() => {
    setupTest();
    mockUseAuth.mockReturnValue({ user: mockAuthUser });
  });

  afterEach(() => {
    cleanupTest();
    vi.clearAllMocks();
  });

  const renderWebSocketHook = () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WebSocketProvider>{children}</WebSocketProvider>
    );
    
    return renderHook(() => useWebSocket(), { wrapper });
  };

  it('should initialize with disconnected state', () => {
    const { result } = renderWebSocketHook();
    
    expect(result.current.isConnected).toBe(false);
    expect(result.current.connectionStatus).toBe('disconnected');
    expect(typeof result.current.subscribe).toBe('function');
    expect(typeof result.current.send).toBe('function');
  });

  it('should construct WebSocket URL with user ID', () => {
    renderWebSocketHook();
    
    expect(global.WebSocket).toHaveBeenCalledWith('ws://localhost:5000/ws?userId=user-1');
  });

  it('should construct WebSocket URL without user ID when not logged in', () => {
    mockUseAuth.mockReturnValue({ user: null });
    
    renderWebSocketHook();
    
    expect(global.WebSocket).toHaveBeenCalledWith('ws://localhost:5000/ws');
  });

  it('should handle WebSocket connection success', () => {
    const { result } = renderWebSocketHook();
    
    expect(result.current.isConnected).toBe(false);
    expect(result.current.connectionStatus).toBe('connecting');
    
    act(() => {
      mockWebSocket.triggerOpen();
    });
    
    expect(result.current.isConnected).toBe(true);
    expect(result.current.connectionStatus).toBe('connected');
  });

  it('should handle WebSocket connection close', () => {
    const { result } = renderWebSocketHook();
    
    act(() => {
      mockWebSocket.triggerOpen();
    });
    
    expect(result.current.isConnected).toBe(true);
    
    act(() => {
      mockWebSocket.triggerClose();
    });
    
    expect(result.current.isConnected).toBe(false);
    expect(result.current.connectionStatus).toBe('disconnected');
  });

  it('should handle WebSocket connection error', () => {
    const { result } = renderWebSocketHook();
    
    act(() => {
      mockWebSocket.triggerError(new Error('Connection failed'));
    });
    
    expect(result.current.connectionStatus).toBe('error');
    expect(result.current.isConnected).toBe(false);
  });

  it('should subscribe and unsubscribe from message types', () => {
    const { result } = renderWebSocketHook();
    const mockHandler = vi.fn();
    
    let unsubscribe: (() => void) | undefined;
    
    act(() => {
      unsubscribe = result.current.subscribe('cart_update', mockHandler);
    });
    
    // Send a message
    act(() => {
      mockWebSocket.triggerMessage({
        type: 'cart_update',
        payload: { action: 'add', item: { id: '1' } }
      });
    });
    
    expect(mockHandler).toHaveBeenCalledWith({ action: 'add', item: { id: '1' } });
    
    // Unsubscribe
    act(() => {
      unsubscribe?.();
    });
    
    // Send another message - handler should not be called
    act(() => {
      mockWebSocket.triggerMessage({
        type: 'cart_update',
        payload: { action: 'remove', item: { id: '1' } }
      });
    });
    
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple subscribers for same message type', () => {
    const { result } = renderWebSocketHook();
    const mockHandler1 = vi.fn();
    const mockHandler2 = vi.fn();
    
    act(() => {
      result.current.subscribe('cart_update', mockHandler1);
      result.current.subscribe('cart_update', mockHandler2);
    });
    
    act(() => {
      mockWebSocket.triggerMessage({
        type: 'cart_update',
        payload: { action: 'add', item: { id: '1' } }
      });
    });
    
    expect(mockHandler1).toHaveBeenCalledWith({ action: 'add', item: { id: '1' } });
    expect(mockHandler2).toHaveBeenCalledWith({ action: 'add', item: { id: '1' } });
  });

  it('should send messages when connected', () => {
    const { result } = renderWebSocketHook();
    
    act(() => {
      mockWebSocket.triggerOpen();
    });
    
    expect(result.current.isConnected).toBe(true);
    
    act(() => {
      result.current.send('cart_update', { action: 'add', item: { id: '1' } });
    });
    
    expect(mockWebSocket.send).toHaveBeenCalledWith(
      expect.stringContaining('"type":"cart_update"')
    );
    
    const sentMessage = JSON.parse(mockWebSocket.send.mock.calls[0][0]);
    expect(sentMessage.type).toBe('cart_update');
    expect(sentMessage.payload).toEqual({ action: 'add', item: { id: '1' } });
    expect(sentMessage.timestamp).toBeDefined();
    expect(sentMessage.id).toBeDefined();
  });

  it('should throw error when trying to send while disconnected', () => {
    const { result } = renderWebSocketHook();
    
    expect(() => {
      result.current.send('cart_update', { action: 'add' });
    }).toThrow('WebSocket is not connected (current status: disconnected)');
  });

  it('should not send error messages to handlers', () => {
    const { result } = renderWebSocketHook();
    const mockHandler = vi.fn();
    
    act(() => {
      result.current.subscribe('cart_update', mockHandler);
    });
    
    act(() => {
      mockWebSocket.triggerMessage({
        type: 'error',
        error: 'Something went wrong'
      });
    });
    
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should handle handler errors gracefully', () => {
    const { result } = renderWebSocketHook();
    const errorHandler = vi.fn(() => {
      throw new Error('Handler error');
    });
    const normalHandler = vi.fn();
    
    act(() => {
      result.current.subscribe('cart_update', errorHandler);
      result.current.subscribe('cart_update', normalHandler);
    });
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    act(() => {
      mockWebSocket.triggerMessage({
        type: 'cart_update',
        payload: { action: 'add' }
      });
    });
    
    expect(errorHandler).toHaveBeenCalled();
    expect(normalHandler).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in WebSocket handler for type cart_update:',
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });

  it('should warn for unregistered message types', () => {
    renderWebSocketHook();
    
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    act(() => {
      mockWebSocket.triggerMessage({
        type: 'unregistered_type',
        payload: { data: 'test' }
      });
    });
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'No handlers registered for WebSocket message type: unregistered_type'
    );
    
    consoleSpy.mockRestore();
  });

  it('should handle invalid JSON messages', () => {
    renderWebSocketHook();
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    act(() => {
      // Trigger onmessage with invalid JSON
      if (mockWebSocket.onmessage) {
        mockWebSocket.onmessage({ data: 'invalid json' } as MessageEvent);
      }
    });
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to parse WebSocket message:',
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });

  it('should reconnect on connection close (not normal closure)', () => {
    vi.useFakeTimers();
    
    const { result } = renderWebSocketHook();
    
    act(() => {
      mockWebSocket.triggerOpen();
    });
    
    expect(result.current.isConnected).toBe(true);
    
    // Close with non-normal code
    act(() => {
      mockWebSocket.triggerClose(1001, 'Going away');
    });
    
    expect(result.current.isConnected).toBe(false);
    
    // Fast-forward 3 seconds for reconnection attempt
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Should attempt to reconnect
    expect(global.WebSocket).toHaveBeenCalledTimes(2);
    
    vi.useRealTimers();
  });

  it('should not reconnect on normal closure', () => {
    vi.useFakeTimers();
    
    renderWebSocketHook();
    
    act(() => {
      mockWebSocket.triggerOpen();
    });
    
    // Close with normal code
    act(() => {
      mockWebSocket.triggerClose(1000, 'Normal closure');
    });
    
    // Fast-forward time - no reconnection should occur
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Should not attempt to reconnect
    expect(global.WebSocket).toHaveBeenCalledTimes(1);
    
    vi.useRealTimers();
  });

  it('should use wss protocol in https environment', () => {
    Object.defineProperty(window, 'location', {
      value: { protocol: 'https:', hostname: 'example.com' },
      writable: true,
    });
    
    mockUseAuth.mockReturnValue({ user: mockAuthUser });
    
    renderWebSocketHook();
    
    expect(global.WebSocket).toHaveBeenCalledWith('wss://example.com:5000/ws?userId=user-1');
  });
});