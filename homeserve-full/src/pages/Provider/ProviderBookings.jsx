import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService } from '../../services/bookingService';
import { serviceService } from '../../services/serviceService';
import { formatCurrency } from '../../utils/CurrencyUtils';
import Table from '../../components/ui/Table';import { useLanguage } from '../../contexts/LanguageContext';

const ProviderBookings = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const bookings = bookingService.getBookingsByProvider(user.id);
  const services = serviceService.getAllServices();

  const enriched = bookings.map(b => {
    const service = services.find(s => s.id === b.service_id);
    return { ...b, serviceTitle: service?.title, price: service?.price };
  });

  const headers = [t('service'), t('client'), t('booking_date'), t('status'), t('payment_status'), t('actions')];
  const renderRow = (booking) => (
    <tr key={booking.id}>
      <td className="px-6 py-4">{booking.serviceTitle}</td>
      <td className="px-6 py-4">{booking.client_id.slice(0,8)}</td>
      <td className="px-6 py-4">{new Date(booking.booking_date).toLocaleString()}</td>
      <td className="px-6 py-4">{t(booking.status)}</td>
      <td className="px-6 py-4">{t(booking.payment_status)}</td>
      <td className="px-6 py-4">
        <Link to={`/provider/booking/${booking.id}`} className="text-blue-600">{t('manage')}</Link>
      </td>
    </tr>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('provider_bookings')}</h1>
      <Table headers={headers} data={enriched} renderRow={renderRow} />
    </div>
  );
};
export default ProviderBookings;