import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FaArrowLeft, FaEye, FaDownload, FaBuilding, FaUser,
  FaCheckCircle, FaExclamationCircle, FaTimes, FaHistory, FaCalendarAlt,
  FaFolder, FaFileContract, FaClock, FaHardHat, FaHeadset, FaExternalLinkAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { getCustomer } from '../../../api/customers';
import { downloadReceipt } from '../../../api/payments';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import DataTable from '../../../components/common/DataTable';

import { BOOKING_STATUS_COLORS, PAYMENT_STATUS_COLORS, TXSTATUS_COLORS, TYPE_COLORS } from '../../../constants/statusStyles';
import { fmt, fmtDate } from '../../../utils/formatters';

export default function AdminCustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchCustomerData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getCustomer(id);
      setData(res?.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load customer profile');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchCustomerData(); }, [fetchCustomerData]);

  const handleDownloadReceipt = async (paymentId, paymentIdStr) => {
    try {
      const res = await downloadReceipt(paymentId);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${paymentIdStr || paymentId.slice(-6)}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Receipt downloaded');
    } catch {
      toast.error('Failed to download receipt');
    }
  };

  if (loading) return <Loader />;
  if (error || !data || !data.customer) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/admin/customers')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Back to Customers
        </button>
        <ErrorMessage message={error || 'Customer profile not found'} onRetry={fetchCustomerData} />
      </div>
    );
  }

  const customerObj = data.customer;
  const userObj = customerObj.user || {};
  const bookings = data.bookings || [];
  const payments = data.payments || [];
  const siteVisits = data.siteVisits || [];
  const financials = data.financials || {};

  const custName = userObj.name || customerObj.name || 'Customer Profile';
  const custEmail = userObj.email || '—';
  const custPhone = userObj.phone || '—';
  const custCode = `CUST-${customerObj._id.slice(-6).toUpperCase()}`;

  // Single Source of Truth Financials
  const totalPropertiesCount = financials.totalProperties ?? bookings.length;
  const activeBookingsCount = financials.activeBookingsCount ?? bookings.filter((b) => (b.bookingStatus || b.status) === 'active').length;
  const completedBookingsCount = financials.completedBookingsCount ?? bookings.filter((b) => (b.bookingStatus || b.status) === 'completed').length;
  const cancelledBookingsCount = financials.cancelledBookingsCount ?? bookings.filter((b) => (b.bookingStatus || b.status) === 'cancelled').length;

  const totalBookingValue = financials.totalBookingValue ?? bookings.reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0);
  const totalPaid = financials.totalPaid ?? bookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
  const totalOutstanding = financials.totalOutstanding ?? bookings.reduce((sum, b) => sum + (b.remainingAmount || 0), 0);
  const totalRefunded = financials.totalRefunded ?? 0;

  // Assigned Executive
  const salesExec = customerObj.booking?.salesExecutive?.name || bookings[0]?.salesExecutive?.name || '—';

  // ─── PURCHASED PROPERTIES TABLE COLUMNS ─────────────────────────────────────
  const propertyColumns = [
    {
      key: 'bookingId', label: 'Booking ID',
      render: (r) => (
        <span className="font-mono text-xs font-bold text-amber-700">
          #{r.bookingId || r._id?.slice(-6)}
        </span>
      ),
    },
    { key: 'project', label: 'Project', render: (r) => <span className="font-medium text-slate-800">{r.project?.name || '—'}</span> },
    { key: 'plot', label: 'Plot Number', render: (r) => <span className="font-bold text-slate-800">Plot #{r.plot?.plotNumber || '—'}</span> },
    {
      key: 'bookingStatus', label: 'Booking Status',
      render: (r) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${BOOKING_STATUS_COLORS[r.bookingStatus || r.status] || 'bg-slate-100 text-slate-600'}`}>
          {r.bookingStatus || r.status || 'Active'}
        </span>
      ),
    },
    {
      key: 'paymentStatus', label: 'Payment Status',
      render: (r) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${PAYMENT_STATUS_COLORS[r.paymentStatus] || 'bg-slate-100 text-slate-600'}`}>
          {r.paymentStatus?.replace(/_/g, ' ') || 'Token Paid'}
        </span>
      ),
    },
    { key: 'totalAmount', label: 'Total Amount', render: (r) => <span className="font-semibold text-slate-800">₹{fmt(r.totalAmount || r.amount)}</span> },
    { key: 'paidAmount', label: 'Paid Amount', render: (r) => <span className="font-bold text-emerald-600">₹{fmt(r.paidAmount || 0)}</span> },
    {
      key: 'remainingAmount', label: 'Outstanding',
      render: (r) => <span className="font-bold text-orange-600">₹{fmt(r.remainingAmount ?? Math.max(0, (r.totalAmount || 0) - (r.paidAmount || 0)))}</span>,
    },
    { key: 'bookingDate', label: 'Booking Date', render: (r) => <span className="text-xs text-slate-500 whitespace-nowrap">{fmtDate(r.bookingDate || r.createdAt)}</span> },
    {
      key: 'actions', label: 'View Details',
      render: (r) => (
        <button
          onClick={() => navigate(`/admin/bookings/${r._id}`)}
          className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition-colors"
        >
          <FaEye /> View
        </button>
      ),
    },
  ];

  // ─── PAYMENT HISTORY TABLE COLUMNS ─────────────────────────────────────────
  const paymentColumns = [
    {
      key: 'paymentId', label: 'Payment ID',
      render: (r) => <span className="font-mono text-xs font-bold text-amber-700">{r.paymentId || `#${r._id?.slice(-6)}`}</span>,
    },
    {
      key: 'bookingId', label: 'Booking ID',
      render: (r) => (
        <span className="font-mono text-xs text-indigo-600 font-semibold">
          {r.booking?.bookingId ? `#${r.booking.bookingId}` : (r.booking ? `#${r.booking._id?.slice(-6)}` : '—')}
        </span>
      ),
    },
    { key: 'date', label: 'Date', render: (r) => <span className="text-xs text-slate-600 font-medium whitespace-nowrap">{fmtDate(r.paidAt || r.createdAt)}</span> },
    {
      key: 'paymentType', label: 'Type',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${TYPE_COLORS[r.paymentType] || 'bg-slate-100 text-slate-600'}`}>
          {r.paymentType?.replace(/_/g, ' ')}
        </span>
      ),
    },
    { key: 'amount', label: 'Amount', render: (r) => <span className="font-bold text-slate-800">₹{fmt(r.amount)}</span> },
    { key: 'paymentMethod', label: 'Mode', render: (r) => <span className="capitalize text-xs font-medium text-slate-600">{r.paymentMethod?.replace(/_/g, ' ')}</span> },
    {
      key: 'status', label: 'Status',
      render: (r) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${TXSTATUS_COLORS[r.transactionStatus] || 'bg-slate-100 text-slate-600'}`}>
          {r.transactionStatus}
        </span>
      ),
    },
    {
      key: 'receipt', label: 'Receipt',
      render: (r) => (
        <button
          onClick={() => handleDownloadReceipt(r._id, r.paymentId)}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Download Receipt"
        >
          <FaDownload className="text-xs" />
        </button>
      ),
    },
  ];

  // ─── SITE VISITS TABLE COLUMNS ─────────────────────────────────────────────
  const siteVisitColumns = [
    { key: 'visitDate', label: 'Visit Date', render: (r) => <span className="text-xs text-slate-700 font-medium">{fmtDate(r.visitDate || r.date || r.createdAt)}</span> },
    { key: 'project', label: 'Project', render: (r) => <span className="text-xs text-slate-800 font-semibold">{r.project?.name || '—'}</span> },
    { key: 'plot', label: 'Plot Number', render: (r) => <span className="text-xs text-slate-800 font-bold">{r.plot?.plotNumber ? `Plot #${r.plot.plotNumber}` : '—'}</span> },
    {
      key: 'status', label: 'Visit Status',
      render: (r) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 capitalize">
          {r.status || 'Scheduled'}
        </span>
      ),
    },
  ];

  // ─── STEP 7: CHRONOLOGICAL ACTIVITY TIMELINE (From this customer only) ─────
  const timelineEvents = [
    {
      title: 'Customer Registered',
      desc: `${custName} registered account in system`,
      date: fmtDate(userObj.createdAt || customerObj.createdAt),
      icon: FaUser,
      color: 'bg-indigo-500',
      timestamp: new Date(userObj.createdAt || customerObj.createdAt).getTime(),
    },
    ...siteVisits.map((sv) => ({
      title: 'Site Visit Recorded',
      desc: `Visited ${sv.project?.name || 'Project'} ${sv.plot?.plotNumber ? `(Plot #${sv.plot.plotNumber})` : ''}`,
      date: fmtDate(sv.visitDate || sv.date || sv.createdAt),
      icon: FaCalendarAlt,
      color: 'bg-sky-500',
      timestamp: new Date(sv.visitDate || sv.date || sv.createdAt).getTime(),
    })),
    ...bookings.map((b) => ({
      title: `Booking Created (${b.bookingStatus || 'Active'})`,
      desc: `Plot #${b.plot?.plotNumber || ''} booked in ${b.project?.name || 'Project'}`,
      date: fmtDate(b.bookingDate || b.createdAt),
      icon: FaBuilding,
      color: 'bg-amber-500',
      timestamp: new Date(b.bookingDate || b.createdAt).getTime(),
    })),
    ...payments.map((p) => ({
      title: p.transactionStatus === 'refunded' ? 'Refund Processed' : `Payment Recorded (${p.paymentType?.replace(/_/g, ' ')})`,
      desc: `₹${fmt(p.amount)} via ${p.paymentMethod?.replace(/_/g, ' ')} (${p.transactionStatus})`,
      date: fmtDate(p.paidAt || p.createdAt),
      icon: FaCheckCircle,
      color: p.transactionStatus === 'refunded' ? 'bg-violet-500' : (p.transactionStatus === 'cancelled' ? 'bg-slate-400' : 'bg-emerald-500'),
      timestamp: new Date(p.paidAt || p.createdAt).getTime(),
    })),
  ].sort((a, b) => b.timestamp - a.timestamp); // Chronological newest first

  return (
    <div className="space-y-6">

      {/* ─── 11. BREADCRUMB & NAVIGATION ─────────────────────────────────── */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>Dashboard</span>
          <span>&gt;</span>
          <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/admin/customers')}>Customers</span>
          <span>&gt;</span>
          <span className="text-amber-700">Customer Details</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
          <button
            onClick={() => navigate('/admin/customers')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 text-xs font-bold transition-all shadow-xs"
          >
            <FaArrowLeft /> Back to Customers
          </button>

          {/* ─── 9. QUICK ACTIONS ─────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/bookings')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              View Bookings
            </button>
            <button
              onClick={() => navigate('/admin/payments')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              View Payments
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. CUSTOMER PROFILE HEADER ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            {custName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-slate-800">{custName}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {custCode}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-4 flex-wrap">
              <span>✉ {custEmail}</span>
              <span>📞 {custPhone}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 border border-slate-100 rounded-xl p-4 w-full md:w-auto">
          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider">Registration Date</span>
            <span className="font-bold text-slate-800">{fmtDate(userObj.createdAt || customerObj.createdAt)}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider">Assigned Executive</span>
            <span className="font-bold text-slate-800">{salesExec}</span>
          </div>
        </div>
      </div>

      {/* ─── 3. CUSTOMER OVERVIEW STATS ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Properties</span>
          <p className="text-2xl font-extrabold text-slate-800">{totalPropertiesCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">Active Bookings</span>
          <p className="text-2xl font-extrabold text-sky-600">{activeBookingsCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Completed Bookings</span>
          <p className="text-2xl font-extrabold text-emerald-600">{completedBookingsCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider block mb-1">Cancelled Bookings</span>
          <p className="text-2xl font-extrabold text-red-500">{cancelledBookingsCount}</p>
        </div>
      </div>

      {/* ─── 4. FINANCIAL SUMMARY CARDS ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        {/* Total Booking Value */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Booking Value</span>
          <p className="text-xl font-bold text-slate-800">₹{fmt(totalBookingValue)}</p>
        </div>

        {/* Total Paid (Emerald Success) */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">Total Paid</span>
          <p className="text-xl font-extrabold text-emerald-600">₹{fmt(totalPaid)}</p>
        </div>

        {/* Outstanding Amount (Orange Warning) */}
        <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-orange-800 uppercase tracking-wider block mb-1">Outstanding Amount</span>
          <p className="text-xl font-extrabold text-orange-600">₹{fmt(totalOutstanding)}</p>
        </div>

        {/* Total Refunded */}
        <div className="bg-violet-50/70 border border-violet-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-violet-800 uppercase tracking-wider block mb-1">Total Refunded</span>
          <p className="text-xl font-bold text-violet-700">₹{fmt(totalRefunded)}</p>
        </div>

      </div>

      {/* ─── 5. PURCHASED PROPERTIES TABLE ────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">Purchased Properties</h3>
            <p className="text-xs text-slate-400">All plot bookings owned by {custName}</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
            {bookings.length} Property Record(s)
          </span>
        </div>

        {/* STEP 8: VERIFY EMPTY STATES */}
        {bookings.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
            No properties booked by this customer yet.
          </div>
        ) : (
          <DataTable columns={propertyColumns} data={bookings} loading={false} />
        )}
      </div>

      {/* ─── 6. PAYMENT HISTORY & 7. SITE VISITS GRID ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Payment History (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Payment History</h3>
                <p className="text-xs text-slate-400">Recent transactions for this customer</p>
              </div>
              <button
                onClick={() => navigate('/admin/payments')}
                className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
              >
                View All Payments <FaExternalLinkAlt className="text-3xs" />
              </button>
            </div>

            {/* STEP 8: VERIFY EMPTY STATES */}
            {payments.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                No payment transactions recorded for this customer.
              </div>
            ) : (
              <DataTable columns={paymentColumns} data={payments} loading={false} />
            )}
          </div>
        </div>

        {/* 8. CUSTOMER ACTIVITY TIMELINE (1 Column) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
            Activity Timeline
          </h3>

          <div className="space-y-4 pt-1">
            {timelineEvents.map((ev, idx) => {
              const Icon = ev.icon;
              return (
                <div key={idx} className="flex items-start gap-3 relative">
                  <div className={`w-8 h-8 rounded-xl ${ev.color} text-white flex items-center justify-center text-xs shrink-0 shadow-xs`}>
                    <Icon />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{ev.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{ev.desc}</p>
                    <span className="text-3xs font-semibold text-slate-400 mt-0.5 block">{ev.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ─── 7. SITE VISITS SECTION ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
          Site Visits
        </h3>

        {/* STEP 8: VERIFY EMPTY STATES */}
        {siteVisits.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
            No site visits recorded for this customer.
          </div>
        ) : (
          <DataTable columns={siteVisitColumns} data={siteVisits} loading={false} />
        )}
      </div>

      {/* ─── 10. FUTURE READY MODULAR TABS ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
          <h3 className="font-bold text-slate-800 text-base">Additional Profile Modules</h3>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'documents', label: 'Documents' },
              { id: 'agreements', label: 'Agreements' },
              { id: 'emi', label: 'EMI Schedule' },
              { id: 'support', label: 'Support Tickets' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === t.id
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <p className="text-xs text-slate-500 leading-relaxed">
            All property purchases and payment ledger records for {custName} are displayed above. Use the tabs to preview upcoming extensions.
          </p>
        )}

        {activeTab === 'documents' && (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <FaFolder className="text-3xl text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Document Repository Coming Soon</h4>
            <p className="text-xs text-slate-400">KYC documents, ID proofs, and plot certificates for {custName} will be stored here.</p>
          </div>
        )}

        {activeTab === 'agreements' && (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <FaFileContract className="text-3xl text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Agreements & Legal Contracts</h4>
            <p className="text-xs text-slate-400">Signed sales agreements and notary documents will be archived here.</p>
          </div>
        )}

        {activeTab === 'emi' && (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <FaClock className="text-3xl text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">EMI & Installment Schedule</h4>
            <p className="text-xs text-slate-400">Customized payment schedule and installment reminders.</p>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <FaHeadset className="text-3xl text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Customer Support & Tickets</h4>
            <p className="text-xs text-slate-400">Communication history and service tickets for {custName}.</p>
          </div>
        )}
      </div>

    </div>
  );
}
