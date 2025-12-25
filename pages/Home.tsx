import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { IMAGES } from '../constants';
import { useProducts } from '../contexts/ProductContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Home = () => {
  const { products } = useProducts();
  const { t } = useLanguage();
  
  // Dynamic slices based on context products
  const flashSaleItems = products.slice(1, 5); 
  const trendingItems = products.slice(5, 8); 

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="@container overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark">
            <div className="flex flex-col-reverse gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
                <div className="flex flex-col items-start gap-6 md:max-w-xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-promotion px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                        <span className="material-symbols-outlined text-sm">local_fire_department</span>
                        New Arrival
                    </div>
                    <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                        {t('home.hero_title')}<br/><span className="text-primary">{t('home.hero_subtitle')}</span>
                    </h1>
                    <p className="max-w-md text-base text-slate-600 dark:text-slate-300 sm:text-lg">
                        {t('home.hero_desc')}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Link to="/product/1" className="group relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 text-base font-bold text-white transition-transform active:scale-95">
                            <span>{t('home.shop_collection')}</span>
                            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </Link>
                        <button className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-slate-200 px-8 text-base font-bold text-slate-900 transition-colors hover:border-slate-300 dark:border-slate-600 dark:text-white dark:hover:border-slate-500">
                            {t('home.view_video')}
                        </button>
                    </div>
                </div>
                <div className="relative flex h-64 w-full items-center justify-center sm:h-80 md:h-96 md:w-1/2">
                    <div className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 translate-x-10 rounded-full bg-gradient-to-tr from-primary/20 to-promotion/30 blur-3xl dark:from-primary/10 dark:to-promotion/10"></div>
                    <div className="relative z-10 h-full w-full bg-contain bg-center bg-no-repeat transition-transform hover:scale-105 duration-700" style={{backgroundImage: `url('${IMAGES.HERO}')`}}></div>
                </div>
            </div>
        </div>
      </section>

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
                  {flashSaleItems.map((item, i) => (
                      <Link key={i} to={`/product/${item.id}`} className="snap-center group relative flex w-64 min-w-[256px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-lg dark:bg-surface-dark dark:ring-gray-800">
                          <div className="absolute left-3 top-3 z-10 rounded-full bg-promotion px-2 py-1 text-[10px] font-bold text-black">{item.discount}</div>
                          <div className="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-800">
                              <div className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage: `url('${item.image}')`}}></div>
                          </div>
                          <div className="flex flex-1 flex-col p-4">
                              <h3 className="line-clamp-1 text-lg font-bold text-slate-900 dark:text-white">{item.name}</h3>
                              <p className="text-sm text-slate-500">{item.category}</p>
                              <div className="mt-4 flex items-center justify-between">
                                  <div className="flex flex-col">
                                      <span className="text-xs text-slate-400 line-through">${item.originalPrice?.toFixed(2)}</span>
                                      <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                                  </div>
                                  <button className="flex size-10 items-center justify-center rounded-full bg-primary text-white transition-transform active:scale-95">
                                      <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                                  </button>
                              </div>
                          </div>
                      </Link>
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
                  {trendingItems.map((item, i) => (
                      <Link key={i} to={`/product/${item.id}`} className="flex w-72 min-w-[288px] flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark">
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                              <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-slate-900 backdrop-blur-sm dark:bg-black/80 dark:text-white">
                                  <span className="material-symbols-outlined text-[14px] text-yellow-400 icon-fill">star</span>{item.rating}
                              </div>
                              <div className="h-full w-full bg-cover bg-center hover:scale-105 transition-transform duration-300" style={{backgroundImage: `url('${item.image}')`}}></div>
                          </div>
                          <div className="px-1 pb-1">
                              <h3 className="font-bold text-slate-900 dark:text-white">{item.name}</h3>
                              <p className="text-sm text-slate-500">{item.category}</p>
                              <div className="mt-2 flex items-center justify-between">
                                  <span className="text-base font-bold text-slate-900 dark:text-white">${item.price.toFixed(2)}</span>
                                  <button className="text-primary hover:text-red-700 text-sm font-bold flex items-center gap-1">{t('common.addToCart')} <span className="material-symbols-outlined text-sm">add</span></button>
                              </div>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </section>
    </Layout>
  );
};