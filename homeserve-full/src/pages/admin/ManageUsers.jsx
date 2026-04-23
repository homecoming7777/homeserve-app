import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Table from '../../components/ui/Table';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const { addToast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const all = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(all);
  };

  const deleteUser = (id) => {
    if (window.confirm(t('confirm_delete_user'))) {
      const filtered = users.filter(u => u.id !== id);
      localStorage.setItem('users', JSON.stringify(filtered));
      loadUsers();
      addToast(t('user_deleted'), 'success');
    }
  };

  const headers = [t('name'), t('email'), t('role'), t('phone'), t('wallet_balance'), t('actions')];
  const renderRow = (user) => (
    <tr key={user.id}>
      <td className="px-6 py-4">{user.name}</td>
      <td className="px-6 py-4">{user.email}</td>
      <td className="px-6 py-4">{user.role}</td>
      <td className="px-6 py-4">{user.phone}</td>
      <td className="px-6 py-4">{user.wallet_balance} DH</td>
      <td className="px-6 py-4">
        <button onClick={() => deleteUser(user.id)} className="text-red-600">{t('delete')}</button>
      </td>
    </tr>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('manage_users')}</h1>
      <Table headers={headers} data={users} renderRow={renderRow} />
    </div>
  );
};
export default ManageUsers;