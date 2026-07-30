import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  LuGift,
  LuCircleCheck,
  LuPencil,
  LuUserCheck,
  LuStickyNote,
  LuX,
  LuSearch,
  LuPhone,
  LuAward,
} from 'react-icons/lu';
import { getLeads, updateLead, assignLead, addNote } from '../../../api/leads';
import { getUsers } from '../../../api/users';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

const statusColors = {
  new: 'bg-orange-100 text-orange-700',
  contacted: 'bg-amber-100 text-amber-700',
  interested: 'bg-amber-100 text-amber-700',
  site_visit_done: 'bg-indigo-100 text-indigo-700',
  negotiation: 'bg-purple-100 text-purple-700',
  booking_done: 'bg-emerald-100 text-emerald-700 font-semibold',
  commission_paid: 'bg-green-100 text-green-800 font-bold',
  lost: 'bg-red-100 text-red-700',
};

export default function ManageReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [commissionAmount, setCommissionAmount] = useState('');

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteLead, setNoteLead] = useState(null);
  const [noteText, setNoteText] = useState('');

  const fetchReferrals = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch leads that have source: customer_referral or referral
      const params = { page: p, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const { data: res } = await getLeads(params);
      const allLeads = res?.data || [];
      // Filter for referral leads
      const referralLeads = allLeads.filter(
        (l) =>
          l.source === 'customer_referral' ||
          l.source === 'referral' ||
          l.referredBy ||
          l.referrerInfo?.name
      );

      setReferrals(referralLeads);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load referrals');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: res } = await getUsers({ limit: 100 });
      const staff = (res?.data || []).filter((u) =>
        ['super_admin', 'company_admin', 'sales_executive'].includes(u.role)
      );
      setUsers(staff);
    } catch {}
  };

  useEffect(() => {
    fetchReferrals();
  }, [page, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAssign = async (leadId, userId) => {
    try {
      await assignLead(leadId, userId);
      toast.success('Sales Executive assigned');
      fetchReferrals();
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
      fetchReferrals();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add note');
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    try {
      const payload = { status: newStatus };
      if (commissionAmount) {
        payload.commissionAmount = Number(commissionAmount);
      }
      await updateLead(selectedLead._id, payload);
      toast.success('Referral status updated');
      setShowStatusModal(false);
      setCommissionAmount('');
      fetchReferrals();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    }
  };

  // Stats calculation
  const totalCount = referrals.length;
  const convertedCount = referrals.filter((r) => r.status === 'booking_done' || r.status === 'commission_paid').length;
  const paidCount = referrals.filter((r) => r.status === 'commission_paid').length;

  const columns = [
    {
      key: 'friendName',
      label: 'Referred Friend',
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-900 block">{r.name || '-'}</span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <LuPhone size={11} /> {r.phone || '-'}
          </span>
        </div>
      ),
    },
    {
      key: 'referredBy',
      label: 'Referred By (Referrer)',
      render: (r) => {
        if (r.referredBy) {
          return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-xs">
              <span className="font-bold text-emerald-800 block flex items-center gap-1">
                <LuUserCheck size={13} /> {r.referredBy.name}
              </span>
              <span className="text-slate-500 font-mono">
                {r.referredBy.phone || r.referralCode || r.referredBy.email || '-'}
              </span>
            </div>
          );
        }
        if (r.referrerInfo?.name) {
          return (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs">
              <span className="font-bold text-amber-800 block">{r.referrerInfo.name}</span>
              <span className="text-slate-500 font-mono">{r.referrerInfo.phone || '-'}</span>
            </div>
          );
        }
        return <span className="text-slate-400 text-xs">Guest / Unknown</span>;
      },
    },
    {
      key: 'code',
      label: 'Ref Code',
      render: (r) => (
        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold">
          {r.referralCode || r.referredBy?.referralCode || '-'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>
          {r.status?.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'commission',
      label: 'Reward Payout',
      render: (r) => (
        <div className="text-xs">
          {r.commissionAmount ? (
            <span className="font-bold text-emerald-700">₹{r.commissionAmount.toLocaleString()}</span>
          ) : (
            <span className="text-slate-400">1% (Pending)</span>
          )}
        </div>
      ),
    },
    {
      key: 'assignedTo',
      label: 'Assigned Sales Exec',
      render: (r) => (
        <span className="text-xs text-slate-700">
          {r.assignedTo?.name || <span className="text-slate-400 italic">Unassigned</span>}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setSelectedLead(r);
              setNewStatus(r.status || '');
              setCommissionAmount(r.commissionAmount || '');
              setShowStatusModal(true);
            }}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Update Referral & Payout Status"
          >
            <LuPencil size={16} />
          </button>

          <div className="relative group">
            <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Assign Executive">
              <LuUserCheck size={16} />
            </button>
            <div className="absolute right-0 bottom-full mb-1 w-52 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 hidden group-hover:block">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">Assign Executive</div>
              {users.map((u) => (
                <button
                  key={u._id}
                  onClick={() => handleAssign(r._id, u._id)}
                  className="block w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  {u.name} <span className="text-[10px] text-slate-400 font-normal">({u.role?.replace(/_/g, ' ')})</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setNoteLead(r);
              setNoteText('');
              setShowNoteModal(true);
            }}
            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Add Note"
          >
            <LuStickyNote size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LuGift className="text-indigo-600" /> Manage Referrals &amp; Rewards
          </h1>
          <p className="text-slate-500 text-sm">Track customer referrals, referrer attributions, and cash reward payouts.</p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
            <LuGift size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Referrals</p>
            <p className="text-2xl font-extrabold text-slate-900">{totalCount}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            <LuCircleCheck size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Converted Bookings</p>
            <p className="text-2xl font-extrabold text-slate-900">{convertedCount}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-xl">
            <LuAward size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Rewards Paid Out</p>
            <p className="text-2xl font-extrabold text-slate-900">{paidCount}</p>
          </div>
        </motion.div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative w-full sm:w-72">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by friend or referrer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchReferrals(1)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="booking_done">Booking Done</option>
            <option value="commission_paid">Commission Paid</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      {error ? (
        <ErrorMessage message={error} onRetry={() => fetchReferrals()} />
      ) : (
        <>
          <DataTable columns={columns} data={referrals} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* UPDATE STATUS & PAYOUT MODAL */}
      {showStatusModal && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowStatusModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Update Referral Status &amp; Payout</h2>
              <button onClick={() => setShowStatusModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <LuX />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Referral Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="interested">Interested</option>
                  <option value="site_visit_done">Site Visit Done</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="booking_done">Booking Done (Eligible for Reward)</option>
                  <option value="commission_paid">Commission Paid (Disbursed)</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Commission Payout Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 25000"
                  value={commissionAmount}
                  onChange={(e) => setCommissionAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowStatusModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button type="button" onClick={handleStatusUpdate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg">
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* NOTE MODAL */}
      {showNoteModal && noteLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowNoteModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Add Referral Note</h2>
              <button onClick={() => setShowNoteModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <LuX />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Note</label>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Spoke to friend, site visit scheduled for Saturday"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowNoteModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button type="button" onClick={handleAddNote} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg">
                  Add Note
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
