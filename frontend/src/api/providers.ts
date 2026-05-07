import { http } from './http';

export type ProviderRecommendation = {
  id: number;
  name: string;
  phone: string;
  address: string | null;
  provider_points: number;
  provider_rank: string;
  avg_rating: number;
  completed_jobs: number;
  total_reviews: number;
  recommendation_score: number;
};

export async function fetchTopProviders() {
  const { data } = await http.get<{ data: ProviderRecommendation[] }>('/providers/top');
  return data.data;
}

