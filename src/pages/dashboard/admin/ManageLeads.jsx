import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEye, FaEdit, FaTimes, FaUserCheck, FaStickyNote } from 'react-icons/fa';
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
  website: 'bg-orange-100 text-orange-700', website_contact: 'bg-orange-100 text-orange-700', referral: 'bg-green-100 text-green-700',
  walk_in: 'bg-amber-100 text-amber-700', call: 'bg-orange-100 text-orange-700',
  social_media: 'bg-pink-100 text-pink-700', partner: 'bg-amber-100 text-amber-700',
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
      setLeads(res?.data || []);
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
    { key: 'name', label: 'Name', render: r => <span className="font-medium text-slate-800">{r.name}</span> },
    { key: 'phone', label: 'Phone', render: r => r.phone || '-' },
    { key: 'source', label: 'Source', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sourceColors[r.source] || 'bg-slate-100 text-slate-600'}`}>{r.source?.replace(/_/g, ' ') || '-'}</span> },
    { key: 'project', label: 'Project', render: r => r.project?.name || r.projectName || '-' },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status?.replace(/_/g, ' ')}</span> },
    { key: 'score', label: 'Score', render: r => r.score ? <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${scoreColors[r.score] || 'bg-slate-100 text-slate-600'}`}>{r.score}</span> : '-' },
    { key: 'assignedTo', label: 'Assigned To', render: r => {
      if (!r.assignedTo) return <span className="text-slate-400 text-xs">Unassigned</span>;
      return <span>{r.assignedTo.name || r.assignedTo}</span>;
    }},
    { key: 'followUp', label: 'Follow-up', render: r => r.nextFollowUp ? new Date(r.nextFollowUp).toLocaleDateString() : '-' },
    { key: 'actions', label: 'Actions', render: r => (
      <div className="flex items-center gap-1">
        <button onClick={() => { setStatusLead(r); setNewStatus(r.status || ''); setShowStatusModal(true); }} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg" title="Update Status"><FaEdit /></button>
        <div className="relative group">
          <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg" title="Assign"><FaUserCheck /></button>
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border py-1 z-50 hidden group-hover:block">
            {users.map(u => (
              <button key={u._id} onClick={() => handleAssign(r._id, u._id)} className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50">{u.name}</button>
            ))}
          </div>
        </div>
        <button onClick={() => { setNoteLead(r); setNoteText(''); setShowNoteModal(true); }} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg" title="Add Note"><FaStickyNote /></button>
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
