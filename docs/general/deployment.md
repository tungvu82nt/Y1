
# ☁️ Deployment & DevOps Strategy

Tài liệu này mô tả chiến lược triển khai ứng dụng Yapee lên môi trường Production (AWS/Vercel/Railway).

## 1. Containerization (Docker)

Chúng ta sử dụng Docker để đóng gói ứng dụng, đảm bảo tính nhất quán giữa các môi trường.

### Dockerfile (Multi-stage Build)

```dockerfile
# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run build # Build React Frontend & Compile TS Backend

# Stage 2: Runner
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Generate Prisma Client in Prod
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## 2. CI/CD Pipeline (GitHub Actions)

Quy trình tự động hóa (Automated Pipeline) đề xuất:

1.  **CI (Continuous Integration)**:
    - Kích hoạt khi có Push vào nhánh `main` hoặc Pull Request.
    - Chạy `npm install`.
    - Chạy `npm run lint` (Kiểm tra code style).
    - Chạy `npm run test` (Unit tests).
    - Chạy `npm run build` (Đảm bảo build thành công).

2.  **CD (Continuous Deployment)**:
    - Kích hoạt khi Merge vào nhánh `main`.
    - Build Docker Image: `yapee-app:latest`.
    - Push lên Docker Registry (Docker Hub / AWS ECR).
    - Trigger Webhook để deploy lại server.

## 3. Production Checklist

Trước khi Go Live, hãy kiểm tra:

- [ ] **Database**: Sử dụng PostgreSQL instance được quản lý (AWS RDS, Supabase) thay vì container local.
- [ ] **Environment Variables**:
    - `NODE_ENV=production`
    - `JWT_SECRET`: Chuỗi ngẫu nhiên dài (64 chars).
    - `CORS_ORIGIN`: Chỉ cho phép domain chính thức truy cập API.
- [ ] **Performance**:
    - Bật Redis cho Backend Caching.
    - Cấu hình CDN (Cloudflare/Cloudfront) cho các file tĩnh (Frontend assets).
- [ ] **Security**:
    - Bật Rate Limiting (đã có trong code).
    - Cấu hình HTTPS (SSL/TLS).

## 4. Scaling Strategy

- **Horizontal Scaling**: Backend là Stateless, có thể chạy nhiều instance đằng sau Load Balancer (Nginx).
- **Vertical Scaling**: Tăng RAM/CPU cho Database server khi lượng dữ liệu lớn.
