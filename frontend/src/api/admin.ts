import { http } from './http';

export type AdminStats = {
  users: number;
  clients: number;
  providers: number;
  services: number;
  bookings: number;
  reviews: number;
};

export async function fetchAdminDashboard() {
  const { data } = await http.get<{ data: AdminStats }>('/admin/dashboard');
  return data.data;
}

export async function fetchAdminUsers() {
  const { data } = await http.get<{ data: any[] }>('/admin/users');
  return data.data;
}

export async function fetchAdminServices() {
  const { data } = await http.get<{ data: any[] }>('/admin/services');
  return data.data;
}

export async function fetchAdminBookings() {
  const { data } = await http.get<{ data: any[] }>('/admin/bookings');
  return data.data;
}

export async function fetchAdminReviews() {
  const { data } = await http.get<{ data: any[] }>('/admin/reviews');
  return data.data;
}

export async function setServiceAvailability(id: number, is_available: boolean) {
  const { data } = await http.patch<{ data: any }>(`/admin/services/${id}/availability`, { is_available });
  return data.data;
}

export async function setUserRole(id: number, role: 'client' | 'provider' | 'admin') {
  const { data } = await http.patch<{ data: any }>(`/admin/users/${id}/role`, { role });
  return data.data;
}

export async function setUserActive(id: number, is_active: boolean) {
  const { data } = await http.patch<{ data: any }>(`/admin/users/${id}/active`, { is_active });
  return data.data;
}

export async function deleteReview(id: number) {
  await http.delete(`/admin/reviews/${id}`);
}

