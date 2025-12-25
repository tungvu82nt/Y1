import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { USER } from '../constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage on load
    const storedUser = localStorage.getItem('yapee_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string) => {
    // Simulate API call
    // HARDCODED ADMIN FOR DEMO: admin@yapee.com
    let mockUser: User;
    
    if (email === 'admin@yapee.com') {
        mockUser = {
            name: 'System Admin',
            email: email,
            avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
            memberSince: '2020',
            location: 'HQ',
            isVip: true,
            role: 'admin',
            phone: '+1 (555) 000-0000'
        };
    } else {
        mockUser = { 
            ...USER, 
            email: email,
            name: email.split('@')[0] || USER.name,
            role: 'customer',
            phone: '+1 (555) 123-4567'
        };
    }
    
    setUser(mockUser);
    localStorage.setItem('yapee_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('yapee_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('yapee_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin: user?.role === 'admin', login, logout, updateProfile }}>
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