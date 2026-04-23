import { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService } from '../../services/bookingService';
import { analyticsService } from '../../services/analyticsService';
import { formatCurrency } from '../../utils/CurrencyUtils';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../contexts/LanguageContext';

const ClientDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const bookings = bookingService.getAllBookings();
  const stats = useMemo(() => analyticsService.getClientStats(user.id, bookings, []), [user.id, bookings]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('dashboard')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card><div className="text-center"><p className="text-gray-500">{t('total bookings')}</p><p className="text-3xl font-bold">{stats.total}</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-500">{t('pending')}</p><p className="text-3xl font-bold text-yellow-600">{stats.pending}</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-500">{t('accepted')}</p><p className="text-3xl font-bold text-green-600">{stats.accepted}</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-500">{t('rejected')}</p><p className="text-3xl font-bold text-red-600">{stats.rejected}</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-500">{t('wallet_balance')}</p><p className="text-2xl font-bold text-blue-700">{formatCurrency(user.wallet_balance)}</p></div></Card>
      </div>
    </div>
  );
};
export default ClientDashboard;