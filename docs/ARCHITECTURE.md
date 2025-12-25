
# 🏗️ System Architecture

## 1. High-Level Architecture Diagram

这是一个典型的三层架构 (Three-Tier Architecture)，结合了缓存策略和外部服务集成。

```mermaid
graph TD
    Client[Client (React/Vite)] -->|HTTPS/JSON| Nginx[Load Balancer / Nginx]
    
    subgraph "Application Server (Node.js/Express Cluster)"
        Nginx --> API_Gateway[API Routes / Middleware]
        API_Gateway --> Auth_Guard[Auth Guard (JWT)]
        API_Gateway --> Validation[Input Validation (Zod)]
        
        Auth_Guard --> Controllers[Controllers Layer]
        Validation --> Controllers
        
        Controllers --> Services[Service Layer (Business Logic)]
    end
    
    subgraph "Data & Infrastructure"
        Services -->|Read/Write| Cache[(Redis Cache)]
        Services -->|ORM| Prisma[Prisma Client]
        Prisma -->|SQL| DB[(PostgreSQL Primary)]
        Prisma -->|SQL Read| DB_Replica[(PostgreSQL Replica)]
    end
    
    subgraph "External Services"
        Services -->|Payment| Stripe[Stripe API]
        Services -->|Email| SendGrid[Email Service]
        Services -->|Storage| S3[AWS S3 (Images)]
    end
```

## 2. 请求处理流程 (Request Lifecycle)

为了达到 10/10 的代码质量，每个请求必须经过以下严格流程：

1.  **Entry (app.ts)**: 请求进入，经过全局中间件 (Helmet, CORS, Rate Limit, Logger)。
2.  **Router**: 路由分发到对应的 Controller。
3.  **Validation Middleware**: 使用 `Zod` 验证 `req.body` 和 `req.query`，格式错误直接返回 400，不进入 Controller。
4.  **Auth Middleware**: 验证 JWT Token，解析用户信息并挂载到 `req.user`。
5.  **Controller**: 
    - 解析 HTTP 请求参数。
    - 调用 Service 层方法。
    - **不包含任何业务逻辑**。
    - 发送 HTTP 响应 (200/201)。
6.  **Service**:
    - **核心业务逻辑** (例如：计算总价、库存检查、优惠券逻辑)。
    - 处理事务 (Prisma Transaction)。
    - 调用第三方 API (支付)。
    - 读写缓存 (Redis)。
7.  **Repository / DAL (Data Access Layer)**:
    - 纯粹的数据库操作 (Prisma calls)。
    - 封装复杂的查询逻辑。
8.  **Error Handling**: 全局异常捕获，统一格式返回。

## 3. 关键技术决策

*   **Runtime**: Node.js (利用事件循环处理高并发 I/O)。
*   **Language**: TypeScript (严格类型安全，与前端共享类型定义)。
*   **Framework**: Express (生态成熟) 或 Fastify (追求极致性能)。
*   **ORM**: Prisma (类型安全的数据库访问，优秀的 DX)。
*   **Validation**: Zod (运行时验证，自动生成 TS 类型)。
*   **Cache**: Redis (用于 Session, Product Caching, Rate Limiting)。
*   **Documentation**: Swagger / OpenAPI (自动生成 API 文档)。
