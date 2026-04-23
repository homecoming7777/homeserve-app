import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { bookingService } from '../../services/bookingService';
import { serviceService } from '../../services/serviceService';
import { userService } from '../../services/userService';
import { useLanguage } from '../../contexts/LanguageContext';

const BookingDetails = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const booking = bookingService.getBookingById(id);
  if (!booking) return <div>Booking not found</div>;
  const service = serviceService.getServiceById(booking.service_id);
  const client = userService.getUserById(booking.client_id);

  const handleStatus = (status) => {
    bookingService.updateBookingStatus(id, status);
    addToast(`Booking ${status}`, 'success');
    navigate('/provider/bookings');
  };

  

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
      <p><strong>Service:</strong> {service?.title}</p>
      <p><strong>Client:</strong> {client?.name} ({client?.email})</p>
      <p><strong>Date:</strong> {new Date(booking.booking_date).toLocaleString()}</p>
      <p><strong>Address:</strong> {booking.address}</p>
      <p><strong>Status:</strong> {booking.status}</p>
      <div className="mt-6 space-x-4">
        {booking.status === 'pending' && (
          <>
            <button onClick={() => handleStatus('accepted')} className="bg-green-700 text-white px-4 py-2 rounded">Accept</button>
            <button onClick={() => handleStatus('rejected')} className="bg-red-700 text-white px-4 py-2 rounded">Reject</button>
          </>
        )}
        // Add these buttons after accept/reject:
{booking.status === 'accepted' && (
  <button onClick={() => handleStatus('in_progress')} className="bg-blue-700 text-white px-4 py-2 rounded">Mark In Progress</button>
)}
{booking.status === 'in_progress' && (
  <button onClick={() => handleStatus('completed')} className="bg-green-700 text-white px-4 py-2 rounded">Mark Completed</button>
)}
      </div>
    </div>
  );
};
export default BookingDetails;