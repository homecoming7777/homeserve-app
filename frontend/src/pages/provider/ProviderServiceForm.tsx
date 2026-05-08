import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import * as metaApi from '../../api/meta';
import * as servicesApi from '../../api/services';

type Rule = { day_of_week: number; start_time: string; end_time: string };

export default function ProviderServiceForm({ mode }: { mode: 'create' | 'edit' }) {
  const { t } = useTranslation();
  const DAYS = [
    { value: 0, label: t('daySunday') },
    { value: 1, label: t('dayMonday') },
    { value: 2, label: t('dayTuesday') },
    { value: 3, label: t('dayWednesday') },
    { value: 4, label: t('dayThursday') },
    { value: 5, label: t('dayFriday') },
    { value: 6, label: t('daySaturday') },
  ];
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<metaApi.Category[]>([]);
  const [areas, setAreas] = useState<metaApi.Area[]>([]);

  const [categoryId, setCategoryId] = useState<number>(1);
  const [areaId, setAreaId] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState<number>(100);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [slotDurationMinutes, setSlotDurationMinutes] = useState<number>(60);
  const [availabilityRules, setAvailabilityRules] = useState<Rule[]>([{ day_of_week: 1, start_time: '09:00', end_time: '18:00' }]);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([metaApi.fetchCategories(), metaApi.fetchAreas()])
      .then(([c, a]) => {
        if (!mounted) return;
        setCategories(c);
        setAreas(a);
        setCategoryId(c[0]?.id ?? 1);
        setAreaId(a[0]?.id ?? 1);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (mode !== 'edit') return;
    const serviceId = Number(id);
    if (!serviceId) return;
    servicesApi
      .fetchService(serviceId)
      .then((s) => {
        setCategoryId(s.category_id);
        setAreaId(s.area_id);
        setTitle(s.title);
        setDescription(s.description);
        setImageUrl(s.image_url ?? '');
        setPrice(Number(s.price));
        setLatitude(s.latitude == null ? '' : String(s.latitude));
        setLongitude(s.longitude == null ? '' : String(s.longitude));
        setSlotDurationMinutes(s.slot_duration_minutes ?? 60);
        setAvailabilityRules(
          s.availability_rules?.map((r) => ({
            day_of_week: r.day_of_week,
            start_time: r.start_time.slice(0, 5),
            end_time: r.end_time.slice(0, 5),
          })) ?? [{ day_of_week: 1, start_time: '09:00', end_time: '18:00' }],
        );
        setIsAvailable(Boolean(s.is_available));
      })
      .catch((e: any) => toast.error(e?.response?.data?.message || t('failedLoadService')));
  }, [mode, id, t]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error(t('geoNotSupported', 'Geolocation is not supported by your browser'));
      return;
    }
    const toastId = toast.loading(t('loading', 'Loading...'));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(String(position.coords.latitude));
        setLongitude(String(position.coords.longitude));
        toast.success(t('locationDetected', 'Location detected successfully!'), { id: toastId });
      },
      () => toast.error(t('locationPermissionDenied', 'Location permission denied'), { id: toastId }),
    );
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        category_id: categoryId,
        area_id: areaId,
        title,
        description,
        image_url: imageUrl || null,
        price: String(price),
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        slot_duration_minutes: slotDurationMinutes,
        is_available: isAvailable,
        availability_rules: availabilityRules,
      };

      if (mode === 'create') {
        await servicesApi.createService(payload);
        toast.success(t('created'));
      } else {
        await servicesApi.updateService(Number(id), payload);
        toast.success(t('updated'));
      }
      navigate('/provider/services');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t('saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const updateRule = (index: number, patch: Partial<Rule>) => {
    setAvailabilityRules((prev) => prev.map((rule, i) => (i === index ? { ...rule, ...patch } : rule)));
  };

  if (loading) return <Card>{t('loading')}</Card>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{mode === 'create' ? t('createService') : t('editService')}</h1>
        <p className="text-sm text-gray-600">{t('keepFieldsSimple')}</p>
      </div>

      <Card>
        <form onSubmit={onSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-gray-700">{t('category')}</label>
              <select className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {t(c.name)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">{t('city')}</label>
              <select className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" value={areaId} onChange={(e) => setAreaId(Number(e.target.value))}>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">{t('title')}</label>
            <input className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">{t('description')}</label>
            <textarea className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">{t('serviceImageUrl')}</label>
            <input className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-gray-700">{t('price')} (DH)</label>
              <input type="number" className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">{t('slotDurationMinutes')}</label>
              <input
                type="number"
                min={15}
                step={15}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                value={slotDurationMinutes}
                onChange={(e) => setSlotDurationMinutes(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-700">{t('serviceLocation', 'Precise Location')}</label>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  {latitude && longitude 
                    ? `📍 ${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)}` 
                    : t('noLocationSet', 'No location set. Customers will only see your city.')}
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={detectLocation} className="!py-2 !text-xs bg-white shadow-sm hover:shadow">
                <svg className="w-4 h-4 mr-1.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {latitude ? t('updateLocation', 'Update Location') : t('detectLocation', 'Detect My Location')}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-700">{t('weeklyAvailability')}</div>
            {availabilityRules.map((rule, index) => (
              <div key={index} className="grid grid-cols-1 gap-2 rounded-xl border border-gray-200 p-3 md:grid-cols-4">
                <select className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" value={rule.day_of_week} onChange={(e) => updateRule(index, { day_of_week: Number(e.target.value) })}>
                  {DAYS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <input type="time" className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" value={rule.start_time} onChange={(e) => updateRule(index, { start_time: e.target.value })} />
                <input type="time" className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" value={rule.end_time} onChange={(e) => updateRule(index, { end_time: e.target.value })} />
                <Button type="button" variant="danger" onClick={() => setAvailabilityRules((prev) => prev.filter((_, i) => i !== index))}>
                  {t('remove')}
                </Button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={() => setAvailabilityRules((prev) => [...prev, { day_of_week: 1, start_time: '09:00', end_time: '18:00' }])}>
              {t('addDayTimeRule')}
            </Button>
          </div>

          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
              {t('available')}
            </label>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="secondary" className="w-full" onClick={() => navigate(-1)}>
              {t('cancel')}
            </Button>
            <Button className="w-full" disabled={saving}>
              {saving ? '...' : t('save')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
