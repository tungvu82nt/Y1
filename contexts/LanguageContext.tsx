import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../utils/translations';

// Define a recursive type for nested translation objects
type TranslationValue = string | { [key: string]: TranslationValue };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('yapee_lang') as Language;
    if (storedLang && ['en', 'vi', 'zh'].includes(storedLang)) {
      setLanguage(storedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('yapee_lang', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    
    const findTranslation = (lang: Language): string => {
      let current: TranslationValue = translations[lang];
      for (const k of keys) {
        if (typeof current === 'object' && current !== null && k in current) {
          current = current[k];
        } else {
          return ''; // Not found
        }
      }
      return typeof current === 'string' ? current : '';
    };

    let translation = findTranslation(language);

    if (!translation && language !== 'en') {
      translation = findTranslation('en');
    }

    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};