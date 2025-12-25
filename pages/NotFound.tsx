import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

export const NotFound = () => {
  return (
    <Layout noFooter>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-[150px] md:text-[200px] font-black leading-none text-slate-100 dark:text-white/5 select-none">404</h1>
        <div className="absolute flex flex-col items-center gap-6">
            <div className="bg-primary/10 p-6 rounded-full text-primary mb-2">
                <span className="material-symbols-outlined text-6xl">do_not_step</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Lost your footing?</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md">
                The page you are looking for seems to have run away. Let's get you back on track.
            </p>
            <Link to="/" className="h-12 px-8 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                Back to Home <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
        </div>
      </div>
    </Layout>
  );
};