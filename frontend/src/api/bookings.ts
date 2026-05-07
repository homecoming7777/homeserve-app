import { http } from './http';
import type { Service } from './services';

export type Booking = {
  id: number;
  client_id: number;
  service_id: number;
  booking_date: string;
  address: string;
  status: 'pending' | 'accepted' | 'rejected';
  provider_completed_at?: string | null;
  client_approved_at?: string | null;
  payment_method: 'cash' | 'card' | 'wallet';
  payment_status: 'pending' | 'paid';
  payment_id: string | null;
  paid_at: string | null;
  created_at: string;
  service?: Pick<Service, 'id' | 'title' | 'price' | 'provider_id'> & { provider?: { id: number; name: string; phone: string } };
  client?: { id: number; name: string; phone: string; address: string | null };
};

export async function createBooking(input: {
  service_id: number;
  booking_date: string;
  address: string;
  payment_method: 'cash' | 'card' | 'wallet';
}) {
  const { data } = await http.post<{ data: Booking }>('/bookings', input);
  return data.data;
}

export async function fetchMyBookings() {
  const { data } = await http.get<{ data: { data: Booking[] } }>('/my-bookings');
  return data.data;
}

export async function fetchProviderBookings() {
  const { data } = await http.get<{ data: { data: Booking[] } }>('/provider/bookings');
  return data.data;
}

export async function updateBookingStatus(id: number, status: 'accepted' | 'rejected') {
  const { data } = await http.patch<{ data: Booking }>(`/bookings/${id}/status`, { status });
  return data.data;
}

export async function providerMarkCompleted(id: number) {
  const { data } = await http.patch<{ data: Booking }>(`/bookings/${id}/provider-complete`);
  return data.data;
}

export async function clientApproveCompletion(id: number) {
  const { data } = await http.patch<{ data: Booking }>(`/bookings/${id}/client-approve`);
  return data.data;
}

export async function createReview(bookingId: number, input: { rating: number; description?: string }) {
  const { data } = await http.post<{ data: any }>(`/bookings/${bookingId}/review`, input);
  return data.data;
}

export async function fetchClientAnalytics() {
  const { data } = await http.get<{ data: { total_bookings: number; pending: number; accepted: number; rejected: number } }>(
    '/client/dashboard-analytics',
  );
  return data.data;
}

export async function fetchProviderAnalytics() {
  const { data } = await http.get<{
    data: { 
      total_services: number; 
      total_bookings: number; 
      pending_requests: number; 
      accepted_jobs: number; 
      total_earnings: string;
      monthly_revenue: Array<{ name: string; revenue: number }>;
      ranking_summary: {
        provider_points: number;
        provider_rank: string;
        avg_rating: number;
        completed_jobs: number;
        total_reviews: number;
      };
    };
  }>('/provider/dashboard-analytics');
  return data.data;
}

