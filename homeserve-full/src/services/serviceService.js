export const serviceService = {
  getAllServices: () => JSON.parse(localStorage.getItem('services') || '[]'),
  getServiceById: (id) => JSON.parse(localStorage.getItem('services') || '[]').find(s => s.id === id),
  getServicesByProvider: (providerId) => JSON.parse(localStorage.getItem('services') || '[]').filter(s => s.provider_id === providerId),
  createService: (serviceData) => {
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    const newService = { ...serviceData, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    services.push(newService);
    localStorage.setItem('services', JSON.stringify(services));
    return newService;
  },
  updateService: (id, updates) => {
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    const index = services.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Service not found');
    services[index] = { ...services[index], ...updates };
    localStorage.setItem('services', JSON.stringify(services));
    return services[index];
  },
  deleteService: (id) => {
    let services = JSON.parse(localStorage.getItem('services') || '[]');
    services = services.filter(s => s.id !== id);
    localStorage.setItem('services', JSON.stringify(services));
  }
};