import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { USER } from '../constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage on load
    const storedUser = localStorage.getItem('shoestore_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string) => {
    // Simulate API call
    // HARDCODED ADMIN FOR DEMO: admin@shoeswift.com
    let mockUser: User;
    
    if (email === 'admin@shoeswift.com') {
        mockUser = {
            name: 'System Admin',
            email: email,
            avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
            memberSince: '2020',
            location: 'HQ',
            isVip: true,
            role: 'admin'
        };
    } else {
        mockUser = { 
            ...USER, 
            email: email,
            name: email.split('@')[0] || USER.name,
            role: 'customer'
        };
    }
    
    setUser(mockUser);
    localStorage.setItem('shoestore_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shoestore_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin: user?.role === 'admin', login, logout }}>
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