/**
 * Main application component that provides all context providers and routing
 * 
 * @component
 * @example
 * ```tsx
 * // App component is rendered at root
 * ReactDOM.createRoot(document.getElementById('root')).render(<App />);
 * ```
 */
import React from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CompareProvider } from './contexts/CompareContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProductProvider } from './contexts/ProductContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import ErrorBoundary from './components/ErrorBoundary';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Success } from './pages/Success';
import { TrackOrder } from './pages/TrackOrder';
import { Profile } from './pages/Profile';
import { Search } from './pages/Search';
import { Wishlist } from './pages/Wishlist';
import { Compare } from './pages/Compare';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/NotFound';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCurrencies } from './pages/admin/AdminCurrencies';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

const ProtectedAdminRoute = ({ children }: { children?: React.ReactNode }) => {
    const { user, isAdmin, isLoading } = useAuth();
    if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/" replace />; // Redirect non-admins
    return <>{children}</>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <CurrencyProvider>
          <AuthProvider>
            <WebSocketProvider>
              <ProductProvider>
                <CartProvider>
                    <OrderProvider>
                    <WishlistProvider>
                        <CompareProvider>
                        <ToastProvider>
                            <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                            <ScrollToTop />
                            <Routes>
                              {/* Public Routes */}
                              <Route path="/" element={<Home />} />
                              <Route path="/product/:id" element={<ProductDetails />} />
                              <Route path="/cart" element={<Cart />} />
                              <Route path="/checkout" element={<Checkout />} />
                              <Route path="/success" element={<Success />} />
                              <Route path="/track-order" element={<TrackOrder />} />
                              <Route path="/profile" element={<Profile />} />
                              <Route path="/search" element={<Search />} />
                              <Route path="/categories" element={<Search />} />
                              <Route path="/wishlist" element={<Wishlist />} />
                              <Route path="/compare" element={<Compare />} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<Register />} />

                              {/* Admin Routes */}
                              <Route path="/admin" element={
                                  <ProtectedAdminRoute>
                                      <AdminLayout />
                                  </ProtectedAdminRoute>
                              }>
                                  <Route index element={<AdminDashboard />} />
                                  <Route path="dashboard" element={<AdminDashboard />} />
                                  <Route path="products" element={<AdminProducts />} />
                                  <Route path="orders" element={<AdminOrders />} />
                                  <Route path="currencies" element={<AdminCurrencies />} />
                              </Route>
                              
                              {/* Error Route */}
                              <Route path="*" element={<NotFound />} />
                          </Routes>
                          </HashRouter>
                        </ToastProvider>
                        </CompareProvider>
                    </WishlistProvider>
                    </OrderProvider>
                </CartProvider>
              </ProductProvider>
            </WebSocketProvider>
          </AuthProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;