import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaTimes } from 'react-icons/fa';
import { getCustomers } from '../../../api/customers';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewCustomer, setViewCustomer] = useState(null);

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
    { key: 'name', label: 'Name', render: r => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-sm font-bold">{r.name?.charAt(0) || '?'}</div>
        <span className="font-medium text-slate-800">{r.name}</span>
      </div>
    )},
    { key: 'email', label: 'Email', render: r => r.email || '-' },
    { key: 'phone', label: 'Phone', render: r => r.phone || '-' },
    { key: 'properties', label: 'Properties', render: r => r.bookings?.length || r.properties || 0 },
    { key: 'totalPaid', label: 'Total Paid', render: r => `₹${(r.totalPaid || 0).toLocaleString()}` },
    { key: 'actions', label: 'Actions', render: r => (
      <button onClick={() => setViewCustomer(r)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><FaEye /></button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Customers</h1>
        <p className="text-slate-500 text-sm">View customer information and purchase history</p>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchCustomers()} /> : (
        <>
          <DataTable columns={columns} data={customers} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {viewCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setViewCustomer(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Customer Details</h2>
              <button onClick={() => setViewCustomer(null)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xl font-bold">{viewCustomer.name?.charAt(0) || '?'}</div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{viewCustomer.name}</h3>
                  <p className="text-sm text-slate-500">{viewCustomer.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Phone:</span><p className="font-medium">{viewCustomer.phone || '-'}</p></div>
                <div><span className="text-slate-500">Total Paid:</span><p className="font-medium text-green-600">₹{(viewCustomer.totalPaid || 0).toLocaleString()}</p></div>
                <div><span className="text-slate-500">Properties:</span><p className="font-medium">{viewCustomer.bookings?.length || viewCustomer.properties || 0}</p></div>
                <div><span className="text-slate-500">Joined:</span><p>{viewCustomer.createdAt ? new Date(viewCustomer.createdAt).toLocaleDateString() : '-'}</p></div>
              </div>

              {viewCustomer.bookings?.length > 0 && (
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Purchase History</h3>
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Project</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Plot</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Amount</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Status</th></tr>
                      </thead>
                      <tbody>
                        {viewCustomer.bookings.map((b, i) => (
                          <tr key={i} className="border-t border-slate-100">
                            <td className="px-3 py-2">{b.project?.name || b.plot?.project?.name || '-'}</td>
                            <td className="px-3 py-2">#{b.plot?.plotNumber || '-'}</td>
                            <td className="px-3 py-2">₹{(b.totalAmount || b.amount || 0).toLocaleString()}</td>
                            <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-xs font-medium ${b.status === 'completed' ? 'bg-green-100 text-green-700' : b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{b.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
