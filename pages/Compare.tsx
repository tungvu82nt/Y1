import React from 'react';
import { Layout } from '../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../contexts/CompareContext';
import { useCart } from '../contexts/CartContext';

export const Compare = () => {
  const { compareList, removeFromCompare } = useCompare();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product: any) => {
      addToCart(product, '9', 'Black');
      navigate('/cart');
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center py-5 px-4 md:px-10 lg:px-40 min-h-[60vh]">
        <div className="flex flex-col w-full max-w-[1280px] flex-1">
            <div className="flex flex-wrap gap-2 py-4">
                <Link className="text-[#9a4c4e] dark:text-white/60 text-sm font-medium leading-normal hover:underline" to="/">Home</Link>
                <span className="text-[#9a4c4e] dark:text-white/60 text-sm font-medium leading-normal">/</span>
                <Link className="text-[#9a4c4e] dark:text-white/60 text-sm font-medium leading-normal hover:underline" to="/search">Men's Shoes</Link>
                <span className="text-[#9a4c4e] dark:text-white/60 text-sm font-medium leading-normal">/</span>
                <span className="text-[#1b0d0e] dark:text-white text-sm font-medium leading-normal">Compare</span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div className="flex flex-col gap-3">
                    <h1 className="text-[#1b0d0e] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Compare Products</h1>
                    <p className="text-[#9a4c4e] dark:text-white/70 text-base font-normal leading-normal max-w-lg">
                        {compareList.length > 0 
                            ? `Comparing ${compareList.length} item${compareList.length > 1 ? 's' : ''}. features and specs side-by-side.` 
                            : "Add items to compare features and specs side-by-side."}
                    </p>
                </div>
                {compareList.length > 0 && (
                    <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-2 rounded-full border border-[#f3e7e7] dark:border-white/10 shadow-sm">
                        <span className="pl-3 text-sm font-bold text-[#1b0d0e] dark:text-white">Highlight Differences</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#f3e7e7] dark:bg-white/20">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1 shadow"></span>
                        </button>
                    </div>
                )}
            </div>

            {compareList.length > 0 ? (
                <div className="w-full overflow-x-auto pb-10">
                     <div className="min-w-[800px] grid grid-cols-[160px_1fr_1fr_1fr_0.5fr] gap-0 border-collapse">
                         <div className="p-4 flex items-end pb-8"></div>
                         
                         {compareList.map((item, i) => (
                             <div key={item.id} className={`relative group p-4 border-r border-[#f3e7e7] dark:border-white/5 bg-white dark:bg-white/5 ${i===0 ? 'rounded-tl-xl' : ''}`}>
                                 {item.tags?.includes('best-seller') && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">Best Seller</div>}
                                 {item.tags?.includes('limited') && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-white text-white dark:text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">Low Stock</div>}
                                 
                                 <button 
                                    onClick={() => removeFromCompare(item.id)}
                                    className="absolute top-4 right-4 text-[#9a4c4e] hover:text-primary transition-colors z-20"
                                 >
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                 </button>
                                 
                                 <Link to={`/product/${item.id}`} className="block aspect-square w-full mb-4 bg-gray-100 dark:bg-white/10 rounded-xl overflow-hidden flex items-center justify-center hover:opacity-90">
                                     <img className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" src={item.image} alt={item.name} />
                                 </Link>
                                 <div className="flex flex-col gap-1">
                                     <span className="text-xs font-bold text-[#9a4c4e] uppercase tracking-wider">{item.brand}</span>
                                     <Link to={`/product/${item.id}`} className="text-lg font-bold text-[#1b0d0e] dark:text-white leading-tight hover:text-primary transition-colors">{item.name}</Link>
                                     <div className="flex items-center gap-1 mb-2">
                                         <span className="material-symbols-outlined text-yellow-400 text-[16px] icon-fill">star</span>
                                         <span className="text-sm font-medium">{item.rating || 4.5}</span>
                                         <span className="text-xs text-gray-500">({item.reviews || 85} reviews)</span>
                                     </div>
                                     <div className="flex items-center gap-2 mb-3">
                                         <span className="text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
                                         {item.originalPrice && <span className="text-sm text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>}
                                     </div>
                                     <button onClick={() => handleAddToCart(item)} className="w-full py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-md shadow-red-500/20 hover:bg-red-700 transition-all">Add to Cart</button>
                                 </div>
                             </div>
                         ))}
                         
                         {compareList.length < 3 && (
                             <Link to="/search" className="p-4 flex flex-col items-center justify-center h-full rounded-tr-xl border-dashed border-2 border-[#f3e7e7] dark:border-white/10 bg-transparent hover:bg-white/30 transition-colors cursor-pointer group">
                                 <div className="size-16 rounded-full bg-[#f3e7e7] dark:bg-white/10 flex items-center justify-center text-[#1b0d0e] dark:text-white group-hover:bg-white group-hover:shadow-md transition-all">
                                     <span className="material-symbols-outlined text-3xl">add</span>
                                 </div>
                                 <p className="mt-4 text-sm font-bold text-[#1b0d0e] dark:text-white">Add Product</p>
                             </Link>
                         )}

                         {/* Specs Rows */}
                         <div className="p-4 flex items-center font-bold text-sm text-[#9a4c4e] dark:text-white/60">Category</div>
                         {compareList.map((item, i) => <div key={i} className="p-4 border-r border-[#f3e7e7] dark:border-white/5 bg-[#fcfcfc] dark:bg-white/5 flex items-center text-sm font-medium text-[#1b0d0e] dark:text-white">{item.category}</div>)}
                         {compareList.length < 3 && <div className="bg-transparent"></div>}

                         <div className="p-4 flex items-center font-bold text-sm text-[#9a4c4e] dark:text-white/60 bg-white dark:bg-transparent">Price</div>
                         {compareList.map((item, i) => <div key={i} className="p-4 border-r border-[#f3e7e7] dark:border-white/5 bg-white dark:bg-white/5 flex items-center text-sm font-medium text-[#1b0d0e] dark:text-white">${item.price.toFixed(2)}</div>)}
                         {compareList.length < 3 && <div className="bg-transparent"></div>}

                         <div className="p-4 flex items-center font-bold text-sm text-[#9a4c4e] dark:text-white/60 bg-[#fcfcfc] dark:bg-transparent">Brand</div>
                         {compareList.map((item, i) => <div key={i} className="p-4 border-r border-[#f3e7e7] dark:border-white/5 bg-primary/5 dark:bg-primary/20 flex items-center text-sm font-bold text-primary">{item.brand}</div>)}
                         {compareList.length < 3 && <div className="bg-transparent"></div>}
                     </div>
                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center py-20 bg-surface-light dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">compare_arrows</span>
                    <h3 className="text-xl font-bold mb-2">No items to compare</h3>
                    <p className="text-gray-500 mb-6">Add items from the product details page.</p>
                    <Link to="/search" className="px-6 py-3 bg-primary text-white rounded-full font-bold">Start Shopping</Link>
                </div>
            )}
            
            <div className="mt-8 p-8 rounded-xl bg-white dark:bg-white/5 border border-dashed border-[#f3e7e7] dark:border-white/10 flex flex-col items-center justify-center text-center">
                 <div className="bg-primary/10 p-3 rounded-full mb-3 text-primary"><span className="material-symbols-outlined text-3xl">lightbulb</span></div>
                 <h3 className="text-lg font-bold text-[#1b0d0e] dark:text-white">Pro Tip</h3>
                 <p className="text-[#9a4c4e] dark:text-white/60 text-sm max-w-md">Compare up to 3 items to find the perfect match for your style and budget.</p>
            </div>
        </div>
      </div>
    </Layout>
  );
};