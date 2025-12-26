
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { errorHandler } from './middleware/error.middleware.ts';
import { rateLimitMiddleware, authRateLimitMiddleware } from './middleware/rateLimit.middleware.ts';
import { wsService } from './config/websocket.ts';
import { typeDefs } from './graphql/schema.ts';
import { resolvers } from './graphql/resolvers.ts';
import { context } from './graphql/context.ts';

// Import Routes
import productRoutes from './routes/product.routes.ts';
import authRoutes from './routes/auth.routes.ts';
import orderRoutes from './routes/order.routes.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const httpServer = createServer(app);

// Initialize Apollo Server with drain plugin
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

(async () => {
  await apolloServer.start();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Global Rate Limiting
  app.use(rateLimitMiddleware);

  // GraphQL Endpoint - Manual Express integration for Apollo Server v5
  app.use('/graphql', cors<cors.CorsRequest>(), express.json(), (req, res) => {
    const headerMap = new Map<string, string>();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') {
        headerMap.set(key, value);
      }
    }

    const httpGraphQLRequest = {
      method: req.method,
      headers: headerMap,
      body: req.body,
      path: req.path,
      search: req.url.split('?')[1] || '',
    };

    apolloServer.executeHTTPGraphQLRequest({
      httpGraphQLRequest,
      context: () => context({ req }),
    }).then((httpGraphQLResponse) => {
      Reflect.ownKeys(httpGraphQLResponse.headers).forEach((key) => {
        try {
          if (typeof key === 'string') {
            const value = (httpGraphQLResponse.headers as Record<string, unknown>)[key];
            res.setHeader(key, value);
          }
        } catch (error) {
          console.warn(`Failed to set header ${String(key)}:`, error);
        }
      });
      res.statusCode = httpGraphQLResponse.status || 200;
      
      if (httpGraphQLResponse.body.kind === 'chunked') {
        const chunks: string[] = [];
        const reader = httpGraphQLResponse.body.asyncIterator[Symbol.asyncIterator]();
        
        const readChunk = async (): Promise<void> => {
          const { done, value } = await reader.next();
          if (done) {
            res.end(chunks.join(''));
            return;
          }
          chunks.push(value);
          return readChunk();
        };
        
        return readChunk();
      }
      
      res.end();
    }).catch((error) => {
      console.error('GraphQL execution error:', error);
      res.status(500).json({ errors: [{ message: 'Internal server error' }] });
    });
  });

  // Logging Middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Routes
  // Note: We mount them at /api/... to match the frontend proxy configuration
  app.use('/api/products', productRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/orders', orderRoutes);

  // Health Check
  app.get('/api/health', (req, res) => {
      res.status(200).json({ status: 'OK' });
  });

  // Error Handling (Must be last)
  app.use(errorHandler);

  // Initialize WebSocket Server
  wsService.initialize(httpServer);

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Yapee Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`👉 REST API available at http://localhost:${PORT}/api`);
    console.log(`🔌 WebSocket available at ws://localhost:${PORT}/ws`);
    console.log(`📊 GraphQL API available at http://localhost:${PORT}/graphql`);
  });
})();
