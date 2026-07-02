import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaPlus, FaTimes } from 'react-icons/fa';
import DataTable from '../../../components/common/DataTable';
import ErrorMessage from '../../../components/common/ErrorMessage';

const referralStatusColors = {
  new: 'bg-orange-100 text-orange-700', contacted: 'bg-amber-100 text-amber-700',
  interested: 'bg-amber-100 text-amber-700', converted: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};

export default function MyReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });

  const fetchReferrals = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await (await import('../../../api/leads')).getLeads({ source: 'partner', limit: 100 });
      const items = res?.data || res || [];
      setReferrals(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load referrals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReferrals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Name and phone are required');
      return;
    }
    try {
      const { createLead } = await import('../../../api/leads');
      await createLead({ name: form.name, phone: form.phone, email: form.email, source: 'referral' });
      toast.success('Referral submitted!');
      setShowForm(false);
      setForm({ name: '', phone: '', email: '' });
      fetchReferrals();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit referral');
    }
  };

  const columns = [
    { key: 'name', label: 'Referred Person', render: r => <span className="font-medium text-slate-800">{r.name || '-'}</span> },
    { key: 'phone', label: 'Phone', render: r => r.phone || '-' },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${referralStatusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status?.replace(/_/g, ' ')}</span> },
    { key: 'commission', label: 'Commission', render: r => r.commissionAmount ? '₹' + r.commissionAmount.toLocaleString() : '-' },
    { key: 'date', label: 'Date', render: r => new Date(r.createdAt || r.date).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Referrals</h1>
          <p className="text-slate-500 text-sm">People you&apos;ve referred</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <FaPlus /> Refer a Friend
        </button>
      </div>

      {error ? <ErrorMessage message={error} onRetry={fetchReferrals} /> : (
        <DataTable columns={columns} data={referrals} loading={loading} />
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Refer a Friend</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="Full name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="Phone number" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="Email address" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg">Submit Referral</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
