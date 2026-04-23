import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/Layout/PublicLayout';
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Unauthorized from '../pages/shared/Unauthorized';
import ProtectedRoute from './ProtectedRoute';
import ClientDashboard from '../pages/Client/Dashboard';
import BrowseServices from '../pages/Client/BrowseServices';
import ServiceDetails from '../pages/Client/ServiceDetails';
import BookService from '../pages/Client/BookService';
import MyBookings from '../pages/Client/MyBookings';
import ClientNotifications from '../pages/Client/ClientNotifications';
import ClientProfile from '../pages/Client/ProfileSettings';
import DashboardLayout from '../components/Layout/DashboardLayout';
import ProviderDashboard from '../pages/Provider/Dashboard';
import MyServices from '../pages/Provider/MyServices';
import CreateService from '../pages/Provider/CreateService';
import EditService from '../pages/Provider/EditService';
import ProviderBookings from '../pages/Provider/ProviderBookings';
import BookingDetails from '../pages/Provider/BookingDetails';
import ProviderNotifications from '../pages/Provider/ProviderNotifications';
import ProviderProfile from '../pages/Provider/ProfileSettings';
import NotFound from '../pages/shared/NotFound';
import AdminDashboard from '../pages/admin/Dashboard';
import ManageCategories from '../pages/admin/ManageCategories';
import ManageUsers from '../pages/admin/ManageUsers';
import AdminSettings from '../pages/admin/Settings';
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Client routes */}
      <Route element={<ProtectedRoute allowedRoles={['client']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/browse-services" element={<BrowseServices />} />
        <Route path="/service/:id" element={<ServiceDetails />} />
        <Route path="/book-service/:id" element={<BookService />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/notifications" element={<ClientNotifications />} />
        <Route path="/profile-settings" element={<ClientProfile />} />
      </Route>

      {/* Provider routes */}
      <Route element={<ProtectedRoute allowedRoles={['provider']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/provider/my-services" element={<MyServices />} />
        <Route path="/provider/create-service" element={<CreateService />} />
        <Route path="/provider/edit-service/:id" element={<EditService />} />
        <Route path="/provider/bookings" element={<ProviderBookings />} />
        <Route path="/provider/booking/:id" element={<BookingDetails />} />
        <Route path="/provider/notifications" element={<ProviderNotifications />} />
        <Route path="/provider/profile-settings" element={<ProviderProfile />} />
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<ManageCategories />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 