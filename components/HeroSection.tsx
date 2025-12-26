import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { IMAGES } from '../constants';

export const HeroSection: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="@container overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark">
                <div className="flex flex-col-reverse gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
                    <div className="flex flex-col items-start gap-6 md:max-w-xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-promotion px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                            <span className="material-symbols-outlined text-sm">local_fire_department</span>
                            New Arrival
                        </div>
                        <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                            {t('home.hero_title')}<br /><span className="text-primary">{t('home.hero_subtitle')}</span>
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
                        <div className="relative z-10 h-full w-full bg-contain bg-center bg-no-repeat transition-transform hover:scale-105 duration-700" style={{ backgroundImage: `url('${IMAGES.HERO}')` }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
};
