import type { Service } from '../../api/services';
import { useTranslation } from 'react-i18next';

export default function ServicesMap({ services, userPosition }: { services: Service[]; userPosition: { lat: number; lng: number } | null }) {
  const { t } = useTranslation();
  const mappable = services.filter((s) => s.latitude != null && s.longitude != null).slice(0, 6);
  const centerLat = userPosition?.lat ?? (mappable[0]?.latitude as number | undefined) ?? 33.5731;
  const centerLng = userPosition?.lng ?? (mappable[0]?.longitude as number | undefined) ?? -7.5898;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.05}%2C${centerLat - 0.05}%2C${centerLng + 0.05}%2C${centerLat + 0.05}&layer=mapnik&marker=${centerLat}%2C${centerLng}`;

  return (
    <div className="space-y-2">
      <div className="h-72 overflow-hidden rounded-xl border border-gray-200">
        <iframe title={t('servicesMapTitle')} src={mapUrl} className="h-full w-full border-0" loading="lazy" />
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {mappable.map((s) => (
          <a key={s.id} href={`https://www.openstreetmap.org/?mlat=${s.latitude}&mlon=${s.longitude}#map=14/${s.latitude}/${s.longitude}`} target="_blank" rel="noreferrer" className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            {s.title}
            {typeof s.distance_km === 'number' ? ` - ${s.distance_km.toFixed(1)} ${t('km')}` : ''}
          </a>
        ))}
      </div>
    </div>
  );
}

