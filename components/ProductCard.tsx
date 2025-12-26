import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface ProductCardProps {
  product: Product;
  variant?: 'standard' | 'compact' | 'grid';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'standard' }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, '9', 'Black'); // Defaulting size/color for quick add
    showToast(`${t('product.added_cart')}`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isLiked) {
        showToast(`${t('product.added_wishlist')}`);
    } else {
        showToast('Removed from wishlist', 'info');
    }
  };

  if (variant === 'grid') {
    return (
        <Link to={`/product/${product.id}`} className="group relative flex flex-col bg-white dark:bg-white/5 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-white/5">
                {product.tags && product.tags.includes('best-seller') && <span className="absolute top-3 left-3 z-10 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">{t('tags.best-seller')}</span>}
                {product.tags && product.tags.includes('new') && <span className="absolute top-3 left-3 z-10 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">{t('tags.new')}</span>}
                {product.discount && <span className="absolute top-3 left-3 z-10 bg-white text-primary border border-primary text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">{product.discount} OFF</span>}
                
                <button 
                    onClick={handleToggleWishlist}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-colors ${isLiked ? 'bg-white text-primary' : 'bg-white/50 text-slate-900 hover:bg-white'}`}
                >
                    <span className={`material-symbols-outlined text-[20px] ${isLiked ? 'icon-fill' : ''}`}>favorite</span>
                </button>
                <div className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{backgroundImage: `url('${product.image}')`}}></div>
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">{product.brand}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2">{product.name}</h3>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">{formatPrice(product.price)}</span>
                            {product.originalPrice && <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>}
                        </div>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-colors shadow-lg"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                </div>
            </div>
        </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/product/${product.id}`} className="flex w-72 min-w-[288px] flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
          <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-slate-900 backdrop-blur-sm dark:bg-black/80 dark:text-white">
            <span className="material-symbols-outlined text-[14px] text-yellow-400 icon-fill">star</span>{product.rating}
          </div>
          <div className="h-full w-full bg-cover bg-center hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url('${product.image}')` }}></div>
        </div>
        <div className="px-1 pb-1">
          <h3 className="font-bold text-slate-900 dark:text-white">{product.name}</h3>
          <p className="text-sm text-slate-500">{product.category}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-base font-bold text-slate-900 dark:text-white">{formatPrice(product.price)}</span>
            <button onClick={handleAddToCart} className="text-primary hover:text-red-700 text-sm font-bold flex items-center gap-1">
              {t('common.addToCart')} <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // Standard Variant (Flash Sale style)
  return (
    <Link to={`/product/${product.id}`} className="snap-center group relative flex w-64 min-w-[256px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-lg dark:bg-surface-dark dark:ring-gray-800">
      {product.discount && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-promotion px-2 py-1 text-[10px] font-bold text-black">{product.discount}</div>
      )}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-800">
        <div className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${product.image}')` }}></div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-lg font-bold text-slate-900 dark:text-white">{product.name}</h3>
        <p className="text-sm text-slate-500">{product.category}</p>
        <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col">
                {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
                )}
                <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            </div>
            <button onClick={handleAddToCart} className="flex size-10 items-center justify-center rounded-full bg-primary text-white transition-transform active:scale-95">
                <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
            </button>
        </div>
      </div>
    </Link>
  );
};

