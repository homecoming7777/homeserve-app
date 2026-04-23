import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { serviceService } from '../../services/serviceService';
import { bookingService } from '../../services/bookingService';
import PaymentModal from '../../components/ui/PaymentModal';
import { useLanguage } from '../../contexts/LanguageContext';

const BookService = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const service = serviceService.getServiceById(id);
  const [bookingDate, setBookingDate] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [showPayment, setShowPayment] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState(null);
  const [servicePrice, setServicePrice] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!service) return;
    const newBooking = bookingService.createBooking({
      client_id: user.id,
      service_id: service.id,
      provider_id: service.provider_id,
      booking_date: bookingDate,
      address: address,
    });
    setCreatedBookingId(newBooking.id);
    setServicePrice(service.price);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    addToast(t('booking_confirmed'), 'success');
    navigate('/my-bookings');
  };

  if (!service) return <div>{t('service_not_found')}</div>;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t('book_service')}: {service.title}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block font-medium">{t('booking_date')}</label>
          <input type="datetime-local" className="w-full border p-2 rounded" required value={bookingDate} onChange={e=>setBookingDate(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block font-medium">{t('address')}</label>
          <input type="text" className="w-full border p-2 rounded" required value={address} onChange={e=>setAddress(e.target.value)} />
        </div>
        <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded">{t('confirm_booking')}</button>
      </form>
      {createdBookingId && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => navigate('/my-bookings')}
          bookingId={createdBookingId}
          amount={servicePrice}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
export default BookService;