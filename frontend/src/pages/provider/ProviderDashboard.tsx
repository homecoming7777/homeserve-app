import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import * as bookingsApi from '../../api/bookings';
import QuickStartBanner from '../../components/guide/QuickStartBanner';
import RevenueChart from '../../components/dashboard/RevenueChart';

function badgeForStatus(s: bookingsApi.Booking['status'], t: (k: string) => string) {
  if (s === 'pending') return <Badge tone="yellow">{t('pending')}</Badge>;
  if (s === 'accepted') return <Badge tone="green">{t('accepted')}</Badge>;
  return <Badge tone="red">{t('rejected')}</Badge>;
}

export default function ProviderDashboard() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    total_services: number;
    total_bookings: number;
    pending_requests: number;
    accepted_jobs: number;
    total_earnings: string;
    monthly_revenue: Array<{ name: string; revenue: number }>;
    ranking_summary: {
      provider_points: number;
      provider_rank: string;
      avg_rating: number;
      completed_jobs: number;
      total_reviews: number;
    };
  } | null>(null);
  const [recentBookings, setRecentBookings] = useState<bookingsApi.Booking[]>([]);

  const loadStats = (mountedRef?: { value: boolean }, quiet = false) => {
    if (!quiet) setLoading(true);
    
    Promise.all([
      bookingsApi.fetchProviderAnalytics(),
      bookingsApi.fetchProviderBookings()
    ])
      .then(([analyticsData, bookingsRes]) => {
        if (mountedRef && !mountedRef.value) return;
        setStats(analyticsData);
        setRecentBookings(bookingsRes.data.slice(0, 5)); // Show top 5
      })
      .catch((e: any) => {
        if (!quiet) toast.error(e?.response?.data?.message || t('loading'));
      })
      .finally(() => {
        if (mountedRef && !mountedRef.value) return;
        if (!quiet) setLoading(false);
      });
  };

  useEffect(() => {
    const mountedRef = { value: true };
    loadStats(mountedRef, false);

    const interval = window.setInterval(() => loadStats(mountedRef, true), 15000);
    const onFocus = () => loadStats(mountedRef, true);
    window.addEventListener('focus', onFocus);

    return () => {
      mountedRef.value = false;
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [t]);

  return (
    <div className="space-y-8">
      <QuickStartBanner role="provider" />
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white dark:text-white tracking-tight">{t('dashboard')}</h1>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400 font-medium">{t('providerMetricsEarnings')}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/provider/services">
            <Button className="shadow-lg shadow-blue-600/20">{t('myServices', 'My Services')}</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {([
          [t('services'), stats?.total_services ?? 0, 'slate'],
          [t('bookings'), stats?.total_bookings ?? 0, 'slate'],
          [t('pending'), stats?.pending_requests ?? 0, 'yellow'],
          [t('earnings'), `${Number(stats?.total_earnings || 0).toFixed(0)} DH`, 'blue'],
        ] as const).map(([label, value, tone]) => (
          <Card key={label} className="border-0 shadow-card bg-white dark:bg-slate-800 p-6 rounded-3xl flex flex-col justify-between items-start gap-4 transition-all hover:shadow-card-hover hover:-translate-y-1 relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl ${tone === 'yellow' ? 'bg-amber-500' : tone === 'green' ? 'bg-emerald-500' : tone === 'blue' ? 'bg-blue-500' : 'bg-slate-500'}`}></div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</h3>
              <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">{loading ? t('loading') : t('updated')}</p>
            </div>
            <div className="flex w-full items-end justify-between relative z-10">
              <span className={`font-extrabold text-slate-900 dark:text-white ${label === t('earnings') ? 'text-2xl' : 'text-4xl'}`}>{value}</span>
              <Badge tone={tone as any} className="shadow-sm border-0">{label}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="border-0 shadow-card bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-3xl flex flex-col justify-between items-start gap-4 transition-all hover:-translate-y-1 relative overflow-hidden text-white">
          <div className="relative z-10 w-full">
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">{t('providerPoints', 'Total Points')}</h3>
            <p className="mt-1 text-xs font-medium text-white/70">{t('performanceScore', 'Your Performance Score')}</p>
            <div className="flex w-full items-end justify-between mt-4">
              <span className="font-extrabold text-4xl">{stats?.ranking_summary?.provider_points ?? 0}</span>
              <Badge tone="yellow" className="bg-white/20 text-white border-0">{t('points', 'pts')}</Badge>
            </div>
          </div>
        </Card>
        
        <Card className="border-0 shadow-card bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl flex flex-col justify-between items-start gap-4 transition-all hover:-translate-y-1 relative overflow-hidden text-white">
          <div className="relative z-10 w-full">
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">{t('providerRank', 'Current Rank')}</h3>
            <p className="mt-1 text-xs font-medium text-white/70">{t('tierStatus', 'Your Tier Status')}</p>
            <div className="flex w-full items-end justify-between mt-4">
              <span className="font-extrabold text-3xl">{stats?.ranking_summary?.provider_rank ?? 'Newcomer'}</span>
              <svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-card bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl flex flex-col justify-between items-start gap-4 transition-all hover:-translate-y-1 relative overflow-hidden text-white">
          <div className="relative z-10 w-full">
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">{t('avgRating', 'Average Rating')}</h3>
            <p className="mt-1 text-xs font-medium text-white/70">{stats?.ranking_summary?.total_reviews ?? 0} {t('reviews', 'Client Reviews')}</p>
            <div className="flex w-full items-end justify-between mt-4">
              <span className="font-extrabold text-4xl">{stats?.ranking_summary?.avg_rating?.toFixed(1) ?? '0.0'}</span>
              <div className="flex items-center text-yellow-300">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 mt-6">
        <Card className="border-0 shadow-sm bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-3xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {t('pointsSystem', 'Points System')}
            </h3>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              {t('pointsSystemDesc', 'Understand how your performance is calculated and what benefits you unlock.')}
            </p>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-blue-100 dark:border-blue-800">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t('howToEarn', 'How to earn points?')}</div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t('howToEarnDesc', 'Complete jobs successfully, get 5-star reviews from clients, and maintain active service listings to rank up quickly!')}
                  </div>
                  <div className="mt-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 p-2 rounded text-slate-600 dark:text-slate-400">
                    {t('pointsFormula', 'Points = (Rating × Reviews × 4) + (Jobs × 10) + (Services × 3)')}
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Badge tone="slate" className="w-16 justify-center">Elite</Badge>
                  <span className="flex-1">{t('rankElite', 'Elite (450+ pts): Highest visibility, priority support, top recommendations.')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="yellow" className="w-16 justify-center">Gold</Badge>
                  <span className="flex-1">{t('rankGold', 'Gold (300+ pts): High visibility, trusted badge.')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="slate" className="w-16 justify-center">Silver</Badge>
                  <span className="flex-1">{t('rankSilver', 'Silver (170+ pts): Increased visibility in search.')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="slate" className="w-16 justify-center text-amber-700 bg-amber-100">Bronze</Badge>
                  <span className="flex-1">{t('rankBronze', 'Bronze (80+ pts): Standard visibility.')}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {!loading && stats?.monthly_revenue && stats.monthly_revenue.length > 0 && (
        <RevenueChart data={stats.monthly_revenue} />
      )}

      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('recentRequests', 'Recent Requests')}</h2>
          <Link to="/provider/bookings" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
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
                <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{t('noBookingsYet')}</div>
              <div className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{t('waitClientBooking')}</div>
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
                        <span>{b.client?.name}</span>
                        <span>•</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{Number(b.service?.price || 0).toFixed(0)} {t('mad')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-start sm:self-auto ml-16 sm:ml-0">
                    {badgeForStatus(b.status, t)}
                    <Link to="/provider/bookings">
                      <Button variant="secondary" className="!py-1.5 !px-3 text-xs bg-white dark:bg-slate-800">{t('manage', 'Manage')}</Button>
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