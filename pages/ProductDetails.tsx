import React, { useState } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { IMAGES } from '../constants';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCompare } from '../contexts/CompareContext';
import { useToast } from '../contexts/ToastContext';
import { useProducts } from '../contexts/ProductContext';
import { useLanguage } from '../contexts/LanguageContext';

export const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products } = useProducts(); // Use Context
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare } = useCompare();
  const { showToast } = useToast();
  const { t } = useLanguage();
  
  // Find product by ID from Context (allowing for Admin updates to be reflected)
  const product = products.find(p => p.id === id);

  // Local State for selections
  const [selectedSize, setSelectedSize] = useState<string>('8.5');
  const [selectedColor, setSelectedColor] = useState<string>('Red');

  // If product not found, redirect to 404
  if (!product) {
      return <Navigate to="/404" replace />;
  }

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    showToast(`${t('product.added_cart')}`);
  };

  const handleBuyNow = () => {
      addToCart(product, selectedSize, selectedColor);
      navigate('/checkout');
  }

  const handleCompare = (e: React.MouseEvent) => {
      e.preventDefault();
      addToCompare(product);
      showToast('Added to comparison list');
  }

  const handleWishlist = () => {
      toggleWishlist(product);
      if (!isLiked) {
          showToast(`${t('product.added_wishlist')}`);
      } else {
          showToast('Removed from wishlist', 'info');
      }
  }

  const colors = [
      { name: 'Red', hex: '#ed1d23', ring: 'ring-primary' },
      { name: 'Black', hex: '#000000', ring: 'ring-gray-400' },
      { name: 'White', hex: '#ffffff', ring: 'ring-gray-200' },
      { name: 'Blue', hex: '#2563eb', ring: 'ring-blue-500' }
  ];

  const sizes = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-white">
        <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#f3e7e7] dark:border-white/10">
            <div className="px-6 lg:px-12 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-primary cursor-pointer">
                    <span className="material-symbols-outlined text-3xl">hiking</span>
                    <h2 className="text-[#1b0d0e] dark:text-white text-xl font-extrabold tracking-tight">ShoeStore</h2>
                </Link>
                <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">shopping_cart</span>
                    {/* Badge is handled in Layout usually, but simplified header here */}
                </Link>
            </div>
        </header>

        <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-6 lg:py-10 pb-32">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Images */}
                <div className="w-full lg:w-[60%] flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2 mb-2 text-sm">
                        <Link className="text-gray-500 dark:text-gray-400 hover:text-primary" to="/">{t('nav.home')}</Link>
                        <span className="text-gray-300">/</span>
                        <Link className="text-gray-500 dark:text-gray-400 hover:text-primary" to="/search">{t('nav.search')}</Link>
                        <span className="text-gray-300">/</span>
                        <Link className="font-medium text-[#1b0d0e] dark:text-white hover:text-primary" to={`/search?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
                    </div>
                    <div className="relative group w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 dark:bg-white/5">
                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                            {product.discount && (
                                <span className="bg-promotion text-black text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">{product.discount} OFF</span>
                            )}
                            {product.tags?.includes('new') && (
                                <span className="bg-white/90 backdrop-blur text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">New Arrival</span>
                            )}
                        </div>
                        <img alt={product.name} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" src={product.image}/>
                        <button onClick={handleCompare} className="absolute bottom-6 right-6 bg-white/90 dark:bg-black/50 p-3 rounded-full shadow-lg hover:bg-white transition-colors backdrop-blur-sm flex gap-2 items-center px-4 font-bold text-sm">
                            <span className="material-symbols-outlined">compare_arrows</span> {t('product.compare')}
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="aspect-square rounded-2xl overflow-hidden cursor-pointer ring-2 ring-primary ring-offset-2 dark:ring-offset-background-dark">
                             <img className="w-full h-full object-cover" src={product.image}/>
                        </div>
                        {IMAGES.PDP_THUMBS.map((thumb, idx) => (
                             <div key={idx} className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-80">
                                <img className="w-full h-full object-cover" src={thumb}/>
                             </div>
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="w-full lg:w-[40%] relative">
                    <div className="sticky top-24 flex flex-col gap-6">
                        <div>
                            <div className="flex justify-between items-start">
                                <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-none text-[#1b0d0e] dark:text-white mb-2">{product.name}</h1>
                                <button 
                                    onClick={handleWishlist}
                                    className={`transition-colors ${isLiked ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
                                >
                                    <span className={`material-symbols-outlined text-3xl ${isLiked ? 'icon-fill' : ''}`}>favorite</span>
                                </button>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">{product.brand} - {product.category}</p>
                        </div>
                        
                        <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="flex text-promotion">
                                    <span className="material-symbols-outlined text-lg icon-fill">star</span>
                                    <span className="text-slate-900 dark:text-white font-bold ml-1">{product.rating || 4.8}</span>
                                </div>
                                <span className="text-sm font-semibold underline decoration-gray-300 underline-offset-4 cursor-pointer">{product.reviews || 120} {t('product.reviews')}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                                {product.originalPrice && (
                                    <span className="text-sm text-gray-400 line-through font-medium">${product.originalPrice.toFixed(2)}</span>
                                )}
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="space-y-3">
                            <span className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('product.select_color')}: <span className="text-slate-900 dark:text-white">{selectedColor}</span></span>
                            <div className="flex gap-3">
                                {colors.map((c) => (
                                    <button 
                                        key={c.name}
                                        onClick={() => setSelectedColor(c.name)}
                                        className={`size-10 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm transition-transform hover:scale-110 ${selectedColor === c.name ? `ring-2 ring-offset-2 dark:ring-offset-background-dark ${c.ring}` : ''}`}
                                        style={{ backgroundColor: c.hex }}
                                    ></button>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="space-y-3 group relative">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('product.select_size')}: <span className="text-slate-900 dark:text-white">{selectedSize}</span></span>
                                <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                                    <span className="material-symbols-outlined text-base">straighten</span> {t('product.size_guide')}
                                </button>
                            </div>
                            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                    {sizes.map(s => (
                                        <button 
                                            key={s} 
                                            onClick={() => setSelectedSize(s)}
                                            className={`h-12 w-full rounded-xl border font-bold transition-all
                                                ${selectedSize === s 
                                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105' 
                                                    : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:grid grid-cols-2 gap-4 mt-2">
                            <button onClick={handleAddToCart} className="h-14 rounded-full border-2 border-primary text-primary font-bold text-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">{t('common.addToCart')}</button>
                            <button onClick={handleBuyNow} className="h-14 rounded-full bg-primary text-white font-bold text-lg shadow-xl shadow-primary/30 hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                    {t('common.buyNow')} <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-white/10 shadow-[0_-5px_30px_rgba(0,0,0,0.1)] z-40 transform transition-transform duration-300 lg:hidden">
                <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                        <span className="font-bold text-[#1b0d0e] dark:text-white truncate max-w-[120px]">{product.name}</span>
                        <span className="text-sm text-primary font-bold">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAddToCart} className="h-10 px-4 rounded-full border border-gray-300 dark:border-white/20 font-bold text-[#1b0d0e] dark:text-white text-sm">Add</button>
                        <button onClick={handleBuyNow} className="h-10 px-6 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 text-sm flex items-center gap-1">Buy <span className="material-symbols-outlined text-sm">bolt</span></button>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
};