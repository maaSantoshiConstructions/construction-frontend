import { useState, useEffect } from 'react';
import { FaEye, FaSearch } from 'react-icons/fa';
import { getCustomers } from '../../../api/customers';
import DataTable from '../../../components/common/DataTable';
import ErrorMessage from '../../../components/common/ErrorMessage';

const bookingStatusColors = {
  token: 'bg-purple-100 text-purple-700',
  partial: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function MyCustomers() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getCustomers({ limit: 100 });
      const items = res?.data || res || [];
      setCustomers(items);
      setFiltered(items);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(customers.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.project?.name?.toLowerCase().includes(q)
    ));
  }, [search, customers]);

  const columns = [
    { key: 'name', label: 'Name', render: r => <span className="font-medium text-slate-800">{r.name}</span> },
    { key: 'phone', label: 'Phone', render: r => r.phone || '-' },
    { key: 'email', label: 'Email', render: r => r.email || '-' },
    { key: 'project', label: 'Project', render: r => r.project?.name || r.projectName || '-' },
    { key: 'bookingStatus', label: 'Booking Status', render: r => (
      r.bookingStatus ? (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bookingStatusColors[r.bookingStatus] || 'bg-slate-100 text-slate-600'}`}>
          {r.bookingStatus?.replace(/_/g, ' ')}
        </span>
      ) : <span className="text-xs text-slate-400">No booking</span>
    )},
    { key: 'actions', label: 'Actions', render: r => (
      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details"><FaEye /></button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Customers</h1>
        <p className="text-slate-500 text-sm">View customers you&apos;ve worked with</p>
      </div>

      <div className="relative max-w-xs">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error ? <ErrorMessage message={error} onRetry={fetchCustomers} /> : (
        <DataTable columns={columns} data={filtered} loading={loading} />
      )}
    </div>
  );
}
