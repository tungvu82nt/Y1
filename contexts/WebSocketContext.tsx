import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

type MessageHandler = (data: any) => void;

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (type: string, handler: MessageHandler) => () => void;
  send: (type: string, data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Map<string, Set<MessageHandler>>>(new Map());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const connect = () => {
    // Determine WebSocket URL based on current environment
    // Assume backend is on same host if relative, or hardcoded port 3001 if dev
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.hostname;
    const port = "5000"; // Match server PORT from .env

    const wsUrl = `${protocol}//${host}:${port}/ws${
      user ? `?userId=${(user as any).id}` : ""
    }`;

    console.log("Connecting to WebSocket:", wsUrl);

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket Connected");
      setIsConnected(true);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = undefined;
      }
    };

    socket.onclose = () => {
      console.log("⚠️ WebSocket Disconnected");
      setIsConnected(false);
      // Attempt reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("🔄 Attempting to reconnect...");
        connect();
      }, 3000);
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
      socket.close();
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type, data } = message;

        // Dispatch to handlers
        const handlers = handlersRef.current.get(type);
        if (handlers) {
          handlers.forEach((handler) => handler(data));
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message", e);
      }
    };
  };

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user]); // Reconnect when user changes (login/logout)

  const subscribe = (type: string, handler: MessageHandler) => {
    if (!handlersRef.current.has(type)) {
      handlersRef.current.set(type, new Set());
    }
    handlersRef.current.get(type)?.add(handler);

    // Return unsubscribe function
    return () => {
      handlersRef.current.get(type)?.delete(handler);
    };
  };

  const send = (type: string, data: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type, data }));
    } else {
      console.warn("Cannot send message, WebSocket is not open");
    }
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, send }}>
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
