// WebSocket Message Types
export interface WebSocketMessage<T> {
  type: string;
  payload: T;
  timestamp: string;
  id?: string;
}

export interface WebSocketResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface WebSocketError {
  type: 'error';
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}
