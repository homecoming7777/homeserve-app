import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../state/auth';
import { getAuth } from '../../lib/storage';
import { SiteLogoLink } from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';

const roleHome: Record<'client' | 'provider' | 'admin', string> = {
  client: '/client',
  provider: '/provider',
  admin: '/admin',
};

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const [email, setEmail] = useState('client@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const onSwitchLang = (lng: 'en' | 'fr' | 'ar') => {
    i18n.changeLanguage(lng).catch(() => toast.error('Failed to switch language'));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success(t('loggedIn'));
      const role = getAuth()?.user.role;
      navigate(location.state?.from || (role ? roleHome[role] : '/'), { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      <div className="absolute top-0 left-0 right-0 h-96 bg-blue-900 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"></div>
      </div>
      
      <header className="relative z-10 mx-auto w-full max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <SiteLogoLink inverted />
        <div className="flex gap-4">
          {(['en', 'fr', 'ar'] as const).map((lng) => (
            <button
              key={lng}
              onClick={() => onSwitchLang(lng)}
              className={`text-sm font-medium ${i18n.language === lng ? 'text-white' : 'text-white/60 hover:text-white'} transition-colors`}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center px-4 py-12 relative z-10">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('login')}</h1>
            <p className="mt-3 text-sm text-blue-100/90 font-medium">{t('useEmailPassword')}</p>
          </div>

          <Card className="border-0 shadow-2xl shadow-blue-900/10 p-8 sm:p-10 rounded-3xl">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('email')}</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('password')}</label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="w-full py-4 text-base shadow-lg shadow-blue-600/20" disabled={loading}>
                  {loading ? '...' : t('login')}
                </Button>
              </div>
              
              <p className="text-center text-sm font-medium text-slate-500 pt-4 border-t border-slate-100">
                {t('noAccount')}{' '}
                <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  {t('register')}
                </Link>
              </p>
            </form>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

