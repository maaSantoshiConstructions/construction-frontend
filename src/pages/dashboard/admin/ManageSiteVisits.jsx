import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaCalendarCheck, FaUserCheck } from 'react-icons/fa';
import { getSiteVisits, updateSiteVisit, confirmVisit, completeVisit } from '../../../api/siteVisits';
import { getUsers } from '../../../api/users';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

const statusColors = {
  pending: 'bg-orange-100 text-orange-700', scheduled: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-green-100 text-green-700', completed: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function ManageSiteVisits() {
  const [visits, setVisits] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVisits = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getSiteVisits({ page: p, limit: 10 });
      setVisits(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load site visits');
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

  useEffect(() => { fetchVisits(); }, [page]);
  useEffect(() => { fetchUsers(); }, []);

  const handleAssign = async (visitId, userId) => {
    try {
      await updateSiteVisit(visitId, { salesExecutive: userId });
      toast.success('Executive assigned');
      fetchVisits();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Assign failed');
    }
  };

  const handleConfirm = async (id) => {
    try {
      await confirmVisit(id);
      toast.success('Visit confirmed');
      fetchVisits();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Confirm failed');
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeVisit(id);
      toast.success('Visit completed');
      fetchVisits();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Complete failed');
    }
  };

  const columns = [
    { key: 'customer', label: 'Customer', render: r => r.customer?.name || r.name || '-' },
    { key: 'plot', label: 'Plot', render: r => r.plot?.plotNumber ? `#${r.plot.plotNumber}` : '-' },
    { key: 'date', label: 'Date', render: r => r.preferredDate ? new Date(r.preferredDate).toLocaleDateString() : r.date ? new Date(r.date).toLocaleDateString() : '-' },
    { key: 'time', label: 'Time', render: r => r.preferredTime || r.time || r.slot || '-' },
    { key: 'visitType', label: 'Type', render: r => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${r.visitType === 'vr' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
        {r.visitType === 'vr' ? 'VR' : 'Physical'}
      </span>
    )},
    { key: 'executive', label: 'Executive', render: r => r.salesExecutive?.name || <span className="text-slate-400 text-xs">Unassigned</span> },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status}</span> },
    { key: 'actions', label: 'Actions', render: r => (
      <div className="flex items-center gap-1">
        {(r.status === 'pending' || r.status === 'scheduled') && (
          <button onClick={() => handleConfirm(r._id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Confirm"><FaCalendarCheck /></button>
        )}
        {r.status === 'confirmed' && (
          <button onClick={() => handleComplete(r._id)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg" title="Complete"><FaCheck /></button>
        )}
        <div className="relative group">
          <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg" title="Assign"><FaUserCheck /></button>
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border py-1 z-50 hidden group-hover:block">
            {users.map(u => (
              <button key={u._id} onClick={() => handleAssign(r._id, u._id)} className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50">{u.name}</button>
            ))}
          </div>
        </div>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Site Visits</h1>
        <p className="text-slate-500 text-sm">Schedule and manage site visits</p>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchVisits()} /> : (
        <>
          <DataTable columns={columns} data={visits} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
