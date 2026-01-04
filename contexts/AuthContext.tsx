import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../utils/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage on load for persistence session
    const storedUser = localStorage.getItem('yapee_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data;
      if (userData) {
        setUser(userData as User);
        localStorage.setItem('yapee_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Check server connection.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('yapee_user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    try {
      // Optimistic update
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('yapee_user', JSON.stringify(updatedUser));

      // Sync with backend (assuming id exists on user object from DB)
      // await api.put('/auth/profile', { id: (user as any).id, ...data });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin: user?.role === 'ADMIN', isLoading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};