
# 🖥️ Frontend Architecture

Yapee 前端基于 **React 18 + Vite** 构建，采用 **组件化** 和 **Context 状态管理** 模式。

## 1. 技术栈 (Tech Stack)
- **Core**: React 18, TypeScript
- **Build Tool**: Vite (极速 HMR)
- **Routing**: React Router v6 (声明式路由)
- **Styling**: Tailwind CSS (Utility-first CSS)
- **State Management**: React Context API (适用于中型应用)
- **Icons**: Google Material Symbols

## 2. 架构模式 (Architectural Pattern)

```mermaid
graph TD
    App[App Root] --> Providers[Global Providers]
    
    subgraph "Providers Layer"
        Providers --> AuthCtx[AuthContext]
        Providers --> CartCtx[CartContext]
        Providers --> ProductCtx[ProductContext]
        Providers --> ToastCtx[ToastContext]
        Providers --> LangCtx[LanguageContext]
    end
    
    subgraph "Routing Layer"
        AuthCtx --> Router[React Router]
        Router --> PublicRoutes[Public Routes]
        Router --> ProtectedRoutes[Protected Routes (Admin/Profile)]
    end
    
    subgraph "UI Layer"
        PublicRoutes --> Pages[Pages (Home, Product, etc)]
        Pages --> Layout[Layout Component]
        Layout --> Components[Shared Components]
    end
```

## 3. 关键设计决策

### A. Context-Based State Management
考虑到应用规模，我们选择使用 React Context 而非 Redux。
- **AuthContext**: 管理用户 Session、登录/登出逻辑。
- **CartContext**: 管理购物车商品、数量更新、持久化到 LocalStorage。
- **ProductContext**: 管理产品列表获取、Admin CRUD 操作。

### B. Tailwind Design System
在 `index.html` 中配置了扩展主题：
- **Colors**: 定义了 `primary` (#ed1d23), `background-dark`, `surface-light` 等语义化颜色。
- **Dark Mode**: 使用 `class` 策略，支持手动切换日间/夜间模式。

### C. Optimistic UI (乐观更新)
在用户执行操作（如添加到购物车、修改个人资料）时，立即更新 UI，随后再与服务器同步。这提供了极致流畅的用户体验。
