import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../contexts/ToastContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminSettings = () => {
  const [commission, setCommission] = useState(adminService.getCommissionRate());
  const { addToast } = useToast();
  const { t } = useLanguage();

  const saveCommission = () => {
    adminService.setCommissionRate(commission);
    addToast(t('commission_updated'), 'success');
  };

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-bold mb-6">{t('admin_settings')}</h1>
      <div className="bg-white p-6 rounded shadow">
        <label className="block font-medium mb-2">{t('commission_rate')} (%)</label>
        <input type="number" step="0.5" className="w-full border p-2 rounded mb-4" value={commission} onChange={e=>setCommission(e.target.value)} />
        <button onClick={saveCommission} className="bg-blue-700 text-white px-4 py-2 rounded">{t('save')}</button>
      </div>
    </div>
  );
};
export default AdminSettings;