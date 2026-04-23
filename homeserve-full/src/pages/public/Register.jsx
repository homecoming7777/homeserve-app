import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { authService } from '../../services/authService';
import { useLanguage } from '../../contexts/LanguageContext';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
    phone: '',
    address: ''
  });
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      authService.registerOnly(form);
      addToast(t('registration_success'), 'success');
      navigate('/login');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">{t('register')}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t('name')}
          className="w-full border p-2 mb-2 rounded"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder={t('email')}
          className="w-full border p-2 mb-2 rounded"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder={t('password')}
          className="w-full border p-2 mb-2 rounded"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          className="w-full border p-2 mb-2 rounded"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="client">{t('client')}</option>
          <option value="provider">{t('provider')}</option>
        </select>
        <input
          type="tel"
          placeholder={t('phone')}
          className="w-full border p-2 mb-2 rounded"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder={t('address')}
          className="w-full border p-2 mb-4 rounded"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          required
        />
        <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800">
          {t('register')}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {t('already_have_account')}{' '}
        <Link to="/login" className="text-blue-700 hover:underline">
          {t('login_now')}
        </Link>
      </p>
    </div>
  );
};

export default Register;