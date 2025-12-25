import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants';
import { useAuth } from '../contexts/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      login(email);
      if (email.includes('admin')) {
          navigate('/admin');
      } else {
          navigate('/profile');
      }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-background-dark text-slate-900 dark:text-white">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12">
        <div className="mb-10">
            <Link to="/" className="flex items-center gap-2 mb-8 w-fit">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white">
                <span className="material-symbols-outlined text-xl">sprint</span>
                </div>
                <span className="text-lg font-bold tracking-tight">ShoeSwift</span>
            </Link>
            <h1 className="text-4xl font-black tracking-tight mb-2">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400">Please enter your details to sign in.</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold ml-1">Email Address</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">mail</span>
                    <input 
                        className="w-full h-12 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                        type="email" 
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold ml-1">Password</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">lock</span>
                    <input 
                        className="w-full h-12 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                        type="password" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="flex justify-end mt-1">
                    <button type="button" className="text-sm font-bold text-primary hover:underline">Forgot Password?</button>
                </div>
            </div>

            <button type="submit" className="h-12 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:opacity-90 transition-opacity mt-2">Sign In</button>
        </form>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
            <p className="font-bold">Demo Credentials:</p>
            <p>Admin: <span className="font-mono">admin@shoeswift.com</span></p>
            <p>User: <span className="font-mono">alex@example.com</span></p>
        </div>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-800"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white dark:bg-background-dark text-gray-500">Or continue with</span></div>
        </div>

        <div className="flex gap-4">
            <button className="flex-1 h-12 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2 font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">g_mobiledata</span> Google
            </button>
            <button className="flex-1 h-12 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2 font-bold text-sm">
                 <span className="material-symbols-outlined text-[20px]">apple</span> Apple
            </button>
        </div>

        <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
            Don't have an account? <Link to="/register" className="text-slate-900 dark:text-white font-bold hover:underline">Sign up</Link>
        </p>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block w-1/2 relative bg-surface-light dark:bg-surface-dark overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('${IMAGES.BANNER_URBAN}')`}}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-12 text-white">
            <h2 className="text-4xl font-black mb-4">Step Into The Future.</h2>
            <p className="text-lg text-white/80 max-w-md">Join the exclusive community of sneakerheads and get access to limited drops.</p>
        </div>
      </div>
    </div>
  );
};