import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Table from '../../components/ui/Modal';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const { addToast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const cats = JSON.parse(localStorage.getItem('categories') || '[]');
    setCategories(cats);
  };

  const addCategory = () => {
    if (!newCat.trim()) return;
    const cats = [...categories, { id: crypto.randomUUID(), name: newCat.trim() }];
    localStorage.setItem('categories', JSON.stringify(cats));
    loadCategories();
    setNewCat('');
    addToast(t('category_added'), 'success');
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const saveEdit = () => {
    const updated = categories.map(c => c.id === editingId ? { ...c, name: editName } : c);
    localStorage.setItem('categories', JSON.stringify(updated));
    loadCategories();
    setEditingId(null);
    addToast(t('category_updated'), 'success');
  };

  const deleteCategory = (id) => {
    if (window.confirm(t('confirm_delete'))) {
      const filtered = categories.filter(c => c.id !== id);
      localStorage.setItem('categories', JSON.stringify(filtered));
      loadCategories();
      addToast(t('category_deleted'), 'success');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('manage_categories')}</h1>
      <div className="mb-6 flex gap-2">
        <input type="text" className="border p-2 rounded flex-1" placeholder={t('new_category')} value={newCat} onChange={e=>setNewCat(e.target.value)} />
        <button onClick={addCategory} className="bg-green-700 text-white px-4 py-2 rounded">{t('add')}</button>
      </div>
      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.id} className="flex justify-between items-center border p-3 rounded">
            {editingId === cat.id ? (
              <div className="flex gap-2 flex-1">
                <input type="text" className="border p-1 rounded flex-1" value={editName} onChange={e=>setEditName(e.target.value)} />
                <button onClick={saveEdit} className="bg-blue-700 text-white px-3 py-1 rounded">{t('save')}</button>
                <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-3 py-1 rounded">{t('cancel')}</button>
              </div>
            ) : (
              <>
                <span>{cat.name}</span>
                <div className="space-x-2">
                  <button onClick={() => startEdit(cat)} className="text-blue-600">{t('edit')}</button>
                  <button onClick={() => deleteCategory(cat.id)} className="text-red-600">{t('delete')}</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ManageCategories;