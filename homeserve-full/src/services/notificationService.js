export const notificationService = {
  getAll: () => JSON.parse(localStorage.getItem('notifications') || '[]'),
  getByUser: (userId) => JSON.parse(localStorage.getItem('notifications') || '[]').filter(n => n.user_id === userId).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)),
  create: (notification) => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotif = { 
      ...notification, 
      id: crypto.randomUUID(), 
      createdAt: new Date().toISOString(),
      title: notification.title || 'general'
    };
    notifications.push(newNotif);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    return newNotif;
  },
  markAsRead: (id) => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index].read = true;
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  },
  markAllAsRead: (userId) => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = notifications.map(n => n.user_id === userId ? { ...n, read: true } : n);
    localStorage.setItem('notifications', JSON.stringify(updated));
  }
};