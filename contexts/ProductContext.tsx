import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../utils/api';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../constants'; // Keep fallback for safety

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const data = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products from server, using fallback", error);
            setProducts(FALLBACK_PRODUCTS);
        } finally {
            setLoading(false);
        }
    };
    fetchProducts();
  }, []);

  const addProduct = async (product: Product) => {
    try {
        const savedProduct = await api.post('/products', product);
        setProducts(prev => [savedProduct, ...prev]);
    } catch (e) {
        console.error(e);
        // Optimistic update
        setProducts(prev => [product, ...prev]);
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    // In real app, send PUT request here
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    // In real app, send DELETE request here
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};