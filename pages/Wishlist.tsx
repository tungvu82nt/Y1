import React from 'react';
import { Layout } from '../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import { ProductCard } from '../components/ProductCard';

export const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();

  const handleAddToCart = (product: any) => {
      addToCart(product, '9', 'Black'); // Defaulting size/color for quick add
      navigate('/cart');
  };

  const moveAllToCart = () => {
      wishlist.forEach(p => addToCart(p, '9', 'Black'));
      navigate('/cart');
  };

  // Get some recommendations (excluding items already in wishlist)
  const recommendations = products
    .filter(p => !wishlist.find(w => w.id === p.id))
    .slice(0, 4);

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
          <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
             <Link to="/" className="text-gray-500 hover:text-primary transition-colors">Home</Link>
             <span className="text-gray-300">/</span>
             <Link to="/profile" className="text-gray-500 hover:text-primary transition-colors">Account</Link>
             <span className="text-gray-300">/</span>
             <span className="text-primary font-medium">Wishlist</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="flex flex-col gap-2">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Your Wishlist</h1>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">{wishlist.length} items saved for later</p>
              </div>
              {wishlist.length > 0 && (
                  <button onClick={moveAllToCart} className="hidden md:flex items-center justify-center h-12 px-6 rounded-full bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-slate-900 text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">Move all to Cart</button>
              )}
          </div>

          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {wishlist.map((product, i) => (
                    <div key={i} className="group relative flex flex-col bg-surface-light dark:bg-[#1a0f0f] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                removeFromWishlist(product.id);
                            }}
                            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm text-primary hover:bg-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px] icon-fill">favorite</span>
                        </button>
                        <Link to={`/product/${product.id}`} className="relative w-full aspect-[4/5] bg-gray-100 dark:bg-gray-800 overflow-hidden block">
                            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: `url('${product.image}')`}}></div>
                            {product.tags?.includes('limited') && <div className="absolute bottom-3 left-3"><span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-primary shadow-sm backdrop-blur-sm">Low Stock</span></div>}
                        </Link>
                        <div className="p-4 flex flex-col flex-1 gap-2">
                            <div>
                                <Link to={`/product/${product.id}`} className="text-lg font-bold text-slate-900 dark:text-white leading-tight hover:text-primary transition-colors">{product.name}</Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                            </div>
                            <div className="mt-2 mb-4">
                                <span className="text-lg font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                            </div>
                            <button onClick={() => handleAddToCart(product)} className="mt-auto w-full h-11 flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-all shadow-md shadow-primary/20">
                                <span className="material-symbols-outlined text-[18px]">shopping_bag</span> Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center py-20 bg-surface-light dark:bg-surface-dark/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">favorite_border</span>
                <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-6">Save items you love to buy later.</p>
                <Link to="/search" className="px-6 py-3 bg-primary text-white rounded-full font-bold">Start Shopping</Link>
            </div>
          )}

           <div className="mt-16 border-t border-gray-100 dark:border-gray-800 pt-10">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">You might also like</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {recommendations.map((product, i) => (
                        <ProductCard key={i} product={product} variant="compact" />
                    ))}
                </div>
            </div>
      </div>
    </Layout>
  );
};