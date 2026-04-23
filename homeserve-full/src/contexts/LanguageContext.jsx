import { createContext, useContext, useState, useEffect } from 'react';
import { i18nService } from '../services/i18nService';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18nService.getCurrentLanguage());

  // Listen for language changes from any source
  useEffect(() => {
    const handleStorageChange = () => {
      setLanguage(i18nService.getCurrentLanguage());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languagechange', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languagechange', handleStorageChange);
    };
  }, []);

  const changeLanguage = (lang) => {
    i18nService.setLanguage(lang);
    setLanguage(lang); // immediately update state for this component tree
    window.dispatchEvent(new Event('languagechange'));
    // Force re-render of all components using this context
  };

  const t = (key) => i18nService.t(key);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};