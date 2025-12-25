import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem('shoestore_compare');
    if (stored) {
      setCompareList(JSON.parse(stored));
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('shoestore_compare', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product: Product) => {
    setCompareList(prev => {
      // Limit to 3 items for optimal UI
      if (prev.length >= 3) {
          // Remove the first one and add the new one (FIFO) or just alert? 
          // Let's replace the oldest one to keep flow smooth or just return if we want to be strict.
          // For better UX, let's keep latest 3.
          const newList = [...prev.slice(1), product];
          return newList;
      }
      if (!prev.find(item => item.id === product.id)) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(item => item.id !== productId));
  };

  const isInCompare = (productId: string) => {
    return compareList.some(item => item.id === productId);
  };

  const clearCompare = () => {
      setCompareList([]);
  }

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};