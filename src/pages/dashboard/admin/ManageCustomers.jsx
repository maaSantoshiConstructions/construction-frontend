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
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 text-sm font-bold">{r.user?.name?.charAt(0) || '?'}</div>
        <span className="font-medium text-slate-800">{r.user?.name || '-'}</span>
      </div>
    )},
    { key: 'email', label: 'Email', render: r => r.user?.email || '-' },
    { key: 'phone', label: 'Phone', render: r => r.user?.phone || '-' },
    { key: 'properties', label: 'Properties', render: r => (r.booking ? 1 : 0) },
    { key: 'totalPaid', label: 'Total Paid', render: r => `₹${(r.totalPaid || 0).toLocaleString('en-IN')}` },
    { key: 'actions', label: 'Actions', render: r => (
      <button onClick={() => setViewCustomer(r)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg"><FaEye /></button>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
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

      {/* Customer Details Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" onClick={() => setViewCustomer(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Customer Details</h2>
              <button onClick={() => setViewCustomer(null)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 text-xl font-bold">{viewCustomer.user?.name?.charAt(0) || '?'}</div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{viewCustomer.user?.name || '-'}</h3>
                  <p className="text-sm text-slate-500">{viewCustomer.user?.email || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Phone:</span><p className="font-medium text-slate-800">{viewCustomer.user?.phone || '-'}</p></div>
                <div><span className="text-slate-500">Total Paid:</span><p className="font-medium text-green-600">₹{(viewCustomer.totalPaid || 0).toLocaleString('en-IN')}</p></div>
                <div><span className="text-slate-500">Properties:</span><p className="font-medium text-slate-800">{viewCustomer.booking ? 1 : 0}</p></div>
                <div><span className="text-slate-500">Joined:</span><p className="text-slate-850">{viewCustomer.createdAt ? new Date(viewCustomer.createdAt).toLocaleDateString() : '-'}</p></div>
              </div>

              {viewCustomer.booking && (
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="font-bold text-slate-800 text-sm mb-3">Active Purchased Property</h3>
                  <div className="border border-slate-150 rounded-xl p-4 bg-slate-50 text-sm grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 block text-xs">Booking ID:</span>
                      <span className="font-semibold text-slate-800">#{viewCustomer.booking.bookingId || viewCustomer.booking._id?.slice(-6)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs">Booking Status:</span>
                      <span className="capitalize font-semibold text-indigo-700">{viewCustomer.booking.status}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs">Assigned Project:</span>
                      <span className="font-medium text-slate-800">{viewCustomer.project?.name || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs">Assigned Plot:</span>
                      <span className="font-semibold text-slate-800">Plot #{viewCustomer.plot?.plotNumber || '-'}</span>
                    </div>
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
