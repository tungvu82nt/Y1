import React, { useState } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useToast } from '../../contexts/ToastContext';
import { Currency } from '../../types';

export const AdminCurrencies = () => {
  const { currencies, currentCurrency, setCurrentCurrency } = useCurrency();
  const { showToast } = useToast();
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [formData, setFormData] = useState<Partial<Currency>>({});

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency);
    setFormData(currency);
  };

  const handleSave = () => {
    if (!editingCurrency) return;

    const updatedCurrencies = currencies.map(c => 
      c.code === editingCurrency.code ? { ...c, ...formData } as Currency : c
    );

    localStorage.setItem('yapee_currencies', JSON.stringify(updatedCurrencies));
    window.location.reload();
    showToast('Currency updated successfully');
  };

  const handleCancel = () => {
    setEditingCurrency(null);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Currency Management</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage exchange rates and currency settings</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">Current Currency:</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {currentCurrency.flag} {currentCurrency.code} ({currentCurrency.symbol})
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-500">Flag</th>
              <th className="px-6 py-4 font-bold text-gray-500">Code</th>
              <th className="px-6 py-4 font-bold text-gray-500">Symbol</th>
              <th className="px-6 py-4 font-bold text-gray-500">Name</th>
              <th className="px-6 py-4 font-bold text-gray-500">Exchange Rate (USD)</th>
              <th className="px-6 py-4 font-bold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {currencies.map(currency => (
              <tr key={currency.code} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-2xl">{currency.flag}</td>
                <td className="px-6 py-4 font-medium dark:text-white">
                  {currency.code}
                  {currency.code === currentCurrency.code && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">{currency.symbol}</td>
                <td className="px-6 py-4 text-gray-500">{currency.name}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                  {editingCurrency?.code === currency.code ? (
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.rate || currency.rate}
                      onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                      className="w-24 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-black text-slate-900 dark:text-white"
                    />
                  ) : (
                    currency.rate.toFixed(4)
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingCurrency?.code === currency.code ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentCurrency(currency)}
                        className="px-3 py-1 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors"
                        disabled={currency.code === currentCurrency.code}
                      >
                        {currency.code === currentCurrency.code ? 'Active' : 'Set Active'}
                      </button>
                      <button
                        onClick={() => handleEdit(currency)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Edit Rate
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
          <div>
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Exchange Rate Information</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Exchange rates are relative to USD (1 USD = X Currency). All product prices are stored in USD and converted dynamically based on the selected currency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
