import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import * as servicesApi from '../../api/services';

export default function ProviderMyServices() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<servicesApi.Service[]>([]);

  const load = (quiet = false) => {
    if (!quiet) setLoading(true);
    servicesApi
      .fetchProviderServices()
      .then(setServices)
      .catch((e: any) => {
        if (!quiet) toast.error(e?.response?.data?.message || 'Failed to load services');
      })
      .finally(() => {
        if (!quiet) setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: number) => {
    if (!confirm('Delete service?')) return;
    
    const previousServices = [...services];
    setServices((prev) => prev.filter((s) => s.id !== id));
    
    try {
      await servicesApi.deleteService(id);
      toast.success('Deleted');
      load(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Delete failed');
      setServices(previousServices);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('services')}</h1>
          <p className="mt-2 text-base text-slate-500 font-medium">{t('manageListings')}</p>
        </div>
        <Link to="/provider/services/new">
          <Button className="shadow-lg shadow-blue-600/20">{t('addService')}</Button>
        </Link>
      </div>

      {loading ? (
        <Card className="border-0 shadow-card bg-white p-8 rounded-3xl text-center">
          <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
            <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            <p className="text-slate-500 font-medium">{t('loading')}</p>
          </div>
        </Card>
      ) : services.length === 0 ? (
        <Card className="border-0 shadow-card bg-white p-12 rounded-3xl text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <div className="text-lg font-bold text-slate-900">{t('noServices')}</div>
          <div className="mt-2 text-sm font-medium text-slate-500">{t('createFirstService')}</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.id} className="group flex flex-col border-0 shadow-card bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                {s.image_url ? (
                  <img src={s.image_url} alt={s.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100">
                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge tone={s.is_available ? 'green' : 'slate'} className="backdrop-blur-md bg-white/90 shadow-sm border-0">{s.is_available ? t('available') : t('hidden')}</Badge>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">{s.category?.name}</span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {s.area?.name}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{s.title}</h3>
                <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-6 flex-1">{s.description}</p>
                
                <div className=" justify-between pt-4 border-t border-slate-100 mt-auto">
                  <div className="text-center mb-5 text-lg font-extrabold text-blue-700">
                    {Number(s.price).toFixed(0)} {t('mad')}
                  </div>
                  <div className="flex justify-center gap-2">
                    <Link to={`/provider/services/${s.id}/edit`}>
                      <Button variant="secondary" className="!py-2 !px-4">{t('edit')}</Button>
                    </Link>
                    <Button variant="danger" className="!py-2 !px-4" onClick={() => void onDelete(s.id)}>
                      {t('delete')}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

