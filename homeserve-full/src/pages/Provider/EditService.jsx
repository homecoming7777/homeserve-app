import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { serviceService } from '../../services/serviceService';
import { useLanguage } from '../../contexts/LanguageContext';

const EditService = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState(null);
  const categories = JSON.parse(localStorage.getItem('categories') || '[]');
  const areas = JSON.parse(localStorage.getItem('areas') || '[]');

  useEffect(() => {
    const service = serviceService.getServiceById(id);
    if (service) setForm(service);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    serviceService.updateService(id, {
      ...form,
      price: parseFloat(form.price),
    });
    addToast('Service updated', 'success');
    navigate('/provider/my-services');
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Service</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block font-medium">Title</label>
          <input type="text" className="w-full border p-2 rounded" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Category</label>
            <select className="w-full border p-2 rounded" value={form.category_id} onChange={e=>setForm({...form, category_id:e.target.value})} required>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-medium">Area</label>
            <select className="w-full border p-2 rounded" value={form.area_id} onChange={e=>setForm({...form, area_id:e.target.value})} required>
              {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Description</label>
          <textarea rows="4" className="w-full border p-2 rounded" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Price ($)</label>
          <input type="number" step="0.01" className="w-full border p-2 rounded" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_available} onChange={e=>setForm({...form, is_available:e.target.checked})} />
            <span>Available</span>
          </label>
        </div>
        <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
  
};
export default EditService;