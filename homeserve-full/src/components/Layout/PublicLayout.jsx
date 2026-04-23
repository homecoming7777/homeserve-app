import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../LanguageSwitcher';
import { useLanguage } from '../../contexts/LanguageContext';

const PublicLayout = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-700">{t('app_name')}</Link>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Link to="/" className="text-gray-700 hover:text-blue-700">{t('home')}</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-700">{t('about')}</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-700">{t('contact')}</Link>
          <LanguageSwitcher />
          {!user ? (
            <>
              <Link to="/login" className="text-blue-700 border border-blue-700 px-4 py-2 rounded">{t('login')}</Link>
              <Link to="/register" className="bg-blue-700 text-white px-4 py-2 rounded">{t('register')}</Link>
            </>
          ) : (
            <Link to={user.role === 'client' ? '/dashboard' : '/provider/dashboard'} className="bg-green-700 text-white px-4 py-2 rounded">{t('dashboard')}</Link>
          )}
        </div>
      </nav>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; 2025 {t('app_name')}. {t('all_rights_reserved')}</p>
      </footer>
    </div>
  );
};

export default PublicLayout;