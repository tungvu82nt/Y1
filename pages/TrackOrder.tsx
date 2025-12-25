import React from 'react';
import { Layout } from '../components/Layout';
import { IMAGES } from '../constants';
import { useOrder } from '../contexts/OrderContext';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const TrackOrder = () => {
  const { orders } = useOrder();
  const { t } = useLanguage();
  
  // Display the most recent order, or fallback content if no orders
  const latestOrder = orders.length > 0 ? orders[0] : null;

  if (!latestOrder) {
      return (
          <Layout>
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">local_shipping</span>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('track.no_active')}</h1>
                  <p className="text-gray-500 mb-6">{t('track.no_active_desc')}</p>
                  <Link to="/" className="px-6 py-3 bg-primary text-white rounded-full font-bold">{t('cart.start_shopping')}</Link>
              </div>
          </Layout>
      )
  }

  const mainItem = latestOrder.items[0];

  return (
    <Layout>
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-10 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">{t('track.title')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg">{t('track.subtitle')}</p>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                <span className="material-symbols-outlined text-[18px]">help</span> {t('common.need_help')}
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 flex flex-col gap-8">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
                    <h2 className="text-2xl font-bold tracking-tight">{t('track.current_order')} <span className="text-primary">#{latestOrder.id}</span></h2>
                    <span className="hidden sm:inline-flex bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> {t(`status.${latestOrder.status}`)}
                    </span>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex flex-col md:flex-row gap-8">
                         <div className="w-full md:w-1/3 aspect-square bg-[#f8f6f6] dark:bg-white/5 rounded-xl flex items-center justify-center p-4 relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-promotion rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <img className="object-contain w-full h-full drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500" src={mainItem.image} alt={mainItem.name} />
                         </div>
                         <div className="flex-1 flex flex-col justify-center">
                            <div className="mb-6">
                                <p className="text-primary font-bold text-sm tracking-widest uppercase mb-1">{t('track.on_way')}</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-2">{mainItem.name}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-base">{t('common.size')}: {mainItem.selectedSize} • {t('common.color')}: {mainItem.selectedColor} • {t('common.qty')}: {mainItem.quantity}</p>
                                {latestOrder.items.length > 1 && (
                                    <p className="text-sm font-bold text-gray-500 mt-1">+ {latestOrder.items.length - 1} {t('track.other_items')}</p>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 sm:items-end justify-between mt-auto">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">{t('track.est_delivery')}</p>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">calendar_month</span> {latestOrder.estimatedDelivery}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex-1 sm:flex-none h-10 px-6 bg-white border border-gray-200 dark:border-white/20 dark:bg-transparent dark:text-white rounded-full text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">{t('common.view_invoice')}</button>
                                </div>
                            </div>
                         </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/10">
                        <div className="relative px-2">
                             <div className="absolute top-5 left-4 right-4 h-1 bg-gray-100 dark:bg-white/10 -z-0 rounded-full"></div>
                             <div className="absolute top-5 left-4 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/80 -z-0 rounded-full"></div>
                             <div className="relative z-10 flex justify-between w-full">
                                 {[
                                     {icon: 'check', label: t('track.placed'), date: latestOrder.date, active: true},
                                     {icon: 'local_shipping', label: t('track.shipped'), date: t('status.Pending'), active: true},
                                     {icon: 'location_on', label: t('track.out'), date: t('status.Pending'), active: true, current: true},
                                     {icon: 'inventory_2', label: t('track.delivered'), date: t('status.Pending'), active: false}
                                 ].map((step, i) => (
                                     <div key={i} className="flex flex-col items-center gap-3 w-1/4">
                                        <div className={`size-10 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-surface-dark ${step.active ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-400'} ${step.current ? 'border-4 border-primary bg-white dark:bg-surface-dark text-primary shadow-none' : ''}`}>
                                            <span className={`material-symbols-outlined text-[20px] ${step.current ? 'animate-bounce' : ''}`}>{step.icon}</span>
                                        </div>
                                        <div className={`text-center ${step.current ? '' : 'hidden sm:block'}`}>
                                            <p className={`text-sm font-bold ${step.current ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{step.label}</p>
                                            <p className="text-xs text-gray-500">{step.date}</p>
                                        </div>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-4 text-slate-900 dark:text-white">
                            <span className="material-symbols-outlined text-primary">home_pin</span>
                            <h3 className="font-bold text-lg">{t('checkout.shipping_address')}</h3>
                        </div>
                        <address className="not-italic text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            <span className="block text-slate-900 dark:text-white font-medium mb-1">Alex Johnson</span>
                            {latestOrder.shippingAddress}
                        </address>
                    </div>
                     <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-4 text-slate-900 dark:text-white">
                            <span className="material-symbols-outlined text-primary">credit_card</span>
                            <h3 className="font-bold text-lg">{t('checkout.payment')}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-12 bg-black rounded flex items-center justify-center text-white text-[10px] font-bold tracking-widest">VISA</div>
                            <div className="text-gray-500 text-sm">
                                <p>Ending in <span className="text-slate-900 dark:text-white font-medium">4242</span></p>
                                <p className="text-xs">Expires 12/25</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-promotion rounded-xl p-6 relative overflow-hidden group">
                     <div className="relative z-10">
                         <span className="inline-block py-1 px-3 bg-black text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider">{t('tags.new')}</span>
                         <h3 className="text-2xl font-black text-black leading-tight mb-2">{t('track.match_kicks')}</h3>
                         <p className="text-black/80 font-medium text-sm mb-4 max-w-[160px]">Check out our premium socks collection.</p>
                         <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-900 transition-colors">{t('track.shop_accessories')}</button>
                     </div>
                     <img alt="Socks" className="absolute -bottom-6 -right-6 w-40 h-40 object-cover rounded-full border-4 border-white shadow-lg transform group-hover:scale-110 transition-transform duration-300" src={IMAGES.PROMO_SOCKS} />
                </div>
                
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden flex-1">
                    <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                         <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('track.order_history')}</h3>
                         <Link to="/profile" className="text-sm font-medium text-primary hover:underline">{t('common.viewAll')}</Link>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                         {orders.slice(0, 3).map((item, i) => (
                             <div key={i} className="p-4 flex gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                 <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-lg flex items-center justify-center p-1 shrink-0">
                                     <img src={item.items[0].image} className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                     <div className="flex justify-between items-start mb-1">
                                         <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate pr-2">{item.items[0].name}</h4>
                                         <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full whitespace-nowrap">{t(`status.${item.status}`)}</span>
                                     </div>
                                     <p className="text-xs text-gray-500 mb-2">{item.date}</p>
                                     <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <button className="text-xs font-bold text-primary hover:text-primary-hover">{t('common.buy_again')}</button>
                                         <button className="text-xs font-medium text-gray-500 hover:text-slate-900 dark:hover:text-white">{t('common.view_invoice')}</button>
                                     </div>
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};