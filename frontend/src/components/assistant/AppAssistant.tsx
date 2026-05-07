import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as assistantApi from '../../api/assistant';
import { useTranslation } from 'react-i18next';

type Role = 'client' | 'provider' | 'admin' | 'guest';
type ChatItem = { from: 'user' | 'assistant'; text: string };

function shortcuts(role: Role) {
  if (role === 'client') {
    return [
      { to: '/client/services', labelKey: 'assistantShortcutFindServices' },
      { to: '/client/bookings', labelKey: 'assistantShortcutMyBookings' },
      { to: '/client/profile', labelKey: 'assistantShortcutProfile' },
    ];
  }
  if (role === 'provider') {
    return [
      { to: '/provider/services', labelKey: 'assistantShortcutMyServices' },
      { to: '/provider/bookings', labelKey: 'assistantShortcutBookings' },
      { to: '/provider', labelKey: 'assistantShortcutRevenueDashboard' },
    ];
  }
  if (role === 'guest') {
    return [
      { to: '/login', labelKey: 'login' },
      { to: '/register', labelKey: 'register' },
    ];
  }
  return [
    { to: '/admin/users', labelKey: 'assistantShortcutUsers' },
    { to: '/admin/services', labelKey: 'assistantShortcutServices' },
    { to: '/admin/bookings', labelKey: 'assistantShortcutBookings' },
  ];
}

function quickPrompts(role: Role, t: (key: string) => string): string[] {
  if (role === 'client') {
    return [t('quickFindNearbyServices'), t('quickBookTomorrow'), t('quickShowMyBookings'), t('quickHelpPaySafely')];
  }
  if (role === 'provider') {
    return [t('quickRevenueDashboard'), t('quickShowNewBookings'), t('quickSetAvailability'), t('quickIncreaseEarnings')];
  }
  if (role === 'guest') {
    return [t('quickWhatIsThis', 'How does it work?'), t('quickIsItFree', 'Is it free to join?'), t('quickHowToBook', 'How to book a service?')];
  }
  return [t('quickShowUsersList'), t('quickGoReviewsModeration'), t('quickShowServiceIssues'), t('quickNavigateBookings')];
}

export default function AppAssistant({ role }: { role: Role }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatItem[]>([
    {
      from: 'assistant',
      text:
        role === 'client'
          ? t('assistantWelcomeClient')
          : role === 'provider'
            ? t('assistantWelcomeProvider')
            : role === 'admin'
              ? t('assistantWelcomeAdmin')
              : t('assistantWelcomeGuest', 'Hi! I can help you learn about our marketplace. What would you like to know?'),
    },
  ]);

  const examples = useMemo(() => quickPrompts(role, t), [role, t]);

  const executeActions = (actions: Array<{ type: string; payload: Record<string, any> }>) => {
    for (const action of actions) {
      if (action.type === 'navigate' && typeof action.payload?.to === 'string') {
        navigate(action.payload.to);
        continue;
      }
      if (action.type === 'scroll') {
        const amount = Number(action.payload?.amount ?? 500);
        const direction = action.payload?.direction === 'up' ? -1 : 1;
        window.scrollBy({ top: amount * direction, behavior: 'smooth' });
        continue;
      }
      if (action.type === 'click' && typeof action.payload?.target === 'string') {
        const target = action.payload.target;
        const el = document.querySelector(`[data-assistant-action="${target}"]`) as HTMLElement | null;
        el?.click();
        continue;
      }
      if (action.type === 'prefill_booking') {
        localStorage.setItem(
          'assistant_booking_prefill',
          JSON.stringify({
            date: action.payload?.date ?? null,
            autoOpenPayment: Boolean(action.payload?.auto_open_payment),
            createdAt: Date.now(),
          }),
        );
      }
    }
  };

  const sendMessage = async (textInput?: string) => {
    const text = (textInput ?? message).trim();
    if (!text || sending) return;

    const nextHistory = [...history, { from: 'user' as const, text }];
    setHistory(nextHistory);
    setMessage('');
    setSending(true);

    try {
      const result = await assistantApi.assistantChat({
        route: location.pathname,
        history: nextHistory.map((item) => ({ role: item.from, content: item.text })),
      }, role === 'guest');
      setHistory((prev) => [...prev, { from: 'assistant', text: result.reply }]);
      executeActions(result.actions ?? []);
    } catch {
      setHistory((prev) => [
        ...prev,
        {
          from: 'assistant',
          text: t('assistantUnavailable'),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-88 rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
            <div>
              <div className="text-sm font-semibold text-gray-900">{t('aiHelpAssistant')}</div>
              <div className="text-[11px] text-gray-500">{t('assistantTapQuickActions')}</div>
            </div>
            <button className="rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100" onClick={() => setOpen(false)}>
              {t('close')}
            </button>
          </div>

          <div className="border-b border-gray-100 px-3 py-2">
            <div className="mb-2 text-xs font-medium text-gray-600">{t('quickAsks')}</div>
            <div className="flex flex-wrap gap-2">
              {examples.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => void sendMessage(prompt)}
                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-60"
                  disabled={sending}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto px-3 py-3">
            {history.map((item, idx) => (
              <div key={idx} className={`rounded-lg px-3 py-2 text-sm ${item.from === 'assistant' ? 'bg-gray-50 text-gray-700' : 'bg-blue-50 text-blue-800'}`}>
                {item.text}
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              {shortcuts(role).map((action) => (
                <Link key={action.to} to={action.to} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100">
                  {t(action.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex gap-2 border-t border-gray-100 p-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void sendMessage()}
              placeholder={t('assistantInputPlaceholder')}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
            <button
              className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => void sendMessage()}
              disabled={sending}
            >
              {sending ? '...' : t('go')}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-blue-700">
          {t('aiAssistant')}
        </button>
      )}
    </div>
  );
}

