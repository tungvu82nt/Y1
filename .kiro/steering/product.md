# Yapee E-commerce Platform

Yapee là một nền tảng thương mại điện tử full-stack được xây dựng với React và Node.js, tập trung vào trải nghiệm người dùng mượt mà và hiệu suất cao.

## Tính năng chính

- **Frontend**: React 18 + TypeScript + Vite với Tailwind CSS
- **Backend**: Node.js + Express + GraphQL API
- **Database**: PostgreSQL với Prisma ORM
- **Authentication**: JWT-based với role-based access control (CUSTOMER/ADMIN)
- **Real-time**: WebSocket integration cho order tracking và notifications
- **Caching**: Redis cho session management và performance optimization
- **Testing**: Comprehensive test suite với Vitest và Testing Library

## Kiến trúc

Dự án tuân theo kiến trúc 3-layer (Three-Tier Architecture):
- **Presentation Layer**: React components với Context-based state management
- **Business Logic Layer**: Express controllers và services
- **Data Access Layer**: Prisma ORM với PostgreSQL

## Mục tiêu chất lượng

Dự án hướng tới tiêu chuẩn code quality 10/10 với:
- Type safety nghiêm ngặt (TypeScript)
- Comprehensive testing coverage
- Modular và maintainable code structure
- Performance optimization với caching strategies