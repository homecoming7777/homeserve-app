import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notificationService';
import { useLanguage } from '../../contexts/LanguageContext';

const ProviderNotifications = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifs = () => {
      const notifs = notificationService.getByUser(user.id);
      setNotifications(notifs);
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 2000);
    return () => clearInterval(interval);
  }, [user.id]);

  
  const markAsRead = (id) => {
    notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    notificationService.markAllAsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <button onClick={markAllRead} className="text-blue-700 underline">Mark all read</button>
      </div>
      {notifications.length === 0 && <p>No notifications yet.</p>}
      <div className="space-y-3">
        {notifications.map(notif => (
          <div key={notif.id} className={`p-4 border rounded shadow-sm ${notif.read ? 'bg-gray-50' : 'bg-white border-l-4 border-l-blue-600'}`}>
            <p>{notif.message}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
            {!notif.read && <button onClick={() => markAsRead(notif.id)} className="text-blue-600 text-sm mt-2">Mark as read</button>}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProviderNotifications;