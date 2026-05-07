import { Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import toast, { Toaster } from 'react-hot-toast'; 
import HomePage from './pages/public/HomePage';

export default function App() {
  const { i18n } = useTranslation();

  const onSwitchLang = (lng: 'en' | 'fr' | 'ar') => {
    i18n.changeLanguage(lng).catch(() => toast.error('Failed to switch language'));
  };

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage onSwitchLang={onSwitchLang} />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
