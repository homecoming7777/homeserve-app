import { useParams, Link } from 'react-router-dom';
import { serviceService } from '../../services/serviceService';
import { userService } from '../../services/userService';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../contexts/LanguageContext';

const ServiceDetails = () => {
const { t } = useLanguage();
  const { id } = useParams();
  const service = serviceService.getServiceById(id);
  if (!service) return <div className="p-6">Service not found</div>;
  const provider = userService.getUserById(service.provider_id);
  const categories = JSON.parse(localStorage.getItem('categories') || '[]');
  const areas = JSON.parse(localStorage.getItem('areas') || '[]');
  const category = categories.find(c => c.id === service.category_id);
  const area = areas.find(a => a.id === service.area_id);

  
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
        <p className="text-gray-500 mb-4">{category?.name} • {area?.name}</p>
        <p className="text-gray-700 mb-4">{service.description}</p>
        <p className="text-2xl font-bold text-blue-700 mb-4">${service.price}</p>
        <p className="text-sm text-gray-500 mb-2">Provider: {provider?.name} ({provider?.phone})</p>
        <p className="text-sm text-gray-500 mb-6">Posted: {new Date(service.createdAt).toLocaleDateString()}</p>
        <Link to={`/book-service/${service.id}`} className="inline-block bg-green-700 text-white px-6 py-2 rounded">Book this service</Link>
      </Card>
    </div>
  );
};
export default ServiceDetails;