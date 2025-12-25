
# 🔌 API Specification

所有 API 均位于 `/api` 路径下。

## Authentication

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | 用户登录，返回 JWT | No |
| `POST` | `/api/auth/register` | 用户注册 (待实现) | No |
| `PUT` | `/api/auth/profile` | 更新用户信息 | **Yes** |

## Products

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | 获取所有产品 | No |
| `GET` | `/api/products/:id` | 获取产品详情 | No |
| `POST` | `/api/products` | 创建产品 (Admin) | **Yes (Admin)** |
| `PUT` | `/api/products/:id` | 更新产品 (Admin) | **Yes (Admin)** |
| `DELETE` | `/api/products/:id` | 删除产品 (Admin) | **Yes (Admin)** |

## Orders

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/orders` | 获取当前用户的所有订单 | **Yes** |
| `GET` | `/api/orders/:id` | 获取订单详情 | **Yes** |
| `POST` | `/api/orders` | 创建新订单 | **Yes** |
