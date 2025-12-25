import React from 'react';
import { Layout } from '../components/Layout';
import { useProducts } from '../contexts/ProductContext';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

export const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products } = useProducts(); // Use Context
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const query = searchParams.get('q');
  const category = searchParams.get('category');

  // Logic to filter products based on search query or category
  const filteredProducts = products.filter(p => {
    if (query) {
        const q = query.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    if (category) {
        if (category === 'New Drops') return p.tags?.includes('new');
        if (category === 'Sale') return p.discount || p.tags?.includes('sale');
        return p.category.toLowerCase() === category.toLowerCase() || p.tags?.includes(category.toLowerCase() as any);
    }
    // Default: return all or a slice if no filter
    return true;
  });

  const displayTitle = query 
    ? `Results for "${query}"` 
    : category 
        ? `${category} Collection` 
        : "All Sneakers";

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
      e.preventDefault(); // Prevent navigating to product details
      e.stopPropagation();
      addToCart(product, '9', 'Black');
      showToast(`Added ${product.name} to cart`);
  }

  const handleToggleWishlist = (e: React.MouseEvent, product: any, isLiked: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isLiked) {
        showToast('Added to wishlist');
    } else {
        showToast('Removed from wishlist', 'info');
    }
  }

  return (
    <Layout>
       <div className="layout-container flex flex-col grow w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-6">
            <div className="flex flex-col gap-2 mb-8">
                <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link className="hover:text-primary transition-colors" to="/">Home</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <Link className="hover:text-primary transition-colors" to="/search">Sneakers</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-medium">{displayTitle}</span>
                </nav>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">{displayTitle}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{filteredProducts.length} products found</p>
                    </div>
                    <button className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 rounded-full font-bold text-sm">
                        <span className="material-symbols-outlined">tune</span> Filters
                    </button>
                    <div className="hidden lg:flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Sort by:</span>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-full text-sm font-bold hover:border-primary transition-colors">
                            Relevance <span className="material-symbols-outlined text-[18px]">expand_more</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-10">
                {/* Sidebar Filters */}
                <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-8">
                    {category && (
                         <div className="flex flex-wrap gap-2">
                             <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                                 {category} <Link to="/search" className="hover:text-red-800"><span className="material-symbols-outlined text-[14px]">close</span></Link>
                             </span>
                             <Link to="/search" className="text-xs text-gray-500 underline hover:text-primary ml-1">Clear all</Link>
                         </div>
                    )}

                    <div className="space-y-6">
                        <div className="border-t border-gray-100 dark:border-white/10 pt-6">
                            <h3 className="font-bold mb-4 flex justify-between items-center cursor-pointer">Gender <span className="material-symbols-outlined">expand_less</span></h3>
                            <div className="space-y-3">
                                {[
                                    {label: 'Men', checked: true}, {label: 'Women', checked: false}, {label: 'Unisex', checked: false}
                                ].map((opt, i) => (
                                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`relative flex items-center justify-center w-5 h-5 border-2 ${opt.checked ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'} rounded group-hover:border-primary`}>
                                            {opt.checked && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
                                        </div>
                                        <span className="text-sm font-medium">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                         <div className="border-t border-gray-100 dark:border-white/10 pt-6">
                            <h3 className="font-bold mb-4 flex justify-between items-center cursor-pointer">Price <span className="material-symbols-outlined">expand_less</span></h3>
                             <div className="px-1 mb-4">
                                <div className="h-1 w-full bg-gray-100 dark:bg-white/10 rounded-full relative">
                                    <div className="absolute left-0 top-0 h-full w-1/2 bg-primary rounded-full"></div>
                                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow cursor-pointer"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {['0', '500'].map((val, i) => (
                                    <div key={i} className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                        <input className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-lg py-2 pl-6 pr-2 text-sm font-bold focus:ring-1 ring-primary" type="number" defaultValue={val}/>
                                    </div>
                                ))}
                            </div>
                         </div>
                    </div>
                </aside>

                <section className="flex-1">
                    <div className="flex lg:hidden gap-2 pb-4 overflow-x-auto scrollbar-hide mb-4">
                        {['All', 'Jordan', 'Nike', 'Sale'].map((chip, i) => (
                             <button key={i} className={`whitespace-nowrap flex h-8 items-center gap-x-2 rounded-full px-4 text-sm font-medium ${i === 0 ? 'bg-slate-900 text-white' : 'bg-white border border-gray-200 text-slate-900'}`}>{chip}</button>
                        ))}
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map((product, i) => {
                                const isLiked = isInWishlist(product.id);
                                return (
                                <Link key={i} to={`/product/${product.id}`} className="group relative flex flex-col bg-white dark:bg-white/5 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-white/5">
                                        {product.tags && product.tags.includes('best-seller') && <span className="absolute top-3 left-3 z-10 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">Best Seller</span>}
                                        {product.tags && product.tags.includes('new') && <span className="absolute top-3 left-3 z-10 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">New</span>}
                                        {product.discount && <span className="absolute top-3 left-3 z-10 bg-white text-primary border border-primary text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">{product.discount} OFF</span>}
                                        
                                        <button 
                                            onClick={(e) => handleToggleWishlist(e, product, isLiked)}
                                            className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-colors ${isLiked ? 'bg-white text-primary' : 'bg-white/50 text-slate-900 hover:bg-white'}`}
                                        >
                                            <span className={`material-symbols-outlined text-[20px] ${isLiked ? 'icon-fill' : ''}`}>favorite</span>
                                        </button>
                                        <img className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" src={product.image} />
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">{product.brand}</div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2">{product.name}</h3>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                                                    {product.originalPrice && <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={(e) => handleQuickAdd(e, product)}
                                                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-colors shadow-lg"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
                            <p className="text-gray-500 mb-6">We couldn't find any products matching your search.</p>
                            <Link to="/search" className="px-6 py-2 bg-primary text-white rounded-full font-bold text-sm">Clear Filters</Link>
                        </div>
                    )}
                </section>
            </div>
       </div>
    </Layout>
  );
};