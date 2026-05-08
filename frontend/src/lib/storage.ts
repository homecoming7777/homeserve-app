const AUTH_KEY = 'hs_auth';
const LANG_KEY = 'hs_lang';

export type AuthPayload = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'client' | 'provider' | 'admin';
    phone: string;
    address: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    wallet_balance: string;
    provider_points: number;
    provider_rank: string;
    is_active?: boolean;
    provider_summary?: {
      provider_points: number;
      provider_rank: string;
      avg_rating: number;
      completed_jobs: number;
      total_reviews: number;
      recommendation_score: number;
    } | null;
    created_at: string | null;
  };
};

export function getAuth(): AuthPayload | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthPayload;
  } catch {
    return null;
  }
}

export function setAuth(payload: AuthPayload | null) {
  if (!payload) localStorage.removeItem(AUTH_KEY);
  else localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
}

export function getLanguage(): 'en' | 'fr' | 'ar' {
  const v = localStorage.getItem(LANG_KEY);
  if (v === 'fr' || v === 'ar' || v === 'en') return v;
  return 'en';
}

export function setLanguage(lang: 'en' | 'fr' | 'ar') {
  localStorage.setItem(LANG_KEY, lang);
}

