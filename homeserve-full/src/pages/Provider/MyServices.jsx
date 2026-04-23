import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { serviceService } from '../../services/serviceService';
import { useToast } from '../../contexts/ToastContext';
import Table from '../../components/ui/Table';
import { useLanguage } from '../../contexts/LanguageContext';

const MyServices = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addToast } = useToast();
  let services = serviceService.getServicesByProvider(user.id);
  const categories = JSON.parse(localStorage.getItem('categories') || '[]');
  const areas = JSON.parse(localStorage.getItem('areas') || '[]');

  const handleDelete = (id) => {
    if (window.confirm('Delete this service?')) {
      serviceService.deleteService(id);
      addToast('Service deleted', 'success');
      window.location.reload();
    }
  };

  const enriched = services.map(s => ({
    ...s,
    category: categories.find(c => c.id === s.category_id)?.name,
    area: areas.find(a => a.id === s.area_id)?.name
  }));

  const headers = ['Title', 'Category', 'Area', 'Price', 'Status', 'Actions'];
  const renderRow = (service) => (
    <tr key={service.id}>
      <td className="px-6 py-4">{service.title}</td>
      <td className="px-6 py-4">{service.category}</td>
      <td className="px-6 py-4">{service.area}</td>
      <td className="px-6 py-4">DH {service.price}</td>
      <td className="px-6 py-4">{service.is_available ? 'Active' : 'Inactive'}</td>
      <td className="px-6 py-4 space-x-2">
        <Link to={`/provider/edit-service/${service.id}`} className="text-blue-600">Edit</Link>
        <button onClick={() => handleDelete(service.id)} className="text-red-600">Delete</button>
      </td>
    </tr>
  );

  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Services</h1>
        <Link to="/provider/create-service" className="bg-green-700 text-white px-4 py-2 rounded">+ Add Service</Link>
      </div>
      {enriched.length === 0 ? <p>No services yet. Create one.</p> : <Table headers={headers} data={enriched} renderRow={renderRow} />}
    </div>
  );
};
export default MyServices;