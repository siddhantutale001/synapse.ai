import React, { createContext, useState, useContext } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (keyPath) => {
    const keys = keyPath.split('.');
    let current = translations[lang] || translations.en;
    for (const key of keys) {
      if (current[key] !== undefined) {
        current = current[key];
      } else {
        return keyPath;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
