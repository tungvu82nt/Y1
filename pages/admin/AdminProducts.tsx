import React, { useState } from 'react';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

export const AdminProducts = () => {
  const { products, deleteProduct, addProduct, updateProduct } = useProducts();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const initialFormState = {
      name: '',
      brand: '',
      category: '',
      price: '',
      image: '',
      stock: true
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleOpenModal = (product?: Product) => {
      if (product) {
          setEditingProduct(product);
          setFormData({
              name: product.name,
              brand: product.brand,
              category: product.category,
              price: product.price.toString(),
              image: product.image,
              stock: !product.tags?.includes('limited')
          });
      } else {
          setEditingProduct(null);
          setFormData(initialFormState);
      }
      setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const productData: any = {
          name: formData.name,
          brand: formData.brand,
          category: formData.category,
          price: parseFloat(formData.price),
          image: formData.image || 'https://via.placeholder.com/300',
          tags: formData.stock ? [] : ['limited']
      };

      if (editingProduct) {
          updateProduct(editingProduct.id, productData);
          showToast('Product updated successfully');
      } else {
          const newProduct = {
              ...productData,
              id: Date.now().toString(),
              rating: 0,
              reviews: 0
          };
          addProduct(newProduct);
          showToast('Product created successfully');
      }
      handleCloseModal();
  };

  const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this product?')) {
          deleteProduct(id);
          showToast('Product deleted successfully', 'info');
      }
  };

  const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input 
                    type="text" 
                    placeholder={t('common.searchPlaceholder')} 
                    className="w-full sm:w-80 pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] focus:ring-primary focus:border-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={() => handleOpenModal()} 
                className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary-hover w-full sm:w-auto justify-center"
            >
                <span className="material-symbols-outlined text-[18px]">add</span> {t('admin.add_product')}
            </button>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-4 font-bold text-gray-500">{t('admin.products')}</th>
                            <th className="px-6 py-4 font-bold text-gray-500">{t('admin.category')}</th>
                            <th className="px-6 py-4 font-bold text-gray-500">{t('admin.price')}</th>
                            <th className="px-6 py-4 font-bold text-gray-500">{t('admin.stock_status')}</th>
                            <th className="px-6 py-4 font-bold text-gray-500">{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredProducts.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                            <img src={product.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.brand}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{product.category}</td>
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    {product.tags?.includes('limited') ? (
                                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">{t('common.stock_low')}</span>
                                    ) : (
                                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">{t('common.stock_in')}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenModal(product)} className="p-1 text-gray-400 hover:text-blue-500"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                                        <button onClick={() => handleDelete(product.id)} className="p-1 text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Product Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
                <div className="relative bg-white dark:bg-[#1a1a1a] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-pulse-fast">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-black/20">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{editingProduct ? t('admin.edit_product') : t('admin.add_product')}</h3>
                        <button onClick={handleCloseModal} className="text-gray-400 hover:text-slate-900 dark:hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-gray-300">{t('admin.product_name')}</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 text-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-gray-300">{t('admin.brand')}</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 text-sm"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-gray-300">{t('admin.category')}</label>
                                <select 
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 text-sm"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="Running">Running</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                    <option value="Basketball">Basketball</option>
                                    <option value="Training">Training</option>
                                    <option value="Skateboarding">Skateboarding</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-gray-300">{t('admin.price')} ($)</label>
                                <input 
                                    required
                                    type="number" 
                                    step="0.01"
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 text-sm"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                />
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="rounded text-primary focus:ring-primary"
                                        checked={formData.stock}
                                        onChange={(e) => setFormData({...formData, stock: e.target.checked})}
                                    />
                                    <span className="text-sm font-bold text-slate-700 dark:text-gray-300">{t('common.stock_in')}</span>
                                </label>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-gray-300">{t('admin.image_url')}</label>
                                <input 
                                    type="text" 
                                    placeholder="https://..."
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 text-sm"
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={handleCloseModal}
                                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-slate-900 dark:hover:text-white"
                            >
                                {t('common.cancel')}
                            </button>
                            <button 
                                type="submit" 
                                className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-lg shadow-primary/20"
                            >
                                {editingProduct ? t('common.save') : t('admin.create')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};