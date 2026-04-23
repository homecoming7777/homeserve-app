import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useLanguage } from '../../contexts/LanguageContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      addToast(t('login_success'), 'success');
      if (user.role === 'client') navigate('/dashboard');
      else if (user.role === 'provider') navigate('/provider/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">{t('login')}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={t('email')}
          className="w-full border p-2 mb-4 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t('password')}
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800">
          {t('login')}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {t('no_account')}{' '}
        <Link to="/register" className="text-blue-700 hover:underline">
          {t('register_now')}
        </Link>
      </p>
    </div>
  );
};

export default Login;