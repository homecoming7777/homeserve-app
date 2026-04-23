import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { serviceService } from '../../services/serviceService';
import { useLanguage } from '../../contexts/LanguageContext';

const CreateService = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const categories = JSON.parse(localStorage.getItem('categories') || '[]');
  const areas = JSON.parse(localStorage.getItem('areas') || '[]');
  const [form, setForm] = useState({
    title: '',
    category_id: '',
    area_id: '',
    description: '',
    price: '',
    is_available: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    serviceService.createService({
      ...form,
      provider_id: user.id,
      price: parseFloat(form.price),
    });
    addToast('Service created successfully', 'success');
    navigate('/provider/my-services');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Service</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block font-medium">Title</label>
          <input type="text" className="w-full border p-2 rounded" required value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Category</label>
            <select className="w-full border p-2 rounded" required value={form.category_id} onChange={e=>setForm({...form, category_id:e.target.value})}>
              <option value="">Select</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-medium">Area (City)</label>
            <select className="w-full border p-2 rounded" required value={form.area_id} onChange={e=>setForm({...form, area_id:e.target.value})}>
              <option value="">Select</option>
              {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Description</label>
          <textarea rows="4" className="w-full border p-2 rounded" required value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Price ($)</label>
          <input type="number" step="0.01" className="w-full border p-2 rounded" required value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_available} onChange={e=>setForm({...form, is_available:e.target.checked})} />
            <span>Service is available for booking</span>
          </label>
        </div>
        <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded">Create Service</button>
      </form>
    </div>
  );
};

export default CreateService;