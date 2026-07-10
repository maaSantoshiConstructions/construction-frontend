import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaSearch, FaEdit, FaStickyNote, FaTimes } from 'react-icons/fa';
import { getMyLeads, updateLead, addNote } from '../../../api/leads';
import DataTable from '../../../components/common/DataTable';
import ErrorMessage from '../../../components/common/ErrorMessage';

const statusColors = {
  new: 'bg-orange-100 text-orange-700', contacted: 'bg-amber-100 text-amber-700',
  interested: 'bg-amber-100 text-amber-700', site_visit_done: 'bg-amber-100 text-amber-700',
  negotiation: 'bg-orange-100 text-orange-700', booking_done: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};

const scoreColors = {
  Hot: 'bg-red-100 text-red-700', Warm: 'bg-amber-100 text-amber-700', Cold: 'bg-orange-100 text-orange-700',
};

export default function MyLeads() {
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusLead, setStatusLead] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteLead, setNoteLead] = useState(null);
  const [noteText, setNoteText] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getMyLeads();
      const items = res?.data || res || [];
      setLeads(items);
      setFiltered(items);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(leads.filter(l =>
      l.name?.toLowerCase().includes(q) ||
      l.phone?.includes(q) ||
      l.project?.name?.toLowerCase().includes(q) ||
      l.projectName?.toLowerCase().includes(q)
    ));
  }, [search, leads]);

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    try {
      await updateLead(statusLead._id, { status: newStatus });
      toast.success('Status updated');
      setShowStatusModal(false);
      fetchLeads();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      await addNote(noteLead._id, noteText);
      toast.success('Note added');
      setShowNoteModal(false);
      setNoteText('');
      fetchLeads();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add note');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', render: r => <span className="font-medium text-slate-800">{r.name}</span> },
    { key: 'phone', label: 'Phone', render: r => r.phone || '-' },
    { key: 'project', label: 'Project', render: r => r.project?.name || r.projectName || '-' },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status?.replace(/_/g, ' ')}</span> },
    { key: 'score', label: 'Score', render: r => r.score ? <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${scoreColors[r.score] || 'bg-slate-100 text-slate-600'}`}>{r.score}</span> : '-' },
    { key: 'followUp', label: 'Follow-up', render: r => r.nextFollowUp ? new Date(r.nextFollowUp).toLocaleDateString() : '-' },
    { key: 'actions', label: 'Actions', render: r => (
      <div className="flex items-center gap-1">
        <button onClick={() => { setStatusLead(r); setNewStatus(r.status || ''); setShowStatusModal(true); }} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg" title="Update Status"><FaEdit /></button>
        <button onClick={() => { setNoteLead(r); setNoteText(''); setShowNoteModal(true); }} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg" title="Add Note"><FaStickyNote /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Leads</h1>
        <p className="text-slate-500 text-sm">Leads assigned to you</p>
      </div>

      <div className="relative max-w-xs">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          placeholder="Search leads..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {error ? <ErrorMessage message={error} onRetry={fetchLeads} /> : (
        <DataTable columns={columns} data={filtered} loading={loading} />
      )}

      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Update Status</h2>
              <button onClick={() => setShowStatusModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Select Status</option>
                {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowStatusModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={handleStatusUpdate} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg">Update</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Add Note</h2>
              <button onClick={() => setShowNoteModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={4} placeholder="Enter your note..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowNoteModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={handleAddNote} disabled={!noteText.trim()} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-sm font-medium rounded-lg">Save Note</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
