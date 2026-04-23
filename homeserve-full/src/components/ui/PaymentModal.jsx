import { useState } from 'react';
import Modal from './Modal';
import { useToast } from '../../contexts/ToastContext';
import { paymentService } from '../../services/paymentService';import { useLanguage } from '../../contexts/LanguageContext';

const PaymentModal = ({ isOpen, onClose, bookingId, amount, onSuccess }) => {
const { t } = useLanguage();
  const [method, setMethod] = useState('cash');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = paymentService.processPayment(bookingId, method, method === 'card' ? card : null);
      addToast(t('payment_success'), 'success');
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err) {
      addToast(t(err.message) || err.message, 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('payment')}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">{t('payment_method')}</label>
          <select className="w-full border p-2 rounded" value={method} onChange={e => setMethod(e.target.value)}>
            <option value="cash">{t('cash_on_delivery')}</option>
            <option value="card">{t('card_payment')}</option>
            <option value="wallet">{t('wallet_payment')}</option>
          </select>
        </div>
        {method === 'card' && (
          <div className="space-y-3">
            <input type="text" placeholder={t('card_number')} className="w-full border p-2 rounded" value={card.number} onChange={e=>setCard({...card, number:e.target.value})} required />
            <div className="flex gap-2">
              <input type="text" placeholder={t('expiry')} className="w-1/2 border p-2 rounded" value={card.expiry} onChange={e=>setCard({...card, expiry:e.target.value})} required />
              <input type="text" placeholder={t('cvv')} className="w-1/2 border p-2 rounded" value={card.cvv} onChange={e=>setCard({...card, cvv:e.target.value})} required />
            </div>
          </div>
        )}
        <p className="my-4 text-lg font-bold">{t('total')}: {amount} {t('mad')}</p>
        <button type="submit" className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800">{t('pay_now')}</button>
      </form>
    </Modal>
  );
};
export default PaymentModal;