import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency } from '../types';

interface CurrencyContextType {
  currencies: Currency[];
  currentCurrency: Currency;
  setCurrentCurrency: (currency: Currency) => void;
  convertPrice: (price: number) => number;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const DEFAULT_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1, flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.50, flag: '🇯🇵' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', rate: 24350, flag: '🇻🇳' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.24, flag: '🇨🇳' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', rate: 1320, flag: '🇰🇷' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.34, flag: '🇸🇬' },
];

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencies, setCurrencies] = useState<Currency[]>(DEFAULT_CURRENCIES);
  const [currentCurrency, setCurrentCurrencyState] = useState<Currency>(DEFAULT_CURRENCIES[0]);

  useEffect(() => {
    const storedCurrency = localStorage.getItem('yapee_currency');
    const storedCurrencies = localStorage.getItem('yapee_currencies');

    if (storedCurrency) {
      const currency = JSON.parse(storedCurrency);
      setCurrentCurrencyState(currency);
    }

    if (storedCurrencies) {
      setCurrencies(JSON.parse(storedCurrencies));
    }
  }, []);

  const setCurrentCurrency = (currency: Currency) => {
    setCurrentCurrencyState(currency);
    localStorage.setItem('yapee_currency', JSON.stringify(currency));
  };

  const convertPrice = (price: number): number => {
    return price * currentCurrency.rate;
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    
    if (currentCurrency.code === 'VND') {
      return `${convertedPrice.toLocaleString('vi-VN')} ${currentCurrency.symbol}`;
    }
    
    if (currentCurrency.code === 'JPY' || currentCurrency.code === 'KRW') {
      return `${currentCurrency.symbol}${Math.floor(convertedPrice).toLocaleString()}`;
    }
    
    return `${currentCurrency.symbol}${convertedPrice.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ 
      currencies, 
      currentCurrency, 
      setCurrentCurrency, 
      convertPrice,
      formatPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
