import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <button onClick={() => changeLanguage('en')} className={`px-2 py-1 text-sm rounded ${language === 'en' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}`}>EN</button>
      <button onClick={() => changeLanguage('fr')} className={`px-2 py-1 text-sm rounded ${language === 'fr' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}`}>FR</button>
      <button onClick={() => changeLanguage('ar')} className={`px-2 py-1 text-sm rounded ${language === 'ar' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}`}>AR</button>
    </div>
  );
};

export default LanguageSwitcher;