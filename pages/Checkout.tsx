import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrder();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const [shippingAddress, setShippingAddress] = useState(user?.location || '');
  const [phone, setPhone] = useState('');

  const shipping = 0; // Free
  const tax = subtotal * 0.08; // Estimated 8%
  const total = subtotal + shipping + tax;

  // Redirect if cart is empty
  useEffect(() => {
      if (cartItems.length === 0) {
          navigate('/cart');
      }
  }, [cartItems, navigate]);

  const handlePayment = (e: React.FormEvent) => {
      e.preventDefault();
      
      // 1. Create the order
      addOrder(cartItems, subtotal, tax, total, shippingAddress || '123 Main St, New York, NY');
      
      // 2. Clear the cart
      clearCart();
      
      // 3. Simulate processing delay then redirect
      setTimeout(() => {
          navigate('/success');
      }, 1000);
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
        <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#221011]/90 backdrop-blur-md border-b border-[#f3e7e7] dark:border-[#3a2021]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="size-8 text-primary"><span className="material-symbols-outlined !text-[32px]">sprint</span></div>
                    <h2 className="text-[#1b0d0e] dark:text-white text-xl font-bold tracking-tight">Yapee</h2>
                </Link>
                <div className="flex items-center gap-6">
                    <span className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"><span className="material-symbols-outlined !text-[18px]">help</span> Help</span>
                </div>
            </div>
        </header>

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Form */}
                <div className="lg:col-span-7 flex flex-col gap-10">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{t('checkout.title')}</h1>
                        {/* Stepper */}
                         <div className="flex items-center w-full max-w-md gap-2 text-sm font-bold">
                            <div className="flex items-center gap-2 text-primary">
                                <div className="flex items-center justify-center size-8 rounded-full bg-primary text-white">1</div>
                                <span>{t('checkout.contact')}</span>
                            </div>
                            <div className="h-0.5 w-8 bg-gray-200 dark:bg-gray-700"></div>
                            <div className="flex items-center gap-2 text-primary">
                                <div className="flex items-center justify-center size-8 rounded-full bg-primary text-white">2</div>
                                <span>{t('checkout.address')}</span>
                            </div>
                            <div className="h-0.5 w-8 bg-gray-200 dark:bg-gray-700"></div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center size-8 rounded-full border-2 border-primary text-primary bg-transparent">3</div>
                                <span>{t('checkout.payment')}</span>
                            </div>
                        </div>
                    </div>

                    <form className="flex flex-col gap-8" onSubmit={handlePayment}>
                        <div className="group/field">
                            <label className="block text-base font-bold mb-3" htmlFor="checkout-phone">{t('checkout.phone')}</label>
                            <div className="flex w-full items-center rounded-full border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden h-14">
                                <div className="pl-5 pr-3 text-gray-500 flex items-center justify-center border-r border-gray-200 dark:border-gray-700 h-full">
                                    <span className="material-symbols-outlined">call</span>
                                </div>
                                <input 
                                    id="checkout-phone"
                                    name="phone"
                                    className="w-full h-full bg-transparent border-none focus:ring-0 px-4 text-base placeholder:text-gray-400 dark:placeholder:text-gray-600 text-slate-900 dark:text-white" 
                                    placeholder="+1 (555) 000-0000" 
                                    type="tel" 
                                    required 
                                    autoComplete="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="group/field relative">
                            <label className="block text-base font-bold mb-3" htmlFor="checkout-address">{t('checkout.shipping_address')}</label>
                            <div className="flex w-full items-center rounded-full border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden h-14 relative z-10">
                                <div className="pl-5 pr-3 text-gray-500 flex items-center justify-center h-full">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input 
                                    id="checkout-address"
                                    name="shipping-address"
                                    className="w-full h-full bg-transparent border-none focus:ring-0 px-2 text-base placeholder:text-gray-400 dark:placeholder:text-gray-600 text-slate-900 dark:text-white" 
                                    placeholder="Start typing address..." 
                                    type="text" 
                                    required
                                    autoComplete="street-address"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Payment Mock */}
                        <div className="flex flex-col gap-3">
                            <label className="block text-base font-bold mb-1">{t('checkout.payment')}</label>
                            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row items-center gap-8">
                                    <div className="flex-1 flex flex-col gap-4 text-center sm:text-left">
                                        <div>
                                            <h3 className="text-lg font-bold leading-tight mb-2">{t('checkout.scan_pay')}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{t('checkout.scan_desc')}</p>
                                        </div>
                                        <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                                            <div className="flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-3 py-1.5 rounded-full"><span className="material-symbols-outlined !text-[16px]">lock</span> Encrypted</div>
                                            <div className="flex items-center gap-1 text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full"><span className="material-symbols-outlined !text-[16px]">bolt</span> Instant</div>
                                        </div>
                                    </div>
                                    <div className="shrink-0 relative group">
                                        <div className="size-40 bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center">
                                            <span className="material-symbols-outlined text-8xl text-black">qr_code_2</span>
                                        </div>
                                         <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-mono px-2 py-0.5 rounded-md whitespace-nowrap">Exp: 04:59</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="mt-4 w-full h-14 bg-primary hover:bg-primary-hover text-white text-lg font-bold rounded-full shadow-lg shadow-primary/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group">
                            {t('checkout.pay_now')} {formatPrice(total)}
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </form>
                </div>

                {/* Summary */}
                <div className="lg:col-span-5 sticky top-24">
                     <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                         <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">{t('cart.summary')}</h2>
                            <div className="flex items-center gap-1 text-xs font-bold bg-[#fff7e6] text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-3 py-1 rounded-full">
                                <span className="material-symbols-outlined !text-[14px]">timer</span> Reserved: 14:59
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-20 h-20 rounded-xl bg-white dark:bg-black/20 p-2 flex items-center justify-center border border-gray-100 dark:border-gray-700 shrink-0 relative overflow-hidden">
                                        <div className="w-full h-full bg-center bg-cover" style={{backgroundImage: `url('${item.image}')`}}></div>
                                        <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-1.5 rounded-bl-lg">x{item.quantity}</span>
                                    </div>
                                    <div className="flex flex-col justify-center gap-1">
                                        <h3 className="font-bold text-base leading-tight line-clamp-1">{item.name}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('common.size')}: {item.selectedSize} · {item.selectedColor}</p>
                                        <div className="text-sm font-semibold mt-1">{formatPrice(item.price * item.quantity)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="h-px w-full bg-gray-200 dark:bg-gray-700 mb-6"></div>
                         <div className="flex flex-col gap-3 mb-6">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span>{t('common.subtotal')}</span>
                                <span className="font-medium text-[#1b0d0e] dark:text-white">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm items-center">
                                <span className="text-gray-600 dark:text-gray-400">{t('common.shipping')}</span>
                                <div className="flex items-center gap-2">
                                    <span className="line-through text-gray-400 text-xs">{formatPrice(12)}</span>
                                    <span className="font-bold text-xs bg-promotion text-black px-2 py-0.5 rounded-full uppercase tracking-wider">{t('common.free')}</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span>{t('common.tax')} (8%)</span>
                                <span className="font-medium text-[#1b0d0e] dark:text-white">{formatPrice(tax)}</span>
                            </div>
                        </div>
                        <div className="h-px w-full bg-gray-200 dark:bg-gray-700 mb-6"></div>
                         <div className="flex justify-between items-end mb-8">
                            <div>
                                <span className="block text-sm text-gray-500 mb-1">{t('common.total')}</span>
                                <div className="text-3xl font-black tracking-tight text-[#1b0d0e] dark:text-white">{formatPrice(total)}</div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-400">USD</span>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </main>
    </div>
  );
};