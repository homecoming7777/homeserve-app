import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../LanguageSwitcher';
import { useLanguage } from '../../contexts/LanguageContext';

const Sidebar = ({ role }) => {
  const { t } = useLanguage();
  const { logout } = useAuth();
  
  const clientLinks = [
    { to: '/dashboard', label: t('dashboard'), icon: '📊' },
    { to: '/browse-services', label: t('browse_services'), icon: '🔍' },
    { to: '/my-bookings', label: t('my_bookings'), icon: '📅' },
    { to: '/notifications', label: t('notifications'), icon: '🔔' },
    { to: '/profile-settings', label: t('profile'), icon: '👤' },
  ];
  
  const providerLinks = [
    { to: '/provider/dashboard', label: t('dashboard'), icon: '📈' },
    { to: '/provider/my-services', label: t('my_services'), icon: '🛠️' },
    { to: '/provider/bookings', label: t('provider_bookings'), icon: '📋' },
    { to: '/provider/notifications', label: t('notifications'), icon: '🔔' },
    { to: '/provider/profile-settings', label: t('profile'), icon: '👤' },
  ];
  
  const adminLinks = [
    { to: '/admin/dashboard', label: t('dashboard'), icon: '📊' },
    { to: '/admin/categories', label: t('manage_categories'), icon: '📁' },
    { to: '/admin/users', label: t('manage_users'), icon: '👥' },
    { to: '/admin/settings', label: t('settings'), icon: '⚙️' },
    { to: '/profile-settings', label: t('profile'), icon: '👤' },
  ];
  
  let links;
  if (role === 'client') {
    links = clientLinks;
  } else if (role === 'provider') {
    links = providerLinks;
  } else if (role === 'admin') {
    links = adminLinks;
  } else {
    links = []; // fallback
  }

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-4 text-2xl font-bold text-blue-700 border-b">{t('app_name')}</div>
      <div className="p-4 border-b"><LanguageSwitcher /></div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button onClick={logout} className="w-full text-left text-red-600 hover:bg-red-50 px-4 py-2 rounded">🚪 {t('logout')}</button>
      </div>
    </aside>
  );
};

export default Sidebar;