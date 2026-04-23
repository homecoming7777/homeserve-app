import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { useLanguage } from '../../contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending email (no backend)
    addToast('Message sent! We will reply within 24 hours.', 'success');
    setForm({ name: '', email: '', message: '' });
  };
  

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-600 mb-8">Have questions? We’re here to help.</p>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name</label>
          <input type="text" required className="w-full border rounded p-2" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email</label>
          <input type="email" required className="w-full border rounded p-2" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Message</label>
          <textarea rows="5" required className="w-full border rounded p-2" value={form.message} onChange={e=>setForm({...form, message:e.target.value})} />
        </div>
        <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">Send Message</button>
      </form>
    </div>
  );
};
export default Contact;