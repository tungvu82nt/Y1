import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Layout: React.FC<{ children: React.ReactNode, noHeader?: boolean, noFooter?: boolean }> = ({ children, noHeader, noFooter }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { toasts, removeToast } = useToast();
  const { t, language, setLanguage } = useLanguage();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getFlag = (lang: string) => {
      if (lang === 'vi') return '🇻🇳';
      if (lang === 'zh') return '🇨🇳';
      return '🇺🇸';
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white relative">
      
      {/* Toast Container */}
      <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`pointer-events-auto flex items-center gap-3 min-w-[300px] p-4 rounded-xl shadow-lg border animate-pulse-fast ${
              toast.type === 'success' ? 'bg-white dark:bg-[#1a1a1a] border-green-500 text-slate-900 dark:text-white' : 
              toast.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-200' :
              'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-200'
            }`}
          >
            <div className={`flex items-center justify-center size-8 rounded-full ${
               toast.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-white/10'
            }`}>
              <span className="material-symbols-outlined text-xl">
                {toast.type === 'success' ? 'check' : toast.type === 'error' ? 'error' : 'info'}
              </span>
            </div>
            <p className="flex-1 font-bold text-sm">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-slate-900 dark:hover:text-white">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        ))}
      </div>

      {!noHeader && (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md dark:bg-[#1a1a1a]/95 dark:border-gray-800">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white">
                <span className="material-symbols-outlined text-2xl">sprint</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ShoeSwift</span>
            </Link>

            <div className="hidden max-w-md flex-1 px-8 md:flex">
              <div className="group flex h-12 w-full items-center overflow-hidden rounded-full bg-background-subtle px-4 transition-all focus-within:ring-2 focus-within:ring-primary/20 dark:bg-surface-dark">
                <span className="material-symbols-outlined text-gray-400">search</span>
                <input 
                  className="h-full w-full border-none bg-transparent px-3 text-sm font-medium text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-0 dark:text-white" 
                  placeholder={t('common.searchPlaceholder')} 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative group mr-2">
                  <button className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-xl cursor-pointer">
                      {getFlag(language)}
                  </button>
                  {/* Dropdown with invisible padding bridge to prevent closing on hover gap */}
                  <div className="absolute right-0 top-full pt-2 w-32 hidden group-hover:block animate-in fade-in slide-in-from-top-2 z-[60]">
                      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-1">
                        <button onClick={() => setLanguage('en')} className="flex items-center gap-3 w-full px-4 py-2 text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg text-left text-slate-900 dark:text-white">
                            <span>🇺🇸</span> English
                        </button>
                        <button onClick={() => setLanguage('vi')} className="flex items-center gap-3 w-full px-4 py-2 text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg text-left text-slate-900 dark:text-white">
                            <span>🇻🇳</span> Tiếng Việt
                        </button>
                        <button onClick={() => setLanguage('zh')} className="flex items-center gap-3 w-full px-4 py-2 text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg text-left text-slate-900 dark:text-white">
                            <span>🇨🇳</span> 中文
                        </button>
                      </div>
                  </div>
              </div>

              <Link to="/search" className="flex size-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-surface-light dark:text-slate-200 dark:hover:bg-surface-dark md:hidden">
                <span className="material-symbols-outlined">search</span>
              </Link>
              
              {isAuthenticated ? (
                  <>
                    <Link to="/wishlist" className="hidden size-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-surface-light dark:text-slate-200 dark:hover:bg-surface-dark sm:flex">
                        <span className="material-symbols-outlined">favorite</span>
                    </Link>
                    <Link to="/profile" className="hidden size-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-surface-light dark:text-slate-200 dark:hover:bg-surface-dark sm:flex">
                        <img src={user?.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                    </Link>
                  </>
              ) : (
                  <Link to="/login" className="hidden px-4 py-2 text-sm font-bold text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors sm:flex">
                      {t('nav.login')}
                  </Link>
              )}
              
              <Link to="/cart" className="relative flex size-10 items-center justify-center rounded-full bg-surface-light text-slate-900 transition-colors hover:bg-gray-200 dark:bg-surface-dark dark:text-white dark:hover:bg-gray-700">
                <span className="material-symbols-outlined">shopping_cart</span>
                {totalItems > 0 && (
                    <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-background-dark">{totalItems}</span>
                )}
              </Link>
            </div>
          </div>
          {/* Subnav for categories */}
          <div className="no-scrollbar flex w-full gap-6 overflow-x-auto border-t border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-background-dark md:justify-center">
             {['New Drops', 'Running', 'Basketball', 'Lifestyle', 'Training', 'Sale'].map((item) => (
               <Link 
                key={item} 
                to={`/search?category=${encodeURIComponent(item)}`}
                className={`whitespace-nowrap text-sm font-medium ${item === 'New Drops' ? 'text-primary font-semibold' : item === 'Sale' ? 'text-red-600 hover:text-red-700' : 'text-slate-600 hover:text-primary dark:text-slate-400'}`}
               >
                 {item}
               </Link>
             ))}
          </div>
        </header>
      )}

      <main className="flex-1 w-full">{children}</main>

      {!noFooter && (
        <footer className="mt-auto border-t border-gray-100 bg-white pt-16 dark:border-gray-800 dark:bg-background-dark">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center gap-6 text-center">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <span className="material-symbols-outlined text-3xl">mail</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('home.join_club')}</h2>
              <p className="max-w-md text-slate-500 dark:text-slate-400">{t('home.join_desc')}</p>
              <form className="flex w-full max-w-sm items-center gap-2 rounded-full border border-gray-200 bg-surface-light p-1 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:border-gray-700 dark:bg-surface-dark">
                <input className="w-full border-none bg-transparent px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 dark:text-white" placeholder="Enter your email" type="email"/>
                <button className="shrink-0 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary dark:bg-white dark:text-black dark:hover:bg-gray-200" type="button">
                    {t('common.subscribe')}
                </button>
              </form>
            </div>
            <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-gray-100 pt-8 dark:border-gray-800 md:flex-row">
              <p className="text-sm text-slate-400">© 2024 ShoeSwift Inc. {t('common.rights')}</p>
              <div className="flex gap-6">
                <Link to="#" className="text-sm text-slate-500 hover:text-primary">{t('common.privacy')}</Link>
                <Link to="#" className="text-sm text-slate-500 hover:text-primary">{t('common.terms')}</Link>
                <Link to="#" className="text-sm text-slate-500 hover:text-primary">{t('common.support')}</Link>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-white dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-gray-800 z-50 px-6 py-3 flex justify-between items-center text-xs font-medium text-gray-500">
         <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-primary' : ''}`}>
           <span className="material-symbols-outlined">home</span>{t('nav.home')}
         </Link>
         <Link to="/search" className={`flex flex-col items-center gap-1 ${location.pathname.includes('/search') ? 'text-primary' : ''}`}>
           <span className="material-symbols-outlined">search</span>{t('nav.search')}
         </Link>
         <Link to="/cart" className={`flex flex-col items-center gap-1 relative ${location.pathname === '/cart' ? 'text-primary' : ''}`}>
            <span className="material-symbols-outlined">shopping_cart</span>
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex size-3 items-center justify-center rounded-full bg-primary text-[8px] text-white">{totalItems}</span>
            )}
            {t('nav.cart')}
         </Link>
         <Link to={isAuthenticated ? "/profile" : "/login"} className={`flex flex-col items-center gap-1 ${location.pathname === '/profile' ? 'text-primary' : ''}`}>
           <span className="material-symbols-outlined">person</span>{isAuthenticated ? t('nav.profile') : t('nav.login')}
         </Link>
      </div>
    </div>
  );
};