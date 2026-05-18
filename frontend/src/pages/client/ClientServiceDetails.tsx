import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import * as servicesApi from '../../api/services';
import * as bookingsApi from '../../api/bookings';
import PaymentModal, { type PaymentMethod } from '../../components/booking/PaymentModal';
import { useAuth } from '../../state/auth';

function toNumber(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function ClientServiceDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, setAuthDirect } = useAuth();

  const serviceId = Number(id);
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<servicesApi.Service | null>(null);

  const [openPay, setOpenPay] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingDay, setBookingDay] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [shouldAutoOpenPayment, setShouldAutoOpenPayment] = useState(false);
  const [address, setAddress] = useState(auth?.user.address || '');
  const walletBalance = useMemo(() => toNumber(auth?.user.wallet_balance || '0'), [auth]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    servicesApi
      .fetchService(serviceId)
      .then((s) => mounted && setService(s))
      .catch((e: any) => toast.error(e?.response?.data?.message || t('loading')))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [serviceId]);

  const amount = toNumber(service?.price || '0');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('assistant_booking_prefill');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.date) {
        setBookingDay(String(parsed.date));
      }
      setShouldAutoOpenPayment(Boolean(parsed?.autoOpenPayment));
      localStorage.removeItem('assistant_booking_prefill');
    } catch {
      
    }
  }, []);

  useEffect(() => {
    if (!service || !bookingDay) {
      setAvailableSlots([]);
      return;
    }
    servicesApi
      .fetchAvailableSlots(service.id, bookingDay)
      .then((slots) => {
        setAvailableSlots(slots);
        if (!bookingDate && slots.length > 0) {
          setBookingDate(slots[0]);
          if (shouldAutoOpenPayment && service.is_available) {
            setOpenPay(true);
            setShouldAutoOpenPayment(false);
          }
        }
      })
      .catch(() => setAvailableSlots([]));
  }, [service, bookingDay, bookingDate, shouldAutoOpenPayment]);

  const onConfirmPayment = async (method: PaymentMethod) => {
    if (!bookingDate) return toast.error(t('bookingDateTime'));
    if (!address) return toast.error(t('address'));
    if (!service) return;

    try {
      const booking = await bookingsApi.createBooking({
        service_id: service.id,
        booking_date: bookingDate,
        address,
        payment_method: method,
      });
      toast.success(t('bookService'));
      setOpenPay(false);

      
      if (method === 'wallet' && auth) {
        const newBalance = Math.max(0, walletBalance - amount).toFixed(2);
        setAuthDirect({ ...auth, user: { ...auth.user, wallet_balance: newBalance } });
      }

      navigate('/client/bookings');
      return booking;
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t('notFound'));
    }
  };

  if (loading) return <Card>{t('loading')}</Card>;
  if (!service) return <Card>{t('notFound')}</Card>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{service.title}</h1>
          <p className="text-sm text-gray-600">
            {service.category?.name} • {service.area?.name}
          </p>
        </div>
        <Badge tone={service.is_available ? 'green' : 'gray'}>{service.is_available ? t('available') : t('unavailable')}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr]">
        <Card>
          <div className="text-sm font-semibold text-gray-900">{t('description')}</div>
          <p className="mt-2 text-sm text-gray-700">{service.description}</p>
          <div className="mt-4 text-sm font-semibold text-gray-900">
            {amount.toFixed(0)} {t('mad')}
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-gray-900">{t('provider')}</div>
          <div className="mt-2 text-sm text-gray-700">{service.provider?.name}</div>
          <div className="mt-1 text-xs text-gray-500">{service.provider?.phone}</div>

          <div className="mt-4 space-y-2">
            <label className="text-xs font-medium text-gray-700">{t('bookingDateTime')}</label>
            <input
              data-assistant-action="booking-day"
              type="date"
              value={bookingDay}
              onChange={(e) => {
                setBookingDay(e.target.value);
                setBookingDate('');
              }}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
            <select
              data-assistant-action="booking-slot"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="">{t('pickAvailableTimeSlot')}</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {new Date(slot.replace(' ', 'T')).toLocaleString()}
                </option>
              ))}
            </select>
            <label className="text-xs font-medium text-gray-700">{t('address')}</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
            <Button data-assistant-action="book-service" className="w-full" disabled={!service.is_available} onClick={() => setOpenPay(true)}>
              {t('bookService')}
            </Button>
          </div>
        </Card>
      </div>

      <PaymentModal
        open={openPay}
        onClose={() => setOpenPay(false)}
        amountMAD={amount}
        walletBalanceMAD={walletBalance}
        onConfirm={(m) => void onConfirmPayment(m)}
      />
    </div>
  );
}

