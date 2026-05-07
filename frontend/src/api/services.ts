import { http } from './http';

export type Service = {
  id: number;
  provider_id: number;
  category_id: number;
  area_id: number;
  title: string;
  description: string;
  image_url?: string | null;
  price: string;
  latitude?: number | null;
  longitude?: number | null;
  distance_km?: number;
  slot_duration_minutes: number;
  is_available: boolean;
  created_at: string;
  provider?: { id: number; name: string; phone: string; address: string | null };
  category?: { id: number; name: string };
  area?: { id: number; name: string };
  availability_rules?: { id: number; day_of_week: number; start_time: string; end_time: string }[];
  is_favorite?: boolean;
};

export async function fetchServices(params?: {
  area_id?: number;
  category_id?: number;
  available?: boolean;
  lat?: number;
  lng?: number;
  max_distance_km?: number;
}) {
  const { data } = await http.get<{ data: { data: Service[] } }>('/services', { params });
  return data.data;
}

export async function fetchService(id: number) {
  const { data } = await http.get<{ data: Service }>(`/services/${id}`);
  return data.data;
}

export async function fetchProviderServices() {
  const { data } = await http.get<{ data: Service[] }>('/provider/services');
  return data.data;
}

export async function createService(input: Omit<Service, 'id' | 'provider_id' | 'created_at'>) {
  const { data } = await http.post<{ data: Service }>('/services', input);
  return data.data;
}

export async function updateService(id: number, input: Partial<Omit<Service, 'id' | 'provider_id' | 'created_at'>>) {
  const { data } = await http.put<{ data: Service }>(`/services/${id}`, input);
  return data.data;
}

export async function deleteService(id: number) {
  await http.delete(`/services/${id}`);
}

export async function fetchAvailableSlots(serviceId: number, date: string) {
  const { data } = await http.get<{ data: string[] }>(`/services/${serviceId}/available-slots`, { params: { date } });
  return data.data;
}

export async function toggleFavorite(serviceId: number) {
  const { data } = await http.post<{ data: { is_favorite: boolean } }>(`/services/${serviceId}/favorite`);
  return data.data;
}

export async function fetchFavorites() {
  const { data } = await http.get<{ data: Service[] }>('/favorites');
  return data.data;
}

