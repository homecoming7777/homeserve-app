import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import * as bookingsApi from '../../api/bookings';

export default function ProviderBookings() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<bookingsApi.Booking[]>([]);
  const [earnings, setEarnings] = useState<string>('0');

  const load = (quiet = false) => {
    if (!quiet) setLoading(true);
    Promise.all([bookingsApi.fetchProviderBookings(), bookingsApi.fetchProviderAnalytics()])
      .then(([res, analytics]) => {
        setBookings(res.data);
        setEarnings(analytics.total_earnings);
      })
      .catch((e: any) => {
        if (!quiet) {
          toast.error(e?.response?.data?.message || 'Failed to load bookings');
        }
      })
      .finally(() => {
        if (!quiet) setLoading(false);
      });
  };

  useEffect(() => {
    load();
    const interval = window.setInterval(() => load(true), 15000);
    return () => window.clearInterval(interval);
  }, []);

  const onUpdate = async (id: number, status: 'accepted' | 'rejected') => {
    // Optimistic update
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    try {
      await bookingsApi.updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      load(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Update failed');
      load(true); // revert on failure
    }
  };

  const onMarkDone = async (id: number) => {
    // Optimistic update
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, provider_completed_at: new Date().toISOString() } : b)));
    try {
      await bookingsApi.providerMarkCompleted(id);
      toast.success('Marked as done. Waiting for client approval.');
      load(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed');
      load(true); // revert on failure
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('bookings')}</h1>
          <p className="mt-2 text-base text-slate-500 font-medium">{t('pending')} / {t('accepted')} / {t('rejected')}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 flex flex-col items-end">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{t('earnings')}</span>
          <span className="text-2xl font-extrabold text-blue-800">{Number(earnings || 0).toFixed(0)} {t('mad')}</span>
        </div>
      </div>

      {loading ? (
        <Card className="border-0 shadow-card bg-white p-8 rounded-3xl text-center">
          <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
            <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            <p className="text-slate-500 font-medium">{t('loading')}</p>
          </div>
        </Card>
      ) : bookings.length === 0 ? (
        <Card className="border-0 shadow-card bg-white p-12 rounded-3xl text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div className="text-lg font-bold text-slate-900">{t('noBookingsYet')}</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((b) => (
            <Card key={b.id} className="border-0 shadow-card bg-white p-6 rounded-3xl flex flex-col gap-4 transition-all hover:shadow-card-hover">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Booking #{b.id}
                  </div>
                  <div className="text-lg font-extrabold text-slate-900 leading-tight">
                    {b.service?.title}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <Badge tone={b.status === 'pending' ? 'yellow' : b.status === 'accepted' ? 'green' : 'red'}>{b.status}</Badge>
                    <Badge tone={b.payment_status === 'paid' ? 'green' : 'slate'}>{b.payment_status}</Badge>
                  </div>
                  <div className="text-xs font-semibold text-slate-400">
                    {new Date(b.booking_date).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase mb-1">{t('client')}</span>
                  <span className="text-sm font-bold text-slate-700">{b.client?.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-400 uppercase mb-1">{t('phone')}</span>
                  <span className="text-sm font-bold text-slate-700">{b.client?.phone}</span>
                </div>
              </div>

              {b.status === 'pending' ? (
                <div className="flex gap-3 mt-2">
                  <Button className="flex-1 !py-3 shadow-md shadow-blue-600/20" onClick={() => void onUpdate(b.id, 'accepted')}>
                    {t('accepted')}
                  </Button>
                  <Button variant="danger" className="flex-1 !py-3" onClick={() => void onUpdate(b.id, 'rejected')}>
                    {t('rejected')}
                  </Button>
                </div>
              ) : b.status === 'accepted' ? (
                <div className="mt-auto pt-4 border-t border-slate-100">
                  {!b.provider_completed_at ? (
                    <Button className="w-full !py-3 shadow-md shadow-blue-600/20" onClick={() => void onMarkDone(b.id)}>
                      {t('markServiceDone')}
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 w-full rounded-2xl border border-amber-200/60 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {t('waitingClientApproval')}
                    </div>
                  )}
                  {b.client_approved_at ? (
                    <div className="mt-3 flex items-center justify-center gap-2 w-full rounded-2xl border border-emerald-200/60 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {t('approvedPaymentCompleted')}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

