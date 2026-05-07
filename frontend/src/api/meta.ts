import { http } from './http';

export type Category = { id: number; name: string };
export type Area = { id: number; name: string };

export async function fetchCategories() {
  const { data } = await http.get<{ data: Category[] }>('/categories');
  return data.data;
}

export async function fetchAreas() {
  const { data } = await http.get<{ data: Area[] }>('/areas');
  return data.data;
}

