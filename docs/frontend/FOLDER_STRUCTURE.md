
# 📂 Frontend Folder Structure

前端目录结构旨在实现**高内聚**。

```text
src/
├── components/         # 可复用的 UI 组件
│   ├── Layout.tsx      # 全局布局 (Header, Footer)
│   └── ...
│
├── contexts/           # 全局状态管理 (Context API)
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── OrderContext.tsx
│   ├── ProductContext.tsx
│   └── ...
│
├── pages/              # 路由页面组件
│   ├── admin/          # 管理员专用页面
│   ├── Home.tsx
│   ├── ProductDetails.tsx
│   ├── Checkout.tsx
│   └── ...
│
├── types/              # TypeScript 类型定义 (共享)
│   └── index.ts        # User, Product, Order 接口
│
├── utils/              # 工具函数
│   ├── api.ts          # Axios/Fetch 封装 (拦截器)
│   └── translations.ts # i18n 翻译字典
│
├── App.tsx             # 应用入口与路由配置
└── main.tsx            # React 挂载点
```

## 目录规范

1.  **Components vs Pages**: 
    - `Pages` 连接路由，负责获取数据并传递给组件。
    - `Components` 应该是纯展示性的 (Presentational)，尽量减少对 Context 的直接依赖，通过 Props 传参以提高复用性。

2.  **Types**:
    - 所有的接口定义（如 `Product`, `User`）应放在 `types.ts` 中，确保前后端数据结构的一致性。
