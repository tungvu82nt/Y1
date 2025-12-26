import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { IMAGES } from '../constants';
import { useProducts } from '../contexts/ProductContext';
import { useLanguage } from '../contexts/LanguageContext';
import { HeroSection } from '../components/HeroSection';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const { products, loading } = useProducts();
  const { t } = useLanguage();
  
  if (loading) {
    return (
        <Layout>
            <div className="flex h-96 w-full items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        </Layout>
    );
  }

  // Dynamic slices based on context products
  // Ensure we have products before slicing, or fallback to empty arrays
  const flashSaleItems = products.length > 0 ? products.slice(0, 4) : []; 
  const trendingItems = products.length > 4 ? products.slice(4, 7) : []; 

  return (
    <Layout>
      <HeroSection />

      {/* Brands */}
      <div className="w-full overflow-hidden border-y border-gray-100 bg-white py-6 dark:border-gray-800 dark:bg-background-dark">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-8 opacity-60 grayscale md:justify-around">
              <span className="text-xl font-bold italic tracking-tighter">NIKE</span>
              <span className="text-xl font-bold tracking-widest">ADIDAS</span>
              <span className="text-xl font-black">PUMA</span>
              <span className="text-xl font-bold tracking-tight">Reebok</span>
              <span className="text-xl font-bold uppercase">New Balance</span>
          </div>
      </div>

      {/* Flash Sale */}
      <section className="py-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                      <div className="mb-2 flex items-center gap-2 text-primary">
                          <span className="material-symbols-outlined animate-pulse">bolt</span>
                          <span className="text-sm font-bold uppercase tracking-wider">{t('home.dont_miss')}</span>
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('home.flash_sale')}</h2>
                  </div>
                  <div className="flex items-center gap-3 rounded-full bg-surface-light px-4 py-2 dark:bg-surface-dark">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('home.ends_in')}</span>
                      <div className="flex gap-1 font-mono text-base font-bold text-primary">
                          <span className="rounded bg-white px-1.5 py-0.5 shadow-sm dark:bg-black">02</span>:
                          <span className="rounded bg-white px-1.5 py-0.5 shadow-sm dark:bg-black">45</span>:
                          <span className="rounded bg-white px-1.5 py-0.5 shadow-sm dark:bg-black">12</span>
                      </div>
                  </div>
              </div>
              <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-8 pt-2 sm:mx-0 sm:px-0 snap-x">
                  {flashSaleItems.map((item) => (
                      <ProductCard key={item.id} product={item} variant="standard" />
                  ))}
                  <Link to="/search" className="snap-center flex w-32 min-w-[128px] flex-col items-center justify-center gap-2 rounded-2xl bg-surface-light text-slate-600 transition-colors hover:bg-gray-200 dark:bg-surface-dark dark:text-slate-300 dark:hover:bg-gray-700">
                      <span className="material-symbols-outlined rounded-full bg-white p-2 text-2xl shadow-sm dark:bg-black">arrow_forward</span>
                      <span className="text-sm font-bold">{t('common.viewAll')}</span>
                  </Link>
              </div>
          </div>
      </section>

      {/* Banner */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-black px-6 py-10 dark:bg-white md:px-12 md:py-16">
              <div className="relative z-10 flex flex-col items-center text-center">
                  <h2 className="mb-4 text-3xl font-black uppercase italic tracking-tighter text-white dark:text-black md:text-5xl">{t('home.urban_legends')}</h2>
                  <p className="mb-8 max-w-lg text-gray-300 dark:text-gray-600">{t('home.urban_desc')}</p>
                  <Link to="/search" className="rounded-full bg-white px-8 py-3 text-sm font-bold uppercase tracking-wider text-black hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-gray-900">
                      {t('home.explore')}
                  </Link>
              </div>
              <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay" style={{backgroundImage: `url('${IMAGES.BANNER_URBAN}')`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
          </div>
      </section>

      {/* Trending */}
      <section className="py-12 bg-surface-light dark:bg-surface-dark/50">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between">
                  <div>
                      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('home.trending')}</h2>
                      <p className="mt-1 text-slate-500 dark:text-slate-400">{t('home.trending_sub')}</p>
                  </div>
              </div>
              <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
                  {trendingItems.map((item) => (
                      <ProductCard key={item.id} product={item} variant="compact" />
                  ))}
              </div>
          </div>
      </section>
    </Layout>
  );
};