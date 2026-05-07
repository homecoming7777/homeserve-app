import { http } from './http';

export async function assistantChat(input: { history: Array<{ role: 'user' | 'assistant'; content: string }>; route?: string }, isGuest?: boolean) {
  const url = isGuest ? '/assistant/guest-chat' : '/assistant/chat';
  const { data } = await http.post<{
    data: {
      reply: string;
      actions: Array<{ type: 'navigate' | 'scroll' | 'click' | 'prefill_booking'; payload: Record<string, any> }>;
    };
  }>(url, input);
  return data.data;
}

