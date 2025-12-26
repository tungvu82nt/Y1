import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useLanguage();

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const menuItems = [
      { icon: 'dashboard', label: t('admin.dashboard'), path: '/admin' },
      { icon: 'inventory_2', label: t('admin.products'), path: '/admin/products' },
      { icon: 'shopping_bag', label: t('admin.orders'), path: '/admin/orders' },
      { icon: 'currency_exchange', label: 'Currencies', path: '/admin/currencies' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#111] overflow-hidden">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
            <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
            ></div>
        )}

        {/* Admin Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 transform lg:translate-x-0 lg:static lg:shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-800">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">admin_panel_settings</span>
                </div>
                <h1 className="font-bold text-lg tracking-tight">Admin<span className="text-primary">Panel</span></h1>
                <button onClick={() => setIsSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <img src={user?.avatar} className="size-8 rounded-full bg-gray-700" />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold">{user?.name}</span>
                        <span className="text-xs text-gray-500">Administrator</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 text-sm font-bold w-full">
                    <span className="material-symbols-outlined text-[18px]">logout</span> {t('nav.logout')}
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header className="h-20 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {menuItems.find(i => i.path === location.pathname)?.label || t('admin.overview')}
                    </h2>
                </div>
                <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary">
                    <span className="hidden sm:inline">View Live Site</span> <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </Link>
            </header>
            <div className="flex-1 overflow-auto p-4 lg:p-8">
                <Outlet />
            </div>
        </main>
    </div>
  );
};