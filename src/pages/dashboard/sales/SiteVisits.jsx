import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { getMyVisits, completeVisit } from '../../../api/siteVisits';
import DataTable from '../../../components/common/DataTable';
import ErrorMessage from '../../../components/common/ErrorMessage';

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-700', confirmed: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
  rescheduled: 'bg-amber-100 text-amber-700',
};

export default function SiteVisits() {
  const [visits, setVisits] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeVisitData, setCompleteVisitData] = useState(null);
  const [notes, setNotes] = useState('');

  const fetchVisits = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getMyVisits();
      const items = res?.data || res || [];
      setVisits(items);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load visits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVisits(); }, []);

  useEffect(() => {
    const now = new Date();
    if (filter === 'upcoming') {
      setFiltered(visits.filter(v => new Date(v.date || v.scheduledDate) >= now && v.status !== 'completed' && v.status !== 'cancelled'));
    } else if (filter === 'past') {
      setFiltered(visits.filter(v => new Date(v.date || v.scheduledDate) < now || v.status === 'completed' || v.status === 'cancelled'));
    } else {
      setFiltered(visits);
    }
  }, [filter, visits]);

  const handleComplete = async () => {
    if (!completeVisitData) return;
    try {
      await completeVisit(completeVisitData._id);
      toast.success('Visit marked as completed');
      setShowCompleteModal(false);
      setNotes('');
      fetchVisits();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to complete visit');
    }
  };

  const columns = [
    { key: 'customer', label: 'Customer', render: r => r.customer?.name || r.name || '-' },
    { key: 'plot', label: 'Plot', render: r => r.plot?.plotNumber || r.plotNumber || '-' },
    { key: 'project', label: 'Project', render: r => r.project?.name || r.projectName || '-' },
    { key: 'date', label: 'Date', render: r => new Date(r.date || r.scheduledDate).toLocaleDateString() },
    { key: 'time', label: 'Time', render: r => r.time || r.slot || '-' },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status?.replace(/_/g, ' ')}</span> },
    { key: 'actions', label: 'Actions', render: r => (
      r.status === 'scheduled' || r.status === 'confirmed' ? (
        <button
          onClick={() => { setCompleteVisitData(r); setNotes(''); setShowCompleteModal(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-medium transition-colors"
        >
          <FaCheckCircle /> Complete
        </button>
      ) : <span className="text-xs text-slate-400">—</span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Site Visits</h1>
        <p className="text-slate-500 text-sm">Manage your scheduled site visits</p>
      </div>

      <div className="flex items-center gap-2">
        {['all', 'upcoming', 'past'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {error ? <ErrorMessage message={error} onRetry={fetchVisits} /> : (
        <DataTable columns={columns} data={filtered} loading={loading} />
      )}

      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowCompleteModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Complete Visit</h2>
              <button onClick={() => setShowCompleteModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600">
                Mark visit for <strong>{completeVisitData?.customer?.name || completeVisitData?.name}</strong> as completed?
              </p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={4}
                placeholder="Visit notes (optional)..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowCompleteModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={handleComplete} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg">Mark Completed</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
