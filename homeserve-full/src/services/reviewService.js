export const reviewService = {
  getAllReviews: () => JSON.parse(localStorage.getItem('reviews') || '[]'),
  getReviewsByProvider: (providerId) => {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    return reviews.filter(r => r.provider_id === providerId);
  },
  getAverageRating: (providerId) => {
    const reviews = reviewService.getReviewsByProvider(providerId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  },
  createReview: (reviewData) => {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const newReview = {
      id: crypto.randomUUID(),
      ...reviewData,
      created_at: new Date().toISOString()
    };
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    return newReview;
  },
  canReview: (bookingId, clientId) => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = bookings.find(b => b.id === bookingId && b.client_id === clientId);
    if (!booking) return false;
    if (booking.status !== 'completed') return false;
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const alreadyReviewed = reviews.some(r => r.booking_id === bookingId);
    return !alreadyReviewed;
  }
};