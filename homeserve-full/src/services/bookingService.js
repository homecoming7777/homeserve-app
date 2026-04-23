import { notificationService } from './notificationService';

export const bookingService = {
  getAllBookings: () => JSON.parse(localStorage.getItem('bookings') || '[]'),
  getBookingById: (id) => JSON.parse(localStorage.getItem('bookings') || '[]').find(b => b.id === id),
  getBookingsByClient: (clientId) => JSON.parse(localStorage.getItem('bookings') || '[]').filter(b => b.client_id === clientId),
  getBookingsByProvider: (providerId) => JSON.parse(localStorage.getItem('bookings') || '[]').filter(b => b.provider_id === providerId),
  createBooking: (bookingData) => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const newBooking = {
      ...bookingData,
      id: crypto.randomUUID(),
      status: 'pending',
      payment_method: null,
      payment_status: 'pending',
      payment_id: null,
      paid_at: null,
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    notificationService.create({
      user_id: newBooking.provider_id,
      title: 'new_booking',
      message: `New booking request for service ${newBooking.service_id.slice(0,6)}`,
      read: false
    });
    return newBooking;
  },
  updateBookingStatus: (id, status) => {
  const allowed = ['pending', 'accepted', 'rejected', 'in_progress', 'completed'];
  if (!allowed.includes(status)) throw new Error('Invalid status');
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) throw new Error('Booking not found');
  bookings[index].status = status;
  if (status === 'completed') bookings[index].completed_at = new Date().toISOString();
  localStorage.setItem('bookings', JSON.stringify(bookings));
  notificationService.create({
    user_id: bookings[index].client_id,
    title: status === 'completed' ? 'service_completed' : `booking_${status}`,
    message: `Your booking ${id.slice(0,6)} has been ${status}`,
    read: false
  });
  return bookings[index];
},
  updateBookingPayment: (id, paymentData) => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    bookings[index] = { ...bookings[index], ...paymentData };
    localStorage.setItem('bookings', JSON.stringify(bookings));
    return bookings[index];
  }
};