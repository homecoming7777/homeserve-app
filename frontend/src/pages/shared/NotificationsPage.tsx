import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import * as notificationsApi from '../../api/notifications';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<notificationsApi.Notification[]>([]);

  const load = () => {
    setLoading(true);
    notificationsApi
      .fetchNotifications()
      .then((res) => setItems(res.data))
      .catch((e: any) => toast.error(e?.response?.data?.message || 'Failed to load notifications'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const onRead = async (id: number) => {
    try {
      await notificationsApi.markNotificationRead(id);
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed');
    }
  };

  const onReadAll = async () => {
    try {
      await notificationsApi.markAllNotificationsRead();
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed');
    }
  };

  const hasUnread = items.some((n) => !n.read);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('notifications')}</h1>
          <p className="mt-2 text-base text-slate-500 font-medium">{t('notificationsDesc')}</p>
        </div>
        {hasUnread && (
          <Button variant="secondary" onClick={() => void onReadAll()} className="bg-white hover:bg-slate-50 border-slate-200">
            <svg className="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {t('markAllAsRead', 'Mark All as Read')}
          </Button>
        )}
      </div>

      {loading ? (
        <Card className="border-0 shadow-card bg-white p-8 rounded-3xl text-center">
          <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
            <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            <p className="text-slate-500 font-medium">{t('loading')}</p>
          </div>
        </Card>
      ) : items.length === 0 ? (
        <Card className="border-0 shadow-card bg-white p-12 rounded-3xl text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
          <div className="text-lg font-bold text-slate-900">{t('noNotifications')}</div>
          <div className="mt-2 text-sm font-medium text-slate-500">{t('allCaughtUp')}</div>
        </Card>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {items.map((n) => (
            <Card key={n.id} className={`border-0 shadow-card bg-white p-6 rounded-2xl flex flex-col sm:flex-row gap-4 sm:items-start transition-all ${!n.read ? 'ring-2 ring-blue-500/20 bg-blue-50/10' : ''}`}>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-base font-bold text-slate-900">{n.title}</div>
                  <Badge tone={n.read ? 'slate' : 'blue'} className="text-[10px]">{n.read ? t('read') : t('new')}</Badge>
                </div>
                <div className="text-sm font-medium text-slate-600 leading-relaxed">{n.message}</div>
                <div className="text-xs font-semibold text-slate-400 pt-1">
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
              {!n.read ? (
                <div className="mt-2 sm:mt-0 sm:pl-4">
                  <Button variant="secondary" className="!py-2 !px-4 text-xs w-full sm:w-auto bg-white hover:bg-slate-50 border-slate-200" onClick={() => void onRead(n.id)}>
                    <svg className="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {t('markRead')}
                  </Button>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

