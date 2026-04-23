export const analyticsService = {
  getClientStats: (clientId, bookings, services) => {
    const myBookings = bookings.filter(b => b.client_id === clientId);
    return {
      total: myBookings.length,
      pending: myBookings.filter(b => b.status === 'pending').length,
      accepted: myBookings.filter(b => b.status === 'accepted').length,
      rejected: myBookings.filter(b => b.status === 'rejected').length
    };
  },
  getProviderStats: (providerId, services, bookings) => {
    const myServices = services.filter(s => s.provider_id === providerId);
    const myBookings = bookings.filter(b => b.provider_id === providerId);
    const acceptedBookings = myBookings.filter(b => b.status === 'accepted');
    const totalRevenue = acceptedBookings.reduce((sum, booking) => {
      const service = services.find(s => s.id === booking.service_id);
      return sum + (service ? service.price : 0);
    }, 0);
    return {
      totalServices: myServices.length,
      totalBookings: myBookings.length,
      pendingRequests: myBookings.filter(b => b.status === 'pending').length,
      acceptedJobs: acceptedBookings.length,
      rejectedJobs: myBookings.filter(b => b.status === 'rejected').length,
      estimatedRevenue: totalRevenue
    };
  },
  getProviderEarnings: (providerId) => {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const services = JSON.parse(localStorage.getItem('services') || '[]');
  const commissionRate = parseFloat(localStorage.getItem('commission_rate') || '10');
  const relevant = bookings.filter(b => b.provider_id === providerId && b.status === 'completed' && b.payment_status === 'paid');
  let total = 0;
  const monthly = {};
  relevant.forEach(b => {
    const service = services.find(s => s.id === b.service_id);
    if (service) {
      const commission = service.price * commissionRate / 100;
      const net = service.price - commission;
      total += net;
      const month = new Date(b.completed_at || b.createdAt).toISOString().slice(0,7);
      monthly[month] = (monthly[month] || 0) + net;
    }
  });
  return { total, monthly };
}
};