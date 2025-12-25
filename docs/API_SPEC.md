
# 🔌 API Specification

## 1. Standard Response Format

所有 API 响应 (成功或失败) 必须遵循统一的 JSON 结构，方便前端拦截器统一处理。

### 成功响应 (200/201)
```json
{
  "success": true,
  "data": { ... }, 
  "message": "Operation successful",
  "meta": { // 可选，用于分页
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### 失败响应 (400/401/403/404/500)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [ // 可选，Zod 验证详情
      { "field": "email", "issue": "Invalid email" }
    ]
  }
}
```

## 2. Key Endpoints Overview

### Authentication
- `POST /api/v1/auth/register` - 注册
- `POST /api/v1/auth/login` - 登录 (返回 Access Token + Refresh Token)
- `POST /api/v1/auth/refresh-token` - 刷新 Token
- `GET /api/v1/auth/me` - 获取当前用户信息

### Products
- `GET /api/v1/products` - 获取产品列表 (支持 ?page=1&category=Running&sort=price_asc)
- `GET /api/v1/products/:id` - 获取详情
- `POST /api/v1/products` - [Admin] 创建产品 (需 multipart/form-data 处理图片上传)
- `PUT /api/v1/products/:id` - [Admin] 更新
- `DELETE /api/v1/products/:id` - [Admin] 删除

### Orders
- `POST /api/v1/orders` - 创建订单 (包含库存扣减逻辑)
- `GET /api/v1/orders` - 获取当前用户订单
- `GET /api/v1/orders/:id` - 订单详情
- `PUT /api/v1/orders/:id/cancel` - 取消订单

### Admin Dashboard
- `GET /api/v1/admin/stats` - 获取 KPI (收入, 订单数)
- `GET /api/v1/admin/orders` - 获取所有用户订单
- `PATCH /api/v1/admin/orders/:id/status` - 更新订单状态 (Processing -> Shipped)
