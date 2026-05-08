import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import * as servicesApi from '../../api/services';
import * as metaApi from '../../api/meta';
import ServicesMap from '../../components/maps/ServicesMap';

function moneyMAD(v: string) {
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  return `${n.toFixed(0)} DH`;
}

export default function ClientServices() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<servicesApi.Service[]>([]);
  const [areas, setAreas] = useState<metaApi.Area[]>([]);
  const [categories, setCategories] = useState<metaApi.Category[]>([]);
  const [areaId, setAreaId] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(25);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    Promise.all([metaApi.fetchAreas(), metaApi.fetchCategories()])
      .then(([a, c]) => {
        setAreas(a);
        setCategories(c);
      })
      .catch(() => {});
  }, []);

  const params = useMemo(() => {
    const p: any = {};
    if (areaId) p.area_id = areaId;
    if (categoryId) p.category_id = categoryId;
    if (userPosition) {
      p.lat = userPosition.lat;
      p.lng = userPosition.lng;
      p.max_distance_km = maxDistanceKm;
    }
    return p;
  }, [areaId, categoryId, userPosition, maxDistanceKm]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error(t('geoNotSupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        toast.success(t('locationDetected'));
      },
      () => toast.error(t('locationPermissionDenied')),
    );
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    servicesApi
      .fetchServices(params)
      .then((res) => mounted && setServices(res.data))
      .catch((e: any) => toast.error(e?.response?.data?.message || t('failedLoadServices')))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [params]);

  const onToggleFavorite = async (serviceId: number) => {
    // Optimistic update
    setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, is_favorite: !s.is_favorite } : s)));
    try {
      const result = await servicesApi.toggleFavorite(serviceId);
      // Sync with server state just in case
      setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, is_favorite: result.is_favorite } : s)));
    } catch {
      toast.error(t('failedUpdateFavorites'));
      // Revert on failure
      setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, is_favorite: !s.is_favorite } : s)));
    }
  };

  const visibleServices = favoritesOnly ? services.filter((s) => s.is_favorite) : services;

  const selectClass = "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all";

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('services')}</h1>
          <p className="mt-2 text-base text-slate-500 font-medium">{t('browseBookServices')}</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 p-2 bg-slate-100/50 rounded-2xl border border-slate-200/60">
          <Button variant="secondary" onClick={detectLocation} className="!py-2.5 bg-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {t('useMyLocation')}
          </Button>
          
          {userPosition && (
            <div className="flex items-center gap-2 px-3">
              <input
                type="range"
                min={1}
                max={100}
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="w-24 accent-blue-600"
                title={`${t('distance')}: ${maxDistanceKm} ${t('km')}`}
              />
              <span className="text-xs font-bold text-slate-500">{maxDistanceKm}km</span>
            </div>
          )}
          
          <select
            value={areaId}
            onChange={(e) => setAreaId(e.target.value ? Number(e.target.value) : '')}
            className={selectClass}
          >
            <option value="">{t('allCities')}</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
            className={selectClass}
          >
            <option value="">{t('allCategories')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          
          <label className="flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" checked={favoritesOnly} onChange={(e) => setFavoritesOnly(e.target.checked)} />
            <span className="text-sm font-bold text-slate-700">{t('favorites')}</span>
          </label>
        </div>
      </div>

      {userPosition && (
        <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
          {t('filteringNearLocation', { distance: maxDistanceKm })}
        </div>
      )}

      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <ServicesMap services={services} userPosition={userPosition} />
      </div>

      {loading ? (
        <Card className="border-0 shadow-card bg-white p-8 rounded-3xl text-center">
          <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
            <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            <p className="text-slate-500 font-medium">{t('loading')}</p>
          </div>
        </Card>
      ) : visibleServices.length === 0 ? (
        <Card className="border-0 shadow-card bg-white p-12 rounded-3xl text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="text-lg font-bold text-slate-900">{t('noServicesFound')}</div>
          <div className="mt-2 text-sm font-medium text-slate-500">{t('tryChangingFilters')}</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleServices.map((s) => (
            <Card key={s.id} className="group flex flex-col border-0 shadow-card bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                {s.image_url ? (
                  <img src={s.image_url} alt={s.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100">
                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge tone={s.is_available ? 'green' : 'slate'} className="backdrop-blur-md bg-white/90 shadow-sm border-0">{s.is_available ? t('available') : t('hidden')}</Badge>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); void onToggleFavorite(s.id); }}
                  className="absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md bg-white/90 shadow-sm hover:bg-white hover:scale-110 transition-all text-xl leading-none focus:outline-none"
                  title={s.is_favorite ? t('removeFromFavorites') : t('addToFavorites')}
                >
                  <span className={s.is_favorite ? "text-red-500 drop-shadow-sm" : "text-slate-400"}>
                    {s.is_favorite ? '♥' : '♡'}
                  </span>
                </button>
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
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase">{t('price')}</span>
                    <span className="text-xl font-extrabold text-blue-700">{moneyMAD(s.price)}</span>
                  </div>
                  <Link to={`/client/services/${s.id}`}>
                    <Button variant="primary" className="!py-2 !px-5 shadow-blue-600/20">{t('details')}</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


