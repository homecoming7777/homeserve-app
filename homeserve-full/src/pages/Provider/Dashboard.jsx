import { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { serviceService } from '../../services/serviceService';
import { bookingService } from '../../services/bookingService';
import { analyticsService } from '../../services/analyticsService';
import { formatCurrency } from '../../utils/CurrencyUtils';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../contexts/LanguageContext';

const ProviderDashboard = () => {
const { t } = useLanguage();
  const { user } = useAuth();
  const services = serviceService.getAllServices();
  const bookings = bookingService.getAllBookings();
  const stats = useMemo(() => analyticsService.getProviderStats(user.id, services, bookings), [user.id, services, bookings]);
  const earnings = useMemo(() => analyticsService.getProviderEarnings(user.id), [user.id]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('dashboard')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <Card><div className="text-center"><p className="text-gray-500">{t('my_services')}</p><p className="text-2xl font-bold">{stats.totalServices}</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-500">{t('total_bookings')}</p><p className="text-2xl font-bold">{stats.totalBookings}</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-500">{t('pending')}</p><p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-500">{t('accepted')}</p><p className="text-2xl font-bold text-green-600">{stats.acceptedJobs}</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-500">{t('rejected')}</p><p className="text-2xl font-bold text-red-600">{stats.rejectedJobs}</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-500">{t('earnings')}</p><p className="text-2xl font-bold text-blue-700">{formatCurrency(earnings.total)}</p></div></Card>
      </div>
    </div>
  );
};
export default ProviderDashboard;