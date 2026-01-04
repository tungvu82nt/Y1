# Tech Stack & Build System

## Core Technologies

### Frontend
- **React 18** với TypeScript
- **Vite** - Build tool với HMR cực nhanh
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **React Context API** - State management cho medium-scale app

### Backend
- **Node.js** với **Express.js**
- **GraphQL** với Apollo Server
- **TypeScript** - Type safety toàn bộ codebase
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Primary database
- **Redis** - Caching và session storage
- **WebSocket (ws)** - Real-time communication

### Testing & Quality
- **Vitest** - Unit và integration testing
- **Testing Library** - React component testing
- **ESLint** - Code linting
- **Zod** - Runtime validation

## Common Commands

### Development
```bash
# Start frontend dev server
npm run dev

# Start backend server
npm run server

# Run both concurrently (if configured)
npm run dev:full
```

### Database
```bash
# Push schema changes to database
npm run db:push

# Seed database với sample data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Testing
```bash
# Run all tests
npm test

# Run tests với UI
npm run test:ui

# Run tests với coverage report
npm run test:coverage
```

### Build & Deploy
```bash
# Build frontend for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Development Guidelines

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to project root
- ES2022 target với DOM libraries
- JSX: react-jsx transform

### Code Quality Standards
- Tất cả functions phải có type annotations
- Sử dụng Zod schemas cho API validation
- Error handling với try-catch và proper error types
- Async/await thay vì Promises chains