import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { LuGift, LuPencil, LuUserCheck, LuStickyNote, LuPhone } from 'react-icons/lu';
import { getLeads, updateLead, assignLead, addNote } from '../../../api/leads';
import { getUsers } from '../../../api/users';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

// Subcomponents
import ReferralStatsCards from '../../../components/manage-referrals/ReferralStatsCards';
import ReferralFilterToolbar from '../../../components/manage-referrals/ReferralFilterToolbar';
import ReferralStatusModal from '../../../components/manage-referrals/ReferralStatusModal';
import ReferralNoteModal from '../../../components/manage-referrals/ReferralNoteModal';

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
      const params = { page: p, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const { data: res } = await getLeads(params);
      const allLeads = res?.data || [];
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
  const convertedCount = referrals.filter(
    (r) => r.status === 'booking_done' || r.status === 'commission_paid'
  ).length;
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
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            statusColors[r.status] || 'bg-slate-100 text-slate-600'
          }`}
        >
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
            <button
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Assign Executive"
            >
              <LuUserCheck size={16} />
            </button>
            <div className="absolute right-0 bottom-full mb-1 w-52 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 hidden group-hover:block">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                Assign Executive
              </div>
              {users.map((u) => (
                <button
                  key={u._id}
                  onClick={() => handleAssign(r._id, u._id)}
                  className="block w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  {u.name}{' '}
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({u.role?.replace(/_/g, ' ')})
                  </span>
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
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LuGift className="text-indigo-600" /> Manage Referrals &amp; Rewards
          </h1>
          <p className="text-slate-500 text-sm">
            Track customer referrals, referrer attributions, and cash reward payouts.
          </p>
        </div>
      </div>

      {/* STATS CARDS COMPONENT */}
      <ReferralStatsCards
        totalCount={totalCount}
        convertedCount={convertedCount}
        paidCount={paidCount}
      />

      {/* FILTER & SEARCH TOOLBAR COMPONENT */}
      <ReferralFilterToolbar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        onSearchEnter={() => fetchReferrals(1)}
      />

      {/* DATA TABLE */}
      {error ? (
        <ErrorMessage message={error} onRetry={() => fetchReferrals()} />
      ) : (
        <>
          <DataTable columns={columns} data={referrals} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* UPDATE STATUS MODAL COMPONENT */}
      <ReferralStatusModal
        show={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        selectedLead={selectedLead}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        commissionAmount={commissionAmount}
        setCommissionAmount={setCommissionAmount}
        onSave={handleStatusUpdate}
      />

      {/* NOTE MODAL COMPONENT */}
      <ReferralNoteModal
        show={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        noteLead={noteLead}
        noteText={noteText}
        setNoteText={setNoteText}
        onSave={handleAddNote}
      />
    </div>
  );
}
