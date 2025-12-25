import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

export const NotFound = () => {
  const { t } = useLanguage();
  return (
    <Layout noFooter>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-[150px] md:text-[200px] font-black leading-none text-slate-100 dark:text-white/5 select-none">404</h1>
        <div className="absolute flex flex-col items-center gap-6">
            <div className="bg-primary/10 p-6 rounded-full text-primary mb-2">
                <span className="material-symbols-outlined text-6xl">do_not_step</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{t('error.lost_footing')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md">
                {t('error.page_not_found')}
            </p>
            <Link to="/" className="h-12 px-8 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                {t('common.back_home')} <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
        </div>
      </div>
    </Layout>
  );
};