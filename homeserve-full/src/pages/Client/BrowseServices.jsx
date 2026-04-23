import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { serviceService } from '../../services/serviceService';
import { userService } from '../../services/userService';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../contexts/LanguageContext';

const BrowseServices = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const services = serviceService.getAllServices();
  const categories = JSON.parse(localStorage.getItem('categories') || '[]');
  const areas = JSON.parse(localStorage.getItem('areas') || '[]');

  const filtered = useMemo(() => {
    return services.filter(s => {
      if (!s.is_available) return false;
      if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && s.category_id !== category) return false;
      if (area && s.area_id !== area) return false;
      if (s.price < priceRange.min || s.price > priceRange.max) return false;
      return true;
    });
  }, [services, search, category, area, priceRange]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Browse Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input type="text" placeholder="Search by title" className="border p-2 rounded" value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="border p-2 rounded" value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="border p-2 rounded" value={area} onChange={e=>setArea(e.target.value)}>
          <option value="">All Areas</option>
          {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <div className="flex gap-2">
          <input type="number" placeholder="Min price" className="border p-2 rounded w-1/2" value={priceRange.min} onChange={e=>setPriceRange({...priceRange, min: +e.target.value})} />
          <input type="number" placeholder="Max price" className="border p-2 rounded w-1/2" value={priceRange.max} onChange={e=>setPriceRange({...priceRange, max: +e.target.value})} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(service => {
          const provider = userService.getUserById(service.provider_id);
          const cat = categories.find(c => c.id === service.category_id);
          const areaObj = areas.find(a => a.id === service.area_id);
          return (
            <Card key={service.id}>
              <h2 className="text-xl font-bold">{service.title}</h2>
              <p className="text-gray-600">{cat?.name} in {areaObj?.name}</p>
              <p className="mt-2 text-gray-700">{service.description.substring(0,80)}...</p>
              <p className="text-lg font-semibold text-blue-700 mt-2">DH {service.price}</p>
              <p className="text-sm text-gray-500">Provider: {provider?.name}</p>
              <Link to={`/service/${service.id}`} className="mt-4 inline-block bg-blue-700 text-white px-4 py-2 rounded">View Details</Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default BrowseServices;
