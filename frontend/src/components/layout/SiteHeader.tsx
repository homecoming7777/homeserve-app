import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../state/auth';
import Button from '../ui/Button';
import { useDarkMode } from '../../hooks/useDarkMode';

function LogoMark({ className = '', inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${inverted ? 'bg-white/15' : 'bg-blue-800'} ${className}`}
    >
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    </div>
  );
}

export function SiteLogoLink({ to = '/', inverted = false }: { to?: string; inverted?: boolean }) {
  const { t } = useTranslation();
  return (
    <Link to={to} className="flex items-center gap-3 group">
      <LogoMark inverted={inverted} className="transition-transform group-hover:scale-105 duration-200" />
      <span className={`text-xl font-extrabold tracking-tight ${inverted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{t('brand')}</span>
    </Link>
  );
}

type SiteHeaderProps = {
  onSwitchLang: (lng: 'en' | 'fr' | 'ar') => void;
};

export function LanguageDropdown({ onSwitchLang }: { onSwitchLang: (lng: 'en' | 'fr' | 'ar') => void }) {
  const { i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const langLabel =
    i18n.language === 'fr' ? 'FR' : i18n.language === 'ar' ? 'AR' : 'EN';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setLangOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow"
      >
        <svg className="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{langLabel}</span>
        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {langOpen ? (
        <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 shadow-card animate-in fade-in slide-in-from-top-2 duration-200">
          {(['en', 'fr', 'ar'] as const).map((lng) => (
            <button
              key={lng}
              type="button"
              className="block w-full px-4 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors"
              onClick={() => {
                onSwitchLang(lng);
                setLangOpen(false);
              }}
            >
              {lng === 'en' ? 'English' : lng === 'fr' ? 'Français' : 'العربية'}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      )}
    </button>
  );
}

export default function SiteHeader({ onSwitchLang }: SiteHeaderProps) {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardPath =
    auth?.user.role === 'provider' ? '/provider' : auth?.user.role === 'admin' ? '/admin' : '/client';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-screen-xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <SiteLogoLink />

        <nav className="hidden flex-1 justify-center gap-8 md:flex">
          <a href="/#categories" className="text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:text-blue-600 dark:hover:text-blue-400">
            {t('services')}
          </a>
          <a href="/#how-it-works" className="text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:text-blue-600 dark:hover:text-blue-400">
            {t('navHowItWorks')}
          </a>
          <a href="/#providers" className="text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:text-blue-600 dark:hover:text-blue-400">
            {t('navProviders')}
          </a>
          <a href="/#pricing" className="text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:text-blue-600 dark:hover:text-blue-400">
            {t('navPricing')}
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <DarkModeToggle />
          <LanguageDropdown onSwitchLang={onSwitchLang} />

          {auth ? (
            <Link to={dashboardPath} className="hidden sm:block">
              <Button className="px-6">{t('dashboard')}</Button>
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" className="px-4 py-2 font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  {t('signIn')}
                </Button>
              </Link>
              <Link to="/register">
                <Button className="px-6 shadow-md shadow-blue-800/20">
                  {t('getStarted')}
                </Button>
              </Link>
            </div>
          )}
          
          <button 
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4">
          <nav className="flex flex-col gap-4">
            <a href="/#categories" className="text-base font-semibold text-slate-700 dark:text-slate-300" onClick={() => setMobileMenuOpen(false)}>{t('services')}</a>
            <a href="/#how-it-works" className="text-base font-semibold text-slate-700 dark:text-slate-300" onClick={() => setMobileMenuOpen(false)}>{t('navHowItWorks')}</a>
            <a href="/#providers" className="text-base font-semibold text-slate-700 dark:text-slate-300" onClick={() => setMobileMenuOpen(false)}>{t('navProviders')}</a>
            <a href="/#pricing" className="text-base font-semibold text-slate-700 dark:text-slate-300" onClick={() => setMobileMenuOpen(false)}>{t('navPricing')}</a>
          </nav>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            {auth ? (
              <Link to={dashboardPath} onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">{t('dashboard')}</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center text-slate-700 dark:text-slate-300">{t('signIn')}</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-center">{t('getStarted')}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export { LogoMark };

