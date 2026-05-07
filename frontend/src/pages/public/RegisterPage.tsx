import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../state/auth';
import { SiteLogoLink } from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('New User');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'client' | 'provider'>('client');
  const [phone, setPhone] = useState('+212612345678');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const onSwitchLang = (lng: 'en' | 'fr' | 'ar') => {
    i18n.changeLanguage(lng).catch(() => toast.error('Failed to switch language'));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password, role, phone, address: address || undefined });
      toast.success(t('accountCreated'));
      navigate(role === 'provider' ? '/provider' : '/client', { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message || t('registerFailed');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10';
  const labelClass = 'block text-sm font-bold text-slate-700 mb-2';

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
        <div className="mx-auto w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('register')}</h1>
            <p className="mt-3 text-sm text-blue-100/90 font-medium">{t('chooseRole')}</p>
          </div>

          <Card className="border-0 shadow-2xl shadow-blue-900/10 p-8 sm:p-10 rounded-3xl">
            <form onSubmit={onSubmit} className="space-y-6">
              
              {/* Role Selection Tabs */}
              <div>
                <label className={labelClass}>{t('role')}</label>
                <div className="flex p-1 rounded-xl bg-slate-100/80 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                      role === 'client' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t('client')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('provider')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                      role === 'provider' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t('provider')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>{t('titleCaseName')}</label>
                  <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                </div>
                <div>
                  <label className={labelClass}>{t('email')}</label>
                  <input className={fieldClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label className={labelClass}>{t('password')}</label>
                <input type="password" className={fieldClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>{t('phone')} <span className="text-slate-400 font-normal">(Morocco)</span></label>
                  <input className={fieldClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+212612345678" />
                </div>
                <div>
                  <label className={labelClass}>{t('address')}</label>
                  <input className={fieldClass} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City, Area" />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full py-4 text-base shadow-lg shadow-blue-600/20" disabled={loading}>
                  {loading ? '...' : t('register')}
                </Button>
              </div>

              <p className="text-center text-sm font-medium text-slate-500 pt-4 border-t border-slate-100">
                {t('alreadyHaveAccount')}{' '}
                <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  {t('login')}
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

