import { bookingService } from './bookingService';
import { userService } from './userService';
import { notificationService } from './notificationService';
import { formatCurrency } from '../utils/CurrencyUtils';

export const paymentService = {
  processPayment(bookingId, method, cardDetails = null) {
    const booking = bookingService.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found');

    const services = JSON.parse(localStorage.getItem('services') || '[]');
    const service = services.find(s => s.id === booking.service_id);
    const amount = service.price;

    if (method === 'wallet') {
      const client = userService.getUserById(booking.client_id);
      if (client.wallet_balance < amount) {
        throw new Error('insufficient_balance');
      }
      userService.updateUser(booking.client_id, { wallet_balance: client.wallet_balance - amount });
      this.markBookingPaid(bookingId, method, amount);
      return { success: true, method: 'wallet' };
    }
    else if (method === 'card') {
      if (!cardDetails || !this.validateCard(cardDetails)) {
        throw new Error('Invalid card details');
      }
      this.markBookingPaid(bookingId, method, amount);
      return { success: true, method: 'card' };
    }
    else if (method === 'cash') {
      bookingService.updateBookingPayment(bookingId, { payment_method: 'cash', payment_status: 'pending' });
      return { success: true, method: 'cash', pending: true };
    }
    else {
      throw new Error('Invalid payment method');
    }
  },

  validateCard({ number, expiry, cvv }) {
    const numStr = number.replace(/\s/g, '');
    if (!/^\d{16}$/.test(numStr)) return false;
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    if (!/^\d{3,4}$/.test(cvv)) return false;
    return true;
  },

  markBookingPaid(bookingId, method, amount) {
    const booking = bookingService.updateBookingPayment(bookingId, {
      payment_method: method,
      payment_status: 'paid',
      payment_id: crypto.randomUUID(),
      paid_at: new Date().toISOString()
    });
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    const service = services.find(s => s.id === booking.service_id);
    notificationService.create({
      user_id: booking.client_id,
      title: 'payment_success',
      message: `Payment of ${formatCurrency(amount)} for booking #${bookingId.slice(0,6)} was successful.`,
      read: false
    });
    notificationService.create({
      user_id: booking.provider_id,
      title: 'payment_received',
      message: `Payment received for booking #${bookingId.slice(0,6)}.`,
      read: false
    });
    return booking;
  }
};