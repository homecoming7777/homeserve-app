import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/adminService';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../../components/ui/Card';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalClients: 0,
    totalServices: 0,
    totalBookings: 0,
    totalCommission: 0
  });

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setStats({
      totalUsers: users.length,
      totalProviders: users.filter(u => u.role === 'provider').length,
      totalClients: users.filter(u => u.role === 'client').length,
      totalServices: services.length,
      totalBookings: bookings.length,
      totalCommission: adminService.getTotalCommission()
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('admin_dashboard')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card><div className="text-center"><p className="text-gray-500">{t('total_users')}</p><p className="text-2xl font-bold">{stats.totalUsers}</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-500">{t('total_providers')}</p><p className="text-2xl font-bold">{stats.totalProviders}</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-500">{t('total_clients')}</p><p className="text-2xl font-bold">{stats.totalClients}</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-500">{t('total_services')}</p><p className="text-2xl font-bold">{stats.totalServices}</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-500">{t('total_bookings')}</p><p className="text-2xl font-bold">{stats.totalBookings}</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-500">{t('total_commission')}</p><p className="text-2xl font-bold text-green-600">{stats.totalCommission} DH</p></div></Card>
      </div>
    </div>
  );
};
export default AdminDashboard;