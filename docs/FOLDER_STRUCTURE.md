
# 📂 Backend Folder Structure (10/10 Standard)

为了保证可维护性和可扩展性，建议采用以下目录结构。这比目前的扁平结构更适合企业级应用。

```text
server/
├── src/
│   ├── config/                 # 环境变量配置，常量定义
│   │   ├── env.config.ts       # process.env 类型安全封装
│   │   ├── constants.ts
│   │   └── logger.ts           # Winston/Pino 配置
│   │
│   ├── controllers/            # 处理 HTTP 请求/响应
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── order.controller.ts
│   │   └── admin.controller.ts
│   │
│   ├── middlewares/            # Express 中间件
│   │   ├── auth.middleware.ts  # JWT 校验
│   │   ├── validate.ts         # Zod Schema 校验器
│   │   ├── error.ts            # 全局错误处理
│   │   ├── rateLimit.ts        # 速率限制
│   │   └── adminOnly.ts        # RBAC 权限控制
│   │
│   ├── routes/                 # 路由定义
│   │   ├── v1/
│   │   │   ├── auth.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── services/               # 核心业务逻辑 (The "Brain")
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts    # 包含库存检查、价格计算
│   │   └── payment.service.ts  # 支付网关集成
│   │
│   ├── repositories/           # (可选) 数据访问层，封装 Prisma
│   │   ├── product.repo.ts
│   │   └── user.repo.ts
│   │
│   ├── utils/                  # 工具函数
│   │   ├── jwt.ts              # Token 生成/解析
│   │   ├── password.ts         # Bcrypt 哈希
│   │   ├── apiResponse.ts      # 统一响应格式类
│   │   └── catchAsync.ts       # 异步错误捕获 Wrapper
│   │
│   ├── validations/            # Zod Schemas
│   │   ├── auth.schema.ts
│   │   └── product.schema.ts
│   │
│   ├── types/                  # 后端特有的类型定义 (Express Request 扩展等)
│   │   └── express.d.ts
│   │
│   ├── app.ts                  # Express App 配置
│   └── server.ts               # 服务器入口
│
├── prisma/
│   ├── schema.prisma           # 数据库模型
│   └── seed.ts                 # 种子数据
│
├── tests/                      # 单元测试和集成测试
│   ├── unit/
│   └── integration/
│
├── .env                        # 环境变量
├── .eslintrc.json
├── nodemon.json
├── package.json
└── tsconfig.json
```

## 核心层级说明

### 1. Controllers (控制器)
**职责**: 接收请求，解析参数，发送响应。
**规则**: 
- **不要**在 Controller 中写 `prisma.find...`。
- **不要**在 Controller 中写复杂的 if/else 业务逻辑。
- 所有的业务逻辑委托给 `Service`。

```typescript
// 示例
export const createOrder = catchAsync(async (req, res) => {
  // 1. 获取数据
  const { items, address } = req.body;
  const userId = req.user.id;

  // 2. 调用 Service (业务逻辑)
  const order = await orderService.placeOrder(userId, items, address);

  // 3. 发送响应
  res.status(201).json(ApiResponse.success(order, 'Order placed successfully'));
});
```

### 2. Services (服务层)
**职责**: 业务逻辑的容器。
**规则**: 
- 处理事务。
- 抛出具体的业务错误 (如 `StockInsufficientError`)。
- 可以被多个 Controller 复用。

```typescript
// 示例
export const placeOrder = async (userId, items, address) => {
  return await prisma.$transaction(async (tx) => {
    // 1. 检查库存
    for(const item of items) {
       const product = await tx.product.findUnique(...)
       if(product.stock < item.quantity) throw new AppError('Out of stock', 400);
    }
    // 2. 扣减库存
    // 3. 创建订单
    // 4. 清空购物车 (如果是在 DB 里的)
    return newOrder;
  });
}
```

### 3. Validations (验证层)
使用 `zod` 定义 Schema，确保脏数据永远不会进入 Controller。

```typescript
// validations/order.schema.ts
export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      productId: z.string().uuid(),
      quantity: z.number().min(1),
      color: z.string(),
      size: z.string()
    })).nonempty(),
    shippingAddress: z.string().min(10)
  })
});
```
