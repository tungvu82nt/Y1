import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { WebSocketMessage } from "../types/websocket";

// Define specific message types for type safety
export type WebSocketMessageType =
  | 'cart_update'
  | 'order_status'
  | 'product_stock'
  | 'user_notification'
  | 'price_update'
  | 'connected'
  | 'error'
  | 'order_created';

export type MessageHandler<T = any> = (data: T) => void;

// Type-safe message handlers map
type HandlersMap = Map<WebSocketMessageType, Set<MessageHandler>>;

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: <T>(type: WebSocketMessageType, handler: MessageHandler<T>) => () => void;
  send: <T>(type: WebSocketMessageType, data: T) => void;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<HandlersMap>(new Map());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const getWebSocketUrl = (): string => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.hostname || 'localhost';
    const port = "5000";
    const userId = user?.id || '';

    return `${protocol}//${host}:${port}/ws${userId ? `?userId=${userId}` : ""}`;
  };

  const resetConnection = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
  };

  const handleConnectionError = (error: Event | Error) => {
    // `WebSocket.onerror` is often opaque (Event without details). Avoid noisy logs.
    const readyState = socketRef.current?.readyState;
    console.warn("WebSocket error (will rely on onclose for retries)", {
      readyState,
      message: error instanceof Error ? error.message : undefined,
    });
    setConnectionStatus('error');
  };

  const connect = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');

    try {
      const wsUrl = getWebSocketUrl();
      console.log("Connecting to WebSocket:", wsUrl);

      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ WebSocket Connected");
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = undefined;
        }
      };

      socket.onclose = (event) => {
        console.log(`⚠️ WebSocket Disconnected: Code ${event.code}, Reason: ${event.reason}`);
        setIsConnected(false);
        setConnectionStatus('disconnected');

        // Only attempt reconnect if it wasn't a normal closure
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            console.log(`🔄 Reconnection attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}...`);
            connect();
          }, 3000);
        }
      };

      socket.onerror = handleConnectionError;

      socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage<unknown> = JSON.parse(event.data);

          if (!message || typeof message !== 'object' || !message.type) {
            console.warn("Received malformed WebSocket message:", event.data);
            return;
          }

          const { type, payload } = message;

          if (type === 'connected') {
            return;
          }

          if (type === 'error') {
            console.error('WebSocket error message:', payload);
            return;
          }

          const handlers = handlersRef.current.get(type as WebSocketMessageType);
          if (handlers && handlers.size > 0) {
            handlers.forEach((handler) => {
              try {
                handler(payload);
              } catch (error) {
                console.error(`Error in WebSocket handler for type ${type}:`, error);
              }
            });
          } else {
            console.warn(`No handlers registered for WebSocket message type: ${type}`);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setConnectionStatus('error');
    }
  };

  useEffect(() => {
    connect();

    return () => {
      resetConnection();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user?.id]);

  const subscribe = <T,>(
    type: WebSocketMessageType,
    handler: MessageHandler<T>
  ): (() => void) => {
    if (!handlersRef.current.has(type)) {
      handlersRef.current.set(type, new Set());
    }

    const handlerSet = handlersRef.current.get(type);
    if (handlerSet) {
      handlerSet.add(handler as MessageHandler);
    }

    return () => {
      const handlers = handlersRef.current.get(type);
      if (handlers) {
        handlers.delete(handler as MessageHandler);
        if (handlers.size === 0) {
          handlersRef.current.delete(type);
        }
      }
    };
  };

  const send = <T,>(type: WebSocketMessageType, data: T): void => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage<T> = {
        type,
        payload: data,
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`
      };

      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("Cannot send message, WebSocket is not open. Status:", connectionStatus);
      throw new Error(`WebSocket is not connected (current status: ${connectionStatus})`);
    }
  };

  return (
    <WebSocketContext.Provider value={{
      isConnected,
      subscribe,
      send,
      connectionStatus
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};