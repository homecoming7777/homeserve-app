import axios from 'axios';
import { getAuth } from '../lib/storage';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

http.interceptors.request.use((config) => {
  const auth = getAuth();
  if (auth?.token) {
    config.headers = (config.headers ?? {}) as any;
    (config.headers as any).Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

