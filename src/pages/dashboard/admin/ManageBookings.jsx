import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEye, FaTimes, FaBan } from 'react-icons/fa';
import { getBookings, updateBooking, cancelBooking } from '../../../api/bookings';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

const statusColors = {
  token: 'bg-purple-100 text-purple-700',
  partial: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewBooking, setViewBooking] = useState(null);

  const fetchBookings = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getBookings({ page: p, limit: 10 });
      setBookings(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [page]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cancel failed');
    }
  };

  const columns = [
    { key: 'bookingId', label: 'Booking ID', render: r => <span className="font-medium text-blue-600">#{r.bookingId || r._id?.slice(-6)}</span> },
    { key: 'customer', label: 'Customer', render: r => r.customer?.name || '-' },
    { key: 'plot', label: 'Plot #', render: r => r.plot?.plotNumber ? `#${r.plot.plotNumber}` : '-' },
    { key: 'project', label: 'Project', render: r => r.project?.name || r.plot?.project?.name || '-' },
    { key: 'amount', label: 'Amount', render: r => `₹${(r.totalAmount || r.amount || 0).toLocaleString()}` },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status}</span> },
    { key: 'date', label: 'Date', render: r => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-' },
    { key: 'actions', label: 'Actions', render: r => (
      <div className="flex items-center gap-2">
        <button onClick={() => setViewBooking(r)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><FaEye /></button>
        {r.status !== 'cancelled' && r.status !== 'completed' && (
          <button onClick={() => handleCancel(r._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FaBan /></button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Bookings</h1>
        <p className="text-slate-500 text-sm">View and manage customer bookings</p>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchBookings()} /> : (
        <>
          <DataTable columns={columns} data={bookings} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {viewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setViewBooking(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Booking Details</h2>
              <button onClick={() => setViewBooking(null)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Booking ID:</span><p className="font-medium">#{viewBooking.bookingId || viewBooking._id?.slice(-6)}</p></div>
                <div><span className="text-slate-500">Status:</span><p><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[viewBooking.status] || ''}`}>{viewBooking.status}</span></p></div>
                <div><span className="text-slate-500">Customer:</span><p className="font-medium">{viewBooking.customer?.name || '-'}</p></div>
                <div><span className="text-slate-500">Email:</span><p>{viewBooking.customer?.email || '-'}</p></div>
                <div><span className="text-slate-500">Phone:</span><p>{viewBooking.customer?.phone || '-'}</p></div>
                <div><span className="text-slate-500">Plot #:</span><p className="font-medium">{viewBooking.plot?.plotNumber ? `#${viewBooking.plot.plotNumber}` : '-'}</p></div>
                <div><span className="text-slate-500">Project:</span><p>{viewBooking.project?.name || viewBooking.plot?.project?.name || '-'}</p></div>
                <div><span className="text-slate-500">Total Amount:</span><p className="font-medium">₹{(viewBooking.totalAmount || viewBooking.amount || 0).toLocaleString()}</p></div>
                <div><span className="text-slate-500">Paid Amount:</span><p>₹{(viewBooking.paidAmount || 0).toLocaleString()}</p></div>
                <div><span className="text-slate-500">Date:</span><p>{viewBooking.createdAt ? new Date(viewBooking.createdAt).toLocaleDateString() : '-'}</p></div>
              </div>

              {viewBooking.installments?.length > 0 && (
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Installments</h3>
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">#</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Amount</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Due Date</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Status</th></tr>
                      </thead>
                      <tbody>
                        {viewBooking.installments.map((inst, i) => (
                          <tr key={i} className="border-t border-slate-100">
                            <td className="px-3 py-2">{i + 1}</td>
                            <td className="px-3 py-2">₹{inst.amount?.toLocaleString()}</td>
                            <td className="px-3 py-2">{inst.dueDate ? new Date(inst.dueDate).toLocaleDateString() : '-'}</td>
                            <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-xs font-medium ${inst.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{inst.paid ? 'Paid' : 'Pending'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {viewBooking.documents?.length > 0 && (
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Documents</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewBooking.documents.map((doc, i) => (
                      <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100">{doc.name || `Doc ${i + 1}`}</a>
                    ))}
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
