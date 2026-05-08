import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import * as bookingsApi from '../../api/bookings';
import Button from '../../components/ui/Button';
import ReviewModal from '../../components/reviews/ReviewModal';

function badgeForStatus(s: bookingsApi.Booking['status'], t: (k: string) => string) {
  if (s === 'pending') return <Badge tone="yellow">{t('pending')}</Badge>;
  if (s === 'accepted') return <Badge tone="green">{t('accepted')}</Badge>;
  return <Badge tone="red">{t('rejected')}</Badge>;
}

function badgeForPayment(s: bookingsApi.Booking['payment_status'], t: (k: string) => string) {
  if (s === 'paid') return <Badge tone="green">{t('accepted')}</Badge>;
  return <Badge tone="slate">{t('pending')}</Badge>;
}

export default function ClientMyBookings() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<bookingsApi.Booking[]>([]);
  const [reviewBookingId, setReviewBookingId] = useState<number | null>(null);

  const load = (quiet = false) => {
    let mounted = true;
    if (!quiet) setLoading(true);
    bookingsApi
      .fetchMyBookings()
      .then((res) => mounted && setBookings(res.data))
      .catch((e: any) => {
        if (!quiet) toast.error(e?.response?.data?.message || t('loading'));
      })
      .finally(() => {
        if (mounted && !quiet) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  };

  useEffect(() => load(), []);

  const onApprove = async (id: number) => {
    // Optimistic update
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, client_approved_at: new Date().toISOString() } : b)));
    setReviewBookingId(id);
    
    try {
      await bookingsApi.clientApproveCompletion(id);
      toast.success(t('approvedPaymentCompleted'));
      load(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed');
      load(true); // revert
    }
  };

  const onSubmitReview = async (rating: number, description?: string) => {
    if (!reviewBookingId) return;
    try {
      await bookingsApi.createReview(reviewBookingId, { rating, description });
      toast.success(t('submit'));
      setReviewBookingId(null);
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('bookings')}</h1>
        <p className="mt-2 text-base text-slate-500 font-medium">{t('yourBookingHistory')}</p>
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
          <div className="mt-2 text-sm font-medium text-slate-500">{t('browseServicesFirstBooking')}</div>
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
                    {badgeForStatus(b.status, t)}
                    {badgeForPayment(b.payment_status, t)}
                  </div>
                  <div className="text-xs font-semibold text-slate-400">
                    {new Date(b.booking_date).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase mb-1">{t('price')}</span>
                  <span className="text-xl font-extrabold text-blue-700">{Number(b.service?.price || 0).toFixed(0)} {t('mad')}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-400 uppercase mb-1">{t('payWith')}</span>
                  <span className="text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200/60 capitalize">{b.payment_method}</span>
                </div>
              </div>

              {b.status === 'accepted' ? (
                <div className="mt-auto pt-4 border-t border-slate-100">
                  {!b.provider_completed_at ? (
                    <div className="flex items-center justify-center gap-2 w-full rounded-2xl border border-amber-200/60 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {t('waitingProviderDone')}
                    </div>
                  ) : b.client_approved_at ? (
                    <div className="flex items-center justify-center gap-2 w-full rounded-2xl border border-emerald-200/60 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {t('approvedPaymentCompleted')}
                    </div>
                  ) : (
                    <Button className="w-full !py-3 shadow-lg shadow-blue-600/20" onClick={() => void onApprove(b.id)}>
                      {t('approveCompletion')}
                    </Button>
                  )}
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}

      <ReviewModal
        open={reviewBookingId !== null}
        onClose={() => setReviewBookingId(null)}
        onSubmit={(rating, description) => void onSubmitReview(rating, description)}
      />
    </div>
  );
}


