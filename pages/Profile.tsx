import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { orders } = useOrder();
  const { t } = useLanguage();

  if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-72 h-full bg-surface-light dark:bg-surface-dark border-r border-gray-100 dark:border-gray-800/50 p-6 flex-shrink-0 z-20">
             <div className="flex items-center gap-3 px-2 mb-10">
                <div className="flex items-center justify-center size-10 bg-primary rounded-full text-white">
                     <span className="material-symbols-outlined text-2xl">foot_bones</span>
                </div>
                <h1 className="text-xl font-extrabold tracking-tight">Yapee</h1>
             </div>
             <nav className="flex flex-col gap-2 flex-1">
                 {[
                     {icon: 'dashboard', label: t('admin.overview'), active: false},
                     {icon: 'person', label: t('nav.profile'), active: true},
                     {icon: 'location_on', label: t('checkout.address'), active: false},
                     {icon: 'shopping_bag', label: t('admin.orders'), active: false},
                     {icon: 'favorite', label: t('nav.wishlist'), active: false}
                 ].map((item, i) => (
                     <a key={i} href="#" className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors group ${item.active ? 'bg-primary/10 text-primary' : 'hover:bg-white dark:hover:bg-black/20'}`}>
                         <span className={`material-symbols-outlined ${item.active ? 'icon-fill' : 'text-gray-400 group-hover:text-primary'}`}>{item.icon}</span>
                         <span className={`text-sm font-medium ${item.active ? 'font-bold' : 'text-gray-500 group-hover:text-slate-900 dark:text-gray-400 dark:group-hover:text-white'}`}>{item.label}</span>
                     </a>
                 ))}
                 <div className="mt-auto"></div>
                 <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-white dark:hover:bg-black/20 transition-colors group">
                     <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">settings</span>
                     <span className="text-sm font-medium text-gray-500 group-hover:text-slate-900 dark:text-gray-400 dark:group-hover:text-white">Settings</span>
                 </a>
                 <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-full h-12 mt-4 bg-slate-900 dark:bg-white text-white dark:text-background-dark text-sm font-bold hover:opacity-90 transition-opacity">
                     <span className="material-symbols-outlined text-[18px]">logout</span> {t('nav.logout')}
                 </button>
             </nav>
        </aside>

        <main className="flex-1 h-full overflow-y-auto relative p-4 md:p-8 lg:p-12 pb-20">
             <div className="flex flex-col gap-2 mb-8">
                 <h1 className="text-3xl md:text-4xl font-black tracking-tight">My Profile</h1>
                 <p className="text-gray-500 text-base font-normal">Manage your personal information and preferences</p>
             </div>

             <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800/50 mb-8">
                 <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                     <div className="relative group cursor-pointer">
                         <img src={user.avatar} className="rounded-full size-28 md:size-32 shadow-md border-4 border-white dark:border-background-dark object-cover" />
                         <div className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1.5 border-4 border-white dark:border-background-dark">
                             <span className="material-symbols-outlined text-[16px] block">edit</span>
                         </div>
                     </div>
                     <div className="flex flex-col items-center md:items-start flex-1 text-center md:text-left pt-2">
                         <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-1">
                             <h2 className="text-2xl font-bold leading-tight">{user.name}</h2>
                             <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">VIP MEMBER</span>
                         </div>
                         <p className="text-gray-500 text-sm mb-4">Member since {user.memberSince} • {user.location}</p>
                         <div className="flex gap-4 w-full md:w-auto">
                             <div className="flex flex-col bg-white dark:bg-black/20 p-3 rounded-lg flex-1 md:flex-none md:w-32 border border-gray-200 dark:border-gray-800">
                                 <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Shoe Size</span>
                                 <span className="text-lg font-bold">US 10.5</span>
                             </div>
                             <div className="flex flex-col bg-white dark:bg-black/20 p-3 rounded-lg flex-1 md:flex-none md:w-32 border border-gray-200 dark:border-gray-800">
                                 <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{t('admin.orders')}</span>
                                 <span className="text-lg font-bold">{orders.length}</span>
                             </div>
                         </div>
                     </div>
                     <div className="md:ml-auto flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                         <button className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-colors w-full md:w-auto shadow-lg shadow-primary/30">Edit Profile</button>
                         <button onClick={handleLogout} className="md:hidden w-full h-12 bg-white dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-full font-bold text-slate-900 dark:text-white">{t('nav.logout')}</button>
                     </div>
                 </div>
             </div>

             <div className="mb-10">
                 <div className="flex items-center justify-between mb-6">
                     <h2 className="text-xl font-bold">Personal Details</h2>
                     <button className="text-primary text-sm font-bold hover:underline">{t('common.cancel')}</button>
                 </div>
                 <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800/50">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {[t('auth.full_name'), 'Last Name', t('auth.email'), t('checkout.phone')].map((label, i) => (
                             <label key={i} className="flex flex-col gap-2">
                                 <span className="text-sm font-bold">{label}</span>
                                 <input 
                                     className="w-full h-12 px-4 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                                     type={label.includes('Email') ? 'email' : 'text'} 
                                     defaultValue={i === 0 ? user.name.split(' ')[0] : i === 1 ? user.name.split(' ')[1] : i === 2 ? 'alex.doe@example.com' : '+1 (555) 123-4567'}
                                 />
                             </label>
                         ))}
                     </div>
                     <div className="mt-8 flex justify-end">
                         <button className="bg-slate-900 dark:bg-white text-white dark:text-background-dark font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity">{t('common.save')}</button>
                     </div>
                 </div>
             </div>
        </main>
    </div>
  );
};