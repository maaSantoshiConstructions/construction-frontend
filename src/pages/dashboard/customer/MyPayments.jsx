import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaDownload, FaFileInvoice } from 'react-icons/fa';
import { getMyPayments, downloadInvoice } from '../../../api/payments';
import DataTable from '../../../components/common/DataTable';
import ErrorMessage from '../../../components/common/ErrorMessage';

const paymentStatusColors = {
  pending: 'bg-amber-100 text-amber-700',
  partial: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-amber-100 text-amber-700',
};

export default function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getMyPayments();
      setPayments(res?.data || res || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleDownloadInvoice = async (paymentId) => {
    try {
      const { data } = await downloadInvoice(paymentId);
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${paymentId.slice(-6)}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded');
    } catch {
      toast.error('Failed to download invoice');
    }
  };

  const totalPaid = payments.filter(p => p.status === 'paid' || p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);

  const columns = [
    { key: 'date', label: 'Date', render: r => new Date(r.createdAt || r.date || r.paymentDate).toLocaleDateString() },
    { key: 'description', label: 'Description', render: r => r.description || r.purpose || `Payment #${r._id?.slice(-6) || ''}` },
    { key: 'amount', label: 'Amount', render: r => <span className="font-medium">₹{(r.amount || 0).toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status?.replace(/_/g, ' ')}</span> },
    { key: 'receipt', label: 'Receipt', render: r => (
      <button onClick={() => handleDownloadInvoice(r._id)} className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 text-xs font-medium">
        <FaDownload /> Invoice
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Payments</h1>
        <p className="text-slate-500 text-sm">View your payment history and download invoices</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><FaFileInvoice className="text-emerald-600" /></div>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{totalPaid.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-0.5">Total Paid</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><FaFileInvoice className="text-amber-600" /></div>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{totalPending.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-0.5">Pending Payments</p>
        </motion.div>
      </div>

      {error ? <ErrorMessage message={error} onRetry={fetchPayments} /> : (
        <DataTable columns={columns} data={payments} loading={loading} />
      )}
    </div>
  );
}
