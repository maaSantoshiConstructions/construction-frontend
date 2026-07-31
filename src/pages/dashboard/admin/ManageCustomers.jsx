import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { getCustomers } from '../../../api/customers';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('en-IN') : '0');

export default function ManageCustomers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getCustomers({ page: p, limit: 10 });
      setCustomers(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, [page]);

  const columns = [
    {
      key: 'name', label: 'Name',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 border border-amber-200 rounded-full flex items-center justify-center text-amber-800 font-bold text-sm shrink-0">
            {r.user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <span className="font-bold text-slate-800 text-sm block">{r.user?.name || '—'}</span>
            <span className="text-xs font-mono text-amber-700">CUST-{r._id?.slice(-6).toUpperCase()}</span>
          </div>
        </div>
      ),
    },
    { key: 'email', label: 'Email', render: (r) => <span className="text-slate-600 text-sm">{r.user?.email || '—'}</span> },
    { key: 'phone', label: 'Phone', render: (r) => <span className="text-slate-600 text-sm font-medium">{r.user?.phone || '—'}</span> },
    {
      key: 'properties', label: 'Properties',
      render: (r) => {
        const count = r.propertiesCount ?? (r.booking ? 1 : 0);
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {count} {count === 1 ? 'Property' : 'Properties'}
          </span>
        );
      },
    },
    {
      key: 'totalPaid', label: 'Total Paid',
      render: (r) => <span className="font-bold text-emerald-600 text-sm">₹{fmt(r.totalPaid || 0)}</span>,
    },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <button
          onClick={() => navigate(`/admin/customers/${r._id}`)}
          title="View Customer Profile"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-all"
        >
          <FaEye /> View Profile
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Customers</h1>
        <p className="text-slate-500 text-sm mt-0.5">View customer profiles, financial summaries, and property portfolios</p>
      </div>

      {error ? (
        <ErrorMessage message={error} onRetry={() => fetchCustomers()} />
      ) : (
        <>
          <DataTable columns={columns} data={customers} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
