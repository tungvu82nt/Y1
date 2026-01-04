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
        const response = await api.get<unknown>('/products');

        // Backend returns either:
        // - { data: Product[], pagination: {...} }
        // - or a wrapped shape { success, data }
        const topLevelData = (response as { data?: unknown }).data;

        let list: unknown = topLevelData;
        if (!Array.isArray(list) && list && typeof list === 'object') {
          const inner = (list as Record<string, unknown>).data;
          if (Array.isArray(inner)) {
            list = inner;
          }
        }

        setProducts(Array.isArray(list) ? (list as Product[]) : []);
      } catch (error) {
        console.error('Failed to load products from server, using fallback', error);
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
        console.error("Failed to add product", e);
        throw e;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
        const updated = await api.put(`/products/${id}`, updates);
        setProducts(prev => prev.map(p => p.id === id ? updated : p));
    } catch (e) {
        console.error("Failed to update product", e);
        alert("Failed to update product");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
        await api.delete(`/products/${id}`);
        setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
        console.error("Failed to delete product", e);
        alert("Failed to delete product");
    }
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