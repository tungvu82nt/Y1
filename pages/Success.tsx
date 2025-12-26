import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useOrder } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';

export const Success = () => {
    const navigate = useNavigate();
    const { currentOrder } = useOrder();
    const { user } = useAuth();
    const { t } = useLanguage();
    const { formatPrice } = useCurrency();

    // If no order exists in session, redirect to home (prevent direct access)
    useEffect(() => {
        if (!currentOrder) {
            navigate('/');
        }
    }, [currentOrder, navigate]);

    if (!currentOrder) return null;

    // Get the first item for the hero display, or fallback
    const mainItem = currentOrder.items[0];

    return (
        <Layout noFooter>
            <main className="flex flex-col items-center justify-center py-10 px-4 md:px-6 min-h-[80vh]">
                <div className="w-full max-w-[640px] flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center gap-6 py-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150"></div>
                            <span className="material-symbols-outlined relative z-10 text-primary !text-[80px] icon-fill">check_circle</span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{t('success.title')}</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">{t('success.thank_you')}{user ? `, ${user.name.split(' ')[0]}` : ''}. <br/>{t('success.on_way')}</p>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{t('success.order_num')} #{currentOrder.id}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#2a1516] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-[#3a2829]">
                         <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="w-full md:w-1/3 aspect-square rounded-xl overflow-hidden bg-gray-100 relative group">
                                <img className="w-full h-full object-cover object-center" src={mainItem.image} alt={mainItem.name} />
                                {currentOrder.items.length > 1 && (
                                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-md">
                                        + {currentOrder.items.length - 1} {t('track.other_items')}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 w-full space-y-4">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{mainItem.name}</h3>
                                            <p className="text-gray-500 text-sm">{mainItem.brand}</p>
                                        </div>
                                        <span className="text-lg font-bold text-primary">{formatPrice(currentOrder.total)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="bg-background-light dark:bg-background-dark px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-100 dark:border-gray-800">
                                        {t('common.size')}: <span className="text-slate-900 dark:text-white font-bold">{mainItem.selectedSize}</span>
                                    </div>
                                    <div className="bg-background-light dark:bg-background-dark px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-100 dark:border-gray-800">
                                        {t('common.color')}: <span className="text-slate-900 dark:text-white font-bold">{mainItem.selectedColor}</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-dashed border-gray-200 dark:border-gray-800">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <span className="material-symbols-outlined text-primary !text-[20px]">local_shipping</span>
                                        <span>{t('track.est_delivery')}: <strong>{currentOrder.estimatedDelivery}</strong></span>
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl bg-promotion p-6 md:p-8 text-black shadow-sm">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-black tracking-tight mb-1">{t('success.bonus_title')}</h3>
                                <p className="font-medium opacity-90">{t('success.bonus_desc')}</p>
                            </div>
                            <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-white/40 min-w-[240px]">
                                <div className="flex-1 flex items-center justify-center font-mono font-bold tracking-wider text-sm px-4">KICKSOFF20</div>
                                <button className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined !text-[16px]">content_copy</span> {t('success.copy')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-4 w-full">
                        <button onClick={() => navigate('/track')} className="group w-full h-14 bg-primary hover:bg-red-700 text-white rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary/20 transform active:scale-95">
                            <span>{t('success.track_btn')}</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                         <div className="flex flex-col sm:flex-row gap-4">
                            <button className="flex-1 h-12 bg-white dark:bg-[#2a1516] border border-gray-100 dark:border-[#3a2829] text-slate-900 dark:text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-[#331a1b] transition-colors">
                                <span className="material-symbols-outlined !text-[20px]">receipt_long</span> {t('common.download_receipt')}
                            </button>
                            <Link to="/search" className="flex-1 h-12 bg-transparent text-gray-500 dark:text-gray-400 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:text-primary transition-colors">
                                {t('common.continue_shopping')}
                            </Link>
                         </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
};