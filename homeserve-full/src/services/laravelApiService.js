import { apiRequest } from './apiClient';

export const laravelApiService = {
  register: (payload) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  login: (payload) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  me: () => apiRequest('/auth/me'),

  logout: () => apiRequest('/auth/logout', { method: 'POST' }),

  getServices: (providerId) => apiRequest(providerId ? `/services?provider_id=${providerId}` : '/services'),

  getServiceById: (id) => apiRequest(`/services/${id}`),

  createService: (payload) => apiRequest('/services', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  updateService: (id, payload) => apiRequest(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),

  deleteService: (id) => apiRequest(`/services/${id}`, { method: 'DELETE' }),

  getBookings: ({ clientId, providerId } = {}) => {
    const params = new URLSearchParams();
    if (clientId) params.set('client_id', clientId);
    if (providerId) params.set('provider_id', providerId);

    const query = params.toString();
    return apiRequest(`/bookings${query ? `?${query}` : ''}`);
  },

  createBooking: (payload) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  updateBookingStatus: (id, status) => apiRequest(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),

  updateBookingPayment: (id, payload) => apiRequest(`/bookings/${id}/payment`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }),
};
