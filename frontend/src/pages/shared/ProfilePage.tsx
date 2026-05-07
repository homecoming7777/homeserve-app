import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../state/auth';
import * as authApi from '../../api/auth';
import Badge from '../../components/ui/Badge';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { auth, setAuthDirect } = useAuth();
  const u = auth?.user;

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    setName(u?.name ?? '');
    setPhone(u?.phone ?? '');
    setAddress(u?.address ?? '');
    setAvatarUrl(u?.avatar_url ?? '');
    setBio(u?.bio ?? '');
  }, [u]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authApi.updateMe({
        name,
        phone,
        address: address || null,
        avatar_url: avatarUrl || null,
        bio: bio || null,
      });
      if (auth) {
        setAuthDirect({ ...auth, user: res.user });
      }
      toast.success(t('profileUpdated'));
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t('failedUpdateProfile'));
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";
  const labelClass = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('profile')}</h1>
        <p className="mt-2 text-base text-slate-500 font-medium">{t('accountDetails')}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr] items-start">
        <Card className="border-0 shadow-card bg-white p-8 rounded-3xl order-2 lg:order-1">
          <form className="space-y-6" onSubmit={onSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>{t('titleCaseName')}</label>
                <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>{t('phone')}</label>
                <input className={fieldClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            
            <div>
              <label className={labelClass}>{t('address')}</label>
              <input className={fieldClass} value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            
            <div>
              <label className={labelClass}>{t('avatarUrl')}</label>
              <input className={fieldClass} value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
            </div>
            
            <div>
              <label className={labelClass}>{t('bio')}</label>
              <textarea className={fieldClass} rows={5} value={bio} onChange={(e) => setBio(e.target.value)} placeholder={t('addShortProfessionalBio')} />
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" className="!py-3 !px-8 shadow-lg shadow-blue-600/20" disabled={saving}>
                {saving ? '...' : t('save')}
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6 order-1 lg:order-2">
          <Card className="border-0 shadow-card bg-white p-8 rounded-3xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-600 to-blue-800"></div>
            
            <div className="relative mt-8 mb-4">
              <img
                src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || u?.name || 'User')}&background=EFF6FF&color=1D4ED8`}
                alt={name || u?.name || 'User'}
                className="h-28 w-28 rounded-full border-4 border-white shadow-lg object-cover bg-white"
              />
              <div className="absolute bottom-0 right-0">
                <Badge tone="green" className="shadow-sm border-2 border-white px-2">✓</Badge>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-1">{name || u?.name}</h2>
            <p className="text-sm font-medium text-slate-500 mb-4">{u?.email}</p>
            
            <div className="w-full pt-4 border-t border-slate-100 flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-xs">{t('role')}</span>
                <Badge tone={u?.role === 'provider' ? 'blue' : 'slate'} className="capitalize font-bold">{u?.role}</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-xs">{t('walletBalance')}</span>
                <span className="font-extrabold text-slate-900">{u?.wallet_balance} {t('mad')}</span>
              </div>
            </div>
          </Card>
          
          {bio && (
            <Card className="border-0 shadow-card bg-white p-6 rounded-3xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t('bio')}</h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{bio}"</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
