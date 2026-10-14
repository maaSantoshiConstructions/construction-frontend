import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEdit, FaTimes, FaUserCheck, FaStickyNote } from 'react-icons/fa';
import { getLeads, updateLead, assignLead, addNote } from '../../../api/leads';
import { getUsers } from '../../../api/users';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
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

const sourceColors = {
  website: 'bg-orange-100 text-orange-700',
  website_contact: 'bg-orange-100 text-orange-700',
  website_register: 'bg-green-100 text-green-800 font-semibold',
  referral: 'bg-green-100 text-green-700',
  customer_referral: 'bg-emerald-100 text-emerald-700 font-semibold',
  walk_in: 'bg-amber-100 text-amber-700',
  call: 'bg-orange-100 text-orange-700',
  social_media: 'bg-pink-100 text-pink-700',
  partner: 'bg-amber-100 text-amber-700',
};

export default function ManageLeads() {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteLead, setNoteLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusLead, setStatusLead] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchLeads = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getLeads({ page: p, limit: 10 });
      const rawLeads = res?.data || [];
      // Filter out referral leads (managed exclusively under /admin/referrals)
      const generalLeads = rawLeads.filter(
        (l) => l.source !== 'customer_referral' && l.source !== 'referral' && !l.referredBy
      );
      setLeads(generalLeads);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: res } = await getUsers({ limit: 100 });
      const staff = (res?.data || []).filter(u => ['super_admin', 'company_admin', 'sales_executive'].includes(u.role));
      setUsers(staff);
    } catch {}
  };

  useEffect(() => { fetchLeads(); }, [page]);
  useEffect(() => { fetchUsers(); }, []);

  const handleAssign = async (leadId, userId) => {
    try {
      await assignLead(leadId, userId);
      toast.success('Lead assigned');
      fetchLeads();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Assign failed');
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

  const columns = [
    { key: 'name', label: 'Name', render: r => <span className="font-semibold text-slate-800">{r.name}</span> },
    { key: 'phone', label: 'Phone', render: r => <span className="font-mono text-slate-700">{r.phone || '-'}</span> },
    { key: 'source', label: 'Source', render: r => <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sourceColors[r.source] || 'bg-slate-100 text-slate-600'}`}>{r.source?.replace(/_/g, ' ') || '-'}</span> },
    { key: 'status', label: 'Status', render: r => <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status?.replace(/_/g, ' ')}</span> },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex items-center gap-1.5">
        <button onClick={() => { setStatusLead(r); setNewStatus(r.status || ''); setShowStatusModal(true); }} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Update Status"><FaEdit size={16} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Leads</h1>
        <p className="text-slate-500 text-sm">Track and manage sales leads</p>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchLeads()} /> : (
        <>
          <DataTable columns={columns} data={leads} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
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
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
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
