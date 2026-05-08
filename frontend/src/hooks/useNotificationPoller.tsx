import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, Notification } from '../api/notifications';

export function useNotificationPoller(role: 'client' | 'provider' | 'admin') {
  const navigate = useNavigate();
  const seenIds = useRef<Set<number>>(new Set());
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const poll = async () => {
      try {
        const res = await fetchNotifications();
        // Extract array from paginator if necessary
        const notifications: Notification[] = Array.isArray(res) ? res : (res as any).data || [];
        
        if (!isMounted) return;

        const unread = notifications.filter((n: Notification) => !n.read);
        setUnreadCount(unread.length);
        
        const newUnread = unread.filter((n: Notification) => !seenIds.current.has(n.id));

        newUnread.forEach((notification: Notification) => {
          // Add to seen so we don't toast it again
          seenIds.current.add(notification.id);

          // Show custom toast
          toast((t) => (
            <div
              className="cursor-pointer"
              onClick={() => {
                toast.dismiss(t.id);
                // Navigate based on role
                if (role === 'client') navigate('/client/notifications');
                else if (role === 'provider') navigate('/provider/notifications');
                else if (role === 'admin') navigate('/admin/notifications'); // fallback if needed
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          ), {
            duration: 6000,
            position: 'top-right',
            style: {
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-color, #0f172a)',
              borderRadius: '1rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            },
            className: 'dark:bg-slate-800 dark:text-white border border-slate-100 dark:border-slate-700',
          });
        });

        // Initialize seenIds on first load without toasting everything
        // If this is the first poll and seenIds is empty, we just mark all current unread as seen
        // Wait, if it's the first load, the user might want to see them?
        // Actually, no, if they just logged in, we only want new ones to pop up while they are active.
        // But for the sake of simplicity, we add all fetched to seenIds so we only alert for FUTURE ones.
        if (seenIds.current.size === 0 && unread.length > 0) {
          // If we had new ones, we just toasted them. 
          // So let's make sure everything we fetched is in seenIds
          unread.forEach((n: Notification) => seenIds.current.add(n.id));
        }

      } catch (err) {
        // ignore polling errors
      }
    };

    // Run once immediately
    poll();

    // Then poll every 15 seconds
    const intervalId = setInterval(poll, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [navigate, role]);

  return { unreadCount };
}
