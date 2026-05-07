import { http } from './http';

export type Notification = {
  id: number;
  user_id: number;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};

export async function fetchNotifications() {
  const { data } = await http.get<{ data: {
    filter(arg0: (n: any) => boolean): unknown; data: Notification[] 
} }>('/notifications');
  return data.data;
}

export async function markNotificationRead(id: number) {
  const { data } = await http.patch<{ data: Notification }>(`/notifications/${id}/read`);
  return data.data;
}

export async function markAllNotificationsRead() {
  const { data } = await http.patch<{ message: string }>('/notifications/read-all');
  return data;
}

