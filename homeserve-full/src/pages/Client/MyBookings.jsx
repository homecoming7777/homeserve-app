import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService } from '../../services/bookingService';
import { serviceService } from '../../services/serviceService';
import { reviewService } from '../../services/reviewService';
import { formatCurrency } from '../../utils/currencyUtils';
import { useLanguage } from '../../contexts/LanguageContext';
import Table from '../../components/ui/Table';
import ReviewModal from '../../components/ReviewModal';
import { useToast } from '../../contexts/ToastContext';

const MyBookings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const loadData = () => {
    const allBookings = bookingService.getAllBookings();
    const myBookings = allBookings.filter(b => b.client_id === user.id);
    setBookings(myBookings);
    setServices(serviceService.getAllServices());
    setReviews(reviewService.getAllReviews());
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  const getServiceTitle = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service?.title || 'Unknown';
  };

  const getServicePrice = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service?.price || 0;
  };

  const hasReview = (bookingId) => {
    return reviews.some(r => r.booking_id === bookingId);
  };

  const getReviewInfo = (bookingId) => {
    const review = reviews.find(r => r.booking_id === bookingId);
    return review;
  };

  const handleReviewClick = (booking) => {
    if (!reviewService.canReview(booking.id, user.id)) {
      addToast(t('cannot_review'), 'error');
      return;
    }
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const onReviewSuccess = () => {
    loadData();
    addToast(t('review_submitted'), 'success');
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const headers = [
    t('service'), 
    t('booking_date'), 
    t('address'), 
    t('status'), 
    t('payment_status'),
    t('price'),
    t('rating'),
    t('actions')
  ];

  const renderRow = (booking) => {
    const servicePrice = getServicePrice(booking.service_id);
    const existingReview = getReviewInfo(booking.id);
    const canReviewNow = booking.status === 'completed' && !hasReview(booking.id);

    return (
      <tr key={booking.id}>
        <td className="px-6 py-4">{getServiceTitle(booking.service_id)}</td>
        <td className="px-6 py-4">{new Date(booking.booking_date).toLocaleString()}</td>
        <td className="px-6 py-4">{booking.address}</td>
        <td className="px-6 py-4">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(booking.status)}`}>
            {t(booking.status)}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {t(booking.payment_status)}
          </span>
        </td>
        <td className="px-6 py-4">{formatCurrency(servicePrice)}</td>
        <td className="px-6 py-4">
          {existingReview ? (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span>{existingReview.rating}/5</span>
            </div>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </td>
        <td className="px-6 py-4">
          {canReviewNow ? (
            <button
              onClick={() => handleReviewClick(booking)}
              className="text-blue-600 hover:underline text-sm"
            >
              {t('write_review')}
            </button>
          ) : booking.status === 'completed' && hasReview(booking.id) ? (
            <span className="text-green-600 text-sm">{t('reviewed')}</span>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('my_bookings')}</h1>
      {bookings.length === 0 ? (
        <p>{t('no_bookings')}</p>
      ) : (
        <Table headers={headers} data={bookings} renderRow={renderRow} />
      )}
      {selectedBooking && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          bookingId={selectedBooking.id}
          providerId={selectedBooking.provider_id}
          clientId={user.id}
          onSuccess={onReviewSuccess}
        />
      )}
    </div>
  );
};

export default MyBookings;