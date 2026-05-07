import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import StarsInput from './StarsInput';

export default function ReviewModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, description?: string) => void;
}) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-900">{t('rateService')}</div>
              <div className="mt-1 text-xs text-gray-500">{t('starsOptionalComment')}</div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              {t('close')}
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            <StarsInput value={rating} onChange={setRating} />
            <textarea
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
              placeholder={t('optionalDescription')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mt-5 flex gap-2">
            <Button variant="secondary" className="w-full" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button className="w-full" onClick={() => onSubmit(rating, description || undefined)}>
              {t('submit')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

