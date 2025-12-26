import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface WebSocketClient extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

interface BroadcastMessage {
  type: 'order_created' | 'order_updated' | 'product_updated' | 'notification';
  data: unknown;
  targetUserId?: string;
}

class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Map<WebSocketClient, string> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  initialize(server: Server): void {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocketClient, req) => {
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const userId = url.searchParams.get('userId');

      if (userId) {
        ws.userId = userId;
        this.clients.set(ws, userId);
        console.log(`✅ WebSocket client connected: ${userId}`);
      }

      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        if (ws.userId) {
          this.clients.delete(ws);
          console.log(`⚠️ WebSocket client disconnected: ${ws.userId}`);
        }
      });

      ws.send(JSON.stringify({
        type: 'connected',
        data: { message: 'WebSocket connection established' },
      }));
    });

    this.startHeartbeat();
    console.log('✅ WebSocket server initialized on /ws');
  }

  private handleMessage(ws: WebSocketClient, data: { type: string; data: unknown }): void {
    switch (data.type) {
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
      case 'subscribe':
        if (ws.userId) {
          console.log(`📡 Client ${ws.userId} subscribed to updates`);
        }
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  broadcast(message: BroadcastMessage): void {
    if (!this.wss) return;

    const payload = JSON.stringify(message);

    this.wss.clients.forEach((client) => {
      const wsClient = client as WebSocketClient;

      if (wsClient.readyState === WebSocket.OPEN) {
        if (message.targetUserId) {
          if (wsClient.userId === message.targetUserId) {
            wsClient.send(payload);
          }
        } else {
          wsClient.send(payload);
        }
      }
    });
  }

  sendToUser(userId: string, message: BroadcastMessage): void {
    this.broadcast({
      ...message,
      targetUserId: userId,
    });
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (!this.wss) return;

      this.wss.clients.forEach((client) => {
        const wsClient = client as WebSocketClient;

        if (wsClient.isAlive === false) {
          return wsClient.terminate();
        }

        wsClient.isAlive = false;
        wsClient.ping();
      });
    }, 30000);
  }

  getConnectedClients(): string[] {
    return Array.from(this.clients.values());
  }

  getClientCount(): number {
    return this.clients.size;
  }

  shutdown(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.wss) {
      this.wss.clients.forEach((client) => {
        client.close();
      });
      this.wss.close();
      this.wss = null;
    }

    this.clients.clear();
  }
}

export const wsService = new WebSocketService();
export default wsService;
