import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './state/auth';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientServices from './pages/client/ClientServices';
import ClientServiceDetails from './pages/client/ClientServiceDetails';
import ClientMyBookings from './pages/client/ClientMyBookings';
import ClientNotifications from './pages/shared/NotificationsPage';
import ClientProfile from './pages/shared/ProfilePage';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderMyServices from './pages/provider/ProviderMyServices';
import ProviderServiceForm from './pages/provider/ProviderServiceForm';
import ProviderBookings from './pages/provider/ProviderBookings';
import AppShell from './components/layout/AppShell';
import AdminDashboard from './pages/admin/AdminDashboard';

const roleHome: Record<'client' | 'provider' | 'admin', string> = {
  client: '/client',
  provider: '/provider',
  admin: '/admin',
};

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { auth } = useAuth();
  const location = useLocation();
  if (!auth) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

function RequireRole({ role, children }: { role: 'client' | 'provider' | 'admin'; children: React.ReactElement }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  if (auth.user.role !== role) return <Navigate to={roleHome[auth.user.role]} replace />;
  return children;
}

export default function App() {
  const { auth } = useAuth();
  const { i18n } = useTranslation();

  const onSwitchLang = (lng: 'en' | 'fr' | 'ar') => {
    i18n.changeLanguage(lng).catch(() => toast.error('Failed to switch language'));
  };

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage onSwitchLang={onSwitchLang} />} />
        <Route path="/login" element={auth ? <Navigate to={roleHome[auth.user.role]} replace /> : <LoginPage />} />
        <Route path="/register" element={auth ? <Navigate to={roleHome[auth.user.role]} replace /> : <RegisterPage />} />

        <Route
          path="/client"
          element={
            <RequireAuth>
              <RequireRole role="client">
                <AppShell role="client" onSwitchLang={onSwitchLang} />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route index element={<ClientDashboard />} />
          <Route path="services" element={<ClientServices />} />
          <Route path="services/:id" element={<ClientServiceDetails />} />
          <Route path="bookings" element={<ClientMyBookings />} />
          <Route path="notifications" element={<ClientNotifications />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>

        <Route
          path="/provider"
          element={
            <RequireAuth>
              <RequireRole role="provider">
                <AppShell role="provider" onSwitchLang={onSwitchLang} />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route index element={<ProviderDashboard />} />
          <Route path="services" element={<ProviderMyServices />} />
          <Route path="services/new" element={<ProviderServiceForm mode="create" />} />
          <Route path="services/:id/edit" element={<ProviderServiceForm mode="edit" />} />
          <Route path="bookings" element={<ProviderBookings />} />
          <Route path="notifications" element={<ClientNotifications />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireRole role="admin">
                <AppShell role="admin" onSwitchLang={onSwitchLang} />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard section="dashboard" />} />
          <Route path="users" element={<AdminDashboard section="users" />} />
          <Route path="services" element={<AdminDashboard section="services" />} />
          <Route path="bookings" element={<AdminDashboard section="bookings" />} />
          <Route path="reviews" element={<AdminDashboard section="reviews" />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

