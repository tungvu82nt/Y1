import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
    const { t } = useLanguage();

    const shipping = 0; // Free
    const tax = subtotal * 0.08; // Estimated 8%
    const total = subtotal + shipping + tax;

  return (
    <Layout noFooter>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-[1400px] mx-auto w-full px-4 md:px-10 py-8">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between bg-primary/5 dark:bg-white/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center gap-3 text-primary">
                    <span className="material-symbols-outlined fill-current">timer</span>
                    <p className="font-bold text-sm md:text-base">{t('cart.reserved')}</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                        <span className="bg-white dark:bg-surface-dark text-slate-900 dark:text-white font-bold text-lg md:text-xl px-2 py-1 rounded shadow-sm min-w-[40px] text-center">10</span>
                        <span className="text-[10px] uppercase font-bold text-gray-500 mt-1">Min</span>
                    </div>
                    <span className="text-xl font-bold text-primary self-start mt-1">:</span>
                    <div className="flex flex-col items-center">
                        <span className="bg-white dark:bg-surface-dark text-slate-900 dark:text-white font-bold text-lg md:text-xl px-2 py-1 rounded shadow-sm min-w-[40px] text-center">00</span>
                        <span className="text-[10px] uppercase font-bold text-gray-500 mt-1">Sec</span>
                    </div>
                </div>
            </div>

            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t('cart.title')} <span className="text-gray-400 font-medium text-2xl">({cartItems.length} items)</span></h1>

            {cartItems.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {cartItems.map((item, index) => (
                        <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-white/5 p-4 rounded-xl shadow-sm border border-transparent hover:border-primary/20 transition-all">
                            <div className="relative shrink-0">
                                <div className="bg-center bg-cover rounded-lg aspect-square size-32 sm:size-36 bg-gray-100 dark:bg-white/10" style={{backgroundImage: `url('${item.image}')`}}></div>
                                {item.quantity > 3 && <div className="absolute top-2 left-2 bg-promotion text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">High Qty</div>}
                            </div>
                            <div className="flex flex-1 flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Link to={`/product/${item.id}`} className="text-lg font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">{item.name}</Link>
                                        <p className="text-gray-500 text-sm mt-1">{item.brand} - {item.category}</p>
                                        <div className="flex gap-3 mt-2 text-sm text-gray-600 dark:text-gray-300">
                                            <span className="bg-surface-light dark:bg-white/10 px-2 py-1 rounded">{t('common.size')} {item.selectedSize}</span>
                                            <span className="bg-surface-light dark:bg-white/10 px-2 py-1 rounded flex items-center gap-1">
                                                <span className={`w-2 h-2 rounded-full block border border-gray-300`} style={{backgroundColor: item.selectedColor.toLowerCase()}}></span> 
                                                {item.selectedColor}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(index)} className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined">delete</span></button>
                                </div>
                                <div className="flex items-end justify-between mt-4">
                                    <div className="flex items-center gap-3 bg-surface-light dark:bg-white/10 rounded-full p-1 pr-3">
                                        <button onClick={() => updateQuantity(index, -1)} className="size-8 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark shadow-sm text-slate-900 dark:text-white hover:text-primary"><span className="material-symbols-outlined text-sm">remove</span></button>
                                        <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(index, 1)} className="size-8 flex items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-red-700"><span className="material-symbols-outlined text-sm">add</span></button>
                                    </div>
                                    <div className="text-right"><p className="text-xl font-bold text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center bg-white dark:bg-white/5 rounded-xl">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_cart_off</span>
                    <h3 className="text-xl font-bold mb-2">{t('cart.empty')}</h3>
                    <Link to="/search" className="text-primary font-bold hover:underline">{t('cart.start_shopping')}</Link>
                </div>
            )}
            
             <Link className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors w-fit mt-2" to="/search">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                {t('cart.continue')}
            </Link>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="sticky top-24 flex flex-col gap-6">
                <div className="bg-white dark:bg-white/5 p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-6">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{t('cart.summary')}</h3>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between text-base text-gray-600 dark:text-gray-300">
                            <span>{t('common.subtotal')}</span>
                            <span className="font-bold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base text-gray-600 dark:text-gray-300">
                            <span>{t('common.shipping')}</span>
                            <span className="font-bold text-green-600">{t('common.free')}</span>
                        </div>
                        <div className="flex justify-between text-base text-gray-600 dark:text-gray-300">
                            <span>{t('common.tax')} (Est. 8%)</span>
                            <span className="font-bold text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-white/10 w-full"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{t('common.total')}</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white">${total.toFixed(2)}</span>
                    </div>
                    <button disabled={cartItems.length === 0} onClick={() => navigate('/checkout')} className="group w-full bg-primary hover:bg-red-700 text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                         {t('cart.checkout')}
                         <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
                 <div className="bg-surface-light dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5 flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-600 text-3xl">verified_user</span>
                    <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{t('cart.secure')}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('cart.secure_desc')}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};