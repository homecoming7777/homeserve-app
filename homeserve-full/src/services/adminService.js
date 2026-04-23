export const adminService = {
  getCommissionRate: () => {
    const rate = localStorage.getItem('commission_rate');
    return rate ? parseFloat(rate) : 10; // default 10%
  },
  setCommissionRate: (rate) => {
    localStorage.setItem('commission_rate', rate.toString());
  },
  getTotalCommission: () => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    let total = 0;
    bookings.forEach(booking => {
      if (booking.payment_status === 'paid') {
        const service = services.find(s => s.id === booking.service_id);
        if (service) {
          total += (service.price * adminService.getCommissionRate() / 100);
        }
      }
    });
    return total;
  }
};