# Yapee E-commerce Platform

A modern, full-stack e-commerce application built with React, Node.js, and GraphQL, featuring real-time updates and a comprehensive admin dashboard.

## 🚀 Features

### Storefront
- **Product Discovery**: Advanced usage of browsing, searching, and filtering products.
- **Product Details**: Rich product views with variants (sizes, colors), reviews, and ratings.
- **Shopping Experience**: Seamless Cart management and Checkout process.
- **User Tools**: 
  - User Authentication (Login/Register)
  - Profile Management & Order History
  - Real-time Order Tracking
  - Wishlist & Product Comparison

### Admin Dashboard
- **Product Management**: Full CRUD operations for products and inventory.
- **Order Management**: Real-time order monitoring and status updates.
- **Analytics**: Visualization of sales and system status.

### Technical Highlights
- **Real-time Engine**: WebSocket integration for instant order updates and notifications.
- **Hybrid API**: Utilizes both RESTful for standard operations and GraphQL for flexible data fetching.
- **Type Safety**: Comprehensive TypeScript implementation across the full stack.

## 🛠 Tech Stack

### Frontend
- **Core**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (HashRouter)
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **GraphQL**: Apollo Server
- **Database**: PostgreSQL (via Prisma ORM)
- **Real-time**: `ws` (Native WebSocket)
- **Caching**: Redis (Optional)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/tungvu82nt/Y1.git
cd Y1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
The project is pre-configured with a `.env` file. 
- **Database**: Defaults to a cloud NeonDB PostgreSQL instance (configured in `.env`).
- **Local Dev**: To use local SQLite or PostgreSQL, update the `DATABASE_URL` in `.env`.

### 4. Database Initialization
Set up the database schema and load sample data:

```bash
# Push Prisma schema to the connected database
npm run db:push

# Seed the database with initial products and users
npm run db:seed
```

## 🚀 Running the Application

To run the full application, you need to verify both the backend and frontend are running.

**1. Start the Backend Server**
Runs on port **5000** by default.
```bash
npm run server
```

**2. Start the Frontend Application**
Runs on port **5173** by default.
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to view the application.

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `vite` | Starts the frontend development server |
| `server` | `tsx server/index.ts` | Starts the backend API & WebSocket server |
| `build` | `tsc && vite build` | Builds the frontend for production |
| `db:push` | `prisma db push` | Updates the database schema |
| `db:seed` | `tsx server/seed.ts` | Seeds the database with sample data |
| `db:studio` | `prisma studio` | Opens a GUI to inspect database records |
| `test` | `vitest` | Runs the test suite |

## 🤝 Project Status & Roadmap

This project is currently under active development with a focus on **Code Quality & Reliability**.
Current roadmap items:
1.  **Type Safety**: Achieving 100% strict TypeScript types.
2.  **Testing**: Increasing coverage with Unit and Integration tests.
3.  **Documentation**: Standardizing all documentation to English.

See `project_state.json` and `QUICK_START.md` for detailed progress tracking.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
