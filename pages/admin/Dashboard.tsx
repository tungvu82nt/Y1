import React from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { useProducts } from '../../contexts/ProductContext';
import { useLanguage } from '../../contexts/LanguageContext';

import { useWebSocket } from '../../contexts/WebSocketContext';

export const AdminDashboard = () => {
    const { orders } = useOrder();
    const { products } = useProducts();
    const { t } = useLanguage();
    const { isConnected } = useWebSocket();

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'PROCESSING').length;
    const lowStock = products.filter(p => p.tags?.includes('limited')).length;

    return (
        <div className="flex flex-col gap-8">
            {/* Real-time Status Banner */}
            <div className={`w-full px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <span className={`block size-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                {isConnected ? 'Real-time System Active' : 'Connecting to Real-time Server...'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: t('admin.total_revenue'), value: `$${totalRevenue.toFixed(2)}`, icon: 'attach_money', color: 'bg-green-500' },
                    { label: t('admin.total_orders'), value: orders.length, icon: 'shopping_bag', color: 'bg-blue-500' },
                    { label: t('admin.products'), value: products.length, icon: 'inventory_2', color: 'bg-purple-500' },
                    { label: t('admin.pending_orders'), value: pendingOrders, icon: 'pending', color: 'bg-orange-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                        <div className={`size-12 rounded-full ${stat.color} bg-opacity-10 flex items-center justify-center text-${stat.color.replace('bg-', '')}`}>
                            <span className={`material-symbols-outlined text-${stat.color.replace('bg-', '')}`}>{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">{t('admin.recent_orders')}</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th className="pb-3 font-medium text-gray-500">{t('admin.order_id')}</th>
                                    <th className="pb-3 font-medium text-gray-500">{t('common.total')}</th>
                                    <th className="pb-3 font-medium text-gray-500">{t('admin.stock_status')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {orders.slice(0, 5).map(order => (
                                    <tr key={order.id}>
                                        <td className="py-3 font-medium dark:text-white">#{order.id}</td>
                                        <td className="py-3 text-gray-500">${order.total.toFixed(2)}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'PROCESSING' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {t(`status.${order.status}`)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">{t('admin.low_stock_alert')}</h3>
                    {lowStock > 0 ? (
                        <div className="flex flex-col gap-3">
                            {products.filter(p => p.tags?.includes('limited')).slice(0, 5).map(p => (
                                <div key={p.id} className="flex items-center gap-3">
                                    <img src={p.image} className="size-10 rounded bg-gray-100 object-cover" />
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</p>
                                        <p className="text-xs text-red-500 font-bold">{t('common.stock_low')}</p>
                                    </div>
                                    <button className="text-xs font-bold text-primary border border-primary px-2 py-1 rounded">{t('admin.restock')}</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                            <span className="material-symbols-outlined text-3xl mb-2">check_circle</span>
                            <p>{t('admin.inventory_good')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};