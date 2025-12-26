import React from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { useToast } from '../../contexts/ToastContext';
import { Order } from '../../types';

export const AdminOrders = () => {
  const { orders, updateOrderStatus } = useOrder();
  const { showToast } = useToast();

  const handleStatusChange = (id: string, newStatus: string) => {
      updateOrderStatus(id, newStatus as Order['status']);
      showToast(`Order #${id} updated to ${newStatus}`);
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                        <th className="px-6 py-4 font-bold text-gray-500">Order ID</th>
                        <th className="px-6 py-4 font-bold text-gray-500">Date</th>
                        <th className="px-6 py-4 font-bold text-gray-500">Customer</th>
                        <th className="px-6 py-4 font-bold text-gray-500">Total</th>
                        <th className="px-6 py-4 font-bold text-gray-500">Status</th>
                        <th className="px-6 py-4 font-bold text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium dark:text-white">#{order.id}</td>
                            <td className="px-6 py-4 text-gray-500">{order.date}</td>
                            <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                                {typeof order.shippingAddress === 'string' ? order.shippingAddress.split(',')[0] : 'Guest'}
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">${order.total.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                    order.status === 'Processing' ? 'bg-orange-100 text-orange-700' : 
                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <select 
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium px-2 py-1 focus:ring-primary focus:border-primary"
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};