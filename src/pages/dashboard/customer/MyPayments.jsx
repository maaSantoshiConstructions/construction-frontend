import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaDownload, FaCheckCircle, FaExclamationCircle, FaFilter } from 'react-icons/fa';
import { getMyPayments, downloadReceipt } from '../../../api/payments';
import { getMyBookings } from '../../../api/bookings';
import DataTable from '../../../components/common/DataTable';
import ErrorMessage from '../../../components/common/ErrorMessage';

import { TXSTATUS_COLORS, TYPE_LABELS, TYPE_COLORS } from '../../../constants/statusStyles';
import { fmt, fmtDate } from '../../../utils/formatters';
import { downloadBlobFile } from '../../../utils/download';

export default function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: pRes }, { data: bRes }] = await Promise.all([
        getMyPayments(),
        getMyBookings(),
      ]);

      const rawPayments = pRes?.data || pRes || [];
      // Default Sort: Newest Payment First
      const sortedPayments = [...rawPayments].sort((a, b) =>
        new Date(b.paidAt || b.createdAt) - new Date(a.paidAt || a.createdAt)
      );

      setPayments(sortedPayments);
      setBookings(bRes?.data || bRes || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDownloadReceipt = async (paymentId, paymentIdStr) => {
    try {
      const res = await downloadReceipt(paymentId);
      downloadBlobFile(res.data, `receipt-${paymentIdStr || paymentId.slice(-6)}.pdf`, 'application/pdf');
      toast.success('Receipt downloaded');
    } catch {
      toast.error('Failed to download receipt');
    }
  };

  // Calculations
  const totalPaid = payments
    .filter((p) => (p.transactionStatus === 'success' || p.status === 'completed' || p.status === 'paid'))
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalRemaining = bookings.reduce((sum, b) => {
    const tot = b.totalAmount || b.amount || 0;
    const paid = b.paidAmount || 0;
    const rem = b.remainingAmount ?? Math.max(0, tot - paid);
    return sum + rem;
  }, 0);

  // Filtered Payments
  const filteredPayments = payments.filter((p) => {
    if (statusFilter === 'all') return true;
    const st = p.transactionStatus || p.status || 'success';
    return st === statusFilter;
  });

  const columns = [
    {
      key: 'paymentId', label: 'Payment ID',
      render: (r) => (
        <span className="font-mono text-xs font-bold text-amber-700">
          {r.paymentId || `#${r._id?.slice(-6)}`}
        </span>
      ),
    },
    {
      key: 'date', label: 'Date',
      render: (r) => <span className="text-slate-600 text-xs font-medium whitespace-nowrap">{fmtDate(r.paidAt || r.createdAt)}</span>,
    },
    {
      key: 'paymentType', label: 'Payment Type',
      render: (r) => (
        <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${TYPE_COLORS[r.paymentType] || 'bg-slate-100 text-slate-700'}`}>
          {TYPE_LABELS[r.paymentType] || r.paymentType?.replace(/_/g, ' ') || 'Payment'}
        </span>
      ),
    },
    {
      key: 'amount', label: 'Amount',
      render: (r) => {
        const isCancelled = r.transactionStatus === 'cancelled' || r.transactionStatus === 'refunded';
        return (
          <span className={`font-bold ${isCancelled ? 'line-through text-slate-400' : 'text-slate-800'}`}>
            ₹{fmt(r.amount)}
          </span>
        );
      },
    },
    {
      key: 'paymentMethod', label: 'Payment Mode',
      render: (r) => <span className="capitalize text-slate-700 text-xs font-medium">{r.paymentMethod?.replace(/_/g, ' ') || '—'}</span>,
    },
    {
      key: 'status', label: 'Status',
      render: (r) => {
        const st = r.transactionStatus || (r.status === 'completed' || r.status === 'paid' ? 'success' : r.status) || 'success';
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${TXSTATUS_COLORS[st] || 'bg-slate-100 text-slate-600'}`}>
            {st}
          </span>
        );
      },
    },
    {
      key: 'receipt', label: 'Receipt',
      render: (r) => (
        <button
          onClick={() => handleDownloadReceipt(r._id, r.paymentId)}
          className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold transition-all"
        >
          <FaDownload className="text-xs" /> Download Receipt
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Payments</h1>
          <p className="text-slate-500 text-sm mt-0.5">Complete history of all your plot payment receipts</p>
        </div>
      </div>

      {/* Summary Cards: Total Paid & Remaining Amount (Pending Payments Removed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Total Paid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 flex items-center gap-4 shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <FaCheckCircle />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Total Paid</span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-0.5">₹{fmt(totalPaid)}</p>
          </div>
        </motion.div>

        {/* Card 2: Remaining Amount */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-orange-200 bg-orange-50/40 p-5 flex items-center gap-4 shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl shrink-0">
            <FaExclamationCircle />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-800">Remaining Amount</span>
            <p className="text-2xl font-extrabold text-orange-600 mt-0.5">₹{fmt(totalRemaining)}</p>
          </div>
        </motion.div>
      </div>

      {/* Status Filter */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <FaFilter className="text-slate-400 text-xs" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Status:</span>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {['all', 'success', 'cancelled', 'refunded'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Showing {filteredPayments.length} of {payments.length} payments
        </span>
      </div>

      {/* Payment Table */}
      {error ? (
        <ErrorMessage message={error} onRetry={fetchData} />
      ) : (
        <DataTable columns={columns} data={filteredPayments} loading={loading} />
      )}

    </div>
  );
}
