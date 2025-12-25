
# 📂 Backend Folder Structure

遵循 **功能模块化** 与 **职责分离** 的原则。

```text
server/
├── src/
│   ├── config/                 # 环境配置与常量
│   │   └── env.config.ts
│   │
│   ├── controllers/            # 控制器 (HTTP 交互)
│   │   ├── auth.controller.ts
│   │   ├── order.controller.ts
│   │   └── product.controller.ts
│   │
│   ├── middlewares/            # 中间件
│   │   ├── auth.middleware.ts  # JWT 验证
│   │   ├── error.middleware.ts # 全局错误处理
│   │   └── validate.ts         # Zod 验证器
│   │
│   ├── routes/                 # 路由定义
│   │   ├── auth.routes.ts
│   │   ├── order.routes.ts
│   │   └── product.routes.ts
│   │
│   ├── services/               # (推荐扩展) 业务逻辑层
│   │   └── order.service.ts    # 复杂订单逻辑
│   │
│   ├── utils/                  # 工具函数
│   │   ├── apiResponse.ts
│   │   └── jwt.ts
│   │
│   ├── app.ts                  # Express App 设置
│   └── index.ts                # 入口文件
│
├── prisma/
│   ├── schema.prisma           # 数据库模型
│   └── seed.ts                 # 种子数据脚本
│
└── package.json
```
