import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { Card } from '../ui/Card';

export type PaymentMethod = 'cash' | 'card' | 'wallet';

export default function PaymentModal({
  open,
  onClose,
  amountMAD,
  walletBalanceMAD,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  amountMAD: number;
  walletBalanceMAD: number;
  onConfirm: (method: PaymentMethod, card?: { number: string; name: string; exp: string; cvc: string }) => void;
}) {
  const { t } = useTranslation();
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const cardValid = useMemo(() => {
    if (method !== 'card') return true;
    return cardNumber.replace(/\s/g, '').length >= 12 && cardName.length >= 2 && /^\d{2}\/\d{2}$/.test(cardExp) && cardCvc.length >= 3;
  }, [method, cardNumber, cardName, cardExp, cardCvc]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-900">{t('payment')}</div>
              <div className="mt-1 text-xs text-gray-500">
                {amountMAD.toFixed(0)} {t('mad')}
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              {t('cancel')}
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            <label className="block text-xs font-medium text-gray-700">{t('payWith')}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['cash', 'card', 'wallet'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    method === m ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t(m)}
                </button>
              ))}
            </div>

            {method === 'wallet' ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                {t('walletBalance')}: <span className="font-semibold">{walletBalanceMAD.toFixed(0)} DH</span>
              </div>
            ) : null}

            {method === 'card' ? (
              <div className="space-y-2">
                <input
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  placeholder={t('cardNumber')}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <input
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  placeholder={t('nameOnCard')}
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    placeholder={t('cardExpiry')}
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                  />
                  <input
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    placeholder={t('cardCvc')}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                  />
                </div>
                {!cardValid ? <div className="text-xs text-red-600">{t('invalidCardDetails')}</div> : null}
              </div>
            ) : null}
          </div>

          <div className="mt-5 flex gap-2">
            <Button variant="secondary" className="w-full" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button
              className="w-full"
              disabled={!cardValid}
              onClick={() =>
                onConfirm(method, method === 'card' ? { number: cardNumber, name: cardName, exp: cardExp, cvc: cardCvc } : undefined)
              }
            >
              {t('confirm')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

