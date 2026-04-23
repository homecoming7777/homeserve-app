import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { useToast } from '../../contexts/ToastContext';
import { useLanguage } from '../../contexts/LanguageContext';

const ClientProfile = () => {
const { t } = useLanguage();
  const { user, login } = useAuth(); // login to refresh context
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    email: user?.email || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = userService.updateUser(user.id, form);
    // Update current user in context
    login(updated.email, user.password); // re-login to refresh context
    addToast('Profile updated successfully', 'success');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block font-medium">Full Name</label>
          <input type="text" className="w-full border p-2 rounded" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Email</label>
          <input type="email" className="w-full border p-2 rounded bg-gray-100" value={form.email} disabled />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Phone</label>
          <input type="tel" className="w-full border p-2 rounded" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} required />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Address</label>
          <input type="text" className="w-full border p-2 rounded" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} required />
        </div>
        <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
  
};
export default ClientProfile;