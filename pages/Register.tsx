import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants';

export const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-white dark:bg-background-dark text-slate-900 dark:text-white">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12">
        <div className="mb-10">
            <Link to="/" className="flex items-center gap-2 mb-8 w-fit">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white">
                <span className="material-symbols-outlined text-xl">sprint</span>
                </div>
                <span className="text-lg font-bold tracking-tight">Yapee</span>
            </Link>
            <h1 className="text-4xl font-black tracking-tight mb-2">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400">Join the club and get 15% off your first order.</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); navigate('/profile'); }}>
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold ml-1">Full Name</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">person</span>
                    <input className="w-full h-12 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" type="text" placeholder="Alex Doe" />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold ml-1">Email Address</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">mail</span>
                    <input className="w-full h-12 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" type="email" placeholder="Enter your email" />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold ml-1">Password</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">lock</span>
                    <input className="w-full h-12 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" type="password" placeholder="Create a password" />
                </div>
            </div>

            <div className="flex items-start gap-2 mt-2">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" id="terms" />
                <label htmlFor="terms" className="text-sm text-gray-500 dark:text-gray-400">
                    I agree to the <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
                </label>
            </div>

            <button className="h-12 bg-primary hover:bg-primary-hover text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all mt-2">Sign Up</button>
        </form>

        <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
            Already have an account? <Link to="/login" className="text-slate-900 dark:text-white font-bold hover:underline">Sign in</Link>
        </p>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block w-1/2 relative bg-surface-light dark:bg-surface-dark overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('${IMAGES.PDP_MAIN}')`}}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-12 text-white">
            <h2 className="text-4xl font-black mb-4">Run The World.</h2>
            <p className="text-lg text-white/80 max-w-md">Experience the ultimate comfort and performance with our latest technology.</p>
        </div>
      </div>
    </div>
  );
};