# Project Structure & Organization

## Root Level Structure

```
yapee-ecommerce/
├── components/          # Shared React components
├── contexts/           # React Context providers
├── pages/             # Route-level components
├── server/            # Backend API server
├── types/             # Shared TypeScript types
├── utils/             # Utility functions
├── tests/             # Test files
├── docs/              # Documentation
└── prisma/            # Database schema & migrations
```

## Frontend Architecture

### Components (`/components/`)
- **Shared components** được sử dụng across multiple pages
- Mỗi component nên có single responsibility
- Props interface phải được define rõ ràng
- Sử dụng Tailwind classes cho styling

### Pages (`/pages/`)
- **Route-level components** tương ứng với URL paths
- Chứa page-specific logic và layout
- Admin pages được tách riêng trong `/pages/admin/`

### Contexts (`/contexts/`)
- **Global state management** sử dụng React Context API
- Mỗi context có responsibility riêng biệt:
  - `AuthContext` - User authentication & authorization
  - `CartContext` - Shopping cart state
  - `ProductContext` - Product data management
  - `OrderContext` - Order processing
  - `ToastContext` - Notification system

## Backend Architecture

### Server Structure (`/server/`)
```
server/
├── controllers/        # HTTP request handlers
├── services/          # Business logic layer
├── middleware/        # Express middlewares
├── routes/           # API route definitions
├── validations/      # Zod validation schemas
├── config/           # Configuration files
└── graphql/          # GraphQL schema & resolvers
```

### Layer Responsibilities

#### Controllers
- **Chỉ** handle HTTP requests/responses
- **Không** chứa business logic
- Delegate tất cả logic cho Services
- Validate input với Zod schemas

#### Services
- **Core business logic** container
- Handle database transactions
- Integrate với external APIs
- Throw specific business errors

#### Middleware
- Authentication (JWT verification)
- Input validation (Zod)
- Error handling
- Rate limiting
- CORS configuration

## Database Schema (`/prisma/`)

### Core Models
- **User** - Customer và Admin accounts
- **Product** - Product catalog với variants
- **Order** - Order processing với items
- **Cart** - Shopping cart persistence

### Relationships
- User → Cart (1:1)
- User → Orders (1:many)
- Product → ProductVariants (1:many)
- Order → OrderItems (1:many)

## File Naming Conventions

### Components
- PascalCase: `ProductCard.tsx`, `HeroSection.tsx`
- Co-locate styles nếu cần: `Button.tsx`, `Button.module.css`

### Pages
- PascalCase: `Home.tsx`, `ProductDetails.tsx`
- Admin pages: `AdminProducts.tsx`, `Dashboard.tsx`

### Contexts
- PascalCase với Context suffix: `AuthContext.tsx`

### Services & Controllers
- camelCase với suffix: `auth.service.ts`, `product.controller.ts`

### Types
- PascalCase interfaces: `User`, `Product`, `OrderItem`
- camelCase cho utility types

## Import Organization

### Import Order
1. React và external libraries
2. Internal components
3. Contexts và hooks
4. Types và interfaces
5. Utilities và constants

```typescript
// External
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Internal components
import Button from '@/components/Button';
import Layout from '@/components/Layout';

// Contexts
import { useAuth } from '@/contexts/AuthContext';

// Types
import type { User, Product } from '@/types';

// Utils
import { formatPrice } from '@/utils/format';
```

## Code Organization Principles

### Single Responsibility
- Mỗi file/function có một mục đích duy nhất
- Components không quá 200 lines
- Functions không quá 50 lines

### Separation of Concerns
- UI logic tách biệt khỏi business logic
- API calls được centralize trong services
- State management được isolate trong contexts

### DRY (Don't Repeat Yourself)
- Shared logic được extract thành utilities
- Common UI patterns thành reusable components
- API endpoints được define trong constants