import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import * as bookingsApi from '../../api/bookings';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import QuickStartBanner from '../../components/guide/QuickStartBanner';

function badgeForStatus(s: bookingsApi.Booking['status'], t: (k: string) => string) {
  if (s === 'pending') return <Badge tone="yellow">{t('pending')}</Badge>;
  if (s === 'accepted') return <Badge tone="green">{t('accepted')}</Badge>;
  return <Badge tone="red">{t('rejected')}</Badge>;
}

export default function ClientDashboard() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ total_bookings: number; pending: number; accepted: number; rejected: number } | null>(null);
  const [recentBookings, setRecentBookings] = useState<bookingsApi.Booking[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    Promise.all([
      bookingsApi.fetchClientAnalytics(),
      bookingsApi.fetchMyBookings()
    ])
      .then(([analyticsData, bookingsRes]) => {
        if (mounted) {
          setStats(analyticsData);
          setRecentBookings(bookingsRes.data.slice(0, 5)); // Show top 5
        }
      })
      .catch((e: any) => toast.error(e?.response?.data?.message || t('loading')))
      .finally(() => mounted && setLoading(false));
      
    return () => {
      mounted = false;
    };
  }, [t]);

  return (
    <div className="space-y-8">
      <QuickStartBanner role="client" />
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('dashboard')}</h1>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400 font-medium">{t('overviewBookings')}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/client/services">
            <Button className="shadow-lg shadow-blue-600/20">{t('services', 'Find Services')}</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {([
          [t('total'), stats?.total_bookings ?? 0, 'slate'],
          [t('pending'), stats?.pending ?? 0, 'yellow'],
          [t('accepted'), stats?.accepted ?? 0, 'green'],
          [t('rejected'), stats?.rejected ?? 0, 'red'],
        ] as const).map(([label, value, tone]) => (
          <Card key={label} className="border-0 shadow-card bg-white dark:bg-slate-800 p-6 rounded-3xl flex flex-col justify-between items-start gap-4 transition-all hover:shadow-card-hover hover:-translate-y-1 relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl ${tone === 'yellow' ? 'bg-amber-500' : tone === 'green' ? 'bg-emerald-500' : tone === 'red' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</h3>
              <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">{loading ? t('loading') : t('updated')}</p>
            </div>
            <div className="flex w-full items-end justify-between relative z-10">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{value}</span>
              <Badge tone={tone as any} className="shadow-sm border-0">{label}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('recentBookings', 'Recent Bookings')}</h2>
          <Link to="/client/bookings" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            {t('viewAll', 'View All')} →
          </Link>
        </div>
        
        <Card className="border-0 shadow-card bg-white dark:bg-slate-800 rounded-3xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
                <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
              </div>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{t('noBookingsYet')}</div>
              <div className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{t('browseServicesFirstBooking')}</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {recentBookings.map((b) => (
                <div key={b.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0 border border-blue-100 dark:border-blue-800/30">
                      #{b.id}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{b.service?.title}</h3>
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>{new Date(b.booking_date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{Number(b.service?.price || 0).toFixed(0)} {t('mad')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-start sm:self-auto ml-16 sm:ml-0">
                    {badgeForStatus(b.status, t)}
                    <Link to="/client/bookings">
                      <Button variant="secondary" className="!py-1.5 !px-3 text-xs bg-white dark:bg-slate-800">{t('details')}</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

