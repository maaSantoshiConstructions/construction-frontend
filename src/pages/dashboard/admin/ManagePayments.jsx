import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FaFilter, FaSearch, FaDownload, FaTimes, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { getPayments, downloadReceipt, cancelPayment, getPaymentStats } from '../../../api/payments';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import CancelPaymentDialog from '../../../components/manage-bookings/CancelPaymentDialog';

const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('en-IN') : '—');
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

const TXSTATUS_COLORS = {
  success:   'bg-emerald-100 text-emerald-700 border border-emerald-200',
  pending:   'bg-amber-100 text-amber-700 border border-amber-200',
  failed:    'bg-red-100 text-red-700 border border-red-200',
  cancelled: 'bg-slate-100 text-slate-500 border border-slate-200',
  refunded:  'bg-violet-100 text-violet-700 border border-violet-200',
};

const TYPE_COLORS = {
  token:             'bg-indigo-100 text-indigo-700',
  installment:       'bg-sky-100 text-sky-700',
  final_payment:     'bg-emerald-100 text-emerald-700',
  loan_disbursement: 'bg-teal-100 text-teal-700',
  refund:            'bg-violet-100 text-violet-700',
};

export default function ManagePayments() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cancelingPayment, setCancelingPayment] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    paymentType: '', paymentMethod: '', transactionStatus: '',
    dateFrom: '', dateTo: '',
  });

  const fetchPayments = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 12 };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data: res } = await getPayments(params);
      setPayments(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  const fetchStats = useCallback(async () => {
    try {
      const { data: res } = await getPaymentStats();
      setStats(res?.data);
    } catch {}
  }, []);

  useEffect(() => { fetchPayments(); fetchStats(); }, [page, filters]);

  const handleDownload = async (paymentId, paymentIdStr) => {
    try {
      const res = await downloadReceipt(paymentId);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${paymentIdStr || paymentId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download receipt');
    }
  };

  // Summary cards
  const totalRevenue = stats?.byStatus?.find((s) => s.transactionStatus === 'success')?.total || 0;
  const totalRefunded = stats?.byStatus?.find((s) => s.transactionStatus === 'refunded')?.total || 0;
  const totalPending = stats?.byStatus?.find((s) => s.transactionStatus === 'pending')?.total || 0;
  const totalCancelled = stats?.byStatus?.find((s) => s.transactionStatus === 'cancelled')?.total || 0;

  const summaryCards = [
    { label: 'Total Revenue', value: `₹${fmt(totalRevenue)}`, color: 'emerald' },
    { label: 'Refunded',      value: `₹${fmt(totalRefunded)}`, color: 'violet' },
    { label: 'Pending',       value: `₹${fmt(totalPending)}`,  color: 'amber' },
    { label: 'Cancelled',     value: `₹${fmt(totalCancelled)}`, color: 'slate' },
  ];

  const colorMap = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    violet:  'bg-violet-50 border-violet-200 text-violet-700',
    amber:   'bg-amber-50 border-amber-200 text-amber-700',
    slate:   'bg-slate-50 border-slate-200 text-slate-600',
  };

  const columns = [
    {
      key: 'paymentId', label: 'Payment ID',
      render: (r) => <span className="font-mono text-xs font-bold text-amber-700">{r.paymentId || `#${r._id?.slice(-6)}`}</span>,
    },
    {
      key: 'booking', label: 'Booking ID',
      render: (r) => r.booking ? (
        <button
          onClick={() => navigate(`/admin/bookings/${r.booking._id}`)}
          className="font-mono text-xs text-indigo-600 hover:underline"
        >
          #{r.booking.bookingId || r.booking._id?.slice(-6)}
        </button>
      ) : '—',
    },
    { key: 'customer', label: 'Customer', render: (r) => r.customer?.name || '—' },
    { key: 'project',  label: 'Project',  render: (r) => r.project?.name || '—' },
    { key: 'plot',     label: 'Plot',     render: (r) => r.plot?.plotNumber ? `#${r.plot.plotNumber}` : '—' },
    {
      key: 'paymentType', label: 'Type',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${TYPE_COLORS[r.paymentType] || 'bg-slate-100 text-slate-600'}`}>
          {r.paymentType?.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'amount', label: 'Amount',
      render: (r) => (
        <span className={`font-bold ${r.transactionStatus === 'cancelled' || r.transactionStatus === 'refunded' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
          ₹{fmt(r.amount)}
        </span>
      ),
    },
    { key: 'paymentMethod', label: 'Mode', render: (r) => <span className="capitalize text-slate-600">{r.paymentMethod?.replace(/_/g, ' ')}</span> },
    { key: 'referenceNumber', label: 'Reference', render: (r) => <span className="font-mono text-xs text-slate-500">{r.referenceNumber || '—'}</span> },
    {
      key: 'transactionStatus', label: 'Status',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TXSTATUS_COLORS[r.transactionStatus] || 'bg-slate-100 text-slate-500'}`}>
          {r.transactionStatus}
        </span>
      ),
    },
    { key: 'collectedBy', label: 'Collected By', render: (r) => r.collectedBy?.name || '—' },
    {
      key: 'paidAt', label: 'Date',
      render: (r) => <span className="text-slate-500 text-xs whitespace-nowrap">{fmtDate(r.paidAt || r.createdAt)}</span>,
    },
    {
      key: 'receipt', label: 'Receipt',
      render: (r) => (
        <button
          onClick={() => handleDownload(r._id, r.paymentId)}
          title="Download Receipt"
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <FaDownload className="text-xs" />
        </button>
      ),
    },
    {
      key: 'actions', label: 'Actions',
      render: (r) => r.transactionStatus === 'success' ? (
        <button
          onClick={() => setCancelingPayment(r)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          <FaTimes className="text-xs" /> Cancel
        </button>
      ) : <span className="text-slate-300 text-xs">—</span>,
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payment Ledger</h1>
          <p className="text-slate-500 text-sm mt-0.5">All financial transactions across all bookings</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all">
            <FaFileExcel className="text-emerald-600" /> Export Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all">
            <FaFilePdf className="text-red-600" /> Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className={`border rounded-2xl p-4 ${colorMap[c.color]}`}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">{c.label}</p>
            <p className="text-xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${showFilters ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-slate-200 text-slate-600'}`}
        >
          <FaFilter className="text-xs" /> Filters
        </button>
        {showFilters && (
          <>
            <select
              value={filters.paymentType}
              onChange={(e) => { setFilters((f) => ({ ...f, paymentType: e.target.value })); setPage(1); }}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="token">Token</option>
              <option value="installment">Installment</option>
              <option value="final_payment">Final Payment</option>
              <option value="loan_disbursement">Loan Disbursement</option>
              <option value="refund">Refund</option>
            </select>
            <select
              value={filters.paymentMethod}
              onChange={(e) => { setFilters((f) => ({ ...f, paymentMethod: e.target.value })); setPage(1); }}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="">All Modes</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="online">Online</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
            </select>
            <select
              value={filters.transactionStatus}
              onChange={(e) => { setFilters((f) => ({ ...f, transactionStatus: e.target.value })); setPage(1); }}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => { setFilters((f) => ({ ...f, dateFrom: e.target.value })); setPage(1); }}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400"
              placeholder="From Date"
            />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => { setFilters((f) => ({ ...f, dateTo: e.target.value })); setPage(1); }}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400"
              placeholder="To Date"
            />
            {Object.values(filters).some(Boolean) && (
              <button
                onClick={() => { setFilters({ paymentType: '', paymentMethod: '', transactionStatus: '', dateFrom: '', dateTo: '' }); setPage(1); }}
                className="px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
              >
                Clear All
              </button>
            )}
          </>
        )}
      </div>

      {/* Table */}
      <DataTable columns={columns} data={payments} loading={loading} />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Cancel / Refund Dialog */}
      {cancelingPayment && (
        <CancelPaymentDialog
          payment={cancelingPayment}
          userRole={user?.role}
          onClose={() => setCancelingPayment(null)}
          onSuccess={() => { setCancelingPayment(null); fetchPayments(); fetchStats(); }}
        />
      )}
    </div>
  );
}
