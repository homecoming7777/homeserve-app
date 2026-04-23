import { useState } from 'react';
import Modal from './ui/Modal';
import { useToast } from '../contexts/ToastContext';
import { reviewService } from '../services/reviewService';
import { useLanguage } from '../contexts/LanguageContext';

const ReviewModal = ({ isOpen, onClose, bookingId, providerId, clientId, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { addToast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    reviewService.createReview({
      booking_id: bookingId,
      client_id: clientId,
      provider_id: providerId,
      rating: parseInt(rating),
      comment: comment
    });
    addToast(t('review_submitted'), 'success');
    onSuccess();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('rate_service')}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">{t('rating')}</label>
          <select className="w-full border p-2 rounded" value={rating} onChange={e=>setRating(e.target.value)}>
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ⭐</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium">{t('comment')}</label>
          <textarea className="w-full border p-2 rounded" rows="3" value={comment} onChange={e=>setComment(e.target.value)} />
        </div>
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded">{t('submit_review')}</button>
      </form>
    </Modal>
  );
};
export default ReviewModal;