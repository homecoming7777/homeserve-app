import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout = () => {
  const { user } = useAuth();
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role={user?.role} />
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;