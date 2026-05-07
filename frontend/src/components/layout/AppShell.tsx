import { Link, NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../state/auth';
import Button from '../ui/Button';
import { SiteLogoLink, LanguageDropdown, DarkModeToggle } from './SiteHeader';
import AppAssistant from '../assistant/AppAssistant';
import { useNotificationPoller } from '../../hooks/useNotificationPoller';
import HowItWorksModal from '../guide/HowItWorksModal';

export default function AppShell({
  role,
  onSwitchLang,
}: {
  role: 'client' | 'provider' | 'admin';
  onSwitchLang: (lng: 'en' | 'fr' | 'ar') => void;
}) {
  const { t } = useTranslation();
  const { auth, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const { unreadCount } = useNotificationPoller(role);

  const nav =
    role === 'client'
      ? [
          { to: '/client', label: t('dashboard') },
          { to: '/client/services', label: t('services') },
          { to: '/client/bookings', label: t('bookings') },
          { to: '/client/notifications', label: t('notifications') },
          { to: '/client/profile', label: t('profile') },
        ]
      : role === 'provider'
        ? [
            { to: '/provider', label: t('dashboard') },
            { to: '/provider/services', label: t('services') },
            { to: '/provider/bookings', label: t('bookings') },
            { to: '/provider/notifications', label: t('notifications') },
            { to: '/provider/profile', label: t('profile') },
          ]
        : [
            { to: '/admin', label: t('dashboard') },
            { to: '/admin/users', label: t('users') },
            { to: '/admin/services', label: t('services') },
            { to: '/admin/bookings', label: t('bookings') },
            { to: '/admin/reviews', label: t('reviews') },
            { to: '/admin/profile', label: t('profile') },
          ];

  const homeForRole =
    role === 'provider' ? '/provider' : role === 'admin' ? '/admin' : '/client';

  return (
    <div className="min-h-screen font-sans selection:bg-emerald-500 selection:text-white bg-mesh transition-colors">
      <header className="sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-2xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>

          <SiteLogoLink to={homeForRole} />
          
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setHowItWorksOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              title={t('howItWorks', 'Guide')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            <Link to={role === 'client' ? '/client/notifications' : role === 'provider' ? '/provider/notifications' : '/admin/notifications'} className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm outline outline-2 outline-white dark:outline-slate-900">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <DarkModeToggle />
            <LanguageDropdown onSwitchLang={onSwitchLang} />
            
            <div className="hidden items-center gap-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 sm:flex shadow-sm">
              <span className="font-extrabold text-slate-900 dark:text-white">{auth?.user.name}</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="font-medium text-slate-500 dark:text-slate-400">{role === 'provider' ? t('provider') : role === 'admin' ? t('administrator') : t('client')}</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                {auth?.user.wallet_balance} {t('mad')}
              </span>
            </div>
            <Button variant="ghost" className="hidden sm:flex rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold" onClick={() => void logout()}>
              {t('logout')}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className={`h-fit rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 shadow-card sticky top-24 z-30 transition-all duration-300 lg:block ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="sm:hidden mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-extrabold text-slate-900 dark:text-white">{auth?.user.name}</span>
              <span className="font-medium">{role === 'provider' ? t('provider') : role === 'admin' ? t('administrator') : t('client')}</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {auth?.user.wallet_balance} {t('mad')}
              </span>
            </div>
          </div>
          <nav className="flex flex-col gap-1.5">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 translate-x-1'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.label === t('notifications') && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
              </NavLink>
            ))}
            <div className="sm:hidden pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => void logout()}
                className="w-full text-left rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                {t('logout')}
              </button>
            </div>
          </nav>
        </aside>

        <main className="min-w-0 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-card">
          <Outlet />
        </main>
      </div>
      <AppAssistant role={role} />
      <HowItWorksModal open={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} role={role} />
    </div>
  );
}

