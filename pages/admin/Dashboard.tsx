import React from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { useProducts } from '../../contexts/ProductContext';

export const AdminDashboard = () => {
  const { orders } = useOrder();
  const { products } = useProducts();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;
  const lowStock = products.filter(p => p.tags?.includes('limited')).length;

  return (
    <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: 'attach_money', color: 'bg-green-500' },
                { label: 'Total Orders', value: orders.length, icon: 'shopping_bag', color: 'bg-blue-500' },
                { label: 'Products', value: products.length, icon: 'inventory_2', color: 'bg-purple-500' },
                { label: 'Pending Orders', value: pendingOrders, icon: 'pending', color: 'bg-orange-500' }
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
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Recent Orders</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="pb-3 font-medium text-gray-500">Order ID</th>
                                <th className="pb-3 font-medium text-gray-500">Total</th>
                                <th className="pb-3 font-medium text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {orders.slice(0, 5).map(order => (
                                <tr key={order.id}>
                                    <td className="py-3 font-medium dark:text-white">#{order.id}</td>
                                    <td className="py-3 text-gray-500">${order.total.toFixed(2)}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                            order.status === 'Processing' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Low Stock Alert</h3>
                {lowStock > 0 ? (
                    <div className="flex flex-col gap-3">
                        {products.filter(p => p.tags?.includes('limited')).slice(0, 5).map(p => (
                            <div key={p.id} className="flex items-center gap-3">
                                <img src={p.image} className="size-10 rounded bg-gray-100 object-cover" />
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</p>
                                    <p className="text-xs text-red-500 font-bold">Limited Stock</p>
                                </div>
                                <button className="text-xs font-bold text-primary border border-primary px-2 py-1 rounded">Restock</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                        <span className="material-symbols-outlined text-3xl mb-2">check_circle</span>
                        <p>Inventory looks good</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};