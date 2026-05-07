import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SiteLogoLink } from './SiteHeader';

export default function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <SiteLogoLink inverted />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-400">
              {t('footerTagline', 'Connecting homeowners with trusted, vetted professionals for every home service need. Book in minutes, relax while we handle it.')}
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-white tracking-wide">{t('footerColServices')}</div>
            <ul className="mt-6 space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">{t('catCleaning')}</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">{t('catPlumbing')}</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">{t('catElectrical')}</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">{t('catHvac')}</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white tracking-wide">{t('footerColCompany')}</div>
            <ul className="mt-6 space-y-3 text-sm text-slate-400">
              <li><a href="/#how-it-works" className="hover:text-blue-400 transition-colors">{t('navHowItWorks')}</a></li>
              <li><a href="/#providers" className="hover:text-blue-400 transition-colors">{t('navProviders')}</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white tracking-wide">Support</div>
            <ul className="mt-6 space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Safety</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Cancellation Policy</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white tracking-wide">{t('footerColProviders')}</div>
            <ul className="mt-6 space-y-3 text-sm text-slate-400">
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">{t('joinAsProvider')}</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">{t('signIn')}</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Provider App</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {t('brand')}. {t('footerRights', 'All rights reserved.')}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
