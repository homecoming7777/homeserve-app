import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import * as adminApi from '../../api/admin';

export default function AdminDashboard({ section = 'dashboard' }: { section?: 'dashboard' | 'users' | 'services' | 'bookings' | 'reviews' }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<adminApi.AdminStats | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        if (section === 'dashboard') {
          setStats(await adminApi.fetchAdminDashboard());
          setItems([]);
        } else if (section === 'users') {
          setItems(await adminApi.fetchAdminUsers());
        } else if (section === 'services') {
          setItems(await adminApi.fetchAdminServices());
        } else if (section === 'bookings') {
          setItems(await adminApi.fetchAdminBookings());
        } else if (section === 'reviews') {
          setItems(await adminApi.fetchAdminReviews());
        }
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [section]);

  const toggleService = async (id: number, next: boolean) => {
    await adminApi.setServiceAvailability(id, next);
    setItems((prev) => prev.map((row) => (row.id === id ? { ...row, is_available: next } : row)));
  };

  const changeUserRole = async (id: number, role: 'client' | 'provider' | 'admin') => {
    await adminApi.setUserRole(id, role);
    setItems((prev) => prev.map((row) => (row.id === id ? { ...row, role } : row)));
  };

  const toggleUserActive = async (id: number, next: boolean) => {
    await adminApi.setUserActive(id, next);
    setItems((prev) => prev.map((row) => (row.id === id ? { ...row, is_active: next } : row)));
  };

  const removeReview = async (id: number) => {
    await adminApi.deleteReview(id);
    setItems((prev) => prev.filter((row) => row.id !== id));
  };

  if (loading) return <div className="text-sm text-gray-600">{t('loading')}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">{t('adminPanel')}</h1>

      {section === 'dashboard' && stats && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {Object.entries(stats).map(([k, v]) => (
            <Card key={k} className="p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">{k}</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{v}</div>
            </Card>
          ))}
        </div>
      )}

      {section !== 'dashboard' && (
        <Card className="space-y-3">
          <div className="text-sm text-gray-600">{t('latestSection', { section })}</div>
          {items.map((row) => (
            <div key={row.id} className="rounded-xl border border-gray-200 p-3 text-sm">
              <div className="font-medium text-gray-900">{row.name || row.title || `Booking #${row.id}`}</div>
              <div className="mt-1 text-gray-600">{row.email || row.status || row.description || '—'}</div>
              {section === 'users' && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button variant="ghost" onClick={() => void changeUserRole(row.id, row.role === 'provider' ? 'client' : 'provider')}>
                    {row.role === 'provider' ? t('setClient') : t('setProvider')}
                  </Button>
                  <Button variant="ghost" onClick={() => void changeUserRole(row.id, 'admin')}>
                    {t('setAdmin')}
                  </Button>
                  <Button variant="ghost" onClick={() => void toggleUserActive(row.id, !row.is_active)}>
                    {row.is_active ? t('deactivate') : t('activate')}
                  </Button>
                </div>
              )}
              {section === 'services' && (
                <div className="mt-2">
                  <Button variant="ghost" onClick={() => void toggleService(row.id, !row.is_available)}>
                    {t('markAs')} {row.is_available ? t('unavailable') : t('available')}
                  </Button>
                </div>
              )}
              {section === 'reviews' && (
                <div className="mt-2">
                  <Button variant="ghost" onClick={() => void removeReview(row.id)}>
                    {t('deleteReview')}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

