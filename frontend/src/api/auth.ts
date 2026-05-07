import { http } from './http';
import type { AuthPayload } from '../lib/storage';

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'provider';
  phone: string;
  address?: string;
};

export type MeResponse = {
  user: AuthPayload['user'];
};

export async function register(input: RegisterInput) {
  const { data } = await http.post<AuthPayload>('/register', input);
  return data;
}

export async function login(input: { email: string; password: string }) {
  const { data } = await http.post<AuthPayload>('/login', input);
  return data;
}

export async function logout() {
  await http.post('/logout');
}

export async function me() {
  const { data } = await http.get<MeResponse>('/me');
  return data;
}

export async function updateMe(input: { name?: string; phone?: string; address?: string | null; avatar_url?: string | null; bio?: string | null }) {
  const { data } = await http.patch<MeResponse>('/me', input);
  return data;
}

