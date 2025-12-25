
# 🚀 Getting Started Guide

Tài liệu này hướng dẫn thiết lập môi trường phát triển cục bộ (Local Development Environment) cho dự án Yapee.

## 1. Prerequisites (Yêu cầu tiên quyết)

Đảm bảo máy của bạn đã cài đặt:

- **Node.js**: v18.0.0 trở lên (`node -v`)
- **npm** hoặc **pnpm**: Trình quản lý gói.
- **PostgreSQL**: Database server đang chạy (local hoặc qua Docker).
- **Git**: Quản lý mã nguồn.

## 2. Installation (Cài đặt)

```bash
# 1. Clone repository
git clone https://github.com/your-org/yapee.git
cd yapee

# 2. Cài đặt dependencies (bao gồm cả frontend và backend)
npm install
```

## 3. Environment Setup (Cấu hình môi trường)

Tạo file `.env` tại thư mục gốc và điền các thông tin sau:

```ini
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Connection (Prisma)
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:password@localhost:5432/yapee_db?schema=public"

# JWT Secrets (Thay đổi bằng chuỗi ngẫu nhiên mạnh)
JWT_SECRET="dev_secret_key_change_me"
JWT_REFRESH_SECRET="dev_refresh_secret_key_change_me"

# Client URL (cho CORS)
CLIENT_URL="http://localhost:5173"
```

## 4. Database Setup (Thiết lập cơ sở dữ liệu)

Chúng ta sử dụng Prisma để quản lý Schema và Seed data.

```bash
# 1. Đồng bộ Schema lên Database (Tạo bảng)
npm run db:push

# 2. Chạy Seed Data (Tạo Admin, User mẫu, Sản phẩm mẫu)
npm run db:seed
```

> **Lưu ý**: Lệnh `db:seed` sẽ xóa sạch dữ liệu cũ và tạo lại dữ liệu mẫu từ `server/constants.ts`.

## 5. Running the App (Chạy ứng dụng)

```bash
# Chạy cả Frontend (Vite) và Backend (Express) trong chế độ Development
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Database Studio**: `npx prisma studio` (Giao diện GUI quản lý DB)

## 6. Login Credentials (Tài khoản mẫu)

Sau khi chạy seed, bạn có thể đăng nhập bằng:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@yapee.com` | `hashed_secret` (Logic đăng nhập demo) |
| **Customer** | `alex@example.com` | `password123` |
